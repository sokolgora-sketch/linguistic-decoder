// src/shared/resultsUI.ts

import type { EngineMetaSummary } from "./engineMetaSummary";

export interface PrimaryPathSummary {
  voicePath: string;
  levelPath: string;
  ringPath: string;
}

export interface FrontierCandidateSummary {
  id: string;
  voicePath: string;
  levelPath: string;
  ringPath: string;
}

// Placeholder - to be defined more fully later
export interface CanonLanguageFamilySummary {
  language: string;
  form: string;
  gloss: string;
}

// Placeholder - to be defined more fully later
export interface HistoryItem {
  word: string;
  voicePath: string;
  levelPath: string;
  ringPath: string;
}

export interface WordMatrixRow {
  language: string;
  form: string;
  voicePath: string;
  notes?: string;
}

export interface WordMatrixUI {
  word: string;
  primary: {
    label: string;      // "Primary path"
    voicePath: string;  // "U → I"
    notes?: string;
  };
  canon: WordMatrixRow[];
  deepRoot?: {
    label: string;      // "Proto-root"
    notes?: string;
  };
}

export interface SymbolicSummaryUI {
  label?: string;
  notes?: string[];
}

/**
 * Defines the clean, UI-first result shape that the
 * /api/analyze endpoint should return.
 */
export interface AnalyzeWordResultUI {
  word: string;
  sanitized: string;
  primaryPath: PrimaryPathSummary | null;
  frontier: FrontierCandidateSummary[];
  languageFamilies: CanonLanguageFamilySummary[];
  history: HistoryItem[];

  // NEW – summary used by the Engine meta card
  meta?: EngineMetaSummary;

  // NEW
  symbolic?: SymbolicSummaryUI | null;

  // Debug / legacy fields used only by the main page
  raw?: unknown;

  // Original engine meta object (still present in the response)
  engineMeta?: {
    version?: string | null;
    created?: string | null;
  };

  // Top-level mode / alphabet (for the Engine meta card + debug)
  mode?: string;
  alphabet?: string;
  wordMatrix?: any | null;
}
