// src/lib/runAnalysis.ts
import { solveWord } from "../functions/sevenVoicesCore";
import type { SolveOptions as SolveWordOptions } from "../functions/sevenVoicesCore";
import type { EnginePayload } from "@/shared/engineShape";
import { analysisResultToEnginePayload } from "@/shared/analysisAdapter";
import { analyzeWord } from "@/engine/analyzeWord";

export type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie"|"turkish"|"german";
export const ENGINE_VERSION = process.env.NEXT_PUBLIC_ENGINE_VERSION ?? "dev";

// This is what the app & JSON export will see.
export type AnalysisResult = ReturnType<typeof analyzeWord>;

/**
 * Central wrapper for the Seven-Voices engine.
 * Ensures consistent metadata is attached to the raw result.
 * @param word The word to analyze.
 * @param opts The solver options.
 * @param alphabet The alphabet profile to use.
 * @returns A full analysis result with engine metadata.
 */
export function runAnalysis(
  word: string,
  opts: SolveWordOptions,
  alphabet: Alphabet
): AnalysisResult {
  const trimmed = word.trim();
  const mode = opts.allowDelete ? 'explore' : 'strict';
  const result = analyzeWord(trimmed, mode);
  return result;
}
