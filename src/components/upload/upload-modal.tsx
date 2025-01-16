/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface UploadModalProps {
  onUpload: (files: File[]) => Promise<void>;
  disabled?: boolean;
}

// Extend HTMLInputElement to include directory attributes
declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    mozdirectory?: string;
    directory?: string;
  }
}

export function UploadModal({ onUpload, disabled }: UploadModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [fileCount, setFileCount] = React.useState(0);

  const processFiles = async (files: File[]) => {
    setIsProcessing(true);
    setFileCount(files.length);

    // Filter valid images
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size < 20 * 1024 * 1024 // 20MB limit
    );

    if (validFiles.length !== files.length) {
      toast.error(
        `${files.length - validFiles.length} files were skipped (invalid type or too large)`
      );
    }

    await onUpload(validFiles);
    setIsProcessing(false);
    setFileCount(0);
  };

  const dropzoneOptions: DropzoneOptions = {
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".svg", ".webp"],
    },
    multiple: true,
    useFsAccessApi: false,
    onDrop: processFiles,
    disabled: disabled || isProcessing,
    noClick: true,
    maxSize: 20 * 1024 * 1024, // 20MB
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions);

  // Handle file input change for directory upload
  const handleDirectorySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  // Handle file input change for file(s) upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center ${
        isDragActive ? "border-primary bg-primary/10" : "border-border"
      }`}
    >
      {/* Hidden input for directory upload */}
      <input
        type="file"
        id="directory-upload"
        onChange={handleDirectorySelect}
        className="hidden"
        directory=""
        webkitdirectory=""
        mozdirectory=""
        accept="image/*"
      />

      {/* Hidden input for file(s) upload */}
      <input
        type="file"
        id="file-upload"
        onChange={handleFileSelect}
        className="hidden"
        multiple
        accept="image/*"
      />

      {/* Dropzone input */}
      <input {...getInputProps()} />

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10">
          <CloudUpload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">
            {isDragActive ? "Drop files here" : "Drag & Drop files or folders"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Support for single or multiple files, and entire folders
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={disabled}
          >
            Select File(s)
          </Button>
          <Button
            variant="outline"
            onClick={() => document.getElementById("directory-upload")?.click()}
            disabled={disabled}
          >
            Select Folder
          </Button>
        </div>
      </div>
    </div>
  );
}
