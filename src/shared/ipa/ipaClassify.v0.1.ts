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
  "i","y","ɨ","ʉ","ɯ","u",
  "ɪ","ʏ","ʊ",
  "e","ø","ɘ","ɵ","ɤ","o",
  "ɛ","œ","ɜ","ɞ","ʌ","ɔ",
  "æ","ɐ",
  "a","ɶ","ɑ","ɒ",
  "ə","ɚ","ɝ",
]);

const SONORANTS = new Set([
  "m","n","ŋ","ɲ","ɳ","ɴ",
  "l","ɫ",
  "r","ɹ","ɾ","ɻ","ʀ",
  "j","w","ʋ","ɰ","ɥ",
]);

const OBSTRUENTS = new Set([
  // stops / affricate bases
  "p","b","t","d","ʈ","ɖ","c","ɟ","k","g","q","ɢ","ʔ",
  // fricatives (includes ɬ as voiceless lateral fricative)
  "f","v","θ","ð","s","z","ʃ","ʒ","ʂ","ʐ","ç","ʝ","x","ɣ","χ","ʁ","h","ɦ","ɬ",
]);

function isCombiningMark(ch: string): boolean {
  return /\p{M}/u.test(ch);
}

export function classifyIpaBaseV0_1(base: string): IpaBaseClassV0_1 {
  if (!base) return "other";
  const b = base.normalize("NFC");
  if (VOWELS.has(b)) return "vowel";
  if (SONORANTS.has(b)) return "sonorant";
  if (OBSTRUENTS.has(b)) return "obstruent";
  return "other";
}

/**
 * Deterministic segment tokenizer:
 * groups base char + any following combining marks into a single segment.
 */
export function tokenizeIpaSegmentsV0_1(
  raw: unknown
): Array<{ raw: string; base: string; marks: string[] }> {
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
      // drop stray marks deterministically
      continue;
    }
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
