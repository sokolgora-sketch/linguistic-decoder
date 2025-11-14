
export const VOWELS = ["A","E","I","O","U","Y","Ë"] as const;
export type Vowel = typeof VOWELS[number];

export const VOWEL_VALUE: Record<Vowel, number> = { A:2, E:3, I:5, O:7, U:11, Y:13, "Ë":17 };
export const VOWEL_RING:  Record<Vowel, number> = { A:3, E:2, I:1, O:0, U:1, Y:2, "Ë":3 };
export const VOWEL_LEVEL: Record<Vowel, number> = { A:+1, E:+1, I:+1, O:0, U:-1, Y:-1, "Ë":-1 };

export const DIGRAPHS = ["sh","zh","th","dh","ch","xh","gj","nj","ll","rr"];

export const STABILIZER_S: Record<string, number> = {
  p:2,b:2,t:2,d:2,k:2,g:2,q:2,c:2,
  f:1,v:1,s:1,z:1,sh:1,zh:1,h:1,x:1,th:1,dh:1,
  ch:1,xh:1,j:1,gj:1,
  m:0,n:0,nj:0,ng:0,
  l:0,ll:0,r:0,rr:0,
  w:0,y:0
};

export type CClass = "Plosive"|"Fricative"|"Affricate"|"Nasal"|"Liquid"|"Glide";

export const MAP_CLASS: Record<string,CClass> = {
  p:"Plosive", b:"Plosive", t:"Plosive", d:"Plosive", k:"Plosive", g:"Plosive", q:"Plosive", c:"Plosive",
  f:"Fricative", v:"Fricative", s:"Fricative", z:"Fricative", h:"Fricative", x:"Fricative",
  j:"Affricate",
  m:"Nasal", n:"Nasal",
  l:"Liquid", r:"Liquid",
  w:"Glide", y:"Glide",
};
