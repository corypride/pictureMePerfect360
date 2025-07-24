"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { PayPalIcon } from "../icons/paypal-icon";
import { CashAppIcon } from "../icons/cash-app-icon";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

const bookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  eventDate: z.date({ required_error: "An event date is required." }),
  eventTime: z.string({ required_error: "An event time is required." }),
  message: z.string().optional(),
});

const allTimeSlots = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "01:00 PM - 03:00 PM",
  "03:00 PM - 05:00 PM",
  "05:00 PM - 07:00 PM",
  "07:00 PM - 09:00 PM",
];

// In a real application, this would be fetched from a database
const alreadyBookedSlots = [
    { date: "2024-09-10", time: "09:00 AM - 11:00 AM" },
    { date: "2024-09-10", time: "01:00 PM - 03:00 PM" },
    { date: "2024-09-15", time: "03:00 PM - 05:00 PM" },
];

export default function BookingSection() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof bookingFormSchema>>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const selectedDate = form.watch("eventDate");

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate) return allTimeSlots;
    
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const bookedTimesForDate = alreadyBookedSlots
        .filter(slot => slot.date === formattedDate)
        .map(slot => slot.time);
    
    return allTimeSlots.filter(slot => !bookedTimesForDate.includes(slot));
  }, [selectedDate]);

  useEffect(() => {
    // Reset eventTime if the selected date changes and the current time is not available
    form.setValue("eventTime", "");
  }, [selectedDate, form]);

  async function onSubmit(values: z.infer<typeof bookingFormSchema>) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Form submitted!", values);
    
    toast({
      title: "Booking Request Sent!",
      description: "We've received your request and will be in touch shortly to finalize the details.",
    });

    form.reset();
    setIsLoading(false);
  }

  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }

  return (
    <section id="booking" className="w-full py-12 md:py-24 lg:py-32 bg-card px-4 md:px-6">
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">Book Your Experience</h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Ready to make your event unforgettable? Select a date, fill out the form, and let's get the party started!
          </p>
        </div>
        <div className="mt-12 grid gap-8 justify-center lg:grid-cols-5">
          <div className="lg:col-span-3 lg:col-start-2">
            <Card className="h-full">
              <CardHeader className="text-center">
                <CardTitle>Schedule an Event</CardTitle>
                <CardDescription>Provide your event details below and we'll contact you to finalize everything.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="eventDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Event Date</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={isMounted ? disablePastDates : () => true}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="eventTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Event Time</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger disabled={!selectedDate}>
                                  <SelectValue placeholder="Select a time" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {availableTimeSlots.length > 0 ? (
                                    availableTimeSlots.map((slot) => (
                                    <SelectItem key={slot} value={slot}>
                                        {slot}
                                    </SelectItem>
                                    ))
                                ) : (
                                    <SelectItem value="no-slots" disabled>
                                    No available slots
                                    </SelectItem>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Full Name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Your Email Address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special Requests (Optional)</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Let us know about your event, theme, or any special needs." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <Button type="submit" className="w-full" disabled={isLoading}>
                       {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Booking Request
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3 lg:col-start-2">
            <Card>
                <CardHeader className="text-center">
                    <CardTitle>Payment Options</CardTitle>
                    <CardDescription>We accept payments through PayPal and CashApp. Please update these links.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg">
                        <PayPalIcon className="mr-2 h-6 w-6" />
                        Pay with PayPal
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pay with PayPal</DialogTitle>
                        <DialogDescription>
                          Click the button below to complete your payment via PayPal. Please replace this link with your actual PayPal URL.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-center">
                        <Button asChild>
                          <Link href="https://paypal.me/your-username" target="_blank" rel="noopener noreferrer">
                            <PayPalIcon className="mr-2 h-6 w-6" />
                            Proceed to PayPal
                          </Link>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="lg" variant="secondary">
                          <CashAppIcon className="mr-2 h-6 w-6" />
                          Pay with Cash App
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Pay with Cash App</DialogTitle>
                        <DialogDescription>
                          Click the button below to complete your payment via Cash App. Please replace this link with your actual Cash App cashtag.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter className="sm:justify-center">
                        <Button asChild variant="secondary">
                          <Link href="https://cash.app/$your-cashtag" target="_blank" rel="noopener noreferrer">
                              <CashAppIcon className="mr-2 h-6 w-6" />
                              Proceed to Cash App
                          </Link>
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
