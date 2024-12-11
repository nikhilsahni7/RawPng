// components/ImageActions.tsx
"use client";

import { Share2, Info, Link2, Twitter, Facebook } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useState } from "react";
import toast from "react-hot-toast";

export function ImageActions() {
  const [isShareOpen, setIsShareOpen] = useState(false);

  const handleCopyLink = async () => {
    const shareUrl = window.location.href;
    await navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard!");
  };

  const shareButtons = [
    {
      name: "Copy Link",
      icon: Link2,
      onClick: handleCopyLink,
      className: "bg-gray-600 hover:bg-gray-700",
    },
    {
      name: "WhatsApp",
      icon: FaWhatsapp,
      onClick: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(window.location.href)}`,
          "_blank"
        );
      },
      className: "bg-green-600 hover:bg-green-700",
    },
    {
      name: "Twitter",
      icon: Twitter,
      onClick: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        );
      },
      className: "bg-blue-400 hover:bg-blue-500",
    },
    {
      name: "Facebook",
      icon: Facebook,
      onClick: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            window.location.href
          )}`,
          "_blank"
        );
      },
      className: "bg-blue-600 hover:bg-blue-700",
    },
  ];

  return (
    <>
      <div className="flex gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsShareOpen(true)}
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Share</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Report</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <Dialog open={isShareOpen} onOpenChange={setIsShareOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              {shareButtons.map((button) => (
                <Button
                  key={button.name}
                  onClick={button.onClick}
                  className={`flex items-center gap-2 text-white ${button.className}`}
                >
                  <button.icon className="h-5 w-5" />
                  {button.name}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
