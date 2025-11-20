// src/shared/engineShape.ts

// Canonical shape your UI will use everywhere.
export type Vowel = 'A' | 'E' | 'I' | 'O' | 'U' | 'Y' | 'Ë';

export type EnginePath = {
  voicePath: Vowel[];
  ringPath: number[];
  levelPath: number[];
  ops: string[];
  checksums: { V: number; E: number; C: number };
  kept: number;
};

export type LanguageFamily = {
    familyId: string;
    label: string;
    confidence: number;
    rationale: string;
    forms: any[];
    signals: string[];
    dialect?: 'geg' | 'tosk';
};

// This is what the app & JSON export will see.
export type EnginePayload = {
  engineVersion: string;
  word: string;
  mode: 'strict'|'open';
  alphabet: string;
  primaryPath: EnginePath;
  frontierPaths: EnginePath[];
  windows: string[];
  windowClasses: string[];
  signals: string[];
  solveMs?: number;
  cacheHit?: boolean;
  recomputed?: boolean;
  languageFamilies?: LanguageFamily[];
  edgeWindows?: string[];
};


// A placeholder normalizer. In a real scenario, this would be a robust
// function that validates and transforms raw API output into the strict
// AnalysisResult shape. For now, it's a simple type assertion.
export function normalizeEnginePayload(raw: any): EnginePayload {
  if (!raw || !raw.word || !raw.primaryPath) {
    console.error("Invalid payload for normalization:", raw);
    throw new Error("Normalization failed: payload is missing required fields.");
  }
  
  const payload: EnginePayload = {
    engineVersion: raw.engineVersion ?? 'unknown',
    word: raw.word,
    mode: raw.mode ?? 'strict',
    alphabet: raw.alphabet ?? 'auto',
    primaryPath: {
      voicePath: raw.primaryPath.voicePath ?? [],
      ringPath: raw.primaryPath.ringPath ?? [],
      levelPath: raw.primaryPath.levelPath ?? [],
      ops: raw.primaryPath.ops ?? [],
      checksums: raw.primaryPath.checksums ?? { V:0, E:0, C:0 },
      kept: raw.primaryPath.kept ?? 0,
    },
    frontierPaths: raw.frontierPaths ?? [],
    windows: raw.windows ?? [],
    windowClasses: raw.windowClasses ?? [],
    signals: raw.signals ?? [],
    solveMs: raw.solveMs,
    cacheHit: raw.cacheHit,
    recomputed: raw.recomputed,
    languageFamilies: raw.languageFamilies ?? [],
    edgeWindows: raw.edgeWindows ?? [],
  };

  return payload;
}

// High-level consonant behaviour classes used for the 42-slot field.
export type ConsonantArchetype =
  | 'Plosive'
  | 'Affricate'
  | 'SibilantFric'
  | 'NonSibilantFric'
  | 'Nasal'
  | 'LiquidGlide'; // NOTE: V1: combines Liquids (l,r) and Glides (w,y); may split later.

export type ConsonantSlot = {
  vowel: Vowel;
  archetype: ConsonantArchetype;
  smooth: number; // hops where this archetype supported the ring change
  spiky: number;  // hops where this archetype fought the ring change
};

export type ConsonantField = {
  smoothHits: number;
  spikyHits: number;
  slots: ConsonantSlot[];
  // Optional coarse flag: true when consonant behaviour is globally "spiky".
  hasConflict?: boolean;
};

export type ConsonantSummary = {
  smoothRatio: number;                // between 0 and 1, 0 if no hits
  dominantArchetypes: ConsonantArchetype[]; // top 1–3 archetypes by (smooth - spiky)
  notes?: string[];
};

// High-level semantic expectations about consonant behaviour for a candidate origin.
export type ConsonantProfile =
  | 'cut'        // split, break, attack
  | 'carry'      // hold, bear, remain
  | 'bind'       // join, tie, unify
  | 'flow'       // move, wave, spread
  | 'speak'      // voice, shout, declare
  | 'build'      // make, form, construct
  | 'none';      // neutral / not specified

// Coarse verdict on how well an origin matches a particular axis.
export type OriginAxisStatus = 'pass' | 'weak' | 'unknown';

export type CandidateOriginAxes = {
  // Seven-Voices path + principles consistency.
  principles: OriginAxisStatus;
  // Word-sum / morphology story: does it actually explain function?
  morphology: OriginAxisStatus;
  // Consonant behaviour vs. semantic profile (cut/build/etc.).
  consonants: OriginAxisStatus;
};

// New types for morphology matrix
export type MorphemeRole = 'root' | 'prefix' | 'suffix';

export interface Morpheme {
  form: string;          // "stud", "dam", "dëm", "un", "ify"
  role: MorphemeRole;    // 'root' | 'prefix' | 'suffix'
  gloss?: string;        // short meaning: "measure", "cut", "negation"
}

export interface WordSum {
  parts: string[];       // ["stud", "y"] → "study"
  result: string;        // "study"
  gloss?: string;        // "focused effort to know"
}

export interface MorphologyMatrix {
  pivot: string;         // the core form: "stud", "dam", "mode"
  meaning: string;       // short description: "measure, manner"
  morphemes: Morpheme[];
  wordSums: WordSum[];
}

export type SymbolicAxis =
  | 'love'
  | 'religion'
  | 'mathematics'
  | 'law'
  | 'power'
  | 'creation'
  | 'unknown';

export interface SymbolicTag {
  axis: SymbolicAxis;
  source: 'sevenVoices' | 'zheji' | 'hybrid';
  note: string;
}

export type Candidate = {
  id: string;
  language: string;
  family: string;
  form: string;

  decomposition: {
    parts: {
      role: 'action' | 'instrument' | 'unit';
      form: string;
      gloss: string;
    }[];
    functionalStatement: string;
  };

  voices: {
    voiceSequence: Vowel[];
    ringPath: number[];
    dominantVoices: Record<string, number>;
  };

  ruleChecks: {
    soundPathOk: boolean;
    functionalDecompOk: boolean;
    sevenVoicesAlignmentOk: boolean;
    consonantMeaningOk: boolean;
    harmonyOk: boolean;
  };

  principleSignals: {
    truthOk: boolean;
    expansionOk: boolean;
ᱣ