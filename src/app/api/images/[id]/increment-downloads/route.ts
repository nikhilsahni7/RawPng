// app/api/images/[id]/increment-downloads/route.ts
import { NextResponse, NextRequest } from "next/server";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/db";
import { File as FileModel } from "@/lib/models/file";
import { Download } from "@/lib/models/download";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await connectDB();

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    // Start a session for atomic operations
    const session = await FileModel.startSession();
    let result: typeof FileModel.prototype;

    try {
      await session.withTransaction(async () => {
        // Create download record
        await Download.create(
          [
            {
              fileId: id,
            },
          ],
          { session }
        );

        // Increment downloads counter
        const file = await FileModel.findByIdAndUpdate(
          id,
          { $inc: { downloads: 1 } },
          { new: true, session }
        );

        if (!file) {
          throw new Error("Image not found");
        }

        result = file;
      });
    } finally {
      await session.endSession();
    }

    if (!result) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    return NextResponse.json({ downloads: result.downloads });
  } catch (error) {
    console.error("Error processing download:", error);
    return NextResponse.json(
      { error: "Failed to process download" },
      { status: 500 }
    );
  }
}
