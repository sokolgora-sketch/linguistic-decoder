// src/core/sevenVowelsCore.ts
// Base-7 vowel math: symbols, indexes, rings, and simple helpers.

import { symbolicMathOrder, type SevenVoiceKey } from "../shared/sevenVoiceOrderedViews.v0.1";

import { sevenVoiceRegistry } from "../shared/sevenVoiceOrderedViews.v0.1";

export const VOWELS = symbolicMathOrder;
export type Vowel = SevenVoiceKey;

// 0–6 index in the fixed A,E,I,O,U,Y,Ë order
export type VowelIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export const VOWEL_INDEX: Record<Vowel, VowelIndex> = Object.fromEntries(
  VOWELS.map((voice) => [voice, sevenVoiceRegistry[voice].symbolicMathIndex - 1]),
) as Record<Vowel, VowelIndex>;

// Ring model (Heart): 
// 0 = O (mediator / heart)
// 1 = I,U (inner / male)
// 2 = E,Y (middle / female)
// 3 = A,Ë (outer / father/mother)
export type RingIndex = 0 | 1 | 2 | 3;

export const VOWEL_RING: Record<Vowel, RingIndex> = {
  O: sevenVoiceRegistry["O"].symbolicRing,
  I: sevenVoiceRegistry["I"].symbolicRing,
  U: sevenVoiceRegistry["U"].symbolicRing,
  E: sevenVoiceRegistry["E"].symbolicRing,
  Y: sevenVoiceRegistry["Y"].symbolicRing,
  A: sevenVoiceRegistry["A"].symbolicRing,
  "Ë": sevenVoiceRegistry["Ë"].symbolicRing,
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
