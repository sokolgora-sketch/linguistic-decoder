import { normalizeIpaV0_1 } from "./ipaNormalize.v0.1";

export type IpaBaseClassV0_1 = "vowel" | "sonorant" | "obstruent" | "other";

export type IpaSegmentV0_1 = {
  raw: string;      // base + combining marks
  base: string;     // first codepoint (non-combining)
  marks: string[];  // following combining marks
  cls: IpaBaseClassV0_1;
};

export const SYLLABIC_MARK_V0_1 = "\u0329"; // ̩

// Core sets (expand only via tests + explicit commit)
const VOWELS = new Set([
  "a","ɑ","ɒ","æ","e","ɛ","ə","ɚ","ɜ","ɝ","i","ɪ","o","ɔ","ø","œ","u","ʊ","ʌ","y",
  "ɨ","ʉ","ɯ","ɶ","ɐ",
]);

const SONORANTS = new Set([
  "m","n","ŋ","ɲ","ɳ","ɴ",
  "l","ɫ","ɬ", // NOTE: ɬ is often fricative; keep under review (tests decide)
  "r","ɹ","ɾ","ɻ","ʀ",
  "j","w","ʋ","ɰ","ɥ",
]);

const OBSTRUENTS = new Set([
  // stops/affricate bases
  "p","b","t","d","ʈ","ɖ","c","ɟ","k","g","q","ɢ","ʔ",
  // fricatives
  "f","v","θ","ð","s","z","ʃ","ʒ","ʂ","ʐ","ç","ʝ","x","ɣ","χ","ʁ","h","ɦ",
]);

function isCombiningMark(ch: string): boolean {
  // unicode marks category
  return /\p{M}/u.test(ch);
}

export function classifyIpaBaseV0_1(base: string): IpaBaseClassV0_1 {
  if (!base) return "other";
  if (VOWELS.has(base)) return "vowel";
  if (SONORANTS.has(base)) return "sonorant";
  if (OBSTRUENTS.has(base)) return "obstruent";
  return "other";
}

/**
 * Deterministic segment tokenizer:
 * groups base char + any following combining marks into a single segment.
 */
export function tokenizeIpaSegmentsV0_1(raw: unknown): Array<{ raw: string; base: string; marks: string[] }> {
  const s = normalizeIpaV0_1(raw);
  const segs: Array<{ raw: string; base: string; marks: string[] }> = [];

  let curBase: string | null = null;
  let curMarks: string[] = [];

  function flush() {
    if (!curBase) return;
    const rawSeg = curBase + curMarks.join("");
    segs.push({ raw: rawSeg, base: curBase, marks: [...curMarks] });
    curBase = null;
    curMarks = [];
  }

  for (const ch of s) {
    if (isCombiningMark(ch)) {
      if (curBase) curMarks.push(ch);
      // if no base, drop stray marks deterministically
      continue;
    }
    // new base => flush previous
    flush();
    curBase = ch;
    curMarks = [];
  }
  flush();

  return segs;
}

export function classifyIpaSegmentsV0_1(raw: unknown): IpaSegmentV0_1[] {
  return tokenizeIpaSegmentsV0_1(raw).map((seg) => ({
    ...seg,
    cls: classifyIpaBaseV0_1(seg.base),
  }));
}
