// app/api/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { File } from "@/lib/models/file";

// app/api/images/route.ts
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const fileType = searchParams.get("fileType") || "all";
  const query = searchParams.get("query") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);

  const limit = 30;
  const skip = (page - 1) * limit;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filters: any = {};

  if (fileType !== "all") {
    filters.fileType = fileType;
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
