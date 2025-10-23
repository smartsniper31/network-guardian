
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

const detectAnomalousNetworkActivityFlow = ai.defineFlow(
  {
    name: 'detectAnomalousNetworkActivityFlow',
    inputSchema: DetectAnomalousNetworkActivityInputSchema,
    outputSchema: DetectAnomalousNetworkActivityOutputSchema,
  },
  async input => {
    const prompt = await ai.prompt('detectAnomalousNetworkActivityPrompt');
    const {output} = await prompt(input);
    return output!;
  }
);
