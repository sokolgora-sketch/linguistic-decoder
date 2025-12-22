// src/shared/analysisResult.v1.ts
//
// Canonical V1 analysis result shape.
// IMPORTANT: Do NOT reference deprecated legacy types here.

import type { DeepRootSummaryV1 } from "./deepRoot.v1";
import type { WordMatrixV1 } from "./wordMatrix.v1";
import type {
  SevenVoicesPath,
  FrontierCandidate,
  LanguageFamilySummary,
  EngineMetaSummary,
} from "./resultShape.v1";


// Canonical V1 enums (contract-level, not UI-level)
export type Mode = "strict" | "open";
export type Alphabet =
  | "auto"
  | "albanian"
  | "latin"
  | "sanskrit"
  | "ancient_greek"
  | "pie"
  | "turkish"
  | "german";

// Minimal shape required by current codebase (wordMatrix + UI + adapters).
export type AnalyzeWordResultV1 = {
  // Required in existing code (wordMatrix.v1.ts expects string)
  word: string;

  // Required in existing code (export + caching)
  sanitized: string;

  // Contract-stable identity fields
  engineVersion: string;
  mode: Mode;
  alphabet: Alphabet;

  // Heart / Frontier primary path
  primaryPath?: SevenVoicesPath;

  // Frontier alternatives (if present)
  frontier?: FrontierCandidate[];

  // Optional analysis layers
  deepRoot?: DeepRootSummaryV1;
  wordMatrix?: WordMatrixV1;

  // Existing code references result.candidates (canon list)
  // wordMatrix.v1.ts reads: fam.language, fam.form, fam.voices?.voiceSequence
  candidates?: Array<{
    language: string;
    form: string;
    voices?: {
      voiceSequence?: string[];
      [k: string]: unknown;
    };
    [k: string]: unknown;
  }>;

  // Language families block
  languageFamilies?: LanguageFamilySummary[];

  // Existing code references result.symbolicCore?.notes
  symbolicCore?: {
    notes: string[];
    [k: string]: unknown;
  };

  // Symbolic layer (current experiments)
  symbolic?: unknown;

  // Engine meta (version/timestamp)
  meta?: EngineMetaSummary;

  // Any future / debug payloads
  debug?: unknown;

  // Allow forward-compatible extra fields without forcing refactors
  [k: string]: unknown;
};
