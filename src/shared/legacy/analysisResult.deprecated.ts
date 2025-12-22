// src/shared/legacy/analysisResult.deprecated.ts
//
// Legacy shape kept ONLY for reading old persisted history entries.
// Do not use in new code. Do not intersect with V1 types.

export type AnalysisResult_DEPRECATED = {
  core: AnalysisCore;
  // NEW: word-level consonant behaviour, shared by all candidates.
  consonants?: {
    field: ConsonantField;
    summary: ConsonantSummary;
  };
  candidates: Candidate[];
  debug?: AnalysisDebug;
  sevenVoices?: SevenVoicesSummary;
  symbolic?: SymbolicLayer;
  symbolicCore?: any; // Changed from SymbolicCoreResult to any
  math7?: Math7Summary;
};
