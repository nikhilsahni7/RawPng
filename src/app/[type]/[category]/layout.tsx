import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { type: string; category: string };
}): Promise<Metadata> {
  const categoryName = params.category.replace(/-/g, " ");
  const fileType = params.type.toUpperCase();

  const seoTitle = `Free ${categoryName} ${fileType} Images Download | rawpng`;
  const seoDescription = `Download free ${categoryName.toLowerCase()} ${fileType} images with transparent backgrounds. High quality, commercial use allowed.`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: seoTitle,
    description: seoDescription,
    url: `${process.env.NEXT_PUBLIC_APP_URL}/${params.type}/${params.category}`,
    mainEntity: {
      "@type": "ImageGallery",
      name: `${categoryName} ${fileType} Images`,
      description: `Collection of ${categoryName.toLowerCase()} ${fileType} images`,
      about: {
        "@type": "Thing",
        name: categoryName,
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
            "@id": `${process.env.NEXT_PUBLIC_APP_URL}/${params.type}`,
            name: fileType,
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": `${process.env.NEXT_PUBLIC_APP_URL}/${params.type}/${params.category}`,
            name: categoryName,
          },
        },
      ],
    },
  };

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: [
      categoryName,
      fileType,
      "free download",
      "transparent background",
      "high quality",
      "commercial use",
    ],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: "website",
      url: `${process.env.NEXT_PUBLIC_APP_URL}/${params.type}/${params.category}`,
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_APP_URL}/${params.type}/${params.category}`,
    },
    other: {
      "json-ld": JSON.stringify(structuredData),
    },
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
