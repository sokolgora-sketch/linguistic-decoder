// src/engine/analyzeWordV1.ts
import { summarizeWordMath7 } from "../lib/sevenVowelsCore";
import { generateCandidates } from "./wordCandidates";

export type AnalysisMode = "strict" | "open";

export interface FunctionalStatement {
  action: string;
  instrument: string;
  unit: string;
}

export interface CandidateAnalysis {
  language: string | null;
  form: string;
  decomposition: string[];
  functionalStatement: FunctionalStatement;
  vowelPath: string[];          // Seven-Voices path for this candidate
  math7: unknown | null;        // raw Math7 summary (keep loose for now)
  notes: string[];              // engine comments / signals
}

export interface AnalysisResult {
  word: string;
  mode: AnalysisMode;
  languageGuess: string | null;
  candidates: CandidateAnalysis[];
  math7Summary: unknown | null; // overall Math7 summary for the input word
  engineMeta: {
    engineVersion: string;
    timestamp: string;
  };
}

// Keep engine version in one place
const ENGINE_VERSION = "v1.0.0";

/**
 * Pure engine entry point for v1.
 * No network calls, no Firestore – just math + structural candidates.
 */
export async function analyzeWordV1(
  word: string,
  mode: AnalysisMode = "strict"
): Promise<AnalysisResult> {
  const trimmed = word.trim();

  // Empty input → empty analysis
  if (!trimmed) {
    return {
      word: "",
      mode,
      languageGuess: null,
      candidates: [],
      math7Summary: null,
      engineMeta: {
        engineVersion: ENGINE_VERSION,
        timestamp: new Date().toISOString(),
      },
    };
  }

  // 1) Core Math7 summary for the whole word
  const math7 = summarizeWordMath7(trimmed);

  // 2) Structural candidates from the Search-Operation engine
  const rawCandidates = generateCandidates(trimmed) as any[];

  const candidates: CandidateAnalysis[] = rawCandidates.map((c: any) => {
    const cMath = c.math7 ?? math7;

    return {
      language: null, // we’ll fill this once language families plug in
      form: c.form ?? trimmed,
      decomposition: Array.isArray(c.pieces) && c.pieces.length > 0
        ? c.pieces
        : [c.form ?? trimmed],
      functionalStatement: {
        action: "",
        instrument: "",
        unit: "",
      },
      vowelPath: (cMath && Array.isArray((cMath as any).path))
        ? (cMath as any).path
        : [],
      math7: cMath ?? null,
      notes: Array.isArray(c.opsUsed)
        ? [`ops: ${c.opsUsed.join(", ")}`]
        : [],
    };
  });

  return {
    word: trimmed,
    mode,
    languageGuess: null,
    candidates,
    math7Summary: math7,
    engineMeta: {
      engineVersion: ENGINE_VERSION,
      timestamp: new Date().toISOString(),
    },
  };
}
