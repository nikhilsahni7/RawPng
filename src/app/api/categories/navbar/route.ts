import { NextResponse } from "next/server";
import { Category } from "@/lib/models/category";
import { connectDB } from "@/lib/db";
import { Types } from "mongoose";

// Disable Next.js caching for this route
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface CategoryDocument {
  _id: Types.ObjectId;
  name: string;
  type: "png" | "vector" | "image";
  active: boolean;
  showInNavbar: boolean;
}

export async function GET() {
  try {
    await connectDB();

    const categories = await Category.find({
      active: true,
      showInNavbar: true,
    })
      .select("_id name type active showInNavbar")
      .lean<CategoryDocument[]>()
      .sort({ name: 1 });

    // Transform the data to ensure it's serializable
    const serializedCategories = categories.map((category) => ({
      _id: category._id.toString(),
      name: category.name,
      type: category.type,
      active: Boolean(category.active),
      showInNavbar: Boolean(category.showInNavbar),
    }));

    // Add stronger cache control headers to prevent ALL caching
    const response = NextResponse.json(serializedCategories, {
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
        "Surrogate-Control": "no-store",
        Pragma: "no-cache",
        Expires: "0",
        "X-Accel-Expires": "0",
      },
    });

    return response;
  } catch (error) {
    console.error("Failed to fetch navbar categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
