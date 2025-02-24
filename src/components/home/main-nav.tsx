"use client";

import * as React from "react";
import { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { LogOut } from "lucide-react";
import axios from "axios";
import { Category, GroupedCategories } from "@/types/category";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

export function MainNav() {
  const { user, signout } = useAuth();
  const [searchQueries, setSearchQueries] = useState<Record<string, string>>(
    {}
  );

  const { data: categories = { png: [], vector: [], image: [] }, isLoading } =
    useQuery({
      queryKey: ["navbarCategories"],
      queryFn: async () => {
        const response = await axios.get<Category[]>("/api/categories/navbar");
        const grouped = response.data.reduce<GroupedCategories>(
          (acc, category) => {
            const type = category.type as keyof GroupedCategories;
            acc[type] = acc[type] || [];
            acc[type].push(category);
            return acc;
          },
          { png: [], vector: [], image: [] }
        );
        return grouped;
      },
      refetchInterval: 30000,
      staleTime: 10000,
    });

  if (isLoading) {
    return (
      <div className="flex items-center gap-6 flex-1">
        <NavigationMenu className="hidden md:block">
          <NavigationMenuList className="gap-6">
            {["PNG", "Vector", "Image"].map((type) => (
              <NavigationMenuItem key={type}>
                <div className="flex items-center space-x-4">
                  <Skeleton className="h-8 w-24 rounded-full bg-gray-200" />
                </div>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    );
  }

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
    <div className="flex items-center gap-6 flex-1">
      <NavigationMenu className="hidden md:block">
        <NavigationMenuList className="gap-6">
          {(
            Object.entries(categories) as [
              keyof GroupedCategories,
              Category[],
            ][]
          ).map(([key, items]) => (
            <NavigationMenuItem key={key}>
              <NavigationMenuTrigger className="bg-transparent hover:bg-gray-50/80 text-gray-700 font-bold text-lg px-4 py-2 rounded-full transition-colors">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="w-[500px] p-6 bg-white rounded-2xl shadow-lg border">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder={`Search ${key} categories...`}
                        className="pl-8 pr-8"
                        value={searchQueries[key] || ""}
                        onChange={(e) =>
                          handleSearchChange(key, e.target.value)
                        }
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
                  <div className="grid grid-cols-2 gap-2">
                    {getFilteredCategories(key, items).map((item) => (
                      <a
                        key={item._id}
                        href={`/${key}/${item.name.toLowerCase().replace(/ /g, "-")}`}
                        className="block p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>

      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-gray-50/80 rounded-full px-4"
              >
                <UserCircle className="w-5 h-5 text-gray-700" />
                <span className="hidden md:inline text-gray-700">
                  {user.name || user.email}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-white rounded-xl shadow-lg"
            >
              <DropdownMenuItem
                onClick={() => signout()}
                className="text-red-600"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/signin">
              <Button
                variant="ghost"
                className="text-gray-700 hover:bg-gray-50/80 rounded-full"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 rounded-full px-6">
                Sign Up
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
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
