// tests/analyzeWordV1.spec.ts
import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("analyzeWordV1", () => {
  it("returns empty analysis for blank input", async () => {
    const res = await analyzeWordV1("   ", "strict");

    expect(res.word).toBe("");
    expect(res.candidates.length).toBe(0);
    expect(res.math7Summary).toBeNull();
  });

  it("returns one identity candidate for 'study' with Math7 info", async () => {
    const res = await analyzeWordV1("study", "strict");

    expect(res.word).toBe("study");
    expect(res.mode).toBe("strict");

    // We know generateCandidates currently returns a single identity candidate
    expect(res.candidates.length).toBe(1);

    const c = res.candidates[0];

    expect(c.form).toBe("study");
    expect(c.decomposition).toEqual(["study"]);
    expect(Array.isArray(c.vowelPath)).toBe(true);
    expect(c.vowelPath.length).toBeGreaterThan(0);
    expect(res.math7Summary).not.toBeNull();
  });
});
