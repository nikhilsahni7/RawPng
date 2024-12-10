import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { File } from "@/lib/models/file";

export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  if (!query) {
    return NextResponse.json({ suggestions: [] });
  }

  const suggestions = await File.aggregate([
    {
      $search: {
        index: "default",
        autocomplete: {
          query: query,
          path: "title",
          fuzzy: {
            maxEdits: 2,
          },
        },
      },
    },
    { $limit: 10 },
    { $project: { _id: 0, title: 1 } },
  ]);

  return NextResponse.json({ suggestions: suggestions.map((s) => s.title) });
}
