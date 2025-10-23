
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

const analyzeDeviceVulnerabilitiesFlow = ai.defineFlow(
  {
    name: 'analyzeDeviceVulnerabilitiesFlow',
    inputSchema: AnalyzeDeviceVulnerabilitiesInputSchema,
    outputSchema: AnalyzeDeviceVulnerabilitiesOutputSchema,
  },
  async (device) => {
    const prompt = await ai.prompt('analyzeDeviceVulnerabilitiesPrompt', {
      device,
    });
    const {output} = await prompt(device);
    return output!;
  }
);
