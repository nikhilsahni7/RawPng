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
