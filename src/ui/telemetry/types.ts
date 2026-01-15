export type Mode = "strict" | "open";

/**
 * UI contract for vowel chips. Keep this as the only allowed vowel set.
 * (If engine emits lowercase or other symbols, normalize in adapter.)
 */
export type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

/**
 * Why something is missing.
 * - "none": engine emitted an explicit empty/none (i.e., present but empty list)
 * - "not_emitted": engine did not emit the field
 * - "malformed": engine emitted the field but with an unexpected type/shape
 * - "unknown": fallback when we cannot categorize
 */
export type MissingState = "none" | "not_emitted" | "malformed" | "unknown";

/**
 * Generic "present or missing" wrapper used to avoid silent emptiness.
 */
export type PresentOrMissing<T> =
  | { kind: "present"; value: T }
  | { kind: "missing"; missing: MissingState; note?: string };

export interface TelemetryReadout {
  word: string;
  normalizedWord: PresentOrMissing<string>;
  mode: PresentOrMissing<Mode>;
  strictInput: PresentOrMissing<boolean>;
  engineVersion: PresentOrMissing<string>;
  alphabet: PresentOrMissing<string>;
  createdAt: PresentOrMissing<string>;
  principlesPath: PresentOrMissing<string[]>;

  voicePath: PresentOrMissing<Vowel[]>;
  voicePathSurface?: PresentOrMissing<Vowel[]>;
  voicePathFunctional?: PresentOrMissing<Vowel[]>;
  voicePathDelta: "MATCH" | "DIVERGE" | "NOT_EMITTED";
  status: "detected" | "none" | "error";

  counts: {
    candidates: number;
    ops: PresentOrMissing<number>;
    notes: PresentOrMissing<number>;
    signals: PresentOrMissing<number>;
    rejections: PresentOrMissing<number>;
  };
}

export interface EvidenceLedger {
  normalizationSteps: PresentOrMissing<string[]>;
  ops: PresentOrMissing<string[]>;
  notes: PresentOrMissing<string[]>;
  signals: PresentOrMissing<string[]>;
}

export interface DecompositionItemVM {
  part: string;
  role: PresentOrMissing<string>;
  notes: PresentOrMissing<string>;
}

export interface CandidateRowVM {
  index: number;
  id: string;

  language: PresentOrMissing<string>;
  form: PresentOrMissing<string>;

  functionalStatement: PresentOrMissing<string>;
  vowelPath: PresentOrMissing<Vowel[]>;

  decomposition: PresentOrMissing<DecompositionItemVM[]>;
  ops: PresentOrMissing<string[]>;
  notes: PresentOrMissing<string[]>;
  signals: PresentOrMissing<string[]>;

  raw: unknown;
}

export interface MathTelemetryVM {
  L: PresentOrMissing<number>;
  verdict: PresentOrMissing<string>;
  OI: PresentOrMissing<number>;

  light: PresentOrMissing<number>;
  shadow: PresentOrMissing<number>;
  bridge: PresentOrMissing<number>;

  ringSummary: PresentOrMissing<Record<string, unknown>>;
  levelSummary: PresentOrMissing<Record<string, unknown>>;

  raw: unknown;
}

export interface RejectionItemVM {
  id: string;
  reason: PresentOrMissing<string>;
  raw: unknown;
}

export interface RejectionLogVM {
  items: PresentOrMissing<RejectionItemVM[]>;
}

export interface OriginClaimGatesVM {
  active: boolean;
  flag: "ocg";
  candidateCount: number;
  reasonCounts: Record<string, number>;
}

export interface TelemetryViewModel {
  readout: TelemetryReadout;
  evidence: EvidenceLedger;
  candidates: CandidateRowVM[];
  math: PresentOrMissing<MathTelemetryVM>;
  rejections: RejectionLogVM;
  originClaimGates: OriginClaimGatesVM;
  raw: unknown;
}
