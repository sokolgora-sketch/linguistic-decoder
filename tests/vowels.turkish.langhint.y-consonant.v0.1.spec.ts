import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

describe("Turkish langHint — y is consonant (no fake Y vowel)", () => {
  test('without langHint, "yol" still maps y as Y (do not break universal behavior)', () => {
    const out = extractOrthographyVoicesFromWordV0_1({ word: "yol" });
    expect(out.diagnostics.unmapped).toEqual([]);
    // universal mapping (non-tr): y treated as vowel voice Y
    expect(out.voices).toEqual(["Y", "O"]);
  });

  test('with langHint="tr", "yol" must NOT treat y as vowel', () => {
    const out = extractOrthographyVoicesFromWordV0_1({ word: "yol", langHint: "tr" });
    expect(out.diagnostics.unmapped).toEqual([]);
    expect(out.voices).toEqual(["O"]); // y dropped as consonant, o kept
    // token note should show the policy (debuggable)
    expect(out.tokens.some(t => t.note === "tr-consonant-y")).toBe(true);
  });
});
