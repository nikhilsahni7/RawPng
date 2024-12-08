import { MainNav } from "@/components/home/main-nav";
import { SearchBar } from "@/components/home/search-bar";
import { CategoryTags } from "@/components/home/category-tags";
import { ImageGrid } from "@/components/home/image-grid";
import { FeatureSection } from "@/components/home/featureSection";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/home/mobile-nav";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-2xl text-black">
            <Image
              src="/logo.svg"
              alt="Pngly"
              width={120}
              height={40}
              className="rounded-md"
            />
          </div>
          <div className="hidden md:block">
            <MainNav />
          </div>
          <div className="flex items-center gap-4">
            <Button className="hidden md:inline-flex bg-blue-600 text-white hover:bg-blue-700">
              Sign In
            </Button>
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 space-y-12 px-4">
        <section className="text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Millions of
            <span className="text-blue-600"> Free Resources</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600">
            High-quality PNG images, vectors, and stock photos for your next
            project
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black text-center">
            Popular Tags
          </h2>
          <CategoryTags />
        </section>
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Trending Resources
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {["All", "PNG", "Vector", "Images"].map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          <ImageGrid />
        </section>
        <FeatureSection />
      </main>
      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2024 Pngly. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
