// src/shared/computePrinciples.ts
import type {
  EnginePayload,
  PrinciplesSet,
  PrincipleScore,
  Vowel,
} from "./engineShape";
import { VOICE_LABEL_MAP } from "@/shared/voiceColors";

const PRINCIPLE_BASE: Record<Vowel, string> = {
  A: "Truth / Source / Action",
  E: "Expansion / Flow",
  I: "Insight / Pattern",
  O: "Balance / Heart / Mediator",
  U: "Unity / Field",
  Y: "Network Integrity",
  Ë: "Evolution / Completion",
};

export function computePrinciples(payload: EnginePayload): PrinciplesSet {
  if (!payload?.primaryPath?.voicePath?.length) {
    return { source: "heart-calculator", principles: [] };
  }

  const voices = payload.primaryPath.voicePath;

  // Count how many times each voice appears in the primary path
  const counts: Record<Vowel, number> = {
    A: 0,
    E: 0,
    I: 0,
    O: 0,
    U: 0,
    Y: 0,
    Ë: 0,
  };

  for (const v of voices) {
    if (counts[v as Vowel] !== undefined) {
      counts[v as Vowel]++;
    }
  }

  const total = voices.length || 1;

  const principles: PrincipleScore[] = (Object.keys(counts) as Vowel[]).map(
    (v) => {
      const raw = counts[v] / total;
      const value = Number.isFinite(raw) ? raw : 0;
      const pct = Math.round(value * 100);
      const active = value > 0.15; // simple “lit up” threshold

      return {
        id: v,
        name: PRINCIPLE_BASE[v],
        value,
        summary: `${v} reflects ${VOICE_LABEL_MAP[v]} (${pct}%)`,
        active,
      };
    }
  );

  return {
    source: "heart-calculator",
    principles,
  };
}
