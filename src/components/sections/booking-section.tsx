"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  ExpressCheckoutElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import { Button } from "@/components/ui/button";

import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { createPaymentIntent } from "@/app/actions/stripe";
import { useToast } from "@/hooks/use-toast";

const bookingFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  eventDate: z.date({ required_error: "An event date is required." }),
  eventTime: z.string({ required_error: "An event time is required." }),
  message: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

const allTimeSlots = [
  "09:00 AM - 11:00 AM",
  "11:00 AM - 01:00 PM",
  "01:00 PM - 03:00 PM",
  "03:00 PM - 05:00 PM",
  "05:00 PM - 07:00 PM",
  "07:00 PM - 09:00 PM",
];

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutForm = ({
  onPaymentSuccess,
  getBookingData,
}: {
  onPaymentSuccess: () => void;
  getBookingData: () => BookingFormValues | null;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onConfirm = useCallback(async () => {
    if (!stripe || !elements) {
      return;
    }
    setIsLoading(true);

    const { error } = await elements.submit();
    if (error) {
      setErrorMessage(error.message ?? "An unknown error occurred.");
      setIsLoading(false);
      return;
    }
    
    const bookingData = getBookingData();
    if (!bookingData) return;

    const { clientSecret } = await createPaymentIntent(20000, { // 200 USD
        name: bookingData.name,
        email: bookingData.email,
        eventDate: bookingData.eventDate.toISOString(),
        eventTime: bookingData.eventTime,
        message: bookingData.message || ''
    });

    if(!clientSecret) {
        setErrorMessage("Could not create payment intent.");
        setIsLoading(false);
        return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/?success=true`,
      },
    });

    if (confirmError) {
      setErrorMessage(confirmError.message ?? "An unknown error occurred during payment confirmation.");
    } else {
      onPaymentSuccess();
    }
    setIsLoading(false);
  }, [stripe, elements, getBookingData, onPaymentSuccess]);

  return (
    <div className="space-y-4">
      <ExpressCheckoutElement onConfirm={onConfirm} />
      {errorMessage && (
        <div className="text-destructive text-sm font-medium">
          {errorMessage}
        </div>
      )}
      {isLoading && (
        <div className="flex justify-center items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            <span>Processing...</span>
        </div>
      )}
    </div>
  );
};

export default function BookingSection() {
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  // In a real application, this would be fetched from and updated to a database
  const [bookedSlots, setBookedSlots] = useState([
    { date: "2024-09-10", time: "09:00 AM - 11:00 AM" },
    { date: "2024-09-10", time: "01:00 PM - 03:00 PM" },
    { date: "2024-09-15", time: "03:00 PM - 05:00 PM" },
  ]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (searchParams.get("success")) {
      toast({
        title: "Payment Successful!",
        description:
          "Your booking has been confirmed. We'll be in touch shortly.",
      });
      form.reset();
      setClientSecret(null);
    }
  }, [searchParams, toast]);

  const form = useForm<BookingFormValues>({
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
    const bookedTimesForDate = bookedSlots
      .filter((slot) => slot.date === formattedDate)
      .map((slot) => slot.time);

    return allTimeSlots.filter((slot) => !bookedTimesForDate.includes(slot));
  }, [selectedDate, bookedSlots]);

  useEffect(() => {
    // Reset eventTime if the selected date changes and the current time is not available
    const currentEventTime = form.getValues("eventTime");
    if (currentEventTime && !availableTimeSlots.includes(currentEventTime)) {
      form.setValue("eventTime", "");
    }
  }, [selectedDate, availableTimeSlots, form]);
  
  const handlePaymentSuccess = () => {
    // This is handled by redirect now
  };
  
  const getBookingData = () => {
    return form.getValues();
  }

  async function onSubmit(values: BookingFormValues) {
    const { clientSecret, error } = await createPaymentIntent(20000, {
        name: values.name,
        email: values.email,
        eventDate: values.eventDate.toISOString(),
        eventTime: values.eventTime,
        message: values.message || ''
    });

    if (error || !clientSecret) {
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error || "Could not initialize payment.",
      });
      return;
    }
    setClientSecret(clientSecret);
  }

  const disablePastDates = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };
  
  const isFormValid = form.formState.isValid;

  return (
    <section id="booking" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-headline">
            Book Your Experience
          </h2>
          <p className="mt-4 text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Ready to make your event unforgettable? Select a date, fill out
            the form, and let's get the party started!
          </p>
        </div>
        <div className="mt-12 grid gap-8 justify-center lg:grid-cols-5">
          <div className="lg:col-span-3 lg:col-start-2">
            <Card className="h-full">
              <CardHeader className="text-center">
                <CardTitle>Schedule an Event</CardTitle>
                <CardDescription>
                  Provide your event details below and we'll contact you to
                  finalize everything.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
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
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={
                                    isMounted ? disablePastDates : () => true
                                  }
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
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
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
                              <Input
                                placeholder="Your Email Address"
                                {...field}
                              />
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
                            <Textarea
                              placeholder="Let us know about your event, theme, or any special needs."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {!clientSecret && (
                      <Button type="submit" className="w-full" disabled={!isFormValid}>
                        Proceed to Payment
                      </Button>
                    )}
                  </form>
                </Form>

                {clientSecret && isFormValid && (
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                      appearance: { theme: "stripe" },
                    }}
                  >
                    <CheckoutForm
                      onPaymentSuccess={handlePaymentSuccess}
                      getBookingData={getBookingData}
                    />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
