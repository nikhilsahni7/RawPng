import { Badge } from "@/components/ui/badge";
import { FaTag } from "react-icons/fa";

interface CategoryTagsProps {
  categories: string[];
  onCategoryClick: (category: string) => void;
}

export function CategoryTags({
  categories,
  onCategoryClick,
}: CategoryTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((tag) => (
        <Badge
          key={tag}
          variant="secondary"
          onClick={() => onCategoryClick(tag)}
          className="flex items-center gap-1 cursor-pointer rounded-full px-3 py-1 text-sm hover:bg-blue-100 transition-colors duration-200"
        >
          <FaTag className="h-3 w-3" />
          {tag}
        </Badge>
      ))}
    </div>
  );
}
