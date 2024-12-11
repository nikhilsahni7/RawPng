/* eslint-disable @typescript-eslint/no-unused-vars */
// app/api/upload/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { File } from "@/lib/models/file";
import { connectDB } from "@/lib/db";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { params } = context;
  try {
    await connectDB();

    const updates = await req.json();
    const file = await File.findByIdAndUpdate(
      params.id,
      { ...updates },
      { new: true }
    );

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(file);
  } catch (error) {
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

    const file = await File.findByIdAndDelete(params.id);

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
