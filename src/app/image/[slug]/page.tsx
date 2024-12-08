import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Info, Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DownloadTimer } from "@/components/download-timer";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// This would come from your database in the future
const images = [
  {
    id: "9059969",
    title: "Happy Birthday Golden Balloon",
    type: "PNG",
    url: "https://m.media-amazon.com/images/I/71x8XkiCVbS.jpg",
    size: "2.5 MB",
    dimensions: "3000 x 2000 px",
    description:
      "Beautiful happy birthday text made of gold foil balloons, perfect for celebration cards, party invitations, and social media posts.",
    keywords: [
      "birthday",
      "celebration",
      "balloon",
      "golden",
      "party",
      "greeting",
      "foil",
      "metallic",
    ],
    license: "Commercial",
    downloads: 1234,
    likes: 567,
    author: "Pngly",
    dateUploaded: "2023-12-08",
  },
  {
    id: "9059970",
    title: "Nature Landscape",
    type: "Image",
    url: "https://images.unsplash.com/photo-1497060306724-d080265be8a0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8bmF0dXJlJTIwbGFuZHNjYXBlfGVufDB8fDB8fHww",
    size: "4.2 MB",
    dimensions: "4000 x 3000 px",
    description:
      "A beautiful nature landscape with a clear blue sky, green trees, and a calm river flowing through the forest.",
    keywords: [
      "nature",
      "landscape",
      "river",
      "trees",
      "forest",
      "water",
      "scenic",
      "outdoors",
    ],
    license: "Commercial",
    downloads: 2345,
    likes: 678,
    author: "Pngly",
    dateUploaded: "2023-12-08",
  },

  {
    id: "9059971",
    title: "Icon Set",
    type: "Vector",
    url: "https://plus.unsplash.com/premium_vector-1731294582156-08b098416dee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGljb24lMjBzZXR8ZW58MHx8MHx8fDA%3D",
    size: "1.5 MB",
    dimensions: "1000 x 1000 px",
    description:
      "A set of 10 icons for web and mobile applications, including user profile, settings, notifications, and more.",
    keywords: [
      "icon",
      "set",
      "web",
      "mobile",
      "application",
      "profile",
      "settings",
      "notifications",
    ],
    license: "Commercial",
    downloads: 3456,
    likes: 789,
    author: "Pngly",
    dateUploaded: "2023-12-08",
  },
  {
    id: "9059972",
    title: "Tech Background",
    type: "PNG",
    url: "https://plus.unsplash.com/premium_vector-1709987121189-46e26718517c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGVjaCUyMGJhY2tncm91bmR8ZW58MHx8MHx8fDA%3D",
    size: "3.0 MB",
    dimensions: "3500 x 2500 px",
    description:
      "A tech background with a circuit board pattern, perfect for technology-themed designs, presentations, and websites.",
    keywords: [
      "tech",
      "technology",
      "background",
      "circuit",
      "board",
      "pattern",
      "digital",
      "electronics",
    ],
    license: "Commercial",
    downloads: 4567,
    likes: 890,
    author: "Pngly",
    dateUploaded: "2023-12-08",
  },
  {
    id: "9059973",
    title: "Geometric Pattern",
    type: "Vector",
    url: "https://images.unsplash.com/photo-1572756317709-fe9c15ced298?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Z2VvbWV0cmljJTIwcGF0dGVybnxlbnwwfHwwfHx8MA%3D%3D",
    size: "2.8 MB",
    dimensions: "2000 x 2000 px",
    description:
      "A geometric pattern with colorful shapes and lines, great for backgrounds, textiles, and modern designs.",
    keywords: [
      "geometric",
      "pattern",
      "shapes",
      "lines",
      "abstract",
      "colorful",
      "modern",
      "background",
    ],
    license: "Commercial",
    downloads: 5678,
    likes: 901,
    author: "Pngly",
    dateUploaded: "2023-12-08",
  },
  {
    id: "9059974",
    title: "Nature Photography",
    type: "Image",
    url: "https://plus.unsplash.com/premium_photo-1669472897414-098c530ffb64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bmF0dXJlJTIwcGhvdG9ncmFwaHl8ZW58MHx8MHx8fDA%3D",
    size: "5.0 MB",
    dimensions: "5000 x 4000 px",
    description:
      "A stunning nature photography shot of a mountain landscape with a clear blue sky and green trees.",
    keywords: [
      "nature",
      "photography",
      "mountain",
      "landscape",
      "sky",
      "trees",
      "scenic",
      "outdoors",
    ],
    license: "Commercial",
    downloads: 6789,
    likes: 912,
    author: "Pngly",
    dateUploaded: "2023-12-08",
  },
];

const getImageDetails = (slug: string) => {
  const [id] = slug.split("-").reverse();
  return images.find((img) => img.id === id);
};

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const imageDetails = getImageDetails(params.slug);

  if (!imageDetails) {
    return {
      title: "Image Not Found",
      description: "The requested image could not be found.",
    };
  }

  return {
    title: `${imageDetails.title} - Pngly`,
    description: imageDetails.description,
    keywords: imageDetails.keywords,
    openGraph: {
      title: `${imageDetails.title} - Pngly`,
      description: imageDetails.description,
      type: "article",
      publishedTime: imageDetails.dateUploaded,
      authors: [imageDetails.author],
    },
    twitter: {
      card: "summary_large_image",
      title: `${imageDetails.title} - Pngly`,
      description: imageDetails.description,
    },
  };
}

export default function ImagePage({ params }: PageProps) {
  const imageDetails = getImageDetails(params.slug);

  if (!imageDetails) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        {/* Image Preview Section */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-2">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
                <Image
                  src={imageDetails.url}
                  alt={imageDetails.title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Like</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{imageDetails.downloads} Downloads</span>
              <span>•</span>
              <span>{imageDetails.likes} Likes</span>
            </div>
          </div>
        </div>

        {/* Image Details Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold">{imageDetails.title}</h1>
            <p className="mt-2 text-muted-foreground">
              by{" "}
              <span className="font-medium text-foreground">
                {imageDetails.author}
              </span>
            </p>
          </div>

          <DownloadTimer
            imageUrl={imageDetails.url}
            filename={`${imageDetails.title
              .toLowerCase()
              .replace(/ /g, "-")}.${imageDetails.type.toLowerCase()}`}
          />

          <Card>
            <CardContent className="grid gap-4 p-6">
              <div className="grid gap-2">
                <div className="font-semibold">File Details</div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium">{imageDetails.type}</div>
                  <div className="text-muted-foreground">Size</div>
                  <div className="font-medium">{imageDetails.size}</div>
                  <div className="text-muted-foreground">Dimensions</div>
                  <div className="font-medium">{imageDetails.dimensions}</div>
                  <div className="text-muted-foreground">License</div>
                  <div className="font-medium">{imageDetails.license}</div>
                  <div className="text-muted-foreground">Uploaded</div>
                  <div className="font-medium">{imageDetails.dateUploaded}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <div className="font-semibold">Description</div>
            <p className="text-sm text-muted-foreground">
              {imageDetails.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="font-semibold">Keywords</div>
            <div className="flex flex-wrap gap-2">
              {imageDetails.keywords.map((keyword) => (
                <Badge
                  key={keyword}
                  variant="secondary"
                  className="rounded-full px-3 py-1"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
