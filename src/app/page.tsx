"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { MainNav } from "@/components/home/main-nav";
import { SearchBar } from "@/components/home/search-bar";
import { CategoryTags } from "@/components/home/category-tags";
import { ImageGrid } from "@/components/home/image-grid";
import { FeatureSection } from "@/components/home/featureSection";
import { MobileNav } from "@/components/home/mobile-nav";
import Pagination from "@/components/home/pagination";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Footer } from "@/components/layout/footer";
import { FileImage } from "lucide-react";
import { IconVector } from "@tabler/icons-react";
import { IconBrandGithub } from "@tabler/icons-react";
export default function Home() {
  const [images, setImages] = useState([]);
  const [fileType, setFileType] = useState("all");
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/images", {
        params: {
          fileType,
          query,
          category: selectedCategory,
          page: currentPage,
        },
      });
      setImages(response.data.images);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]); // Clear images on error
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [fileType, query, currentPage, selectedCategory]);

  useEffect(() => {
    fetchImages();
  }, [fileType, query, currentPage, selectedCategory, fetchImages]);

  useEffect(() => {
    fetchCategories();
  }, []); // Only fetch categories once on mount

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error(error);
      setCategories([]);
    }
  };

  const handleSearch = (searchQuery: string, selectedFileType: string) => {
    setQuery(searchQuery);
    setFileType(selectedFileType);
    setSelectedCategory(""); // Clear category when searching
    setCurrentPage(1);
    // Trigger immediate search with new file type
    fetchImages();
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setQuery(""); // Clear search query when selecting category
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Pngly"
              width={120}
              height={40}
              className="rounded-md"
            />
          </div>
          <div className="hidden md:block flex-1 px-8">
            <MainNav />
          </div>
          <div className="flex items-center gap-4">
            <MobileNav />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section with Animated Floating Elements */}
        <section className="relative overflow-visible bg-[#FAFBFC] py-12 lg:py-32">
          {/* Floating Elements - Hide on small screens */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-[1] hidden md:block">
            {/* Free Downloads - Top Left */}
            <div className="absolute left-[5%] top-[15%] animate-float-slow">
              <div className="rounded-lg border-2 border-blue-400 bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm transform rotate-[-12deg] hover:rotate-0 transition-transform duration-300">
                <span className="flex items-center gap-2">
                  <FileImage className="w-4 h-4" />
                  Free Downloads
                </span>
              </div>
            </div>

            {/* Premium Quality - Top Right */}
            <div className="absolute right-[10%] top-[20%] animate-float-slower">
              <div className="rounded-lg border-2 border-purple-400 bg-white px-4 py-2 text-sm font-medium text-purple-600 shadow-sm transform rotate-[12deg] hover:rotate-0 transition-transform duration-300">
                <span className="flex items-center gap-2">
                  <IconVector className="w-4 h-4" />
                  Premium Quality
                </span>
              </div>
            </div>

            {/* Vector Support - Bottom Left */}
            <div className="absolute left-[15%] bottom-[25%] animate-float-normal">
              <div className="rounded-lg border-2 border-green-400 bg-white px-4 py-2 text-sm font-medium text-green-600 shadow-sm transform rotate-[8deg] hover:rotate-0 transition-transform duration-300">
                <span className="flex items-center gap-2">
                  <IconVector className="w-4 h-4" />
                  Vector Support
                </span>
              </div>
            </div>

            {/* Open Source - Bottom Right */}
            <div className="absolute right-[15%] bottom-[20%] animate-float-fast">
              <div className="rounded-lg border-2 border-orange-400 bg-white px-4 py-2 text-sm font-medium text-orange-600 shadow-sm transform rotate-[-8deg] hover:rotate-0 transition-transform duration-300">
                <span className="flex items-center gap-2">
                  <IconBrandGithub className="w-4 h-4" />
                  Open Source
                </span>
              </div>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="container relative mx-auto px-4 z-[2] overflow-visible">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-4 inline-block rounded-full bg-blue-50 px-4 py-1.5">
                <span className="text-sm font-medium text-blue-600">
                  We are 100% open source
                </span>
              </div>
              <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl lg:text-6xl">
                Discover
                <span className="mx-2">Premium</span>
                <span className="relative whitespace-nowrap text-blue-600">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 418 42"
                    className="absolute left-0 top-2/3 h-[.58em] w-full fill-blue-300/70"
                    preserveAspectRatio="none"
                  >
                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                  </svg>
                  <span className="relative">Resources</span>
                </span>
                <span className="mx-2">for Free</span>
              </h1>
              <p className="mx-auto mb-8 max-w-2xl text-base text-gray-600 md:text-lg px-4">
                Access millions of high-quality PNG images, vectors, and stock
                photos for your creative projects
              </p>
              <div className="mx-auto max-w-2xl">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Popular Categories
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Browse through our curated collection of categories
              </p>
            </div>
            <CategoryTags
              categories={categories}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </section>

        {/* Image Grid Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Trending Resources
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Discover what creators are downloading right now
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="aspect-[4/3] w-full rounded-xl"
                  />
                ))}
              </div>
            ) : images.length > 0 ? (
              <ImageGrid images={images} />
            ) : (
              <div className="rounded-2xl border-2 border-dashed p-12 text-center">
                <p className="text-gray-500">No images found</p>
              </div>
            )}

            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </section>

        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
}
