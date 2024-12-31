/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ImageGridProps {
  images: any[];
}

export function ImageGrid({ images }: ImageGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {images.map((image) => (
        <Card key={image._id} className="group overflow-hidden">
          <Link href={`/image/${image._id}`} target="_blank">
            <CardContent className="p-0">
              <div className="relative aspect-square">
                <Image
                  src={image.cloudFrontUrl}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="flex h-full items-center justify-center">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-3">
              <div className="flex w-full items-center justify-between text-sm">
                <span className="font-medium text-black">{image.title}</span>
                <Badge
                  variant="outline"
                  className="border-blue-600 text-blue-600"
                >
                  {image.fileType.toUpperCase()}
                </Badge>
              </div>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  );
}
