import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractSevenVowelsFromString } from "@/shared/math7.core";

describe("orthography SSOT: extractOrthographyVoicesFromWordV0_1", () => {
  test("basic extraction (Latin + diacritics)", () => {
    expect(extractOrthographyVoicesFromWordV0_1({ word: "study" }).voices).toEqual(["U", "Y"]);
    expect(extractOrthographyVoicesFromWordV0_1({ word: "zër" }).voices).toEqual(["Ë"]);
    expect(extractOrthographyVoicesFromWordV0_1({ word: "naïve" }).voices).toEqual(["A", "I", "E"]);
    expect(extractOrthographyVoicesFromWordV0_1({ word: "über" }).voices).toEqual(["Y", "E"]);
  });

  test("Greek samples (polytonic-safe)", () => {
    expect(extractOrthographyVoicesFromWordV0_1({ word: "μέτρο" }).voices).toEqual(["E", "O"]);
    expect(extractOrthographyVoicesFromWordV0_1({ word: "ὕδωρ" }).voices).toEqual(["Y", "O"]);
  });

  test("unmapped vowel-like chars are never silent (æther contract)", () => {
    const out = extractOrthographyVoicesFromWordV0_1({ word: "æther" });

    expect(out.voices).toEqual(["E"]);
    expect(out.diagnostics.unmapped).toEqual(["æ"]);
    expect(out.tokens[0]).toMatchObject({
      raw: "æ",
      norm: "æ",
      voice: null,
      note: "unmapped-vowel-like",
    });
  });

  test("no vowels => empty", () => {
    expect(extractOrthographyVoicesFromWordV0_1({ word: "bcdfg" }).voices).toEqual([]);
  });

  test("no false positives for IPA-ish orthography", () => {
    const out = extractOrthographyVoicesFromWordV0_1({ word: "tɪp" });
    expect(out.voices).toEqual([]);
    expect(out.diagnostics.unmapped).toEqual([]);
  });

  test("math7.core.extractSevenVowelsFromString delegates to SSOT (voices lock)", () => {
    const words = ["study", "rhythm", "matematikë", "zë", "μέτρο", "ὕδωρ", "æther", "bcdfg"];

    for (const w of words) {
      const ssot = extractOrthographyVoicesFromWordV0_1({ word: w }).voices;
      const core = extractSevenVowelsFromString(w);
      expect(core).toEqual(ssot);
    }
  });

  test("never throws on weird inputs", () => {
    expect(extractOrthographyVoicesFromWordV0_1({ word: null }).voices).toEqual([]);
    expect(extractOrthographyVoicesFromWordV0_1({ word: undefined }).voices).toEqual([]);
    expect(extractOrthographyVoicesFromWordV0_1({ word: 123 }).voices).toEqual([]);
  });
});
