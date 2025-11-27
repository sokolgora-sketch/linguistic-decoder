// src/engine/math7.ts
//
// Seven-Voices “Core Math” over an AnalyzeWordResult.
// This is a pure reader: it does NOT change the core solver,
// it just reads the paths and runs them through the shared
// Seven-Principles calculator engine.

import type { AnalyzeWordResult, Math7PathSummary, Vowel } from "@/shared/engineShape";
import { VOICE_TO_DIGIT, calculate } from "@/shared/heartMath";

export type Math7CycleState = "open" | "balanced" | "overloaded";

export interface Math7HeartResult {
  expression: string;   // e.g. "A → E"
  decimal: number;      // e.g. 3
  base7: number[];      // e.g. [3]
  voices: Vowel[];      // e.g. ["I"]
  principle: Vowel;     // e.g. "I"
}

export interface Math7Summary {
  primary: Math7PathSummary;
  frontier: Math7PathSummary[];
  candidates: Record<string, Math7PathSummary>;
  // Core 7-Principles read, driven by the same engine as the calculator
  heart?: Math7HeartResult;
}

// Vowel → index 0–6 for the path-state math (state, mod7 etc.)
const VOICE_INDEX: Record<string, number> = {
  A: 0,
  E: 1,
  I: 2,
  O: 3,
  U: 4,
  Y: 5,
  Ë: 6,
};

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

/**
 * Old path-based scoring (state, total, principles path).
 * We keep this so existing UI + tests stay happy.
 */
function scoreVoices(voices: Vowel[]): Math7PathSummary {
  const total = voices.reduce(
    (sum, v) => sum + (VOICE_INDEX[v] ?? 0),
    0
  );
  const totalMod7Raw = ((total % 7) + 7) % 7;
  const totalMod7 = totalMod7Raw === 0 ? 7 : totalMod7Raw;

  let cycleState: Math7CycleState;
  if (totalMod7 === 1 || totalMod7 === 2) {
    cycleState = "open";
  } else if (totalMod7 === 3 || totalMod7 === 4) {
    cycleState = "balanced";
  } else {
    cycleState = "overloaded";
  }

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

/**
 * NEW: Core 7-Principles result using the *same* engine as the
 * Seven-Principles Calculator.
 *
 * Rule (for now, nice and strict):
 *   - Take the primary voice path for the word.
 *   - Use FIRST and LAST vowels only.
 *   - Map them to 1–7 via VOICE_TO_DIGIT.
 *   - Run `calculate(a, b, "add")` from heartMath.
 */
function computeHeartForVoices(voices: Vowel[]): Math7HeartResult | undefined {
  if (!voices.length) return undefined;

  const first = voices[0];
  const last = voices[voices.length - 1];

  const a = VOICE_TO_DIGIT[first];
  const b = VOICE_TO_DIGIT[last];

  if (!a || !b) return undefined;

  const calc = calculate(a, b, "add");

  return {
    expression: `${first} → ${last}`,
    decimal: calc.decimal,
    base7: calc.base7,
    voices: calc.voices as Vowel[],
    principle: calc.principle as Vowel,
  };
}

// 🔥 Named export – this MUST exist and there must be NO default export.
export function computeMath7ForResult(result: AnalyzeWordResult): Math7Summary {
  const voicePath = result?.primaryPath?.voicePath ?? "A"; // default safe fallback
  const primaryVoices = parseVoicePath(voicePath);
  const primary = scoreVoices(primaryVoices);

  const frontier = (result.frontier || []).map((alt) =>
    scoreVoices(parseVoicePath(alt.voicePath))
  );

  const candidates: Record<string, Math7PathSummary> = {};
  (result.languageFamilies || []).forEach((c: any) => {
    const voices = parseVoicePath(c.voicePath);
    candidates[c.language] = scoreVoices(voices);
  });

  const heart = computeHeartForVoices(primaryVoices);

  return {
    primary,
    frontier,
    candidates,
    heart,
  };
}
