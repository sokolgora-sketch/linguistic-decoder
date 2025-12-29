// src/shared/analysisAdapter.ts
import type { AnalyzeWordResultV1, Alphabet, Mode } from "./analysisResult.v1";
import type { EnginePayload, Candidate } from "@/shared/engineShape";
import { computeMath7ForResult } from "@/engine/math7";
import { analyzeMind, analyzeConsonants, analyzeSymbolic } from "@/engine/mindAnalyzer";
import { CANON_CANDIDATES } from "./canonCandidates";
import { buildWordMatrix } from "./wordMatrix.v1";
import { buildDeepRootSummaryV1 } from './deepRoot.v1';
import { buildDeepRootOutputV1 } from "./deepRoot.output.v1";

export function enginePayloadToAnalysisResult(payload: EnginePayload): AnalyzeWordResultV1 {
  const sanitized =
    (payload as any).sanitized ??
    (payload as any).sanitizedWord ??
    (payload as any).normalizedWord ??
    String(payload.word ?? "")
      .trim()
      .toLowerCase();

  const math7 = computeMath7ForResult(payload);
  const heart = buildHeartSummary(payload, math7);
  const mind = analyzeMind(math7, payload);
  const consonants = analyzeConsonants(payload);
  const symbolic = analyzeSymbolic(payload);

  const candidates = buildMindCandidates(payload);
  const deepRoot = buildDeepRoot(payload);

  const result: AnalyzeWordResultV1 = {
    word: payload.word,
    sanitized,
    engineVersion: payload.engineVersion,
    mode: payload.mode as Mode,
    alphabet: payload.alphabet as Alphabet,
    heart,
    mind,
    consonants,
    symbolicCore: symbolic,
    candidates,
    deepRoot,
    meta: {
      cache: payload.cacheHit ? "hit" : "miss",
      source: "live",
    },
  };

  const wordMatrix = buildWordMatrix(result);
  result.wordMatrix = wordMatrix;

  return result;
}

// --- helpers (minimal stubs; replace later if needed) ---
function buildHeartSummary(payload: any, math7: any) {
  const principlePath = Array.isArray(math7?.primary?.principlesPath)
    ? [...math7.primary.principlesPath]
    : [];

  return {
    word: payload.word,
    engineVersion: payload.engineVersion,
    mode: payload.mode,
    alphabet: payload.alphabet,
    math7,
    principlePath,
    narrative: `Word ${payload.word} follows ${math7?.tensionLevel ?? "stable"} balance.`,
  };
}

function buildMindCandidates(payload: EnginePayload): Candidate[] {
  if (CANON_CANDIDATES[payload.word]) {
    return CANON_CANDIDATES[payload.word];
  }

  if (payload.languageFamilies && payload.languageFamilies.length > 0) {
    return payload.languageFamilies.map((family) => ({
      id: `${payload.word}-${family.familyId}`,
      language: family.label,
      family: family.familyId,
      form: "",
      decomposition: { parts: [], functionalStatement: "" },
      voices: { voiceSequence: [], ringPath: [], dominantVoices: {} },
      ruleChecks: {
        soundPathOk: false,
        functionalDecompOk: false,
        sevenVoicesAlignmentOk: false,
        consonantMeaningOk: false,
        harmonyOk: false,
      },
      principleSignals: {
        truthOk: false,
        expansionOk: false,
        insightOk: false,
        balanceOk: false,
        unityOk: false,
        networkIntegrityOk: false,
        evolutionOk: false,
      },
      status: "experimental",
      confidenceTag: "speculative",
    }));
  }

  return [];
}

function buildDeepRoot(payload: any) {
  const basis =
    (payload as any).sanitized ??
    (payload as any).sanitizedWord ??
    (payload as any).normalizedWord ??
    String(payload.word ?? "").trim().toLowerCase();

  // DR4: DeepRoot minimal roots output (optional)
  const out = buildDeepRootOutputV1({
    basis,
    mode: String(payload.mode ?? "strict"),
    allowSSh: true,
    langAllowList: ["sq"],
    maxHypotheses: 25,
  });

  // Keep legacy (if it exists) as fallback — but prefer minroots output.
  return out ?? (buildDeepRootSummaryV1({ word: payload.word }) ?? undefined);
}

// --- Legacy helper: convert whatever we stored into EnginePayload shape ---
// Used by src/app/page.ts when loading old history entries.
// Keep it super defensive and light on types.
export function analysisResultToEnginePayload(input: any): any {
  if (!input) return input;

  // Already an EnginePayload
  if ((input as any).primaryPath && (input as any).engineVersion) {
    return input;
  }

  // Old shapes we might have stored
  if (typeof input === "object") {
    if ((input as any).payload) return (input as any).payload;
    if ((input as any).enginePayload) return (input as any).enginePayload;
  }

  // Last resort: just pass it through
  return input as any;
}

// Back-compat alias used by route/tests
export const analysisAdapter = enginePayloadToAnalysisResult;
