// src/engine/math7.ts
//
// Pure "Heart Math" helper.
// Takes the full AnalyzeWordResult and derives a simple
// Seven-Principles summary from the primary voice path.

import type { AnalyzeWordResult, Math7Summary } from "@/shared/engineShape";

const PRINCIPLE_MAP: Record<string, string> = {
  A: "Truth",
  E: "Expansion",
  I: "Insight",
  O: "Balance",
  U: "Unity",
  Y: "Network Integrity",
  Ë: "Evolution",
};

export function computeMath7ForResult(result: AnalyzeWordResult): Math7Summary {
  const voicePath = result.primaryPath?.voicePath ?? "";
  const vowels = voicePath
    .split("→")
    .map((v) => v.trim())
    .filter(Boolean);

  const principlesPath = vowels.map((v) => PRINCIPLE_MAP[v] ?? v);

  const first = vowels[0];
  const last = vowels[vowels.length - 1];

  const cycleState =
    vowels.length > 1 && first && last && first === last ? "closed" : "open";

  // keep it simple for now: number of steps mod 7
  const totalMod7 = ((vowels.length % 7) + 7) % 7;

  return {
    primary: {
      cycleState,
      totalMod7,
      principlesPath,
    },
  };
}
