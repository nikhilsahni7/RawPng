import * as React from "react";
import { useDropzone, DropzoneOptions } from "react-dropzone";
import { CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadModalProps {
  onUpload: (files: File[]) => Promise<void>;
  disabled?: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function UploadModal({ onUpload, disabled }: UploadModalProps) {
  const dropzoneOptions: DropzoneOptions = {
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif"],
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "text/csv": [".csv"],
    },
    onDrop: (acceptedFiles) => {
      onUpload(acceptedFiles);
    },
  };

  const { getRootProps, getInputProps, isDragActive } =
    useDropzone(dropzoneOptions);

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center ${
        isDragActive ? "border-primary bg-primary/10" : "border-border"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 rounded-full bg-primary/10">
          <CloudUpload className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-medium">
            {isDragActive
              ? "Drop the files here"
              : "Drag & Drop files or Browse"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Upload multiple files at once
          </p>
        </div>
        <Button asChild variant="outline">
          <label className="cursor-pointer">Browse Files</label>
        </Button>
      </div>
    </div>
  );
}
