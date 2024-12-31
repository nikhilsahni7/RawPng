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
      console.error(error);
    }
    setLoading(false);
  }, [fileType, query, currentPage, selectedCategory]);

  useEffect(() => {
    fetchImages();
    fetchCategories();
  }, [fetchImages]);

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
  };
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setQuery(""); // Clear search query when selecting category
    setCurrentPage(1);
  };

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
            <MobileNav />
          </div>
        </div>
      </header>
      <main className="container mx-auto py-12 space-y-12 px-4">
        <section className="text-center space-y-8 pt-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
            Discover Millions of
            <span className="text-blue-600"> Free Resources</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-gray-600">
            High-quality PNG images, vectors, and stock photos for your next
            project
          </p>
          <div className="flex justify-center">
            <SearchBar onSearch={handleSearch} />
          </div>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-black text-center">
            Popular Tags
          </h2>
          <CategoryTags
            categories={categories}
            onCategoryClick={handleCategoryClick}
          />
        </section>
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-bold text-black">
              Trending Resources
            </h2>
          </div>
          {loading ? (
            // Skeleton loader
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton key={index} className="h-48 w-full" />
              ))}
            </div>
          ) : images.length > 0 ? (
            <ImageGrid images={images} />
          ) : (
            // No images message
            <p className="text-center text-gray-500">No images found.</p>
          )}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
}
