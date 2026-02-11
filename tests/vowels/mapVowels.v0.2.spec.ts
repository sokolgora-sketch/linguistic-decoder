import { mapVowelsV0_1 } from "@/shared/vowels/mapVowels.v0.1";
import { mapVowelsV0_2 } from "@/shared/vowels/mapVowels.v0.2";

test("mapVowels v0.2 maps Greek monotonic (μέτρο)", () => {
  const out = mapVowelsV0_2({ word: "μέτρο", langHint: "el" });
  expect(out.voices).toEqual(["E", "O"]);
  expect(out.diagnostics.unmapped).toEqual([]);
});

test("mapVowels v0.2 maps Greek polytonic via NFD base fallback (ὕδωρ)", () => {
  const out = mapVowelsV0_2({ word: "ὕδωρ", langHint: "el" });
  // ὕ = upsilon w/ diacritics -> Y; ω -> O
  expect(out.voices).toEqual(["Y", "O"]);
  expect(out.diagnostics.unmapped).toEqual([]);
});

test("mapVowels v0.2 matches v0.1 for Latin canon samples (parity)", () => {
  const words = ["kuzhinë", "dëm", "gurë", "rhythm", "lü", "cœur", "father", "water"];
  for (const w of words) {
    const a = mapVowelsV0_1({ word: w });
    const b = mapVowelsV0_2({ word: w });
    expect({ voices: b.voices, diagnostics: b.diagnostics }).toEqual({ voices: a.voices, diagnostics: a.diagnostics });
  }
});
