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
      // Convert hyphenated category to possible variations
      const categoryValue = category.replace(/-/g, " "); // Replace hyphens with spaces
      query.category = {
        $regex: new RegExp(`^${categoryValue}$`, "i"), // Exact match but case insensitive
      };
    }

    // Handle file type
    if (type && ["png", "vector", "image"].includes(type.toLowerCase())) {
      query.fileType = type.toLowerCase();
    }

    console.log("MongoDB Query:", query);

    // First, let's log what categories exist in the database
    const existingCategories = await File.distinct("category");
    console.log("Existing categories in DB:", existingCategories);

    const total = await File.countDocuments(query);
    const images = await File.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    console.log(`Found ${images.length} images out of ${total} total`);

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
