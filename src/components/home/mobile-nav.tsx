"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Search, FileImage, Image, UserCircle } from "lucide-react";
import { XIcon } from "lucide-react";
import { FaVectorSquare } from "react-icons/fa";
import Link from "next/link";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Category, GroupedCategories } from "@/types/category";
import { useAuth } from "@/lib/auth";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { user, signout } = useAuth();
  const [categories, setCategories] = useState<GroupedCategories>({
    png: [],
    vector: [],
    image: [],
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get<Category[]>("/api/categories/navbar");
        const allCategories = response.data;

        const grouped = allCategories.reduce<GroupedCategories>(
          (acc, category) => {
            if (category.active) {
              if (!acc[category.type]) {
                acc[category.type] = [];
              }
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

  const filteredCategories = Object.entries(
    categories
  ).reduce<GroupedCategories>(
    (acc, [key, items]) => {
      acc[key as keyof GroupedCategories] = items.filter((item: Category) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return acc;
    },
    { png: [], vector: [], image: [] }
  );

  const handleSignOut = async () => {
    await signout();
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-[300px] sm:w-[400px] p-0 overflow-hidden"
      >
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center p-4 border-b">
            {user ? (
              <div className="flex items-center gap-2">
                <UserCircle className="w-5 h-5" />
                <span className="text-sm font-medium truncate">
                  {user.email}
                </span>
              </div>
            ) : (
              <div className="text-sm font-medium">Menu</div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="shrink-0"
            >
              <XIcon className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-8"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  <XIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
            <div className="p-4 space-y-4">
              {Object.entries(filteredCategories).map(([key, items]) => (
                <div key={key} className="space-y-2">
                  <div className="flex items-center gap-2 sticky top-0 bg-white py-2">
                    {key === "png" && <FileImage className="w-4 h-4" />}
                    {key === "vector" && <FaVectorSquare className="w-4 h-4" />}
                    {key === "image" && <Image className="w-4 h-4" />}
                    <h2 className="text-lg font-semibold capitalize">{key}</h2>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {(items as Category[]).map((item: Category) => (
                      <Link
                        key={item._id}
                        href={`/${key}/${item.name
                          .toLowerCase()
                          .replace(/ /g, "-")}`}
                        className="text-sm px-3 py-2 rounded-md hover:bg-accent text-muted-foreground hover:text-accent-foreground transition-colors"
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t mt-auto bg-white">
            {user ? (
              <Button
                className="w-full bg-red-500 hover:bg-red-600 text-white"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            ) : (
              <div className="space-y-2">
                <Link href="/signin" onClick={() => setOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
