// src/engine/math7.ts
//
// Seven-Voices “Heart Math” over an AnalyzeWordResult.
// Pure reader: it does NOT change the core solver, it just reads paths.

import type { AnalyzeWordResult } from "@/shared/engineShape";

export type Math7CycleState = "open" | "balanced" | "overloaded";

export interface Math7PathSummary {
  voices: string[];            // e.g. ["U", "I"]
  total: number;               // raw sum of indices
  totalMod7: number;           // total % 7, 0–6
  principlesPath: string[];    // mapped principle names
  cycleState: Math7CycleState; // open | balanced | overloaded
}

export interface Math7Summary {
  primary: Math7PathSummary;
  frontier: Math7PathSummary[];
  candidates: Record<string, Math7PathSummary>;
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

function parseVoicePath(path: string | undefined): string[] {
  if (!path) return [];
  return path
    .split("→")
    .map((s) => s.trim())
    .filter(Boolean);
}

function scoreVoices(voices: string[]): Math7PathSummary {
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
    candidates[c.language] = scoreVoices(voices);
  });

  return {
    primary,
    frontier,
    candidates,
  };
}
