/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { File as FileModel } from "@/lib/models/file";
import { connectDB } from "@/lib/db";
import { uploadToS3 } from "@/lib/s3-upload";
import Papa from "papaparse";
import fs from "fs/promises";
import path from "path";
import sharp from "sharp";

interface CSVRow {
  filePath: string;
  category?: string;
  title?: string;
  description?: string;
  keywords?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No CSV file provided" },
        { status: 400 }
      );
    }

    const text = await file.text();

    return new Promise<NextResponse>((resolve) => {
      Papa.parse<CSVRow>(text, {
        header: true,
        skipEmptyLines: true,
        complete: async (results) => {
          try {
            const files = [];
            for (const row of results.data) {
              try {
                // Read the local file
                const filePath = row.filePath;
                const fileBuffer = await fs.readFile(filePath);
                const fileName = path.basename(filePath);
                const mimeType = getMimeType(fileName);
                const fileType = getFileType(mimeType);

                // Get image dimensions using sharp
                const imageInfo = await sharp(fileBuffer).metadata();

                // Upload to S3
                const s3Result = await uploadToS3(
                  fileBuffer,
                  fileName,
                  mimeType
                );

                const keywords = row.keywords
                  ? row.keywords.split(";").map((k: string) => k.trim())
                  : generateKeywords(fileName);

                const fileDoc = await FileModel.create({
                  fileName: fileName,
                  fileType: fileType,
                  fileSize: fileBuffer.length,
                  s3Key: s3Result.s3Key,
                  s3Url: s3Result.s3Url,
                  cloudFrontUrl: s3Result.cloudFrontUrl,
                  category: row.category || "Uncategorized",
                  title: row.title || fileName,
                  description: row.description || "",
                  keywords: keywords,
                  dimensions: {
                    width: imageInfo?.width || 0,
                    height: imageInfo?.height || 0,
                  },
                  downloads: 0,
                });

                files.push(fileDoc);
              } catch (fileError: unknown) {
                console.error(
                  `Error processing file ${row.filePath}:`,
                  fileError
                );
                continue;
              }
            }

            resolve(NextResponse.json({ success: true, files }));
          } catch (error: unknown) {
            console.error("CSV processing error:", error);
            resolve(
              NextResponse.json(
                { error: "Failed to process CSV file" },
                { status: 500 }
              )
            );
          }
        },

        error: (error: Error) => {
          console.error("CSV parsing error:", error);
          resolve(
            NextResponse.json(
              { error: `Failed to parse CSV file: ${error.message}` },
              { status: 400 }
            )
          );
        },
      });
    });
  } catch (error: unknown) {
    console.error("CSV upload handler error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to upload CSV file";
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

function generateKeywords(fileName: string): string[] {
  const words = fileName
    .replace(/\.[^/.]+$/, "")
    .split(/[-_\s]+/)
    .filter((word) => word.length > 2)
    .map((word) => word.toLowerCase());

  const additionalKeywords = ["digital", "media", "content"];
  return [...new Set([...words, ...additionalKeywords])];
}
