// src/engine/analyzeWordV1.ts
import { summarizeWordMath7 } from "../lib/sevenVowelsCore";
import type { VoicePath, Ring, Math7Summary } from "../lib/sevenVowelsCore";
import { generateCandidates } from "./wordCandidates";
import { detectMediatorAxisPair } from "./patterns/mediatorAxisPair";

export type EngineMode = "strict" | "open";

export type FunctionalStatement = {
  action: string;
  instrument: string;
  unit: string;
};

export type CandidateAnalysis = {
  language: string; // e.g. "unknown" for now
  form: string;
  decomposition: string[]; // smallest pieces
  functional_statement: FunctionalStatement;
  vowel_path: VoicePath;
  ring_fit: Ring | "MIXED";
  signals: string[];
};

export type EngineMeta = {
  engineVersion: string;
  timestampIso: string;
  configHash?: string;
  heartNotes?: string[];
};

export type AnalysisResult = {
  word: string;
  mode: EngineMode;
  language_guess: string | null;
  candidates: CandidateAnalysis[];
  math7_summary: Math7Summary | null;
  engine_meta: EngineMeta;
};

const ENGINE_VERSION = "v1.0.0";

function normWord(w: string): string {
  return (w ?? "").trim().toLowerCase().normalize("NFC");
}

function withSignal(signals: string[], sig: string): string[] {
  if (signals.includes(sig)) return signals;
  return [...signals, sig];
}

export async function analyzeWordV1(
  word: string,
  mode: EngineMode = "strict",
): Promise<AnalysisResult> {
  const input = word.trim();

  const math7_summary = summarizeWordMath7(input);
  const rawCandidates = generateCandidates(input);

  const candidates: CandidateAnalysis[] = rawCandidates.map((c) => ({
    language: "unknown",
    form: c.form,
    decomposition: c.pieces,
    functional_statement: {
      action: "",
      instrument: "",
      unit: "",
    },
    vowel_path: c.math7?.path ?? (math7_summary ? math7_summary.path : []),
    ring_fit: "MIXED",
    signals: [],
  }));

  // Phase C2: Decision Geometry tag (non-breaking).
  // v1 strict rule: only tag when the word is part of the canonical N4 pair (po/jo).
  if (mode === "strict") {
    const w = normWord(input);
    // For v1, we detect membership by checking against the known pair.
    // The detector is order-insensitive, but we call it deterministically.
    const n4 =
      detectMediatorAxisPair(w, "po") ?? detectMediatorAxisPair(w, "jo");

    if (n4) {
      for (const cand of candidates) {
        cand.signals = withSignal(cand.signals, "pattern:N4:mediator-axis");
      }
    }
  }

  return {
    word: input,
    mode,
    language_guess: null,
    candidates,
    math7_summary,
    engine_meta: {
      engineVersion: ENGINE_VERSION,
      timestampIso: new Date().toISOString(),
    },
  };
}
