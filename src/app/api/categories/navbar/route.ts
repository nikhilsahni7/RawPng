import { NextResponse } from "next/server";
import { Category } from "@/lib/models/category";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({
      active: true,
      showInNavbar: true,
    })
      .select("_id name type")
      .lean()
      .sort({ name: 1 });

    if (!categories || categories.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch navbar categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
