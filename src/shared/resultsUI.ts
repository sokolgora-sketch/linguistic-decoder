// src/shared/resultsUI.ts

import type { EngineMetaSummary } from "@/lib/engineMetaSummary";
import type { HeartInstrumentV1 } from "@/v1/heartInstrument.v1";

export interface EngineMetaRaw {
  engineName?: string;
  versionLine?: string;
  modeLabel?: string;
  alphabetLabel?: string;
  notes?: string;
  engineVersion?: string;
  mode?: string;
  alphabet?: string;
  engineLabel?: string;
  build?: string;
  rawVersion?: string;
}

export interface PrimaryPathSummary {
  voicePath: string[];
  levelPath: string;
  ringPath: number[];
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
  createdAt?: string | null;
}

/**
 * Defines the clean, UI-first result shape that the
 * /api/analyze-v1 endpoint should return.
 */
export interface CandidateUI {
  id: string;
  language: string;
  form: string;
  functionalStatement?: string;
  vowelPath?: string;
  decomposition?: string[];
  gloss?: string;
  status?: "pass" | "fail" | "unknown";
  confidenceTag?: string;
  fitTag?: string;
  sourceKind?: string;
}

export interface AnalyzeWordResultUI {
  word: string;
  engineVersion: string;
  candidates: CandidateUI[];
  sanitized: string;
  primaryPath: PrimaryPathSummary | null;
  frontier: FrontierCandidateSummary[];
  languageFamilies: EngineLanguageFamily[];
  history: HistoryItem[];

  // NEW – structured summary used by the Engine meta card
  engineMeta: EngineMetaRaw;

  heartInstrumentV1: HeartInstrumentV1;

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
  symbolic?: {
    label?: string;
    notes?: (string | null)[];
    summary?: string;
  };
  /** DeepRoot (public, JSON-safe). hypotheses-first. */
  resonanceProfileV1?: unknown;
  deepRoot?: any;

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
  analysis?: AnalyzeWordResultUI | null,
): SymbolicSummary | null {
  const symbolic = analysis?.symbolic;

  if (!symbolic || !Array.isArray(symbolic.notes)) {
    return null;
  }

  const processedNotes = symbolic.notes
    .map((note) => (typeof note === "string" ? note.trim() : ""))
    .filter((note) => note.length > 0);

  const uniqueNotes = processedNotes.filter(
    (note, index) => processedNotes.indexOf(note) === index,
  );

  if (uniqueNotes.length === 0) {
    return null;
  }

  return {
    label: symbolic.label || "Symbolic reading (experimental)",
    notes: uniqueNotes.slice(0, 5),
  };
}
