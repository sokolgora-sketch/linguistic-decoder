// src/core/sevenVowelsTraits.ts
// Symbolic traits for each of the Seven Voices + Zheji structural lens.

import { VOWELS, type Vowel, type RingIndex, ringOf } from "./sevenVowelsCore";

// Old light/dark/balanced polarity – kept for backwards compatibility.
export type LightDarkPolarity = "light" | "dark" | "balanced";
export type Polarity = LightDarkPolarity; // alias so old imports still work

// Zheji polarity: inward / outward / neutral
export type VowelPolarity = "Centripetal" | "Centrifugal" | "Neutral";

export type ZhejiFunctionalRole =
  | "Foundation/Existence"     // A
  | "Extension/Projection"     // E
  | "Inner Focus/Light"        // I
  | "Balance/Mediation"        // O
  | "Depth/Potential"          // U
  | "Boundary/Threshold"       // Y
  | "Completion/Unit";         // Ë

export interface VowelTrait {
  symbol: Vowel;
  ring: RingIndex;
  color: string;                 // human label, not hex
  role: string;                  // short one-liner: Father, Mediator, etc.
  force: string;                 // what it pushes: Action, Expansion, Insight...
  lightDarkPolarity: LightDarkPolarity; // legacy visual polarity
  polarity: VowelPolarity;       // Zheji structural polarity
  zhejiFunctionalRole: ZhejiFunctionalRole;
}

// Core trait table – this is the single source of truth.
const TRAITS: Record<Vowel, VowelTrait> = {
  A: {
    symbol: "A",
    ring: ringOf("A"),
    color: "red",
    role: "Father / Source",
    force: "Action / Fire / Truth",
    lightDarkPolarity: "light",
    polarity: "Neutral",
    zhejiFunctionalRole: "Foundation/Existence",
  },
  E: {
    symbol: "E",
    ring: ringOf("E"),
    color: "orange",
    role: "Expansion",
    force: "Flow / Bridge / Exchange",
    lightDarkPolarity: "light",
    polarity: "Centrifugal",
    zhejiFunctionalRole: "Extension/Projection",
  },
  I: {
    symbol: "I",
    ring: ringOf("I"),
    color: "yellow",
    role: "Insight",
    force: "Pattern / Focus / Line",
    lightDarkPolarity: "light",
    polarity: "Centripetal",
    zhejiFunctionalRole: "Inner Focus/Light",
  },
  O: {
    symbol: "O",
    ring: ringOf("O"),
    color: "green",
    role: "Mediator / Heart / Balance",
    force: "Center / Orbit / Hold",
    lightDarkPolarity: "balanced",
    polarity: "Neutral",
    zhejiFunctionalRole: "Balance/Mediation",
  },
  U: {
    symbol: "U",
    ring: ringOf("U"),
    color: "blue",
    role: "Unity / Field",
    force: "Space / Support / Carry",
    lightDarkPolarity: "light",
    polarity: "Centripetal",
    zhejiFunctionalRole: "Depth/Potential",
  },
  Y: {
    symbol: "Y",
    ring: ringOf("Y"),
    color: "indigo",
    role: "Network / Edge",
    force: "Signal / Link / Checksum",
    lightDarkPolarity: "dark",
    polarity: "Centripetal",
    zhejiFunctionalRole: "Boundary/Threshold",
  },
  "Ë": {
    symbol: "Ë",
    ring: ringOf("Ë"),
    color: "violet",
    role: "Mother / Evolution",
    force: "Closure / Birth / Formed Unit",
    lightDarkPolarity: "dark",
    polarity: "Neutral",
    zhejiFunctionalRole: "Completion/Unit",
  },
};

export function manifestTrait(v: Vowel): VowelTrait {
  return TRAITS[v];
}

// Tension matrix – Algorithmic symbolism strength between vowels (0–3).
export type TensionMatrix = Record<Vowel, Record<Vowel, number>>;

export const vowelTensionMatrix: TensionMatrix = {
  A: { A: 0, E: 1, I: 2, O: 1, U: 2, Y: 2, Ë: 1 },
  E: { A: 1, E: 0, I: 1, O: 1, U: 2, Y: 2, Ë: 2 },
  I: { A: 2, E: 1, I: 0, O: 2, U: 3, Y: 1, Ë: 2 },
  O: { A: 1, E: 1, I: 2, O: 0, U: 1, Y: 2, Ë: 1 },
  U: { A: 2, E: 2, I: 3, O: 1, U: 0, Y: 2, Ë: 2 },
  Y: { A: 2, E: 2, I: 1, O: 2, U: 2, Y: 0, Ë: 1 },
  Ë: { A: 1, E: 2, I: 2, O: 1, U: 2, Y: 1, Ë: 0 },
};

export function getTensionScore(v1: Vowel, v2: Vowel): number {
  const row = vowelTensionMatrix[v1];
  if (!row) return 0;

  const score = row[v2];
  return typeof score === "number" ? score : 0;
}

// Simple manifest object we can import elsewhere
export const SEVEN_VOWELS_MANIFEST = {
  vowels: VOWELS,
  traits: TRAITS,
  ringOf,
  vowelTensionMatrix,
};

// If you want direct access to the traits map:
export const VOWEL_TRAITS = TRAITS;
