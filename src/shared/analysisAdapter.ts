// src/shared/analysisAdapter.ts
import type { AnalyzeWordResultV1, Alphabet, Mode } from "./analysisResult.v1";
import type { EnginePayload, Candidate } from "@/shared/engineShape";
import { computeMath7ForResult } from "@/engine/math7";
import { analyzeMind, analyzeConsonants, analyzeSymbolic } from "@/engine/mindAnalyzer";
import { CANON_CANDIDATES } from "./canonCandidates";
import { buildWordMatrix } from "./wordMatrix.v1";
import { buildDeepRootOutputV1 } from "./deepRoot.output.v1";
import { buildRootMapV1 } from "./deepRoot.rootMap.builder.v1";
import { pickHeartPrimaryPathForRootMap } from "./heartPrimaryPathForRootMap.v0.1.2";
import { buildResonanceProfileV1 } from "@/shared/resonanceProfile.v1";

function pickHeartPrimaryPath(payload: any): unknown {
  // Canonical precedence (v0.1.2 intent):
  // 1) primaryPath.voicePath (preferred)
  // 2) evidence.math7.primary.vowels
  // 3) heart.math7.primary.vowels
  //
  // Keep permissive (unknown) because buildRootMapV1 parses defensively.
  const p = payload ?? {};

  const vp = p?.primaryPath?.voicePath;
  if (vp != null) return vp;

  const ev = p?.evidence?.math7?.primary?.vowels;
  if (ev != null) return ev;

  const hv = p?.heart?.math7?.primary?.vowels;
  if (hv != null) return hv;

  return undefined;
}


import { buildMinRootHypotheses } from "./deepRoot.minRoots.v1";
import { buildOriginClaimV1 } from "./originClaim.builder.v1";
import { attachSoundRootsV0_2 } from "./soundRoots/soundRoots.attach.v0.2";

function sameStringArray(a: any, b: any): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (String(a[i]) !== String(b[i])) return false;
  return true;
}

function pickSurfaceVowels(payload: any, math7: any): string[] | null {
    return (
      // Contract surface (preferred): evidence.surfaceVowels
      (Array.isArray(payload?.evidence?.surfaceVowels) ? payload.evidence.surfaceVowels : null) ??
      // Raw surface (may differ by layer): heartInstrumentV1.surfaceVowels
      (Array.isArray(payload?.heartInstrumentV1?.surfaceVowels) ? payload.heartInstrumentV1.surfaceVowels : null) ??
      (Array.isArray(payload?.surfaceVowels) ? payload.surfaceVowels : null) ??
      (Array.isArray(math7?.surface?.vowels) ? math7.surface.vowels : null) ??
      null
    );
  }

