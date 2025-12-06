// src/shared/resultsUI.ts

import type { EngineMetaSummaryUI } from "@/lib/engineMetaSummary";

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

  // NEW – structured summary used by the Engine meta card
  engineMeta: EngineMetaSummaryUI;

  // Debug / legacy fields used only by the main page
  raw?: unknown;

  // Original engine meta object (still present in the response)
  meta?: {
    version?: string | null;
    createdAt?: string | null;
  };

  // Top-level mode / alphabet (for the Engine meta card + debug)
  mode?: string;
  alphabet?: string;
  wordMatrix?: any;
  symbolic?: any;
}
