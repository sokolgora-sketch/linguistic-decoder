// src/engine/math7.ts
//
// Seven-Voices “Heart Math” over an AnalyzeWordResult.
// Pure reader: it does NOT change the core solver, it just reads paths.

import type { AnalyzeWordResult, Math7PathSummary, Vowel } from "@/shared/engineShape";
import { calculate, voiceToNumber, reduceToPrinciple } from "@/shared/heartMath";


export type Math7CycleState = "open" | "balanced" | "overloaded";

export interface Math7Summary {
  primary: Math7PathSummary;
  frontier: Math7PathSummary[];
  candidates: Record<string, Math7PathSummary>;
  heart?: {
    expression: string;
    decimal: number;
    base7: number[];
    voices: Vowel[];
    principle: Vowel;
  };
}

// Vowel → index 0–6
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

function scoreVoices(voices: Vowel[]): Math7PathSummary {
  const total = voices.reduce(
    (sum, v) => sum + (VOICE_INDEX[v] ?? 0),
    0
  );
  const totalMod7 = ((total % 7) + 7) % 7;

  let cycleState: Math7CycleState;
  if (totalMod7 === 0 || totalMod7 === 3) {
    cycleState = "balanced";
  } else if (totalMod7 === 1 || totalMod7 === 2) {
    cycleState = "open";
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
    if (voices.length > 0) {
      candidates[c.language] = scoreVoices(voices);
    }
  });

  const summary: Math7Summary = {
    primary,
    frontier,
    candidates,
  };

  // 🔗 Connect Seven-Principles Calculator
  if (result?.primaryPath?.voicePath) {
    const voices = result.primaryPath.voicePath.replace(/\s|→/g, "").split("") as Vowel[];
    if (voices.length >= 2) {
      const a = voiceToNumber[voices[0] as any] ?? 1;
      const b = voiceToNumber[voices[voices.length - 1] as any] ?? 1;
      const heartResult = calculate(a, b, "add"); // you can change "add" later to dynamic logic
      summary.heart = {
        expression: `${voices[0]} + ${voices[voices.length - 1]}`,
        decimal: heartResult.decimal,
        base7: heartResult.base7,
        voices: heartResult.voices,
        principle: heartResult.principle,
      };
    }
  }
  
  return summary;
}
