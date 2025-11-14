import { VOWELS, VOWEL_RING } from "./sevenVoicesCore";
import type { Vowel } from "./sevenVoicesCore";
import { chooseProfile, classRange } from "./languages";
import type { LangProfile, CClass } from "./languages";

export function toVowel(ch: string): Vowel | null {
  const u = ch.toUpperCase();
  return u === "Ë" ? "Ë" : VOWELS.includes(u as any) ? (u as Vowel) : null;
}

export function isVowelChar(ch: string) {
  const c = ch.normalize("NFC");
  return /[aeiouy]/i.test(c) || c === "ë" || c === "Ë";
}

export function extractBase(word: string): Vowel[] {
  const out: Vowel[] = [];
  const s = word.normalize("NFC").toLowerCase();
  for (let i = 0; i < s.length; i++) {
    if (!isVowelChar(s[i])) continue;

    // special case for 'ie' -> I
    if (i < s.length - 1 && s[i] === "i" && s[i + 1] === "e") {
      if (out.length === 0 || out[out.length - 1] !== "I") {
        out.push("I");
      }
      i++; // skip 'e'
      continue;
    }

    const v = toVowel(s[i])!;
    if (out.length && out[out.length - 1] === v) continue; // collapseDupes
    out.push(v);
  }
  return out;
}

export function normalizeTerminalY(seq: Vowel[], rawWord: string): Vowel[] {
  if (
    seq.length &&
    seq[seq.length - 1] === "Y" &&
    rawWord.toLowerCase().endsWith("y")
  ) {
    const out = seq.slice();
    out[out.length - 1] = "I";
    return out;
  }
  return seq;
}


export function computeC(voicePath: Vowel[], consClasses: CClass[]): number {
  let c = 0;
  const hops = Math.max(0, voicePath.length - 1);
  for (let i = 0; i < hops; i++) {
    const cls = i < consClasses.length ? consClasses[i] : "Glide";
    const d = Math.abs(VOWEL_RING[voicePath[i + 1]] - VOWEL_RING[voicePath[i]]);
    const [lo, hi] = classRange(cls);
    if (d < lo) c += lo - d;
    else if (d > hi) c += d - hi;
  }
  return c;
}

/**
 * Extract the raw substrings between the normalized base vowels.
 * Pure read: does NOT mutate state, does NOT depend on scoring.
 */
function extractWindows(word: string, baseSeq: Vowel[]): string[] {
  const s = word.normalize("NFC");
  // find indices of base vowels in raw string (first match per base slot)
  const pos: number[] = [];
  let vi = 0;
  for (let i = 0; i < s.length && vi < baseSeq.length; i++) {
    const v = toVowel(s[i]);
    if (!v) continue;
    if (v === baseSeq[vi]) {
      pos.push(i);
      vi++;
    }
  }

  const windows: string[] = [];
  for (let k = 0; k < pos.length - 1; k++) {
    windows.push(s.slice(pos[k] + 1, pos[k + 1]));
  }
  return windows;
}

function classifyWindow(chars: string, P: LangProfile): CClass {
  let s = chars.toLowerCase();
  if (P.pre) s = P.pre(s);

  for (let i = 0; i < s.length - 1; i++) {
    const dg = s.slice(i, i + 2);
    if (P.DIGRAPH[dg as keyof typeof P.DIGRAPH])
      return P.DIGRAPH[dg as keyof typeof P.DIGRAPH];
  }
  for (const ch of s) {
    if (/[aeiouyë]/i.test(ch)) continue;
    if (P.LETTER[ch as keyof typeof P.LETTER])
      return P.LETTER[ch as keyof typeof P.LETTER];
  }
  return "NonSibilantFricative";
}


/**
 * Optional debug export (handy for UI): returns both windows and classes.
 */
export function readWindowsDebug(
  word: string,
  baseSeq: Vowel[],
  profile: LangProfile
): { windows: string[]; classes: CClass[] } {
  const windows = extractWindows(word, baseSeq);
  const classes = windows.map((w) => classifyWindow(w, profile));
  return { windows, classes };
}
