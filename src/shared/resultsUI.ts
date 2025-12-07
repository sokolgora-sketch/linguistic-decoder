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

export interface EngineLanguageFamily {
  language?: string;
  form?: string;
  passes: boolean;
  experimental?: boolean;
  speculative?: boolean;
  morphologyMatrix?: {
    pivot?: string;
  };
  symbolic?: {
    tag: string;
  }[];
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
  languageFamilies: EngineLanguageFamily[];
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

export interface LanguageFamilyView {
  language: string;
  form: string;
  pivot: string;
  status: "core" | "experimental" | "speculative" | "rejected";
  tags: string[];
}

export function buildLanguageFamiliesView(
  analysis: AnalyzeWordResultUI | null | undefined
): LanguageFamilyView[] {
  if (!analysis?.languageFamilies) return [];
  return analysis.languageFamilies.map((fam) => {
    const pivot = fam.morphologyMatrix?.pivot ?? "";
    const status: "core" | "experimental" | "speculative" | "rejected" =
      !fam.passes
        ? "rejected"
        : fam.experimental
        ? "experimental"
        : fam.speculative
        ? "speculative"
        : "core";

    const tags = (fam.symbolic ?? []).map((s) => s.tag).filter(Boolean);

    return {
      language: fam.language ?? "",
      form: fam.form ?? "",
      pivot,
      status,
      tags,
    };
  });
}

export interface SymbolicSummary {
  label: string;
  notes: string[];
}

export function buildSymbolicSummary(
  analysis?: AnalyzeWordResultUI | null
): SymbolicSummary | null {
  if (!analysis?.symbolic?.notes) {
    return null;
  }

  const uniqueNotes = Array.from(new Set(analysis.symbolic.notes || []))
    .map((note: any) => (typeof note === "string" ? note.trim() : ""))
    .filter(Boolean)
    .slice(0, 5);

  if (uniqueNotes.length === 0) {
    return null;
  }

  return {
    label:
      analysis.symbolic.label || "Symbolic reading (experimental)",
    notes: uniqueNotes,
  };
}
