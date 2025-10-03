
'use server';

import { Stripe } from 'stripe';

export async function createPaymentIntent(amount: number, metadata: {[key: string]: string}) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata,
    });

    return { clientSecret: paymentIntent.client_secret, success: true };
  } catch (err: any) {
    console.error('Error creating PaymentIntent:', err.message);
    return { success: false, error: 'Could not create PaymentIntent.' };
  }
}

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
              description: `Booking for ${formData.get('name')} on ${new Date(
                formData.get('eventDate') as string
              ).toLocaleDateString()}`,
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
      },
    });
  } catch (err: any) {
    console.error(err);
    throw new Error(`Could not create Stripe checkout session: ${err.message}`);
  }

  if (session.url) {
    redirect(session.url);
  } else {
    throw new Error('Stripe session URL not found');
  }
}

export async function testStripeSession() {
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
  } catch (error: any) {
    console.error('Stripe Test Error:', error.message);
    return { success: false, message: `Stripe API Error: ${error.message}` };
  }
  
  if (session.url) {
    redirect(session.url);
  } else {
     return { success: false, message: 'Stripe session URL not found.' };
  }
}
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
