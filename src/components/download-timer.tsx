// components/download-timer.tsx
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { downloadImage } from "@/lib/download";
import { cn } from "@/lib/utils";
import { toast } from "react-hot-toast";

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
  const [timeLeft, setTimeLeft] = React.useState(10);
  const [isDownloading, setIsDownloading] = React.useState(false);
  const [downloadStarted, setDownloadStarted] = React.useState(false);
  const progress = ((10 - timeLeft) / 10) * 100;

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (downloadStarted && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (downloadStarted && timeLeft === 0) {
      handleDownload();
    }
    return () => clearTimeout(timer);
  }, [timeLeft, downloadStarted]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const url = new URL(imageUrl);
      if (!url.protocol.startsWith("http")) {
        throw new Error("Invalid URL protocol");
      }

      const success = await downloadImage(imageUrl, filename);
      if (!success) {
        throw new Error("Download failed");
      }

      await fetch(`/api/images/${imageId}/increment-downloads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast.success("Download completed successfully");
    } catch (error) {
      console.error("Download error:", error);
      toast.error(error instanceof Error ? error.message : "Download failed");
    } finally {
      setIsDownloading(false);
      setDownloadStarted(false);
      setTimeLeft(10);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full gap-4",
        className
      )}
    >
      <div className="relative">
        <Button
          className="bg-blue-500 text-white hover:bg-blue-600 px-6 py-3 rounded"
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
                className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
            ) : downloadStarted ? (
              <motion.div
                key="countdown"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{
                  scale: [0.8, 1, 0.8],
                  opacity: 1,
                }}
                transition={{
                  scale: {
                    repeat: Infinity,
                    duration: 2,
                  },
                }}
                className="text-lg font-semibold"
              >
                {timeLeft}
              </motion.div>
            ) : (
              <motion.span
                key="download-text"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                whileHover={{ scale: 1.1 }}
                className="text-lg font-semibold rounded-lg"
              >
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
              <motion.circle
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress / 100 }}
                transition={{ duration: 0.5, ease: "linear" }}
                className="stroke-blue-500"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
              />
            </svg>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {downloadStarted && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm text-gray-600 text-center"
          >
            Starting download in {timeLeft}s
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
