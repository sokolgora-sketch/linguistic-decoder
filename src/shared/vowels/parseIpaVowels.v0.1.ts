import type { VowelVoice } from "./vowelVoices.v0.1";
import { IPA_VOWEL_MAP_V0_1 } from "./ipaVowelMap.v0.1";

const IGNORED_CHARS = new Set<string>([
  // stress
  "ˈ",
  "ˌ",
  // separators
  ".",
  " ",
  // length
  "ː",
  "ˑ",
]);

// common diacritics / modifiers we ignore deterministically (v0.1)
const IGNORED_DIACRITICS = new Set<string>([
  "̃", // nasalization
  "̩", // syllabic
  "̯", // non-syllabic
  "̆", // extra-short
]);

// Conservative "vowel-like" set for diagnostics (not mapping).
// Keep encounter order; no sorting; no guessing.
const VOWEL_LIKE_EXTRA = new Set<string>([
  "ɜ",
  "ɞ",
  "ø",
  "œ",
  "ɒ",
  "ɶ",
  "ɨ",
  "ʉ",
  "ɯ",
  "ɤ",
]);

function stripWrappers(raw: string): string {
  const s = (raw ?? "").trim();
  if (s.length >= 2) {
    const a = s[0];
    const b = s[s.length - 1];
    if ((a === "/" && b === "/") || (a === "[" && b === "]")) {
      return s.slice(1, -1);
    }
  }
  return s;
}

export function parseIpaVowelsV0_1(ipa: string): {
  voices: VowelVoice[];
  tokens: Array<{
    raw: string;
    voice: VowelVoice | null;
    note?: string;
  }>;
  diagnostics: {
    unmapped: string[];
  };
} {
  const core = stripWrappers(ipa);

  const voices: VowelVoice[] = [];
  const tokens: Array<{ raw: string; voice: VowelVoice | null; note?: string }> = [];
  const unmapped: string[] = [];

  // Iterate by codepoints (safe for IPA + combining marks)
  for (const ch of Array.from(core)) {
    if (IGNORED_CHARS.has(ch) || IGNORED_DIACRITICS.has(ch)) continue;

    const mapped = (IPA_VOWEL_MAP_V0_1 as any)[ch] as VowelVoice | undefined;
    if (mapped) {
      voices.push(mapped);
      tokens.push({ raw: ch, voice: mapped });
      continue;
    }

    const isVowelLike = ch in IPA_VOWEL_MAP_V0_1 || VOWEL_LIKE_EXTRA.has(ch);
    if (isVowelLike) {
      tokens.push({ raw: ch, voice: null, note: "unmapped_vowel_symbol" });
      if (!unmapped.includes(ch)) unmapped.push(ch);
    }
  }

  return {
    voices,
    tokens,
    diagnostics: { unmapped },
  };
}
