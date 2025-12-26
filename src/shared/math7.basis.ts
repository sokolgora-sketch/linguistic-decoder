import { isSevenVowel, type SevenVowel } from "@/shared/math7.core";

/**
 * Single source of truth for deriving Math7 "basis" + vowels from a payload.
 * - basis: the sanitized 7-vowel-only string
 * - vowels: SevenVowel[] extracted from basis
 *
 * IMPORTANT:
 * - Keep this logic stable; both engine + tests depend on it.
 */
export function extractMath7BasisFromPayload(payload: any): { basis: string; vowels: SevenVowel[] } {
  const raw =
    payload?.primaryPath?.voicePath ??
    payload?.primaryPath?.voiceSequence ??
    payload?.sevenVoices?.primary?.voicePath ??
    payload?.sevenVoices?.primary?.voiceSequence ??
    payload?.raw?.primaryPath?.voicePath ??
    payload?.raw?.voices?.voiceSequence ??
    payload?.raw?.voices?.voicePath ??
    payload?.voicePath ??
    payload?.vowelPath ??
    payload?.vowel_path ??
    payload?.vowelPathString ??
    payload?.vowel_path_string ??
    "";

  // Extract vowels from either array or string; always sanitize to AEIOUYË only.
  const basis =
    Array.isArray(raw)
      ? raw.map((v) => String(v ?? "").toUpperCase()).join("").match(/[AEIOUYË]/g)?.join("") ?? ""
      : String(raw ?? "").toUpperCase().match(/[AEIOUYË]/g)?.join("") ?? "";

  // Convert basis -> SevenVowel[]
  const vowels = (basis.match(/[AEIOUYË]/g) ?? []).filter((v): v is SevenVowel => isSevenVowel(v));

  return { basis, vowels };
}
