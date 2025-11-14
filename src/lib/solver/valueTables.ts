
export const VOWELS = ["A","E","I","O","U","Y","Ë"] as const;
export type Vowel = typeof VOWELS[number];

export const VOWEL_VALUE: Record<Vowel, number> = { A:2, E:3, I:5, O:7, U:11, Y:13, "Ë":17 };
export const VOWEL_RING:  Record<Vowel, number> = { A:3, E:2, I:1, O:0, U:1, Y:2, "Ë":3 };
export const VOWEL_LEVEL: Record<Vowel, number> = { A:+1, E:+1, I:+1, O:0, U:-1, Y:-1, "Ë":-1 };

export type CClass =
  | "Glide" | "Liquid" | "Nasal"
  | "NonSibilantFricative" | "SibilantFricative"
  | "Affricate" | "Plosive";

export const ALB_DIGRAPH_CLASS: Record<string, CClass> = {
  ll:"Liquid", rr:"Liquid",
  nj:"Nasal",
  sh:"SibilantFricative", zh:"SibilantFricative",
  dh:"NonSibilantFricative", th:"NonSibilantFricative",
  xh:"Affricate",
  gj:"Plosive",
};

export const ALB_LETTER_CLASS: Record<string, CClass> = {
  // single letters
  ç:"Affricate",
  q:"Plosive", k:"Plosive", g:"Plosive", p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive", c:"Plosive", // c≈/ts/ but we keep Plosive here; move to Affricate if you prefer
  f:"NonSibilantFricative", v:"NonSibilantFricative", h:"NonSibilantFricative",
  s:"SibilantFricative", z:"SibilantFricative", x:"SibilantFricative",
  j:"Glide",
  m:"Nasal", n:"Nasal",
  l:"Liquid", r:"Liquid",
  w:"Glide", // rarely used; harmless
};

export const LAT_DIGRAPH_CLASS: Record<string, CClass> = {
  ch:"Affricate", ts:"Affricate", dz:"Affricate",
  sh:"SibilantFricative", zh:"SibilantFricative",
  th:"NonSibilantFricative", ph:"NonSibilantFricative",
  ck:"Plosive",
};

export const LAT_LETTER_CLASS: Record<string, CClass> = {
  p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive", k:"Plosive", g:"Plosive", q:"Plosive", c:"Plosive",
  f:"NonSibilantFricative", v:"NonSibilantFricative", h:"NonSibilantFricative",
  s:"SibilantFricative", z:"SibilantFricative", x:"SibilantFricative",
  j:"Affricate",
  m:"Nasal", n:"Nasal",
  l:"Liquid", r:"Liquid",
  w:"Glide", y:"Glide",
};
