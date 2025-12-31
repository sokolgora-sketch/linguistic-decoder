import { analyzeWordV1 } from "../../src/v1/analyzeWordV1";
import { CANON_VERSION_V1, CONTRACT_VERSION_V1 } from "../../src/v1/versions.v1";

const ALLOWED = new Set(["A", "E", "I", "O", "U", "Y", "Ë"]);

function onlySevenVowels(vs: string[]) {
  return vs.every((v) => ALLOWED.has(String(v).toUpperCase()));
}

describe("Canon Battery v1 — expansion invariants (v2 words)", () => {
  const words = ["shter", "algorithm", "philosophy"] as const;

  for (const word of words) {
    it(`${word}: structural invariants hold`, () => {
      const out = analyzeWordV1(word);

      // Version levers present + stable
      expect(out.meta.contractVersion).toBe(CONTRACT_VERSION_V1);
      expect(out.meta.canonVersion).toBe(CANON_VERSION_V1);

      // Evidence is deterministic + basis matches normalizedWord
      expect(out.evidence.basis).toBe(out.normalizedWord);

      // Surface vowels must be within the 7-vowel alphabet
      expect(Array.isArray(out.evidence.surfaceVowels)).toBe(true);
      expect(out.evidence.surfaceVowels.length).toBeGreaterThan(0);
      expect(onlySevenVowels(out.evidence.surfaceVowels)).toBe(true);

      // Math7 indices should align with the extracted vowel stream
      expect(Array.isArray(out.evidence.math7?.indices)).toBe(true);
      expect(out.evidence.math7.indices.length).toBe(out.evidence.surfaceVowels.length);

      // Candidate must be present and consistent with evidence
      expect(out.candidates.length).toBeGreaterThan(0);
      expect(out.candidates[0].vowelPath).toBe(out.evidence.surfacePath);

      // Guardrail: functional statement non-empty
      expect(typeof out.candidates[0].functionalStatement).toBe("string");
      expect(out.candidates[0].functionalStatement.length).toBeGreaterThan(0);
    });
  }
});
