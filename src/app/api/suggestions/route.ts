import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { File } from "@/lib/models/file";
//api/suggestions - to fetch suggestions based on search query
export async function GET(req: NextRequest) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  const suggestions = await File.find({
    title: { $regex: query, $options: "i" },
  })
    .limit(5)
    .select("title -_id");

  const suggestionTitles = suggestions.map((file) => file.title);

  return NextResponse.json({ suggestions: suggestionTitles });
}