function pickFunctionalVowelPath(payload: any, math7: any): string[] | null {
  return (
    (Array.isArray(payload?.primaryPath?.voicePath) ? payload.primaryPath.voicePath : null) ??
    (Array.isArray(payload?.heart?.math7?.primary?.vowels) ? payload.heart.math7.primary.vowels : null) ??
    (Array.isArray(payload?.evidence?.math7?.primary?.vowels) ? payload.evidence.math7.primary.vowels : null) ??
    (Array.isArray(math7?.primary?.vowels) ? math7.primary.vowels : null) ??
    null
  );
}


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
            resonanceProfileV1: buildResonanceProfileV1({
        surfaceWord: sanitized,
        normalizedBasis: (math7 as any)?.primary?.basis ?? undefined,
        primaryVoices:
          ((payload as any)?.primaryPath?.voicePath ??
            (payload as any)?.evidence?.math7?.primary?.vowels ??
            (payload as any)?.heart?.math7?.primary?.vowels ??
            (math7 as any)?.primary?.vowels) ??
          undefined,
      }),
    candidates,
    meta: {
      version:
        (payload as any)?.engineVersion ??
        (payload as any)?.engine_meta?.engineVersion ??
        "unknown",
      created:
        (payload as any)?.createdAt ??
        (payload as any)?.engine_meta?.timestampIso ??
        new Date().toISOString(),
    },
  };


    // Evidence v0.1.x — emit auditable surface vs functional vowel path (Milestone B)
    // Functional truth MUST be carried into evidence (no UI inference).
    const surfaceVowels = pickSurfaceVowels(payload as any, math7);
    const functionalVowelPath = pickFunctionalVowelPath(payload as any, math7);

    const normalizationSteps =
      surfaceVowels && functionalVowelPath && !sameStringArray(surfaceVowels, functionalVowelPath)
        ? [
            {
              op: "vowel_normalize",
              from: surfaceVowels.join(""),
              to: functionalVowelPath.join(""),
              reason: "functional_equivalence",
            },
          ]
        : [];

    const prevEvidence =
      (payload as any)?.evidence && typeof (payload as any).evidence === "object"
        ? (payload as any).evidence
        : {};

    // IMPORTANT: surfaceVowels must reflect true raw surface when available (heartInstrumentV1),
    // NOT legacy evidence that may already be normalized.
    (result as any).evidence = {
      ...prevEvidence,
      surfaceVowels: surfaceVowels ?? prevEvidence.surfaceVowels ?? null,
      vowelPath: functionalVowelPath ?? null,
      normalizationSteps,
    };

    // Forward request-ish inputs (BRAIN-0.2 seed fallback + future request flags)
  // Route may attach (payload as any).inputs; shared builders only see the adapted "result".
  // IMPORTANT: do NOT add new top-level keys (contract). Merge into result.meta.inputs instead.
  {
    const pInputs =
      ((payload as any)?.inputs && typeof (payload as any).inputs === "object" ? (payload as any).inputs : null) ??
      ((payload as any)?.request && typeof (payload as any).request === "object" ? (payload as any).request : null);

    if (pInputs) {
      const meta = ((result as any)?.meta && typeof (result as any).meta === "object") ? (result as any).meta : {};
      const prevInputs = (meta as any)?.inputs && typeof (meta as any).inputs === "object" ? (meta as any).inputs : {};
      (result as any).meta = { ...meta, inputs: { ...prevInputs, ...(pInputs as any) } };
    }
  }

  // Origin Claim Protocol (V1)
  result.originClaim = buildOriginClaimV1(result);


  if (deepRoot !== undefined) {
    (result as any).deepRoot = deepRoot;
    attachSoundRootsV0_2(result);
  }


  const wordMatrix = buildWordMatrix(result);
  result.wordMatrix = wordMatrix;

  // RootMap v0.1 — ALWAYS emit top-level key (scientific instrument rule)
  // Uses DeepRoot hypotheses (minRoots) as input. If none exist, builder returns an empty RootMap with a note.
  const heartPrimaryPath = pickHeartPrimaryPathForRootMap(payload as any);

    // Emit heartPrimaryPath at top-level for UI + DeepRoot↔Heart gate (adapter-safe).
    // IMPORTANT: do not invent; only emit when we have a real upstream path.
    if (heartPrimaryPath != null) {
      (result as any).heartPrimaryPath = heartPrimaryPath;
    }


  const rootMap =
    buildRootMapV1({
      basis: String((result as any)?.deepRoot?.basis ?? (result as any)?.sanitized ?? (result as any)?.word ?? "").trim(),
      minRoots:
        (result as any)?.deepRoot?.hypotheses ??
        (result as any)?.deepRoot?.candidates ??
        [],
      heartPrimaryPath: heartPrimaryPath ?? null,
}) ??
    {
      tokens: [],
      keys: [],
      composedMeaning: "",
      notes: ["RootMap unavailable; builder returned null."],
    };

  (result as any).rootMap = rootMap;

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


const EMBRYO_FIRST_CLAIM_TYPES = [
  "functionalMotivation",
  "historicalTransmission",
  "surfaceResonance",
  "seedPairing",
  "unresolved",
  "notEvaluated",
] as const;

const EMBRYO_FIRST_ORIGIN_CLAIMS = [
  "not_claimed",
  "context_only",
  "explicitly_supported",
  "rejected_for_this_output",
] as const;

const EMBRYO_FIRST_HISTORICAL_RELATIONS = [
  "not_evaluated",
  "context_only",
  "possible_loan_relation",
  "attested_loan_relation",
  "possible_cognate_relation",
  "unknown",
  "not_applicable",
] as const;

const EMBRYO_FIRST_VALIDATION_OUTCOMES = [
  "validated",
  "partial",
  "failed",
  "not_evaluated",
  "blocked",
] as const;

const EMBRYO_FIRST_RANK_GROUPS = [
  "validatedFunctionalMotivation",
  "partialFunctionalMotivation",
  "surfaceOrSeedOnly",
  "historicalContextOnly",
  "unresolved",
] as const;

const EMBRYO_FIRST_USER_DECISION_POSTURES = ["user_decides"] as const;

function embryoFirstRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return {};
}

