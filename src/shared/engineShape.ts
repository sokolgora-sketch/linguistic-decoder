
// Canonical shape your UI will use everywhere.
export type Vowel = 'A'|'E'|'I'|'O'|'U'|'Y'|'Ë';

// --- Core Analysis (Layer 1, 2, 3) ---

export type InputContext = {
  raw: string;
  normalized: string;
  alphabet: "latin" | "other";
  languageGuess: string; // "albanian" | "english" | "latin" | "unknown"
  languageConfidence: "low" | "medium" | "high";
  dialectGuess?: string; // "geg" | "tosk" | "unknown"
  mode: "strict" | "explore";
};

export type VoicesProfile = {
  vowelVoices: Vowel[];
  ringPath: number[];
  levelPath: ("high"|"mid"|"low")[];
  dominantVoices: { [voice in Vowel]?: number };
};

export type ConsonantCluster = {
  cluster: string;
  classes: string[];
  orbitSlots: string[];
  harmonyScore: number;
};

export type VoiceHarmony = {
  harmonicSlots: number;
  disharmonicSlots: number;
  harmonyScore: number; // 0–1
};

export type HarmonyProfile = {
  byVoice: { [voice in Vowel]?: VoiceHarmony };
  globalHarmonyScore: number; // 0–1
};

export type ConsonantsProfile = {
  clusters: ConsonantCluster[];
  overallHarmony: HarmonyProfile;
};

export type HeartPath = {
  voiceSequence: Vowel[];
  ringPath: number[];
  tensionLevel: "low" | "medium" | "high";
};

export type HeartPaths = {
  primary: HeartPath;
  frontierCount: number;
};

export type CoreAnalysis = {
  word: string;
  engineVersion: string;
  input: InputContext;
  voices: VoicesProfile;
  consonants: ConsonantsProfile;
  heartPaths: HeartPaths;
};


// --- Candidate (Layer 4, 5) ---

export type Candidate = {
  id: string;
  status: "pass" | "fail" | "experimental";
  family: string;
  language: string;
  form: string;
  functionalStatement: string;
  decomposition: {
    parts: { role: string; form: string; gloss: string }[];
  };
  voiceSequence: Vowel[];
  failReasons?: string[];
};

// --- Debug Info (Optional) ---

export type DebugInfo = {
  rawPhonemes: any[];
  allGeneratedPaths: any[];
  rawCandidates: any[];
  logs: string[];
  solveMs?: number;
  cacheHit?: boolean;
};


// --- Final Engine Contract ---

export type AnalysisResult = {
  core: CoreAnalysis;
  candidates: Candidate[];
  debug?: DebugInfo;
  // Deprecated fields for graceful UI transition.
  // These will be removed once the UI fully adopts the new structure.
  engineVersion?: string;
  word?: string;
  mode?: 'strict' | 'open';
  alphabet?: string;
  primaryPath?: any;
  frontierPaths?: any[];
  windows?: string[];
  windowClasses?: string[];
  signals?: string[];
  solveMs?: number;
  cacheHit?: boolean;
  recomputed?: boolean;
  languageFamilies?: any[];
  edgeWindows?: string[];
};


// --- Type Guards & Normalizers ---

// A placeholder normalizer. In a real scenario, this would be a robust
// function that validates and transforms raw API output into the strict
// AnalysisResult shape. For now, it's a simple type assertion.
export function normalizeEnginePayload(raw: any): AnalysisResult {
  if (!raw || !raw.word || !raw.primaryPath) {
    console.error("Invalid payload for normalization:", raw);
    throw new Error("Normalization failed: payload is missing required fields.");
  }
  // This is a temporary adapter. The goal is for the engine to return
  // the new shape directly. This function will bridge the old UI components
  // to the new data shape.
  const result: AnalysisResult = {
    core: {
      word: raw.word,
      engineVersion: raw.engineVersion,
      input: {
        raw: raw.word,
        normalized: raw.word.toLowerCase(),
        alphabet: "latin",
        languageGuess: raw.alphabet,
        languageConfidence: "medium",
        dialectGuess: raw.languageFamilies?.find((f:any) => f.familyId === 'albanian')?.dialect,
        mode: raw.mode,
      },
      voices: {
        vowelVoices: raw.primaryPath.voicePath,
        ringPath: raw.primaryPath.ringPath,
        levelPath: raw.primaryPath.levelPath.map((l:any) => l === 1 ? 'high' : l === 0 ? 'mid' : 'low'),
        dominantVoices: {}, // requires calculation
      },
      consonants: {
        clusters: (raw.windowClasses || []).map((c:any, i:number) => ({
          cluster: raw.windows?.[i] || '',
          classes: [c],
          orbitSlots: [],
          harmonyScore: 0,
        })),
        overallHarmony: {
          byVoice: {},
          globalHarmonyScore: 0,
        },
      },
      heartPaths: {
        primary: {
          voiceSequence: raw.primaryPath.voicePath,
          ringPath: raw.primaryPath.ringPath,
          tensionLevel: 'low',
        },
        frontierCount: raw.frontierPaths?.length || 0,
      }
    },
    candidates: (raw.languageFamilies || []).map((f:any) => ({
        id: `${f.familyId}_${raw.word}`,
        status: 'pass',
        family: f.familyId,
        language: f.label,
        form: raw.word,
        functionalStatement: f.rationale,
        decomposition: { parts: [] },
        voiceSequence: raw.primaryPath.voicePath,
    })),
    // Pass-through old fields for compatibility
    ...raw,
  };
  return result;
}
