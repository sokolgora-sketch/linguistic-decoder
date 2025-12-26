import { VOWEL_INDEX } from "@/shared/math7.core";
import { extractMath7BasisFromPayload } from "@/shared/math7.basis";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

describe("Math7 evidence lock (optional fields)", () => {
  it("study (strict): vowels/indices/sum are consistent with payload basis", async () => {
    const payload = await runAnalysisDeterministic("study", { mode: "strict" });

    const { vowels: basisVowels } = extractMath7BasisFromPayload(payload);

    // Evidence lock parity rule (keep consistent with existing tests):
    // exclude terminal closure "Ë" from evidence comparisons.
    const basis =
      basisVowels.length && basisVowels[basisVowels.length - 1] === "Ë"
        ? basisVowels.slice(0, -1)
        : basisVowels;

    expect(basis.length).toBeGreaterThan(0);

    const r: any = enginePayloadToAnalysisResult(payload);
    const p = r?.heart?.math7?.primary;

    expect(Array.isArray(p?.vowels)).toBe(true);
    expect(p.vowels).toEqual(basis);

    expect(Array.isArray(p?.indices)).toBe(true);
    const expectedIndices = basis.map((v: any) => VOWEL_INDEX[v]);
    expect(p.indices).toEqual(expectedIndices);

    expect(typeof p?.sum).toBe("number");
    const expectedSum = expectedIndices.reduce((a: number, b: number) => a + b, 0);
    expect(p.sum).toBe(expectedSum);
  });
});
