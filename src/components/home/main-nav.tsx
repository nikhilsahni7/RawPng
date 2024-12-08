import * as React from "react";
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

const categories = {
  png: [
    { title: "Christmas" },
    { title: "New Year" },
    { title: "Nature & Wildlife" },
    { title: "Business & Finance" },
    { title: "Education & Learning" },
    { title: "Food & Cuisine" },
  ],
  vector: [
    { title: "Abstract Shapes" },
    { title: "Icons & Symbols" },
    { title: "Illustrations" },
    { title: "Backgrounds" },
    { title: "Characters" },
    { title: "Infographics" },
  ],
  images: [
    { title: "Stock Photos" },
    { title: "Textures" },
    { title: "Mockups" },
    { title: "Landscapes" },
    { title: "Architecture" },
    { title: "Lifestyle" },
  ],
};

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        {Object.entries(categories).map(([key, items]) => (
          <NavigationMenuItem key={key}>
            <NavigationMenuTrigger className="flex items-center gap-2">
              {key === "png" && <FileImage className="w-4 h-4" />}
              {key === "vector" && <Vector className="w-4 h-4" />}
              {key === "images" && <Image className="w-4 h-4" />}
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {items.map((category) => (
                  <ListItem
                    key={category.title}
                    title={category.title}
                    href={`/${key}/${category.title
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                  />
                ))}
              </ul>
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
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
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
