import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3-upload";
import { File as FileModel } from "@/lib/models/file";
import { Category } from "@/lib/models/category";
import sharp from "sharp";
import Client from "ssh2-sftp-client";

interface SFTPCredentials {
  host: string;
  port: string;
  username: string;
  password: string;
  remotePath: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const credentials: SFTPCredentials = await req.json();

    const sftp = new Client();
    const files = [];

    try {
      await sftp.connect({
        host: credentials.host,
        port: parseInt(credentials.port),
        username: credentials.username,
        password: credentials.password,
      });

      const fileList = await sftp.list(credentials.remotePath);
      const imageFiles = fileList.filter((file) => {
        const ext = file.name.toLowerCase();
        return (
          ext.endsWith(".jpg") ||
          ext.endsWith(".jpeg") ||
          ext.endsWith(".png") ||
          ext.endsWith(".gif") ||
          ext.endsWith(".webp")
        );
      });

      for (const file of imageFiles) {
        const remoteFilePath = `${credentials.remotePath}/${file.name}`;
        const buffer = (await sftp.get(remoteFilePath, undefined, {
          readStreamOptions: {
            encoding: null,
          },
        })) as Buffer;

        if (!Buffer.isBuffer(buffer)) {
          throw new Error("Failed to get file as buffer");
        }

        // Process image with Sharp
        const imageInfo = await sharp(buffer).metadata();
        const processedBuffer = await sharp(buffer)
          .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
          .toBuffer();

        // Upload to S3
        const s3Result = await uploadToS3(
          processedBuffer,
          file.name,
          getMimeType(file.name)
        );

        // Get default category
        const defaultCategory = await Category.findOne({ active: true });
        const category = defaultCategory?.name || "Uncategorized";

        // Create file document
        const fileDoc = await FileModel.create({
          fileName: file.name,
          fileType: getFileType(getMimeType(file.name)),
          fileSize: file.size,
          dimensions: {
            width: imageInfo?.width || 0,
            height: imageInfo?.height || 0,
          },
          ...s3Result,
          category,
          title: generateTitle(file.name),
          description: generateDescription(file.name),
          keywords: generateKeywords(file.name),
          uploadDate: new Date(),
        });

        files.push(fileDoc);
      }

      await sftp.end();
      return NextResponse.json({ success: true, files });
    } catch (error) {
      console.error("SFTP operation failed:", error);
      throw error;
    }
  } catch (error) {
    console.error("SFTP upload handler error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process SFTP upload";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// Utility functions (same as in CSV upload)
function getMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const mimeTypes: { [key: string]: string } = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[extension] || "image/jpeg";
}

function getFileType(mimeType: string): string {
  const typeMap: { [key: string]: string } = {
    "image/png": "png",
    "image/jpeg": "image",
    "image/jpg": "image",
    "image/gif": "image",
    "image/webp": "image",
  };
  return typeMap[mimeType] || "image";
}

function generateKeywords(fileName: string): string[] {
  const words = fileName
    .replace(/\.[^/.]+$/, "")
    .split(/[-_\s]+/)
    .filter((word) => word.length > 2)
    .map((word) => word.toLowerCase());

  const additionalKeywords = ["digital", "media", "content"];
  return [...new Set([...words, ...additionalKeywords])];
}

function generateTitle(fileName: string): string {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
}

function generateDescription(fileName: string): string {
  return `An image titled ${generateTitle(fileName)}.`;
}
