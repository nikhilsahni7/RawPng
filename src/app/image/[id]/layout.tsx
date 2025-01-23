import type { Metadata } from "next";
import { getImageDetails } from "@/lib/api/images";
import type { ImageDetails } from "@/types/image";
//eslint-disable-next-line
function generateImageSchema(imageDetails: ImageDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    name: imageDetails.title,
    description: imageDetails.description,
    contentUrl: imageDetails.cloudFrontUrl,
    thumbnailUrl: imageDetails.cloudFrontUrl,
    datePublished: imageDetails.uploadDate,
    uploadDate: imageDetails.uploadDate,
    height: imageDetails.dimensions.height,
    width: imageDetails.dimensions.width,
    author: {
      "@type": "Organization",
      name: "Rawpng",
      url: process.env.NEXT_PUBLIC_APP_URL,
    },
    license: imageDetails.license,
    keywords: imageDetails.keywords.join(", "),
    contentSize: `${(imageDetails.fileSize / (1024 * 1024)).toFixed(2)}MB`,
    encodingFormat: imageDetails.fileType,
    isFamilyFriendly: true,
    copyrightYear: new Date(imageDetails.uploadDate).getFullYear(),
    isAccessibleForFree: true,
    acquireLicensePage: `${process.env.NEXT_PUBLIC_APP_URL}/license`,
    creditText: "Rawpng - Free Stock Images",
  };
}
//eslint-disable-next-line
function generateWebPageSchema(imageDetails: ImageDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: imageDetails.title,
    description: imageDetails.description,
    datePublished: imageDetails.uploadDate,
    dateModified: imageDetails.uploadDate,
    image: imageDetails.cloudFrontUrl,
    primaryImageOfPage: {
      "@type": "ImageObject",
      contentUrl: imageDetails.cloudFrontUrl,
    },
  };
}
//eslint-disable-next-line
function generateBreadcrumbSchema(imageDetails: ImageDetails) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: imageDetails.category,
        item: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/${imageDetails.fileType.toLowerCase()}/${imageDetails.category.toLowerCase()}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: imageDetails.title,
        item: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/image/${imageDetails._id}`,
      },
    ],
  };
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

  // Generate all schemas
  const schemas = [
    generateImageSchema(imageDetails),
    generateWebPageSchema(imageDetails),
    generateBreadcrumbSchema(imageDetails),
  ];

  return {
    title: imageDetails.title,
    description: imageDetails.description,
    keywords: imageDetails.keywords,
    openGraph: {
      title: imageDetails.title,
      description: imageDetails.description,
      type: "article",
      publishedTime: imageDetails.uploadDate,
      authors: [imageDetails.author],
      images: [
        {
          url: imageDetails.cloudFrontUrl,
          width: imageDetails.dimensions.width,
          height: imageDetails.dimensions.height,
          alt: imageDetails.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: imageDetails.title,
      description: imageDetails.description,
      images: [imageDetails.cloudFrontUrl],
    },
    other: {
      "json-ld": JSON.stringify(schemas),
    },
  };
}

export default function ImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {children}
    </div>
  );
}
