// src/engine/analyzeWordV1.ts
import { summarizeWordMath7 } from "../lib/sevenVowelsCore";
import type {
  VoicePath,
  Ring,
  Math7Summary,
} from "../lib/sevenVowelsCore";
import { generateCandidates } from "./wordCandidates";

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
