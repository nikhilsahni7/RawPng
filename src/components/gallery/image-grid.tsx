"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { ImageDetails } from "./image-details";
import { toast } from "react-hot-toast";

interface ImageItem {
  _id: string;
  cloudFrontUrl: string;
  title: string;
  category: string;
  downloads: number;
  fileType: string;
  dimensions: {
    width: number;
    height: number;
  };
  description: string;
  keywords: string[];
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center space-x-2">
      {currentPage > 1 && (
        <Button variant="outline" onClick={() => onPageChange(currentPage - 1)}>
          Previous
        </Button>
      )}
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}
      {currentPage < totalPages && (
        <Button variant="outline" onClick={() => onPageChange(currentPage + 1)}>
          Next
        </Button>
      )}
    </div>
  );
}

export function ImageGrid() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [images, setImages] = useState<ImageItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  useEffect(() => {
    async function fetchImages() {
      setIsLoading(true);
      try {
        const res = await fetch(
          `/api/images?fileType=${selectedTab}&query=${encodeURIComponent(
            searchQuery
          )}&page=${currentPage}`
        );
        const data = await res.json();
        setImages(data.images);
        setTotalPages(data.totalPages);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        toast.error("Failed to load images");
      } finally {
        setIsLoading(false);
      }
    }

    fetchImages();
  }, [selectedTab, searchQuery, currentPage]);

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      // Clear selections when exiting selection mode
      setSelectedImages(new Set());
    }
  };

  const toggleImageSelection = (
    imageId: string,
    event: React.MouseEvent<Element, MouseEvent>
  ) => {
    event.stopPropagation();
    const newSelectedImages = new Set(selectedImages);

    if (newSelectedImages.has(imageId)) {
      newSelectedImages.delete(imageId);
    } else {
      newSelectedImages.add(imageId);
    }

    setSelectedImages(newSelectedImages);
  };

  const handleImageClick = (
    image: ImageItem,
    index: number,
    event?: React.MouseEvent<Element, MouseEvent>
  ) => {
    if (isSelectionMode) {
      if (event) {
        toggleImageSelection(image._id, event);
      }
    } else {
      setSelectedImage(image);
      setSelectedImageIndex(index);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedImage(null);
    setSelectedImageIndex(null);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      setSelectedImage(images[newIndex]);
      setSelectedImageIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      const newIndex = selectedImageIndex + 1;
      setSelectedImage(images[newIndex]);
      setSelectedImageIndex(newIndex);
    }
  };

  const handleBackgroundClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedImage(null);
      setSelectedImageIndex(null);
    }
  };

  const handleDeleteSelected = async () => {
    if (selectedImages.size === 0) return;

    const confirmed = window.confirm(
      `Delete ${selectedImages.size} selected images?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch("/api/upload/batch-delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ids: Array.from(selectedImages),
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast.success(`Successfully deleted ${result.deletedCount} images`);
        // Refresh the image list
        setCurrentPage(1);
        setSelectedImages(new Set());
        setIsSelectionMode(false);

        // Trigger a refetch of images
        const res = await fetch(
          `/api/images?fileType=${selectedTab}&query=${encodeURIComponent(
            searchQuery
          )}&page=${1}`
        );
        const data = await res.json();
        setImages(data.images);
        setTotalPages(data.totalPages);
      } else {
        toast.error("Failed to delete images");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("An error occurred while deleting images");
    }
  };

  const categories = {
    all: "All",
    png: "PNG",
    vector: "VECTOR",
    image: "IMAGE",
  };

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <Tabs
              defaultValue="all"
              className="w-full sm:w-auto"
              onValueChange={(value) => {
                setSelectedTab(value);
                setCurrentPage(1);
              }}
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
                {Object.entries(categories).map(([key, label]) => (
                  <TabsTrigger key={key} value={key}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-[300px]">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  size={18}
                />
                <Input
                  type="text"
                  placeholder="Search images..."
                  className="pl-8 w-full"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>

              <Button
                variant={isSelectionMode ? "default" : "outline"}
                onClick={toggleSelectionMode}
                className="whitespace-nowrap"
              >
                {isSelectionMode ? "Cancel Selection" : "Select Images"}
              </Button>

              {isSelectionMode && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  disabled={selectedImages.size === 0}
                  className="whitespace-nowrap"
                >
                  Delete Selected ({selectedImages.size})
                </Button>
              )}
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <>
                  <motion.div
                    key={image._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`group relative rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm ${
                      selectedImages.has(image._id) ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={(e: React.MouseEvent<Element, MouseEvent>) =>
                      handleImageClick(image, index, e)
                    }
                  >
                    <div className="aspect-square relative">
                      <Image
                        src={image.cloudFrontUrl}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white text-sm">
                          {isSelectionMode
                            ? "Click to select"
                            : "Click to view details"}
                        </p>
                      </div>

                      {isSelectionMode && (
                        <div
                          className="absolute top-2 right-2 h-6 w-6 rounded-full border-2 flex items-center justify-center bg-white"
                          onClick={(e: React.MouseEvent<Element, MouseEvent>) =>
                            toggleImageSelection(image._id, e)
                          }
                        >
                          {selectedImages.has(image._id) && (
                            <div className="h-4 w-4 rounded-full bg-primary"></div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-medium truncate">
                        {image.title}
                      </h3>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-muted-foreground">
                          {image.fileType.toUpperCase()}
                        </span>
                        <span className="text-xs font-medium">
                          {image.downloads} downloads
                        </span>
                      </div>
                    </div>
                  </motion.div>
                  {selectedImageIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4"
                      onClick={handleBackgroundClick}
                    >
                      <ImageDetails
                        image={selectedImage!}
                        onClose={() => setSelectedImage(null)}
                        onPrevious={handlePrevious}
                        onNext={handleNext}
                        hasPrevious={selectedImageIndex > 0}
                        hasNext={selectedImageIndex < images.length - 1}
                      />
                    </motion.div>
                  )}
                </>
              ))}
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-center mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
