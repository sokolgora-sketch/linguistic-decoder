// src/shared/originClaim.v1.ts
// Origin Claim Protocol v1 — computed, auditable, deterministic

export type OriginClaimVersion = "v1";
export type OriginClaimPolicy = "no_single_winner";

export type OriginClaimStatus = "pass" | "fail" | "unknown";

export type OriginClaimConfidence =
  | "insufficient_evidence"
  | "weak"
  | "medium"
  | "strong";

export interface OriginClaimCandidateV1 {
  /** Stable id, e.g. oc:la:studium */
  id: string;

  language: string; // e.g. "la", "sq", "en", "Latin"
  form: string | null;

  status: OriginClaimStatus;
  confidence: OriginClaimConfidence;

  /**
   * Stable bullets (short). Must be deterministic and not prose-y.
   * Recommended: derived from reasonCodes map for stability.
   */
  reasons: string[];

  /**
   * Stable pointers to evidence already in the result model.
   * No resolver required in v1—strings only.
   */
  evidenceRefs: string[];
}

/** Summary is a stable UI readout; still no single winner. */
export interface OriginClaimSummaryV1 {
  confidence: OriginClaimConfidence;
  note: string; // 1–2 lines
}

/** Inputs used to compute claim — keep small and stable. */
export interface OriginClaimInputsV1 {
  word: string;
  mode?: string | null;
  alphabet?: string | null;
}

export interface OriginClaimMetaV1 {
  engineVersion: string;
  generatedAt: string; // ISO
  inputs: OriginClaimInputsV1;

  /**
   * Optional: label snapshots without changing core logic.
   * - "provisional" = snapshot exists but not hand-audited
   * - "certified"   = hand-audited snapshot
   */
  fixtureTier?: "provisional" | "certified";
}

import type { OriginClaimSupportBundle } from "./originClaimSupport.v1";

import type { OriginClaimSupportBundle } from "./originClaimSupport.v1";

export interface OriginClaimV1 {
  version: OriginClaimVersion;
  policy: OriginClaimPolicy;

  support?: OriginClaimSupportBundle; // structural-only refs (no inference)

  support?: OriginClaimSupportBundle; // structural-only refs (no inference)

  candidates: OriginClaimCandidateV1[];

  summary: OriginClaimSummaryV1;
  meta: OriginClaimMetaV1;
}

/**
 * Reason codes (stable). Builder should use these and then map to strings.
 * This prevents “stable text drift.”
 */
export type OriginClaimReasonCode =
  | "OC_C1_PASS"
  | "OC_C1_FAIL"
  | "OC_C1_UNKNOWN"
  | "OC_C2_DEEPROOT_ALIGN"
  | "OC_C2_DEEPROOT_PRESENT_NO_MAP"
  | "OC_C3_VOICEPATH_MATCH"
  | "OC_C3_VOICEPATH_MISMATCH"
  | "OC_C3_VOICEPATH_UNKNOWN"
  | "OC_C4_MORPH_PRESENT"
  | "OC_C4_MORPH_MISSING"
  | "OC_STRICT_REQUIRES_DEEPROOT_FOR_MEDIUM";

export const ORIGIN_CLAIM_REASON_TEXT: Record<OriginClaimReasonCode, string> = {
  OC_C1_PASS: "Candidate marked pass by engine candidate layer.",
  OC_C1_FAIL: "Candidate marked fail by engine candidate layer.",
  OC_C1_UNKNOWN: "Candidate status unknown (no explicit pass/fail).",

  OC_C2_DEEPROOT_ALIGN: "DeepRoot references this language/family (carrier alignment).",
  OC_C2_DEEPROOT_PRESENT_NO_MAP:
    "DeepRoot present but no deterministic mapping to this candidate.",

  OC_C3_VOICEPATH_MATCH: "Candidate voice path aligns with primary voice path.",
  OC_C3_VOICEPATH_MISMATCH: "Candidate voice path conflicts with primary voice path.",
  OC_C3_VOICEPATH_UNKNOWN: "Voice path alignment cannot be determined from available fields.",

  OC_C4_MORPH_PRESENT: "Candidate shows non-empty morphological structure (root/suffix parts).",
  OC_C4_MORPH_MISSING: "Candidate lacks detectable morphological structure.",

  OC_STRICT_REQUIRES_DEEPROOT_FOR_MEDIUM:
    "Strict mode: medium+ confidence requires DeepRoot carrier alignment.",
};
