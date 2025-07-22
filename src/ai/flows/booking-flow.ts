
'use server';
/**
 * @fileOverview A booking management AI agent.
 *
 * - processBooking - A function that handles the booking process.
 * - BookingRequestInput - The input type for the processBooking function.
 * - BookingRequestOutput - The return type for the processBooking function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const BookingRequestInputSchema = z.object({
  name: z.string().describe('The full name of the person booking the event.'),
  email: z.string().email().describe('The email address of the person booking.'),
  eventDate: z.string().describe('The date of the event.'),
  eventTime: z.string().describe('The selected time slot for the event.'),
  message: z.string().optional().describe('Any special requests or messages from the user.'),
});
export type BookingRequestInput = z.infer<typeof BookingRequestInputSchema>;

const BookingRequestOutputSchema = z.object({
  confirmationMessage: z.string().describe('A friendly confirmation message for the user.'),
});
export type BookingRequestOutput = z.infer<typeof BookingRequestOutputSchema>;

export async function processBooking(input: BookingRequestInput): Promise<BookingRequestOutput> {
  return bookingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'bookingPrompt',
  input: {schema: BookingRequestInputSchema},
  output: {schema: BookingRequestOutputSchema},
  prompt: `You are a friendly assistant for PictureMePerfect Hub, a 360 photo booth company.

A user has submitted a booking request with the following details:
- Name: {{{name}}}
- Email: {{{email}}}
- Event Date: {{{eventDate}}}
- Event Time: {{{eventTime}}}
- Message: {{{message}}}

Generate a friendly confirmation message acknowledging their request. Assure them that you have received their details and that you will be in touch shortly to finalize everything.
`,
});

const bookingFlow = ai.defineFlow(
  {
    name: 'bookingFlow',
    inputSchema: BookingRequestInputSchema,
    outputSchema: BookingRequestOutputSchema,
  },
  async (input) => {
    // In a real application, you would add logic here to save the booking to a database (e.g., Firestore).
    // For now, we'll just process the input with the LLM.
    console.log('Processing booking for:', input.name);

    const {output} = await prompt(input);
    return output!;
  }
);
