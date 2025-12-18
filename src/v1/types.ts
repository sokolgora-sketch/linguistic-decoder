/**
 * ZË-RO v1 Contract Types
 * - Deterministic output shape
 * - No scores, no modes
 * - candidates[0] is primary by ordering only
 */

export type EngineVersion = string; // e.g. "v1.0.0"

export interface AnalysisResult {
  /** Original user input (unmodified) */
  word: string;

  /** Cleaned/normalized word used internally */
  normalizedWord: string;

  /** Ordered list of candidates (no numeric ranking exposed) */
  candidates: Candidate[];

  /** Engine contract version */
  engineVersion: EngineVersion;
}

export interface Candidate {
  /** Language code: "sq", "la", "en", "unknown", etc. */
  language: string;

  /** Candidate surface form */
  form: string;

  /** Minimal parts after allowed ops */
  decomposition: string[];

  /** Vowel path string, e.g. "U-I", "A-I-Ë" */
  vowelPath: string;

  /** 1–2 sentence functional explanation */
  functionalStatement: string;

  /** Optional short bullets (debug/notes) */
  notes?: string[];
}
