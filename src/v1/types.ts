export type SevenVowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export type EvidenceMath7V1 = {
  vowels: SevenVowel[];
  indices: number[]; // 0..6
  sum: number;
  totalMod7: number; // totalMod7FromSum0to6(sum0to6)  (0..6)
};

export type EvidenceV1 = {
  basis: string; // exact string used for surface analysis
  surfaceVowels: SevenVowel[];
  surfacePath: string; // "A-E-Ë" (or "")
  math7: EvidenceMath7V1;

  /** Evidence ledger (UI instrument contract v0.1) */
  normalizationSteps: string[];
  ops: string[];
  notes: string[];
  signals: string[];
};

export type MetaV1 = {
  engineVersion: string;
  contractVersion: string;
  rulesetVersion: string;
  canonVersion: string;
};

export interface Candidate {
  language: string;            // e.g. "sq", "la", "en", "unknown"
  form: string;                // candidate surface form
  decomposition: string[];     // minimal parts after allowed ops
  vowelPath: string;           // e.g. "E-Ë", "A-Ë"
  functionalStatement: string; // 1–2 sentence explanation
  notes?: string[];            // optional short bullets
}

export interface AnalysisResult {
  word: string;           // original input from user
  normalizedWord: string; // cleaned form used internally
  candidates: Candidate[];
  engineVersion: string;  // e.g. "v1.0.0"

  // Scientific Output Package v1 — Phase 1 evidence
  evidence: EvidenceV1;
  meta: MetaV1;

  // Optional; omit when empty
  warnings?: string[];
}
