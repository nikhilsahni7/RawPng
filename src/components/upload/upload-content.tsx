// upload-content.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Download, FileIcon, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { UploadModal } from "./upload-modal";
import { CSVUpload } from "./csv-upload";
import Image from "next/image";
import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";

// These should match exactly with the schema enum values
const categories = [
  "Animals",
  "Buildings and Architecture",
  "Business",
  "Drinks",
  "The Environment",
  "States of Mind",
  "Food",
  "Graphic Resources",
  "Hobbies and Leisure",
  "Industry",
  "Landscapes",
  "Lifestyle",
  "People",
  "Plants and Flowers",
  "Culture and Religion",
  "Science",
  "Social Issues",
  "Sports",
  "Technology",
  "Transport",
  "Travel",
];

interface UploadedFile {
  _id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  s3Url: string;
  cloudFrontUrl: string;
  category: string;
  title: string;
  description?: string;
  keywords: string[];
  dimensions?: {
    width: number;
    height: number;
  };
  uploadDate: string;
}

export function UploadContent() {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<UploadedFile | null>(
    null
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [timeFilter, setTimeFilter] = React.useState<
    "all" | "today" | "week" | "month" | "year"
  >("all");

  const fetchFiles = async () => {
    try {
      const response = await fetch("/api/upload");
      const data = await response.json();
      setFiles(data);
      if (data.length > 0 && !selectedFile) {
        setSelectedFile(data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  React.useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // In your upload handler
  const handleFileUpload = async (uploadedFiles: File[]) => {
    const formData = new FormData();

    // Validate files before upload
    for (const file of uploadedFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error("Only image files are allowed");
        return;
      }
      formData.append("files", file);
    }

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      if (!data.success) {
        throw new Error(data.error);
      }

      setFiles((prevFiles) => [...data.files, ...prevFiles]);
      setIsUploadModalOpen(false);
      toast.success("Files uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to upload files"
      );
    }
  };
  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      const response = await fetch(`/api/upload/${selectedFile._id}`, {
        method: "PUT",
        body: JSON.stringify({
          category: selectedFile.category,
          title: selectedFile.title,
          description: selectedFile.description,
          keywords: selectedFile.keywords,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (response.ok) {
        setFiles((prevFiles) =>
          prevFiles.map((file) =>
            file._id === data._id ? { ...file, ...data } : file
          )
        );
        toast.success("File details updated!");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Failed to update file details.");
    }
  };

  const handleDelete = async (fileToRemove: UploadedFile) => {
    try {
      const response = await fetch(`/api/upload/${fileToRemove._id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setFiles((prevFiles) =>
          prevFiles.filter((file) => file._id !== fileToRemove._id)
        );
        toast.success("File deleted successfully!");
        if (selectedFile?._id === fileToRemove._id) {
          setSelectedFile(files[0] || null);
        }
      } else {
        throw new Error("Failed to delete file.");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error("Failed to delete file.");
    }
  };

  const filteredFiles = React.useMemo(() => {
    const now = new Date();
    return files.filter((file) => {
      const uploadDate = new Date(file.uploadDate);
      switch (timeFilter) {
        case "today":
          return uploadDate.toDateString() === now.toDateString();
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return uploadDate > weekAgo;
        case "month":
          return (
            uploadDate.getMonth() === now.getMonth() &&
            uploadDate.getFullYear() === now.getFullYear()
          );
        case "year":
          return uploadDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [files, timeFilter]);

  const handleKeywordRemove = (keyword: string) => {
    if (selectedFile) {
      setSelectedFile({
        ...selectedFile,
        keywords: selectedFile.keywords.filter((k) => k !== keyword),
      });
    }
  };

  const generateKeywords = (filename: string): string[] => {
    if (!filename) return [];

    // Remove file extension and split into words
    const baseWords = filename
      .replace(/\.[^/.]+$/, "") // Remove file extension
      .split(/[-_\s]+/) // Split on hyphens, underscores, and spaces
      .filter((word) => word.length > 2) // Filter out short words
      .map((word) => word.toLowerCase());

    // Common relevant keywords based on content categories
    const categoryBasedKeywords = {
      image: ["digital", "photo", "picture", "photography", "image"],
      quality: ["high-resolution", "hd", "professional", "original"],
      usage: ["stock", "commercial", "editorial", "creative"],
      technical: ["digital-asset", "media", "content"],
    };

    // Combine all category keywords
    const additionalKeywords = [
      ...categoryBasedKeywords.image,
      ...categoryBasedKeywords.quality,
      ...categoryBasedKeywords.usage,
      ...categoryBasedKeywords.technical,
    ];

    // Generate related words (you can expand this based on your needs)
    const relatedWords = baseWords.flatMap((word) => {
      const related = [];
      // Add plural form if word ends with common singular endings
      if (word.match(/[^s]$/)) {
        related.push(`${word}s`);
      }
      // Add singular form if word ends with 's'
      if (word.endsWith("s")) {
        related.push(word.slice(0, -1));
      }
      return related;
    });

    // Combine all keywords and remove duplicates
    const allKeywords = [
      ...new Set([...baseWords, ...additionalKeywords, ...relatedWords]),
    ];

    // Filter out common stop words and short words
    const stopWords = [
      "the",
      "and",
      "or",
      "but",
      "for",
      "with",
      "in",
      "on",
      "at",
    ];

    return allKeywords
      .filter(
        (word) =>
          word.length > 2 && !stopWords.includes(word) && !word.match(/^\d+$/) // Remove pure numbers
      )
      .slice(0, 15); // Limit to 15 keywords max
  };
  const handleGenerateMoreKeywords = () => {
    if (!selectedFile) return;

    // Generate keywords from both filename and title
    const filenameKeywords = generateKeywords(selectedFile.fileName);
    const titleKeywords = selectedFile.title
      ? generateKeywords(selectedFile.title)
      : [];

    // Combine existing and new keywords, remove duplicates
    const newKeywords = [
      ...new Set([
        ...selectedFile.keywords,
        ...filenameKeywords,
        ...titleKeywords,
      ]),
    ];

    setSelectedFile({
      ...selectedFile,
      keywords: newKeywords,
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-semibold">Upload Dashboard</h1>
        <div className="flex gap-2">
          <Select
            value={timeFilter}
            onValueChange={(value) =>
              setTimeFilter(
                value as "all" | "today" | "week" | "month" | "year"
              )
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This week</SelectItem>
              <SelectItem value="month">This month</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload Files
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Upload Files</DialogTitle>
                <DialogDescription>
                  Drag and drop files or click to browse
                </DialogDescription>
              </DialogHeader>
              <UploadModal onUpload={handleFileUpload} />
            </DialogContent>
          </Dialog>
          <CSVUpload onUpload={() => {}} />
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left side - File grid */}
        <div className="w-2/3 p-4 overflow-y-auto">
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
            <AnimatePresence>
              {filteredFiles.map((file) => (
                <motion.div
                  key={file._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={cn(
                    "relative group cursor-pointer",
                    selectedFile?._id === file._id ? "ring-2 ring-primary" : ""
                  )}
                  onClick={() => setSelectedFile(file)}
                >
                  {file.cloudFrontUrl ? (
                    <Image
                      src={file.cloudFrontUrl}
                      alt={file.fileName || "Uploaded image"}
                      width={200}
                      height={200}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-32 flex items-center justify-center bg-muted rounded-lg">
                      <FileIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(file);
                      }}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Right side - Metadata form */}
        <div className="w-1/3 p-4 border-l overflow-y-auto">
          {selectedFile && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-id">File ID</Label>
                <Input id="file-id" value={selectedFile._id} readOnly />
              </div>

              <div>
                <Label htmlFor="original-name">Original Filename</Label>
                <Input
                  id="original-name"
                  value={selectedFile.fileName}
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="file-type">File type</Label>
                <Input id="file-type" value={selectedFile.fileType} readOnly />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={selectedFile.category}
                  onValueChange={(value) =>
                    setSelectedFile({ ...selectedFile, category: value })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter title (max. 200 characters)"
                  value={selectedFile.title || ""}
                  onChange={(e) =>
                    setSelectedFile({
                      ...selectedFile,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter description"
                  value={selectedFile.description || ""}
                  onChange={(e) =>
                    setSelectedFile({
                      ...selectedFile,
                      description: e.target.value,
                    })
                  }
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label>Keywords</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedFile.keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="secondary"
                      onClick={() => handleKeywordRemove(keyword)}
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                    >
                      {keyword} ×
                    </Badge>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateMoreKeywords}
                >
                  Generate More Keywords
                </Button>
              </div>

              <Alert>
                <AlertDescription>
                  Add a minimum of 5 keywords to improve discoverability
                </AlertDescription>
              </Alert>

              <Button className="w-full" onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
