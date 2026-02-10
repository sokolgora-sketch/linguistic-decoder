import { mapVowelsV0_1 } from "@/shared/vowels/mapVowels.v0.1";

describe("vowels: mapVowels v0.1", () => {
  test("kuzhinë → U I Ë", () => {
    const out = mapVowelsV0_1({ word: "kuzhinë" });
    expect(out.voices).toEqual(["U", "I", "Ë"]);
    expect(out.diagnostics.unmapped).toEqual([]);
  });

  test("dëm → Ë", () => {
    const out = mapVowelsV0_1({ word: "dëm" });
    expect(out.voices).toEqual(["Ë"]);
    expect(out.diagnostics.unmapped).toEqual([]);
  });

  test("gurë → U Ë", () => {
    const out = mapVowelsV0_1({ word: "gurë" });
    expect(out.voices).toEqual(["U", "Ë"]);
    expect(out.diagnostics.unmapped).toEqual([]);
  });

  test("rhythm → Y (orthography only)", () => {
    const out = mapVowelsV0_1({ word: "rhythm" });
    expect(out.voices).toEqual(["Y"]);
    expect(out.diagnostics.unmapped).toEqual([]);
  });

  test("lü → Y (ü → Y law)", () => {
    const out = mapVowelsV0_1({ word: "lü" });
    expect(out.voices).toEqual(["Y"]);
    expect(out.diagnostics.unmapped).toEqual([]);
  });

  test("cœur → O-U (œ treated as O; u treated as U in base table v0.1)", () => {
    const out = mapVowelsV0_1({ word: "cœur" });
    expect(out.voices).toEqual(["O", "U"]);
    expect(out.diagnostics.unmapped).toEqual([]);
  });

  test("tokens preserve order and provide notes for mapped chars", () => {
    const out = mapVowelsV0_1({ word: "kuzhinë" });
    const mapped = out.tokens.filter((t) => t.voice);
    expect(mapped.map((t) => t.voice)).toEqual(["U", "I", "Ë"]);
    expect(mapped.every((t) => t.note === "base")).toBe(true);
  });
});
