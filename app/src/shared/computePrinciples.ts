import type { EnginePayload, PrinciplesSet, PrincipleScore, Vowel } from "./engineShape";
import { VOICE_LABEL_MAP } from "./voiceColors";

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
  const counts: Record<Vowel, number> = { A:0, E:0, I:0, O:0, U:0, Y:0, Ë:0 };
  voices.forEach(v => { if (counts[v as Vowel] !== undefined) counts[v as Vowel]++; });

  const total = voices.length;
  const principles: PrincipleScore[] = (Object.keys(counts) as Vowel[]).map(v => {
    const value = total > 0 ? counts[v] / total : 0;
    const active = value > 0.15; // arbitrary threshold
    const summary = `${v} reflects ${VOICE_LABEL_MAP[v]} (${Math.round(value*100)}%)`;
    return { id: v, name: PRINCIPLE_BASE[v], value, summary, active };
  });

  return { source: "heart-calculator", principles };
}
