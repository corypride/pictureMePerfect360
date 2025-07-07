import { Camera } from "lucide-react";
import Link from "next/link";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2" prefetch={false}>
          <Camera className="h-8 w-8 text-accent" />
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
      </div>
    </header>
  );
}
