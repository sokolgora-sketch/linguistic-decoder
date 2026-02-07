// src/shared/voiceSeq.resolve.v0.1.ts
// Voice Sequence Resolver v0.1
// Deterministic extraction of Seven-Voices vowel sequences from adapter-safe inputs.
// Goal: avoid false matches like "U→I (note)" => ["U","I","O","E"].
//
// Rules:
// - Arrays: accept only single-token vowels (A,E,I,O,U,Y,Ë).
// - Strings: accept ONLY if we detect an explicit path-like substring using separators (→, ->, -, – , —)
//   OR the entire string contains only vowels + whitespace (e.g. "U I").
// - Never scrape vowels out of arbitrary prose.

export const VOICE_VOWELS_V0_1 = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
export type VoiceVowelV0_1 = (typeof VOICE_VOWELS_V0_1)[number];

const VOWEL_SET = new Set<string>(VOICE_VOWELS_V0_1);

function isLetterLike(ch: string): boolean {
  return /[A-Za-zËë]/.test(ch);
}

function toVowelToken(x: unknown): string | null {
  const s = String(x ?? "").trim().toLocaleUpperCase();
  if (VOWEL_SET.has(s)) return s;
  return null;
}

function extractVowelsFrom(s: string): string[] | null {
  const m = s.match(/[AEIOUYËë]/gi);
  if (!m || m.length === 0) return null;
  const out = m
    .map((x) => x.toLocaleUpperCase())
    .filter((x) => VOWEL_SET.has(x));
  return out.length ? out : null;
}

function parseFromString(raw: string): string[] | null {
  const s = String(raw ?? "").trim();
  if (!s) return null;

  // 1) Find explicit path-like substrings: e.g. "U→I", "U - I", "U->I", "Ë→A"
  // IMPORTANT: must be bounded by non-letters to avoid matching inside words like "co-operate" ("o-o").
  const rx = /[AEIOUYËë](?:\s*(?:→|->|[-–—])\s*[AEIOUYËë])+/gi;

  for (const match of s.matchAll(rx)) {
    const seg = match[0];
    const idx = match.index ?? -1;
    if (idx < 0) continue;

    const before = idx > 0 ? s[idx - 1] : "";
    const after = idx + seg.length < s.length ? s[idx + seg.length] : "";

    // reject matches embedded inside a word
    if ((before && isLetterLike(before)) || (after && isLetterLike(after))) continue;

    const seq = extractVowelsFrom(seg);
    if (seq && seq.length > 0) return seq;
  }

  // 2) Pure-vowel strings (whitespace only separators): "U I", "A Ë"
  // Reject if any non-vowel letters exist.
  if (/^[\sAEIOUYËë]+$/.test(s)) {
    return extractVowelsFrom(s);
  }

  return null;
}

export function resolveVoiceSeqV0_1(input: unknown): string[] | null {
  if (Array.isArray(input)) {
    const out: string[] = [];
    for (const it of input) {
      const tok = toVowelToken(it);
      if (tok) out.push(tok);
    }
    return out.length ? out : null;
  }

  if (typeof input === "string") {
    return parseFromString(input);
  }

  return null;
}
