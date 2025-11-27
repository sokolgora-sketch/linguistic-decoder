// src/core/sevenVowelsCore.ts
// Pure 7-vowel math (no symbolism, no languages)

// The only legal vowels in the system
export type VowelId = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

export interface VowelNumber {
  vowels: VowelId[]; // sequence like ["A", "O", "U"]
}

// Fixed order 1..7 (outer ring A/Ë, O in the middle)
const VOWEL_ORDER: VowelId[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

// Map each vowel to its 1-7 index
const VOWEL_TO_INDEX: Record<VowelId, number> = {
  A: 1,
  E: 2,
  I: 3,
  O: 4,
  U: 5,
  Y: 6,
  "Ë": 7,
};

// -------- basic mappings --------

export function vowelToIndex(v: VowelId): number {
  return VOWEL_TO_INDEX[v]; // 1..7
}

export function indexToVowel(i: number): VowelId {
  if (i < 1 || i > 7) {
    throw new Error(`indexToVowel: out of range: ${i}`);
  }
  return VOWEL_ORDER[i - 1];
}

// Engine digit 0..6  <-> vowel index 1..7
export function vowelToEngineDigit(v: VowelId): number {
  return vowelToIndex(v) - 1; // 0..6
}

export function engineDigitToVowel(d: number): VowelId {
  if (d < 0 || d > 6) {
    throw new Error(`engineDigitToVowel: out of range: ${d}`);
  }
  return indexToVowel(d + 1);
}

// -------- base-7 conversions --------

// VowelNumber -> decimal (treat vowels as base-7 digits 0..6)
export function vowelNumberToDecimal(vn: VowelNumber): number {
  if (vn.vowels.length === 0) return 0;

  let value = 0;
  for (const v of vn.vowels) {
    const digit = vowelToEngineDigit(v); // 0..6
    value = value * 7 + digit;
  }
  return value;
}

// decimal -> base-7 digits (0..6)
export function decimalToBase7Digits(n: number): number[] {
  const int = Math.trunc(n);
  if (int < 0) {
    throw new Error("decimalToBase7Digits expects a non-negative integer");
  }
  if (int === 0) return [0];

  const digits: number[] = [];
  let x = int;
  while (x > 0) {
    digits.push(x % 7);
    x = Math.floor(x / 7);
  }
  return digits.reverse();
}

// base-7 digits (0..6) -> vowels
export function base7DigitsToVowels(digits: number[]): VowelId[] {
  return digits.map(engineDigitToVowel);
}

// decimal -> VowelNumber
export function decimalToVowelNumber(n: number): VowelNumber {
  const digits = decimalToBase7Digits(n);
  const vowels = base7DigitsToVowels(digits);
  return { vowels };
}

// -------- principle reduction --------

// Collapse any integer to a single principle vowel:
// n mod 7, with 0 mapped to Ë.
export function reduceToPrinciple(n: number): VowelId {
  const abs = Math.abs(Math.trunc(n));
  const r = abs % 7; // 0..6
  const index = r === 0 ? 7 : r; // 0 => 7 (Ë)
  return indexToVowel(index);
}

// Combine two vowels in "principle space":
// Just sum their indices and reduce mod 7.
export function combineVowels(a: VowelId, b: VowelId): VowelId {
  const sum = vowelToIndex(a) + vowelToIndex(b);
  return reduceToPrinciple(sum);
}
