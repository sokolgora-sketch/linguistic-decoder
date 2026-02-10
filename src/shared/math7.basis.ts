// src/shared/math7.basis.ts
//
// v0.1.2 audit support — derive Math7 basis+vowels from engine payload.
// Goal: stable extraction for computeMath7ForResult() across payload shapes.
//
// IMPORTANT:
// - This chooses the *vowel sequence basis* for Math7.
// - It does not mutate spelling; it only selects which already-computed path to trust.

import { isSevenVowel, type SevenVowel, extractSevenVowelsFromString } from "@/shared/math7.core";

function normalizeSevenVowels(vowelsIn: Array<string | null | undefined>): SevenVowel[] {
  return vowelsIn
    .map((v) => String(v ?? "").toUpperCase())
    .filter((v): v is SevenVowel => isSevenVowel(v));
}

function pickMode(payload: any): string {
  const m =
    payload?.mode?.mode ?? // observed: payload.mode can be { mode: "strict" }
    payload?.mode ??
    payload?.engine_meta?.mode ??
    payload?.engineMeta?.mode ??
    payload?.meta?.mode ??
    undefined;

  return String(m ?? "").toLowerCase();
}

function pickWord(payload: any): string {
  const w =
    payload?.word ??
    payload?.basis ??
    payload?.sanitized ??
    payload?.sanitizedWord ??
    payload?.normalizedWord ??
    undefined;

  return String(w ?? "");
}

function lastVowel(v: SevenVowel[]): SevenVowel | null {
  if (!Array.isArray(v) || v.length === 0) return null;
  const x = v[v.length - 1];
  return isSevenVowel(x) ? x : null;
}

function replaceTerminalYWithI(v: SevenVowel[]): SevenVowel[] {
  if (!Array.isArray(v) || v.length === 0) return v;
  if (v[v.length - 1] !== "Y") return v;
  const out = v.slice();
  out[out.length - 1] = "I";
  return out;
}

function parseVoicePathString(s: unknown): SevenVowel[] {
  const up = String(s ?? "").toUpperCase();
  const m = extractSevenVowelsFromString(String(up ?? ""));
  return normalizeSevenVowels(m);
}

/**
 * v0.1.2 constrained hint:
 * If strict mode AND word ends with 'y' AND terminal vowel is Y, treat terminal Y as I-family.
 *
 * This is intentionally narrow to avoid wide semantic drift.
 */
export function applyStrictTerminalYHint(payload: any, vowels: SevenVowel[]): SevenVowel[] {
  const mode = pickMode(payload);
  const word = pickWord(payload);

  if (mode === "strict" && /y$/i.test(word) && lastVowel(vowels) === "Y") {
    return replaceTerminalYWithI(vowels);
  }
  return vowels;
}

/**
 * Returns:
 * - basis: short string describing the extracted vowel basis (not spelling)
 * - vowels: SevenVowel[] used for Math7 primary
 */
export function extractMath7BasisFromPayload(payload: any): { basis: string; vowels: SevenVowel[] } {
  const p = payload ?? {};

  // 0) Strongest: primaryPath.voicePath is already the chosen "truth path" for the UI/instrument.
  // This is present in your /api/analyze-v1 output.
  const primaryPath =
    p?.primaryPath?.voicePath ??
    p?.raw?.primaryPath?.voicePath ??
    null;

  if (Array.isArray(primaryPath)) {
    const vowels = normalizeSevenVowels(primaryPath);
    return { basis: vowels.join(""), vowels };
  }

  // 1) Explicit vowels (future-proof)
  const fromExplicit =
    p?.heart?.math7?.primary?.vowels ??
    p?.evidence?.math7?.primary?.vowels ??
    p?.raw?.heart?.math7?.primary?.vowels ??
    null;

  if (Array.isArray(fromExplicit)) {
    const vowels = normalizeSevenVowels(fromExplicit);
    return { basis: vowels.join(""), vowels };
  }

  // 2) Observed in some payloads: math7_summary.path = ["U","Y"]
  if (Array.isArray(p?.math7_summary?.path)) {
    const vowels = normalizeSevenVowels(p.math7_summary.path);
    return { basis: vowels.join(""), vowels };
  }

  // 3) Observed: stress_test_v1 voicePath strings like "U → Y"
  const st =
    p?.stress_test_v1?.voicePathRaw ??
    p?.stress_test_v1?.voicePath ??
    p?.stress_test_v1?.ui?.voicePath ??
    null;

  if (st != null) {
    const vowels = parseVoicePathString(st);
    return { basis: vowels.join(""), vowels };
  }

  // 4) Fallback: nothing found
  return { basis: "", vowels: [] };
}
