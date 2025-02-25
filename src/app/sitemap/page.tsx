import { generateSitemap } from "@/lib/sitemap";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitemap | rawpng",
  description: "Browse all pages on rawpng",
};

export default async function SitemapPage() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rawpng.com";
  const sitemapItems = await generateSitemap(baseUrl);

  // Group items by sections (based on first path segment)
  const groupedItems: Record<string, typeof sitemapItems> = {};

  sitemapItems.forEach((item) => {
    const url = new URL(item.url);
    const path = url.pathname;
    const section = path.split("/")[1] || "home";

    if (!groupedItems[section]) {
      groupedItems[section] = [];
    }

    groupedItems[section].push(item);
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">Sitemap</h1>

      <p className="mb-8 text-gray-600">
        Browse all pages on rawpng. You can also view our{" "}
        <Link href="/sitemap.xml" className="text-blue-600 hover:underline">
          XML sitemap
        </Link>
        .
      </p>

      <div className="space-y-10">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section} className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4 capitalize">
              {section === "home" ? "Main Pages" : section}
            </h2>
            <ul className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => {
                const url = new URL(item.url);
                const path = url.pathname;
                const displayPath =
                  path === "/"
                    ? "Home"
                    : path.split("/").filter(Boolean).join(" / ");

                return (
                  <li key={item.url}>
                    <Link
                      href={path}
                      className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                    >
                      <span className="capitalize">{displayPath}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
