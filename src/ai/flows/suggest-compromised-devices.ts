
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

const suggestCompromisedDevicesPrompt = ai.definePrompt(
  {
    name: 'suggestCompromisedDevicesPrompt',
    input: {schema: SuggestCompromisedDevicesInputSchema},
    output: {schema: SuggestCompromisedDevicesOutputSchema},
    prompt: `You are a network security expert. Analyze the provided device data and threat intelligence feeds to identify potentially compromised devices.
    Your sensitivity level is '{{sensitivity}}'.
    Device Data: {{{jsonStringify deviceData}}}
    Threat Feeds: {{{jsonStringify threatIntelligenceFeeds}}}
    Based on your analysis, list devices that show signs of compromise and provide a clear, concise reason for each suspicion.
    `,
  },
);

const suggestCompromisedDevicesFlow = ai.defineFlow(
  {
    name: 'suggestCompromisedDevicesFlow',
    inputSchema: SuggestCompromisedDevicesInputSchema,
    outputSchema: SuggestCompromisedDevicesOutputSchema,
  },
  async input => {
    const {output} = await suggestCompromisedDevicesPrompt(input);
    return output!;
  }
);
