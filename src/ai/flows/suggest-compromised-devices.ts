
'use server';

/**
 * @fileOverview An AI agent that suggests potentially compromised or
 * misconfigured devices on the network.
 *
 * - suggestCompromisedDevices - A function that suggests potentially
 *   compromised or misconfigured devices.
 */

import {ai} from '@/ai/genkit';
import {
  SuggestCompromisedDevicesInput,
  SuggestCompromisedDevicesInputSchema,
  SuggestCompomisedDevicesOutput,
  SuggestCompromisedDevicesOutputSchema,
} from '@/lib/types';

export async function suggestCompromisedDevices(
  input: SuggestCompromisedDevicesInput
): Promise<SuggestCompomisedDevicesOutput> {
  return suggestCompromisedDevicesFlow(input);
}

const suggestCompromisedDevicesFlow = ai.defineFlow(
  {
    name: 'suggestCompromisedDevicesFlow',
    inputSchema: SuggestCompromisedDevicesInputSchema,
    outputSchema: SuggestCompromisedDevicesOutputSchema,
  },
  async input => {
    const prompt = await ai.prompt('suggestCompromisedDevicesPrompt');
    const {output} = await prompt(input);
    return output!;
  }
);
