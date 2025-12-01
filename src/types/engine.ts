// src/types/engine.ts

// Core enums / unions
export type Mode = "strict" | "open";

export type AlphabetId =
  | "auto"
  | "albanian"
  | "latin"
  | "sanskrit"
  | "ancient_greek"
  | "pie"
  | "turkish"
  | "german";

export type VowelId = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

// Operations the solver can perform on the word
export type OperationKind =
  | "insert"
  | "substitute"
  | "delete"
  | "closure"
  | "none"
  | "other";

export interface OperationSummary {
  kind: OperationKind;
  description: string;
  cost?: number;
}

// Per-language candidate for a path (Seven-Voices etymology layer)
export interface CandidateLanguage {
  language: string; // "Albanian" | "Latin" | ...
  form: string; // surface form
  decomposition: string[]; // ["mat", "e", "mat", "tik"]
  functionalStatement: string; // short sentence: Action | Instrument | Unit
  vowelPath: VowelId[]; // for this candidate
  ringFit?: string; // e.g. "inner", "outer", "mixed"
  notes?: string[];
}

// One path the engine found (primary or frontier)
export interface PathSummary {
  id: string; // "primary" | "cand-1" | "cand-2"
  label?: string; // human readable label

  // Core Seven-Voices info
  voicePath: VowelId[]; // e.g. ["U", "I"]
  vowelNumber?: number[]; // base-7 digits, if you expose them
  score?: number; // if you keep any score / cost

  operations: OperationSummary[];
  languages: CandidateLanguage[];

  notes?: string[];
}

// Final payload we return from /api/analyze
export interface EnginePayload {
  // Engine & config
  engineVersion: string; // e.g. "seven-vowels-core-v1"
  manifestVersion: string;
  mode: Mode;
  alphabet: AlphabetId;

  // Input
  inputWord: string; // raw word from user
  normalizedWord: string; // cleaned version

  // Performance
  solveMs: number;

  // Main results
  primaryPath: PathSummary | null;
  frontierPaths: PathSummary[];

  // Anything else you already have
  meta?: Record<string, unknown>;
  signals?: string[];
}