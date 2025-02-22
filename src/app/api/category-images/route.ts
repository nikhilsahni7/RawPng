import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { File } from "@/lib/models/file";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = 12;

    console.log("Received params:", { type, category, page });

    await connectDB();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query: Record<string, any> = {};

    // Handle category matching
    if (category) {
      const categoryValue = category.replace(/-/g, " ");
      query.category = {
        $regex: new RegExp(`^${categoryValue}$`, "i"),
      };
    }

    // Handle file type
    if (type) {
      const normalizedType = type.toLowerCase();
      if (normalizedType === "image") {
        // For "image" type, we'll match files that are not PNG or vector
        query.fileType = { $nin: ["png", "vector"] };
      } else if (["png", "vector"].includes(normalizedType)) {
        // For PNG and vector types, exact match
        query.fileType = normalizedType;
      }
    }

    console.log("MongoDB Query:", query);

    const total = await File.countDocuments(query);
    const images = await File.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    console.log(`Found ${images.length} images out of ${total} total`);

    if (images.length === 0) {
      return NextResponse.json(
        {
          error: `No ${type}s found in the ${category} category`,
          images: [],
          totalPages: 0,
          currentPage: page,
          total: 0,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      images,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error in category-images API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
