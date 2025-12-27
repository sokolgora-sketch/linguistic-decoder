/**
 * Canon Battery Policy
 * - Canon tests lock observable engine behavior.
 * - Snapshot diffs are treated as breaking changes unless engine_meta.engineVersion is bumped intentionally.
 * - Never update snapshots to "make tests pass" without a written reason in the PR.
 */

import wordsV1 from "./words.v1.json";
import { analyzeWordV1 } from "../../src/engine/analyzeWordV1";
import type { EngineMode } from "../../src/engine/analyzeWordV1";

function runOne(word: string) {
  // Canon battery v1 is strict-only by design.
  return analyzeWordV1(word, "strict");
}

/**
 * Keep snapshots stable: strip ONLY truly volatile fields.
 * IMPORTANT: do NOT strip meaningful evidence fields.
 */
function stableNormalize<T>(payload: T): T {
  const clone: any = JSON.parse(JSON.stringify(payload));

  // Volatile: generated per call
  if (clone?.engine_meta?.timestampIso) delete clone.engine_meta.timestampIso;

  return clone as T;
}

describe("canon battery v1 (strict) — snapshot lock", () => {
  const mode = (wordsV1 as any).mode as EngineMode;

  test("fixture declares version + mode", () => {
    expect((wordsV1 as any).version).toBe("v1");
    expect(mode).toBe("strict");
    expect(Array.isArray((wordsV1 as any).words)).toBe(true);
    expect((wordsV1 as any).words.length).toBeGreaterThanOrEqual(10);
  });

  for (const item of (wordsV1 as any).words as Array<{ word: string }>) {
    test(`canon:strict:${item.word}`, async () => {
      const out1 = stableNormalize(await runOne(item.word));
      const out2 = stableNormalize(await runOne(item.word));

      // Determinism gate: identical result on repeated calls in the same process.
      expect(out2).toEqual(out1);

      // Snapshot gate: locks full JSON output per word.
      expect(out1).toMatchSnapshot();
    });
  }
});
