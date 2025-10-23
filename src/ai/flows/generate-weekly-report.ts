
'use server';
/**
 * @fileOverview Generates a weekly summary report of network activity.
 *
 * - generateWeeklyReport - A function that creates the report.
 */

import {ai} from '@/ai/genkit';
import {
  GenerateWeeklyReportInput,
  GenerateWeeklyReportInputSchema,
  GenerateWeeklyReportOutput,
  GenerateWeeklyReportOutputSchema,
} from '@/lib/types';

export async function generateWeeklyReport(
  input: GenerateWeeklyReportInput
): Promise<GenerateWeeklyReportOutput> {
  return generateWeeklyReportFlow(input);
}

const generateWeeklyReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyReportFlow',
    inputSchema: GenerateWeeklyReportInputSchema,
    outputSchema: GenerateWeeklyReportOutputSchema,
  },
  async (input) => {
    const prompt = await ai.prompt('generateWeeklyReportPrompt');
    const {output} = await prompt(input);
    return output!;
  }
);
