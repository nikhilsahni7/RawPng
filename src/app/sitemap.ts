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

  // Filter out any images that might have dashboard routes
  const imageUrls = images
    .filter((image) => !String(image._id).includes("dashboard"))
    .map((image) => ({
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

  // Filter out any categories that might be dashboard related
  const categoryUrls = categories
    .filter(
      (category) =>
        category.name.toLowerCase() !== "dashboard" &&
        !category.type.toLowerCase().includes("dashboard")
    )
    .map((category) => ({
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${category.type.toLowerCase()}/${category.name.toLowerCase().replace(/ /g, "-")}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  // Add static routes but exclude dashboard routes
  const staticRoutes = [
    {
      url: process.env.NEXT_PUBLIC_APP_URL!,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/license`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/terms-conditions`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // Add other public routes as needed
  ];

  // Filter out any API routes or admin/dashboard routes from the final sitemap
  const allRoutes = [...staticRoutes, ...imageUrls, ...categoryUrls];
  return allRoutes.filter((route) => {
    const url = route.url.toLowerCase();
    return (
      !url.includes("/dashboard/") &&
      !url.includes("/dashboard") &&
      !url.includes("/api/") &&
      !url.includes("/login") &&
      !url.includes("/signin") &&
      !url.includes("/signup") &&
      !url.includes("/verify-email")
    );
  });
}
