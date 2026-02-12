import { IPA_VOWEL_MAP_V0_2 } from "../../src/shared/vowels/ipaVowelMap.v0.2";
import type { VowelVoice } from "../../src/shared/vowels/vowelVoices.v0.1";

const VOICES: readonly VowelVoice[] = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;

function isVoice(x: unknown): x is VowelVoice {
  return typeof x === "string" && (VOICES as readonly string[]).includes(x);
}

function stableSort(a: string, b: string): number {
  if (a < b) return -1;
  if (a > b) return 1;
  return 0;
}

describe("vowels/ipaVowelMap v0.2 (lock)", () => {
  it("locks token→voice mapping (sorted by token, deterministic)", () => {
    const tokens = Object.keys(IPA_VOWEL_MAP_V0_2).sort(stableSort);
    const pairs = tokens.map((t) => [t, (IPA_VOWEL_MAP_V0_2 as Record<string, unknown>)[t]]);
    expect(pairs).toMatchSnapshot();
  });

  it("guards: all mapped values are valid Seven Voices", () => {
    for (const [token, voice] of Object.entries(IPA_VOWEL_MAP_V0_2)) {
      expect(typeof token).toBe("string");
      expect(isVoice(voice)).toBe(true);
    }
  });
});
