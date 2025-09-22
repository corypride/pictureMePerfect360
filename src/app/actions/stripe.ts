
'use server';

import { Stripe } from 'stripe';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(formData: FormData) {
  const headersList = headers();
  const origin = headersList.get('origin');

  if (!origin) {
    throw new Error('Could not determine request origin');
  }

  try {
    const session = await stripe.checkout.sessions.create({
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
    
    if (session.url) {
      redirect(session.url);
    } else {
      throw new Error("Stripe session URL not found");
    }

  } catch (err) {
    console.error(err);
    throw new Error('Could not create Stripe checkout session');
  }
}
