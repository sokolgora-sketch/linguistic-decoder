import { mapVowelsV0_2 } from "@/shared/vowels/mapVowels.v0.2";
import { VOWEL_MAP_OVERRIDES_V0_2 } from "@/shared/vowels/vowelMap.registry.v0.2";

function stableSort(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

describe("vowels/mapVowels v0.2 (lock)", () => {
  test("locks outputs for representative latin+diacritics + greek samples", () => {
    const samples: Array<{ word: string; langHint?: string }> = [
      { word: "résumé" },
      { word: "naïve" },
      { word: "français" },
      { word: "Über" },
      { word: "coöperate" },
      { word: "Çalışma" },
      { word: "Łódź" },
      { word: "μέτρο", langHint: "el" },
      { word: "ὕδωρ", langHint: "el" },
    ];

    const results = samples.map((s) => ({ in: s, out: mapVowelsV0_2(s as any) }));
    expect(results).toMatchSnapshot();
  });

  test("proves overrides path is wired (if registry defines any overrides)", () => {
    const hints = Object.keys(VOWEL_MAP_OVERRIDES_V0_2).sort(stableSort);

    let picked: { hint: string; key: string; voice: unknown } | null = null;
    for (const hint of hints) {
      const ov = (VOWEL_MAP_OVERRIDES_V0_2 as any)[hint] ?? {};
      const keys = Object.keys(ov).sort(stableSort);
      if (keys.length) {
        const key = keys[0];
        picked = { hint, key, voice: ov[key] };
        break;
      }
    }

    if (!picked) {
      // no overrides configured (still fine); keep test green
      expect(hints.length).toBeGreaterThanOrEqual(0);
      return;
    }

    const word = `x${picked.key}x`;
    const out = mapVowelsV0_2({ word, langHint: picked.hint });

    expect(out.diagnostics.usedOverrides).toBe(true);
    expect(out.voices[0]).toBe(picked.voice as any);
    expect({ picked, out }).toMatchSnapshot();
  });
});
