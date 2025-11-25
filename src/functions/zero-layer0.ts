// src/functions/zero-layer0.ts
// Layer 0: Input & Family Finder for ZË-RO.

import { Layer0Output } from "./zero-heart-types";

/**
 * Very lightweight language guess.
 * This is just a helper hint for later, not a truth claim.
 */
function guessLanguage(normalized: string): string | undefined {
  // You can extend this later with better heuristics.
  if (/^[a-z]+$/.test(normalized)) {
    return "English"; // safe default for now
  }
  return undefined;
}

/**
 * Tiny hand-made “family hints” table.
 * These are just CLUES, not origin decisions.
 * We can grow / replace this from a database later.
 */
const FAMILY_HINTS: Record<string, string[]> = {
  damage: ["damage", "damnum", "dommage", "danno", "daño", "dëm"],
  religion: ["religion", "religio", "religare", "ligj"],
  mystery: ["mystery", "mysterion", "mister", "misteri", "i msheftë"],
  philosophy: ["philosophy", "philosophia", "filozofi"],
  study: ["study", "studium", "students", "s'tu-di-m"],
  language: ["language", "lingua", "langue", "gjuhë"],
  mathematics: ["mathematics", "matematika", "mathema", "mat"]
};

/**
 * Layer 0 main function.
 * - Normalizes the input.
 * - Guesses a coarse language.
 * - Returns a small list of “family forms”.
 * NO Seven-Voices logic, NO origin claims here.
 */
export function buildLayer0(input: string): Layer0Output {
  const normalized = input
    .trim()
    .toLowerCase()
    // strip trivial punctuation
    .replace(/[!?.,;:()"'`]+/g, "");

  const language_guess = guessLanguage(normalized);

  const fromHints = FAMILY_HINTS[normalized] ?? [normalized];

  // de-duplicate while keeping order
  const family_forms = Array.from(new Set(fromHints));

  const result: Layer0Output = {
    input_word: input,
    normalized,
    language_guess,
    family_forms
  };

  return result;
}
