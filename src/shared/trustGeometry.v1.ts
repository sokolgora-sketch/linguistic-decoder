// src/shared/trustGeometry.v1.ts
//
// Trust Geometry v1
// - Deterministic, conservative.
// - Dictionary-first. If uncertain: return null (no guessing).
// - Built on top of Decision Geometry v1.

import type { VoicePath } from "../lib/sevenVowelsCore";
import {
  deriveFieldType,
  deriveDecisionType,
  type DecisionType,
  type FieldType,
  type DecisionGeometryTag,
} from "./decisionGeometry.v1";

export type TrustRole =
  | "PROMISE_LINE"
  | "KEEP_LINE"
  | "PROMISE_BREAK"
  | "REPAIR_LINE"
  | "FORGIVE_RELEASE"
  | "UNKNOWN";

export type TrustGeometryTag = {
  fieldType: FieldType;
  decisionType: DecisionType;
  role: TrustRole;
  consonantSignal?: string;
  notes?: string[];
};

function normalizeWord(w: string): string {
  return (w || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-zëç]/g, "");
}

function roleFromDecisionType(dt: DecisionType): TrustRole {
  if (dt === "CUT_MINUS") return "PROMISE_BREAK";
  if (dt === "CUT_PLUS") return "REPAIR_LINE";
  if (dt === "RELEASE") return "FORGIVE_RELEASE";
  return "UNKNOWN";
}

export function trustGeometryForWord(input: {
  word: string;
  vowel_path: VoicePath | null | undefined;
  decision_geometry?: DecisionGeometryTag | null;
}): TrustGeometryTag | null {
  const vowelPath = input.vowel_path || null;
  if (!vowelPath || vowelPath.length === 0) return null;

  const w = normalizeWord(input.word);

  // Prefer Decision Geometry output if provided; else derive deterministically.
  const dg =
    input.decision_geometry ??
    (() => {
      const d = deriveDecisionType(input.word);
      if (!d) return null;
      return {
        fieldType: deriveFieldType(vowelPath),
        decisionType: d.decisionType,
        consonantSignal: d.consonantSignal,
        notes: d.notes,
      } satisfies DecisionGeometryTag;
    })();

  if (!dg) return null;

  // Strict v1 trust dictionary
  const dict: Record<string, { role: TrustRole; notes?: string[] }> = {
    // PROMISE / KEEP (both IN, but semantically different)
    premtoj: { role: "PROMISE_LINE", notes: ["PROMISE: commit (IN)"] },
    mbaj: { role: "KEEP_LINE", notes: ["KEEP: maintain the promise (IN)"] },

    // BREAK (CUT-)
    shkel: { role: "PROMISE_BREAK", notes: ["BREAK: violation (CUT_MINUS)"] },
    thyej: { role: "PROMISE_BREAK", notes: ["BREAK: rupture (CUT_MINUS)"] },

    // REPAIR (CUT+)
    shëroj: { role: "REPAIR_LINE", notes: ["REPAIR: corrective cut (CUT_PLUS)"] },

    // FORGIVE (RELEASE)
    falje: { role: "FORGIVE_RELEASE", notes: ["FORGIVE: release + reset (RELEASE)"] },
  };

  const fieldType = deriveFieldType(vowelPath);
  const decisionType = dg.decisionType;

  const hit = dict[w];
  if (hit) {
    const notes = [...(dg.notes || []), ...(hit.notes || [])];

    const expected: Partial<Record<TrustRole, DecisionType>> = {
      PROMISE_LINE: "IN",
      KEEP_LINE: "IN",
      PROMISE_BREAK: "CUT_MINUS",
      REPAIR_LINE: "CUT_PLUS",
      FORGIVE_RELEASE: "RELEASE",
    };

    const exp = expected[hit.role];
    if (exp && exp !== decisionType) {
      notes.push(`NOTE: role=${hit.role} expects ${exp} but decisionType=${decisionType}`);
    }

    return {
      fieldType,
      decisionType,
      role: hit.role,
      consonantSignal: dg.consonantSignal,
      notes,
    };
  }

  // Conservative fallback: only unambiguous decision types map to trust roles.
  // IN is ambiguous (PROMISE vs KEEP) so we do NOT guess.
  const fallbackRole = roleFromDecisionType(decisionType);
  if (fallbackRole === "UNKNOWN") return null;

  return {
    fieldType,
    decisionType,
    role: fallbackRole,
    consonantSignal: dg.consonantSignal,
    notes: dg.notes,
  };
}
