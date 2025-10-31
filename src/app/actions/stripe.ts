
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { emailService } from '@/lib/email';

export async function createCheckoutSession(formData: FormData) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const headersList = headers();
  const origin = headersList.get('origin') || 'http://localhost:9002';

  const bookingDetails = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    eventDate: formData.get('eventDate') as string,
    eventTime: formData.get('eventTime') as string,
    message: formData.get('message') as string,
    packageType: '360° Photo Booth - 2 Hours',
    totalPrice: 200.00,
  };

  let session;
  try {
    session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: '360° Photo Booth - 2 Hours',
              description: `Booking for ${bookingDetails.name} on ${new Date(bookingDetails.eventDate).toLocaleDateString()}`,
            },
            unit_amount: 20000, // $200.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: bookingDetails,
      customer_email: bookingDetails.email,
    });
  } catch (err) {
    console.error(err);
    throw new Error('Could not create Stripe checkout session');
  }

  // Send confirmation emails (don't block the redirect)
  if (session.url) {
    // Send emails asynchronously
    sendBookingEmails(bookingDetails).catch(err => {
      console.error('Failed to send booking emails:', err);
    });

    redirect(session.url);
  } else {
    throw new Error("Stripe session URL not found");
  }
}

async function sendBookingEmails(bookingDetails: any) {
  try {
    // Send confirmation to customer
    await emailService.sendBookingConfirmation(bookingDetails);

    // Send notification to admin
    await emailService.sendBookingNotification(bookingDetails);

    console.log('Booking confirmation emails sent successfully');
  } catch (error) {
    console.error('Failed to send booking emails:', error);
    // Don't throw error - let the booking continue even if emails fail
  }
}

export async function testStripeSession() {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  const headersList = headers();
  const origin = headersList.get('origin') || 'http://localhost:9002';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Stripe Test Product',
              description: 'This is a test to verify Stripe connectivity.',
            },
            unit_amount: 100, // $1.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/test-stripe?success=true`,
      cancel_url: `${origin}/test-stripe?canceled=true`,
    });

    if (session.url) {
      redirect(session.url);
    }
    
    return { success: true, message: 'Stripe session created successfully.' };
  } catch (error: any) {
    console.error('Stripe Test Error:', error.message);
    return { success: false, message: `Stripe API Error: ${error.message}` };
  }
}
