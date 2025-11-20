
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
import { CANON_CANDIDATES } from './canonCandidates';

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
  return levelPath.map(n => {
    if (n >= 1) return 'high';
    if (n === 0) return 'mid';
    return 'low';
  });
}

function estimateTension(primaryPath: EnginePath): TensionLevel {
  const ops = primaryPath.ops ?? [];
  const nonKeepOps = ops.filter(op => op !== 'keep').length;

  if (nonKeepOps <= 1) {
    return 'low';
  }
  if (nonKeepOps <= 3) {
    return 'medium';
  }
  return 'high';
}

export function enginePayloadToAnalysisResult(payload: EnginePayload): AnalysisResult {
  const normalized = normalizeWord(payload.word);

  const lg = guessLanguageFromFamilies(payload.languageFamilies);
  const inputCore: AnalysisCoreInput = {
    raw: payload.word,
    normalized,
    alphabet: payload.alphabet,
    languageGuess: lg.languageGuess,
    languageConfidence: lg.confidence,
    dialectGuess: lg.dialectGuess,
    mode: mapMode(payload.mode)
  };

  const primary = payload.primaryPath;
  const levelPath = mapLevels(primary.levelPath ?? []);
  const voicesCore: AnalysisCoreVoices = {
    vowelVoices: primary.voicePath,
    ringPath: primary.ringPath,
    levelPath,
    dominantVoices: countVoices(primary.voicePath)
  };

  const clusters = (payload.windows || []).map((w, idx) => ({
    cluster: w,
    classes: [payload.windowClasses?.[idx] ?? 'unknown'],
    orbitSlots: [],
    harmonyScore: 0.5
  }));
  const consonantsCore: AnalysisConsonants = {
    clusters,
    overallHarmony: { byVoice: {}, globalHarmonyScore: 0.5 }
  };

  const heartPathsCore: AnalysisHeartPaths = {
    primary: {
      voiceSequence: primary.voicePath,
      ringPath: primary.ringPath,
      tensionLevel: estimateTension(primary)
    },
    frontierCount: payload.frontierPaths?.length ?? 0
  };

  const core: AnalysisCore = {
    word: payload.word,
    engineVersion: payload.engineVersion,
    input: inputCore,
    voices: voicesCore,
    consonants: consonantsCore,
    heartPaths: heartPathsCore
  };

  let candidates: Candidate[];

  const normalizedWord = normalized;

  const canon = CANON_CANDIDATES[normalizedWord];
  if (canon && canon.length > 0) {
    candidates = canon;
  } else {
    candidates = (payload.languageFamilies ?? []).map((lf, idx) => ({
      id: `family_${lf.familyId}_${idx}`,
      language: lf.familyId,
      family: lf.familyId,
      form: payload.word,
      decomposition: {
        parts: [],
        functionalStatement: lf.rationale || ''
      },
      voices: {
        voiceSequence: primary.voicePath,
        ringPath: primary.ringPath,
        dominantVoices: countVoices(primary.voicePath)
      },
      ruleChecks: {
        soundPathOk: true, functionalDecompOk: false, sevenVoicesAlignmentOk: true,
        consonantMeaningOk: true, harmonyOk: true,
      },
      principleSignals: {
        truthOk: true, expansionOk: true, insightOk: true, balanceOk: true,
        unityOk: true, networkIntegrityOk: true, evolutionOk: true,
        notes: ['Placeholder candidate generated from languageFamilies; no real origin decomposition yet.'],
      },
      status: 'experimental',
      confidenceTag: 'speculative'
    }));
  }

  const debug = {
    rawEnginePayload: payload,
  };

  return { core, candidates, debug };
}
