'use server';
/**
 * @fileOverview Analyzes a single network device for potential vulnerabilities.
 *
 * - analyzeDeviceVulnerabilities - A function that analyzes a device.
 * - AnalyzeDeviceVulnerabilitiesInput - The input type for the function.
 * - AnalyzeDeviceVulnerabilitiesOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DeviceSchema } from '@/lib/types';

export const AnalyzeDeviceVulnerabilitiesInputSchema = DeviceSchema;
export type AnalyzeDeviceVulnerabilitiesInput = z.infer<typeof AnalyzeDeviceVulnerabilitiesInputSchema>;

export const AnalyzeDeviceVulnerabilitiesOutputSchema = z.object({
  analysisSummary: z.string().describe("A brief, one-sentence summary of the device's security posture."),
  vulnerabilities: z.array(z.object({
    severity: z.enum(['low', 'medium', 'high', 'critical']).describe('The severity of the vulnerability.'),
    description: z.string().describe('A detailed description of the vulnerability found.'),
    recommendation: z.string().describe('The recommended action to mitigate the vulnerability.'),
  })).describe('A list of identified vulnerabilities and recommendations.'),
});
export type AnalyzeDeviceVulnerabilitiesOutput = z.infer<typeof AnalyzeDeviceVulnerabilitiesOutputSchema>;

export async function analyzeDeviceVulnerabilities(
  input: AnalyzeDeviceVulnerabilitiesInput
): Promise<AnalyzeDeviceVulnerabilitiesOutput> {
  return analyzeDeviceVulnerabilitiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeDeviceVulnerabilitiesPrompt',
  input: {schema: AnalyzeDeviceVulnerabilitiesInputSchema},
  output: {schema: AnalyzeDeviceVulnerabilitiesOutputSchema},
  prompt: `You are a cybersecurity expert. Analyze the following network device for potential vulnerabilities based on its type, open ports, and other data.

Device Information:
- Type: {{type}}
- Name: {{name}}
- IP Address: {{ip}}
- Open Ports: {{#if openPorts.length}}{{join openPorts ", "}}{{else}}None{{/if}}
- Firewall Rules: {{#if firewallRules.length}}{{join firewallRules ", "}}{{else}}None{{/if}}

Based on this information, provide a concise analysis summary, identify specific vulnerabilities, and suggest actionable recommendations. Pay special attention to common misconfigurations for the given device type and the risks associated with its open ports.

For example, if a device is a 'Camera' with port '554' (RTSP) open to the world, it's a vulnerability. If a device has no open ports and basic firewall rules, it's likely secure. An 'Unknown' device with open ports is highly suspicious.

Generate a JSON output with an analysis summary and a list of vulnerabilities with their severity, description, and recommendation. If no vulnerabilities are found, return an empty array for the 'vulnerabilities' field.`,
});


const analyzeDeviceVulnerabilitiesFlow = ai.defineFlow(
  {
    name: 'analyzeDeviceVulnerabilitiesFlow',
    inputSchema: AnalyzeDeviceVulnerabilitiesInputSchema,
    outputSchema: AnalyzeDeviceVulnerabilitiesOutputSchema,
  },
  async (device) => {
    const {output} = await prompt(device);
    return output!;
  }
);
