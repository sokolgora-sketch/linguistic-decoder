// src/core/sevenVowelsCore.ts
// Base-7 vowel math: symbols, indexes, rings, and simple helpers.

export const VOWELS = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
export type Vowel = (typeof VOWELS)[number];

// 0–6 index in the fixed A,E,I,O,U,Y,Ë order
export type VowelIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const VOWEL_INDEX: Record<Vowel, VowelIndex> = {
  A: 0,
  E: 1,
  I: 2,
  O: 3,
  U: 4,
  Y: 5,
  "Ë": 6,
};

// Ring model (Heart): 
// 0 = O (mediator / heart)
// 1 = I,U (inner / male)
// 2 = E,Y (middle / female)
// 3 = A,Ë (outer / father/mother)
export type RingIndex = 0 | 1 | 2 | 3;

export const VOWEL_RING: Record<Vowel, RingIndex> = {
  O: 0,
  I: 1,
  U: 1,
  E: 2,
  Y: 2,
  A: 3,
  "Ë": 3,
};

export function indexOf(v: Vowel): VowelIndex {
  return VOWEL_INDEX[v];
}

export function ringOf(v: Vowel): RingIndex {
  return VOWEL_RING[v];
}

// Simple distance helpers – used later by the analyzer
export function ringDistance(a: Vowel, b: Vowel): number {
  return Math.abs(ringOf(a) - ringOf(b));
}

export function indexDistance(a: Vowel, b: Vowel): number {
  return Math.abs(indexOf(a) - indexOf(b));
}
