
// src/engine/wordCandidates.ts

import type { WordInput } from "./wordCleaner";

export type LanguageCode =
  | "sq"   // Albanian
  | "el"   // Greek
  | "la"   // Latin
  | "sa"   // Sanskrit
  | "en"   // English
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
  form: string;           // candidate written form (e.g. "dëm", "damnum")
  opsUsed: string[];      // description of ops / transformations
  meaningHint?: string;   // optional short gloss
}

export interface CandidateGeneratorConfig {
  languages?: LanguageCode[];
  strict?: boolean;
}

export function generateCandidates(
  cleaned: WordInput,
  config?: CandidateGeneratorConfig
): CandidateForm[] {
  const { normalized } = cleaned;
  const forms: CandidateForm[] = [];

  const langs = new Set<LanguageCode>(
    config?.languages ?? [
      "en",
      "sq",
      "la",
      "fr",
      "de",
      "it",
      "el",
      "sa",
      "other",
    ]
  );

  // --- HARD-CODED EXAMPLES FOR v1 ----------------------------------------

  if (normalized === "damage") {
    if (langs.has("en")) {
      forms.push({
        fromWord: "damage",
        language: "en",
        form: "damage",
        opsUsed: ["base-form"],
        meaningHint: "harm, injury, loss",
      });
    }
    if (langs.has("fr")) {
      forms.push({
        fromWord: "damage",
        language: "fr",
        form: "dommage",
        opsUsed: ["romance-family", "vowel-swap A→O"],
        meaningHint: "harm, inconvenience",
      });
    }
    if (langs.has("la")) {
      forms.push({
        fromWord: "damage",
        language: "la",
        form: "damnum",
        opsUsed: ["latin-root-family"],
        meaningHint: "loss, damage, penalty",
      });
    }
    if (langs.has("sq")) {
      forms.push(
        {
          fromWord: "damage",
          language: "sq",
          form: "dëm",
          opsUsed: ["sq-family", "vowel-swap A→Ë", "consonant simplification M"],
          meaningHint: "harm, loss, damage",
        },
        {
          fromWord: "damage",
          language: "sq",
          form: "dam",
          opsUsed: ["sq-dialect", "keep A"],
        },
        {
          fromWord: "damage",
          language: "sq",
          form: "dom",
          opsUsed: ["sq-dialect", "vowel-swap A→O"],
        }
      );
    }
  }

  // TODO: add similar blocks for "study", "mathematics", etc.
  // For any other word we return empty for now.
  // -----------------------------------------------------------------------

  return forms;
}
