import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline">
                Capture Every Angle of Your Celebration
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                PictureMePerfect Hub offers a state-of-the-art 360° photo booth experience that brings your events to life. Perfect for weddings, parties, and corporate functions.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center lg:justify-start">
              <Button asChild size="lg">
                <Link href="#packages">View Packages</Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="#gallery">See Our Work</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <Image
              src="https://placehold.co/600x600.png"
              width="600"
              height="600"
              alt="Hero Image"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover"
              data-ai-hint="photo booth"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
