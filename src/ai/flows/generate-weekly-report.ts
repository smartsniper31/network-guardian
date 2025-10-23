
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

const generateWeeklyReportPrompt = ai.definePrompt(
    {
        name: 'generateWeeklyReportPrompt',
        input: {schema: GenerateWeeklyReportInputSchema},
        output: {schema: GenerateWeeklyReportOutputSchema},
        prompt: `You are a network analyst AI. Generate a comprehensive weekly report based on the provided device and log data.
        Devices: {{{jsonStringify devices}}}
        Logs: {{{jsonStringify logs}}}
        Provide an overall summary, screen time analysis, threat summary, and actionable recommendations.
        `,
    },
);

const generateWeeklyReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyReportFlow',
    inputSchema: GenerateWeeklyReportInputSchema,
    outputSchema: GenerateWeeklyReportOutputSchema,
  },
  async (input) => {
    const {output} = await generateWeeklyReportPrompt(input);
    return output!;
  }
);
