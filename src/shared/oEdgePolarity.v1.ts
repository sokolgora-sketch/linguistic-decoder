// src/shared/oEdgePolarity.v1.ts
//
// O-Edge Polarity v1
// - Deterministic, conservative.
// - Dictionary-first. If uncertain: return null (no guessing).
//
// Captures a reusable boundary pattern:
// - O as the mediator/field vowel at decision boundaries.
// - Consonants steer IN/OUT around that O-field.
// - Canon starters: Albanian (po/jo), Mandarin (you / meiyou).

import type { VoicePath } from "../lib/sevenVowelsCore";

export type OEdgeAxis = "YES_NO" | "HAVE_NOT_HAVE" | "UNKNOWN";

export type OEdgePolarity = "YES" | "NO" | "HAVE" | "NOT_HAVE" | "UNKNOWN";

export type OEdgePolarityTag = {
  axis: OEdgeAxis;
  polarity: OEdgePolarity;
  consonantSignal?: string; // e.g. P-, J-, Y-, MEI-
  notes?: string[];
};

function normalizeLatinLike(w: string): string {
  return (w || "")
    .trim()
    .toLowerCase()
    // keep latin letters only (conservative)
    .replace(/[^a-z]/g, "");
}

function hasO(path: VoicePath | null | undefined): boolean {
  const p = path || [];
  return p.some((v) => v === "O");
}

export function oEdgePolarityForWord(input: {
  word: string;
  vowel_path: VoicePath | null | undefined;
}): OEdgePolarityTag | null {
  const vowelPath = input.vowel_path || null;
  if (!vowelPath || vowelPath.length === 0) return null;

  // v1: we only tag when O is actually present in the vowel-path (strict boundary marker).
  if (!hasO(vowelPath)) return null;

  const w = normalizeLatinLike(input.word);

  // v1 dictionary (explicit)
  // Albanian: po/jo polarity on O
  // Mandarin pinyin: you / meiyou (tones removed)
  const dict: Record<string, OEdgePolarityTag> = {
    po: {
      axis: "YES_NO",
      polarity: "YES",
      consonantSignal: "P-",
      notes: ["AL: po = yes", "O-field acceptance"],
    },
    jo: {
      axis: "YES_NO",
      polarity: "NO",
      consonantSignal: "J-",
      notes: ["AL: jo = no", "O-field rejection"],
    },

    you: {
      axis: "HAVE_NOT_HAVE",
      polarity: "HAVE",
      consonantSignal: "Y-",
      notes: ["ZH (pinyin): you = have/exist", "presence inside field"],
    },
    meiyou: {
      axis: "HAVE_NOT_HAVE",
      polarity: "NOT_HAVE",
      consonantSignal: "MEI-",
      notes: ["ZH (pinyin): mei-you = not have", "mei blocks presence"],
    },
  };

  if (dict[w]) return dict[w];

  // minimal conservative heuristic (only if extremely clear)
  // If user types "mei you" (with space) it normalizes to "meiyou" anyway.
  // Otherwise: no guessing.
  return null;
}
