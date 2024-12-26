import { connectDB } from "@/lib/db";
import { Category } from "@/lib/models/category";

const INITIAL_CATEGORIES = [
  { name: "Animals", type: "png", showInNavbar: false },
  { name: "Buildings and Architecture", type: "png", showInNavbar: false },
  { name: "Business", type: "vector", showInNavbar: false },
  { name: "Drinks", type: "png", showInNavbar: false },
  { name: "The Environment", type: "image", showInNavbar: false },
  { name: "States of Mind", type: "vector", showInNavbar: false },
  { name: "Food", type: "png", showInNavbar: false },
  { name: "Graphic Resources", type: "vector", showInNavbar: false },
  { name: "Hobbies and Leisure", type: "image", showInNavbar: false },
  { name: "Industry", type: "png", showInNavbar: false },
  { name: "Landscapes", type: "image", showInNavbar: false },
  { name: "Lifestyle", type: "image", showInNavbar: false },
  { name: "People", type: "png", showInNavbar: false },
  { name: "Plants and Flowers", type: "png", showInNavbar: false },
  { name: "Culture and Religion", type: "image", showInNavbar: false },
  { name: "Science", type: "vector", showInNavbar: false },
  { name: "Social Issues", type: "image", showInNavbar: false },
  { name: "Sports", type: "png", showInNavbar: false },
  { name: "Technology", type: "vector", showInNavbar: false },
  { name: "Transport", type: "png", showInNavbar: false },
  { name: "Travel", type: "image", showInNavbar: false },
];

async function seedCategories() {
  await connectDB();

  for (const category of INITIAL_CATEGORIES) {
    await Category.findOneAndUpdate(
      { name: category.name },
      {
        name: category.name,
        type: category.type,
        showInNavbar: category.showInNavbar,
        active: true,
      },
      { upsert: true }
    );
  }

  console.log("Categories seeded successfully");
  process.exit(0);
}

seedCategories().catch(console.error);
