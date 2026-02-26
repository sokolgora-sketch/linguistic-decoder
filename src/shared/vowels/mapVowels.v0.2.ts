// src/shared/vowels/mapVowels.v0.2.ts
// Universal Vowel Mapper v0.2 — orthography (Latin + diacritics + Greek) → Seven Voices.
// Deterministic, no I/O, no external deps.
// v0.1 remains Latin-only; v0.2 adds script support.

import type { VowelVoice } from "./vowelVoices.v0.1";
import { VOWEL_MAP_BASE_LATIN_V0_1 } from "./vowelMap.baseLatin.v0.1";
import { VOWEL_MAP_BASE_GREEK_V0_2 } from "./vowelMap.baseGreek.v0.2";
import { type LangHintV0_2, VOWEL_MAP_OVERRIDES_V0_2 } from "./vowelMap.registry.v0.2";

const VOWEL_MAP_BASE_V0_2: Readonly<Record<string, VowelVoice>> = Object.freeze({
  ...VOWEL_MAP_BASE_LATIN_V0_1,
  ...VOWEL_MAP_BASE_GREEK_V0_2,
});

export function mapVowelsV0_2(input: {
  word: string;
  langHint?: string;
}): {
  voices: VowelVoice[];
  tokens: Array<{ raw: string; norm: string; voice: VowelVoice | null; note?: string }>;
  diagnostics: { unmapped: string[]; usedOverrides: boolean };
} {
  const rawWord = typeof input?.word === "string" ? input.word : "";
  const wordNfc = rawWord.normalize("NFC");

  const hint = normalizeLangHintV0_2(input?.langHint);
  const overrides = hint ? VOWEL_MAP_OVERRIDES_V0_2[hint] : null;

  const voices: VowelVoice[] = [];
  const tokens: Array<{ raw: string; norm: string; voice: VowelVoice | null; note?: string }> = [];

  const unmapped: string[] = [];
  const seenUnmapped = new Set<string>();

  let usedOverrides = false;

  for (const ch of wordNfc) {
    const norm = ch.toLowerCase();


      // Turkish: 'y' is a consonant. When langHint=tr, do NOT treat it as vowel voice Y.
      // This prevents false carriers in common roots (e.g., "yol").
      if (hint === "tr" && norm === "y") {
        tokens.push({ raw: ch, norm, voice: null, note: "tr-consonant-y" });
        continue;
      }

    // 1) override (if any)
    const ov = overrides ? (overrides[norm] ?? overrides[ch]) : undefined;
    if (ov) {
      voices.push(ov);
      tokens.push({ raw: ch, norm, voice: ov, note: "override" });
      usedOverrides = true;
      continue;
    }

    // 2) base table (explicit NFC keys)
    const base = VOWEL_MAP_BASE_V0_2[norm] ?? VOWEL_MAP_BASE_V0_2[ch];
    if (base) {
      voices.push(base);
      tokens.push({ raw: ch, norm, voice: base, note: "base" });
      continue;
    }

    // 2b) Greek decomposed fallback (polytonic-safe, restricted to Greek script only)
    if (isGreekScriptCharV0_2(ch)) {
      const nfd = ch.normalize("NFD").toLowerCase();
      const baseChar = nfd[0] || "";
      const g = VOWEL_MAP_BASE_GREEK_V0_2[baseChar];
      if (g) {
        voices.push(g);
        tokens.push({ raw: ch, norm, voice: g, note: "greek-base-nfd" });
        continue;
      }
    }

    // 3) unmapped “vowel-like” detection (never silent)
    if (isVowelLikeCharV0_2(ch)) {
      const key = norm; // stable: report normalized char
      if (!seenUnmapped.has(key)) {
        seenUnmapped.add(key);
        unmapped.push(key);
      }
      tokens.push({ raw: ch, norm, voice: null, note: "unmapped-vowel-like" });
      continue;
    }

    // 4) non-vowel
    tokens.push({ raw: ch, norm, voice: null });
  }

  return {
    voices,
    tokens,
    diagnostics: { unmapped, usedOverrides },
  };
}

function normalizeLangHintV0_2(x: unknown): LangHintV0_2 | null {
  if (typeof x !== "string") return null;
  const v = x.trim();
  if (v === "sq" || v === "en" || v === "fr" || v === "sv" || v === "zh-pinyin" || v === "el" || v === "tr") return v;
  return null;
}

function isGreekScriptCharV0_2(ch: string): boolean {
  // single codepoint
  return /\p{Script=Greek}/u.test(ch);
}

/**
 * Deterministic “vowel-like” heuristic:
 * - NFD decompose; check first codepoint for known Latin vowel bases a/e/i/o/u/y.
 * - Also treat common vowel ligatures as vowel-like (æ, œ).
 * - Add Greek vowel bases α/ε/η/ι/ο/υ/ω.
 */
function isVowelLikeCharV0_2(ch: string): boolean {
  if (!ch) return false;
  const nfd = ch.normalize("NFD").toLowerCase();
  const base = nfd[0] || "";

  // Latin
    if (base === "a" || base === "e" || base === "i" || base === "o" || base === "u" || base === "y") return true;
    if (base === "æ" || base === "œ") return true;

    // Turkish dotless i (close back unrounded). If it ever falls through mapping,
    // it must be reported as vowel-like (unmapped) rather than silently treated as consonant.
    if (base === "ı") return true;

  // Greek
  if (base === "α" || base === "ε" || base === "η" || base === "ι" || base === "ο" || base === "υ" || base === "ω") return true;

  return false;
}
