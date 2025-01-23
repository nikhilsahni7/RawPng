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
  const baseName = filename.replace(/\.[^/.]+$/, "");
  const words = baseName.split(/[-_\s]+/).filter((w) => w.length > 2);

  const title = words
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  const description = `High-quality ${imageInfo?.format || "image"} of ${title}`;

  // Enhanced keyword generation
  const keywords = generateEnhancedKeywords(filename, imageInfo);

  return { title, description, keywords };
}

function generateEnhancedKeywords(
  filename: string,
  imageInfo: sharp.Metadata
): string[] {
  // Clean and normalize filename
  const baseWords = filename
    .replace(/\.[^/.]+$/, "")
    .split(/[-_\s]+/)
    .filter((word) => word.length > 2)
    .map((word) => word.toLowerCase());

  // Format-specific keywords
  const formatKeywords = {
    png: ["transparent background", "png", "digital art", "clipart"],
    svg: ["vector", "scalable", "svg", "illustration", "graphic"],
    jpeg: ["photo", "photography", "high-quality", "image"],
  };

  const format = imageInfo?.format as keyof typeof formatKeywords;
  const formatSpecificKeywords = formatKeywords[format] || [];

  // Add dimension-based keywords
  const dimensionKeywords = [];
  if (imageInfo?.width && imageInfo?.height) {
    if (imageInfo.width >= 2000 || imageInfo.height >= 2000) {
      dimensionKeywords.push("high-resolution", "4k", "hd", "large");
    }
  }

  // Combine all keywords and remove duplicates
  return [
    ...new Set(
      [
        ...baseWords,
        ...formatSpecificKeywords,
        ...dimensionKeywords,
        "free",
        "download",
        "stock",
        baseWords.length > 0 ? `${baseWords[0]} background` : "",
        baseWords.length > 0 ? `${baseWords[0]} illustration` : "",
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
