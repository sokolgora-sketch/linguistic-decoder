import { analyzeWordV1 } from "../../src/v1/analyzeWordV1";
import { CONTRACT_VERSION_V1, CANON_VERSION_V1 } from "../../src/v1/versions.v1";

describe("Canon Battery v1 — expansion invariants", () => {
  const words = ["gjak", "zemër", "internet"] as const;

  for (const word of words) {
    it(`${word}: minimal invariants hold`, () => {
      const out = analyzeWordV1(word);

      // Version levers present + stable
      expect(out.meta.contractVersion).toBe(CONTRACT_VERSION_V1);
      expect(out.meta.canonVersion).toBe(CANON_VERSION_V1);

      // Evidence is deterministic + basis matches normalizedWord
      expect(out.evidence.basis).toBe(out.normalizedWord);

      // Vowel path extracted from evidence
      expect(out.candidates[0].vowelPath).toBe(out.evidence.surfacePath);

      // Guardrails: never empty result for non-empty input
      expect(out.candidates.length).toBeGreaterThan(0);
      expect(typeof out.candidates[0].functionalStatement).toBe("string");
      expect(out.candidates[0].functionalStatement.length).toBeGreaterThan(0);
    });
  }
});
