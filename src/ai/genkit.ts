import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {ModelReference} from 'genkit/ai';

export const ai = genkit({
  plugins: [googleAI()],
});

export const MODELS: ModelReference[] = [
  googleAI.model('gemini-1.5-flash-latest'),
  googleAI.model('gemini-pro'),
];
