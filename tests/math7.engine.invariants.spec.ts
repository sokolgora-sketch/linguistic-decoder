import { totalMod7FromVowels, isSevenVowel } from "@/shared/math7.core";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

function parseSevenVowels(x: unknown): string[] {
  // Accept ["U","I"] or "U-I" or "U → I"
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
  // Engine basis should come from solver primary path (NOT spelling).
  const vp =
    payload?.primaryPath?.voicePath ??
    payload?.primaryPath?.voiceSequence ??
    payload?.raw?.primaryPath?.voicePath ??
    payload?.raw?.voices?.voiceSequence ??
    payload?.raw?.voices?.voicePath;

  let vowels = parseSevenVowels(vp);

  // If engine includes terminal closure "Ë", exclude it from mod7 + principles length.
  if (vowels.length && vowels[vowels.length - 1] === "Ë") vowels = vowels.slice(0, -1);

  return vowels;
}

describe("Math7 ↔ Analysis pipeline invariants (payload basis)", () => {
  const cases = [
    { word: "study", mode: "strict" as const },
    { word: "study", mode: "open" as const },
    { word: "damage", mode: "strict" as const },
    { word: "damage", mode: "open" as const },
  ];

  for (const c of cases) {
    it(`${c.word} (${c.mode}) totalMod7 matches canonical vowel mapping (payload basis)`, async () => {
      const payload = await runAnalysisDeterministic(c.word, { mode: c.mode });

      const basis = payloadBasisVowels(payload);
      expect(basis.length).toBeGreaterThan(0);

      const recomputed = totalMod7FromVowels(basis as any);

      // Compare against adapted output (what UI/API consumes)
      const r: any = enginePayloadToAnalysisResult(payload);
      const engineTotal = r?.heart?.math7?.primary?.totalMod7;

      expect(typeof engineTotal).toBe("number");
      expect(engineTotal).toBe(recomputed);
    });

    it(`${c.word} (${c.mode}) principlesPath length matches basis vowel count (payload basis)`, async () => {
      const payload = await runAnalysisDeterministic(c.word, { mode: c.mode });
      const basis = payloadBasisVowels(payload);
      expect(basis.length).toBeGreaterThan(0);

      const r: any = enginePayloadToAnalysisResult(payload);
      const principles = r?.heart?.math7?.primary?.principlesPath;

      expect(Array.isArray(principles)).toBe(true);
      expect(principles.length).toBe(basis.length);
    });
  }
});
