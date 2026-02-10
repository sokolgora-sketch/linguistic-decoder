import { parseIpaVowelsV0_1 } from "../../src/shared/vowels/parseIpaVowels.v0.1";
import { VOWEL_VOICES_V0_1 } from "../../src/shared/vowels/vowelVoices.v0.1";

describe("vowels/phonetic-only-seven-voices guard (v0.1)", () => {
  it("never emits a voice outside the canonical set", () => {
    const r = parseIpaVowelsV0_1("/ˈfɑːðər ɹɪðəm/");
    for (const v of r.voices) {
      expect(VOWEL_VOICES_V0_1).toContain(v);
    }
  });
});
