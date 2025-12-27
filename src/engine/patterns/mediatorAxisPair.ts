/**
 * Decision Geometry — Mediator Axis Pair (N4)
 *
 * v1 (strict, explicit):
 * - Recognizes only the canonical pair: "po" vs "jo"
 * - Tight constraints: short forms only (CV or CVC), shared main vowel "O"
 *
 * Later versions can generalize to other axis pairs.
 */

export type MediatorAxisPair = {
  id: "N4";
  label: "Mediator Axis Pair";
  sharedVowel: "O";
  a: "po";
  b: "jo";
};

const VOWELS = new Set(["a", "e", "i", "o", "u", "y", "ë"]);

function sanitizeBasic(word: string): string {
  return (word ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFC"); // keep diacritics stable (ë etc.)
}

function vowelsOf(word: string): string[] {
  const w = sanitizeBasic(word);
  const out: string[] = [];
  for (const ch of w) {
    if (VOWELS.has(ch)) out.push(ch);
  }
  return out;
}

function isShortFormCVorCVC(word: string): boolean {
  const w = sanitizeBasic(word);

  // Allow only simple latin letters plus ë (strict, no punctuation/spaces)
  // This is intentionally tight for v1.
  if (!/^[a-zë]+$/.test(w)) return false;

  // CV (2 chars) or CVC (3 chars) only
  if (!(w.length === 2 || w.length === 3)) return false;

  const chars = [...w];
  const isV = (c: string) => VOWELS.has(c);
  const isC = (c: string) => !VOWELS.has(c);

  // CV
  if (chars.length === 2) return isC(chars[0]) && isV(chars[1]);

  // CVC
  return isC(chars[0]) && isV(chars[1]) && isC(chars[2]);
}

function hasMainVowelO(word: string): boolean {
  const vs = vowelsOf(word);
  // For these short forms, "main vowel" = first vowel.
  return vs.length >= 1 && vs[0] === "o";
}

/**
 * Detects the v1 canonical Mediator Axis Pair:
 * - "po" vs "jo" (order-insensitive)
 */
export function detectMediatorAxisPair(wordA: string, wordB: string): MediatorAxisPair | null {
  const a = sanitizeBasic(wordA);
  const b = sanitizeBasic(wordB);

  // strict short-form gate
  if (!isShortFormCVorCVC(a) || !isShortFormCVorCVC(b)) return null;

  // strict shared field vowel gate (O)
  if (!hasMainVowelO(a) || !hasMainVowelO(b)) return null;

  // strict explicit canonical pair for v1
  const set = new Set([a, b]);
  if (!(set.has("po") && set.has("jo")) || set.size !== 2) return null;

  return {
    id: "N4",
    label: "Mediator Axis Pair",
    sharedVowel: "O",
    a: "po",
    b: "jo",
  };
}
