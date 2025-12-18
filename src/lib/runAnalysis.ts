// src/lib/runAnalysis.ts
import { solveWord } from "../functions/sevenVowelsCore";
import type { SolveOptions as SolveWordOptions } from "../functions/sevenVowelsCore";
import type { EnginePayload } from "@/shared/engineShape";
import { recordHistoryRun } from "./historyStore";

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
 * Central wrapper for the Seven-vowel engine.
 * Ensures consistent metadata is attached to the raw result.
 */
export function runAnalysis(
  word: string,
  opts: SolveWordOptions,
  alphabet: Alphabet
): AnalysisResult {
  const trimmed = word.trim();
  if (!trimmed) {
    // Default empty payload – keeps the UI stable
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

  const result = solveWord(trimmed, opts, alphabet);
  const r = result as any; // boundary to the core engine

  const payload: EnginePayload = {
    engineVersion: r.engineVersion || ENGINE_VERSION,
    word: trimmed,
    mode: opts.allowDelete ? "open" : "strict",
    alphabet: r.alphabet || alphabet,
    primaryPath: r.primaryPath,
    frontierPaths: r.frontierPaths,
    windows: r.windows,
    windowClasses: r.windowClasses,
    signals: r.signals,
  };

  // Best-effort history logging – never block the engine.
  try {
    void recordHistoryRun({
      word: payload.word,
      engineVersion: payload.engineVersion,
      mode: payload.mode,
      alphabet: payload.alphabet,
      result: payload,
    }).catch((err) => {
      if (process.env.NODE_ENV === "development") {
        console.warn("[history] record failed:", err);
      }
    });
  } catch (err) {
    // Absolutely never let a logging bug break the engine
    if (process.env.NODE_ENV === "development") {
      console.warn("[history] logging error:", err);
    }
  }

  return payload;
}
