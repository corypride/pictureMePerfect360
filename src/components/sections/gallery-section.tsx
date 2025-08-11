
"use client";

import Image from "next/image";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";

const galleryItems = [
  { type: "video", src: "/Cory Pride.mp4", thumbnail: "https://placehold.co/600x900.png", hint: "birthday party", videoUrl: "/Cory Pride.mp4" },
  { type: "image", src: "https://placehold.co/600x900.png", hint: "Juneteenth Event" },
  { type: "image", src: "https://placehold.co/600x900.png", hint: "corporate event" },
  { type: "image", src: "https://placehold.co/600x900.png", hint: "outdoor festival" },
  { type: "image", src: "https://placehold.co/600x900.png", hint: "graduation celebration" },
  { type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", thumbnail: "https://placehold.co/600x900.png", hint: "music concert", videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" },
];

const videos = galleryItems.filter(item => item.type === 'video');

export default function GallerySection() {
  const [activeVideoIndex, setActiveVideoIndex] = useState<number | null>(null);

  const handleNextVideo = () => {
    if (activeVideoIndex !== null) {
      const nextIndex = activeVideoIndex + 1;
      if (nextIndex < videos.length) {
        setActiveVideoIndex(nextIndex);
      }
    }
  };

  const handlePrevVideo = () => {
    if (activeVideoIndex !== null) {
      const prevIndex = activeVideoIndex - 1;
      if (prevIndex >= 0) {
        setActiveVideoIndex(prevIndex);
      }
    }
  };

  const renderGalleryItem = (item: any, index: number) => {
    const imageSrc = item.type === 'video' ? item.thumbnail : item.src;

    const content = (
       <Card className="overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3]">
            <Image
              src={imageSrc}
              alt={`Gallery item ${index + 1}`}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
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
    );

    if (item.type === "video" && item.videoUrl) {
      const videoIndex = videos.findIndex(v => v.videoUrl === item.videoUrl);
      return (
        <Dialog onOpenChange={(open) => !open && setActiveVideoIndex(null)}>
          <DialogTrigger asChild onClick={() => setActiveVideoIndex(videoIndex)}>
            <div className="cursor-pointer">{content}</div>
          </DialogTrigger>
          {activeVideoIndex !== null && (
            <DialogContent className="w-full max-w-md h-auto max-h-[90vh] p-0 bg-black border-0">
               <DialogHeader className="sr-only">
                <DialogTitle>Event Video</DialogTitle>
                <DialogDescription>A video showcasing a past event. Use the navigation buttons to view other videos.</DialogDescription>
              </DialogHeader>
              <div className="relative w-full aspect-[9/16] flex items-center justify-center">
                <video className="w-full h-full object-cover" src={videos[activeVideoIndex].videoUrl} controls autoPlay>
                    Your browser does not support the video tag.
                </video>
                 {activeVideoIndex > 0 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-white/70 hover:bg-white/20 hover:text-white z-10"
                        onClick={handlePrevVideo}
                    >
                        <ChevronLeft className="h-10 w-10" />
                    </Button>
                )}
                {activeVideoIndex < videos.length - 1 && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-white/70 hover:bg-white/20 hover:text-white z-10"
                        onClick={handleNextVideo}
                    >
                        <ChevronRight className="h-10 w-10" />
                    </Button>
                )}
              </div>
            </DialogContent>
          )}
        </Dialog>
      )
    }

    return content;
  }

  return (
    <section id="gallery" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
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
                    {renderGalleryItem(item, index)}
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
