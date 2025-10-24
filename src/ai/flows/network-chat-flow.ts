'use server';
/**
 * @fileOverview A conversational AI agent for network security analysis.
 *
 * - networkChat - A function that handles conversational queries about the network.
 */

import { ai } from '@/ai/genkit';
import {
  NetworkChatInput,
  NetworkChatInputSchema,
  NetworkChatOutput,
  NetworkChatOutputSchema,
} from '@/lib/types';


export async function networkChat(
  input: NetworkChatInput
): Promise<NetworkChatOutput> {
  return networkChatFlow(input);
}

const networkChatPrompt = ai.definePrompt(
  {
    name: 'networkChatPrompt',
    input: { schema: NetworkChatInputSchema },
    output: { schema: NetworkChatOutputSchema },
    prompt: `You are a helpful and highly skilled AI network security analyst called 'Guardian'.
    Your role is to assist the user by answering their questions about their network in a clear, concise, and friendly manner.
    Your answers MUST be in French.

    Here is the current data for all devices on the network:
    {{{deviceData}}}

    Analyze the user's query and provide a helpful response based on the data.
    If the user asks to perform an action (like blocking a device), acknowledge the request and inform them that the action would be taken, but as an AI, you are only analyzing data for now.
    
    User Query: "{{query}}"
    `,
  },
);

const networkChatFlow = ai.defineFlow(
  {
    name: 'networkChatFlow',
    inputSchema: NetworkChatInputSchema,
    outputSchema: NetworkChatOutputSchema,
  },
  async (input) => {
    const { output } = await networkChatPrompt(input);
    return output!;
  }
);
