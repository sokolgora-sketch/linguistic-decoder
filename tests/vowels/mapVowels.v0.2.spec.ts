import { mapVowelsV0_2 } from "@/shared/vowels/mapVowels.v0.2";

describe("mapVowelsV0_2 (Universal Vowel Mapper)", () => {
  test("extracts basic vowels", () => {
    const out = mapVowelsV0_2({ word: "gjuha" });
    expect(out.voices).toEqual(["U", "A"]);
    expect(out.diagnostics.usedOverrides).toBe(false);
  });

  test("treats y as vowel voice Y", () => {
    expect(mapVowelsV0_2({ word: "rhythm" }).voices).toEqual(["Y"]);
  });

  test("maps ë to Ë", () => {
    expect(mapVowelsV0_2({ word: "zër" }).voices).toEqual(["Ë"]);
  });

  test("handles diacritics (ü is Y-family in v0.2)", () => {
    expect(mapVowelsV0_2({ word: "naïve" }).voices).toEqual(["A", "I", "E"]);
    expect(mapVowelsV0_2({ word: "über" }).voices).toEqual(["Y", "E"]);
  });

  test("ligatures are vowel-like but unmapped unless explicitly in base tables", () => {
    const out = mapVowelsV0_2({ word: "æther" });

    // current contract: æ is vowel-like -> unmapped; 'e' maps to E
    expect(out.voices).toEqual(["E"]);
    expect(out.diagnostics.unmapped).toEqual(["æ"]);

    // token proof (first char flagged)
    expect(out.tokens[0]).toMatchObject({
      raw: "æ",
      norm: "æ",
      voice: null,
      note: "unmapped-vowel-like",
    });
  });

  test("no vowels => empty", () => {
    expect(mapVowelsV0_2({ word: "bcdfg" }).voices).toEqual([]);
  });

  test("IPA-ish symbols are NOT considered vowel-like in orthography v0.2 (no false positives)", () => {
    const out = mapVowelsV0_2({ word: "tɪp" });
    expect(out.voices).toEqual([]);
    expect(out.diagnostics.unmapped).toEqual([]);
  });
});
