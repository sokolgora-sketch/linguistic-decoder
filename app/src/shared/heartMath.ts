
// src/shared/heartMath.ts
// Seven-Principles Calculator — deterministic base-7 Heart Math

export type Voice = 'A' | 'E' | 'I' | 'O' | 'U' | 'Y' | 'Ë';
export type Operation = 'add' | 'subtract' | 'multiply' | 'divide';

export type VoicePrinciple = 'A' | 'E' | 'I' | 'O' | 'U' | 'Y' | 'Ë';

export const DIGIT_TO_VOICE: Record<string, VoicePrinciple> = {
  "1": "A",
  "2": "E",
  "3": "I",
  "4": "O",
  "5": "U",
  "6": "Y",
  "7": "Ë",
};

export const VOICE_TO_DIGIT: Record<VoicePrinciple, number> = {
  A: 1,
  E: 2,
  I: 3,
  O: 4,
  U: 5,
  Y: 6,
  Ë: 7,
};


/** Fixed Seven-Voices order */
const VOICES: Voice[] = ['A', 'E', 'I', 'O', 'U', 'Y', 'Ë'];

/** Map Voice → 1-7 */
export const voiceToNumber: Record<Voice, number> = {
  A: 1, E: 2, I: 3, O: 4, U: 5, Y: 6, Ë: 7,
};

/** Reverse: number (1-7) → Voice */
export const numberToVoice = (n: number): Voice => {
  const i = ((n - 1) % 7 + 7) % 7;
  return VOICES[i];
};

/** Convert decimal → base-7 digits */
export function decimalToBase7(n: number): number[] {
  if (n === 0) return [0];
  const digits: number[] = [];
  let value = Math.abs(n);
  while (value > 0) {
    digits.unshift(value % 7);
    value = Math.floor(value / 7);
  }
  return digits;
}

/** Convert base-7 digits → decimal */
export function base7ToDecimal(digits: number[]): number {
  return digits.reduce((acc, d) => acc * 7 + d, 0);
}

/** Convert base-7 digits → Voices (1-7) */
export function base7DigitsToVoices(digits: number[]): Voice[] {
  return digits.map((d) => numberToVoice(d === 0 ? 7 : d));
}

/** Reduce any integer → a single Principle (1-7) */
export function reduceToPrinciple(n: number): Voice {
  if (n === 0) return 'Ë';
  const r = n % 7;
  return numberToVoice(r === 0 ? 7 : r);
}

/** Perform one of the four operations and return all representations */
export function calculate(a: number, b: number, op: Operation) {
  let result: number;
  switch (op) {
    case 'add': result = a + b; break;
    case 'subtract': result = a - b; break;
    case 'multiply': result = a * b; break;
    case 'divide': result = b === 0 ? 0 : a / b; break;
    default: result = 0;
  }

  const base7 = decimalToBase7(Math.round(result));
  const voices = base7DigitsToVoices(base7);
  const principle = reduceToPrinciple(Math.round(result));

  return {
    decimal: Math.round(result),
    base7,
    voices,
    principle,
  };
}

const VOICE_CHARS = new Set(["A", "E", "I", "O", "U", "Y", "Ë"]);

/** Utility for symbolic equations like “AO + ËA” or "14+71" */
function parseVoiceExpression(input: string): VoicePrinciple[] {
  const out: VoicePrinciple[] = [];

  for (const raw of input.toUpperCase()) {
    if (VOICE_CHARS.has(raw as VoicePrinciple)) {
      out.push(raw as VoicePrinciple);
    } else if (raw in DIGIT_TO_VOICE) {
      out.push(DIGIT_TO_VOICE[raw as keyof typeof DIGIT_TO_VOICE]);
    } else {
      // ignore spaces, commas, etc.
    }
  }

  return out;
}

/** Evaluate symbolic expression */
export function evaluateVoiceEquation(aExpr: string, bExpr: string, op: Operation) {
  const aVal = parseVoiceExpression(aExpr)
    .reduce((acc, v) => acc + VOICE_TO_DIGIT[v], 0);
  const bVal = parseVoiceExpression(bExpr)
    .reduce((acc, v) => acc + VOICE_TO_DIGIT[v], 0);
  return calculate(aVal, bVal, op);
}

// Cycle state used by both engine math and the calculator
export type CycleState = "open" | "balanced" | "overloaded";

export function computeCycleState(total: number): CycleState {
  const totalMod7 = ((total % 7) + 7) % 7; // normalize 0..6

  if (totalMod7 === 1 || totalMod7 === 2) {
    return "open";
  } else if (totalMod7 === 3 || totalMod7 === 4) {
    return "balanced";
  } else {
    return "overloaded";
  }
}
