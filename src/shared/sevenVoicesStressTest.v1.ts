import {
  type Voice,
  type PatternAtlasClassification,
  classifyVoicePath,
  normalizeVoicePath,
  parseVoicePath,
} from "./patternAtlas.v1";

/**
 * Seven-Voices Stress Test (v1)
 * Deterministic: pure functions only.
 *
 * v1 scope (engine-first, safe):
 * - No "pattern list" matching yet (because patternAtlas.v1 is a classifier, not a catalog).
 * - We classify the word's *surface voice path* into rings + polarity + summary.
 */

export type SevenVoicesStressTestV1 = {
  word: string;
  voicePathRaw: string;      // e.g. "YË" or "Y→Ë" or "Y → Ë"
  voicePath: string;         // normalized "Y → Ë" (or "Y")
  voices: Voice[];           // parsed voices in order
  classification: PatternAtlasClassification | null;
  ui: {
    title: string;
    voicePath: string;
    label: string;
    summary: string;
  };
};

export type StressTestInputV1 = {
  word: string;
  // Accept anything: full text, vowels only, arrow path; we normalize internally.
  voicePathRaw: string;
};

export function runSevenVoicesStressTestV1(input: StressTestInputV1): SevenVoicesStressTestV1 {
  const raw = String(input.voicePathRaw ?? "");
  const voices = parseVoicePath(raw);
  const voicePath = normalizeVoicePath(raw);

  const classification: PatternAtlasClassification | null =
    voices.length === 0 ? null : classifyVoicePath(raw);

  const label = classification?.label ?? "No voice path detected";
  const summary = classification?.summary ?? "No vowels (A,E,I,O,U,Y,Ë) found in this input.";
  const title = "Seven-Voices Pattern Map (v1)";

  return {
    word: String(input.word ?? ""),
    voicePathRaw: raw,
    voicePath,
    voices,
    classification,
    ui: {
      title,
      voicePath: voicePath || "—",
      label,
      summary,
    },
  };
}
