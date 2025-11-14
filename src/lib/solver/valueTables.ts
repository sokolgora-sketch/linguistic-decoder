
import { detectAlphabet } from "./alphabet";
import type { Alphabet } from "./engineConfig";
import type { Vowel } from "./types";

export const VOWELS = ["A","E","I","O","U","Y","Ë"] as const;

export const VOWEL_VALUE: Record<Vowel, number> = { A:2, E:3, I:5, O:7, U:11, Y:13, "Ë":17 };
export const VOWEL_RING:  Record<Vowel, number> = { A:3, E:2, I:1, O:0, U:1, Y:2, "Ë":3 };
export const VOWEL_LEVEL: Record<Vowel, number> = { A:+1, E:+1, I:+1, O:0, U:-1, Y:-1, "Ë":-1 };

export type CClass =
  | "Glide" | "Liquid" | "Nasal"
  | "NonSibilantFricative" | "SibilantFricative"
  | "Affricate" | "Plosive";

export function classRange(cls: CClass): [number, number] {
  switch (cls) {
    case "Glide":
    case "Liquid":
    case "Nasal": return [0,1];
    case "NonSibilantFricative": return [1,1];
    case "SibilantFricative":
    case "Affricate": return [1,2];
    case "Plosive": return [2,3];
  }
}

export const ALB_DIGRAPH_CLASS = {
  ll:"Liquid", rr:"Liquid",
  nj:"Nasal",
  sh:"SibilantFricative", zh:"SibilantFricative",
  dh:"NonSibilantFricative", th:"NonSibilantFricative",
  xh:"Affricate",
  gj:"Plosive",
} as const;

export const ALB_LETTER_CLASS = {
  c:"Affricate", ç:"Affricate", x:"Affricate",
  q:"Plosive", k:"Plosive", g:"Plosive", p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive",
  f:"NonSibilantFricative", v:"NonSibilantFricative", h:"NonSibilantFricative",
  s:"SibilantFricative", z:"SibilantFricative",
  j:"Glide",
  m:"Nasal", n:"Nasal",
  l:"Liquid", r:"Liquid",
  w:"Glide", // rare but harmless
} as const;

export const LAT_DIGRAPH_CLASS = {
  ch:"Affricate", ts:"Affricate", dz:"Affricate",
  sh:"SibilantFricative", zh:"SibilantFricative",
  th:"NonSibilantFricative", ph:"NonSibilantFricative",
  ck:"Plosive",
} as const;

export const LAT_LETTER_CLASS = {
  p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive", k:"Plosive", g:"Plosive", q:"Plosive", c:"Plosive",
  f:"NonSibilantFricative", v:"NonSibilantFricative", h:"NonSibilantFricative",
  s:"SibilantFricative", z:"SibilantFricative", x:"SibilantFricative",
  j:"Affricate",
  m:"Nasal", n:"Nasal",
  l:"Liquid", r:"Liquid",
  w:"Glide", y:"Glide",
} as const;


function classifyWindow(chars: string, alphabet: "albanian"|"latin"): CClass {
  const s = chars.toLowerCase();
  const DG = alphabet === "albanian" ? ALB_DIGRAPH_CLASS : LAT_DIGRAPH_CLASS;
  const LT = alphabet === "albanian" ? ALB_LETTER_CLASS  : LAT_LETTER_CLASS;

  // digraph pass
  for (let i = 0; i < s.length - 1; i++) {
    const dg = s.slice(i, i + 2);
    if (DG[dg as keyof typeof DG]) return DG[dg as keyof typeof DG];
  }
  // first consonant fallback
  for (const ch of s) {
    if (/[aeiouyë]/i.test(ch)) continue;
    if (LT[ch as keyof typeof LT]) return LT[ch as keyof typeof LT];
  }
  return "NonSibilantFricative";
}


// This is defined here but needs `toVowel` which is in `index.ts`
// It will be passed as an argument to avoid circular dependencies.
export function extractWindowClasses(
  word: string,
  baseSeq: Vowel[],
  alphabetPref: Alphabet,
  toVowel: (ch: string) => Vowel | null
): CClass[] {
  const alphabet = alphabetPref === "auto" ? detectAlphabet(word) : alphabetPref;
  const s = word.normalize("NFC");

  // indices of base vowels in raw string
  const pos: number[] = [];
  let vi = 0;
  for (let i = 0; i < s.length && vi < baseSeq.length; i++) {
    const ch = s[i];
    const v = toVowel(ch);
    if (!v) continue;
    if (v === baseSeq[vi]) { pos.push(i); vi++; }
  }

  const windows: string[] = [];
  for (let k = 0; k < pos.length - 1; k++) {
    windows.push(s.slice(pos[k] + 1, pos[k + 1]));
  }
  return windows.map(chars => classifyWindow(chars, alphabet));
}

export function computeC(voicePath: Vowel[], consClasses: CClass[]): number {
  let c = 0;
  const hops = Math.max(0, voicePath.length - 1);
  for (let i = 0; i < hops; i++) {
    const cls = i < consClasses.length ? consClasses[i] : "Glide";
    const d = Math.abs(VOWEL_RING[voicePath[i + 1]] - VOWEL_RING[voicePath[i]]);
    const [lo, hi] = classRange(cls);
    if (d < lo) c += (lo - d);
    else if (d > hi) c += (d - hi);
  }
  return c;
}
