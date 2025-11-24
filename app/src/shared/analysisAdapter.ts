/**
 * 🧩 ANALYSIS ADAPTER
 *
 * Bridges raw engine payload → UI / test-friendly structure.
 * Canon tests depend on this file:
 *  - tests/canonCandidates.spec.ts
 *
 * IMPORTANT:
 *  - Do NOT remove or rename existing fields expected by tests.
 *  - Do NOT let auto-refactor / AI tools delete or inline this file.
 *  - If you change how something is mapped, re-run Jest and keep all suites green.
 */

import type {
  AnalysisCore,
  AnalysisDebug,
  AnalysisResult_DEPRECATED,
  Candidate,
  EnginePayload,
  SevenVoicesSummary,
  SymbolicLayer,
  PrincipleName,
} from "@/shared/engineShape";
import { CANON_CANDIDATES } from "@/shared/canonCandidates";
import { buildConsonantField } from "@/shared/consonantField";
import { getVoiceMeta } from "@/shared/sevenVoices";
import { detectAlbanianDialect } from "@/lib/detectDialect";
import { computeMath7ForResult } from "@/engine/math7";
import { computePrinciples } from "./computePrinciples";
import { analyzeWord } from "@/engine/analyzeWord";


/**
 * Adapts a raw EnginePayload into the richer AnalysisResult structure,
 * which includes canonical candidates, consonant summaries, Seven-Voices summary,
 * and the optional math7 “heart” layer.
 */
export function enginePayloadToAnalysisResult(
  payload: EnginePayload | null
): AnalysisResult_DEPRECATED | null {
  // Hard guard – if engine didn’t give us a primary path, no analysis.
  if (
    !payload ||
    !payload.primaryPath ||
    !payload.primaryPath.voicePath ||
    !payload.primaryPath.ringPath
  ) {
    return null;
  }
  
  const analysis = analyzeWord(payload.word, payload.mode);

  const { field, summary } = buildConsonantField(
    payload,
    payload.primaryPath
  );

  const candidates: Candidate[] = (analysis.languageFamilies || []).map(c => ({
    id: `${c.language}-${c.form}`,
    language: c.language,
    family: c.language,
    form: c.form,
    decomposition: {
      parts: [],
      functionalStatement: c.gloss,
    },
    voices: {
      voiceSequence: c.voicePath.split('→').map(v => v.trim()) as any,
      ringPath: c.ringPath.split('→').map(v => parseInt(v.trim())),
      dominantVoices: {},
    },
    ruleChecks: {
      soundPathOk: c.passes,
      functionalDecompOk: c.passes,
      sevenVoicesAlignmentOk: c.passes,
      consonantMeaningOk: c.passes,
      harmonyOk: c.passes,
    },
    principleSignals: {
      truthOk: true,
      expansionOk: true,
      insightOk: true,
      balanceOk: true,
      unityOk: true,
      networkIntegrityOk: true,
      evolutionOk: true,
    },
    status: c.experimental ? 'experimental' : (c.passes ? 'pass' : 'fail'),
    confidenceTag: c.speculative ? 'speculative' : 'solid',
    morphologyMatrix: c.morphologyMatrix,
    symbolic: c.symbolic,
  }));


  const core: AnalysisCore = {
    word: analysis.word,
    engineVersion: analysis.meta.engineVersion,
    input: {
      raw: analysis.word,
      normalized: analysis.sanitized,
      alphabet: analysis.meta.alphabet || 'auto',
      languageGuess: analysis.languageFamilies?.[0]?.language ?? "unknown",
      languageConfidence: "medium",
      dialectGuess: detectAlbanianDialect(analysis.word),
      mode: analysis.meta.mode,
    },
    voices: {
      vowelVoices: analysis.primaryPath.voicePath.split('→').map(v=>v.trim()) as any,
      ringPath: analysis.primaryPath.ringPath.split('→').map(v=>parseInt(v.trim())),
      levelPath: analysis.primaryPath.levelPath.split('→').map(v=>v.trim()) as any,
      dominantVoices: {},
    },
    consonants: {
      clusters: (payload.windows ?? []).map((c, i) => ({
        cluster: c,
        classes: [payload.windowClasses?.[i] ?? ""],
        orbitSlots: [],
        harmonyScore: 0,
      })),
      overallHarmony: {
        byVoice: {},
        globalHarmonyScore: 0,
      },
    },
    heartPaths: {
      primary: {
        voiceSequence: analysis.primaryPath.voicePath.split('→').map(v=>v.trim()) as any,
        ringPath: analysis.primaryPath.ringPath.split('→').map(v=>parseInt(v.trim())),
        tensionLevel: "low",
      },
      frontierCount: analysis.frontier.length,
    },
    primaryPath: analysis.primaryPath,
  };

  const debug: AnalysisDebug = {
    rawEnginePayload: payload,
  };

  const principles = computePrinciples(payload);

  const analysisResult: AnalysisResult_DEPRECATED = {
    core,
    consonants: { field, summary: summary as any },
    candidates,
    debug,
    sevenVoices: undefined, // This can be rebuilt if needed
    symbolic: analysis.symbolic,
    math7: analysis.math7,
    principles,
  };


  return analysisResult;
}

/**
 * Converts the rich AnalysisResult back to a bare EnginePayload,
 * useful for mocks or piping into other tools.
 */
export function analysisResultToEnginePayload(
  result: AnalysisResult_DEPRECATED | null
): EnginePayload | null {
  if (!result || !result.core) {
    return null;
  }

  const { alphabet } = result.core.input;
  const modeFromResult = result.core.input.mode as any;

  // Normalise back to the EnginePayload mode type ("strict" | "open").
  const mode: EnginePayload["mode"] =
    modeFromResult === "open" ? "open" : "strict";

  let basePayload: EnginePayload;

  if (result.debug?.rawEnginePayload) {
    basePayload = result.debug.rawEnginePayload as EnginePayload;
  } else {
    basePayload = {
      engineVersion: result.core.engineVersion,
      word: result.core.word,
      mode,
      alphabet,
      primaryPath: {
        voicePath: result.core.voices.vowelVoices,
        ringPath: result.core.voices.ringPath,
        levelPath: result.core.voices.levelPath.map((l) =>
          l === "high" ? 1 : l === "low" ? -1 : 0
        ),
        ops: [],
        checksums: { V: 0, E: 0, C: 0 },
        kept: 0,
      },
      frontierPaths: [],
      windows: result.core.consonants.clusters.map((c) => c.cluster),
      windowClasses: result.core.consonants.clusters.map(
        (c) => c.classes[0]
      ),
      signals: [],
    };
  }

  // Optionally attach math7 here so it can round-trip if needed.
  if ((result as any).math7) {
    (basePayload as any).math7 = (result as any).math7;
  }

  return basePayload;
}
