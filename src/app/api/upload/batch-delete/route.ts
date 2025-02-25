import { NextRequest, NextResponse } from "next/server";
import { File as FileModel } from "@/lib/models/file";
import { connectDB } from "@/lib/db";
import { deleteFromS3 } from "@/lib/s3-upload";

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const { ids } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or empty array of IDs" },
        { status: 400 }
      );
    }

    // Get all files to access their s3Keys
    const files = await FileModel.find({ _id: { $in: ids } });

    if (files.length === 0) {
      return NextResponse.json({ error: "No files found" }, { status: 404 });
    }

    // Delete from S3
    const s3Errors = [];
    for (const file of files) {
      try {
        await deleteFromS3(file.s3Key);
      } catch (s3Error) {
        console.error(`Failed to delete ${file._id} from S3:`, s3Error);
        s3Errors.push(file._id);
      }
    }

    // Delete from MongoDB
    const deleteResult = await FileModel.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      deletedCount: deleteResult.deletedCount,
      s3Errors: s3Errors.length > 0 ? s3Errors : undefined,
    });
  } catch (error) {
    console.error("Batch delete operation failed:", error);
    return NextResponse.json(
      { error: "Failed to delete files" },
      { status: 500 }
    );
  }
}
