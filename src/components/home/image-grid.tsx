/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { generateImageUrl } from "@/lib/api/images";
import { IFile } from "@/lib/models/file";
import { ImageDetails } from "@/types/image";

interface ImageGridProps {
  images: IFile[] | ImageDetails[];
}

export function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="masonry">
      {images.map((image) => {
        const aspectRatio = image.dimensions
          ? (image.dimensions.height / image.dimensions.width) * 100
          : 100;

        return (
          <div key={image._id as string} className="masonry-item">
            <Link
              href={generateImageUrl(image as ImageDetails)}
              target="_blank"
            >
              <div className="relative w-full">
                <div style={{ paddingBottom: `${aspectRatio}%` }} />
                <Image
                  src={image.cloudFrontUrl}
                  alt={image.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover absolute top-0 left-0"
                  priority={false}
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <h3 className="text-xs font-medium text-white truncate">
                      {image.title}
                    </h3>
                    <span className="inline-block mt-1 px-2 py-0.5 text-xs text-white bg-black/50 border border-white/30">
                      {image.fileType.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
}
