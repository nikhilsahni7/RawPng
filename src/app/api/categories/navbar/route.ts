import { NextResponse } from "next/server";
import { Category } from "@/lib/models/category";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();

    // First, let's check all categories
    const allCategories = await Category.find({}).lean();
    console.log("All categories:", allCategories);

    // Then check our filtered categories
    const categories = await Category.find({
      active: true,
      showInNavbar: true,
    })
      .select("_id name type")
      .lean()
      .sort({ name: 1 });

    console.log("Filtered categories:", categories);
    console.log("All categories:", allCategories);

    // Add validation for required fields
    const validCategories = categories.filter(
      (cat) =>
        cat._id && cat.name && ["png", "vector", "image"].includes(cat.type)
    );

    if (!validCategories || validCategories.length === 0) {
      console.log(
        "No valid categories found. Please check if categories exist with:"
      );
      console.log("1. active: true");
      console.log("2. showInNavbar: true");
      console.log("3. type is one of: png, vector, image");
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(validCategories);
  } catch (error) {
    console.error("Failed to fetch navbar categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
