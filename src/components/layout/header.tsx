import { MainNav } from "@/components/home/main-nav";
import { MobileNav } from "@/components/home/mobile-nav";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/Rawpnglogo(1).svg"
              alt="rawpng"
              width={120}
              height={40}
              className="w-24 sm:w-32 md:w-40"
            />
          </Link>
        </div>
        <div className="hidden md:block flex-1 px-8">
          <MainNav />
        </div>
        <div className="flex items-center gap-4">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
