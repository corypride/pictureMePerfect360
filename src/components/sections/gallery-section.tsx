import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { PlayCircle } from "lucide-react";

const galleryItems = [
  { type: "image", src: "https://placehold.co/600x600.png", hint: "wedding event" },
  { type: "video", src: "https://placehold.co/600x600.png", hint: "birthday party" },
  { type: "image", src: "https://placehold.co/600x600.png", hint: "corporate event" },
  { type: "image", src: "https://placehold.co/600x600.png", hint: "outdoor festival" },
  { type: "image", src: "https://placehold.co/600x600.png", hint: "graduation celebration" },
  { type: "video", src: "https://placehold.co/600x600.png", hint: "music concert" },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="w-full py-12 md:py-24 lg:py-32 px-4 md:px-6">
      <div className="container">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Explore Our Past Events
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Get a glimpse of the unforgettable moments we've helped create. Our 360° photo booths capture the fun from every angle.
            </p>
          </div>
        </div>
        <div className="relative">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full max-w-6xl mx-auto mt-12"
          >
            <CarouselContent>
              {galleryItems.map((item, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                      <CardContent className="p-0">
                        <div className="relative aspect-square">
                          <Image
                            src={item.src}
                            alt={`Gallery item ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 group-hover:scale-105"
                            data-ai-hint={item.hint}
                          />
                          {item.type === "video" && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <PlayCircle className="h-16 w-16 text-white/80 group-hover:text-white transition-colors" />
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
