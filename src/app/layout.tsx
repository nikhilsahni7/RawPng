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
  keywords: ["PNG", "images", "transparent", "download", "free"],
  authors: [{ name: "rawpng" }],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
};

// Add this function to generate the organization schema
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rawpng",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    logo: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/Rawpnglogo(1).svg`,
    description:
      "Download high-quality PNG images for free. Transparent backgrounds, high resolution, and ready to use for your projects.",
    sameAs: [
      // Add your social media URLs here
      // "https://twitter.com/rawpng",
      // "https://facebook.com/rawpng",
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
      <head />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateOrganizationSchema()),
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
