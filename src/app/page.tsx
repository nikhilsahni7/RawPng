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

      if (response.data) {
        setImages(response.data.images);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
      setImages([]);
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

  const handleSearch = useCallback(
    async (searchQuery: string, selectedFileType: string) => {
      setQuery(searchQuery);
      setFileType(selectedFileType);
      setSelectedCategory(""); // Clear category when searching
      setCurrentPage(1);
      setLoading(true);

      try {
        const response = await axios.get("/api/images", {
          params: {
            fileType: selectedFileType,
            query: searchQuery,
            page: 1,
          },
        });

        setImages(response.data.images);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error fetching images:", error);
        setImages([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
    setQuery(""); // Clear search query when selecting category
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      {/* Header - Updated for better mobile spacing */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm safe-padding">
        <div className="container mx-auto flex h-14 sm:h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Image
              src="/Rawpnglogo(1).svg"
              alt="rawpng"
              width={120}
              height={40}
              className="w-24 sm:w-32 md:w-40"
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

      <main className="flex-1 safe-padding">
        {/* Hero Section - Updated spacing */}
        <section className="relative bg-[#FAFBFC] py-4 sm:py-8 lg:py-12">
          <div className="container relative mx-auto px-4">
            <div className="mx-auto max-w-7xl text-center">
              <h1 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
                Discover
                <span className="mx-1 sm:mx-2">Free</span>
                <span className="relative whitespace-nowrap text-blue-600">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 418 42"
                    className="absolute left-0 top-2/3 h-[.58em] w-full fill-blue-300/70"
                    preserveAspectRatio="none"
                  >
                    <path d="M203.371.916c-26.013-2.078-76.686 1.963-124.73 9.946L67.3 12.749C35.421 18.062 18.2 21.766 6.004 25.934 1.244 27.561.828 27.778.874 28.61c.07 1.214.828 1.121 9.595-1.176 9.072-2.377 17.15-3.92 39.246-7.496C123.565 7.986 157.869 4.492 195.942 5.046c7.461.108 19.25 1.696 19.17 2.582-.107 1.183-7.874 4.31-25.75 10.366-21.992 7.45-35.43 12.534-36.701 13.884-2.173 2.308-.202 4.407 4.442 4.734 2.654.187 3.263.157 15.593-.78 35.401-2.686 57.944-3.488 88.365-3.143 46.327.526 75.721 2.23 130.788 7.584 19.787 1.924 20.814 1.98 24.557 1.332l.066-.011c1.201-.203 1.53-1.825.399-2.335-2.911-1.31-4.893-1.604-22.048-3.261-57.509-5.556-87.871-7.36-132.059-7.842-23.239-.254-33.617-.116-50.627.674-11.629.54-42.371 2.494-46.696 2.967-2.359.259 8.133-3.625 26.504-9.81 23.239-7.825 27.934-10.149 28.304-14.005.417-4.348-3.529-6-16.878-7.066Z" />
                  </svg>
                  <span className="relative">Premium</span>
                </span>
                <span className="mx-1 sm:mx-2">Resources</span>
              </h1>
              <p className="mx-auto mb-4 sm:mb-6 max-w-2xl text-sm sm:text-base text-gray-600 md:text-lg px-2 sm:px-4">
                Looking for resources? We are here to help you use it for free
              </p>
              <div className="mx-auto max-w-7xl px-2 sm:px-0 block">
                <SearchBar onSearch={handleSearch} />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section - Reduced spacing */}
        <section className="py-4 sm:py-8 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-4 sm:mb-8 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Popular Categories
              </h2>
              <p className="mt-2 text-base sm:text-lg text-gray-600">
                Browse through our curated collection of categories
              </p>
            </div>
            <CategoryTags
              categories={categories}
              onCategoryClick={handleCategoryClick}
            />
          </div>
        </section>

        {/* Image Grid Section - Enhanced visibility handling */}
        <section
          id="search-results"
          className={`py-8 sm:py-16 bg-[#f8f9fa] transition-opacity duration-300 ${
            loading ? "opacity-50" : "opacity-100"
          }`}
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-12 text-center">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {query ? "Search Results" : "Trending Resources"}
              </h2>
              <p className="mt-2 sm:mt-4 text-base sm:text-lg text-gray-600">
                {query
                  ? `Showing results for "${query}"`
                  : "Discover what creators are downloading right now"}
              </p>
            </div>

            {/* Loading and Results Display */}
            <div className="relative min-h-[300px]">
              {loading ? (
                <div className="grid grid-cols-1 xs:grid-cols-2 gap-8 sm:grid-cols-3 md:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} className="aspect-[4/3] w-full" />
                  ))}
                </div>
              ) : images.length > 0 ? (
                <div className="masonry-container">
                  <ImageGrid images={images} />
                </div>
              ) : (
                <div className="rounded-2xl border-2 border-dashed p-6 sm:p-12 text-center">
                  <p className="text-sm sm:text-base text-gray-500">
                    {query
                      ? `No results found for "${query}"`
                      : "No images found"}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-8 sm:mt-12">
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
