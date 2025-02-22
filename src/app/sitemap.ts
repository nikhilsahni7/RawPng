import { MetadataRoute } from "next";
import { connectDB } from "@/lib/db";
import { File } from "@/lib/models/file";
import { Category } from "@/lib/models/category";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const images = await File.find(
    {},
    {
      _id: 1,
      updatedAt: 1,
      title: 1,
      cloudFrontUrl: 1,
      category: 1,
    }
  ).lean();

  // Get all categories
  const categories = await Category.find({ active: true }).lean();

  const imageUrls = images.map((image) => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/image-details/${image._id}`,
    lastModified: image.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: [
      {
        loc: image.cloudFrontUrl,
        title: image.title,
        caption: `Free ${image.category} image on Rawpng`,
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
    ],
  }));

  const categoryUrls = categories.map((category) => ({
    url: `${process.env.NEXT_PUBLIC_APP_URL}/${category.type.toLowerCase()}/${category.name.toLowerCase().replace(/ /g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [
    {
      url: process.env.NEXT_PUBLIC_APP_URL!,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...imageUrls,
    ...categoryUrls,
  ];
}
