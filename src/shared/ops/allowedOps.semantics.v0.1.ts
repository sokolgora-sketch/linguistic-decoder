// src/shared/ops/allowedOps.semantics.v0.1.ts
// BRAIN-0.2 — Ops Semantics Dictionary v0.1
// Canonical meaning/behavior metadata for each AllowedOpId.
// This is NOT a ranking system. It is a vocabulary law.

import type { AllowedOpId } from "./allowedOps.v0.1";

export type OpClass =
  | "identity"
  | "phonetic"   // consonant softening/hardening, reversible, local
  | "vowel"      // vowel mapping/swap rules
  | "final"      // terminal swaps (-a/-ë etc.)
  | "morph";     // compounding / multi-token join

export type OpMeaningRisk = "low" | "medium" | "high";

export type OpSemantic = Readonly<{
  id: AllowedOpId;
  class: OpClass;

  /**
   * True = operation has a well-defined inverse in our law.
   * (Even if the engine doesn't automatically apply the inverse.)
   */
  reversible: boolean;

  /**
   * True = typically preserves functional meaning (phonetic/dialect normalization).
   * False = often changes meaning or can jump between roots without strong evidence.
   */
  preservesMeaning: boolean;

  /**
   * Compact severity for audits and gates.
   * - low: safe normalization (identity, mild phonetics, final dialect swaps)
   * - medium: plausible but can drift (generic vowel swaps, final swap bucket)
   * - high: structural/morphological (compound) or broad swaps that can “teleport”
   */
  meaningRisk: OpMeaningRisk;

  /**
   * Short human label (stable string; used in UI/debug only).
   */
  label: string;

  /**
   * Optional notes (stable strings; keep short).
   */
  notes?: readonly string[];
}>;

export const OPS_SEMANTICS_VERSION = "ops.semantics.v0.1" as const;

export const OPS_SEMANTICS_V0_1: Readonly<Record<AllowedOpId, OpSemantic>> = Object.freeze({
  exact: Object.freeze({
    id: "exact",
    class: "identity",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "low",
    label: "Exact match",
  }),

  vowel_swap: Object.freeze({
    id: "vowel_swap",
    class: "vowel",
    reversible: false,
    preservesMeaning: false,
    meaningRisk: "high",
    label: "Vowel swap (generic)",
    notes: Object.freeze([
      "Broad vowel substitution can jump between unrelated roots.",
      "Only acceptable when constrained by additional evidence (skeleton + carriers).",
    ]),
  }),

  y_to_i: Object.freeze({
    id: "y_to_i",
    class: "vowel",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "low",
    label: "Y↔I normalization",
    notes: Object.freeze(["Dialect/orthography normalization (tight mapping)."]),
  }),

  final_swap: Object.freeze({
    id: "final_swap",
    class: "final",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "medium",
    label: "Final swap (a↔ë bucket)",
    notes: Object.freeze(["Terminal marker swap; treated as a morphological surface variance bucket."]),
  }),

  s_to_sh: Object.freeze({
    id: "s_to_sh",
    class: "phonetic",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "low",
    label: "s→sh softening",
  }),

  sh_to_s: Object.freeze({
    id: "sh_to_s",
    class: "phonetic",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "low",
    label: "sh→s hardening",
  }),

  g_to_gj: Object.freeze({
    id: "g_to_gj",
    class: "phonetic",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "low",
    label: "g→gj palatalization",
  }),

  gj_to_g: Object.freeze({
    id: "gj_to_g",
    class: "phonetic",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "low",
    label: "gj→g depalatalization",
  }),

  final_a_to_e: Object.freeze({
    id: "final_a_to_e",
    class: "final",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "low",
    label: "final a→e",
  }),

  final_e_to_a: Object.freeze({
    id: "final_e_to_a",
    class: "final",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "low",
    label: "final e→a",
  }),

  optional_h_removed: Object.freeze({
    id: "optional_h_removed",
    class: "phonetic",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "medium",
    label: "optional h removed",
    notes: Object.freeze(["Only valid in constrained gu/gi neighborhoods per law."]),
  }),

  optional_h_added: Object.freeze({
    id: "optional_h_added",
    class: "phonetic",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "medium",
    label: "optional h added",
    notes: Object.freeze(["Only valid in constrained gu/gi neighborhoods per law."]),
  }),

  optional_j_removed: Object.freeze({
    id: "optional_j_removed",
    class: "phonetic",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "medium",
    label: "optional j removed",
    notes: Object.freeze(["Only valid in constrained gu/gi neighborhoods per law."]),
  }),

  optional_j_added: Object.freeze({
    id: "optional_j_added",
    class: "phonetic",
    reversible: true,
    preservesMeaning: true,
    meaningRisk: "medium",
    label: "optional j added",
    notes: Object.freeze(["Only valid in constrained gu/gi neighborhoods per law."]),
  }),

  compound: Object.freeze({
    id: "compound",
    class: "morph",
    reversible: false,
    preservesMeaning: false,
    meaningRisk: "high",
    label: "Compound join",
    notes: Object.freeze([
      "Structural operation: combines multiple units.",
      "High risk of meaning inflation unless decomposition is explicitly evidenced.",
    ]),
  }),
});

export function getOpSemantic(id: AllowedOpId): OpSemantic {
  return OPS_SEMANTICS_V0_1[id];
}
