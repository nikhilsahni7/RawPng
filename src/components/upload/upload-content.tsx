// upload-content.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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

import { UploadModal } from "./upload-modal";
import { CSVUpload } from "./csv-upload";

import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import {
  IconArrowLeft,
  IconUpload,
  IconDownload,
  IconX,
  IconDeviceFloppy,
  IconInbox,
} from "@tabler/icons-react";
import { Progress } from "@/components/ui/progress";
import { Loader2 } from "lucide-react";

import { useVirtualizer } from "@tanstack/react-virtual";
import { FileGridItem } from "./file-grid-item";

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

interface Category {
  _id: string;
  name: string;
  active: boolean;
}

// Add interface for UploadModal prop

export function UploadContent() {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = React.useState<UploadedFile | null>(
    null
  );
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState(false);
  const [newKeyword, setNewKeyword] = React.useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{
    [key: string]: number;
  }>({});
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  const parentRef = React.useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: Math.ceil(files.length / 4),
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200, // Estimated row height
    overscan: 5,
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleFileUpload = async (uploadedFiles: File[]) => {
    setIsUploading(true);

    // Process files in chunks to avoid memory issues
    const CHUNK_SIZE = 100;
    const totalChunks = Math.ceil(uploadedFiles.length / CHUNK_SIZE);

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = start + CHUNK_SIZE;
      const chunk = uploadedFiles.slice(start, end);

      const formData = new FormData();
      chunk.forEach((file) => {
        if (file.type.startsWith("image/")) {
          formData.append("files", file);
        }
      });

      try {
        const xhr = new XMLHttpRequest();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promise = new Promise<any>((resolve, reject) => {
          xhr.upload.addEventListener("progress", (event: ProgressEvent) => {
            if (event.total) {
              const progress = (event.loaded / event.total) * 100;
              const currentProgress = Math.round(
                ((chunkIndex * CHUNK_SIZE) / uploadedFiles.length) * 100 +
                  progress / totalChunks
              );

              setUploadProgress((prev) => ({
                ...prev,
                total: currentProgress,
              }));
            }
          });

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(xhr.statusText));
            }
          };

          xhr.onerror = () => reject(new Error("Network error"));
        });

        xhr.open("POST", "/api/upload");
        xhr.send(formData);

        const data = await promise;

        if (data.files?.length) {
          setFiles((prev) => [...data.files, ...prev]);
        }

        toast.success(`Processed chunk ${chunkIndex + 1}/${totalChunks}`);
      } catch (error) {
        console.error(`Error uploading chunk ${chunkIndex + 1}:`, error);
        toast.error(`Failed to upload some files in chunk ${chunkIndex + 1}`);
      }
    }

    setIsUploading(false);
    setUploadProgress({});
    setIsUploadModalOpen(false);
    toast.success("Upload completed!");
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

  const handleKeywordRemove = (keyword: string) => {
    if (selectedFile) {
      setSelectedFile({
        ...selectedFile,
        keywords: selectedFile.keywords.filter((k) => k !== keyword),
      });
    }
  };

  const handleAddKeyword = () => {
    if (selectedFile && newKeyword.trim() !== "") {
      setSelectedFile({
        ...selectedFile,
        keywords: [...selectedFile.keywords, newKeyword.trim()],
      });
      setNewKeyword("");
    }
  };

  const generateKeywords = (filename: string): string[] => {
    if (!filename) return [];

    const baseWords = filename
      .replace(/\.[^/.]+$/, "")
      .split(/[-_\s]+/)
      .filter((word) => word.length > 2)
      .map((word) => word.toLowerCase());

    const categoryBasedKeywords = {
      image: ["digital", "photo", "picture", "photography", "image"],
      quality: ["high-resolution", "hd", "professional", "original"],
      usage: ["stock", "commercial", "editorial", "creative"],
      technical: ["digital-asset", "media", "content"],
    };

    const additionalKeywords = [
      ...categoryBasedKeywords.image,
      ...categoryBasedKeywords.quality,
      ...categoryBasedKeywords.usage,
      ...categoryBasedKeywords.technical,
    ];

    const relatedWords = baseWords.flatMap((word) => {
      const related = [];
      if (word.match(/[^s]$/)) {
        related.push(`${word}s`);
      }
      if (word.endsWith("s")) {
        related.push(word.slice(0, -1));
      }
      return related;
    });

    const allKeywords = [
      ...new Set([...baseWords, ...additionalKeywords, ...relatedWords]),
    ];

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
          word.length > 2 && !stopWords.includes(word) && !word.match(/^\d+$/)
      )
      .slice(0, 15);
  };

  const handleGenerateMoreKeywords = () => {
    if (!selectedFile) return;

    const filenameKeywords = generateKeywords(selectedFile.fileName);
    const titleKeywords = selectedFile.title
      ? generateKeywords(selectedFile.title)
      : [];

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

  const handleDownloadTemplate = () => {
    const headers = [
      "filePath",
      "category",
      "title",
      "description",
      "keywords",
    ];

    const csvContent = [
      headers.join(","),
      "example.jpg,Photography,Beautiful Sunset,A stunning sunset photo,sunset;nature;landscape",
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "upload-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 border-b">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            size="icon"
          >
            <IconArrowLeft className="h-5 w-5" />
          </Button>
        </div>
        <h1 className="text-2xl font-semibold absolute left-1/2 transform -translate-x-1/2">
          Upload Dashboard
        </h1>
        <div className="flex gap-2">
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <IconUpload className="mr-2 h-4 w-4" />
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
              <UploadModal onUpload={handleFileUpload} disabled={isUploading} />

              {isUploading && Object.keys(uploadProgress).length > 0 && (
                <div className="space-y-4">
                  {Object.entries(uploadProgress).map(
                    ([fileName, progress]) => (
                      <div key={fileName} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="truncate">{fileName}</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    )
                  )}
                </div>
              )}

              {isUploading && (
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Uploading files...</span>
                </div>
              )}
            </DialogContent>
          </Dialog>
          <CSVUpload
            onUpload={(files) => {
              setFiles((prevFiles) => [...files, ...prevFiles]);
              toast.success("CSV files imported successfully!");
            }}
          />

          <Button variant="outline" onClick={handleDownloadTemplate}>
            <IconDownload className="mr-2 h-4 w-4" />
            Download Template
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left side - File grid */}
        <div ref={parentRef} className="w-2/3 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <IconX className="h-12 w-12 text-destructive mb-4" />
              <h3 className="font-semibold">Failed to load files</h3>
              <p className="text-muted-foreground">{error}</p>
            </div>
          ) : files.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <IconInbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No files uploaded yet</h3>
              <p className="text-muted-foreground">
                Upload files by clicking the button above or drag and drop them
                here
              </p>
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              <AnimatePresence>
                {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                  const startIndex = virtualRow.index * 4;
                  const rowFiles = files.slice(startIndex, startIndex + 4);

                  return (
                    <motion.div
                      key={virtualRow.index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: `${virtualRow.size}px`,
                        transform: `translateY(${virtualRow.start}px)`,
                      }}
                      className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
                    >
                      {rowFiles.map((file) => (
                        <FileGridItem
                          key={file._id}
                          file={file}
                          isSelected={selectedFile?._id === file._id}
                          onSelect={() => setSelectedFile(file)}
                          onDelete={() => handleDelete(file)}
                        />
                      ))}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
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
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
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
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add keyword"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                  />
                  <Button onClick={handleAddKeyword}>Add</Button>
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
                <IconDeviceFloppy className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
