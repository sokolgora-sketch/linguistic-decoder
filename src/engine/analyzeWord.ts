/**
 * ⚙️ ENGINE ANALYZE WORD (analyzeWord)
 *
 * Deterministic interface that calls the Seven-Vowels Core solver.
 * No algorithmic logic changed — only paths fixed after standardization.
 */

import { solveWord, checksumV } from "../functions/sevenVowelsCore";
import type { SolveOptions } from "../functions/sevenVowelsCore";
import { getManifest } from "../shared/engineShape";
import type { EnginePayload } from "../types/engine";

/**
 * Low-level call into the Seven-Vowel solver.
 * Returns a partial engine result; canon candidates are attached later.
 */
export function runSevenVoices(
  word: string,
  opts: { mode: "strict" | "explore" }
): EnginePayload {
  const manifest = getManifest();
  const isStrict = opts.mode === "strict";

  const solveOpts: SolveOptions = {
    alphabet: "auto",
    strict: isStrict,
  };

  const primaryPath = solveWord(word, solveOpts);

  return {
    word,
    primaryPath,
    manifest,
    checksums: {
      V: checksumV(primaryPath.voicePath),
    },
  };
}
