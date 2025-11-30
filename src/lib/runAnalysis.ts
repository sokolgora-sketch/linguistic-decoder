// src/lib/runAnalysis.ts
import {
  solveWord,
  type SolveOptions as SolveWordOptions,
} from "../functions/sevenVoicesCore";
import type { EnginePayload } from "@/shared/engineShape";

export type Alphabet =
  | "auto"
  | "albanian"
  | "latin"
  | "sanskrit"
  | "ancient_greek"
  | "pie"
  | "turkish"
  | "german";

export const ENGINE_VERSION =
  process.env.NEXT_PUBLIC_ENGINE_VERSION ?? "dev";

export type AnalysisResult = EnginePayload;

/**
 * Central wrapper for the Seven-Voices engine.
 * Trims the word, calls `solveWord`, and normalizes the payload.
 */
export function runAnalysis(
  word: string,
  opts: SolveWordOptions,
  alphabet: Alphabet
): AnalysisResult {
  const trimmed = word.trim();

  if (!trimmed) {
    // Well-formed empty payload
    return {
      engineVersion: ENGINE_VERSION,
      word: "",
      mode: opts.allowDelete ? "open" : "strict",
      alphabet,
      primaryPath: {
        voicePath: [],
        ringPath: [],
        levelPath: [],
        ops: [],
        checksums: { V: 0, E: 0, C: 0 },
        kept: 0,
      },
      frontierPaths: [],
      windows: [],
      windowClasses: [],
      signals: ["empty-input"],
    };
  }

  // NOTE: sevenVoicesCore.solveWord is typed to take (word, opts, alphabet)
  const result = solveWord(trimmed, opts, alphabet);

  const payload: EnginePayload = {
    engineVersion: (result as any).engineVersion ?? ENGINE_VERSION,
    word: trimmed,
    mode: opts.allowDelete ? "open" : "strict",
    alphabet: (result as any).alphabet ?? alphabet,
    primaryPath: result.primaryPath,
    frontierPaths: result.frontierPaths,
    windows: result.windows,
    windowClasses: result.windowClasses,
    signals: result.signals,
  };

  return payload;
}