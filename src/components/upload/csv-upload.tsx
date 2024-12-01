"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Upload, CheckCircle } from "lucide-react";

export function CsvUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);

  const handleUpload = () => {
    if (!file) return;
    setIsUploading(true);
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false);
      setIsUploaded(true);
    }, 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 space-y-6">
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold">CSV Upload</h3>
          <p className="text-muted-foreground">
            Upload multiple files at once using a CSV file. Maximum 5000 entries
            per file.
          </p>
        </div>

        <Alert>
          <AlertDescription>
            Please make sure your CSV follows the required format. Download the
            template below.
          </AlertDescription>
        </Alert>

        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Download CSV Template
        </Button>

        <div className="space-y-4">
          <Label htmlFor="csv-file" className="text-lg font-medium">
            Upload CSV File
          </Label>
          <div className="flex items-center space-x-4">
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="flex-grow"
            />
            <Button
              onClick={handleUpload}
              disabled={!file || isUploading || isUploaded}
              className="min-w-[100px]"
            >
              {isUploading ? (
                <Upload className="mr-2 h-4 w-4 animate-bounce" />
              ) : isUploaded ? (
                <CheckCircle className="mr-2 h-4 w-4" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {isUploading
                ? "Uploading..."
                : isUploaded
                ? "Uploaded"
                : "Upload"}
            </Button>
          </div>
        </div>

        {file && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-muted p-4 rounded-md"
          >
            <p className="text-sm font-medium">Selected file: {file.name}</p>
            <p className="text-xs text-muted-foreground">
              Size: {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
