import { parseIpaVowelsV0_1 } from "../../src/shared/vowels/parseIpaVowels.v0.1";

describe("vowels/parseIpaVowels v0.1", () => {
  it('parses "/ɹɪðəm/" → ["I","Ë"]', () => {
    const r = parseIpaVowelsV0_1("/ɹɪðəm/");
    expect(r.voices).toEqual(["I", "Ë"]);
  });

  it('ignores stress/length: "/ˈfɑːðər/" → ["A","Ë"]', () => {
    const r = parseIpaVowelsV0_1("/ˈfɑːðər/");
    expect(r.voices).toEqual(["A", "Ë"]);
  });

  it('handles wrappers: "[ɪə]" → ["I","Ë"]', () => {
    const r = parseIpaVowelsV0_1("[ɪə]");
    expect(r.voices).toEqual(["I", "Ë"]);
  });

  it("emits diagnostics for vowel-like symbols not mapped (e.g. ɜ)", () => {
    const r = parseIpaVowelsV0_1("/ɜ/");
    expect(r.diagnostics.unmapped).toEqual(["ɜ"]);
    expect(r.tokens).toEqual([{ raw: "ɜ", voice: null, note: "unmapped_vowel_symbol" }]);
  });
});
