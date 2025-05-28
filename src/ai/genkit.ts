
import { genkit } from 'genkit';
import { openai } from '@genkit-ai/openai'; // Import the OpenAI plugin
// Google AI plugin import and usage are already commented out or removed.

export const ai = genkit({
  plugins: [
    openai({ // Initialize the OpenAI plugin
      // You can specify your OpenAI API key here if you don't want to use environment variables
      // apiKey: 'your_openai_api_key_here_if_not_using_env_var', 
    }),
    // Google AI plugin is not included here.
  ],
  // model: 'googleai/gemini-2.0-flash', // This would be for Google AI, can be removed if only OpenAI is used.
});
