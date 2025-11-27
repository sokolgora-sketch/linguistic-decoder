// src/engine/wordCandidates.ts

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
  fromWord: string;       // the original normalized word ("damage")
  language: LanguageCode; // "sq", "la", ...
  form: string;           // candidate spelling ("dëm", "damnum")
  opsUsed: string[];      // short labels of how we got here
  meaningHint?: string;   // optional gloss
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

  // v1: hard-code canon words while we wire the pipeline.
  switch (normalized) {
    case "damage":
      forms.push(
        {
          fromWord: "damage",
          language: "la",
          form: "damnum",
          opsUsed: ["latin-family", "historical-record"],
          meaningHint: "cut / act that leaves something in a harmed state",
        },
        {
          fromWord: "damage",
          language: "sq",
          form: "dëm",
          opsUsed: ["albanian-family", "functional-root"],
          meaningHint: "harm / loss that remains as a condition",
        }
      );
      break;

    case "study":
      forms.push(
        {
          fromWord: "study",
          language: "en",
          form: "study",
          opsUsed: ["base-form"],
          meaningHint: "apply the mind to know something",
        }
        // later: add Latin/Greek/Albanian candidates
      );
      break;

    case "mathematics":
    case "matematika":
      forms.push(
        {
          fromWord: normalized,
          language: "la",
          form: "mathematica",
          opsUsed: ["latin-family"],
          meaningHint: "art of learning / measuring",
        },
        {
          fromWord: normalized,
          language: "sq",
          form: "matematike",
          opsUsed: ["albanian-borrowed", "functional-split"],
          meaningHint: "measure what you have / what is",
        }
      );
      break;

    default:
      // for now: leave empty; later we’ll generate algorithmically
      break;
  }

  return forms;
}
