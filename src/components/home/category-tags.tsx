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
    <div className="flex flex-wrap gap-4 justify-center">
      {popularTags.map((tag) => (
        <Badge
          key={tag}
          className="flex items-center gap-2 cursor-pointer rounded-full bg-blue-600 px-4 py-2 text-lg text-white shadow-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <FaTag className="h-5 w-5" />
          {tag}
        </Badge>
      ))}
    </div>
  );
}
