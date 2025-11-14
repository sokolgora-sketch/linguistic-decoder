
export const VOWELS = ["A","E","I","O","U","Y","Ë"] as const;
export type Vowel = typeof VOWELS[number];

export const VOWEL_VALUE: Record<Vowel, number> = { A:2, E:3, I:5, O:7, U:11, Y:13, "Ë":17 };
export const VOWEL_RING:  Record<Vowel, number> = { A:3, E:2, I:1, O:0, U:1, Y:2, "Ë":3 };
export const VOWEL_LEVEL: Record<Vowel, number> = { A:+1, E:+1, I:+1, O:0, U:-1, Y:-1, "Ë":-1 };

export type CClass =
  | "Glide" | "Liquid" | "Nasal"
  | "NonSibilantFricative" | "SibilantFricative"
  | "Affricate" | "Plosive";

// Expected |Δring| per class
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
