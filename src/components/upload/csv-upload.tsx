// csv-upload.tsx
import * as React from "react";
import { FileSpreadsheet, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

import { toast } from "react-hot-toast";

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

interface CSVUploadProps {
  onUpload: (files: UploadedFile[]) => void;
}

// Add this type for XMLHttpRequest upload progress
type ProgressEvent = {
  loaded: number;
  total?: number;
};

export function CSVUpload({ onUpload }: CSVUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      // Use XMLHttpRequest instead of fetch for upload progress
      const xhr = new XMLHttpRequest();
      const promise = new Promise<{ files: UploadedFile[] }>(
        (resolve, reject) => {
          xhr.upload.addEventListener("progress", (event: ProgressEvent) => {
            if (event.total) {
              const progress = (event.loaded / event.total) * 100;
              setUploadProgress(Math.round(progress));
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
        }
      );

      xhr.open("POST", "/api/upload/csv");
      xhr.send(formData);

      const data = await promise;
      onUpload(data.files);
      setIsDialogOpen(false);
      setFile(null);
      toast.success("Files imported successfully!");
    } catch (error) {
      console.error("CSV Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to import CSV"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };
  //eslint-disable-next-line
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
      "/path/to/image.jpg,Photography,Beautiful Sunset,A stunning sunset photo,sunset;nature;landscape",
      "/path/to/another/image.png,Nature,Mountain View,Scenic mountain landscape,mountain;landscape;nature",
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          Upload CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload CSV File</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing local file paths and metadata. The
            files will be automatically uploaded to S3 and served via
            CloudFront.
            <div className="mt-2 text-sm text-muted-foreground">
              Required CSV format:
              <code className="block mt-1 p-2 bg-muted rounded-md">
                filePath,category,title,description,keywords
              </code>
              <ul className="mt-2 list-disc list-inside">
                <li>filePath: Full path to the local image file</li>
                <li>category: Image category (optional)</li>
                <li>title: Image title (optional)</li>
                <li>description: Image description (optional)</li>
                <li>keywords: Semicolon-separated keywords (optional)</li>
              </ul>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="csv-file">CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>

        {isUploading && (
          <div className="space-y-2">
            <Progress value={uploadProgress} className="w-full" />
            <p className="text-sm text-muted-foreground text-center">
              Uploading... {uploadProgress}%
            </p>
          </div>
        )}

        <Button onClick={handleUpload} disabled={!file || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Uploading...
            </>
          ) : (
            "Upload"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
