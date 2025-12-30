// src/shared/resultShape.v1.ts
//
// Back-compat shim + shared UI path interfaces.
// Canonical V1 result type lives in ./analysisResult.v1.ts

export type { AnalyzeWordResultV1 } from "./analysisResult.v1";

import type { DeepRootOutputV1 } from "./deepRoot.output.v1";
import type { WordMatrixV1 } from "./wordMatrix.v1";

// Core path types used by the Heart + Frontier UI

export interface SevenVoicesPath {
  /** e.g. "U → I", "A → E" */
  voicePath: string;
  /** e.g. "low → high", "high → high" */
  levelPath: string;
  /** e.g. "1 → 1", "3 → 2" */
  ringPath: string;
}

export interface FrontierCandidate extends SevenVoicesPath {
  /** e.g. "alt-1", "alt-2" */
  id: string;
}

export interface LanguageFamilySummary {
  language: string;
  form: string;
  gloss: string;
  passes: boolean;
  experimental: boolean;
  speculative: boolean;
  voicePath: string;
  levelPath: string;
  ringPath: string;
  morphologyMatrix?: {
    pivot: string;
    source: string;
  };
  symbolic?: {
    tag: string;
    note: string;
    axis?: string;
  }[];
}

// NEW – summary used by the Engine meta card
export type EngineMetaSummary = {
  version: string;
  created: string;
};

// NOTE: DeepRootSummaryV1 / WordMatrixV1 are still imported above because
// other files may import those types from resultShape.v1.ts historically.
// We are not exporting them here unless needed.
void (0 as unknown as DeepRootSummaryV1);
void (0 as unknown as WordMatrixV1);
