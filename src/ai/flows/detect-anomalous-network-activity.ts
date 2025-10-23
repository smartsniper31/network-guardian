
'use server';
/**
 * @fileOverview Detects anomalous network activity patterns and generates alerts.
 *
 * - detectAnomalousNetworkActivity - A function that detects unusual network activity.
 */

import {ai} from '@/ai/genkit';
import {
  DetectAnomalousNetworkActivityInput,
  DetectAnomalousNetworkActivityInputSchema,
  DetectAnomalousNetworkActivityOutput,
  DetectAnomalousNetworkActivityOutputSchema,
} from '@/lib/types';

export async function detectAnomalousNetworkActivity(
  input: DetectAnomalousNetworkActivityInput
): Promise<DetectAnomalousNetworkActivityOutput> {
  return detectAnomalousNetworkActivityFlow(input);
}

const detectAnomalousNetworkActivityPrompt = ai.definePrompt(
    {
        name: 'detectAnomalousNetworkActivityPrompt',
        input: {schema: DetectAnomalousNetworkActivityInputSchema},
        output: {schema: DetectAnomalousNetworkActivityOutputSchema},
        prompt: `You are a network security analyst. Analyze the following network data for anomalies.
        Network Data: {{{networkData}}}
        Identify any unusual patterns, such as excessive bandwidth usage, unauthorized connections, or port scanning. Generate alerts for any detected anomalies.
        `,
    },
);

const detectAnomalousNetworkActivityFlow = ai.defineFlow(
  {
    name: 'detectAnomalousNetworkActivityFlow',
    inputSchema: DetectAnomalousNetworkActivityInputSchema,
    outputSchema: DetectAnomalousNetworkActivityOutputSchema,
  },
  async input => {
    const {output} = await detectAnomalousNetworkActivityPrompt(input);
    return output!;
  }
);
