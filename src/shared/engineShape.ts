
// Canonical shape your UI will use everywhere.
export type Vowel = 'A'|'E'|'I'|'O'|'U'|'Y'|'Ë';

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


// --- New analysis schema (on top of EnginePayload) ---

export type TensionLevel = 'low' | 'medium' | 'high';

export type AnalysisCoreInput = {
  raw: string;
  normalized: string;
  alphabet: string;
  languageGuess: string; // "albanian" | "english" | "latin" | "unknown" | etc.
  languageConfidence: 'low' | 'medium' | 'high';
  dialectGuess?: string; // e.g. "geg" | "tosk" | "unknown"
  mode: 'strict' | 'explore';
};

export type AnalysisCoreVoices = {
  vowelVoices: Vowel[];
  ringPath: number[];
  levelPath: ('high' | 'mid' | 'low')[];
  dominantVoices: Record<string, number>;
};

export type AnalysisConsonantCluster = {
  cluster: string;
  classes: string[];
  orbitSlots: string[];     // e.g. ["A1","A3"] once 42-grid is implemented
  harmonyScore: number;     // 0–1, placeholder for now
};

export type AnalysisConsonants = {
  clusters: AnalysisConsonantCluster[];
  overallHarmony: {
    byVoice: Record<string, {
      harmonicSlots: number;
      disharmonicSlots: number;
      harmonyScore: number; // 0–1
    }>;
    globalHarmonyScore: number; // 0–1
  };
};

export type AnalysisHeartPaths = {
  primary: {
    voiceSequence: Vowel[];
    ringPath: number[];
    tensionLevel: TensionLevel;
  };
  frontierCount: number;
};

export type AnalysisCore = {
  word: string;
  engineVersion: string;
  input: AnalysisCoreInput;
  voices: AnalysisCoreVoices;
  consonants: AnalysisConsonants;
  heartPaths: AnalysisHeartPaths;
};

export type MorphologyEvidence = {
  base: string;
  affixes: string[];
  wordSums: string[];
  notes?: string[];
};

// Candidate-level origin entry (per language/form)
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
    insightOk: boolean;
    balanceOk: boolean;
    unityOk: boolean;
    networkIntegrityOk: boolean;
    evolutionOk: boolean;
    notes?: string[];
  };

  morphology?: MorphologyEvidence;
  fitTag?: 'strong' | 'medium' | 'weak';
  status: 'pass' | 'fail' | 'experimental' | 'deprecated';
  confidenceTag: 'solid' | 'speculative';
};

export type AnalysisDebug = {
  rawEnginePayload?: EnginePayload;
};

export type AnalysisResult = {
  core: AnalysisCore;
  candidates: Candidate[];
  debug?: AnalysisDebug;
};
