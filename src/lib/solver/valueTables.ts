
import type { Vowel } from "./types";

export const VOWELS = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;

export const VOWEL_VALUE: Record<Vowel, number> = { A: 2, E: 3, I: 5, O: 7, U: 11, Y: 13, "Ë": 17 };
export const VOWEL_RING: Record<Vowel, number> = { A: 3, E: 2, I: 1, O: 0, U: 1, Y: 2, "Ë": 3 };
export const VOWEL_LEVEL: Record<Vowel, number> = { A: +1, E: +1, I: +1, O: 0, U: -1, Y: -1, "Ë": -1 };

// --- Language-Aware Consonant Classification ---

export type CClass =
  | "Glide" | "Liquid" | "Nasal"
  | "NonSibilantFricative" | "SibilantFricative"
  | "Affricate" | "Plosive";

export type LangProfile = {
  id: "albanian" | "latin" | "turkish" | "german" | string;
  detect: (w: string) => boolean;
  DIGRAPH: Record<string, CClass>;
  LETTER: Record<string, CClass>;
};

export function classRange(cls: CClass): [number, number] {
  switch (cls) {
    case "Glide":
    case "Liquid":
    case "Nasal": return [0, 1];
    case "NonSibilantFricative": return [1, 1];
    case "SibilantFricative":
    case "Affricate": return [1, 2];
    case "Plosive": return [2, 3];
  }
}

export const Albanian: LangProfile = {
  id: "albanian",
  detect: (w) => /[ëç]|xh|zh|sh|dh|th|nj|gj|ll|rr|q/i.test(w),
  DIGRAPH: {
    "ll": "Liquid", "rr": "Liquid",
    "nj": "Nasal",
    "sh": "SibilantFricative", "zh": "SibilantFricative",
    "dh": "NonSibilantFricative", "th": "NonSibilantFricative",
    "xh": "Affricate",
    "gj": "Plosive",
  },
  LETTER: {
    c: "Affricate", ç: "Affricate", x: "Affricate",
    q: "Plosive", k: "Plosive", g: "Plosive", p: "Plosive", b: "Plosive", t: "Plosive", d: "Plosive",
    f: "NonSibilantFricative", v: "NonSibilantFricative", h: "NonSibilantFricative",
    s: "SibilantFricative", z: "SibilantFricative",
    j: "Glide",
    m: "Nasal", n: "Nasal",
    l: "Liquid", r: "Liquid",
    w: "Glide",
  },
};

export const Latin: LangProfile = {
  id: "latin",
  detect: () => false, // Fallback
  DIGRAPH: {
    "ch": "Affricate", "ts": "Affricate", "dz": "Affricate",
    "sh": "SibilantFricative", "zh": "SibilantFricative",
    "th": "NonSibilantFricative", "ph": "NonSibilantFricative",
    "ck": "Plosive",
  },
  LETTER: {
    p: "Plosive", b: "Plosive", t: "Plosive", d: "Plosive", k: "Plosive", g: "Plosive", q: "Plosive", c: "Plosive",
    f: "NonSibilantFricative", v: "NonSibilantFricative", h: "NonSibilantFricative",
    s: "SibilantFricative", z: "SibilantFricative", x: "SibilantFricative",
    j: "Affricate",
    m: "Nasal", n: "Nasal",
    l: "Liquid", r: "Liquid",
    w: "Glide", y: "Glide",
  },
};

export const Turkish: LangProfile = {
  id: "turkish",
  detect: (w) => /[çğşıöü]|sch|tsch|ç|ş|c(?!h)|j/i.test(w),
  DIGRAPH: {
    "ch": "Affricate",
    "sch": "SibilantFricative", "tsch": "Affricate",
  },
  LETTER: {
    c: "Affricate",
    ç: "Affricate",
    s: "SibilantFricative", z: "SibilantFricative", ş: "SibilantFricative", j: "SibilantFricative",
    f: "NonSibilantFricative", v: "NonSibilantFricative", h: "NonSibilantFricative",
    p: "Plosive", b: "Plosive", t: "Plosive", d: "Plosive", k: "Plosive", g: "Plosive", q: "Plosive",
    m: "Nasal", n: "Nasal",
    l: "Liquid", r: "Liquid",
    y: "Glide", w: "Glide",
    ğ: "Glide",
    x: "SibilantFricative",
  },
};

export const German: LangProfile = {
  id: "german",
  detect: (w) => /sch|tsch|qu|pf|sp|st|ä|ö|ü|ß/i.test(w),
  DIGRAPH: {
    "sch": "SibilantFricative",
    "tsch": "Affricate",
    "ch": "NonSibilantFricative",
    "qu": "Plosive",
    "ck": "Plosive",
    "pf": "Plosive",
    "ts": "Affricate",
  },
  LETTER: {
    p: "Plosive", b: "Plosive", t: "Plosive", d: "Plosive", k: "Plosive", g: "Plosive", q: "Plosive", c: "Plosive",
    f: "NonSibilantFricative", v: "NonSibilantFricative", h: "NonSibilantFricative",
    s: "SibilantFricative", z: "SibilantFricative", ß: "SibilantFricative", x: "SibilantFricative",
    j: "Affricate",
    m: "Nasal", n: "Nasal",
    l: "Liquid", r: "Liquid",
    w: "Glide", y: "Glide",
  },
};

export const PROFILES: LangProfile[] = [Albanian, Turkish, German, Latin];

export function chooseProfile(word: string, override?: string): LangProfile {
  if (override) {
    const p = PROFILES.find(p => p.id === override);
    if (p) return p;
  }
  return PROFILES.find(p => p.detect(word)) || Latin;
}

function classifyWindow(chars: string, profile: LangProfile): CClass {
  const s = chars.toLowerCase();
  const { DIGRAPH, LETTER } = profile;

  for (let i = 0; i < s.length - 1; i++) {
    const dg = s.slice(i, i + 2);
    if (DIGRAPH[dg as keyof typeof DIGRAPH]) return DIGRAPH[dg as keyof typeof DIGRAPH];
  }
  for (const ch of s) {
    if (/[aeiouyë]/i.test(ch)) continue;
    if (LETTER[ch as keyof typeof LETTER]) return LETTER[ch as keyof typeof LETTER];
  }
  return "NonSibilantFricative";
}


export function extractWindowClasses(
  word: string,
  baseSeq: Vowel[],
  profile: LangProfile,
  toVowel: (ch: string) => Vowel | null
): CClass[] {
  const s = word.normalize("NFC");

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
  return windows.map(chars => classifyWindow(chars, profile));
}

export function computeC(voicePath: Vowel[], consClasses: CClass[], toVowel: (ch: string) => Vowel | null): number {
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