function embryoFirstText(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function embryoFirstNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function embryoFirstFirstText(...values: unknown[]): string | null {
  for (const value of values) {
    const text = embryoFirstText(value);
    if (text) {
      return text;
    }
  }

  return null;
}

function embryoFirstAllowed<const T extends readonly string[]>(
  value: unknown,
  allowed: T,
): T[number] | null {
  const text = embryoFirstText(value);
  if (!text) {
    return null;
  }

  return allowed.includes(text) ? text : null;
}

function embryoFirstStringList(value: unknown): string[] | null {
  if (!Array.isArray(value)) {
    return null;
  }

  const items = value
    .map((item) => embryoFirstText(item))
    .filter((item): item is string => Boolean(item));

  return items.length > 0 ? items : null;
}

function embryoFirstEmbryoSize(embryo: string | null): number | null {
  if (!embryo) {
    return null;
  }

  const compact = embryo.replace(/\s+/g, "");
  return compact.length > 0 ? Array.from(compact).length : null;
}

function embryoFirstValidationReasons(
  existing: unknown,
  checks: {
    isSeed: boolean;
    isolatedStandaloneForm: string | null;
    plainStandaloneGloss: string | null;
    sourceNote: string | null;
    semanticBridge: string | null;
  },
): string[] {
  const reasons = embryoFirstStringList(existing) ?? [];

  const add = (reason: string) => {
    if (!reasons.includes(reason)) {
      reasons.push(reason);
    }
  };

  if (checks.isSeed) {
    add("sourceKind_seed_not_validation");
  }

  if (!checks.isolatedStandaloneForm) {
    add("missing_isolatedStandaloneForm");
  }

  if (!checks.plainStandaloneGloss) {
    add("missing_plainStandaloneGloss");
  }

  if (!checks.sourceNote) {
    add("missing_sourceNote");
  }

  if (!checks.semanticBridge) {
    add("missing_semanticBridge");
  }

  if (
    !checks.isolatedStandaloneForm ||
    !checks.plainStandaloneGloss ||
    !checks.sourceNote ||
    !checks.semanticBridge
  ) {
    add("embryo_first_full_functional_validation_not_claimed");
  }

  return reasons;
}

export function projectEmbryoFirstCandidateForAnalyzeV1<T>(
  candidate: T,
  payload: unknown,
  index = 0,
): T & Record<string, unknown> {
  const candidateRecord = embryoFirstRecord(candidate);
  const nestedCandidateRecord = embryoFirstRecord(candidateRecord.candidateRecord);
  const payloadRecord = embryoFirstRecord(payload);

  const word = embryoFirstFirstText(payloadRecord.word) ?? "unknown";
  const candidateId =
    embryoFirstFirstText(candidateRecord.candidateId, candidateRecord.id) ??
    `${word}:candidate:${index + 1}`;
  const displayForm =
    embryoFirstFirstText(candidateRecord.displayForm, candidateRecord.form) ?? word;
  const candidateLanguage =
    embryoFirstFirstText(candidateRecord.candidateLanguage, candidateRecord.language) ??
    "unknown";

  const sourceKind = embryoFirstFirstText(
    candidateRecord.sourceKind,
    nestedCandidateRecord.sourceKind,
  );
  const isSeed = sourceKind?.toUpperCase() === "SEED";

  const isolatedStandaloneForm = embryoFirstFirstText(
    candidateRecord.isolatedStandaloneForm,
  );
  const plainStandaloneGloss = embryoFirstFirstText(candidateRecord.plainStandaloneGloss);
  const sourceNote = embryoFirstFirstText(candidateRecord.sourceNote);
  const semanticBridge = embryoFirstFirstText(candidateRecord.semanticBridge);
  const embryo = embryoFirstFirstText(candidateRecord.embryo, isolatedStandaloneForm);
  const embryoLanguage = embryoFirstFirstText(
    candidateRecord.embryoLanguage,
    embryo ? candidateLanguage : null,
  );

  const hasIsolationProof = Boolean(
    isolatedStandaloneForm && plainStandaloneGloss && sourceNote,
  );
  const hasFunctionalBridge = Boolean(hasIsolationProof && semanticBridge);

  let claimType =
    embryoFirstAllowed(candidateRecord.claimType, EMBRYO_FIRST_CLAIM_TYPES) ??
    (hasFunctionalBridge
      ? "functionalMotivation"
      : isSeed
        ? "seedPairing"
        : "surfaceResonance");

  let validationOutcome =
    embryoFirstAllowed(
      candidateRecord.validationOutcome,
      EMBRYO_FIRST_VALIDATION_OUTCOMES,
    ) ?? (hasFunctionalBridge ? "partial" : "not_evaluated");

  if (claimType === "functionalMotivation" && !hasIsolationProof) {
    claimType = isSeed ? "seedPairing" : "surfaceResonance";
    validationOutcome = "blocked";
  }

  if (validationOutcome === "validated" && !hasIsolationProof) {
    validationOutcome = "blocked";
  }

  const rankGroup =
    embryoFirstAllowed(candidateRecord.rankGroup, EMBRYO_FIRST_RANK_GROUPS) ??
    (validationOutcome === "validated" && claimType === "functionalMotivation"
      ? "validatedFunctionalMotivation"
      : hasIsolationProof
        ? "partialFunctionalMotivation"
        : isSeed
          ? "surfaceOrSeedOnly"
          : "surfaceOrSeedOnly");

  const rankScore =
    embryoFirstNumber(candidateRecord.rankScore) ??
    (rankGroup === "validatedFunctionalMotivation"
      ? 100
      : rankGroup === "partialFunctionalMotivation"
        ? 60
        : isSeed
          ? 30
          : 25);

  const validationReasons = embryoFirstValidationReasons(
    candidateRecord.validationReasons,
    {
      isSeed,
      isolatedStandaloneForm,
      plainStandaloneGloss,
      sourceNote,
      semanticBridge,
    },
  );

  const segmentation =
    candidateRecord.segmentation ??
    candidateRecord.decomposition ??
    candidateRecord.morphology ??
    null;
  const expansionChain =
    embryoFirstStringList(candidateRecord.expansionChain) ??
    (embryo ? [embryo, displayForm] : [displayForm]);

  const rankReason =
    embryoFirstFirstText(candidateRecord.rankReason) ??
    (hasIsolationProof
      ? "partial embryo-first functional motivation evidence is present"
      : isSeed
        ? "seed pairing only; sourceKind SEED is not validation"
        : "surface candidate only; embryo-first isolation proof is not supplied");

  const claimBoundary =
    embryoFirstFirstText(candidateRecord.claimBoundary) ??
    (hasIsolationProof
      ? "functional motivation evidence only; not historical origin"
      : "not historical origin or validated functional motivation");

  return {
    ...candidateRecord,
    candidateId,
    displayForm,
    candidateLanguage,
    claimType,
    originClaim:
      embryoFirstAllowed(candidateRecord.originClaim, EMBRYO_FIRST_ORIGIN_CLAIMS) ??
      "not_claimed",
    historicalRelation:
      embryoFirstAllowed(
        candidateRecord.historicalRelation,
        EMBRYO_FIRST_HISTORICAL_RELATIONS,
      ) ?? "not_evaluated",
    embryo,
    embryoSize:
      embryoFirstNumber(candidateRecord.embryoSize) ?? embryoFirstEmbryoSize(embryo),
    embryoLanguage,
    isolatedStandaloneForm,
    plainStandaloneGloss,
    sourceNote,
    segmentation,
    semanticBridge,
    expansionChain,
    validationOutcome,
    validationReasons,
    rankGroup,
    rankScore,
    rankReason,
    claimBoundary,
    userDecisionPosture:
      embryoFirstAllowed(
        candidateRecord.userDecisionPosture,
        EMBRYO_FIRST_USER_DECISION_POSTURES,
      ) ?? "user_decides",
  } as unknown as T & Record<string, unknown>;
}


function buildMindCandidates(payload: EnginePayload): Candidate[]  {
  return buildMindCandidatesBase(payload).map((candidate, index) =>
    projectEmbryoFirstCandidateForAnalyzeV1(candidate, payload, index),
  );
}

function buildMindCandidatesBase(payload: EnginePayload): Candidate[]  {
  if (CANON_CANDIDATES[payload.word]) {
    return CANON_CANDIDATES[payload.word] as unknown as Candidate[];
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
  const normalizedWord =
    (payload as any).sanitized ??
    (payload as any).sanitizedWord ??
    (payload as any).normalizedWord ??
    String(payload.word ?? "").trim().toLowerCase();

  // DR3 min-roots
  // (Adjust opts to your current policy)
  const minRoots = buildMinRootHypotheses(normalizedWord, {
    allowSSh: true,
    langAllowList: ["sq"],
    maxHypotheses: 25,
    maxSegments: 5,
  });

  // DR4/DR5 output (hypotheses + optional rootFamilies; plus legacy alias candidates)
  return buildDeepRootOutputV1({
    basis: { word: String(payload.word ?? normalizedWord), normalizedWord },
    minRoots,
  }) ?? undefined;
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
