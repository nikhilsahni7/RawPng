"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

const navItems = [
  { title: "Dashboard", href: "/dashboard", icon: "📊" },
  { title: "Uploading", href: "/dashboard/upload", icon: "⬆️" },
  { title: "Category", href: "/dashboard/category", icon: "🗂️" },
  { title: "Ads Codes", href: "/dashboard/ads", icon: "💰" },
];

export function DashboardHeader() {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="h-8 w-8 rounded-full bg-blue-500"
              whileHover={{ scale: 1.2, rotate: 90 }}
              whileTap={{ scale: 0.8, rotate: -90, borderRadius: "100%" }}
            />
            <span className="hidden font-bold sm:inline-block">ImagesHub</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-blue-600 font-bold"
                    : "text-foreground/60"
                )}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <span className="mr-2">{item.icon}</span>
                {item.title}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute -bottom-px left-0 right-0 h-px bg-blue-500"
                    layoutId="underline"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="mr-6"
        >
          <Sun className="h-6 w-6 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-6 w-6 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
