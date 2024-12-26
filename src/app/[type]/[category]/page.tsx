"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { ImageGrid } from "@/components/home/image-grid";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/home/pagination";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

export default function CategoryPage() {
  const params = useParams();
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Add debounce ref
  const fetchTimeoutRef = useRef<NodeJS.Timeout>();

  const fetchCategoryImages = useCallback(async () => {
    // Clear any existing timeout
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    setLoading(true);
    setError(null);

    // Set a new timeout
    fetchTimeoutRef.current = setTimeout(async () => {
      try {
        const normalizedType =
          typeof params.type === "string"
            ? params.type.toLowerCase()
            : Array.isArray(params.type)
            ? params.type[0].toLowerCase()
            : "";

        const normalizedCategory =
          typeof params.category === "string"
            ? params.category.toLowerCase()
            : Array.isArray(params.category)
            ? params.category[0].toLowerCase()
            : "";

        const response = await axios.get("/api/category-images", {
          params: {
            type: normalizedType,
            category: normalizedCategory,
            page: currentPage,
          },
        });

        if (response.data.total === 0) {
          setError(
            `No ${normalizedType}s found in the ${normalizedCategory} category`
          );
          setImages([]);
          setTotalPages(0);
        } else {
          setImages(response.data.images);
          setTotalPages(response.data.totalPages);
        }
      } catch (error) {
        console.error("Error fetching images:", error);
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.error || "Failed to load images");
        } else {
          setError("Failed to load images");
        }
      } finally {
        setLoading(false);
        setInitialLoad(false);
      }
    }, 300);
  }, [params.type, params.category, currentPage]);

  useEffect(() => {
    fetchCategoryImages();

    // Cleanup function
    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [fetchCategoryImages]);

  const formatText = useCallback((text: string) => {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }, []);

  const categoryDisplay = formatText(params.category as string);
  const typeDisplay = formatText(params.type as string);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto py-8 space-y-8 px-4">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-blue-100"
            >
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-black">
              {categoryDisplay} {typeDisplay}
              <span className="text-blue-600">s</span>
            </h1>
            <p className="mt-2 text-gray-600">
              Browse our collection of high-quality{" "}
              {categoryDisplay.toLowerCase()} {typeDisplay.toLowerCase()}s
            </p>
          </motion.div>
        </div>

        <AnimatePresence mode="wait">
          {error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-red-500 mb-4">{error}</p>
              <Button onClick={() => fetchCategoryImages()}>Try Again</Button>
            </motion.div>
          ) : loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="aspect-square rounded-lg"
                  style={{
                    animationDelay: `${index * 0.05}s`,
                  }}
                />
              ))}
            </motion.div>
          ) : images.length > 0 ? (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ImageGrid images={images} />
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </div>
            </motion.div>
          ) : (
            !initialLoad && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No Images Found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any {typeDisplay.toLowerCase()}s in the{" "}
                  {categoryDisplay.toLowerCase()} category.
                </p>
                <Button asChild>
                  <Link href="/">Browse All Images</Link>
                </Button>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
