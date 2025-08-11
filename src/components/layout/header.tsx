"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image 
            src="https://placehold.co/50x50.png"
            width={40}
            height={40}
            alt="PictureMePerfect Hub Logo"
            data-ai-hint="logo company"
            className="h-10 w-10"
          />
          <span className="text-xl font-bold tracking-tight font-headline">
            PictureMePerfect Hub
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#gallery"
            className="hover:text-accent transition-colors"
            prefetch={false}
          >
            Gallery
          </Link>
          <Link
            href="#packages"
            className="hover:text-accent transition-colors"
            prefetch={false}
          >
            Packages
          </Link>
          <Link
            href="#booking"
            className="hover:text-accent transition-colors"
            prefetch={false}
          >
            Book Now
          </Link>
        </nav>
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 p-4">
                <SheetClose asChild>
                   <Link
                      href="#gallery"
                      className="text-lg font-medium hover:text-accent transition-colors"
                      prefetch={false}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Gallery
                    </Link>
                </SheetClose>
                <SheetClose asChild>
                    <Link
                      href="#packages"
                      className="text-lg font-medium hover:text-accent transition-colors"
                      prefetch={false}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Packages
                    </Link>
                </SheetClose>
                 <SheetClose asChild>
                    <Link
                      href="#booking"
                      className="text-lg font-medium hover:text-accent transition-colors"
                      prefetch={false}
                      onClick={() => setIsSheetOpen(false)}
                    >
                      Book Now
                    </Link>
                 </SheetClose>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
