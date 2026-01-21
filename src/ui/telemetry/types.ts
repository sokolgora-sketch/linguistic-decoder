export type Mode = "strict" | "open";

import type { RootMapV1 } from "@/shared/deepRoot.rootMap.v1";
import type { DeepRootHeartGateV01 } from "@/shared/deepRootHeartGate.v0.1";

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

export type RootMapVM = RootMapV1;

export type ResonanceBucket = "source" | "boundary" | "manifest" | "mixed" | "none";

export type ResonanceReadoutV1 = {
  vowels: string[]; // keep loose; adapter guarantees only Seven-Vowels symbols when present
  bucketCounts: { source: number; boundary: number; manifest: number };
  dominantBucket: ResonanceBucket;
  signature: string;
  polaritySymbol: string;
  colorBand: string[];
  dominantColor: string;
  transitions: string[];
  notes: string[];
};

export type ResonanceProfileV1VM = {
  version: string;
  surface: ResonanceReadoutV1;
  normalized: ResonanceReadoutV1;
};


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
  voicePathDelta: "MATCH" | "SHIFT" | "DIVERGE" | "NOT_EMITTED";
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
  deepRootHeartGate: PresentOrMissing<DeepRootHeartGateV01>;

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
    originClaim: PresentOrMissing<unknown>;
  rootMap: PresentOrMissing<RootMapVM>;
  resonanceProfileV1: PresentOrMissing<ResonanceProfileV1VM>;
  raw: unknown;
}
