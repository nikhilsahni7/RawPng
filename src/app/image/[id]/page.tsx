// app/image/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadTimer } from "@/components/download-timer";
import { ImageActions } from "@/components/ImageActions";

import RelatedImages from "@/components/related-images";
import { MainNav } from "@/components/home/main-nav";
import { MobileNav } from "@/components/home/mobile-nav";
import Link from "next/link";
import ExpandableDescription from "@/components/ExpandableDescription";
import ExpandableKeywords from "@/components/ExpandableKeywords";

export interface ImageDetails {
  _id: string;
  title: string;
  description: string;
  category: string;
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
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="flex items-center gap-2 mr-6">
            <Image
              src="/logo.svg"
              alt="Pngly"
              width={120}
              height={40}
              className="rounded-md"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <MainNav />

          {/* Mobile Navigation */}
          <div className="md:hidden ml-auto">
            <MobileNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto py-8 px-4 flex-1">
        <div className="space-y-6 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold break-words">
            {imageDetails.title}
          </h1>
          <p className="text-muted-foreground">{imageDetails.author}</p>
        </div>

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

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4">
                <ImageActions />
                <DownloadTimer
                  imageUrl={imageDetails.cloudFrontUrl}
                  filename={`${imageDetails.title
                    .toLowerCase()
                    .replace(
                      / /g,
                      "-"
                    )}.${imageDetails.fileType.toLowerCase()}`}
                  imageId={imageDetails._id}
                />
              </div>

              <div className="space-y-2">
                <div className="font-semibold">Description</div>
                <ExpandableDescription description={imageDetails.description} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="grid gap-4 p-6">
                <div className="grid gap-2">
                  <div className="font-semibold">File Details</div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-muted-foreground">Type</div>
                    <div className="font-medium">{imageDetails.fileType}</div>
                    <div className="text-muted-foreground">Size</div>
                    <div className="font-medium">
                      {`${(imageDetails.fileSize / (1024 * 1024)).toFixed(
                        2
                      )} MB`}
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
              <div className="font-semibold">Category</div>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {imageDetails.category}
              </Badge>
            </div>

            <div className="space-y-2">
              <div className="font-semibold">Keywords</div>
              <ExpandableKeywords keywords={imageDetails.keywords} />
            </div>
          </div>
        </div>
        <RelatedImages imageId={imageDetails._id} />
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
