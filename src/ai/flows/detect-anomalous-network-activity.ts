'use server';
/**
 * @fileOverview Detects anomalous network activity patterns and generates alerts.
 *
 * - detectAnomalousNetworkActivity - A function that detects unusual network activity.
 * - DetectAnomalousNetworkActivityInput - The input type for the detectAnomalousNetworkActivity function.
 * - DetectAnomalousNetworkActivityOutput - The return type for the detectAnomalousNetworkActivity function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectAnomalousNetworkActivityInputSchema = z.object({
  networkData: z.string().describe('Network activity data in JSON format.'),
});
export type DetectAnomalousNetworkActivityInput = z.infer<
  typeof DetectAnomalousNetworkActivityInputSchema
>;

const AnomalyAlertSchema = z.object({
  deviceId: z.string().describe('The ID of the device with anomalous activity.'),
  anomalyType: z
    .string()
    .describe('The type of anomaly detected (e.g., excessive bandwidth usage, unauthorized connection).'),
  severity: z.enum(['low', 'medium', 'high']).describe('The severity of the anomaly.'),
  timestamp: z.string().describe('The timestamp of when the anomaly was detected.'),
  details: z.string().describe('Additional details about the anomaly.'),
});

const DetectAnomalousNetworkActivityOutputSchema = z.object({
  alerts: z.array(AnomalyAlertSchema).describe('A list of anomaly alerts.'),
});
export type DetectAnomalousNetworkActivityOutput = z.infer<
  typeof DetectAnomalousNetworkActivityOutputSchema
>;

export async function detectAnomalousNetworkActivity(
  input: DetectAnomalousNetworkActivityInput
): Promise<DetectAnomalousNetworkActivityOutput> {
  return detectAnomalousNetworkActivityFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectAnomalousNetworkActivityPrompt',
  input: {schema: DetectAnomalousNetworkActivityInputSchema},
  output: {schema: DetectAnomalousNetworkActivityOutputSchema},
  prompt: `You are a network security analyst. Analyze the given network data and detect any unusual activity patterns.

Network Data: {{{networkData}}}

Based on your analysis, generate alerts for any potential security breaches, including device ID, anomaly type, severity, timestamp, and details.

Format the output as a JSON object containing a list of anomaly alerts.`,
});

const detectAnomalousNetworkActivityFlow = ai.defineFlow(
  {
    name: 'detectAnomalousNetworkActivityFlow',
    inputSchema: DetectAnomalousNetworkActivityInputSchema,
    outputSchema: DetectAnomalousNetworkActivityOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
