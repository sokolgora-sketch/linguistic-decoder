// src/engine/mindAnalyzer.ts
// Build-safe: do not depend on @/shared/analysisResult.v1 type exports (they drift).

import type { Math7Summary } from "@/engine/math7";
import type { EnginePayload } from "@/shared/engineShape";

export type MindSummary = {
  dominantPrinciple: string;
  polarity: "balanced" | "positive" | "negative" | string;
  patternName: string;
  logicStatement: string;
};

// Minimal, deterministic mind summary (placeholder logic).
// You can tighten this later once shared summary types are stabilized.
export function analyzeMind(math7: Math7Summary, payload: EnginePayload): MindSummary {
  void payload; // keep signature stable, avoid unused warnings
  const dominantPrinciple = "Unknown";
  const polarity = "balanced";
  const patternName = `${dominantPrinciple}-${polarity}`;
  const logicStatement = `The word reflects ${dominantPrinciple} principle with ${polarity} flow.`;

  return {
    dominantPrinciple,
    polarity,
    patternName,
    logicStatement,
  };
}


export type ConsonantsSummary = {
  field: { smoothHits: number; spikyHits: number; slots: any[] };
  summary: { smoothRatio: number; dominantArchetypes: string[]; notes: string[] };
};

export type SymbolicSummary = {
  notes: string[];
};

export function analyzeConsonants(payload: EnginePayload): ConsonantsSummary {
  void payload;
  return {
    field: { smoothHits: 0, spikyHits: 0, slots: [] },
    summary: { smoothRatio: 0, dominantArchetypes: [], notes: [] },
  };
}

export function analyzeSymbolic(payload: EnginePayload): SymbolicSummary {
  void payload;
  return { notes: ["Placeholder note"] };
}
