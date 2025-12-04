// src/shared/resultShape.v1.ts

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

export interface AnalyzeWordResultV1 {
  word: string;
  sanitized: string;
  primaryPath: SevenVoicesPath;
  frontier: FrontierCandidate[];

  languageFamilies?: LanguageFamilySummary[];

  meta?: {
    engineVersion: string;
    createdAt: string;
    mode: {
      mode: "strict" | "explore";
      alphabet: string;
    };
  };

  symbolic?: {
    label?: string;
    notes?: string[];
  };
}
