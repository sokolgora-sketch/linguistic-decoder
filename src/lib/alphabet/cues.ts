
export type Family = "albanian"|"latin"|"sanskrit"|"ancient_greek"|"pie";

export type FamilyCues = {
  // hard signals
  script?: RegExp;        // e.g., Greek, Devanagari
  diacritics?: RegExp;    // language-typical diacritics in Latin script
  // soft signals
  digraphs?: string[];    // bh, dh, gj, qu, etc.
  morphemes?: string[];   // common affixes/roots
  // weights (tune once)
  weights?: { script?:number; diacritics?:number; digraph?:number; morpheme?:number; vp?:number };
};

export const CUES: Record<Family, FamilyCues> = {
  albanian: {
    diacritics: /[ëç]/i,
    digraphs: ["gj","q","xh","ll","rr","nj","zh","sh","dh","th"],
    morphemes: ["vet","vetë","vend","vendos","shqip","bashk","komb","-im","-tar","-ues","-shëm","-tari","-imi"],
    weights: { diacritics:3, digraph:2, morpheme:1, vp:0.5 }
  },
  latin: {
    // ASCII stays possible; Latin diacritics common in Romance
    diacritics: /[àèìòùáéíóúăĕĭŏŭâêîôûç]/i,
    digraphs: ["qu","ph","ti","ci"],            // ph, qu, ti(V), ci(V)
    morphemes: ["tion","tio","ct","ment","ous","tione","able","ible"],
    weights: { diacritics:2, digraph:1, morpheme:1, vp:0.5 }
  },
  sanskrit: {
    script: /[\u0900-\u097F]/,                  // Devanagari
    diacritics: /[āīūṛṝḷḹṃḥñṅṇśṣṭḍ]/i,         // IAST
    digraphs: ["bh","dh","gh","kh","ch","jh","ṭh","ḍh"],
    morphemes: ["dharma","karma","yoga","mantra","ātma","puruṣa"],
    weights: { script:4, diacritics:3, digraph:1, morpheme:1, vp:0.5 }
  },
  ancient_greek: {
    script: /[\u0370-\u03FF]/,                  // Greek
    diacritics: /[ΆΈΉΊΌΎΏάέήίόύώϊϋΐΰ]/,        // tonos/dialytika
    digraphs: ["ph","ch","th","ps","kh"],
    morphemes: ["logos","-logy","-polis","-phobia","-phile","-graph"],
    weights: { script:4, diacritics:2, digraph:1, morpheme:1, vp:0.5 }
  },
  pie: {
    // Not a script; only a tiny nudge by A/E/O distribution from voicePath
    weights: { vp:0.3 }
  }
};
