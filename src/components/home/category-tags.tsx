// import { Badge } from "@/components/ui/badge";

interface Category {
  _id: string;
  name: string;
  active: boolean;
}

interface CategoryTagsProps {
  categories: Category[];
  onCategoryClick: (category: string) => void;
}

export function CategoryTags({
  categories,
  onCategoryClick,
}: CategoryTagsProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {categories.map((category) => (
        <button
          key={category._id}
          onClick={() => onCategoryClick(category.name)}
          className={`
            px-3 py-1 
            rounded-full 
            text-sm font-medium 
            bg-blue-100 hover:bg-blue-200 
            text-gray-800 
            transition-colors
          `}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
}
