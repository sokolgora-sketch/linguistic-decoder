// src/core/sevenVowelsTraits.ts
// Symbolic traits for each of the Seven Voices.

import { VOWELS, type Vowel, type RingIndex, ringOf } from "./sevenVowelsCore";

export type Polarity = "light" | "dark" | "balanced";

export interface VowelTrait {
  symbol: Vowel;
  ring: RingIndex;
  color: string;        // human label, not hex
  role: string;         // short one-liner: Father, Mediator, etc.
  force: string;        // what it pushes: Action, Expansion, Insight...
  polarity: Polarity;   // light / dark / balanced
}

const TRAITS: Record<Vowel, VowelTrait> = {
  A: {
    symbol: "A",
    ring: ringOf("A"),
    color: "red",
    role: "Father / Source",
    force: "Action / Fire / Truth",
    polarity: "light",
  },
  E: {
    symbol: "E",
    ring: ringOf("E"),
    color: "orange",
    role: "Expansion",
    force: "Flow / Bridge / Exchange",
    polarity: "light",
  },
  I: {
    symbol: "I",
    ring: ringOf("I"),
    color: "yellow",
    role: "Insight",
    force: "Pattern / Focus / Line",
    polarity: "light",
  },
  O: {
    symbol: "O",
    ring: ringOf("O"),
    color: "green",
    role: "Mediator / Heart / Balance",
    force: "Center / Orbit / Hold",
    polarity: "balanced",
  },
  U: {
    symbol: "U",
    ring: ringOf("U"),
    color: "blue",
    role: "Unity / Field",
    force: "Space / Support / Carry",
    polarity: "light",
  },
  Y: {
    symbol: "Y",
    ring: ringOf("Y"),
    color: "indigo",
    role: "Network / Edge",
    force: "Signal / Link / Checksum",
    polarity: "dark",
  },
  "Ë": {
    symbol: "Ë",
    ring: ringOf("Ë"),
    color: "violet",
    role: "Mother / Evolution",
    force: "Closure / Birth / Formed Unit",
    polarity: "dark",
  },
};

export function manifestTrait(v: Vowel): VowelTrait {
  return TRAITS[v];
}

// Simple manifest object we can import elsewhere
export const SEVEN_VOWELS_MANIFEST = {
  vowels: VOWELS,
  traits: TRAITS,
  ringOf,
};
