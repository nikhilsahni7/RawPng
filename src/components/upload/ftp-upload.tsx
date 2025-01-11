"use client";

import * as React from "react";
import { Server, Loader2 } from "lucide-react";
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

interface FTPUploadProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onUpload: (files: any[]) => void;
}

export function FTPUpload({ onUpload }: FTPUploadProps) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [ftpConfig, setFtpConfig] = React.useState({
    host: "",
    user: "",
    password: "",
    path: "/",
  });

  const handleUpload = async () => {
    setIsUploading(true);
    setProgress(0);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 300000); // 5 minute timeout

      const response = await fetch("/api/upload/ftp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(ftpConfig),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      onUpload(data.files);
      setIsDialogOpen(false);
      toast.success(
        `Successfully imported ${data.files.length} files from FTP!`
      );
    } catch (error) {
      console.error("FTP Upload failed:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to import from FTP"
      );
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Server className="mr-2 h-4 w-4" />
          FTP Upload
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload from FTP Server</DialogTitle>
          <DialogDescription>
            Connect to an FTP server to import files automatically. All images
            will be processed and optimized during import.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="ftp-host">FTP Host</Label>
            <Input
              id="ftp-host"
              value={ftpConfig.host}
              onChange={(e) =>
                setFtpConfig({ ...ftpConfig, host: e.target.value })
              }
              placeholder="ftp.example.com"
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="ftp-user">Username</Label>
            <Input
              id="ftp-user"
              value={ftpConfig.user}
              onChange={(e) =>
                setFtpConfig({ ...ftpConfig, user: e.target.value })
              }
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="ftp-password">Password</Label>
            <Input
              id="ftp-password"
              type="password"
              value={ftpConfig.password}
              onChange={(e) =>
                setFtpConfig({ ...ftpConfig, password: e.target.value })
              }
              disabled={isUploading}
            />
          </div>

          <div>
            <Label htmlFor="ftp-path">Directory Path</Label>
            <Input
              id="ftp-path"
              value={ftpConfig.path}
              onChange={(e) =>
                setFtpConfig({ ...ftpConfig, path: e.target.value })
              }
              placeholder="/path/to/files"
              disabled={isUploading}
            />
          </div>

          {isUploading && (
            <div className="space-y-2">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground text-center">
                Importing files... {progress}%
              </p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={
              isUploading ||
              !ftpConfig.host ||
              !ftpConfig.user ||
              !ftpConfig.password
            }
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Importing Files...
              </>
            ) : (
              "Import Files"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
