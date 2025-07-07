import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const packages = [
  {
    name: "Silver Sparkle",
    price: "$499",
    duration: "2 Hours",
    description: "Perfect for intimate gatherings and smaller events.",
    features: [
      "2 Hours of Service",
      "Unlimited 360° Videos",
      "Standard Props",
      "Online Gallery",
      "On-site Attendant",
    ],
  },
  {
    name: "Gold Glamour",
    price: "$799",
    duration: "3 Hours",
    description: "Our most popular package for weddings and parties.",
    features: [
      "3 Hours of Service",
      "All Silver Features",
      "Custom Video Overlay",
      "Premium Props",
      "Instant Sharing Station",
    ],
    featured: true,
  },
  {
    name: "Platinum Prestige",
    price: "$1099",
    duration: "4 Hours",
    description: "The ultimate experience for large and corporate events.",
    features: [
      "4 Hours of Service",
      "All Gold Features",
      "Custom Backdrop",
      "LED Lighting",
      "VIP Red Carpet Setup",
    ],
  },
];

export default function PackagesSection() {
  return (
    <section id="packages" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">
              Choose Your Perfect Package
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              We offer a range of packages to fit your event's needs and budget. Each one is designed to deliver an amazing experience.
            </p>
          </div>
        </div>
        <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-12">
          {packages.map((pkg) => (
            <Card key={pkg.name} className={`flex flex-col ${pkg.featured ? 'border-primary shadow-2xl' : ''}`}>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold font-headline">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="text-center mb-6">
                  <span className="text-4xl font-extrabold">{pkg.price}</span>
                  <span className="text-muted-foreground"> / {pkg.duration}</span>
                </div>
                <ul className="space-y-3">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full" variant={pkg.featured ? 'default' : 'secondary'}>
                  <Link href="#booking">Book Now</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
