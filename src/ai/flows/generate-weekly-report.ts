'use server';
/**
 * @fileOverview Generates a weekly summary report of network activity.
 *
 * - generateWeeklyReport - A function that creates the report.
 * - GenerateWeeklyReportInput - The input type for the function.
 * - GenerateWeeklyReportOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { DeviceSchema } from '@/lib/types';

export const GenerateWeeklyReportInputSchema = z.object({
  devices: z.array(DeviceSchema).describe("The list of all devices on the network."),
  logs: z.array(z.object({
    action: z.string(),
    target: z.string(),
    timestamp: z.string(),
    details: z.string(),
  })).describe("A list of activity and security logs from the past week."),
});
export type GenerateWeeklyReportInput = z.infer<typeof GenerateWeeklyReportInputSchema>;

export const GenerateWeeklyReportOutputSchema = z.object({
  overallSummary: z.string().describe("A brief, two-sentence overview of the week's network activity and security posture."),
  screenTimeAnalysis: z.array(z.object({
    deviceName: z.string().describe("The name of the device."),
    deviceId: z.string().describe("The ID of the device."),
    usageHours: z.number().describe("Estimated total hours of active usage for the week."),
  })).describe("An analysis of screen time for the top 3-5 most active devices."),
  threatsSummary: z.object({
    totalThreats: z.number().describe("Total number of threats detected during the week."),
    threats: z.array(z.object({
        details: z.string().describe("Description of a significant threat that was detected."),
        recommendation: z.string().describe("Recommendation to handle this type of threat."),
    })).describe("A list of the most significant threats found."),
  }).describe("A summary of security threats detected."),
  recommendations: z.array(z.object({
    title: z.string().describe("The title of the recommendation."),
    description: z.string().describe("A detailed description of the recommendation for improving security or digital well-being."),
    severity: z.enum(['low', 'medium', 'high']).describe("The importance of the recommendation."),
  })).describe("Actionable recommendations for the user."),
});
export type GenerateWeeklyReportOutput = z.infer<typeof GenerateWeeklyReportOutputSchema>;

export async function generateWeeklyReport(
  input: GenerateWeeklyReportInput
): Promise<GenerateWeeklyReportOutput> {
  return generateWeeklyReportFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWeeklyReportPrompt',
  input: {schema: GenerateWeeklyReportInputSchema},
  output: {schema: GenerateWeeklyReportOutputSchema},
  prompt: `You are a network security and digital well-being analyst. Your task is to generate a weekly report based on the provided device and log data.

Device Data:
{{#each devices}}
- Name: {{name}}, Type: {{type}}, Status: {{status}}, Blocked Categories: {{#if blockedCategories}}{{join blockedCategories ", "}}{{else}}None{{/if}}
{{/each}}

Activity Logs:
{{#each logs}}
- {{timestamp}}: {{action}} on {{target}}. Details: {{details}}
{{/each}}

Analyze the data to create a comprehensive yet easy-to-understand report.
- Provide a brief overall summary.
- Calculate an estimated weekly screen time for the most active devices. A 'Laptop' or 'Tablet' with high data usage implies significant screen time. A 'TV' with high data usage also implies screen time. An 'IoT' device does not.
- Summarize the key threats detected, pulling from logs where the action is 'Threat Detected' or 'Block Device'.
- Offer 2-3 actionable recommendations for improving network security (e.g., "Review firewall rules for Kitchen Tablet") or digital well-being (e.g., "Consider setting an access schedule for Living Room TV").

Generate a JSON output according to the specified schema.`,
});


const generateWeeklyReportFlow = ai.defineFlow(
  {
    name: 'generateWeeklyReportFlow',
    inputSchema: GenerateWeeklyReportInputSchema,
    outputSchema: GenerateWeeklyReportOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
