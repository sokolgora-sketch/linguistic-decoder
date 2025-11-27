// src/engine/zeroAnalyzeWord.ts
// Public entry for the ZË-RO 7-vowel prototype: word string -> simple analysis.

import { cleanWord } from "./wordCleaner";
import {
  analyzeWord as analyzeStruct,
  type WordAnalysisResult,
} from "./wordAnalyzer";

/**
 * ZË-RO entry point.
 * - Small, deterministic shape: { word, candidates[] }.
 * - Independent from the big legacy AnalyzeWordResult used by tests.
 */
export function zeroAnalyzeWord(
  word: string,
  languageHint?: string
): WordAnalysisResult {
  const cleaned = cleanWord(word, languageHint);
  return analyzeStruct(cleaned);
}
