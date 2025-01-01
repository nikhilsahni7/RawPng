/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IFile } from "@/lib/models/file";

interface ImageGridProps {
  images: IFile[];
}

export function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="masonry masonry-sm masonry-md masonry-lg">
      {images.map((image) => {
        const aspectRatio = image.dimensions
          ? (image.dimensions.height / image.dimensions.width) * 100
          : 100;

        return (
          <div
            key={image._id as string}
            className="masonry-item break-inside-avoid pb-3"
          >
            <Card className="group overflow-hidden transition-transform hover:scale-[1.02]">
              <Link href={`/image/${image._id}`} target="_blank">
                <CardContent className="p-0">
                  <div className="relative w-full">
                    <div style={{ paddingBottom: `${aspectRatio}%` }} />
                    <Image
                      src={image.cloudFrontUrl}
                      alt={image.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover absolute top-0 left-0 transition-transform duration-300 group-hover:scale-105"
                      priority={false}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                        <h3 className="text-xs font-medium text-white truncate">
                          {image.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className="mt-1 text-xs bg-black/50 text-white border-white/30"
                        >
                          {image.fileType.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Link>
            </Card>
          </div>
        );
      })}
    </div>
  );
}
