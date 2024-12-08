import { Badge } from "@/components/ui/badge";
import { FaTag } from "react-icons/fa";

const popularTags = [
  "Christmas",
  "Happy New Year",
  "Winter",
  "2024",
  "Santa Claus",
  "New Year Party",
  "Happy Birthday",
  "Border Frame",
  "Background",
  "Abstract",
];

export function CategoryTags() {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {popularTags.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          className="flex items-center gap-1 cursor-pointer rounded-full px-3 py-1 text-sm hover:bg-blue-100 transition-colors duration-200"
        >
          <FaTag className="h-3 w-3" />
          {tag}
        </Badge>
      ))}
    </div>
  );
}
