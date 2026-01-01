export type Math7Summary = any;

// Build-safe stubs for legacy references (deprecated file).
// Keep legacy compiling; do not depend on these in runtime code.
export type ConsonantField = any;
export type ConsonantSummary = any;
export type Candidate = any;

export type AnalysisDebug = any;
export type SevenVoicesSummary = any;
export type SymbolicLayer = any;
export type SymbolicCoreResult = any;
export type CandidateDebug = any;

// Build-safe stub: legacy file kept only for reference.
// If this type is needed again, re-wire it to current engine/result shapes.
export type AnalysisCore = any;

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
