"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2, Save, Upload } from "lucide-react";

interface MetadataFormProps {
  files: File[];
}

export function MetadataForm({ files }: MetadataFormProps) {
  const [keywords, setKeywords] = useState<string[]>([]);
  const [suggestedKeywords] = useState([
    "nature",
    "business",
    "technology",
    "abstract",
    "people",
    "lifestyle",
    "food",
    "travel",
    "medical",
    "education",
  ]);

  const addKeyword = (keyword: string) => {
    if (!keywords.includes(keyword)) {
      setKeywords([...keywords, keyword]);
    }
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const generateKeywords = () => {
    // Simulate AI keyword generation
    const newKeywords = suggestedKeywords.slice(0, 5);
    setKeywords([...new Set([...keywords, ...newKeywords])]);
  };

  if (files.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="p-6">
        <form className="space-y-6">
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-lg">
                  Title
                </Label>
                <Input id="title" placeholder="Enter title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category" className="text-lg">
                  Category
                </Label>
                <Select>
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                    <SelectItem value="people">People</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-lg">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                className="min-h-[100px] resize-y"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg">Keywords</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateKeywords}
                  className="group"
                >
                  <Wand2 className="mr-2 h-4 w-4 transition-transform group-hover:rotate-12" />
                  Generate Keywords
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-2">
                {keywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                    onClick={() => removeKeyword(keyword)}
                  >
                    {keyword} ×
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => addKeyword(keyword)}
                  >
                    + {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <Button variant="outline" type="button" className="w-[48%]">
              <Save className="mr-2 h-4 w-4" />
              Save as Draft
            </Button>
            <Button type="submit" className="w-[48%]">
              <Upload className="mr-2 h-4 w-4" />
              Upload Files
            </Button>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}
