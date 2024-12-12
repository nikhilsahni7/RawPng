// app/image/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadTimer } from "@/components/download-timer";
import { ImageActions } from "@/components/ImageActions";
import { DownloadIcon } from "lucide-react";

export interface ImageDetails {
  _id: string;
  title: string;
  description: string;
  cloudFrontUrl: string;
  fileType: string;
  fileSize: number;
  dimensions: {
    width: number;
    height: number;
  };
  uploadDate: string;
  downloads: number;
  keywords: string[];
  license: string;
  author: string;
}

async function getImageDetails(id: string): Promise<ImageDetails | null> {
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
      author: "by Pngly",
    };
  } catch (error) {
    console.error("Error fetching image details:", error);
    return null;
  }
}

function ImageContent({ imageDetails }: { imageDetails: ImageDetails }) {
  const formattedDate = new Date(imageDetails.uploadDate).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const aspectRatio =
    imageDetails.dimensions.width / imageDetails.dimensions.height;

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-2">
              <div
                className="relative w-full overflow-hidden rounded-lg bg-gray-100"
                style={{
                  paddingBottom: `${(1 / aspectRatio) * 100}%`,
                }}
              >
                <Image
                  src={imageDetails.cloudFrontUrl}
                  alt={imageDetails.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain"
                  priority
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <ImageActions />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <DownloadIcon className="w-5 h-5" />
              <span className="font-semibold">{imageDetails.downloads}</span>
            </div>
          </div>
        </div>

        {/* Rest of the component remains the same */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{imageDetails.title}</h1>
            <p className="mt-2 text-muted-foreground">{imageDetails.author}</p>
          </div>

          <DownloadTimer
            imageUrl={imageDetails.cloudFrontUrl}
            filename={`${imageDetails.title
              .toLowerCase()
              .replace(/ /g, "-")}.${imageDetails.fileType.toLowerCase()}`}
            imageId={imageDetails._id}
          />

          <Card>
            <CardContent className="grid gap-4 p-6">
              <div className="grid gap-2">
                <div className="font-semibold">File Details</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium">{imageDetails.fileType}</div>
                  <div className="text-muted-foreground">Size</div>
                  <div className="font-medium">
                    {`${(imageDetails.fileSize / (1024 * 1024)).toFixed(2)} MB`}
                  </div>
                  <div className="text-muted-foreground">Dimensions</div>
                  <div className="font-medium">
                    {`${imageDetails.dimensions.width} x ${imageDetails.dimensions.height} px`}
                  </div>
                  <div className="text-muted-foreground">License</div>
                  <div className="font-medium">{imageDetails.license}</div>
                  <div className="text-muted-foreground">Uploaded</div>
                  <div className="font-medium">{formattedDate}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <div className="font-semibold">Description</div>
            <p className="text-sm text-muted-foreground">
              {imageDetails.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Keywords</div>
            <div className="flex flex-wrap gap-2">
              {imageDetails.keywords.map((keyword: string) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="rounded-full px-3 py-1"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const imageDetails = await getImageDetails(params.id);

  if (!imageDetails) {
    return {
      title: "Image Not Found",
      description: "The requested image could not be found.",
    };
  }

  return {
    title: `${imageDetails.title} - Pngly`,
    description: imageDetails.description,
    keywords: imageDetails.keywords,
    openGraph: {
      title: `${imageDetails.title} - Pngly`,
      description: imageDetails.description,
      type: "article",
      publishedTime: imageDetails.uploadDate,
      authors: [imageDetails.author],
      images: [
        {
          url: `/image/${params.id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: imageDetails.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${imageDetails.title} - Pngly`,
      description: imageDetails.description,
      images: [`/image/${params.id}/opengraph-image`],
    },
  };
}

export default async function ImagePage({
  params,
}: {
  params: { id: string };
}) {
  const imageDetails = await getImageDetails(params.id);

  if (!imageDetails) {
    notFound();
  }

  return <ImageContent imageDetails={imageDetails} />;
}
