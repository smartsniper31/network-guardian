
'use server';
/**
 * @fileOverview Analyzes a single network device for potential vulnerabilities.
 *
 * - analyzeDeviceVulnerabilities - A function that analyzes a device.
 */

import {ai} from '@/ai/genkit';
import {
  AnalyzeDeviceVulnerabilitiesInput,
  AnalyzeDeviceVulnerabilitiesInputSchema,
  AnalyzeDeviceVulnerabilitiesOutput,
  AnalyzeDeviceVulnerabilitiesOutputSchema,
} from '@/lib/types';

export async function analyzeDeviceVulnerabilities(
  input: AnalyzeDeviceVulnerabilitiesInput
): Promise<AnalyzeDeviceVulnerabilitiesOutput> {
  return analyzeDeviceVulnerabilitiesFlow(input);
}

const analyzeDeviceVulnerabilitiesPrompt = ai.definePrompt(
    {
        name: 'analyzeDeviceVulnerabilitiesPrompt',
        input: {schema: AnalyzeDeviceVulnerabilitiesInputSchema},
        output: {schema: AnalyzeDeviceVulnerabilitiesOutputSchema},
        prompt: `You are a cybersecurity analyst. Analyze the following device data for potential security vulnerabilities.
        Device: {{{jsonStringify device}}}
        Provide a summary and a list of specific vulnerabilities with clear recommendations.
        `,
    },
);

const analyzeDeviceVulnerabilitiesFlow = ai.defineFlow(
  {
    name: 'analyzeDeviceVulnerabilitiesFlow',
    inputSchema: AnalyzeDeviceVulnerabilitiesInputSchema,
    outputSchema: AnalyzeDeviceVulnerabilitiesOutputSchema,
  },
  async (device) => {
    const {output} = await analyzeDeviceVulnerabilitiesPrompt(device);
    return output!;
  }
);
