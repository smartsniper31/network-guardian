'use server';

/**
 * @fileOverview An AI agent that suggests potentially compromised or
 * misconfigured devices on the network.
 *
 * - suggestCompromisedDevices - A function that suggests potentially
 *   compromised or misconfigured devices.
 * - SuggestCompromisedDevicesInput - The input type for the
 *   suggestCompromisedDevices function.
 * - SuggestCompromisedDevicesOutput - The return type for the
 *   suggestCompromisedDevices function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCompromisedDevicesInputSchema = z.object({
  deviceData: z
    .array(z.object({
      ip: z.string().describe('The IP address of the device.'),
      mac: z.string().describe('The MAC address of the device.'),
      deviceName: z.string().describe('The name of the device.'),
      deviceType: z.string().describe('The type of the device.'),
      bandwidthUsage: z.number().describe('The current bandwidth usage of the device in Mbps.'),
      openPorts: z.array(z.number()).describe('A list of open ports on the device.'),
    }))
    .describe('A list of devices connected to the network and their data.'),
  threatIntelligenceFeeds: z
    .array(z.string())
    .describe('Real-time threat intelligence feeds.'),
  sensitivity: z.enum(['normal', 'high', 'paranoid']).describe('The sensitivity level for the analysis. "Paranoid" will flag even minor deviations.'),
});
export type SuggestCompromisedDevicesInput = z.infer<
  typeof SuggestCompromisedDevicesInputSchema
>;

const SuggestCompromisedDevicesOutputSchema = z.object({
  compromisedDevices: z
    .array(z.object({
      ip: z.string().describe('The IP address of the compromised device.'),
      reason: z.string().describe('The reason why the device is suspected to be compromised.'),
    }))
    .describe('A list of potentially compromised devices and the reasons for suspicion.'),
});
export type SuggestCompomisedDevicesOutput = z.infer<
  typeof SuggestCompromisedDevicesOutputSchema
>;

export async function suggestCompromisedDevices(
  input: SuggestCompromisedDevicesInput
): Promise<SuggestCompomisedDevicesOutput> {
  return suggestCompromisedDevicesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCompromisedDevicesPrompt',
  input: {schema: SuggestCompromisedDevicesInputSchema},
  output: {schema: SuggestCompromisedDevicesOutputSchema},
  prompt: `You are a network security expert analyzing network device data and threat intelligence feeds to identify potentially compromised or misconfigured devices.

Your analysis sensitivity level is set to: {{sensitivity}}.
- 'normal': Only report clear, high-confidence threats.
- 'high': Report high-confidence threats and medium-risk anomalies.
- 'paranoid': Report all potential threats, anomalies, and even minor configuration deviations that could represent a future risk.

Analyze the following device data and threat intelligence feeds to identify any devices that may be compromised or misconfigured based on the selected sensitivity. Provide the IP address of any such devices and the reason for suspicion.

Device Data:
{{#each deviceData}}
- IP: {{ip}}, MAC: {{mac}}, Name: {{deviceName}}, Type: {{deviceType}}, Bandwidth Usage: {{bandwidthUsage}} Mbps, Open Ports: {{openPorts}}
{{/each}}

Threat Intelligence Feeds:
{{#each threatIntelligenceFeeds}}
- {{this}}
{{/each}}

Output should be formatted as a JSON object with a "compromisedDevices" field. Each object in the compromisedDevices array should have an "ip" field and a "reason" field. Only include devices in the array if there is a clear reason to suspect compromise or misconfiguration according to the sensitivity level.
`,
});

const suggestCompromisedDevicesFlow = ai.defineFlow(
  {
    name: 'suggestCompromisedDevicesFlow',
    inputSchema: SuggestCompromisedDevicesInputSchema,
    outputSchema: SuggestCompromisedDevicesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
