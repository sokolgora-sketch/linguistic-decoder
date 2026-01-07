// src/shared/analysisResult.v1.ts
//
// Canonical V1 analysis result shape.
// IMPORTANT: Do NOT reference deprecated legacy types here.

import type { DeepRootOutputV1 } from "./deepRoot.output.v1";
import type { WordMatrixV1 } from "./wordMatrix.v1";
import type {
  SevenVoicesPath,
  FrontierCandidate,
  LanguageFamilySummary,
  EngineMetaSummary,
} from "./resultShape.v1";

// -------------------- Origin Claim Protocol (V1) --------------------

// Contract-level status (no UI semantics)
export type OriginClaimStatusV1 =
  | "insufficient_evidence"
  | "hypothesis"
  | "supported"
  | "rejected";

// Minimal contract shape (keep stable; expand later via [k: string]: unknown)
export type OriginClaimV1 = {
  version: "v1";
  status: OriginClaimStatusV1;

  // Optional: when hypothesis/supported, identify the claim target
  claimedLanguage?: string | null;

  // Optional: short human-readable rationale
  rationale?: string[]; // small bullets, stable ordering

  // Always allowed for forward compatibility
  [k: string]: unknown;
};

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

  // Frontier alternatives (if present)
  frontier?: FrontierCandidate[];

  // Optional analysis layers
  deepRoot?: DeepRootOutputV1 | null;
  wordMatrix?: WordMatrixV1;

  // Origin Claim Protocol (always present once wired; keep optional for backward fixtures)
  originClaim?: OriginClaimV1;

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
