

import type { Vowel } from "./types";
import { toVowel } from "./index";

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
  id: "albanian" | "latin" | "sanskrit" | "ancient_greek" | "pie" | string;
  detect: (w: string) => boolean;         // heuristic
  DIGRAPH: Record<string, CClass>;        // matched first
  LETTER:  Record<string, CClass>;         // fallback
  pre?: (s: string) => string;             // optional window preproc (e.g., transliterate)
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

export const Sanskrit: LangProfile = {
  id: "sanskrit",
  // IAST markers or common ASCII surrogates
  detect: (w) => /[āīūṛṝḷḹṅñṇṭḍśṣḥṃṁ]|kh|gh|ch|jh|ṭ|ḍ|ś|ṣ/i.test(w),
  DIGRAPH: {
    // aspirated plosives → Plosive
    kh:"Plosive", gh:"Plosive", th:"Plosive", dh:"Plosive", ph:"Plosive", bh:"Plosive",
    // palatal affricates
    ch:"Affricate", jh:"Affricate",
    // clusters often seen
    ks:"SibilantFricative", kṣ:"SibilantFricative", // ASCII & IAST
  },
  LETTER: {
    // plosives (incl. retroflex)
    k:"Plosive", g:"Plosive", t:"Plosive", d:"Plosive", p:"Plosive", b:"Plosive",
    ṭ:"Plosive", ḍ:"Plosive", q:"Plosive",
    // affricates
    c:"Affricate", j:"Affricate",
    // sibilants
    s:"SibilantFricative", ś:"SibilantFricative", ṣ:"SibilantFricative", z:"SibilantFricative",
    // non-sibilant fricatives/approximants
    f:"NonSibilantFricative", v:"NonSibilantFricative", h:"NonSibilantFricative",
    // sonorants
    m:"Nasal", n:"Nasal", ñ:"Nasal", ṅ:"Nasal", ṇ:"Nasal",
    l:"Liquid", r:"Liquid",
    y:"Glide", w:"Glide",
  },
};

function greekPre(s: string): string {
  // Map Greek letters → ASCII tokens (minimal, deterministic)
  return s
    .replace(/[άὰᾶἀἁἄἅἂἃα]/g,"a")
    .replace(/[έὲἐἑἔἕἒἓε]/g,"e")
    .replace(/[ίὶῖἰἱἴἵἲἳι]/g,"i")
    .replace(/[όὸοὀὁὄὅὂὃ]/g,"o")
    .replace(/[ύὺῦυὐὑὔὕὒὓ]/g,"y")
    .replace(/[ώὼωὠὡὤὥὢὣ]/g,"o")

    .replace(/[β]/g,"b").replace(/[γ]/g,"g").replace(/[δ]/g,"d")
    .replace(/[ζ]/g,"z").replace(/[θ]/g,"th")
    .replace(/[κ]/g,"k").replace(/[λ]/g,"l").replace(/[μ]/g,"m").replace(/[ν]/g,"n")
    .replace(/[ξ]/g,"ks").replace(/[π]/g,"p").replace(/[ρ]/g,"r")
    .replace(/[σς]/g,"s").replace(/[τ]/g,"t")
    .replace(/[φ]/g,"ph")   // classical: aspirated Plosive
    .replace(/[χ]/g,"kh")   // aspirated Plosive
    .replace(/[ψ]/g,"ps")
    ;
}

export const AncientGreek: LangProfile = {
  id: "ancient_greek",
  detect: (w) => /[ἀ-῾φθχψξβγδζκλμνπρστσς]/i.test(w) || /(ph|th|kh|ps|ks)\b/i.test(w),
  pre: greekPre,
  DIGRAPH: {
    ph:"Plosive", th:"Plosive", kh:"Plosive",
    ps:"Plosive", ks:"SibilantFricative",   // treat ks as sibilant cluster
    ch:"NonSibilantFricative",              // for latinized 'ch' variants if present
  },
  LETTER: {
    p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive", k:"Plosive", g:"Plosive",
    z:"Affricate",                           // ζ ~ [dz]/[zd] → affricate-ish
    s:"SibilantFricative", x:"SibilantFricative",
    f:"NonSibilantFricative", v:"NonSibilantFricative", h:"NonSibilantFricative",
    m:"Nasal", n:"Nasal",
    l:"Liquid", r:"Liquid",
    w:"Glide", y:"Glide",
  },
};

