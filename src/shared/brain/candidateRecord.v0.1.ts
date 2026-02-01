// BRAIN-0 — CandidateRecord Contract v0.1
// The only shape the Brain is allowed to hand to the Heart (after normalization).
// No ranking. No scoring. No UI concerns.

export const CANDIDATE_RECORD_VERSION = "brain.candidateRecord.v0.1" as const;

export type CandidateSourceKind = "SEED" | "DATASET";

export type CandidateFunctionTag = "ACTION" | "FUNCTION" | "UNIT" | "UNKNOWN";

export type CandidateExplain = Readonly<{
  /** segment from the input word: e.g. "stu", "dy" */
  segment: string;
  /** short note: e.g. "y→i normalization" */
  note?: string;
}>;

export type CandidateSource = Readonly<{
  kind: CandidateSourceKind;
  /**
   * Human-readable reference:
   * - SEED: "seedLexicon.v0.1"
   * - DATASET: "glottolog:4.8", "wiktionary-dump:2026-02-01", etc.
   */
  ref: string;
  /**
   * Version string of the producing artifact.
   * This is how determinism is preserved across future updates.
   */
  version: string;
}>;

export type CandidateRecord = Readonly<{
  /** schema version */
  v: typeof CANDIDATE_RECORD_VERSION;

  /**
   * WLT language node ID (stable).
   * Example: "wlt:indo-european.albanian"
   */
  languageId: string;

  /** display only (never used as key) */
  languageName: string;

  /** candidate carrier form in that language: e.g. "di", "shtu" */
  form: string;

  /** short gloss: e.g. "to know", "to add/increase" */
  gloss: string;

  /**
   * Minimal proto-root labels that this record claims to carry.
   * Example: ["DI"] or ["SHTU"].
   * These are tags, not proof.
   */
  roots: readonly string[];

  /**
   * Optional explanation links back to input segments.
   * Example: [{ segment: "dy", note: "Y↔I" }]
   */
  explains?: readonly CandidateExplain[];

  /**
   * Declared operations used to connect segment↔carrier.
   * Example: ["Y↔I", "S↔SH"].
   * Heart will validate these against allowed ops.
   */
  opsUsed: readonly string[];

  /** Optional functional role hint (Heart may ignore) */
  functionTag?: CandidateFunctionTag;

  /** provenance */
  source: CandidateSource;
}>;

export type CandidateRecordNormalized = Readonly<{
  ok: true;
  record: CandidateRecord;
}>;

export type CandidateRecordRejected = Readonly<{
  ok: false;
  errors: readonly string[];
}>;

export type CandidateRecordNormalizeResult =
  | CandidateRecordNormalized
  | CandidateRecordRejected;
