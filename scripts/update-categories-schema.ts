import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/category";

async function updateCategories() {
  await connectDB();

  try {
    // Update all existing categories to include the new fields
    const result = await Category.updateMany(
      { type: { $exists: false } }, // Find documents without type field
      {
        $set: {
          type: "png", // Default type
          showInNavbar: false, // Default showInNavbar value
          active: true, // Ensure active field exists
        },
      }
    );

    console.log(`Updated ${result.modifiedCount} categories`);
    process.exit(0);
  } catch (error) {
    console.error("Error updating categories:", error);
    process.exit(1);
  }
}

updateCategories().catch(console.error);
