"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";
import { ImageDetails } from "./image-details";

interface ImageItem {
  id: string;
  src: string;
  title: string;
  downloads: number;
  category: "PNG" | "VECTOR" | "IMAGE";
  dimensions: string;
  format: string;
  uploadDate: string;
  description: string;
  tags: string[];
}

const sampleImages: ImageItem[] = [
  {
    id: "1",
    src: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "HD Microscopic Cell Structure",
    downloads: 32,
    category: "PNG",
    dimensions: "5256 x 4584",
    format: "PNG",
    uploadDate: "2023-12-01",
    description: "High resolution microscopic view of cellular structure",
    tags: ["science", "microscopic", "biology", "medical"],
  },
  {
    id: "2",
    src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    title: "Vector Business Growth Chart",
    downloads: 26,
    category: "VECTOR",
    dimensions: "3840 x 2160",
    format: "SVG",
    uploadDate: "2023-12-01",
    description: "Professional business growth chart illustration",
    tags: ["business", "finance", "growth", "chart"],
  },
  // Add more sample images...
];

export function ImageGrid() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );

  const categories = {
    all: sampleImages.length,
    png: sampleImages.filter((img) => img.category === "PNG").length,
    vector: sampleImages.filter((img) => img.category === "VECTOR").length,
    image: sampleImages.filter((img) => img.category === "IMAGE").length,
  };

  const filteredImages = sampleImages
    .filter((img) => {
      if (selectedTab !== "all" && img.category.toLowerCase() !== selectedTab) {
        return false;
      }
      return (
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    })
    .sort((a, b) => b.downloads - a.downloads);

  const handleImageClick = (image: ImageItem, index: number) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };

  const handlePrevious = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      const newIndex = selectedImageIndex - 1;
      setSelectedImage(filteredImages[newIndex]);
      setSelectedImageIndex(newIndex);
    }
  };

  const handleNext = () => {
    if (
      selectedImageIndex !== null &&
      selectedImageIndex < filteredImages.length - 1
    ) {
      const newIndex = selectedImageIndex + 1;
      setSelectedImage(filteredImages[newIndex]);
      setSelectedImageIndex(newIndex);
    }
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
                <TabsTrigger value="all">All ({categories.all})</TabsTrigger>
                <TabsTrigger value="png">PNG ({categories.png})</TabsTrigger>
                <TabsTrigger value="vector">
                  Vector ({categories.vector})
                </TabsTrigger>
                <TabsTrigger value="image">
                  Image ({categories.image})
                </TabsTrigger>
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
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group relative rounded-lg overflow-hidden border bg-card text-card-foreground shadow-sm"
                  onClick={() => handleImageClick(image, index)}
                >
                  <div className="aspect-square relative">
                    <Image
                      src={image.src}
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
                        {image.category}
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
                selectedImageIndex < filteredImages.length - 1
              }
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
