"use client";

import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-primary text-primary-foreground py-8">
      <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between">
        <p className="text-sm text-center md:text-left mb-4 md:mb-0">
          © {year} PictureMePerfect Hub. All rights reserved.
        </p>
        <div className="flex items-center space-x-4">
          <Link href="#" className="text-primary-foreground hover:text-accent transition-colors" aria-label="Facebook">
            <Facebook className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-primary-foreground hover:text-accent transition-colors" aria-label="Twitter">
            <Twitter className="h-6 w-6" />
          </Link>
          <Link href="#" className="text-primary-foreground hover:text-accent transition-colors" aria-label="Instagram">
            <Instagram className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
