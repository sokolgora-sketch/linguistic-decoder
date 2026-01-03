// tests/analyzeWordV1.spec.ts
import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("analyzeWordV1", () => {
  it("returns a v1 AnalysisResult for 'study'", async () => {
    const result = await analyzeWordV1("study", "strict");

    expect(result.word).toBe("study");
    expect(result.mode).toBe("strict");

    // Engine meta basics
    expect(result.engine_meta.engineVersion).toBe("v1.1.0");
    expect(typeof result.engine_meta.timestampIso).toBe("string");

    // Math7 summary should exist for a normal word
    expect(result.math7_summary).not.toBeNull();

    // At least one candidate
    expect(result.candidates.length).toBeGreaterThan(0);

    const c = result.candidates[0];
    expect(c.form).toBe("study");
    expect(Array.isArray(c.decomposition)).toBe(true);
    expect(Array.isArray(c.vowel_path)).toBe(true);
  });
});
