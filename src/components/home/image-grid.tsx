"use client";

import Image from "next/image";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const images = [
  {
    id: 1,
    title: "Modern Abstract Shapes",
    type: "PNG",
    url: "https://images.unsplash.com/photo-1458682625221-3a45f8a844c7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    category: "Abstract",
  },
  {
    id: 2,
    title: "Nature Landscape",
    type: "Image",
    url: "https://images.unsplash.com/photo-1497060306724-d080265be8a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmF0dXJlJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
    category: "Nature",
  },
  {
    id: 3,
    title: "Icon Set",
    type: "Vector",
    url: "https://plus.unsplash.com/premium_vector-1731294582156-08b098416dee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGljb24lMjBzZXR8ZW58MHx8MHx8fDA%3D",
    category: "Icons",
  },
  {
    id: 4,
    title: "Tech Background",
    type: "PNG",
    url: "https://plus.unsplash.com/premium_vector-1709987121189-46e26718517c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVjaCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    category: "Technology",
  },
  {
    id: 5,
    title: "Geometric Pattern",
    type: "Vector",
    url: "https://images.unsplash.com/photo-1572756317709-fe9c15ced298?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2VvbWV0cmljJTIwcGF0dGVybnxlbnwwfHwwfHx8MA%3D%3D",
    category: "Pattern",
  },
  {
    id: 6,
    title: "Nature Photography",
    type: "Image",
    url: "https://plus.unsplash.com/premium_photo-1669472897414-098c530ffb64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlJTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
    category: "Nature",
  },
];

export function ImageGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {images.map((image) => (
        <Card key={image.id} className="group overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-square">
              <Image
                src={image.url}
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
                {image.type}
              </Badge>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
