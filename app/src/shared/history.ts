
// src/shared/history.ts
import type { AnalysisResult_DEPRECATED } from "./engineShape";

export interface HistoryEntry {
  id: string;
  word: string;
  result: AnalysisResult_DEPRECATED;
  createdAt: string; // ISO timestamp
}
