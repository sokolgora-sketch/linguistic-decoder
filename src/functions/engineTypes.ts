/**
 * ZË-RO Engine Contract (Canonical)
 *
 * Goal:
 * - One stable JSON shape returned by the engine for ONE word run.
 * - Multi-candidate output (no scores, no ranking language).
 * - Deterministic-friendly metadata (engineVersion, seed, strict/mode).
 *
 * Everything else (UI/API/tests) should depend on THIS contract.
 */

export type Voice = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

/** Keep language flexible for now; we can tighten later to a union. */
export type LangId = string;

/** Engine modes you already use conceptually: Basic / Go Deeper / Find Origin */
export type EngineMode = "basic" | "deeper" | "origin";

/** Small, explicit transform ops (for auditability). */
export type TransformOp =
  | { op: "vowel_swap"; from: Voice; to: Voice; note?: string }
  | { op: "vowel_insert"; v: Voice; note?: string }
  | { op: "vowel_delete"; v: Voice; note?: string }
  | { op: "s_sh"; from: "s" | "sh"; to: "s" | "sh"; note?: string }
  | { op: "g_gj"; from: "g" | "gj"; to: "g" | "gj"; note?: string }
  | { op: "h_j_optional"; around: "gu" | "gi"; note?: string }
  | { op: "final_toggle"; from: "a" | "ë"; to: "a" | "ë"; note?: string }
  | { op: "compound"; note?: string }
  | { op: "other"; note: string };

/** Your functional decomposition frame: Action | Instrument/Function | Unit/Result */
export type FunctionalDecomposition = {
  action?: string;
  instrument?: string;
  unit?: string;
  /** freeform fallback if we can’t cleanly split */
  raw?: string;
};

export type EngineCandidate = {
  language: LangId;
  /** The candidate surface form in that language */
  form: string;

  /**
   * Decomposition parts (smallest pieces possible).
   * Keep them as strings; ops describe transformations.
   */
  decomposition: string[];
  ops: TransformOp[];

  /** Action | Instrument/Function | Unit/Result statement (no scoring). */
  functional: FunctionalDecomposition;

  /** Vowel sequence/path for this candidate (e.g., "U-A-Ë"). */
  vowel_path: Voice[];

  /** Optional ring-fit labels you use (inner/middle/outer etc.) */
  ring_fit?: string;

  /** Signals/notes: short, factual, not persuasive. */
  signals?: string[];
  notes?: string[];
};

export type HeartSummary = {
  /** Heart-level vowel read from the input word (not candidates). */
  vowel_path: Voice[];
  /** Any ring labels you compute at heart-level. */
  ring_fit?: string;

  /** Optional counts or traits, kept flexible to avoid churn. */
  traits?: Record<string, unknown>;
};

export type EngineMeta = {
  engineVersion: string;
  mode: EngineMode;
  strict: boolean;

  /**
   * Determinism knobs:
   * If you call an LLM, you should store the settings used.
   * If no LLM is used, these can be omitted.
   */
  llm?: {
    provider: string;
    model: string;
    temperature: number;
    topP: number;
    topK: number;
    seed?: number;
  };

  /** Timestamp for logging/debug; ISO string. */
  createdAt: string;
};

export type ProtocolReport = {
  meta: EngineMeta;

  input: {
    word: string;
    /** normalized/cleaned word used internally */
    cleaned?: string;
  };

  heart: HeartSummary;

  /**
   * IMPORTANT:
   * - No ranking
   * - No score
   * - Multiple “passing” candidates allowed
   */
  candidates: EngineCandidate[];

  /** Optional global notes (warnings, limitations, etc.) */
  notes?: string[];
};
