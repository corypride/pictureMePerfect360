
"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, Phone, Mail } from "lucide-react";
import { useState } from "react";

import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function Header() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Image
            src="/img/logo_transparent.png"
            width={40}
            height={40}
            alt="PictureMePerfect Logo"
            data-ai-hint="logo company"
            className="h-8 w-8 md:h-10 md:w-10"
          />
          <span className="text-lg md:text-xl font-bold tracking-tight font-headline">
            PictureMePerfect<span className="hidden sm:inline">360</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link
            href="#gallery"
            className="hover:text-accent transition-colors py-2"
            prefetch={false}
          >
            Gallery
          </Link>
          <Link
            href="#packages"
            className="hover:text-accent transition-colors py-2"
            prefetch={false}
          >
            Packages
          </Link>
          <Link
            href="#booking"
            className="bg-accent text-accent-foreground px-4 py-2 rounded-md hover:bg-accent/90 transition-colors"
            prefetch={false}
          >
            Book Now
          </Link>
        </nav>
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 sm:w-96">
              <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/img/logo_transparent.png"
                      width={32}
                      height={32}
                      alt="PictureMePerfect Logo"
                      className="h-8 w-8"
                    />
                    PictureMePerfect360
                  </SheetTitle>
                  <SheetDescription>
                    Navigate our photo booth services
                  </SheetDescription>
              </SheetHeader>

              <div className="flex flex-col gap-6 mt-8">
                {/* Navigation Links */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Navigation
                  </h3>
                  <div className="grid gap-2">
                    <SheetClose asChild>
                      <Link
                        href="#gallery"
                        className="flex items-center gap-3 text-lg font-medium hover:text-accent transition-colors py-3 px-4 rounded-md hover:bg-accent/10"
                        prefetch={false}
                      >
                        📸 Gallery
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="#packages"
                        className="flex items-center gap-3 text-lg font-medium hover:text-accent transition-colors py-3 px-4 rounded-md hover:bg-accent/10"
                        prefetch={false}
                      >
                        💰 Packages
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="#booking"
                        className="flex items-center gap-3 text-lg font-medium bg-accent text-accent-foreground py-3 px-4 rounded-md hover:bg-accent/90 transition-colors"
                        prefetch={false}
                      >
                        📅 Book Now
                      </Link>
                    </SheetClose>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Contact Us
                  </h3>
                  <div className="grid gap-3">
                    <a
                      href="tel:+1234567890"
                      className="flex items-center gap-3 text-base hover:text-accent transition-colors py-2"
                    >
                      <Phone className="h-4 w-4" />
                      <span>(123) 456-7890</span>
                    </a>
                    <a
                      href="mailto:contact@picturemeperfect360.com"
                      className="flex items-center gap-3 text-base hover:text-accent transition-colors py-2"
                    >
                      <Mail className="h-4 w-4" />
                      <span className="text-sm">contact@picturemeperfect360.com</span>
                    </a>
                  </div>
                </div>

                {/* CTA Button */}
                <div className="pt-4 border-t">
                  <Button asChild className="w-full" size="lg">
                    <Link href="#booking" prefetch={false}>
                      Get Started Today
                    </Link>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
