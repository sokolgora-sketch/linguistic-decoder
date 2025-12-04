// src/shared/resultShape.v1.ts
import type { DeepRootSummaryV1 } from "./deepRoot.v1";
import type { WordMatrixV1 } from "./wordMatrix.v1";
import type { AnalysisResult_DEPRECATED } from "./engineShape";

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

export type AnalyzeWordResultV1 = AnalysisResult_DEPRECATED & {
    deepRoot?: DeepRootSummaryV1;
    wordMatrix?: WordMatrixV1;
    primaryPath: any;
    frontier?: any;
    languageFamilies?: any;
    symbolic?: any;
    word?: any;
    meta?: any;
    sanitized: string;
  };
  
