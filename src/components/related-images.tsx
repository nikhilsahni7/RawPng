// components/RelatedImages.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Pagination from "@/components/home/pagination";
import { Card, CardContent } from "@/components/ui/card";
import { Footer } from "@/components/layout/footer";

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
    return <div className="mt-8">Loading related images...</div>;
  }

  return (
    <div className="mt-12 space-y-6">
      <h2 className="text-2xl font-bold">Related Images</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Link key={image._id} href={`/image/${image._id}`}>
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-2">
                <div
                  className="relative w-full"
                  style={{
                    paddingBottom: `${
                      (image.dimensions.height / image.dimensions.width) * 100
                    }%`,
                  }}
                >
                  <Image
                    src={image.cloudFrontUrl}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium truncate">
                    {image.title}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {image.category}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

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
