// src/shared/resultsUI.ts

import type { EngineMetaSummary } from "@/lib/engineMetaSummary";
import type { WordMatrix } from "./WordMatrix";

// The shape of the data returned by /api/analyze, tailored for the UI.

export type PrimaryPathSummary = {
  voicePath: string;
  levelPath: string;
  ringPath: string;
};

export type FrontierCandidateSummary = {
  id: string;
  voicePath: string;
  levelPath: string;
  ringPath: string;
};

export interface AnalyzeWordResultUI {
  word: string;
  mode: "strict" | "explore";
  alphabet: "auto" | "latin" | "albanian";
  primaryPath: PrimaryPathSummary | null;
  frontier: FrontierCandidateSummary[];
  engineMeta: EngineMetaSummary;
  wordMatrix?: WordMatrix | null; // From src/components/WordMatrix.tsx
  raw: any; // The full, raw analysis payload for debugging.
}

// The shape of an item stored in the session history.
export type HistoryItem = {
  word: string;
  voicePath: string;
  levelPath: string;
  ringPath: string;
};
