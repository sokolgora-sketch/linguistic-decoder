/**
 * Canon Battery v2 (strict) — Seven-Voices Math v1 lock
 *
 * Intent:
 * - Vowels are the hard math (path/rings) and must remain stable.
 * - Consonants are operators/traits (signals) but must be present as structured fields.
 * - Snapshots are treated as breaking changes unless engine_meta.version is bumped intentionally.
 *
 * Rules:
 * - Strict-only in v2 (for now).
 * - Normalize volatile fields (timestampIso) to keep snapshots stable.
 */

import wordsV2 from "./words.v2.json";
import { analyzeWordV1 } from "../../src/engine/analyzeWordV1";
import type { EngineMode } from "../../src/engine/analyzeWordV1";

function runOne(word: string, mode: EngineMode) {
  return analyzeWordV1(word, mode);
}

function stableNormalize<T>(payload: T): T {
  const clone: any = JSON.parse(JSON.stringify(payload));

  // Volatile per-run metadata
  if (clone?.engine_meta?.timestampIso) delete clone.engine_meta.timestampIso;

  // If later you add other volatile fields, delete them here explicitly.
  return clone as T;
}

describe("canon battery v2 (strict) — Seven-Voices Math v1 lock", () => {
  const mode: EngineMode = "strict";

  test("fixture has at least one word", () => {
    expect(Array.isArray(wordsV2)).toBe(true);
    expect(wordsV2.length).toBeGreaterThan(0);
  });

  for (const item of wordsV2 as Array<{ word: string; notes?: string }>) {
    test(`canon:v2:${mode}:${item.word}`, async () => {
      const out1 = stableNormalize(await runOne(item.word, mode));
      const out2 = stableNormalize(await runOne(item.word, mode));

      // Determinism gate: same input, same process, must match.
      expect(out2).toEqual(out1);

      // Snapshot lock
      expect(out1).toMatchSnapshot();
    });
  }
});
