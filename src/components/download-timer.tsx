// components/download-timer.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/download";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";
import { useAuth } from "@/lib/auth";

interface DownloadTimerProps {
  imageUrl: string;
  filename: string;
  imageId: string;
  className?: string;
}

export function DownloadTimer({
  imageUrl,
  filename,
  imageId,
  className,
}: DownloadTimerProps) {
  const { user } = useAuth();
  const [timeLeft, setTimeLeft] = React.useState(10);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadStarted, setDownloadStarted] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);
  const progress = ((10 - timeLeft) / 10) * 100;
  const [downloadCount, setDownloadCount] = React.useState(0);
  const maxDownloads = 10;

  // Load download count on mount
  React.useEffect(() => {
    const count = parseInt(
      localStorage.getItem(`download_count_${imageId}`) || "0"
    );
    setDownloadCount(count);
  }, [imageId]);

  // Timer effect
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (downloadStarted && timeLeft > 0 && !isPaused) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (downloadStarted && timeLeft === 0) {
      handleDownload();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, downloadStarted, isPaused]);

  const handleDownload = async () => {
    if (!user && downloadCount >= maxDownloads) {
      toast.error("Please sign in to download more images");
      return;
    }

    setIsDownloading(true);
    try {
      const success = await downloadImage(imageUrl, filename);
      if (success) {
        const newCount = downloadCount + 1;
        setDownloadCount(newCount);
        localStorage.setItem(`download_count_${imageId}`, newCount.toString());

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
      resetDownloadState();
    }
  };

  const resetDownloadState = () => {
    setIsDownloading(false);
    setDownloadStarted(false);
    setIsPaused(false);
    setTimeLeft(10);
  };

  const cancelDownload = () => {
    resetDownloadState();
    toast.success("Download cancelled");
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
    toast(isPaused ? "Download resumed" : "Download paused", {
      icon: isPaused ? "▶️" : "⏸️",
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full gap-6",
        className
      )}
    >
      {!user && downloadCount >= maxDownloads ? (
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
          <div className="relative">
            <Button
              className={cn(
                "relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600",
                "hover:from-blue-600 hover:to-blue-700 text-white shadow-lg",
                "hover:shadow-xl transition-all duration-300 px-8 py-4 rounded-xl",
                "min-w-[160px]"
              )}
              onClick={() => setDownloadStarted(true)}
              disabled={downloadStarted || isDownloading}
            >
              <AnimatePresence mode="wait">
                {isDownloading ? (
                  <motion.div
                    key="downloading"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="h-6 w-6 border-3 border-white border-t-transparent rounded-full animate-spin"
                  />
                ) : downloadStarted ? (
                  <motion.div
                    key="countdown"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [0.8, 1.2, 0.8],
                      opacity: 1,
                    }}
                    transition={{
                      scale: {
                        repeat: Infinity,
                        duration: 1.5,
                      },
                    }}
                    className="text-2xl font-bold"
                  >
                    {timeLeft}
                  </motion.div>
                ) : (
                  <motion.span
                    key="download-text"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-lg font-semibold flex items-center gap-2"
                  >
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
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            {downloadStarted && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle
                    className="stroke-blue-200"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="3"
                  />
                  <motion.circle
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: progress / 100 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="stroke-blue-500"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="3"
                    strokeLinecap="round"
                    transform="rotate(-90 50 50)"
                    style={{ strokeDasharray: "283 283" }}
                  />
                </svg>
              </motion.div>
            )}
          </div>

          <AnimatePresence>
            {downloadStarted && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-center space-y-3"
              >
                <p className="text-sm text-gray-600">
                  Starting download in{" "}
                  <span className="font-semibold text-blue-600">
                    {timeLeft}s
                  </span>
                </p>

                <div className="flex gap-2 justify-center">
                  <Button
                    onClick={togglePause}
                    variant="outline"
                    size="sm"
                    className="px-3 py-1"
                  >
                    {isPaused ? "Resume" : "Pause"}
                  </Button>

                  <Button
                    onClick={cancelDownload}
                    variant="outline"
                    size="sm"
                    className="px-3 py-1 text-red-500 hover:text-red-600"
                  >
                    Cancel
                  </Button>
                </div>

                {!user && (
                  <p className="text-sm text-gray-500">
                    {maxDownloads - downloadCount} downloads remaining
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
