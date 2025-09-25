
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function createCheckoutSession(formData: FormData) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  const headersList = headers();
  const origin = headersList.get('origin') || 'http://localhost:9002';
  
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
              description: `Booking for ${formData.get('name')} on ${new Date(formData.get('eventDate') as string).toLocaleDateString()}`,
            },
            unit_amount: 20000, // $200.00
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${origin}/?success=true`,
      cancel_url: `${origin}/?canceled=true`,
      metadata: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        eventDate: formData.get('eventDate') as string,
        eventTime: formData.get('eventTime') as string,
        message: formData.get('message') as string,
      }
    });
  } catch (err) {
    console.error(err);
    throw new Error('Could not create Stripe checkout session');
  }

  if (session.url) {
    redirect(session.url);
  } else {
    throw new Error("Stripe session URL not found");
  }
}
