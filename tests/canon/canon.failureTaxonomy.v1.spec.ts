import wordsV1 from "./words.v1.json";
import { analyzeWordV1 } from "../../src/engine/analyzeWordV1";
import type { EngineMode } from "../../src/engine/analyzeWordV1";
import { classifyAnalysisResult } from "./canon.failureTags.v1";

function runOne(word: string) {
  return analyzeWordV1(word, "strict");
}

function stableNormalize<T>(payload: T): T {
  const clone: any = JSON.parse(JSON.stringify(payload));
  if (clone?.engine_meta?.timestampIso) delete clone.engine_meta.timestampIso;
  return clone as T;
}

describe("canon failure taxonomy v1 (strict) — classify + snapshot report", () => {
  const mode = (wordsV1 as any).mode as EngineMode;
  const ambiguousThreshold = 6;

  test("fixture declares version + mode", () => {
    expect((wordsV1 as any).version).toBe("v1");
    expect(mode).toBe("strict");
    expect(Array.isArray((wordsV1 as any).words)).toBe(true);
    expect((wordsV1 as any).words.length).toBeGreaterThanOrEqual(10);
  });

  test("taxonomy report (snapshot)", async () => {
    const items = (wordsV1 as any).words as Array<{ word: string }>;

    const rows: Array<{
      word: string;
      tags: string[];
      counts: { candidates: number; warnings: number; errors: number };
    }> = [];

    for (const item of items) {
      const out1 = stableNormalize(await runOne(item.word));
      const out2 = stableNormalize(await runOne(item.word));

      // Determinism check (same as battery)
      expect(out2).toEqual(out1);

      const cls = classifyAnalysisResult(out1, { ambiguousThreshold });

      rows.push({
        word: item.word,
        tags: cls.tags,
        counts: cls.counts,
      });
    }

    // Stable ordering to avoid drift.
    rows.sort((a, b) => a.word.localeCompare(b.word));

    const report = {
      version: "v1",
      mode: "strict",
      ambiguousThreshold,
      totals: {
        words: rows.length,
        byTag: countTags(rows),
      },
      rows,
    };

    expect(report).toMatchSnapshot();
  });
});

function countTags(rows: Array<{ tags: string[] }>): Record<string, number> {
  const tally: Record<string, number> = {};
  for (const r of rows) {
    for (const t of r.tags) tally[t] = (tally[t] ?? 0) + 1;
  }
  return tally;
}
