/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/upload/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { File as FileModel } from "@/lib/models/file";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/category";
import { deleteFromS3 } from "@/lib/s3-upload";

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const data = await request.json();

    // Validate category if it's being updated
    if (data.category) {
      const categoryExists = await Category.findOne({
        name: data.category,
        active: true,
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: "Invalid category" },
          { status: 400 }
        );
      }
    }

    const updatedFile = await FileModel.findByIdAndUpdate(
      params.id,
      { $set: data },
      { new: true }
    );

    if (!updatedFile) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(updatedFile);
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Failed to update file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    await connectDB();

    // First, get the file to access the s3Key
    const file = await FileModel.findById(params.id);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from S3
    try {
      await deleteFromS3(file.s3Key);
    } catch (s3Error) {
      console.error("Failed to delete from S3:", s3Error);
      return NextResponse.json(
        { error: "Failed to delete file from storage" },
        { status: 500 }
      );
    }

    // Delete from MongoDB
    await file.deleteOne();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete operation failed:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
