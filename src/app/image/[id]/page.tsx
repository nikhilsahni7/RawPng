// app/image/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadTimer } from "@/components/download-timer";
import { ImageActions } from "@/components/ImageActions";

import RelatedImages from "@/components/related-images";
import ExpandableDescription from "@/components/ExpandableDescription";
import ExpandableKeywords from "@/components/ExpandableKeywords";
import { Header } from "@/components/layout/header";
import { getImageDetails } from "@/lib/api/images";
import type { ImageDetails } from "@/types/image";

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
      <Header />

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold break-words">
            {imageDetails.title}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          <div className="flex-[2] flex flex-col gap-8">
            <Card className="overflow-hidden shadow-md">
              <CardContent className="p-6">
                <div
                  className="relative w-full rounded-lg bg-secondary/30"
                  style={{
                    paddingBottom: `${(1 / aspectRatio) * 100}%`,
                  }}
                >
                  <Image
                    src={imageDetails.cloudFrontUrl}
                    alt={imageDetails.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-contain p-2"
                    priority
                  />
                </div>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <div className="flex items-center justify-between gap-4 flex-wrap bg-card p-4 rounded-lg shadow-sm">
                <ImageActions />
                <DownloadTimer
                  imageUrl={imageDetails.cloudFrontUrl}
                  filename={`${imageDetails.title.toLowerCase().replace(/ /g, "-")}.${imageDetails.fileType.toLowerCase()}`}
                  imageId={imageDetails._id}
                />
              </div>

              <div className="space-y-4 bg-card p-6 rounded-lg shadow-sm">
                <h2 className="font-semibold text-lg">Description</h2>
                <ExpandableDescription description={imageDetails.description} />
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-8 lg:sticky lg:top-8">
            <Card>
              <CardContent className="grid gap-6 p-6">
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

        <div className="mt-12">
          <RelatedImages imageId={imageDetails._id} />
        </div>
      </main>
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
    title: `${imageDetails.title} - rawpng`,
    description: imageDetails.description,
    keywords: imageDetails.keywords,
    openGraph: {
      title: `${imageDetails.title} - rawpng`,
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
      title: `${imageDetails.title} - rawpng`,
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
