"use client";

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const images = [
  {
    id: "9059969",
    title: "Happy Birthday Golden Balloon",
    type: "PNG",
    url: "https://m.media-amazon.com/images/I/71x8XkiCVbS.jpg",
    category: "Celebration",
  },
  {
    id: "9059970",
    title: "Nature Landscape",
    type: "Image",
    url: "https://images.unsplash.com/photo-1497060306724-d080265be8a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmF0dXJlJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
    category: "Nature",
  },
  {
    id: "9059971",
    title: "Icon Set",
    type: "Vector",
    url: "https://plus.unsplash.com/premium_vector-1731294582156-08b098416dee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGljb24lMjBzZXR8ZW58MHx8MHx8fDA%3D",
    category: "Icons",
  },
  {
    id: "9059972",
    title: "Tech Background",
    type: "PNG",
    url: "https://plus.unsplash.com/premium_vector-1709987121189-46e26718517c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVjaCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    category: "Technology",
  },
  {
    id: "9059973",
    title: "Geometric Pattern",
    type: "Vector",
    url: "https://images.unsplash.com/photo-1572756317709-fe9c15ced298?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2VvbWV0cmljJTIwcGF0dGVybnxlbnwwfHwwfHx8MA%3D%3D",
    category: "Pattern",
  },
  {
    id: "9059974",
    title: "Nature Photography",
    type: "Image",
    url: "https://plus.unsplash.com/premium_photo-1669472897414-098c530ffb64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlJTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
    category: "Nature",
  },
  {
    id: "9059975",
    title: "Business Infographic",
    type: "Vector",
    url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YnVzaW5lc3MlMjBpbmZvZ3JhcGhpY3xlbnwwfHwwfHx8MA%3D%3D",
    category: "Business",
  },
  {
    id: "9059976",
    title: "Watercolor Texture",
    type: "PNG",
    url: "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2F0ZXJjb2xvciUyMHRleHR1cmV8ZW58MHx8MHx8fDA%3D",
    category: "Texture",
  },
];

export function ImageGrid() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {images.map((image) => (
        <Card key={image.id} className="group overflow-hidden">
          <Link
            href={`/image/${image.title.toLowerCase().replace(/ /g, "-")}-${
              image.id
            }`}
          >
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
          </Link>
        </Card>
      ))}
    </div>
  );
}
