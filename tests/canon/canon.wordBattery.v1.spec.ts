/**
 * Canon Battery Policy
 * - Canon tests lock observable engine behavior.
 * - Snapshot diffs are treated as breaking changes unless engine_meta.engineVersion is bumped intentionally.
 * - Never update snapshots to "make tests pass" without a written reason in the PR.
 */

import wordsV1 from "./words.v1.json";
import { analyzeWordV1 } from "../../src/engine/analyzeWordV1";

function runOne(word: string, mode: "strict" | "loose") {
  return analyzeWordV1(word, mode);
}

/**
 * Keep snapshots stable: strip ONLY truly volatile fields.
 * IMPORTANT: do NOT strip meaningful evidence fields (basis/vowels/indices/sum).
 */
function stableNormalize<T>(payload: T): T {
  const clone: any = JSON.parse(JSON.stringify(payload));

  // Volatile: generated per call
  if (clone?.engine_meta?.timestampIso) delete clone.engine_meta.timestampIso;

  // If you later add other volatile meta, strip it here (test-only):
  // if (clone?.engine_meta?.requestId) delete clone.engine_meta.requestId;

  return clone as T;
}

describe("canon battery v1 (strict) — snapshot lock", () => {
  const mode = (wordsV1 as any).mode as "strict" | "loose";

  test("fixture declares version + mode", () => {
    expect((wordsV1 as any).version).toBe("v1");
    expect(mode).toBe("strict");
    expect(Array.isArray((wordsV1 as any).words)).toBe(true);
    expect((wordsV1 as any).words.length).toBeGreaterThanOrEqual(10);
  });

  for (const item of (wordsV1 as any).words as Array<{ word: string }>) {
    test(`canon:${mode}:${item.word}`, async () => {
      const out1 = stableNormalize(await runOne(item.word, mode));
      const out2 = stableNormalize(await runOne(item.word, mode));

      // Determinism gate: identical result on repeated calls in the same process.
      expect(out2).toEqual(out1);

      // Snapshot gate: locks full JSON output per word.
      expect(out1).toMatchSnapshot();
    });
  }
});
