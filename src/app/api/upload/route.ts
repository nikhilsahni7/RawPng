// app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "@/lib/s3-upload";
import { File as FileModel } from "@/lib/models/file";
import { connectDB } from "@/lib/db";
import sharp from "sharp";
import { Category } from "@/lib/models/category";

// Add proper typing for uploaded file
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

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const formData = await req.formData();
    const files = formData.getAll("files");

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadedFiles = [];

    for (const file of files) {
      const f = file as unknown as UploadedFile;

      // Add more detailed logging
      console.log("Processing file:", {
        name: f.name,
        type: f.type,
        size: f.size,
      });

      if (!f.type.startsWith("image/")) {
        return NextResponse.json(
          { error: `Invalid file type: ${f.type}` },
          { status: 400 }
        );
      }

      try {
        const buffer = Buffer.from(await f.arrayBuffer());

        // Log image processing
        console.log("Processing image with Sharp");

        const imageInfo = await sharp(buffer).metadata();

        const processedBuffer = await sharp(buffer)
          .resize(2000, 2000, { fit: "inside", withoutEnlargement: true })
          .toBuffer();

        // Log S3 upload
        console.log("Uploading to S3");

        const s3Result = await uploadToS3(processedBuffer, f.name, f.type);

        // Create file document
        const category = await getCategory();

        const fileDoc = await FileModel.create({
          fileName: f.name,
          fileType: getFileType(f),
          fileSize: f.size,
          dimensions: {
            width: imageInfo?.width || 0,
            height: imageInfo?.height || 0,
          },
          ...s3Result,
          category,
          title: generateTitle(f.name),
          description: generateDescription(f.name),
          keywords: generateKeywords(f.name),
          uploadDate: new Date(),
        });

        uploadedFiles.push(fileDoc);
        console.log("File processed successfully:", fileDoc._id);
      } catch (processError) {
        console.error("Detailed processing error:", processError);
        const errorMessage =
          processError instanceof Error
            ? processError.message
            : "Unknown error";
        return NextResponse.json(
          { error: `Failed to process file: ${errorMessage}` },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, files: uploadedFiles });
  } catch (error) {
    console.error("Upload handler error:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to upload files: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// Utility functions to generate metadata
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

function getFileType(file: UploadedFile): string {
  const typeMap: { [key: string]: string } = {
    "image/png": "png",
    "image/svg+xml": "vector",
    "image/jpeg": "image",
    "image/jpg": "image",
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
