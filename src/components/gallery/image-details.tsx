import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Download, ChevronLeft, ChevronRight } from "lucide-react";

interface ImageDetailsProps {
  image: {
    id: string;
    src: string;
    title: string;
    downloads: number;
    category: string;
    dimensions: string;
    format: string;
    uploadDate: string;
    description: string;
    tags: string[];
  };
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export function ImageDetails({
  image,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: ImageDetailsProps) {
  const handleDelete = async () => {
    // Implement delete functionality
    console.log("Deleting image:", image.id);
    onClose();
  };

  const handleDownload = async () => {
    // Implement download functionality
    console.log("Downloading image:", image.id);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <Image
              src={image.src}
              alt={image.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              <h2 className="text-2xl font-bold">{image.title}</h2>
              <p className="text-muted-foreground mt-2">{image.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Dimensions</p>
                <p className="text-sm text-muted-foreground">
                  {image.dimensions}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Format</p>
                <p className="text-sm text-muted-foreground">{image.format}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Upload Date</p>
                <p className="text-sm text-muted-foreground">
                  {image.uploadDate}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Downloads</p>
                <p className="text-sm text-muted-foreground">
                  {image.downloads}
                </p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex space-x-4 mt-auto">
              <Button className="flex-1" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <Button
            onClick={onPrevious}
            disabled={!hasPrevious}
            variant="outline"
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Previous
          </Button>
          <Button onClick={onNext} disabled={!hasNext} variant="outline">
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
