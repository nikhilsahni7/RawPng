/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/upload/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { File as FileModel } from "@/lib/models/file";
import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/category";

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

    const file = await FileModel.findByIdAndDelete(params.id);

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
