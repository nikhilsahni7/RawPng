import { MainNav } from "@/components/home/main-nav";
import { SearchBar } from "@/components/home/search-bar";
import { CategoryTags } from "@/components/home/category-tags";
import { ImageGrid } from "@/components/home/image-grid";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center gap-4 px-4">
          <div className="flex items-center gap-2 font-bold text-2xl text-black">
            <div className="h-8 w-8 rounded-lg bg-blue-600" />
            StockAssets
          </div>
          <div className="flex-1">
            <MainNav />
          </div>
          <Button className="bg-blue-600 text-white hover:bg-blue-700">
            Sign In
          </Button>
        </div>
      </header>
      <main className="container mx-auto py-12 space-y-12 px-4">
        <div className="space-y-6 text-center">
          <h1 className="text-5xl font-bold tracking-tight text-black sm:text-6xl">
            Discover Millions of Free Resources
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            High-quality PNG images, vectors, and stock photos for your next
            project
          </p>
        </div>
        <div className="flex justify-center">
          <SearchBar />
        </div>
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-black">Popular Tags</h2>
          <CategoryTags />
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold text-black">
              Trending Resources
            </h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                All
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                PNG
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Vector
              </Button>
              <Button
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                Images
              </Button>
            </div>
          </div>
          <ImageGrid />
        </div>
      </main>
    </div>
  );
}
