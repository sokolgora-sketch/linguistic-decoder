import { describe, it, expect } from "@jest/globals";
import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

function vowelChars(out: ReturnType<typeof extractOrthographyVoicesFromWordV0_1>) {
  return out.tokens.filter(t => t.voice != null).map(t => t.raw);
}

describe("Turkish orthography — base Latin mapping (ö ü ı İ)", () => {
  it("maps Turkish vowels and never reports them as unmapped", () => {
    const cases: Array<{ word: string; expectVowels: string[]; expectVoices: string[] }> = [
      { word: "göl",      expectVowels: ["ö"],           expectVoices: ["O"] },
      { word: "güneş",    expectVowels: ["ü","e"],       expectVoices: ["Y","E"] },
      { word: "ışık",     expectVowels: ["ı","ı"],       expectVoices: ["I","I"] },
      { word: "İstanbul", expectVowels: ["İ","a","u"],   expectVoices: ["I","A","U"] },
      { word: "küçük",    expectVowels: ["ü","ü"],       expectVoices: ["Y","Y"] },
    ];

    for (const c of cases) {
      const out = extractOrthographyVoicesFromWordV0_1({ word: c.word });

      // 1) no unmapped vowel-like chars in these known-good Turkish cases
      expect(out.diagnostics.unmapped).toEqual([]);

      // 2) vowel characters detected in tokens
      expect(vowelChars(out)).toEqual(c.expectVowels);

      // 3) voices emitted (per vowel occurrence)
      expect(out.voices).toEqual(c.expectVoices);
    }
  });
});
