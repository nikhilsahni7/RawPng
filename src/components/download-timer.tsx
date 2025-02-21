// components/download-timer.tsx
"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/download";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useAuth } from "@/lib/auth";

interface DownloadButtonProps {
  imageUrl: string;
  filename: string;
  imageId: string;
  className?: string;
}

export function DownloadButton({
  imageUrl,
  filename,
  imageId,
  className,
}: DownloadButtonProps) {
  const { user } = useAuth();
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [globalDownloadCount, setGlobalDownloadCount] = React.useState(0);
  const maxDownloads = 10;

  // Load global download count on mount
  React.useEffect(() => {
    const count = parseInt(
      localStorage.getItem("global_download_count") || "0"
    );
    setGlobalDownloadCount(count);
  }, []);

  const handleDownload = async () => {
    if (!user && globalDownloadCount >= maxDownloads) {
      toast.error("Please sign in to download more images");
      return;
    }

    setIsDownloading(true);
    try {
      const success = await downloadImage(imageUrl, filename);
      if (success) {
        const newCount = globalDownloadCount + 1;
        setGlobalDownloadCount(newCount);
        localStorage.setItem("global_download_count", newCount.toString());

        await fetch(`/api/images/${imageId}/increment-downloads`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        toast.success("Download completed successfully");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error instanceof Error ? error.message : "Download failed");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full gap-6",
        className
      )}
    >
      {!user && globalDownloadCount >= maxDownloads ? (
        <div className="text-center space-y-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-red-500 font-medium">Download limit reached</p>
          <Button
            onClick={() => (window.location.href = "/signin")}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Sign in to download more
          </Button>
        </div>
      ) : (
        <>
          <Button
            className={cn(
              "relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600",
              "hover:from-blue-600 hover:to-blue-700 text-white shadow-lg",
              "hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-xl",
              "min-w-[160px]"
            )}
            onClick={handleDownload}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <div className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span className="text-lg font-semibold flex items-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                Download
              </span>
            )}
          </Button>

          {!user && (
            <p className="text-sm text-gray-500">
              {maxDownloads - globalDownloadCount} downloads remaining
            </p>
          )}
        </>
      )}
    </div>
  );
}
