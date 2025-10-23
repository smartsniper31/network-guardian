'use server';
/**
 * @fileOverview Applies content filtering rules to a network device.
 *
 * - filterContent - A function that applies content filters.
 * - FilterContentInput - The input type for the function.
 * - FilterContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

export const FilterContentInputSchema = z.object({
  deviceId: z.string().describe('The ID of the device to apply filters to.'),
  categories: z.array(z.string()).describe('A list of content categories to block (e.g., "Social Media", "Gaming", "Adult Content").'),
});
export type FilterContentInput = z.infer<typeof FilterContentInputSchema>;

export const FilterContentOutputSchema = z.object({
  success: z.boolean().describe('Whether the filtering rules were applied successfully.'),
  message: z.string().describe('A confirmation message.'),
});
export type FilterContentOutput = z.infer<typeof FilterContentOutputSchema>;


export async function filterContent(
  input: FilterContentInput
): Promise<FilterContentOutput> {
  return filterContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'filterContentPrompt',
  input: {schema: FilterContentInputSchema},
  output: {schema: FilterContentOutputSchema},
  prompt: `You are a network administrator AI. Your task is to apply content filtering rules to a specific device on the network.

Device ID: {{deviceId}}
Categories to Block: {{#if categories.length}}{{join categories ", "}}{{else}}None{{/if}}

Based on this, confirm that you are applying the rules. For instance, if categories are provided, state that they are now blocked. If the list is empty, state that all filters have been cleared.

Generate a JSON output with a 'success' status and a confirmation 'message'.`,
});


const filterContentFlow = ai.defineFlow(
  {
    name: 'filterContentFlow',
    inputSchema: FilterContentInputSchema,
    outputSchema: FilterContentOutputSchema,
  },
  async (input) => {
    // In a real-world scenario, this would interact with a router/firewall API.
    // Here, we'll just use the AI to generate a confirmation.
    const {output} = await prompt(input);
    return output!;
  }
);
