// app/image/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadButton } from "@/components/download-timer";
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
                <DownloadButton
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

  const seoDescription = `Download this ${imageDetails.fileType.toUpperCase()} image of ${imageDetails.title} (${imageDetails.dimensions.width}x${imageDetails.dimensions.height}px). ${imageDetails.description}. Free for commercial use.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemPage",
    name: imageDetails.title,
    description: seoDescription,
    mainEntity: {
      "@type": "ImageObject",
      contentUrl: imageDetails.cloudFrontUrl,
      thumbnailUrl: imageDetails.cloudFrontUrl,
      name: imageDetails.title,
      description: imageDetails.description,
      uploadDate: imageDetails.uploadDate,
      height: imageDetails.dimensions.height,
      width: imageDetails.dimensions.width,
      encodingFormat: imageDetails.fileType.toUpperCase(),
      license: "https://creativecommons.org/licenses/by/4.0/",
      acquireLicensePage: `${process.env.NEXT_PUBLIC_APP_URL}/license`,
      creditText: "Rawpng",
      keywords: imageDetails.keywords.join(", "),
      creator: {
        "@type": "Organization",
        name: "Rawpng",
        url: process.env.NEXT_PUBLIC_APP_URL,
      },
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": process.env.NEXT_PUBLIC_APP_URL,
            name: "Home",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": `${process.env.NEXT_PUBLIC_APP_URL}/${imageDetails.fileType.toLowerCase()}/${imageDetails.category.toLowerCase()}`,
            name: imageDetails.category,
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": `${process.env.NEXT_PUBLIC_APP_URL}/image-details/${params.id}`,
            name: imageDetails.title,
          },
        },
      ],
    },
  };

  return {
    title: `${imageDetails.title} - Download Free ${imageDetails.fileType.toUpperCase()} | rawpng`,
    description: seoDescription,
    keywords: [
      ...imageDetails.keywords,
      `free ${imageDetails.fileType}`,
      "download",
      "transparent background",
      imageDetails.category,
    ],
    openGraph: {
      title: `${imageDetails.title} - Free ${imageDetails.fileType.toUpperCase()} Download`,
      description: seoDescription,
      type: "article",
      images: [
        {
          url: imageDetails.cloudFrontUrl,
          width: imageDetails.dimensions.width,
          height: imageDetails.dimensions.height,
          alt: imageDetails.title,
        },
      ],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/image-details/${params.id}`,
    },
    other: {
      "json-ld": JSON.stringify(structuredData),
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
