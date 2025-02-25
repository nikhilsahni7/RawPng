import { useState, useEffect } from "react";
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

// Updated ImageDetails component
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImageDetailsProps {
  image: {
    _id: string;
    cloudFrontUrl: string;
    title: string;
    category: string;
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
  onDelete?: () => void;
}

interface Category {
  _id: string;
  name: string;
  active: boolean;
}

export function ImageDetails({
  image,
  onClose,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  onDelete,
}: ImageDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedKeywords, setEditedKeywords] = useState("");
  const [editedCategory, setEditedCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (image) {
      setEditedTitle(image.title);
      setEditedDescription(image.description);
      setEditedKeywords(image.keywords.join(", "));
      setEditedCategory(image.category);
      setIsEditing(false); // Reset editing mode when switching images
    }
  }, [image]);

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  if (!image) {
    return null;
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmed) return;

    try {
      await fetch(`/api/upload/${image._id}`, {
        method: "DELETE",
      });
      toast.success("Image deleted successfully");

      // If there's a custom delete handler (for batch operations), use it
      if (onDelete) {
        onDelete();
      } else {
        // Otherwise just close the details view
        onClose();
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to delete image");
    }
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
        category: editedCategory,
      }),
    });

    toast.success("Image details updated successfully");
    setIsEditing(false);
  };
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{image.title}</h2>
          <div className="flex gap-2">
            {hasPrevious && (
              <Button variant="outline" onClick={onPrevious}>
                Previous
              </Button>
            )}
            {hasNext && (
              <Button variant="outline" onClick={onNext}>
                Next
              </Button>
            )}
            <Button variant="destructive" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="relative aspect-square p-4">
            <Image
              src={image.cloudFrontUrl}
              alt={image.title}
              fill
              className="object-cover rounded-lg"
              onError={(e) => {
                console.log("Error loading image", e);
              }}
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
              <p className="text-sm font-medium">Category</p>
              {isEditing ? (
                <Select
                  value={editedCategory}
                  onValueChange={setEditedCategory}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category.name}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="default">{image.category}</Badge>
              )}
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
