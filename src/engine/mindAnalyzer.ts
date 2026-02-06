// src/engine/mindAnalyzer.ts
// Build-safe: do not depend on @/shared/analysisResult.v1 type exports (they drift).

import type { Math7Summary } from "@/engine/math7";
import { normalizePrinciplesToLabels } from "@/v1/principles.vocab.v0.1";
import type { EnginePayload } from "@/shared/engineShape";

export type MindSummary = {
  // Canonical ID (contract vocabulary): TRUTH..EVOLUTION (or "UNKNOWN")
  dominantPrincipleId: string;
  // UI label (Title-Case): Truth..Evolution (or "Unknown")
  dominantPrincipleLabel: string;
  // Back-compat alias: keep existing field name stable for any UI reading it
  dominantPrinciple: string;

  polarity: "balanced" | "positive" | "negative" | string;
  patternName: string;
  logicStatement: string;
};

// Minimal, deterministic mind summary (placeholder logic).
// You can tighten this later once shared summary types are stabilized.
export function analyzeMind(math7: Math7Summary, payload: EnginePayload): MindSummary {
  void payload; // keep signature stable, avoid unused warnings

  function idFromTotal1to7(n: unknown): string | null {
    if (typeof n !== "number" || !Number.isFinite(n)) return null;
    // total1to7 is doctrine-indexed: A=1..Ë=7
    switch (Math.trunc(n)) {
      case 1: return "TRUTH";
      case 2: return "EXPANSION";
      case 3: return "INSIGHT";
      case 4: return "BALANCE";
      case 5: return "UNITY";
      case 6: return "REFLECTION";
      case 7: return "EVOLUTION";
      default: return null;
    }
  }
  function pickDominantPrincipleId(m: any): string | null {
    // Single source of truth: Heart math7 primary.
    const total1to7 = m?.primary?.total1to7;
    const fromTotal = idFromTotal1to7(total1to7);
    if (fromTotal) return fromTotal;

    // Fallback: last element of principlesPath if present
    const path = Array.isArray(m?.primary?.principlesPath) ? m.primary.principlesPath : null;
    if (path && path.length) {
      const last = path[path.length - 1];
      return typeof last === "string" && last.trim() ? last.trim() : null;
    }

    return null;
  }

  const polarity = "balanced";

  const dominantPrincipleId = pickDominantPrincipleId(math7) ?? "UNKNOWN";

  const dominantPrincipleLabel = (() => {
    if (dominantPrincipleId === "UNKNOWN") return "Unknown";
    const labels = normalizePrinciplesToLabels([dominantPrincipleId]);
    return labels.length ? labels[0] : "Unknown";
  })();

  const dominantPrinciple = dominantPrincipleLabel;

  // Use ID in patternName for maximum stability (no casing drift)
  const patternName = `${dominantPrincipleId}-${polarity}`;
  const logicStatement = `The word reflects ${dominantPrincipleLabel} principle with ${polarity} flow.`;

  return {
    dominantPrincipleId,
    dominantPrincipleLabel,
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
