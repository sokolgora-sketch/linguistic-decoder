// EVALS-3 — Eval Report Contract v0.1
// Deterministic scorer output. UI must render from this contract (not raw run).

import type { BucketId } from "./spec.v0.1";

export type ScoreKeyV0_1 = "aperturePrimary" | "aperturePresenceMean";

export type BucketReportV0_1 = {
  bucket: BucketId;
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

export type TaskDiagnosticsV0_1 = {
  missingBuckets: BucketId[];
  extraBuckets: BucketId[];

  // token-level counts (best-effort; scorer may skip expensive lists in v0.1 UI)
  emptyTokenCount: number;
  whitespaceTokenCount: number;
  noVowelTokenCount: number;
  totalInvalidTokenCount: number;

  notes: string[];
};

export type EvalTaskReportV0_1 = {
  taskId: string;
  kind: "byo" | "derived";
  title: string;
  languageHint: string;

  targetBuckets: BucketId[];
  nPerBucket: number;

  buckets: BucketReportV0_1[];

  slope_aperturePrimary: SlopeReportV0_1 | null;
  slope_aperturePresenceMean: SlopeReportV0_1 | null;

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
};
