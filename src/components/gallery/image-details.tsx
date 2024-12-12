import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Trash2,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit,
  Save,
  X,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
interface ImageDetailsProps {
  image: {
    _id: string;
    cloudFrontUrl: string;
    title: string;
    downloads: number;
    fileType: string;
    dimensions: {
      width: number;
      height: number;
    };
    description: string;
    keywords: string[];
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
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(image.title);
  const [editedDescription, setEditedDescription] = useState(image.description);
  const [editedKeywords, setEditedKeywords] = useState(
    image.keywords.join(", ")
  );

  const handleDelete = async () => {
    await fetch(`/api/upload/${image._id}`, {
      method: "DELETE",
    });
    toast.success("Image deleted successfully");
    onClose();
  };

  const handleDownload = () => {
    window.open(image.cloudFrontUrl, "_blank");
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    await fetch(`/api/upload/${image._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: editedTitle,
        description: editedDescription,
        keywords: editedKeywords.split(",").map((k) => k.trim()),
      }),
    });

    toast.success("Image details updated successfully");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square">
            <Image
              src={image.cloudFrontUrl}
              alt={image.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col space-y-4">
            <div>
              {isEditing ? (
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
              ) : (
                <h2 className="text-2xl font-bold">{image.title}</h2>
              )}
              {isEditing ? (
                <Textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="mt-2"
                />
              ) : (
                <p className="text-muted-foreground mt-2">
                  {image.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Dimensions</p>
                <p className="text-sm text-muted-foreground">
                  {image.dimensions.width} x {image.dimensions.height}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Format</p>
                <p className="text-sm text-muted-foreground">
                  {image.fileType.toUpperCase()}
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
              <p className="text-sm font-medium mb-2">Keywords</p>
              {isEditing ? (
                <Input
                  value={editedKeywords}
                  onChange={(e) => setEditedKeywords(e.target.value)}
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {image.keywords.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex space-x-2 mt-auto">
              <Button className="flex-1" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              {isEditing ? (
                <>
                  <Button variant="secondary" onClick={handleSave}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="secondary" onClick={handleEditToggle}>
                    <X className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <Button variant="secondary" onClick={handleEditToggle}>
                  <Edit className="h-4 w-4" />
                </Button>
              )}
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
