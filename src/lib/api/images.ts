import { ImageDetails } from "@/types/image";

export async function getImageDetails(
  id: string
): Promise<ImageDetails | null> {
  if (!process.env.NEXT_PUBLIC_API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/images/${id}`,
      {
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res || !res.ok) {
      console.error("Fetch response invalid or not ok");
      return null;
    }
    const data = await res.json();

    return {
      ...data,
      license: "Standard License",
      author: "by rawpng",
    };
  } catch (error) {
    console.error("Error fetching image details:", error);
    return null;
  }
}

export function generateImageUrl(image: ImageDetails): string {
  if (!image || !image.title || !image._id) {
    console.error("Invalid image data for URL generation", image);
    return "/";
  }

  const titleSlug = image.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  return `/image-details/${titleSlug}-${image._id}`;
}
