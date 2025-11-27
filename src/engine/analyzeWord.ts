// src/engine/analyzeWord.ts
// Public entry for the 7-vowel engine: word string -> structured analysis.

import { cleanWord } from "./wordCleaner";
import { analyzeWord as analyzeStruct } from "./wordAnalyzer";
import type { WordAnalysisResult } from "./wordAnalyzer";

export function analyzeWord(
  word: string,
  languageHint?: string
): WordAnalysisResult {
  const cleaned = cleanWord(word, languageHint);
  return analyzeStruct(cleaned);
}
