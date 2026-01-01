import "server-only";

import { genkit } from "genkit";
import { googleAI } from "@genkit-ai/google-genai";

/**
 * Genkit wiring for server-side flows.
 *
 * Build safety:
 * - Some Genkit versions do NOT expose the 'genkit/ai' subpath.
 * - Keep this file minimal and stable. Export only what flows need.
 *
 * NOTE:
 * - We export MODELS because flows import it (e.g. map-word-to-language-families).
 * - If you later standardize model ids, update them here only.
 */
export type ModelReference = string;

/**
 * Central model registry for flows.
 * Use the keys your flows expect. Add more keys if needed.
 */
export const MODELS: Record<string, ModelReference> = {
  DEFAULT: "googleai/gemini-1.5-flash",
  FLASH: "googleai/gemini-1.5-flash",
  PRO: "googleai/gemini-1.5-pro",
};

const GEMINI_KEY =
  process.env.GOOGLE_GENAI_API_KEY || process.env.GENKIT_API_KEY || "";

/**
 * Central Genkit instance.
 * IMPORTANT: use only in server code (API routes / server actions / flows).
 */
export const ai = genkit({
  plugins: [googleAI({ apiKey: GEMINI_KEY })],
});
