// app/api/downloads/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Download } from "@/lib/models/download";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const timeRange = searchParams.get("timeRange") || "year";
  const now = new Date();
  const startDate = new Date();

  switch (timeRange) {
    case "year":
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    case "6months":
      startDate.setMonth(now.getMonth() - 6);
      break;
    case "3months":
      startDate.setMonth(now.getMonth() - 3);
      break;
    default:
      return NextResponse.json(
        { error: "Invalid time range" },
        { status: 400 }
      );
  }

  try {
    // Get monthly downloads
    const downloadsData = await Download.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: now },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          downloads: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    // Fill in missing months with zero downloads
    const months = [];
    const currentDate = new Date(startDate);
    while (currentDate <= now) {
      const existingData = downloadsData.find(
        (d) =>
          d._id.year === currentDate.getFullYear() &&
          d._id.month === currentDate.getMonth() + 1
      );

      months.push({
        month: currentDate.toLocaleString("default", { month: "short" }),
        downloads: existingData ? existingData.downloads : 0,
      });

      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    // Get total downloads
    const totalDownloads = await Download.countDocuments({
      createdAt: { $gte: startDate, $lte: now },
    });

    return NextResponse.json({
      data: months,
      totalDownloads,
    });
    //eslint-disable-next-line
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch downloads data" },
      { status: 500 }
    );
  }
}
