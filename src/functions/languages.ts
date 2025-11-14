export type CClass =
  | "Glide" | "Liquid" | "Nasal"
  | "NonSibilantFricative" | "SibilantFricative"
  | "Affricate" | "Plosive";

export type LangProfile = {
  id: "albanian" | "latin" | "sanskrit" | "ancient_greek" | "pie" | string;
  detect: (w: string) => boolean;
  DIGRAPH: Record<string, CClass>;
  LETTER: Record<string, CClass>;
  pre?: (s: string) => string;
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
