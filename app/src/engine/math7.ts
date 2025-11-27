
// src/engine/math7.ts
//
// Seven-Voices “Heart Math” over an AnalyzeWordResult.
// Pure reader: it does NOT change the core solver, it just reads paths.

import type { AnalyzeWordResult, Math7PathSummary, Vowel } from "@/shared/engineShape";
import {
  voiceToNumber,
  decimalToBase7,
  base7DigitsToVoices,
  reduceToPrinciple,
  computeCycleState,
} from "@/shared/heartMath";


export type Math7CycleState = "open" | "balanced" | "overloaded";

export interface HeartAutoCalc {
  expression: string;     // path as voices, e.g. "A → E"
  decimal: number;        // sum in decimal
  base7: number[];        // base-7 digits
  voices: Vowel[];        // base-7 digits mapped back to voices
  principle: Vowel;       // final reduced principle
}

export interface Math7Summary {
  primary: Math7PathSummary;
  frontier: Math7PathSummary[];
  candidates: Record<string, Math7PathSummary>;
  heart?: HeartAutoCalc;  // auto calculator result for the primary path
}

// Vowel → principle label
const PRINCIPLE_BY_VOICE: Record<string, string> = {
  A: "Truth",
  E: "Expansion",
  I: "Insight",
  O: "Balance",
  U: "Unity",
  Y: "Network Integrity",
  Ë: "Evolution",
};

function parseVoicePath(path: string | undefined): Vowel[] {
  if (!path) return [];
  return path
    .split("→")
    .map((s) => s.trim())
    .filter(Boolean) as Vowel[];
}

function scoreVoices(voices: Vowel[]): Math7PathSummary {
  // use the same 1–7 mapping as the calculator
  const total = voices.reduce(
    (sum, v) => sum + (voiceToNumber[v as keyof typeof voiceToNumber] ?? 0),
    0
  );
  const totalMod7 = total % 7 === 0 ? 7 : total % 7;

  const cycleState = computeCycleState(total);

  const principlesPath = voices.map(
    (v) => PRINCIPLE_BY_VOICE[v] ?? v
  );

  return {
    voices,
    total,
    totalMod7,
    principlesPath,
    cycleState,
  };
}

function computeHeartFromPrimary(voices: Vowel[]): HeartAutoCalc | undefined {
  if (!voices.length) return undefined;

  // Sum of the path in 1–7 space
  const decimal = voices
    .map(v => voiceToNumber[v as keyof typeof voiceToNumber] ?? 0)
    .reduce((sum, n) => sum + n, 0);

  const base7 = decimalToBase7(decimal);
  const baseVoices = base7DigitsToVoices(base7) as Vowel[];
  const principle = reduceToPrinciple(decimal) as Vowel;

  return {
    expression: voices.join(" → "), // how it will show in "Heart Auto-Calculation"
    decimal,
    base7,
    voices: baseVoices,
    principle,
  };
}

// 🔥 Named export – this MUST exist and there must be NO default export.
export function computeMath7ForResult(result: AnalyzeWordResult): Math7Summary {
  const primaryVoices = parseVoicePath(result.primaryPath.voicePath);
  const primary = scoreVoices(primaryVoices);

  const frontier = (result.frontier || []).map((alt) =>
    scoreVoices(parseVoicePath(alt.voicePath))
  );

  const candidates: Record<string, Math7PathSummary> = {};
  (result.languageFamilies || []).forEach((c: any) => {
    const voices = parseVoicePath(c.voicePath);
    candidates[c.language] = scoreVoices(voices);
  });

  const heart = computeHeartFromPrimary(primaryVoices);

  return {
    primary,
    frontier,
    candidates,
    heart
  };
}
