import { NextRequest, NextResponse } from "next/server";
import { File as FileModel } from "@/lib/models/file";
import { connectDB } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3-upload";
import { Client } from "basic-ftp";
import sharp from "sharp";
import path from "path";
import { Category } from "@/lib/models/category";
import { Writable } from "stream";

interface FTPConfig {
  host: string;
  user: string;
  password: string;
  path: string;
}

async function getCategory(): Promise<string> {
  try {
    const defaultCategory = await Category.findOne({ active: true });
    return defaultCategory?.name || "Uncategorized";
  } catch (error) {
    console.error("Error fetching default category:", error);
    return "Uncategorized";
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const ftpConfig: FTPConfig = await req.json();

    if (!ftpConfig.host || !ftpConfig.user || !ftpConfig.password) {
      return NextResponse.json(
        { error: "Missing FTP configuration" },
        { status: 400 }
      );
    }

    const client = new Client();
    client.ftp.verbose = true;

    try {
      await client.access({
        host: ftpConfig.host,
        user: ftpConfig.user,
        password: ftpConfig.password,
        secure: false,
      });

      const files = [];
      const ftpFiles = await client.list(ftpConfig.path);

      for (const ftpFile of ftpFiles) {
        if (!ftpFile.isFile) continue;

        try {
          // Create a temporary file buffer
          const chunks: Buffer[] = [];
          await client.downloadTo(
            new Writable({
              write(
                chunk: Buffer,
                encoding: BufferEncoding,
                callback: (error?: Error | null) => void
              ): void {
                chunks.push(Buffer.from(chunk));
                callback();
              },
            }),
            path.join(ftpConfig.path, ftpFile.name)
          );

          const fileBuffer = Buffer.concat(chunks);
          const fileName = ftpFile.name;
          const mimeType = getMimeType(fileName);

          if (!mimeType.startsWith("image/")) {
            console.log(`Skipping non-image file: ${fileName}`);
            continue;
          }

          // Process image
          console.log("Processing image with Sharp");
          const imageInfo = await sharp(fileBuffer).metadata();

          const processedBuffer = await sharp(fileBuffer)
            .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
            .toBuffer();

          // Upload to S3
          console.log("Uploading to S3");
          const s3Result = await uploadToS3(
            processedBuffer,
            fileName,
            mimeType
          );

          // Get category
          const category = await getCategory();

          const fileDoc = await FileModel.create({
            fileName: fileName,
            fileType: getFileType(mimeType),
            fileSize: fileBuffer.length,
            dimensions: {
              width: imageInfo?.width || 0,
              height: imageInfo?.height || 0,
            },
            ...s3Result,
            category,
            title: generateTitle(fileName),
            description: generateDescription(fileName),
            keywords: generateKeywords(fileName),
            uploadDate: new Date(),
          });

          files.push(fileDoc);
          console.log("File processed successfully:", fileDoc._id);
        } catch (fileError: unknown) {
          console.error(`Error processing file ${ftpFile.name}:`, fileError);
          continue;
        }
      }

      return NextResponse.json({ success: true, files });
    } finally {
      client.close();
    }
  } catch (error: unknown) {
    console.error("FTP upload handler error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to process FTP upload";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

function getMimeType(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase() || "";
  const mimeTypes: { [key: string]: string } = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    svg: "image/svg+xml",
    gif: "image/gif",
    webp: "image/webp",
  };
  return mimeTypes[extension] || "image/jpeg";
}

function getFileType(mimeType: string): string {
  const typeMap: { [key: string]: string } = {
    "image/png": "png",
    "image/svg+xml": "vector",
    "image/jpeg": "image",
    "image/jpg": "image",
    "image/gif": "image",
    "image/webp": "image",
  };
  return typeMap[mimeType] || "image";
}

function generateKeywords(filename: string): string[] {
  const words = filename
    .replace(/\.[^/.]+$/, "")
    .split(/[-_\s]+/)
    .filter((word) => word.length > 2)
    .map((word) => word.toLowerCase());
  const additionalKeywords = ["digital", "media", "content"];
  return [...new Set([...words, ...additionalKeywords])];
}

function generateTitle(filename: string): string {
  return filename.replace(/\.[^/.]+$/, "");
}

function generateDescription(filename: string): string {
  return `An image titled ${generateTitle(filename)}.`;
}
