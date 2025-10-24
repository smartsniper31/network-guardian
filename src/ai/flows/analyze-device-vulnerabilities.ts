
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
import { z } from 'zod';

export async function analyzeDeviceVulnerabilities(
  input: AnalyzeDeviceVulnerabilitiesInput
): Promise<AnalyzeDeviceVulnerabilitiesOutput> {
  return analyzeDeviceVulnerabilitiesFlow(input);
}

const analyzeDeviceVulnerabilitiesPrompt = ai.definePrompt(
    {
        name: 'analyzeDeviceVulnerabilitiesPrompt',
        input: {schema: z.object({device: z.string()})},
        output: {schema: AnalyzeDeviceVulnerabilitiesOutputSchema},
        prompt: `Vous êtes un analyste en cybersécurité. Analysez les données de l'appareil suivantes pour détecter d'éventuelles vulnérabilités de sécurité.
        Votre réponse DOIT être entièrement en français.
        Appareil : {{{device}}}
        Fournissez un résumé et une liste de vulnérabilités spécifiques avec des recommandations claires.
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
    const {output} = await analyzeDeviceVulnerabilitiesPrompt({
      device: JSON.stringify(device),
    });
    return output!;
  }
);
