// src/shared/vowels/mapVowels.v0.1.ts
// Universal Vowel Mapper v0.1 — orthography (Latin + diacritics) → Seven Voices.
// Deterministic, no I/O, no external deps.

import type { VowelVoice } from "./vowelVoices.v0.1";
import { VOWEL_MAP_BASE_LATIN_V0_1 } from "./vowelMap.baseLatin.v0.1";
import { type LangHintV0_1, VOWEL_MAP_OVERRIDES_V0_1 } from "./vowelMap.registry.v0.1";

export function mapVowelsV0_1(input: {
  word: string;
  langHint?: string;
}): {
  voices: VowelVoice[];
  tokens: Array<{ raw: string; norm: string; voice: VowelVoice | null; note?: string }>;
  diagnostics: { unmapped: string[]; usedOverrides: boolean };
} {
  const rawWord = typeof input?.word === "string" ? input.word : "";
  const wordNfc = rawWord.normalize("NFC");

  const hint = normalizeLangHintV0_1(input?.langHint);
  const overrides = hint ? VOWEL_MAP_OVERRIDES_V0_1[hint] : null;

  const voices: VowelVoice[] = [];
  const tokens: Array<{ raw: string; norm: string; voice: VowelVoice | null; note?: string }> = [];

  const unmapped: string[] = [];
  const seenUnmapped = new Set<string>();

  let usedOverrides = false;

  for (const ch of wordNfc) {
    const norm = ch.toLowerCase();

    // 1) override (if any)
    const ov = overrides ? (overrides[norm] ?? overrides[ch]) : undefined;
    if (ov) {
      voices.push(ov);
      tokens.push({ raw: ch, norm, voice: ov, note: "override" });
      usedOverrides = true;
      continue;
    }

    // 2) base table
    const base = VOWEL_MAP_BASE_LATIN_V0_1[norm] ?? VOWEL_MAP_BASE_LATIN_V0_1[ch];
    if (base) {
      voices.push(base);
      tokens.push({ raw: ch, norm, voice: base, note: "base" });
      continue;
    }

    // 3) unmapped “vowel-like” detection (never silent)
    if (isVowelLikeCharV0_1(ch)) {
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

function normalizeLangHintV0_1(x: unknown): LangHintV0_1 | null {
  if (typeof x !== "string") return null;
  const v = x.trim();
  if (v === "sq" || v === "en" || v === "fr" || v === "sv" || v === "zh-pinyin") return v;
  return null;
}

/**
 * Deterministic “vowel-like” heuristic:
 * - NFD decompose; check first codepoint for latin vowel bases a/e/i/o/u/y.
 * - Also treat common vowel ligatures as vowel-like (æ, œ) even if not decomposed.
 */
function isVowelLikeCharV0_1(ch: string): boolean {
  if (!ch) return false;
  const nfd = ch.normalize("NFD").toLowerCase();
  const base = nfd[0] || "";
  if (base === "a" || base === "e" || base === "i" || base === "o" || base === "u" || base === "y") return true;
  if (base === "æ" || base === "œ") return true;
  return false;
}
