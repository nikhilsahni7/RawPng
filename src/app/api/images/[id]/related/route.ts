// app/api/images/[id]/related/route.ts
import { File } from "@/lib/models/file";
import { connectDB } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    if (!mongoose.isValidObjectId(params.id)) {
      return NextResponse.json(
        { error: "Invalid image ID format" },
        { status: 400 }
      );
    }

    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = 50;
    const skip = (page - 1) * limit;

    const sourceImage = await File.findById(params.id);
    if (!sourceImage) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    // Basic search query without complex text search
    const searchQuery = {
      _id: { $ne: new mongoose.Types.ObjectId(params.id) },
      $or: [
        { category: sourceImage.category },
        { keywords: { $in: sourceImage.keywords || [] } },
        {
          title: {
            $regex: sourceImage.title.split(/[\s-]+/)[0],
            $options: "i",
          },
        },
      ],
    };

    // Simple aggregation pipeline
    const aggregationPipeline = [
      { $match: searchQuery },
      {
        $addFields: {
          relevanceScore: {
            $sum: [
              { $cond: [{ $eq: ["$category", sourceImage.category] }, 2, 0] },
              {
                $size: {
                  $setIntersection: [
                    { $ifNull: ["$keywords", []] },
                    { $ifNull: [sourceImage.keywords, []] },
                  ],
                },
              },
            ],
          },
        },
      },
      { $sort: { relevanceScore: -1 as 1 | -1, downloads: -1 as 1 | -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          title: 1,
          cloudFrontUrl: 1,
          dimensions: 1,
          category: 1,
        },
      },
    ];

    const [relatedImages, totalCount] = await Promise.all([
      File.aggregate(aggregationPipeline),
      File.countDocuments(searchQuery),
    ]);

    return NextResponse.json({
      images: relatedImages,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching related images:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
