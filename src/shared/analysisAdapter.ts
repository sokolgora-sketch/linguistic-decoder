
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
  ConsonantProfile,
  SymbolicLayer,
} from './engineShape';
import { CANON_CANDIDATES } from './canonCandidates';
import { buildConsonantField } from './consonantField';
import { getVoiceMeta, mapPathToPrinciples } from './sevenVoices';
import { analyzeWord } from '@/engine/analyzeWord';

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

function buildSymbolicLayer(
  normalizedWord: string,
): SymbolicLayer | undefined {
  const notes: string[] = [];

  if (normalizedWord === 'study') {
    notes.push("Seven-Voices path U → I (Unity → Insight) fits a movement from shared field into focused inner knowing.");
    notes.push("Latin studium: stud + ium → state of focused effort; matches the idea of 'inner, deliberate effort'.");
    notes.push("Albanian s'tu-di-m: what is not yours → know → make it yours; mirrors the act of drawing the unknown into the self.");
  } else if (normalizedWord === 'damage') {
    notes.push("Seven-Voices path A → E (Action → Expansion) for damage fits an act that opens into a harmed / reduced state.");
    notes.push("Latin damnum: dam + num → harmed unit / state; symbolic reading: 'cut / harm' crystallised as a fixed condition.");
    notes.push("Albanian dëm / dëmtim: harm + act of causing; emphasises the doing of harm as a process, not just a static state.");
  }

  if (notes.length > 0) {
    return {
      label: 'Zheji-inspired symbolic reading (experimental)',
      notes: notes,
    };
  }

  return undefined;
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

  const { field: consonantField, summary: consonantSummary } =
    buildConsonantField(payload);

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
  
  const sevenVoices = mapPathToPrinciples(primary.voicePath);

  const result: AnalysisResult = {
    core,
    consonants: {
      field: consonantField,
      summary: consonantSummary,
    },
    candidates,
    debug,
    sevenVoices,
    symbolic: buildSymbolicLayer(normalizedWord),
  };

  return result;
}

export function analysisResultToEnginePayload(result: AnalysisResult): EnginePayload {
  // Guard against calls with incomplete/mock data that lacks a `core` object
  if (!result.core) {
    return {
      engineVersion: 'mock-or-error',
      word: result.word || 'error',
      mode: 'strict',
      alphabet: 'auto',
      primaryPath: {
        voicePath: (result as any).primaryPath?.voicePath?.split('→') || [],
        ringPath: (result as any).primaryPath?.ringPath?.split('→')?.map(Number) || [],
        levelPath: [],
        ops: [],
        checksums: { V: 0, E: 0, C: 0 },
        kept: 0,
      },
      frontierPaths: [],
      windows: [],
      windowClasses: [],
      signals: ['incomplete-payload'],
    };
  }

  const mode = (result.core.input?.mode === 'explore') ? 'open' : 'strict';
  const alphabet = result.core.input?.alphabet || 'auto';
  
  return result.debug?.rawEnginePayload ?? {
    engineVersion: result.core.engineVersion,
    word: result.core.word,
    mode: mode,
    alphabet: alphabet,
    primaryPath: {
      voicePath: result.core.voices.vowelVoices,
      ringPath: result.core.voices.ringPath,
      levelPath: result.core.voices.levelPath.map(l => l === 'high' ? 1 : l === 'mid' ? 0 : -1),
      ops: [],
      checksums: { V: 0, E: 0, C: 0 }, // This data is lost in translation
      kept: 0,
    },
    frontierPaths: [],
    windows: result.core.consonants.clusters.map(c => c.cluster),
    windowClasses: result.core.consonants.clusters.map(c => c.classes[0]),
    signals: [],
    languageFamilies: result.candidates.map(c => ({
      familyId: c.family,
      label: c.language,
      confidence: 0.5, // Lost in translation
      rationale: c.decomposition.functionalStatement,
      forms: [],
      signals: [],
    }))
  };
}
