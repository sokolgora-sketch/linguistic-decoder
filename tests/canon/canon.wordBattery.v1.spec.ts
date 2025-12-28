/**
 * Canon Battery Policy
 * - Canon tests lock observable engine behavior.
 * - Snapshot diffs are treated as breaking changes unless engine_meta.engineVersion is bumped intentionally.
 * - Never update snapshots to "make tests pass" without a written reason in the PR.
 */

import wordsV1 from "./words.v1.json";
import { stripV1Tags } from "../helpers/stableSnapshot";
import { analyzeWordV1 } from "../../src/engine/analyzeWordV1";

type CanonWordsFixture =
  | string[]
  | { version?: string; words: Array<string | { word: string }> };

function asWordList(fx: CanonWordsFixture): string[] {
  if (Array.isArray(fx)) return fx;
  return fx.words.map((w) => (typeof w === "string" ? w : w.word));
}

/**
 * Canon battery v1 is strict-only for now.
 * We do not accept "open" variability in the snapshot lock phase.
 */
function runOne(word: string) {
  return analyzeWordV1(word, "strict");
}

/**
 * Keep snapshots stable: strip volatile fields only.
 * IMPORTANT: do NOT strip meaning-bearing fields.
 */
function stableNormalize<T>(payload: T): T {
  const clone: any = JSON.parse(JSON.stringify(payload));

  // Volatile: generated per call
  if (clone?.engine_meta?.timestampIso) delete clone.engine_meta.timestampIso;

  // If other volatile fields appear later, add them here with a comment explaining why.
  return clone;
}

describe("canon battery v1 (strict) — snapshot lock", () => {
  const words = asWordList(wordsV1 as unknown as CanonWordsFixture);

  test("fixture has at least one word", () => {
    expect(Array.isArray(words)).toBe(true);
    expect(words.length).toBeGreaterThan(0);
  });

  for (const w of words) {
    test(`canon:strict:${w}`, async () => {
      const out1 = stableNormalize(await runOne(w));
      const out2 = stableNormalize(await runOne(w));

      // Determinism gate: identical result on repeated calls in the same process.
      expect(out2).toEqual(out1);

      // Snapshot gate: locks full JSON output per word.
      expect(stripV1Tags(out1 as any)).toMatchSnapshot();
    });
  }
});
