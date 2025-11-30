// src/lib/runAnalysis.ts
import { solveWord, type SolveOptions } from "../functions/sevenVoicesCore";
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
 * Ensures consistent metadata is attached to the raw result.
 */
export function runAnalysis(
  word: string,
  opts: SolveOptions,
  alphabet: Alphabet
): AnalysisResult {
  const trimmed = word.trim();

  // Empty input → safe default payload
  if (!trimmed) {
    return {
      engineVersion: ENGINE_VERSION,
      word: "",
      mode: "strict",
      alphabet: "auto",
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

  // Core solver – NOTE: three arguments (word, opts, alphabet)
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
