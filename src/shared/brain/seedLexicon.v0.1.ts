// BRAIN-0.2 — Seed Lexicon v0.1
// Deterministic fallback CandidateRecords when upstream provides none.
// This prevents missing brainCandidates on non-canon words.

import { CANDIDATE_RECORD_VERSION, type CandidateRecord } from "./candidateRecord.v0.1";

export const SEED_LEXICON_VERSION = "seedLexicon.v0.1" as const;

function cleanWord(w: unknown): string {
  const s = String(w ?? "").trim().toLowerCase();
  const cleaned = s.replace(/[^a-z0-9-]+/g, "");
  return cleaned || "unknown";
}

export function getSeedCandidateRecordsV0_1(word: unknown): readonly CandidateRecord[] {
  const w = cleanWord(word);

  const rec: CandidateRecord = {
    v: CANDIDATE_RECORD_VERSION,
    languageId: "wlt:seed.auto",
    languageName: "Seed",
    form: w,
    gloss: "seed candidate",
    roots: [w.toUpperCase()],
    opsUsed: [],
    functionTag: "UNKNOWN",
    source: {
      kind: "SEED",
      ref: "seedLexicon.v0.1",
      version: SEED_LEXICON_VERSION,
    },
  };

  return [rec];
}