function piePre(s: string): string {
  return s
    .toLowerCase()
    .replace(/\*/g,"")           // strip asterisk
    .replace(/[h₁₁]/g,"h")       // h₁ → h
    .replace(/[h₂₂]/g,"h")
    .replace(/[h₃₃]/g,"h")
    .normalize("NFD").replace(/[\u0300-\u036f]/g,""); // fold diacritics (ḱ→k, ǵ→g)
}

export const PIE: LangProfile = {
  id: "pie",
  detect: (w) => /\*|h[₁₂₃]|[ḱǵ]|gʷ|kʷ|bh|dh|gh/i.test(w),
  pre: piePre,
  DIGRAPH: {
    // labiovelars & aspirates → Plosive
    "kw":"Plosive", "gw":"Plosive", "gwh":"Plosive",
    "kh":"Plosive", "gh":"Plosive", "th":"Plosive", "dh":"Plosive", "ph":"Plosive", "bh":"Plosive",
    // clusters
    "ks":"SibilantFricative",
  },
  LETTER: {
    // plosives (incl palatovelars after diacritic fold)
    p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive", k:"Plosive", g:"Plosive", q:"Plosive", c:"Plosive",
    // sibilant
    s:"SibilantFricative", z:"SibilantFricative", x:"SibilantFricative",
    // non-sibilant / laryngeals
    h:"NonSibilantFricative", f:"NonSibilantFricative", v:"NonSibilantFricative",
    // sonorants
    m:"Nasal", n:"Nasal",
    l:"Liquid", r:"Liquid",
    y:"Glide", w:"Glide",
    j:"Glide",
  },
};


export const PROFILES: LangProfile[] = [PIE, Sanskrit, AncientGreek, Albanian, Turkish, German, Latin];

export function chooseProfile(word: string, overrideId?: string): LangProfile {
  if (overrideId) {
    const p = PROFILES.find(p => p.id === overrideId);
    if (p) return p;
  }
  return PROFILES.find(p => p.detect(word)) || Latin;
}

export function classifyWindow(chars: string, P: LangProfile): CClass {
    let s = chars.toLowerCase();
    if (P.pre) s = P.pre(s);

    for (let i = 0; i < s.length - 1; i++) {
        const dg = s.slice(i, i + 2);
        if (P.DIGRAPH[dg as keyof typeof P.DIGRAPH]) return P.DIGRAPH[dg as keyof typeof P.DIGRAPH];
    }
    for (const ch of s) {
        if (/[aeiouyë]/i.test(ch)) continue;
        if (P.LETTER[ch as keyof typeof P.LETTER]) return P.LETTER[ch as keyof typeof P.LETTER];
    }
    return "NonSibilantFricative";
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

/**
 * Extract the raw substrings between the normalized base vowels.
 * Pure read: does NOT mutate state, does NOT depend on scoring.
 */
export function extractWindows(word: string, baseSeq: Vowel[]): string[] {
  const s = word.normalize("NFC");
  // find indices of base vowels in raw string (first match per base slot)
  const pos: number[] = [];
  let vi = 0;
  for (let i = 0; i < s.length && vi < baseSeq.length; i++) {
    // toVowel is already in your core; we just need a truthy check here
    const v = toVowel ? toVowel(s[i]) : null;
    if (!v) continue;
    if (v === baseSeq[vi]) { pos.push(i); vi++; }
  }

  const windows: string[] = [];
  for (let k = 0; k < pos.length - 1; k++) {
    windows.push(s.slice(pos[k] + 1, pos[k + 1]));
  }
  return windows;
}

/**
 * Thin helper used by tests: map windows → 7-class consonant labels,
 * using a chosen language profile. No scoring, deterministic.
 */
export function extractWindowClassesWithProfile(
  word: string,
  baseSeq: Vowel[],
  profile: LangProfile
): CClass[] {
  const windows = extractWindows(word, baseSeq);
  // classifyWindow is your existing function that uses DIGRAPH/LETTER maps on the profile
  return windows.map(w => classifyWindow(w, profile));
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
  const classes = windows.map(w => classifyWindow(w, profile));
  return { windows, classes };
}
