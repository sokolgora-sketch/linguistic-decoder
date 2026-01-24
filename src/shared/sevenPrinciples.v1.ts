/**
 * Seven Principles Law v1 (Prism Constitution)
 *
 * IMPORTANT:
 * - Must NOT redefine vowel order or 0-based indices.
 * - Imports canon from `core/sevenVowelsCore` and `shared/math7.core`.
 * - Exposes a stable traits table for UI/VM readouts.
 */

import {
  VOWELS,
  type Vowel,
  VOWEL_INDEX as CORE_INDEX,
  VOWEL_RING,
  type RingIndex,
} from "@/core/sevenVowelsCore";
import { SEVEN_VOWELS, VOWEL_INDEX as M7_INDEX } from "@/shared/math7.core";
import { value1to7 } from "@/v1/math7.core.v1";

export const VOWELS_7 = VOWELS; // tuple: ["A","E","I","O","U","Y","Ë"]

export type PrincipleRole =
  | "Initiation/Source"
  | "Expansion/Bridge"
  | "Direction/Focus"
  | "Mediation/Balance"
  | "Containment/Depth"
  | "Reflection/Mirror"
  | "Completion/Unit";

export type PrinciplePolarity =
  | "masculine"
  | "feminine"
  | "masculine-leaning"
  | "feminine-leaning"
  | "neutral";

export type PrincipleRing = "outer" | "middle" | "inner" | "core";

export type PrincipleColor =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "indigo"
  | "violet";

export type MusicalNote = "C" | "D" | "E" | "F" | "G" | "A" | "B";

export type SevenPrinciple = {
  vowel: Vowel;
  index0: number; // 0..6 (canon)
  index1: number; // 1..7 (clock)
  ringIndex: RingIndex; // 0..3 (heart rings)
  ring: PrincipleRing;

  role: PrincipleRole;
  polarity: PrinciplePolarity;

  color: PrincipleColor;
  note: MusicalNote;
};

function ringLabelFromRingIndex(r: RingIndex): PrincipleRing {
  switch (r) {
    case 0:
      return "core";
    case 1:
      return "inner";
    case 2:
      return "middle";
    case 3:
      return "outer";
  }
}

export const SEVEN_PRINCIPLES: Record<Vowel, SevenPrinciple> = {
  A: {
    vowel: "A",
    index0: CORE_INDEX.A,
    index1: value1to7("A"),
    ringIndex: VOWEL_RING.A,
    ring: ringLabelFromRingIndex(VOWEL_RING.A),
    role: "Initiation/Source",
    polarity: "masculine",
    color: "red",
    note: "C",
  },
  E: {
    vowel: "E",
    index0: CORE_INDEX.E,
    index1: value1to7("E"),
    ringIndex: VOWEL_RING.E,
    ring: ringLabelFromRingIndex(VOWEL_RING.E),
    role: "Expansion/Bridge",
    polarity: "feminine-leaning",
    color: "orange",
    note: "D",
  },
  I: {
    vowel: "I",
    index0: CORE_INDEX.I,
    index1: value1to7("I"),
    ringIndex: VOWEL_RING.I,
    ring: ringLabelFromRingIndex(VOWEL_RING.I),
    role: "Direction/Focus",
    polarity: "masculine-leaning",
    color: "yellow",
    note: "E",
  },
  O: {
    vowel: "O",
    index0: CORE_INDEX.O,
    index1: value1to7("O"),
    ringIndex: VOWEL_RING.O,
    ring: ringLabelFromRingIndex(VOWEL_RING.O),
    role: "Mediation/Balance",
    polarity: "neutral",
    color: "green",
    note: "F",
  },
  U: {
    vowel: "U",
    index0: CORE_INDEX.U,
    index1: value1to7("U"),
    ringIndex: VOWEL_RING.U,
    ring: ringLabelFromRingIndex(VOWEL_RING.U),
    role: "Containment/Depth",
    polarity: "feminine",
    color: "blue",
    note: "G",
  },
  Y: {
    vowel: "Y",
    index0: CORE_INDEX.Y,
    index1: value1to7("Y"),
    ringIndex: VOWEL_RING.Y,
    ring: ringLabelFromRingIndex(VOWEL_RING.Y),
    role: "Reflection/Mirror",
    polarity: "feminine-leaning",
    color: "indigo",
    note: "A",
  },
  "Ë": {
    vowel: "Ë",
    index0: CORE_INDEX["Ë"],
    index1: value1to7("Ë"),
    ringIndex: VOWEL_RING["Ë"],
    ring: ringLabelFromRingIndex(VOWEL_RING["Ë"]),
    role: "Completion/Unit",
    polarity: "feminine",
    color: "violet",
    note: "B",
  },
};

export function isVowel7(ch: unknown): ch is Vowel {
  return typeof ch === "string" && (VOWELS_7 as readonly string[]).includes(ch);
}

export function extractVowelPath(word: string): Vowel[] {
  const s = String(word ?? "").toUpperCase();
  const out: Vowel[] = [];
  for (const ch of s) if (isVowel7(ch)) out.push(ch);
  return out;
}

export function vowelToIndex0(v: Vowel): number {
  return SEVEN_PRINCIPLES[v].index0;
}
export function vowelToIndex1(v: Vowel): number {
  return SEVEN_PRINCIPLES[v].index1;
}
export function vowelToRingIndex(v: Vowel): RingIndex {
  return SEVEN_PRINCIPLES[v].ringIndex;
}
export function vowelToColor(v: Vowel): PrincipleColor {
  return SEVEN_PRINCIPLES[v].color;
}
export function vowelToNote(v: Vowel): MusicalNote {
  return SEVEN_PRINCIPLES[v].note;
}

/**
 * Consistency guard: canon sets must match.
 * (Tests also lock this; but we keep it near the law for clarity.)
 */
export function canonSanityCheck(): { ok: boolean; problems: string[] } {
  const problems: string[] = [];

  if (VOWELS.join("|") !== SEVEN_VOWELS.join("|")) {
    problems.push("core.VOWELS order differs from shared.SEVEN_VOWELS");
  }

  for (const v of SEVEN_VOWELS) {
    const vv = v as Vowel;
    if (CORE_INDEX[vv] !== (M7_INDEX as any)[v]) {
      problems.push(
        `index mismatch for ${v}: core=${CORE_INDEX[vv]} shared=${(M7_INDEX as any)[v]}`
      );
    }
  }

  // O must be 4 in 1..7 mapping
  if (vowelToIndex1("O") !== 4) problems.push("O index1 is not 4");

  return { ok: problems.length === 0, problems };
}
