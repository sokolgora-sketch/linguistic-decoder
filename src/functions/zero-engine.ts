// src/functions/zero-engine.ts
// Top-level wrapper for the ZË-RO engine (Layers 0 → 1 → 2).
//
// IMPORTANT:
// - This file does NOT change your existing engine behaviour yet.
// - `runHeartForWord` is a stub that we will connect to your real
//   Seven-Voices solver later (using your existing core JSON).
// - `analyzeWordZero` is the canonical entry for the new engine shape.

import {
  Layer0Output,
  HeartResult,
  DeepRootResult,
  SevenVoicesEngineResult,
} from "./zero-heart-types";
import { buildLayer0 } from "./zero-layer0";
import { buildDeepRootFromHeart } from "./zero-layer2-mind";

// Heart mode: matches what we used in the blueprint.
export type HeartMode = "STRICT" | "EXPLORATORY";

/**
 * Placeholder for the real Heart call.
 *
 * Later, we will:
 *  - take Layer0Output (input_word + family_forms)
 *  - feed your existing Seven-Voices core
 *  - convert its output into a proper HeartResult
 *
 * For now this is intentionally unimplemented so it doesn't touch
 * any existing flows.
 */
export async function runHeartForWord(
  _layer0: Layer0Output,
  _mode: HeartMode
): Promise<HeartResult> {
  // TODO: hook this into the existing Seven-Voices engine.
  // This is a stub on purpose – nothing in production should call it yet.
  throw new Error("runHeartForWord is not implemented yet for ZË-RO engine.");
}

/**
 * Canonical ZË-RO engine entry point.
 *
 * When we are ready, this is what Genkit / Firebase flows should call:
 *  - Layer 0: buildLayer0(input)
 *  - Layer 1: runHeartForWord(layer0, mode)  → HeartResult
 *  - Layer 2: buildDeepRootFromHeart(heart)  → DeepRootResult (optional)
 *
 * For now, this function is defined but unused.
 */
export async function analyzeWordZero(
  input: string,
  mode: HeartMode = "STRICT"
): Promise<SevenVoicesEngineResult> {
  // 1) Layer 0 – mechanical prep
  const layer0: Layer0Output = buildLayer0(input);

  // 2) Layer 1 – Seven-Principles Heart (NOT wired yet)
  const heart: HeartResult = await runHeartForWord(layer0, mode);

  // 3) Layer 2 – Mind / DeepRoot
  const deepRoot: DeepRootResult | null = buildDeepRootFromHeart(heart);

  // 4) Combined result
  const result: SevenVoicesEngineResult = {
    layer0,
    heart,
    mind: deepRoot ? { deepRoot } : undefined,
  };

  return result;
}
