import * as React from "react";
// import Link from "next/link";
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
    {
      title: "Science & Technology",
      description: "Laboratory, research, and tech-related PNGs",
    },
    {
      title: "New Year Celebration",
      description: "Festive decorations and celebration graphics",
    },
    {
      title: "Nature & Wildlife",
      description: "Plants, animals, and natural elements",
    },
    {
      title: "Business & Finance",
      description: "Corporate and financial imagery",
    },
    {
      title: "Education & Learning",
      description: "Academic and educational resources",
    },
    {
      title: "Food & Cuisine",
      description: "Culinary and food-related graphics",
    },
  ],
  vector: [
    {
      title: "Abstract Shapes",
      description: "Modern geometric and fluid shapes",
    },
    {
      title: "Icons & Symbols",
      description: "Versatile icon sets and symbols",
    },
    {
      title: "Illustrations",
      description: "Hand-drawn and digital illustrations",
    },
    { title: "Backgrounds", description: "Vector patterns and backgrounds" },
    { title: "Characters", description: "People and character illustrations" },
    {
      title: "Infographics",
      description: "Data visualization and infographic elements",
    },
  ],
  images: [
    {
      title: "Stock Photos",
      description: "Professional photography collection",
    },
    { title: "Textures", description: "High-resolution texture images" },
    { title: "Mockups", description: "Product and brand mockups" },
    { title: "Landscapes", description: "Natural and urban landscapes" },
    {
      title: "Architecture",
      description: "Buildings and architectural photos",
    },
    { title: "Lifestyle", description: "Contemporary lifestyle photography" },
  ],
};

export function MainNav() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <FileImage className="w-4 h-4" />
            PNG
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.png.map((category) => (
                <ListItem
                  key={category.title}
                  title={category.title}
                  href={`/png/${category.title
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  {category.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <Vector className="w-4 h-4" />
            Vector
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.vector.map((category) => (
                <ListItem
                  key={category.title}
                  title={category.title}
                  href={`/vector/${category.title
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  {category.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="flex items-center gap-2">
            <Image className="w-4 h-4" />
            Images
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              {categories.images.map((category) => (
                <ListItem
                  key={category.title}
                  title={category.title}
                  href={`/images/${category.title
                    .toLowerCase()
                    .replace(/ /g, "-")}`}
                >
                  {category.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
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
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
