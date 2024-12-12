"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { ImageDetails } from "./image-details";
import { toast } from "react-hot-toast";

interface ImageItem {
  _id: string;
  cloudFrontUrl: string;
  title: string;
  downloads: number;
  fileType: string;
  dimensions: {
    width: number;
    height: number;
  };
  description: string;
  keywords: string[];
}

export function ImageGrid() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [images, setImages] = useState<ImageItem[]>([]);

  useEffect(() => {
    async function fetchImages() {
      const res = await fetch(
        `/api/images?fileType=${selectedTab}&query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();
      setImages(data.images);
    }

    fetchImages();
  }, [selectedTab, searchQuery]);

  const handleImageClick = (image: ImageItem, index: number) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
    toast.success("Image selected");
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
              onValueChange={setSelectedTab}
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-auto sm:grid-cols-4">
                {Object.entries(categories).map(([key, label]) => (
                  <TabsTrigger key={key} value={key}>
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
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
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {images.map((image, index) => (
                <motion.div
                  key={image._id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group relative rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm"
                  onClick={() => handleImageClick(image, index)}
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
                        Click to view details
                      </p>
                    </div>
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
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {selectedImage && (
          <div className="mt-8">
            <ImageDetails
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
              onPrevious={handlePrevious}
              onNext={handleNext}
              hasPrevious={
                selectedImageIndex !== null && selectedImageIndex > 0
              }
              hasNext={
                selectedImageIndex !== null &&
                selectedImageIndex < images.length - 1
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
