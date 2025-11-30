'use client';

import { testStripeSession } from '@/app/actions/stripe';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function StripeTestPage() {
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();

  const success = searchParams.get('success');
  const canceled = searchParams.get('canceled');

  const handleTest = async () => {
    setLoading(true);
    await testStripeSession();
    // The redirect will happen in the server action if successful.
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Stripe Integration Test</CardTitle>
          <CardDescription>
            Click the button to attempt to create a Stripe checkout session. This will verify if your API keys are configured correctly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={testStripeSession}>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Testing...' : 'Run Stripe Test'}
            </Button>
          </form>
           {success && (
            <div className="mt-4 p-4 rounded-md bg-green-100 text-green-800">
              <p className="font-bold">Payment Successful!</p>
              <p>You were successfully redirected back from Stripe.</p>
            </div>
          )}
          {canceled && (
            <div className="mt-4 p-4 rounded-md bg-yellow-100 text-yellow-800">
              <p className="font-bold">Payment Canceled</p>
              <p>You canceled the payment on the Stripe page.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
