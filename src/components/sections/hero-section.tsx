import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section
      className="relative w-full py-20 md:py-32 lg:py-40 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/logo-background.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="container relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
          <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none font-headline text-yellow-500">
                Capture Every Angle of Your Celebration
              </h1>
              <p className="max-w-[600px] text-gray-200 md:text-xl mx-auto lg:mx-0">
                PictureMePerfect Hub offers a state-of-the-art 360° photo booth
                experience that brings your events to life. Perfect for
                weddings, parties, and corporate functions.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg">
                  <Link href="#packages">View Packages</Link>
                </Button>
                <Button asChild variant="secondary" size="lg">
                  <Link href="#gallery">See Our Work</Link>
                </Button>
              </div>
            </div>
          </div>
          <div className="hidden items-center justify-center lg:flex">
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