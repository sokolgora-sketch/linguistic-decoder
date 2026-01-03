// src/engine/analyzeWordV1.ts
import { summarizeWordMath7 } from "../lib/sevenVowelsCore";
import type { VoicePath, Ring, Math7Summary } from "../lib/sevenVowelsCore";
import { generateCandidates } from "./wordCandidates";
import { detectMediatorAxisPair } from "./patterns/mediatorAxisPair";
import { decisionGeometryForWord, type DecisionGeometryTag } from "../shared/decisionGeometry.v1";
import { buildV1Tags } from "../shared/v1Tags.v1";
import { runSevenVoicesStressTestV1, type SevenVoicesStressTestV1 } from "../shared/sevenVoicesStressTest.v1";
import type { OEdgePolarityTag } from "@/shared/oEdgePolarity.v1";

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

  // Additive, versioned, deterministic.
  stress_test_v1: SevenVoicesStressTestV1 | null;

  engine_meta: EngineMeta;
  decision_geometry?: DecisionGeometryTag | null;
  o_edge_polarity: OEdgePolarityTag | null;
};

const ENGINE_VERSION = "v1.1.0";

function normWord(w: string): string {
  return (w ?? "").trim().toLowerCase().normalize("NFC");
}

function withSignal(signals: string[], sig: string): string[] {
  if (signals.includes(sig)) return signals;
  return [...signals, sig];
}

function voicePathRawFromMath7Path(path: VoicePath | null | undefined): string {
  if (!path || path.length === 0) return "";
  return path.join(" → ");
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
    vowel_path: ((c.math7?.path ?? undefined) ?? (math7_summary?.path ?? [])),
    ring_fit: "MIXED",
    signals: [],
  }));

  // v1 strict rule: tag when word is part of canonical N4 pair (po/jo).
  if (mode === "strict") {
    const w = normWord(input);
    const n4 = detectMediatorAxisPair(w, "po") ?? detectMediatorAxisPair(w, "jo");
    if (n4) {
      for (const cand of candidates) {
        cand.signals = withSignal(cand.signals, "pattern:N4:mediator-axis");
      }
    }
  }

  const decision_geometry = decisionGeometryForWord(input);

  const voicePathRaw = voicePathRawFromMath7Path(math7_summary?.path ?? null);
  const stress_test_v1 =
    voicePathRaw.length === 0 ? null : runSevenVoicesStressTestV1({ word: input, voicePathRaw });

  return {
    word: input,
    mode,
    ...buildV1Tags(input),
    language_guess: null,
    candidates,
    math7_summary,
    stress_test_v1,
    engine_meta: {
      engineVersion: ENGINE_VERSION,
      timestampIso: new Date().toISOString(),
    },
    decision_geometry,
  };
}
