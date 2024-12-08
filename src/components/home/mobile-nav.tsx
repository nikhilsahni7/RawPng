"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Link from "next/link";

const categories = {
  png: [
    "Christmas",
    "New Year",
    "Nature & Wildlife",
    "Business & Finance",
    "Education & Learning",
    "Food & Cuisine",
  ],
  vector: [
    "Abstract Shapes",
    "Icons & Symbols",
    "Illustrations",
    "Backgrounds",
    "Characters",
    "Infographics",
  ],
  images: [
    "Stock Photos",
    "Textures",
    "Mockups",
    "Landscapes",
    "Architecture",
    "Lifestyle",
  ],
};

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          {Object.entries(categories).map(([key, items]) => (
            <div key={key} className="flex flex-col gap-2">
              <h2 className="text-lg font-semibold capitalize">{key}</h2>
              {items.map((item) => (
                <Link
                  key={item}
                  href={`/${key}/${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm text-gray-600 hover:text-blue-600"
                  onClick={() => setOpen(false)}
                >
                  {item}
                </Link>
              ))}
            </div>
          ))}
          <Button className="mt-4" onClick={() => setOpen(false)}>
            Sign In
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
