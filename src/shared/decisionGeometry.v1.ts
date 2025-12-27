// src/shared/decisionGeometry.v1.ts
//
// Decision Geometry v1
// - Deterministic, conservative.
// - Dictionary-first. If uncertain: return null (no guessing).

import type { VoicePath } from "../lib/sevenVowelsCore";

export type DecisionType = "IN" | "OUT" | "CUT_PLUS" | "CUT_MINUS" | "RELEASE";

export type FieldType =
  | "LIFE_FORM"
  | "RELATION_BALANCE"
  | "LAW_SYSTEM"
  | "FIELD_NETWORK"
  | "UNKNOWN";

export type DecisionGeometryTag = {
  fieldType: FieldType;
  decisionType: DecisionType;
  consonantSignal?: string; // e.g. ND-, RFZ, soft-flow
  notes?: string[];
};

function normalizeWord(w: string): string {
  return (w || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-zëç]/g, "");
}

function countVowels(path: VoicePath): Record<string, number> {
  const c: Record<string, number> = { A: 0, E: 0, I: 0, O: 0, U: 0, Y: 0, Ë: 0 };
  for (const v of path || []) {
    if (typeof v === "string" && v in c) c[v] += 1;
  }
  return c;
}

function dominantGroup(counts: Record<string, number>): "AË" | "EY" | "IU" | "O" | "UNKNOWN" {
  const sumAË = (counts.A || 0) + (counts["Ë"] || 0);
  const sumEY = (counts.E || 0) + (counts.Y || 0);
  const sumIU = (counts.I || 0) + (counts.U || 0);
  const sumO = counts.O || 0;

  const pairs = [
    ["AË", sumAË],
    ["EY", sumEY],
    ["IU", sumIU],
    ["O", sumO],
  ] as const;

  const max = Math.max(...pairs.map((p) => p[1]));
  if (max <= 0) return "UNKNOWN";
  const winners = pairs.filter((p) => p[1] === max).map((p) => p[0]);
  if (winners.length !== 1) return "UNKNOWN";
  return winners[0] as any;
}

export function deriveFieldType(vowelPath: VoicePath): FieldType {
  const path = vowelPath || [];
  const counts = countVowels(path);
  const hasO = (counts.O || 0) > 0;

  // v1 rule: if O present and path is short => RELATION_BALANCE
  if (hasO && path.length <= 2) return "RELATION_BALANCE";

  const dom = dominantGroup(counts);
  if (dom === "IU") return "LAW_SYSTEM";
  if (dom === "AË") return "LIFE_FORM";
  if (dom === "EY") return "FIELD_NETWORK";
  if (dom === "O") return "RELATION_BALANCE";

  return "UNKNOWN";
}

export function deriveDecisionType(word: string): {
  decisionType: DecisionType;
  consonantSignal?: string;
  notes?: string[];
} | null {
  const w = normalizeWord(word);

  // Strict v1 dictionary (explicit, deterministic)
  const dict: Record<
    string,
    { decisionType: DecisionType; consonantSignal?: string; notes?: string[] }
  > = {
    pranoj: { decisionType: "IN" },
    refuzoj: { decisionType: "OUT", consonantSignal: "RFZ" },

    shëroj: { decisionType: "CUT_PLUS" },
    thyej: { decisionType: "CUT_MINUS" },

    ftoj: { decisionType: "IN" },
    përjashtoj: { decisionType: "OUT" },

    ndëshkim: { decisionType: "CUT_MINUS", consonantSignal: "ND-" },
    falje: { decisionType: "RELEASE", consonantSignal: "soft-flow" },
  };

  if (dict[w]) return dict[w];

  // Minimal conservative heuristics (only if very clear)
  if (w.startsWith("nd")) return { decisionType: "CUT_MINUS", consonantSignal: "ND-" };
  if (w.includes("rfz")) return { decisionType: "OUT", consonantSignal: "RFZ" };

  return null;
}

export function decisionGeometryForWord(input: {
  word: string;
  vowel_path: VoicePath | null | undefined;
}): DecisionGeometryTag | null {
  const vowelPath = input.vowel_path || null;
  if (!vowelPath || vowelPath.length === 0) return null;

  const decision = deriveDecisionType(input.word);
  if (!decision) return null;

  return {
    fieldType: deriveFieldType(vowelPath),
    decisionType: decision.decisionType,
    consonantSignal: decision.consonantSignal,
    notes: decision.notes,
  };
}
