// app/api/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { File } from "@/lib/models/file";

export const dynamic = "force-dynamic";

// app/api/images/route.ts
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const fileType = searchParams.get("fileType") || "all";
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const limit = 100;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {};

  if (fileType !== "all") {
    switch (fileType) {
      case "png":
        filters.fileType = "png";
        break;
      case "vector":
        filters.fileType = "vector";
        break;
      case "image":
        filters.fileType = "image";
        break;
    }
  }

  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { keywords: { $regex: query, $options: "i" } },
    ];
  }

  if (category) {
    filters.category = category;
  }

  const total = await File.countDocuments(filters);
  const totalPages = Math.ceil(total / limit);

  const images = await File.find(filters)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  return NextResponse.json({ images, totalPages });
}
