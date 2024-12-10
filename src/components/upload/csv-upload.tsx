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
import Papa from "papaparse";

interface UploadedFile {
  id: string;
  name: string;
  title?: string;
  description?: string;
  category?: string;
  keywords: string[];
  uploadDate: Date;
  preview: string;
  fileType: string;
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

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data = results.data as any[];
        const uploadedFiles = data.map((row) => {
          const keywords = row.keywords
            ? row.keywords.split(",").map((k: string) => k.trim())
            : [];
          return {
            id: generateUniqueId(),
            name: row.fileName,
            title: row.title,
            description: row.description,
            category: row.category,
            keywords: keywords,
            uploadDate: new Date(),
            preview: "", // No preview available for CSV imports
            fileType: getFileTypeFromName(row.fileName),
          } as UploadedFile;
        });
        onUpload(uploadedFiles);
        setIsDialogOpen(false);
        setFile(null);
      },
    });
  };

  const getFileTypeFromName = (fileName: string): string => {
    const extension = fileName.split(".").pop()?.toLowerCase();
    if (extension === "png") return "png";
    if (extension === "jpg" || extension === "jpeg") return "jpeg";
    if (extension === "svg") return "vector";
    return extension || "unknown";
  };

  const generateUniqueId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
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
            Upload a CSV file to import multiple entries at once.
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
