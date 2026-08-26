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

export type SoundRootsWarningVM = {
  code: string;
  domain: string;
};

export type SoundRootsMatchVM = {
  domain: string;
  root?: string;
  carrier?: string;
  gloss?: string;
  note?: string;
};

export type SoundRootsVM = {
  matches: SoundRootsMatchVM[];
  domains: string[];
  claimedDomains: string[];
  missingDomains: string[];
  warnings: SoundRootsWarningVM[];
};

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



export type SevenPrinciplesSpectrumSectionVM = {
  vowels: Vowel[];
  indices1: number[];   // 1..7
  ringIndex: number[];  // 0..3 (heart rings)
  colors: string[];
  notes: string[];
  crossesCenter?: boolean; // includes O(4) in 1..7 indexing
  endsOnE?: boolean;       // ends on E (index1=2)
  endsOnË?: boolean;      // ends on Ë (index1=7)
  drift?: "mostly_increasing" | "mostly_decreasing" | "mixed" | "static";
};

export type SevenPrinciplesSpectrumVM = {
  surface: PresentOrMissing<SevenPrinciplesSpectrumSectionVM>;
  functional: PresentOrMissing<SevenPrinciplesSpectrumSectionVM>;
  delta?: {
    same: boolean;
    surface?: string;
    functional?: string;
  };
};

export type PhoneticIpaV0_1VM = {
  ipa: string;
  voices: Vowel[];
  unmapped: string[];
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

    phoneticIpaV0_1: PresentOrMissing<PhoneticIpaV0_1VM>;

voicePath: PresentOrMissing<Vowel[]>;
  voicePathSurface?: PresentOrMissing<Vowel[]>;
  voicePathFunctional?: PresentOrMissing<Vowel[]>;
  voicePathDelta: "MATCH" | "SHIFT" | "DIVERGE" | "NOT_EMITTED";
    sevenPrinciplesSpectrum?: SevenPrinciplesSpectrumVM;
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

export interface FunctionalCandidateComponentVM {
  embryo: string;
  language: PresentOrMissing<string>;
  plainMeaning: PresentOrMissing<string>;
  evidenceState: PresentOrMissing<string>;
}

export interface CandidateRowVM {
  index: number;
  id: string;

  language: PresentOrMissing<string>;
  form: PresentOrMissing<string>;

  // v0.3 honest-provenance: SEED | LLM_PROPOSED | DATASET | USER_ADDED, etc.
  // Surfaced from candidateRecord.source.kind. Blueprint section 0: "no single
  // winner" — provenance must be visible, not implied.
  sourceKind: PresentOrMissing<string>;

  // Embryo-first fields are optional because legacy payloads may not emit them.
  // When present, only contractAdapter may lift them from raw analysis data.
  embryo?: PresentOrMissing<string>;
  plainStandaloneGloss?: PresentOrMissing<string>;
  claimType?: PresentOrMissing<string>;
  validationOutcome?: PresentOrMissing<string>;
  rankGroup?: PresentOrMissing<string>;
  claimBoundary?: PresentOrMissing<string>;
  userDecisionPosture?: PresentOrMissing<string>;

  // Logic-first structural-hypothesis truth fields.
  // These remain candidate presentation metadata only; they do not
  // promote structural output into reviewed or production truth.
  discoveryStatus?: PresentOrMissing<string>;
  independentStandaloneMeaning?: PresentOrMissing<string | null>;
  functionalSupportStatus?: PresentOrMissing<string>;
  historicalOriginClaim?: PresentOrMissing<string>;
  candidateTruthClaim?: PresentOrMissing<string>;

  // Structured multi-embryo presentation data.
  // Lifted only by contractAdapter from emitted candidate segmentation.
  functionalComponents?:
    PresentOrMissing<FunctionalCandidateComponentVM[]>;

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

export type AnalysisStatusCodeV0_1 =
  | "reviewed_functional_evidence"
  | "candidate_only"
  | "structural_unreviewed"
  | "null_no_supported_candidate";

export type AnalysisStatusClaimBoundaryV0_1VM = {
  historicalOriginClaim: "not_claimed";
  historicalTransmissionClaim: "not_claimed";
  winnerClaim: "not_claimed";
  languageSuperiorityClaim: "not_claimed";
  linguisticOwnershipClaim: "not_claimed";
  candidateTruthClaim: "not_claimed";
  structuralOutputIsCandidateTruth: false;
  nullIsValid: true;
};

export type AnalysisStatusV0_1VM = {
  schemaVersion: "open-instrument.analysis-status.v0_1";
  status: AnalysisStatusCodeV0_1;
  summary: string;
  reviewedOperators: string[];
  candidateOnlyOperators: string[];
  structuralTokens: string[];
  claimBoundary: AnalysisStatusClaimBoundaryV0_1VM;
  userDecisionPosture: "user_decides";
};
export interface TelemetryViewModel {
  readout: TelemetryReadout;
  evidence: EvidenceLedger;
  candidates: CandidateRowVM[];
  math: PresentOrMissing<MathTelemetryVM>;
  rejections: RejectionLogVM;
  originClaimGates: OriginClaimGatesVM;
    originClaim: PresentOrMissing<unknown>;
  rootMap: PresentOrMissing<RootMapVM>;
  soundRoots: PresentOrMissing<SoundRootsVM>;
  resonanceProfileV1: PresentOrMissing<ResonanceProfileV1VM>;
  raw: unknown;

  analysisStatusV0_1?: PresentOrMissing<AnalysisStatusV0_1VM>;
}
