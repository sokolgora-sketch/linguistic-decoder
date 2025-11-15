
// src/engine/manifest.ts
export type V = "A"|"E"|"I"|"O"|"U"|"Y"|"Ë";

export type EngineManifest = {
  name: string;
  version: string;
  ringIndex: Record<V, 0|1|2|3>;   // O=0; I/U=1; E/Y=2; A/Ë=3
  levelIndex: Record<V, -1|0|1>;   // high=+1 (A,E,I), mid=0 (O), low=-1 (U,Y,Ë)
  opCost: { sub:number; del:number; ins:number };
  edgeWeight: number;
  consonant: {
    classes: Record<string, {
      examples: string[];
      preferredDelta: [number,number];
      align: V;
    }>;
    inventory: string[];
  };
};

export const defaultManifest: EngineManifest = {
  name: "SevenVoices Core",
  version: "2025-11-15-core-1",
  ringIndex: { O:0, I:1, U:1, E:2, Y:2, A:3, "Ë":3 },
  levelIndex: { A:1, E:1, I:1, O:0, U:-1, Y:-1, "Ë":-1 },
  opCost: { sub:1, del:3, ins:2 },
  edgeWeight: 0.25,
  consonant: {
    classes: {
      Plosive:   { examples:["p","b","t","d","k","g","q","c","ck","gj"], preferredDelta:[2,3], align:"A" },
      Affricate: { examples:["ch","j","dz","ts","dʒ","tʃ","ç","xh"],     preferredDelta:[1,2], align:"I" },
      SibilantFricative: { examples:["s","z","sh","zh","x"],             preferredDelta:[1,2], align:"Y" },
      NonSibilantFricative: { examples:["f","v","h","th","ph","dh"],     preferredDelta:[1,1], align:"E" },
      Nasal:     { examples:["m","n","nj"],                              preferredDelta:[0,1], align:"Ë" },
      Liquid:    { examples:["l","r","ll","rr"],                         preferredDelta:[0,1], align:"O" },
      Glide:     { examples:["w","y"],                                   preferredDelta:[0,1], align:"U" },
    },
    inventory: [
      "p","b","t","d","k","g","q","c","ck","gj","ch","j","dz","ts","dʒ","tʃ","ç","xh",
      "s","z","sh","zh","x","f","v","h","th","ph","dh","m","n","nj","l","r","ll","rr","w","y"
    ]
  }
};

// Simple registry if you add future manifests
const registry: Record<string, EngineManifest> = {
  [defaultManifest.version]: defaultManifest,
};

export function getManifest(version?: string) {
  if (!version) return defaultManifest;
  return registry[version] ?? defaultManifest;
}
