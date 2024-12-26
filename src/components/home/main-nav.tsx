"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Image, VideoIcon as Vector, FileImage } from "lucide-react";
import axios from "axios";
import { Category, GroupedCategories } from "@/types/category";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export function MainNav() {
  const [categories, setCategories] = useState<GroupedCategories>({
    png: [],
    vector: [],
    image: [],
  });
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>({
    png: "",
    vector: "",
    image: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("/api/categories/navbar");
        const allCategories = response.data;

        const grouped = allCategories.reduce<GroupedCategories>(
          (acc, category) => {
            if (acc[category.type]) {
              acc[category.type].push(category);
            }
            return acc;
          },
          { png: [], vector: [], image: [] }
        );

        setCategories(grouped);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const getFilteredCategories = (type: string, items: Category[]) => {
    const query = searchQueries[type]?.toLowerCase() || "";
    return items.filter((item) => item.name.toLowerCase().includes(query));
  };

  const handleSearchChange = (type: string, value: string) => {
    setSearchQueries((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList className="gap-2">
        {(
          Object.entries(categories) as [keyof GroupedCategories, Category[]][]
        ).map(([key, items]) => (
          <NavigationMenuItem key={key}>
            <NavigationMenuTrigger className="flex items-center gap-2 font-medium px-4 py-2">
              {key === "png" && <FileImage className="w-4 h-4" />}
              {key === "vector" && <Vector className="w-4 h-4" />}
              {key === "image" && <Image className="w-4 h-4" />}
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-[500px] p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder={`Search ${key} categories...`}
                      className="pl-8 pr-8"
                      value={searchQueries[key] || ""}
                      onChange={(e) => handleSearchChange(key, e.target.value)}
                    />
                    {searchQueries[key] && (
                      <button
                        onClick={() => handleSearchChange(key, "")}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
                <ul className="grid w-full gap-2 grid-cols-2 max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                  {getFilteredCategories(key, items).map((category) => (
                    <ListItem
                      key={category._id}
                      title={category.name}
                      href={`/${key}/${category.name
                        .toLowerCase()
                        .replace(/ /g, "-")}`}
                    />
                  ))}
                </ul>
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none rounded-md px-3 py-2 text-sm leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
