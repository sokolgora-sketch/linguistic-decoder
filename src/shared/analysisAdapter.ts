// src/shared/analysisAdapter.ts

import type {
  EnginePayload,
  Vowel,
  LanguageFamily,
  EnginePath,
  AnalysisResult,
  AnalysisCore,
  AnalysisCoreInput,
  AnalysisCoreVoices,
  AnalysisConsonants,
  AnalysisHeartPaths,
  Candidate,
  TensionLevel,
} from './engineShape';

// --- Helper Functions ---

function normalizeWord(word: string): string {
  return word.toLowerCase().trim();
}

function mapMode(mode: 'strict' | 'open'): 'strict' | 'explore' {
  return mode === 'open' ? 'explore' : 'strict';
}

function guessLanguageFromFamilies(families?: LanguageFamily[]): {
  languageGuess: string;
  confidence: 'low' | 'medium' | 'high';
  dialectGuess?: string;
} {
  if (!families || families.length === 0) {
    return { languageGuess: 'unknown', confidence: 'low', dialectGuess: 'unknown' };
  }

  const topFamily = families.reduce(
    (max, fam) => (fam.confidence > max.confidence ? fam : max),
    families[0]
  );

  let confidence: 'low' | 'medium' | 'high';
  if (topFamily.confidence > 0.66) {
    confidence = 'high';
  } else if (topFamily.confidence > 0.33) {
    confidence = 'medium';
  } else {
    confidence = 'low';
  }

  return {
    languageGuess: topFamily.familyId,
    confidence: confidence,
    dialectGuess: topFamily.dialect ?? 'unknown',
  };
}

function countVoices(voices: Vowel[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const voice of voices) {
    counts[voice] = (counts[voice] || 0) + 1;
  }
  return counts;
}

function mapLevels(levelPath: number[]): ('high' | 'mid' | 'low')[] {
    // Current UI seems to use 1=High, 0=Mid, -1=Low
    // This adapter will follow the new logic specified.
    return levelPath.map(n => {
        if (n >= 1) return 'high'; // Map 1 to high as per prompt clarification
        if (n === 0) return 'mid';
        return 'low'; // Map -1 to low
    });
}

function estimateTension(primaryPath: EnginePath): TensionLevel {
  const ops = primaryPath.ops ?? [];
  const nonKeepOps = ops.filter(op => op !== 'keep').length; // Assuming 'keep' is the no-op string

  if (nonKeepOps <= 1) {
    return 'low';
  }
  if (nonKeepOps <= 3) {
    return 'medium';
  }
  return 'high';
}
