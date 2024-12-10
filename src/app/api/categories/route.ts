import { NextResponse } from "next/server";
import { CATEGORIES } from "@/lib/models/file";

export async function GET() {
  const topCategories = CATEGORIES.slice(0, 10);
  return NextResponse.json({
    categories: topCategories,
  });
}
