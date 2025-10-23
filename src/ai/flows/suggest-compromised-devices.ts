
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
import { z } from 'zod';

export async function suggestCompromisedDevices(
  input: SuggestCompromisedDevicesInput
): Promise<SuggestCompomisedDevicesOutput> {
  return suggestCompromisedDevicesFlow(input);
}

const suggestCompromisedDevicesPrompt = ai.definePrompt(
  {
    name: 'suggestCompromisedDevicesPrompt',
    input: {schema: z.object({
      deviceData: z.string(),
      threatIntelligenceFeeds: z.string(),
      sensitivity: z.enum(['normal', 'high', 'paranoid']),
    })},
    output: {schema: SuggestCompromisedDevicesOutputSchema},
    prompt: `You are a network security expert. Analyze the provided device data and threat intelligence feeds to identify potentially compromised devices.
    Your sensitivity level is '{{sensitivity}}'.
    Device Data: {{{deviceData}}}
    Threat Feeds: {{{threatIntelligenceFeeds}}}
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
    const {output} = await suggestCompromisedDevicesPrompt({
      deviceData: JSON.stringify(input.deviceData),
      threatIntelligenceFeeds: JSON.stringify(input.threatIntelligenceFeeds),
      sensitivity: input.sensitivity,
    });
    return output!;
  }
);
