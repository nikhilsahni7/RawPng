// app/api/upload/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3-upload";
import { File as FileModel } from "@/lib/models/file";
import { connectDB } from "@/lib/db";
import sharp from "sharp";
import { Category } from "@/lib/models/category";

interface UploadedFile {
  name: string;
  type: string;
  size: number;
  arrayBuffer(): Promise<ArrayBuffer>;
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

// Optimize batch processing->
const BATCH_SIZE = 25; //

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedFiles = [];
    const errors: any[] = [];

    // Process files in smaller batches
    for (let i = 0; i < files.length; i += BATCH_SIZE) {
      const batch = files.slice(i, i + BATCH_SIZE);
      const batchPromises = batch.map(async (file) => {
        const f = file as unknown as UploadedFile;

        if (!f.type.startsWith("image/")) {
          return null;
        }

        try {
          const buffer = Buffer.from(await f.arrayBuffer());
          const imageInfo = await sharp(buffer).metadata();

          // Optimize image processing based on type
          let processedBuffer;
          if (f.type === "image/svg+xml") {
            processedBuffer = buffer; // Don't process SVGs
          } else {
            processedBuffer = await sharp(buffer)
              .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
              .toBuffer();
          }

          const s3Result = await uploadToS3(processedBuffer, f.name, f.type);
          const category = await getCategory();

          // Enhanced metadata generation
          const metadata = generateMetadata(f.name, imageInfo);

          return await FileModel.create({
            fileName: f.name,
            fileType: getFileType(f),
            fileSize: f.size,
            dimensions: {
              width: imageInfo?.width || 0,
              height: imageInfo?.height || 0,
            },
            ...s3Result,
            category,
            ...metadata,
            uploadDate: new Date(),
          });
        } catch (error) {
          errors.push({
            file: f.name,
            error: error instanceof Error ? error.message : "Unknown error",
          });
          return null;
        }
      });

      const batchResults = await Promise.allSettled(batchPromises);
      const successfulUploads = batchResults
        .filter((result) => result.status === "fulfilled" && result.value)
        .map((result) => (result as PromiseFulfilledResult<any>).value);

      uploadedFiles.push(...successfulUploads);
    }

    return NextResponse.json({
      success: true,
      files: uploadedFiles,
      totalProcessed: uploadedFiles.length,
      totalAttempted: files.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json(
      {
        error: `Failed to upload files: ${error instanceof Error ? error.message : "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}

// Enhanced metadata generation
function generateMetadata(filename: string, imageInfo: sharp.Metadata) {
  // Extract folder path if exists and normalize it
  const normalizedPath = filename.replace(/\\/g, "/"); // Convert Windows paths to forward slashes
  const pathParts = normalizedPath.split("/");
  const actualFilename = pathParts[pathParts.length - 1];
  const folderPath = pathParts.slice(0, -1).join("/");

  // Clean up the base name more thoroughly
  const baseName = actualFilename
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/\d{4}-\d{2}-\d{2}/g, "") // Remove date patterns
    .replace(/screenshot\s*from/i, "") // Remove "screenshot from"
    .replace(/[_\s]{2,}/g, " "); // Replace multiple spaces/underscores with single space

  // Generate clean words with better filtering
  const words = baseName
    .split(/[-_\s]+/)
    .filter((w) => w.length > 2)
    .map((w) => w.toLowerCase())
    .filter((w) => !w.match(/^\d+$/)); // Remove pure number words

  // Add folder name to keywords if it exists
  const folderWords = folderPath
    ? folderPath
        .split("/")
        .filter(Boolean) // Remove empty strings
        .map((folder) =>
          folder
            .split(/[-_\s]+/)
            .filter((w) => w.length > 2)
            .join(" ")
        )
    : [];

  // Generate unique timestamp with milliseconds for more uniqueness
  const timestamp = new Date();
  const dateStr = timestamp.toISOString().slice(0, 10);
  const timeStr = timestamp.getTime().toString().slice(-6); // Use last 6 digits of timestamp

  // Create title with folder context
  const titlePrefix =
    folderWords.length > 0 ? `${folderWords.join(" - ")} - ` : "";
  const titleWords =
    words.length > 0
      ? words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
      : "Image";
  const title = `${titlePrefix}${titleWords} ${dateStr}-${timeStr}`;

  // Create description with better folder context
  const descriptionContext =
    folderWords.length > 0 ? ` from ${folderWords.join(" > ")}` : "";
  const description = `High-quality ${imageInfo?.format || "image"}${descriptionContext} - ${words.join(" ")}`;

  // Generate keywords including folder context
  const keywords = generateEnhancedKeywords(filename, imageInfo, folderWords);

  return { title, description, keywords };
}

function generateEnhancedKeywords(
  filename: string,
  imageInfo: sharp.Metadata,
  folderWords: string[] = []
): string[] {
  // Clean and normalize filename
  const baseWords = filename
    .replace(/\.[^/.]+$/, "")
    .split(/[-_\s]+/)
    .filter((word) => word.length > 2)
    .map((word) => word.toLowerCase());

  // Process folder keywords more thoroughly
  const folderKeywords = folderWords.flatMap((folder) =>
    folder
      .toLowerCase()
      .split(/[-_\s]+/)
      .filter((word) => word.length > 2)
  );

  // Format-specific keywords
  const formatKeywords = {
    png: ["transparent background", "png", "digital art", "clipart"],
    svg: ["vector", "scalable", "svg", "illustration", "graphic"],
    jpeg: ["photo", "photography", "high-quality", "image"],
    jpg: ["photo", "photography", "high-quality", "image"],
    webp: ["web optimized", "modern format", "image"],
  };

  const format = imageInfo?.format as keyof typeof formatKeywords;
  const formatSpecificKeywords = formatKeywords[format] || [];

  // Add dimension-based keywords
  const dimensionKeywords = [];
  if (imageInfo?.width && imageInfo?.height) {
    if (imageInfo.width >= 2000 || imageInfo.height >= 2000) {
      dimensionKeywords.push("high-resolution", "4k", "hd", "large");
    }
    // Add aspect ratio keywords
    const ratio = imageInfo.width / imageInfo.height;
    if (ratio > 1.7) dimensionKeywords.push("widescreen", "panoramic");
    else if (ratio < 0.7) dimensionKeywords.push("portrait", "vertical");
    else dimensionKeywords.push("standard", "square");
  }

  // Combine all keywords and remove duplicates
  return [
    ...new Set(
      [
        ...baseWords,
        ...folderKeywords,
        ...formatSpecificKeywords,
        ...dimensionKeywords,
        "free",
        "download",
        "stock",
        // Add folder-specific compound keywords
        ...folderKeywords.map((word) => `${word} content`),
        ...folderKeywords.map((word) => `${word} image`),
        // Add base word compound keywords
        ...baseWords.map((word) => `${word} background`),
        ...baseWords.map((word) => `${word} illustration`),
      ].filter(Boolean)
    ),
  ];
}

// Enhanced file type detection
function getFileType(file: UploadedFile): string {
  const typeMap: { [key: string]: string } = {
    "image/png": "png",
    "image/svg+xml": "vector",
    "image/jpeg": "image",
    "image/jpg": "image",
    "image/gif": "image",
    "image/webp": "image",
  };
  return typeMap[file.type] || "image";
}

export async function GET() {
  try {
    await connectDB();
    const files = await FileModel.find().sort({ uploadDate: -1 });
    return NextResponse.json(files);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
