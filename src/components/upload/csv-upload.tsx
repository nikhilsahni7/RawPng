// csv-upload.tsx
import * as React from "react";
import { FileSpreadsheet } from "lucide-react";
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

export function CSVUpload({ onUpload }: CSVUploadProps) {
  const [file, setFile] = React.useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload/csv", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onUpload(data.files);
      setIsDialogOpen(false);
      setFile(null);
      toast.success("Files imported successfully!");
    } catch (error) {
      console.error("CSV Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to import CSV"
      );
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
          />
        </div>
        <Button onClick={handleUpload} disabled={!file}>
          Upload
        </Button>
      </DialogContent>
    </Dialog>
  );
}
