import { analyzeWordV1, normalizeWordV1 } from "@/v1/analyzeWordV1";
import { ENGINE_VERSION_V1 } from "@/v1/versions.v1";

describe("ZË-RO v1 gold words (minimal contract baseline)", () => {
  const cases: Array<{ word: string; normalized: string; vowelPath: string }> = [
    { word: "study", normalized: "study", vowelPath: "U-Y" },
    { word: "damage", normalized: "damage", vowelPath: "A-A-E" },
    { word: "matematikë", normalized: "matematikë", vowelPath: "A-E-A-I-Ë" },
    { word: "filozofi", normalized: "filozofi", vowelPath: "I-O-O-I" },
    { word: "besë", normalized: "besë", vowelPath: "E-Ë" },
    { word: "vatër", normalized: "vatër", vowelPath: "A-Ë" },
    { word: "zë", normalized: "zë", vowelPath: "Ë" },
  ];

  it("normalizeWordV1 is deterministic and single-token", () => {
    const a = normalizeWordV1("  Study   ");
    const b = normalizeWordV1("Study");
    expect(a.normalizedWord).toBe("study");
    expect(b.normalizedWord).toBe("study");
  });

  it("evidence surface path extracts Seven-vowel vowels only", () => {
    expect(analyzeWordV1("study").evidence.surfacePath).toBe("U-Y");
    expect(analyzeWordV1("zë").evidence.surfacePath).toBe("Ë");
    expect(analyzeWordV1("rhythm").evidence.surfacePath).toBe("Y");
    expect(analyzeWordV1("bcdfg").evidence.surfacePath).toBe("");
  });

  it("analyzeWordV1 returns the v1 contract shape for gold words", () => {
    for (const t of cases) {
      const res = analyzeWordV1(t.word);

      expect(res.engineVersion).toBe(ENGINE_VERSION_V1);
      expect(res.word).toBe(t.word);
      expect(res.normalizedWord).toBe(t.normalized);

      expect(Array.isArray(res.candidates)).toBe(true);
      expect(res.candidates.length).toBeGreaterThanOrEqual(1);

      const c0 = res.candidates[0];
      expect(typeof c0.language).toBe("string");
      expect(typeof c0.form).toBe("string");
      expect(Array.isArray(c0.decomposition)).toBe(true);
      expect(typeof c0.vowelPath).toBe("string");
      expect(typeof c0.functionalStatement).toBe("string");

      expect(c0.form).toBe(t.normalized);
      expect(c0.decomposition).toEqual([t.normalized]);
      expect(c0.vowelPath).toBe(t.vowelPath);
    }
  });

  it("analyzeWordV1 handles multi-token input deterministically (v1 uses first token)", () => {
    const res = analyzeWordV1("hello world");
    expect(res.normalizedWord).toBe("hello");
    expect(res.candidates[0].form).toBe("hello");
    expect(res.candidates[0].notes?.some((n) => n.includes("first token"))).toBe(true);
  });
});
