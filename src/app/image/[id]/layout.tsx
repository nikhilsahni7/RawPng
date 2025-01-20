import type { Metadata } from "next";
import { getImageDetails } from "./page";
//eslint-disable-next-line
function generateImageSchema(imageDetails: any) {
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
      name: imageDetails.author,
    },
    license: imageDetails.license,
    keywords: imageDetails.keywords.join(", "),
    contentSize: `${(imageDetails.fileSize / (1024 * 1024)).toFixed(2)}MB`,
    encodingFormat: imageDetails.fileType,
  };
}
//eslint-disable-next-line
function generateWebPageSchema(imageDetails: any) {
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

  // Generate the schema scripts
  const schemas = [
    generateImageSchema(imageDetails),
    generateWebPageSchema(imageDetails),
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
