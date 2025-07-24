import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, DollarSign, Clock, Truck, Camera, Video, PartyPopper } from "lucide-react";
import Link from "next/link";

export default function PackagesSection() {
  return (
    <section id="packages" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Our Flexible Pricing
            </h2>
            <p className="max-w-[900px] text-foreground/90 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Build the perfect package for your event. Start with our base rate and add what you need.
            </p>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
          {/* Base Rate */}
          <Card className="flex flex-col">
            <CardHeader className="items-center text-center">
              <DollarSign className="h-10 w-10 mb-2 text-primary" />
              <CardTitle className="text-2xl font-bold font-headline">Base Rate</CardTitle>
              <CardDescription>Event time</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow text-center">
              <div className="mb-6">
                <span className="text-4xl font-extrabold">$100</span>
                <span className="text-muted-foreground"> / hour</span>
              </div>
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>2-hour minimum booking</span>
                </li>
                <li className="flex items-center">
                  <Clock className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>4-hour maximum standard booking</span>
                </li>
                 <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Contact us for events over 4 hours</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Service Fees */}
          <Card className="flex flex-col">
            <CardHeader className="items-center text-center">
              <Truck className="h-10 w-10 mb-2 text-primary" />
              <CardTitle className="text-2xl font-bold font-headline">Service Fees</CardTitle>
              <CardDescription>Travel & setup</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow text-center">
                <ul className="space-y-3 text-left">
                     <li className="flex items-center">
                        <span className="font-bold text-lg w-16">$15</span>
                        <span>Truck roll fee for hometown events</span>
                    </li>
                     <li className="flex items-center">
                        <span className="font-bold text-lg w-16">$40</span>
                        <span>Truck roll fee for all other locations</span>
                    </li>
                </ul>
            </CardContent>
          </Card>

          {/* Add-ons */}
          <Card className="flex flex-col">
            <CardHeader className="items-center text-center">
              <PartyPopper className="h-10 w-10 mb-2 text-primary" />
              <CardTitle className="text-2xl font-bold font-headline">Optional Add-ons</CardTitle>
              <CardDescription>Customize your experience</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow text-center">
              <ul className="space-y-3 text-left">
                <li className="flex items-center">
                  <Video className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Single Video: <strong>$12.50</strong></span>
                </li>
                <li className="flex items-center">
                  <Camera className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Single Picture: <strong>$10</strong></span>
                </li>
                 <li className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                  <span>Picture & Video bundle: <strong>$20</strong></span>
                </li>
                <li className="flex items-center">
                  <PartyPopper className="h-5 w-5 text-primary mr-2 shrink-0" />
                  <span>Custom Props: <strong>$50 - $75</strong></span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
         <div className="text-center mt-12">
            <Button asChild size="lg">
                <Link href="#booking">Book Your Event Now</Link>
            </Button>
        </div>
      </div>
    </section>
  );
}
