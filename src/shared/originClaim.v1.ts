// src/shared/originClaim.v1.ts
//
// Origin Claim Protocol — V1
// This file defines WHAT can be claimed, not HOW it is computed.
//
// Rules:
// - No single winner
// - Claims are evidence-scoped
// - Absence of evidence is explicit
// - Designed for scientific inspection, not persuasion

// Claim confidence is qualitative, not probabilistic
export type OriginConfidence =
  | "high"
  | "medium"
  | "low"
  | "insufficient_evidence";

// Why a claim exists (traceability)
export type OriginEvidenceKind =
  | "phonetic_alignment"
  | "functional_decomposition"
  | "seven_voices_path"
  | "comparative_family"
  | "historical_attestation"
  | "negative_evidence";

// One candidate origin hypothesis
export type OriginCandidateV1 = {
  language: string;           // e.g. "albanian", "latin", "sanskrit"
  form: string;               // candidate root or word form
  confidence: OriginConfidence;

  // Human-readable but constrained
  rationale: string;

  // Machine-readable evidence tags
  evidence: OriginEvidenceKind[];

  // Optional links to existing analysis layers
  voicePath?: string;         // e.g. "U-I"
  functionalGloss?: string;   // short functional meaning

  // Forward-compatible extension
  [k: string]: unknown;
};

// Canonical Origin Claim (V1)
export type OriginClaimV1 = {
  version: "v1";

  // Always explicit: engine never asserts a single absolute origin
  policy: "no_single_winner";

  // Zero or more candidates (empty is valid and meaningful)
  candidates: OriginCandidateV1[];

  // Overall assessment
  summary: {
    confidence: OriginConfidence;
    note: string; // e.g. "Multiple plausible origins; no decisive evidence"
  };

  // Engine bookkeeping (not linguistic evidence)
  meta?: {
    engineVersion?: string;
    generatedAt?: string; // ISO timestamp
    [k: string]: unknown;
  };

  // Forward compatibility
  [k: string]: unknown;
};
