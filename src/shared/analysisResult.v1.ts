// src/shared/analysisResult.v1.ts
//
// Canonical V1 analysis result shape.
// IMPORTANT: Do NOT reference deprecated legacy types here.

import type { DeepRootOutputV1 } from "./deepRoot.output.v1";
import type { RootMapV1 } from "./deepRoot.rootMap.v1";
import type { WordMatrixV1 } from "./wordMatrix.v1";
import type {
  SevenVoicesPath,
  FrontierCandidate,
  LanguageFamilySummary,
  EngineMetaSummary,
} from "./resultShape.v1";
import type { OriginClaimV1 as OriginClaimProtocolV1 } from "./originClaim.v1";

// -------------------- Canonical V1 enums --------------------

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

    // Heart primary path (adapter-safe): used for RootMap preference + DeepRoot↔Heart gate wiring.
    // Keep unknown because upstream may emit string/array/arrow/dash formats; normalization happens elsewhere.
    heartPrimaryPath?: unknown;

  // Frontier alternatives (if present)
  frontier?: FrontierCandidate[];

  // Optional analysis layers
  deepRoot?: DeepRootOutputV1 | null;

  // DeepRoot RootMap (optional; v0.1)
  rootMap?: RootMapV1;
  wordMatrix?: WordMatrixV1;

  // Origin Claim Protocol (always present once wired; keep optional for backward fixtures)
  originClaim?: OriginClaimProtocolV1;

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
