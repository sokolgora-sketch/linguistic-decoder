// tests/stressHarness.v1.spec.ts

import { runStressHarnessV1, CANON_WORDS_V1 } from "../src/engine/stressHarness.v1";
import { runSevenVoicesStressTest } from "../src/functions/sevenVoicesStressTest";

describe("runStressHarnessV1()", () => {
  it("runs canonical words without crashing and returns stable structure", () => {
    const result = runStressHarnessV1(CANON_WORDS_V1, runSevenVoicesStressTest);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);

    expect(
      result.map((r) => ({
        word: r.word,
        ok: r.ok,
        error: !!r.error,
        hasStress: !!r.stress,
      }))
    ).toMatchSnapshot();
  });
});
