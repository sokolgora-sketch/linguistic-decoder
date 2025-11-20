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

// Candidate-level origin entry (per language/form)
export type Candidate = {
  id: string;
  language: string;            // e.g. "latin", "albanian"
  family: string;              // same as language family for now
  form: string;                // origin form (we can use the input word as placeholder)

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

  status: 'pass' | 'experimental';
  confidenceTag?: 'solid' | 'speculative';
};

export type AnalysisDebug = {
  rawEnginePayload?: EnginePayload;
  signals?: string[];
  edgeWindows?: string[];
};

export type AnalysisResult = {
  core: AnalysisCore;
  candidates: Candidate[];
  debug?: AnalysisDebug;
};
