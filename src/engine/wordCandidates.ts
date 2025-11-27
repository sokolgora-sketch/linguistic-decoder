// src/engine/wordCandidates.ts

import type { WordInput } from "./wordCleaner";

export type LanguageCode =
  | "sq"  // Albanian
  | "el"  // Greek
  | "la"  // Latin
  | "sa"  // Sanskrit
  | "en"
  | "fr"
  | "de"
  | "it"
  | "sl"
  | "ar"
  | "he"
  | "other";

export interface CandidateForm {
  fromWord: string;       // the original normalized word ("damage")
  language: LanguageCode; // "sq", "la", etc.
  form: string;           // concrete candidate form: "dëm", "damnum"
  opsUsed: string[];      // description of how we got here
  meaningHint?: string;
}

export interface CandidateGeneratorConfig {
  languages?: LanguageCode[];
  strict?: boolean;
}

export function generateCandidates(
  cleaned: WordInput,
  _config?: CandidateGeneratorConfig
): CandidateForm[] {
  const { normalized } = cleaned;
  const forms: CandidateForm[] = [];

  // v1: only damage — canonical test word
  if (normalized === "damage") {
    forms.push(
      {
        fromWord: "damage",
        language: "en",
        form: "damage",
        opsUsed: ["base-form"],
      },
      {
        fromWord: "damage",
        language: "la",
        form: "damnum",
        opsUsed: ["latin-family"],
      },
      {
        fromWord: "damage",
        language: "sq",
        form: "dëm",
        opsUsed: ["sq-family", "vowel A→Ë", "final -ë simplification"],
      }
    );
  }

  // later we generalise for study, mathematics, etc.
  return forms;
}
