import { NextResponse } from "next/server";
import { Category } from "@/lib/models/category";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    console.log("Starting category fetch...");

    // Test DB connection
    await connectDB();
    console.log("Database connected successfully");

    // First query without any filters to check if we can get any data
    const rawCategories = await Category.find({}).lean();
    console.log("Raw categories from DB:", rawCategories);

    // Query with filters
    const categories = await Category.find({
      active: true,
      showInNavbar: true,
    })
      .select("_id name type")
      .lean();

    console.log("Filtered categories:", categories);

    // Log the validation process
    const validCategories = categories.filter((cat) => {
      const isValid =
        cat._id && cat.name && ["png", "vector", "image"].includes(cat.type);
      console.log(`Validating category:`, {
        category: cat,
        isValid,
        hasId: !!cat._id,
        hasName: !!cat.name,
        hasValidType: ["png", "vector", "image"].includes(cat.type),
      });
      return isValid;
    });

    console.log("Valid categories after filtering:", validCategories);

    if (!validCategories || validCategories.length === 0) {
      console.log("No valid categories found. Current filters:", {
        active: true,
        showInNavbar: true,
        requiredFields: ["_id", "name", "type"],
        validTypes: ["png", "vector", "image"],
      });
      return NextResponse.json([], { status: 200 });
    }

    // Log the final response
    console.log("Sending response with categories:", validCategories);
    return NextResponse.json(validCategories);
  } catch (error) {
    console.error("Failed to fetch navbar categories. Error:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
