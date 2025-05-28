
import { genkit } from 'genkit';
import { openai } from '@genkit-ai/openai'; // Import the OpenAI plugin
// Remove or comment out the Google AI plugin if not used simultaneously
// import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [
    openai({ // Initialize the OpenAI plugin
      // You can specify your OpenAI API key here if you don't want to use environment variables
      // apiKey: 'your_openai_api_key_here_if_not_using_env_var', 
    }),
    // If you still want to use Google AI for other features, you can keep it:
    // googleAI(),
  ],
  // model: 'googleai/gemini-2.0-flash', // This will be overridden by model choice in flows/prompts
});
