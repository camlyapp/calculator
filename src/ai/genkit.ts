import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// In production, environment variables are set by the hosting environment.
// The apphosting.yaml file configures the GEMINI_API_KEY secret.

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  // You can specify a default model for convenience.
  // model: 'googleai/gemini-1.5-flash',
});
