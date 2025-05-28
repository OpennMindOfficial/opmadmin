
'use server';
/**
 * @fileOverview A Genkit flow for simulating API test conversations.
 *
 * - apiTestChat - A function that handles the simulated API test chat.
 * - ApiTestChatInput - The input type for the apiTestChat function.
 * - ApiTestChatOutput - The return type for the apiTestChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ApiTestChatInputSchema = z.object({
  userInput: z.string().describe('The user message or command related to API testing.'),
  apiKey: z.string().describe('The API key being discussed or "tested". This should be treated as the active OPENAI_API_KEY for the simulation.'),
  apiConfigType: z.string().describe('The type or category of the API configuration.'),
  apiUseCase: z.string().describe('The intended use case of the API.'),
});
export type ApiTestChatInput = z.infer<typeof ApiTestChatInputSchema>;

const ApiTestChatOutputSchema = z.object({
  aiResponse: z.string().describe('The AI assistant response.'),
});
export type ApiTestChatOutput = z.infer<typeof ApiTestChatOutputSchema>;

export async function apiTestChat(input: ApiTestChatInput): Promise<ApiTestChatOutput> {
  return apiTestChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'apiTestChatPrompt',
  input: { schema: ApiTestChatInputSchema },
  output: { schema: ApiTestChatOutputSchema },
  // Specify an OpenAI model, e.g., gpt-3.5-turbo or gpt-4
  // Ensure you have access to the model you specify.
  model: 'openai/gpt-3.5-turbo',
  prompt: `You are an expert API Testing Assistant.
You are currently in a simulated testing environment. You cannot make actual external API calls.
The user wants to discuss testing an API configuration.

For the purpose of this simulation, the API Key you should consider as your active 'OPENAI_API_KEY' is: {{{apiKey}}}

API Configuration Under Test:
- Type: {{{apiConfigType}}}
- Use Case: {{{apiUseCase}}}

User's message: {{{userInput}}}

Respond to the user's message.
If the user asks you to perform a specific action (e.g., "GET /users", "check status"), explain that you are in a simulation.
Describe what you *would* do or check if this were a real test environment, referencing the API details and the simulated 'OPENAI_API_KEY' (which is '{{{apiKey}}}' for this session) where appropriate.
For example, if the user says "Test the endpoint", you might respond with:
"Okay, if I were to test this '{{{apiConfigType}}}' API for '{{{apiUseCase}}}' using the simulated 'OPENAI_API_KEY' (which is '{{{apiKey}}}' for this session), I would typically start by sending a basic health check request (e.g., a GET request to a status endpoint if available). Then, I'd proceed with requests relevant to the use case, like fetching data, creating resources, etc., ensuring I check for expected status codes (200, 201, 400, 401, 403, 500), response times, and data integrity based on the API's specification."

Keep your responses concise and helpful for someone trying to understand API testing steps.
Do not offer to perform actions you cannot do in this simulation.
Do not reveal your underlying model or that you are an AI. Focus on the API testing assistant role.
`,
});

const apiTestChatFlow = ai.defineFlow(
  {
    name: 'apiTestChatFlow',
    inputSchema: ApiTestChatInputSchema,
    outputSchema: ApiTestChatOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) {
      return { aiResponse: "I'm sorry, I couldn't process that request. Please try again." };
    }
    return output;
  }
);

