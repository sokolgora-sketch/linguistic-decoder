import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/google-genai';
import {ModelReference} from 'genkit/ai';

const GEMINI_KEY =
  process.env.GOOGLE_GENAI_API_KEY || process.env.GENKIT_API_KEY;

if (!GEMINI_KEY) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Missing Gemini API key. Please set GOOGLE_GENAI_API_KEY or GENKIT_API_KEY in your environment.');
  } else {
    // In development, we can allow the app to run without a key,
    // but AI features will fail.
    console.warn('Missing Gemini API key. AI features will not work. Please set GOOGLE_GENAI_API_KEY or GENKIT_API_KEY in your .env.local file.');
  }
}

export const ai = genkit({
  plugins: [googleAI({apiKey: GEMINI_KEY})],
});

export const MODELS: ModelReference[] = [
  googleAI.model('gemini-2.5-flash'),
  googleAI.model('gemini-pro'),
];
