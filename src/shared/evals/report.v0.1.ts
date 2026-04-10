// EVALS-3 — Eval Report Contract v0.1
// Deterministic scorer output. UI must render from this contract (not raw run).

import type { BucketId, EvalBucketKeyV0_1 } from "./spec.v0.1";

export type ScoreKeyV0_1 = "aperturePrimary" | "aperturePresenceMean";

export type BucketReportV0_1 = {
  bucket: EvalBucketKeyV0_1;
  expectedN: number;
  providedN: number;
  validN: number;
  invalidN: number;
  duplicateN: number;

  mean_aperturePrimary: number; // NaN if no valid
  mean_aperturePresenceMean: number; // NaN if no valid
};

export type SlopeReportV0_1 = {
  bucketOrder: BucketId[];
  // Means aligned to bucketOrder
  means: number[];

  pearson_r: number;
  spearman_rho: number;
  p_pearson: number;
  p_spearman: number;

  iters: number;
  seed: number;
};

export type IntermediateVerdictV0_1 =
  | "INTERMEDIATE"
  | "COLLAPSED_LOW"
  | "COLLAPSED_HIGH"
  | "EXCEEDS_LOW";

export type IntermediateOrdinalPermutationReportV0_1 = {
  observed_order: boolean;
  p_value: number;
  iters: number;
  seed: number;
};

export type IntermediateTaskReportV0_1 = {
  scoreKey: "aperturePresenceMean";
  vowelUnderTest: string;
  anchorLow: BucketId;
  anchorHigh: BucketId;

  mean_anchor_low: number;
  mean_x_vowel: number;
  mean_anchor_high: number;

  gap_low: number;
  gap_high: number;
  normalizedPosition: number;

  verdict: IntermediateVerdictV0_1;
  ordinalPermutation: IntermediateOrdinalPermutationReportV0_1;
};

export type TaskDiagnosticsV0_1 = {
  missingBuckets: EvalBucketKeyV0_1[];
  extraBuckets: EvalBucketKeyV0_1[];

  // token-level counts (best-effort; scorer may skip expensive lists in v0.1 UI)
  emptyTokenCount: number;
  whitespaceTokenCount: number;
  noVowelTokenCount: number;
  totalInvalidTokenCount: number;

  notes: string[];
};

export type EvalControlTaskHealthV0_1 = {
  taskId: string;
  status: "clean" | "fail" | "missing";
  p_spearman: number | null;
  p_pearson: number | null;
  threshold: number;
};

export type EvalControlHealthStatusV0_1 =
  | "controlClean"
  | "controlWarn"
  | "controlFail";

export type EvalControlHealthV0_1 = {
  status: EvalControlHealthStatusV0_1;
  reason: string;
  threshold: number;
  failingCount: number;
  missingCount: number;
  tasks: EvalControlTaskHealthV0_1[];
};

export type EvalTaskReportV0_1 = {
  taskId: string;
  kind: "byo" | "derived";
  title: string;
  languageHint: string;

  targetBuckets: EvalBucketKeyV0_1[];
  nPerBucket: number;

  buckets: BucketReportV0_1[];

  slope_aperturePrimary: SlopeReportV0_1 | null;
  slope_aperturePresenceMean: SlopeReportV0_1 | null;

  intermediate_aperturePresenceMean?: IntermediateTaskReportV0_1 | null;

  diagnostics: TaskDiagnosticsV0_1;
};

export type EvalReportBundleV0_1 = {
  evalReportVersion: "evalReport.v0.1";
  evalSpecVersion: "evalSpec.v0.1";
  specId: "public-grounding-probe.v0.1";

  runId: string;
  meta?: {
    provider?: string;
    model?: string;
    label?: string;
    sourceEngineId?: string;
    sourceEngineVersion?: string;
    sourceEngineBuild?: string;
  };

  tasks: EvalTaskReportV0_1[];
  controlHealth: EvalControlHealthV0_1;
};
