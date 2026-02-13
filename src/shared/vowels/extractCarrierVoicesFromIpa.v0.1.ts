// Carrier Law Gate v0.1 — extract carrier nuclei (Seven Voices) from IPA.
// Deterministic, no LLM.
//
// Rules:
// R1: explicit IPA vowels -> Seven Voices (reuse parseIpaVowels v0.2)
// R2: syllabic consonants m̩ n̩ l̩ r̩ ɹ̩ -> implicit Ë
// R3: final sonorant cluster: ...Obstruent + {m|n|l|r|ɹ} with no syllabic mark -> inject implicit Ë before final sonorant
//     Guards:
//       - Only inject if we already observed at least one explicit vowel earlier (prevents /str/ false carrier)
//       - Do NOT inject if the immediate previous non-skip char looks like an IPA vowel (prevents /rɪðəm/ double Ë)
// R4: if still no carriers -> noCarrier=true

import type { VowelVoice } from "./vowelVoices.v0.1";
import { parseIpaVowelsV0_2 } from "./parseIpaVowels.v0.2";

export type CarrierTraceTokenV0_1 = {
  kind: "vowel" | "syllabic" | "implicit";
  raw: string;
  voice: VowelVoice;
  note: string;
};

export type CarrierVoicesFromIpaV0_1 = {
  voices: VowelVoice[];
  tokens: Array<{ raw: string; norm: string; voice: VowelVoice | null; note?: string }>;
  traceTokens: CarrierTraceTokenV0_1[];
  diagnostics: {
    unmapped: string[];
    noCarrier: boolean;
    usedImplicit: boolean;
    usedSyllabic: boolean;
  };
};

const SYLLABIC_MARK = "\u0329"; // ̩

const SONORANTS = new Set(["m", "n", "l", "r", "ɹ"]);
const SKIP_CHARS = new Set([
  " ", "\t", "\n",
  "ˈ", "ˌ", "ː", "ˑ",
  ".", "·",
  "/", "[", "]", "(", ")", "{", "}",
]);

const IPA_VOWELISH = new Set([
  "i","y","ɨ","ʉ","ɯ","u",
  "ɪ","ʏ","ʊ",
  "e","ø","ɘ","ɵ","ɤ","o",
  "ɛ","œ","ɜ","ɞ","ʌ","ɔ",
  "æ","ɐ",
  "a","ɶ","ɑ","ɒ",
  "ə",
  "ɚ","ɝ",
]);

function looksLikeIpaVowel(ch: string): boolean {
  if (!ch) return false;
  return IPA_VOWELISH.has(ch.normalize("NFC"));
}

function coreIpaString(x: unknown): string {
  let s = typeof x === "string" ? x : String(x ?? "");
  s = s.trim();
  if ((s.startsWith("/") && s.endsWith("/")) || (s.startsWith("[") && s.endsWith("]"))) {
    s = s.slice(1, -1).trim();
  }
  return s.normalize("NFC");
}

function isCombiningMark(ch: string): boolean {
  return /\p{M}/u.test(ch);
}

function isSkippable(ch: string): boolean {
  return !ch || SKIP_CHARS.has(ch) || isCombiningMark(ch);
}

function isSonorant(ch: string): boolean {
  return SONORANTS.has(ch.toLowerCase());
}

function prevNonSkip(arr: string[], from: number): number {
  for (let i = from; i >= 0; i--) {
    if (!isSkippable(arr[i])) return i;
  }
  return -1;
}

function lastNonSkip(arr: string[]): number {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (!isSkippable(arr[i])) return i;
  }
  return -1;
}

function isVowelAtIndexFromParseTokens(tokens: Array<{ voice: VowelVoice | null }>, idx: number): boolean {
  const t = tokens[idx];
  return !!(t && t.voice);
}

function isObstruentLike(arr: string[], tokens: Array<{ voice: VowelVoice | null }>, idx: number): boolean {
  const ch = arr[idx] || "";
  if (isSkippable(ch)) return false;
  if (isSonorant(ch)) return false;
  if (isVowelAtIndexFromParseTokens(tokens, idx)) return false;
  return true;
}

export function extractCarrierVoicesFromIpaV0_1(ipa: unknown): CarrierVoicesFromIpaV0_1 {
  const s = coreIpaString(ipa);
  const arr = Array.from(s);

  const base = parseIpaVowelsV0_2(s);
  const baseTokens = Array.isArray((base as any)?.tokens) ? (base as any).tokens : [];
  const baseUnmapped = Array.isArray((base as any)?.diagnostics?.unmapped) ? (base as any).diagnostics.unmapped : [];

  const events: Array<{ pos: number; token: CarrierTraceTokenV0_1 }> = [];

  // R1 explicit vowels
  for (let i = 0; i < baseTokens.length; i++) {
    const t = baseTokens[i];
    if (t && t.voice) {
      events.push({
        pos: i,
        token: { kind: "vowel", raw: String(t.raw ?? ""), voice: t.voice as VowelVoice, note: "explicit vowel (parseIpaVowels v0.2)" },
      });
    }
  }

  // R2 syllabic consonants => Ë
  let usedSyllabic = false;
  for (let i = 0; i < arr.length - 1; i++) {
    const ch = arr[i];
    const next = arr[i + 1];
    if (next === SYLLABIC_MARK && isSonorant(ch)) {
      usedSyllabic = true;
      events.push({
        pos: i + 0.01,
        token: { kind: "syllabic", raw: ch + next, voice: "Ë", note: `syllabic ${ch}${next} => Ë` },
      });
      i++;
    }
  }

  // R3 final sonorant cluster injection
  let usedImplicit = false;
  const hasExplicit = events.some((e) => e.token.kind === "vowel");

  const j = lastNonSkip(arr);
  if (hasExplicit && j >= 0) {
    const lastCh = arr[j] || "";
    const hasSyllabicMark = arr[j + 1] === SYLLABIC_MARK;
    if (isSonorant(lastCh) && !hasSyllabicMark) {
      const k = prevNonSkip(arr, j - 1);
      if (k >= 0) {
        const prevCh = arr[k] || "";
        if (!looksLikeIpaVowel(prevCh) && isObstruentLike(arr, baseTokens, k)) {
          usedImplicit = true;
          events.push({
            pos: j - 0.25,
            token: {
              kind: "implicit",
              raw: "∅",
              voice: "Ë",
              note: `implicit Ë injected before final ${lastCh} (carrier nucleus reconstruction)`,
            },
          });
        }
      }
    }
  }

  events.sort((a, b) => a.pos - b.pos);

  const traceTokens = events.map((e) => e.token);
  const voices = traceTokens.map((t) => t.voice);

  return {
    voices,
    tokens: baseTokens,
    traceTokens,
    diagnostics: {
      unmapped: baseUnmapped,
      noCarrier: voices.length === 0,
      usedImplicit,
      usedSyllabic,
    },
  };
}
