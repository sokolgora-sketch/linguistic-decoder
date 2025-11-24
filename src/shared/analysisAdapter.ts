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
// src/shared/analysisAdapter.ts

import type {
  AnalysisCore,
  AnalysisDebug,
  AnalysisResult_DEPRECATED,
  Candidate,
  EnginePayload,
  SevenVoicesSummary,
  SymbolicLayer,
} from "./engineShape";
import { CANON_CANDIDATES } from "./canonCandidates";
import { buildConsonantField } from "./consonantField";
import { getVoiceMeta } from "./sevenVoices";
import { detectAlbanianDialect } from "../lib/detectDialect";
import { computeMath7ForResult } from "@/engine/math7";
import { computePrinciples } from "./computePrinciples";

/**
 * Builds a light Seven-Voices / principles summary from the primary path.
 * Safe against missing / empty paths.
 */
function buildSevenVoicesSummary(
  payload: EnginePayload
): SevenVoicesSummary | undefined {
  const path = payload.primaryPath?.voicePath;
  if (!path || path.length === 0) return undefined;

  const principlePath = path.map((v) => getVoiceMeta(v).principle);

  const voiceCounts: Record<string, number> = {};
  for (const v of path) {
    voiceCounts[v] = (voiceCounts[v] ?? 0) + 1;
  }

  const maxCount = Math.max(...Object.values(voiceCounts));
  const dominant = Object.entries(voiceCounts)
    .filter(([, count]) => count === maxCount)
    .map(([v]) => getVoiceMeta(v as any).principle);

  const sevenWords = [
    "Truth",
    "Expansion",
    "Insight",
    "Balance",
    "Unity",
    "Network Integrity",
    "Evolution",
  ];

  return {
    voicePath: path,
    principlesPath: principlePath,
    dominant,
    sevenWords,
  };
}

function buildSymbolicLayer(
  candidates: Candidate[]
): SymbolicLayer | undefined {
  if (!candidates || candidates.length === 0) {
    return undefined;
  }

  const notes: string[] = [];
  for (const c of candidates) {
    if (c.symbolic) {
      for (const s of c.symbolic) {
        notes.push(s.note);
      }
    }
  }

  if (notes.length === 0) return undefined;

  return {
    notes,
    label: "Zheji-inspired symbolic reading (experimental)",
  };
}

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

  const { field, summary } = buildConsonantField(
    payload,
    payload.primaryPath
  );

  const { word } = payload;
  const canon = CANON_CANDIDATES[word.toLowerCase()] ?? [];

  // Canonical candidates, with consonantProfileOk derived from axes.verdict
  const candidates: Candidate[] = canon.map((c) => {
    const profileOk = c.axes?.consonants === "pass";
    return {
      ...c,
      consonantProfileOk: profileOk,
    };
  });

  // If no canonical candidates, synthesize speculative ones from languageFamilies.
  if (candidates.length === 0) {
    for (const fam of payload.languageFamilies ?? []) {
      candidates.push({
        id: `spec_${fam.familyId}_${word}`,
        language: fam.label,
        family: fam.familyId,
        form: (fam.forms && fam.forms[0]) ?? word,
        decomposition: { parts: [], functionalStatement: fam.rationale },
        voices: {
          voiceSequence: payload.primaryPath.voicePath,
          ringPath: payload.primaryPath.ringPath,
          dominantVoices: {},
        },
        ruleChecks: {
          soundPathOk: true,
          functionalDecompOk: true,
          sevenVoicesAlignmentOk: true,
          consonantMeaningOk: true,
          harmonyOk: true,
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
        status: "experimental",
        confidenceTag: "speculative",
      });
    }
  }

  const core: AnalysisCore = {
    word: payload.word,
    engineVersion: payload.engineVersion,
    input: {
      raw: payload.word,
      normalized: payload.word,
      alphabet: payload.alphabet,
      languageGuess: payload.languageFamilies?.[0]?.label ?? "unknown",
      languageConfidence: "medium",
      dialectGuess: detectAlbanianDialect(word),
      mode: "strict",
    },
    voices: {
      vowelVoices: payload.primaryPath.voicePath,
      ringPath: payload.primaryPath.ringPath,
      levelPath: payload.primaryPath.levelPath.map((l) =>
        l > 0 ? "high" : l < 0 ? "low" : "mid"
      ),
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
        voiceSequence: payload.primaryPath.voicePath,
        ringPath: payload.primaryPath.ringPath,
        tensionLevel: "low",
      },
      frontierCount: payload.frontierPaths.length,
    },
  };

  const debug: AnalysisDebug = {
    rawEnginePayload: payload,
  };

  const sevenVoices = buildSevenVoicesSummary(payload);
  const symbolic = buildSymbolicLayer(candidates);

  const analysisResult: AnalysisResult_DEPRECATED = {
    core,
    consonants: { field, summary },
    candidates,
    debug,
    sevenVoices,
    symbolic,
  };

  // Attach Math7 / Heart layer (optional)
  const math7 = computeMath7ForResult(analysisResult);
  if (math7) {
    (analysisResult as any).math7 = math7;
  }
  
  (analysisResult as any).principles = computePrinciples(payload);

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

  const { mode, alphabet } = result.core.input;

  const basePayload =
    result.debug?.rawEnginePayload ?? {
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

  // We optionally attach math7 here so it can round-trip if needed.
  return { ...basePayload, math7: (result as any).math7 };
}
