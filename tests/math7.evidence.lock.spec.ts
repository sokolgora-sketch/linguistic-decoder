import { VOWEL_INDEX, isSevenVowel } from "@/shared/math7.core";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

function parseSevenVowels(x: unknown): string[] {
  if (Array.isArray(x)) {
    return x
      .map((v) => String(v ?? "").toUpperCase())
      .flatMap((s) => (s.match(/[AEIOUYË]/g) ?? []))
      .filter((v) => isSevenVowel(v));
  }
  const s = String(x ?? "").toUpperCase();
  return (s.match(/[AEIOUYË]/g) ?? []).filter((v) => isSevenVowel(v));
}

function payloadBasisVowels(payload: any): string[] {
  const vp =
    payload?.primaryPath?.voicePath ??
    payload?.primaryPath?.voiceSequence ??
    payload?.raw?.primaryPath?.voicePath ??
    payload?.raw?.voices?.voiceSequence ??
    payload?.raw?.voices?.voicePath;

  let vowels = parseSevenVowels(vp);

  // If engine includes terminal closure "Ë", exclude it from basis for evidence parity.
  if (vowels.length && vowels[vowels.length - 1] === "Ë") vowels = vowels.slice(0, -1);

  return vowels;
}

describe("Math7 evidence lock (optional fields)", () => {
  it("study (strict): vowels/indices/sum are consistent with payload basis", async () => {
    const payload = await runAnalysisDeterministic("study", { mode: "strict" });
    const basis = payloadBasisVowels(payload);
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
