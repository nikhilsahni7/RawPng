// components/RelatedImages.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/home/pagination";
import { generateImageUrl } from "@/lib/api/images";
import { Footer } from "@/components/layout/footer";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageDetails } from "@/types/image";

interface RelatedImage {
  _id: string;
  title: string;
  cloudFrontUrl: string;
  dimensions: {
    width: number;
    height: number;
  };
  category: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
}

export default function RelatedImages({ imageId }: { imageId: string }) {
  const [images, setImages] = useState<RelatedImage[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchRelatedImages = async (page: number) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/images/${imageId}/related?page=${page}`);
      const data = await res.json();

      if (res.ok) {
        setImages(data.images);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching related images:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelatedImages(1);
  }, [imageId]);

  const handlePageChange = (page: number) => {
    fetchRelatedImages(page);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/3] w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-bold">Related Images</h2>

      {images.length > 0 ? (
        <div className="masonry">
          {images.map((image) => (
            <div key={image._id} className="masonry-item">
              <Link
                href={generateImageUrl(image as ImageDetails)}
                target="_blank"
              >
                <div className="relative w-full">
                  <div
                    style={{
                      paddingBottom: `${
                        (image.dimensions.height / image.dimensions.width) * 100
                      }%`,
                    }}
                  />
                  <Image
                    src={image.cloudFrontUrl}
                    alt={image.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover absolute top-0 left-0"
                    priority={false}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-xs font-medium text-white truncate">
                        {image.title}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-0.5 text-xs text-white bg-black/50 border border-white/30">
                        {image.category}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-dashed p-6 sm:p-12 text-center">
          <p className="text-sm sm:text-base text-gray-500">
            No related images found
          </p>
        </div>
      )}

      {pagination.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}
