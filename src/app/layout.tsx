import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/lib/auth";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Rawpng - Free PNG Image Downloads",
    template: "%s | Rawpng",
  },
  description:
    "Download high-quality PNG images for free. Transparent backgrounds, high resolution, and ready to use for your projects.",
  keywords: [
    "PNG",
    "images",
    "pics",
    "photos",
    "vectors",
    "icons",
    "logos",
    "backgrounds",

    "transparent",
    "download",
    "free",
    "image gallery",
    "stock images",
    "transparent background",
    "high resolution images",
    "digital assets",
  ],
  authors: [{ name: "rawpng" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "Rawpng",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@rawpng1",
    creator: "@rawpng1",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

// Add this function to generate the organization schema
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rawpng",
    url: process.env.NEXT_PUBLIC_APP_URL,
    logo: `${process.env.NEXT_PUBLIC_APP_URL}/Rawpnglogo(1).svg`,
    description:
      "Download high-quality PNG images for free. Transparent backgrounds, high resolution, and ready to use for your projects.",
    sameAs: [
      "https://in.pinterest.com/rawpng1/",
      "https://www.linkedin.com/company/rawpng",
      "https://x.com/rawpng1",
      "https://instagram.com",
    ],
  };
}

// Update the WebSite schema
function generateWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rawpng",
    url: process.env.NEXT_PUBLIC_APP_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
    description:
      "Download high-quality PNG images for free. Transparent backgrounds, high resolution, and ready to use for your projects.",
    publisher: {
      "@type": "Organization",
      name: "Rawpng",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/Rawpnglogo(1).svg`,
      },
    },
  };
}

// Add ImageGallery schema
function generateImageGallerySchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Rawpng Image Gallery",
    description:
      "Browse our collection of high-quality PNG images with transparent backgrounds",
    url: `${process.env.NEXT_PUBLIC_APP_URL}/gallery`,
    publisher: {
      "@type": "Organization",
      name: "Rawpng",
      logo: {
        "@type": "ImageObject",
        url: `${process.env.NEXT_PUBLIC_APP_URL}/Rawpnglogo(1).svg`,
      },
    },
  };
}

// Add this function after generateOrganizationSchema
function generateBreadcrumbSchema() {
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
    ],
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="canonical" href={process.env.NEXT_PUBLIC_APP_URL} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              generateOrganizationSchema(),
              generateWebSiteSchema(),
              generateBreadcrumbSchema(),
              generateImageGallerySchema(),
            ]),
          }}
        />
        <AuthProvider>
          {children}
          <Toaster position="bottom-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
