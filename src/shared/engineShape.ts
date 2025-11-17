
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
