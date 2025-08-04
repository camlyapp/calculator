import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import {config} from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  config();
}

export const ai = genkit({
  plugins: [googleAI({apiKey: process.env.GEMINI_API_KEY})],
  model: 'googleai/gemini-2.0-flash',
});
