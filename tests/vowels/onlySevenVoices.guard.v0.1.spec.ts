import { mapVowelsV0_1 } from "@/shared/vowels/mapVowels.v0.1";
import { isVowelVoice, VOWEL_VOICES_V0_1 } from "@/shared/vowels/vowelVoices.v0.1";

describe("vowels: only Seven Voices guard v0.1", () => {
  test("isVowelVoice recognizes the canonical set", () => {
    for (const v of VOWEL_VOICES_V0_1) {
      expect(isVowelVoice(v)).toBe(true);
    }
    expect(isVowelVoice("Ë")).toBe(true);
    expect(isVowelVoice("Z")).toBe(false);
    expect(isVowelVoice("")).toBe(false);
    expect(isVowelVoice(null)).toBe(false);
  });

  test("mapVowels output voices are always in the union", () => {
    const cases = ["kuzhinë", "dëm", "gurë", "rhythm", "lü", "cœur", "___", "123", ""];
    for (const word of cases) {
      const out = mapVowelsV0_1({ word });
      for (const v of out.voices) {
        expect(isVowelVoice(v)).toBe(true);
      }
    }
  });
});
