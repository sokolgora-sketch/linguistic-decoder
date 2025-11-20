// src/lib/runAnalysis.ts
import { solveWord } from "../functions/sevenVoicesCore";
import type { SolveOptions as SolveWordOptions } from "../functions/sevenVoicesCore";
import type { EnginePayload } from "@/shared/engineShape";

export type Alphabet = "auto"|"albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie"|"turkish"|"german";
export const ENGINE_VERSION = process.env.NEXT_PUBLIC_ENGINE_VERSION ?? "dev";

export type AnalysisResult = EnginePayload;

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
  if (!trimmed) {
    // Return a default, empty payload
    return {
      engineVersion: ENGINE_VERSION,
      word: "",
      mode: "strict",
      alphabet: "auto",
      primaryPath: { voicePath:[], ringPath:[], levelPath:[], ops:[], checksums:{V:0,E:0,C:0}, kept:0 },
      frontierPaths: [],
      windows: [],
      windowClasses: [],
      signals: ["empty-input"],
    };
  }
  
  const result = solveWord(trimmed, opts, alphabet);

  const payload: EnginePayload = {
    engineVersion: result.engineVersion || ENGINE_VERSION,
    word: trimmed,
    mode: opts.allowDelete ? 'open' : 'strict',
    alphabet: result.alphabet || alphabet, // Use result's detected alphabet if available
    primaryPath: result.primaryPath,
    frontierPaths: result.frontierPaths,
    windows: result.windows,
    windowClasses: result.windowClasses,
    signals: result.signals,
  };

  return payload;
}
