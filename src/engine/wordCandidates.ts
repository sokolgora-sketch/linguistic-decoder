// src/engine/wordCandidates.ts
// Generates structural candidate forms for a given input word.

import type { WordInput } from "./wordCleaner";

export type LanguageCode =
  | "sq"  // Albanian
  | "el"  // Greek
  | "la"  // Latin
  | "sa"  // Sanskrit
  | "en"  // English
  | "fr"
  | "de"
  | "it"
  | "sl"
  | "ar"
  | "he"
  | "other";

export interface CandidateForm {
  fromWord: string;       // normalized input (e.g. "damage")
  language: LanguageCode; // "sq", "la", etc.
  form: string;           // candidate form (e.g. "dëm", "damnum")
  opsUsed: string[];      // brief description of transforms
  meaningHint?: string;   // short gloss (optional)
}

export interface CandidateGeneratorConfig {
  languages?: LanguageCode[]; // if provided, only keep these
  strict?: boolean;           // reserved for later
}

function languageAllowed(
  code: LanguageCode,
  config?: CandidateGeneratorConfig
): boolean {
  if (!config?.languages || config.languages.length === 0) return true;
  return config.languages.includes(code);
}

/**
 * Generate structural candidates for a cleaned word.
 * For now we implement explicit logic for the canon word "damage".
 */
export function generateCandidates(
  cleaned: WordInput,
  config?: CandidateGeneratorConfig
): CandidateForm[] {
  const word = cleaned.normalized;

  const forms: CandidateForm[] = [];

  if (word === "damage") {
    // English surface form
    if (languageAllowed("en", config)) {
      forms.push({
        fromWord: word,
        language: "en",
        form: "damage",
        opsUsed: ["surface-form"],
        meaningHint: "harm, loss, or injury done to something",
      });
    }

    // French – same Latin family, shifted vowel
    if (languageAllowed("fr", config)) {
      forms.push({
        fromWord: word,
        language: "fr",
        form: "dommage",
        opsUsed: ["romance-family", "vowel-shift A→O", "suffix -age"],
        meaningHint: "harm, loss, or inconvenience",
      });
    }

    // Latin – damnum
    if (languageAllowed("la", config)) {
      forms.push({
        fromWord: word,
        language: "la",
        form: "damnum",
        opsUsed: ["latin-root-family"],
        meaningHint: "loss, damage, harm",
      });
    }

    // Albanian – dëm (+ dialectal variants)
    if (languageAllowed("sq", config)) {
      forms.push(
        {
          fromWord: word,
          language: "sq",
          form: "dëm",
          opsUsed: [
            "sq-family",
            "vowel-swap A→Ë",
            "consonant simplification -m",
          ],
          meaningHint: "harm, damage, loss",
        },
        {
          fromWord: word,
          language: "sq",
          form: "dam",
          opsUsed: ["sq-family", "base-form", "open vowel A"],
          meaningHint: "dialectal / earlier cut-root",
        },
        {
          fromWord: word,
          language: "sq",
          form: "dem",
          opsUsed: ["sq-family", "vowel-swap A→E"],
          meaningHint: "variant with mid-vowel",
        },
        {
          fromWord: word,
          language: "sq",
          form: "dom",
          opsUsed: ["sq-family", "vowel-swap A→O"],
          meaningHint: "variant with rounded vowel",
        }
      );
    }

    return forms;
  }

  // For other words we return an empty list for now.
  // Later we’ll generalise using your Search-Operation protocol.
  return forms;
}
