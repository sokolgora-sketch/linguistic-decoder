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
  const w = (payload.word ?? "").toLowerCase();

  // Seven vowels (treat y as vowel; include ë)
  const vowels = new Set(["a","e","i","o","u","y","ë"]);

  // Very simple deterministic consonant archetype split.
  // spiky: stops/affricates/fricatives that feel "sharp"
  const spiky = new Set(["p","t","k","b","d","g","q","x","z","c","j","v","f","s","š","ç"]);
  // smooth: liquids/nasals/glides/etc.
  const smooth = new Set(["l","m","n","r","w","h"]);

  let smoothHits = 0;
  let spikyHits = 0;
  const slots = [];

  for (const ch of w) {
    // skip non-letters
    if (!(/[a-zë]/).test(ch)) continue;
    if (vowels.has(ch)) continue;

    if (spiky.has(ch)) {
      spikyHits++;
      slots.push({ ch, kind: "spiky" });
    } else if (smooth.has(ch)) {
      smoothHits++;
      slots.push({ ch, kind: "smooth" });
    } else {
      // default bucket: treat unknown consonants as spiky (safer)
      spikyHits++;
      slots.push({ ch, kind: "spiky" });
    }
  }

  const total = smoothHits + spikyHits;
  const smoothRatio = total === 0 ? 0 : smoothHits / total;

  const dominantArchetypes =
    total === 0 ? [] : (smoothHits >= spikyHits ? ["smooth"] : ["spiky"]);

  const notes = [];
  if (total === 0) notes.push("No consonant hits (vowel-only or non-letter input).");

  return {
    field: { smoothHits, spikyHits, slots },
    summary: { smoothRatio, dominantArchetypes, notes },
  };
}

export function analyzeSymbolic(payload: EnginePayload): SymbolicSummary {
  void payload;
  return { notes: ["Placeholder note"] };
}
