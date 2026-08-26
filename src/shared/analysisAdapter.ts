// src/shared/analysisAdapter.ts
import type { AnalyzeWordResultV1, Alphabet, Mode } from "./analysisResult.v1";
import type { EnginePayload, Candidate } from "@/shared/engineShape";
import { computeMath7ForResult } from "@/engine/math7";
import { analyzeMind, analyzeConsonants, analyzeSymbolic } from "@/engine/mindAnalyzer";
import { CANON_CANDIDATES } from "./canonCandidates";
import { buildWordMatrix } from "./wordMatrix.v1";
import { buildDeepRootOutputV1 } from "./deepRoot.output.v1";
import {
  buildRootMapV1,
  buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1,
  buildFunctionalCandidateCompositionsFromRootMapV0_1,
} from "./deepRoot.rootMap.builder.v1";
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
import { buildAnalysisStatusV0_1 } from "./analysisStatus.v0_1";
import { discoverStructuralHypothesesV0_1 } from "./structuralHypothesisDiscovery.v0_1";

function sameStringArray(a: any, b: any): boolean {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (String(a[i]) !== String(b[i])) return false;
  return true;
}

function pathPartsToDashString(value: unknown): string {
  if (!Array.isArray(value)) return "";

  return value
    .map((item) => String(item ?? "").trim())
    .filter(Boolean)
    .join("-");
}

function projectAuthoritativePrimaryPath(
  payload: EnginePayload,
): AnalyzeWordResultV1["primaryPath"] | undefined {
  const primaryPath = (payload as any)?.primaryPath;
  const voicePath = pathPartsToDashString(primaryPath?.voicePath);

  if (!voicePath) return undefined;

  return {
    voicePath,
    levelPath: pathPartsToDashString(primaryPath?.levelPath),
    ringPath: pathPartsToDashString(primaryPath?.ringPath),
  };
}

function pickSurfaceVowels(
  payload: any,
  math7: any,
): string[] | null {
  return (
    // Raw surface authority: do not prefer already-normalized legacy evidence.
    (Array.isArray(
      payload?.heartInstrumentV1?.surfaceVowels,
    )
      ? payload.heartInstrumentV1.surfaceVowels
      : null) ??
    (Array.isArray(payload?.surfaceVowels)
      ? payload.surfaceVowels
      : null) ??
    // Legacy fallback only when no raw surface packet exists.
    (Array.isArray(payload?.evidence?.surfaceVowels)
      ? payload.evidence.surfaceVowels
      : null) ??
    (Array.isArray(math7?.surface?.vowels)
      ? math7.surface.vowels
      : null) ??
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

  // One authoritative DeepRoot/RootMap basis for this analysis.
  // Public/raw word fields remain unchanged.
  const deepRootBasis =
    normalizeAnalysisWordForDeepRootV0_1(
      (payload as any).sanitized ??
        (payload as any).sanitizedWord ??
        (payload as any).normalizedWord ??
        payload.word,
    );

  const math7 = computeMath7ForResult(payload);
  const heart = buildHeartSummary(payload, math7);
  const mind = analyzeMind(math7, payload);
  const consonants = analyzeConsonants(payload);
  const symbolic = analyzeSymbolic(payload);

  const candidates = buildMindCandidates(payload);
  const deepRoot =
    buildDeepRoot(
      payload,
      deepRootBasis,
    );
  const authoritativePrimaryPath =
    projectAuthoritativePrimaryPath(payload);

  const result: AnalyzeWordResultV1 = {
    word: payload.word,
    sanitized,
    engineVersion: payload.engineVersion,
    mode: payload.mode as Mode,
    alphabet: payload.alphabet as Alphabet,
    ...(authoritativePrimaryPath
      ? { primaryPath: authoritativePrimaryPath }
      : {}),
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


  // Do not rediscover basis authority from public/result fields.
  // This is the exact normalized basis used to construct DeepRoot hypotheses.
  const rootMapBasis =
    deepRootBasis;

  const rootMap =
    buildRootMapV1({
      basis: rootMapBasis,
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

  // Logic-first structural discovery v0.1.
  //
  // Boundary:
  // - deterministic structural discovery is evidence-independent
  // - structural hypotheses are not reviewed lexical evidence
  // - OriginClaim was already computed above and is intentionally
  //   not recomputed from these hypotheses
  // - analysisStatus must see these candidates so a defensible
  //   structural hypothesis cannot coexist with stale Null
  const structuralHypothesesV0_1 =
    discoverStructuralHypothesesV0_1(
      rootMapBasis,
    );

  // Public structural projection is gap-filling only.
  //
  // Compute the deterministic baseline before adding logic-derived
  // structural hypotheses. Reviewed functional evidence, canonical
  // candidate ownership, and existing RootMap structure all outrank
  // this discovery layer.
  const baselineAnalysisStatusV0_1 =
    buildAnalysisStatusV0_1({
      word: rootMapBasis,
      rootMap,
      candidates:
        (result as any)
          .candidates,
    });

  const shouldProjectStructuralHypothesesV0_1 =
    baselineAnalysisStatusV0_1
      .status ===
        "null_no_supported_candidate" &&
    structuralHypothesesV0_1.length >
      0;

  if (
    shouldProjectStructuralHypothesesV0_1
  ) {
    const existingCandidates =
      Array.isArray(
        (result as any)
          .candidates,
      )
        ? (result as any)
            .candidates
        : [];

    const projectedStructuralCandidates =
      structuralHypothesesV0_1.map(
        (
          hypothesis,
          index,
        ) =>
          projectEmbryoFirstCandidateForAnalyzeV1(
            {
              id:
                hypothesis
                  .hypothesisId,
              candidateId:
                hypothesis
                  .hypothesisId,
              form:
                hypothesis
                  .embryo,
              displayForm:
                hypothesis
                  .embryo,
              candidateLanguage:
                "unknown",
              sourceKind:
                "logic_derived_structural_hypothesis",
              claimType:
                "structuralHypothesis",
              originClaim:
                "not_claimed",
              historicalRelation:
                "not_evaluated",
              embryo:
                hypothesis
                  .embryo,
              embryoSize:
                hypothesis
                  .embryoSize,
              embryoLanguage:
                null,
              isolatedStandaloneForm:
                null,
              plainStandaloneGloss:
                null,
              sourceNote:
                null,
              segmentation:
                null,
              semanticBridge:
                null,
              expansionChain:
                hypothesis
                  .expansionChain,
              reductionSteps:
                hypothesis
                  .reductionSteps,
              hypothesisVersion:
                hypothesis
                  .hypothesisVersion,
              discoveryStatus:
                hypothesis
                  .discoveryStatus,
              independentStandaloneMeaning:
                hypothesis
                  .independentStandaloneMeaning,
              lexicalAttestation:
                hypothesis
                  .lexicalAttestation,
              functionalSupportStatus:
                hypothesis
                  .functionalSupportStatus,
              evidenceRefs:
                hypothesis
                  .evidenceRefs,
              reasonCodes:
                hypothesis
                  .reasonCodes,
              validationOutcome:
                "not_evaluated",
              validationReasons:
                hypothesis
                  .reasonCodes,
              rankGroup:
                "structuralHypothesis",
              rankScore:
                hypothesis
                  .reasonCodes
                  .includes(
                    "minimum_defensible_embryo_reached",
                  )
                  ? 50
                  : 40,
              rankReason:
                hypothesis
                  .reasonCodes
                  .includes(
                    "minimum_defensible_embryo_reached",
                  )
                  ? "minimum deterministic structural hypothesis; independent meaning remains unknown"
                  : "deterministic structural hypothesis; larger competing embryo; independent meaning remains unknown",
              claimBoundary:
                "logic-derived structural hypothesis only; independent meaning unknown; not reviewed evidence, candidate truth, or historical origin",
              historicalOriginClaim:
                hypothesis
                  .historicalOriginClaim,
              historicalTransmissionClaim:
                hypothesis
                  .historicalTransmissionClaim,
              winnerClaim:
                hypothesis
                  .winnerClaim,
              languageSuperiorityClaim:
                hypothesis
                  .languageSuperiorityClaim,
              candidateTruthClaim:
                hypothesis
                  .candidateTruthClaim,
              userDecisionPosture:
                hypothesis
                  .userDecisionPosture,
            },
            payload,
            index,
          ),
      );

    (result as any).candidates =
      orderEmbryoFirstCandidatesForAnalyzeV1([
        ...existingCandidates,
        ...projectedStructuralCandidates,
      ]);
  }

  // Reuse the untouched baseline when structural discovery was
  // lower-precedence. Recompute only when structural candidates
  // actually filled a valid Null gap.
  (result as any).analysisStatusV0_1 =
    shouldProjectStructuralHypothesesV0_1
      ? buildAnalysisStatusV0_1({
          word: rootMapBasis,
          rootMap,
          candidates:
            (result as any)
              .candidates,
        })
      : baselineAnalysisStatusV0_1;

  // Reviewed embryo-first visibility overlay.
  //
  // Important boundary:
  // - RootMap remains the reviewed-evidence authority.
  // - OriginClaim and analysisStatus are already computed before this overlay.
  // - This layer exposes already-authorized functional evidence; it does not
  //   create evidence, rewrite RootMap, or feed origin/winner computation.
  const reviewedVisibleCandidates =
    buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1({
      rootMap,
      targetWord: rootMapBasis,
    });

  const composedVisibleCandidates =
    buildFunctionalCandidateCompositionsFromRootMapV0_1({
      rootMap,
      targetWord: rootMapBasis,
      functionalRoots:
        Array.isArray(
          (result as any)
            ?.deepRoot
            ?.functionalRoots,
        )
          ? (result as any)
              .deepRoot
              .functionalRoots
          : [],
    });

  const visibleFunctionalCandidates = [
    ...reviewedVisibleCandidates,
    ...composedVisibleCandidates,
  ];

  // Composition provenance is authenticated only at this
  // RootMap-owned overlay seam. The exported generic projector
  // must not trust caller-supplied segmentation evidence labels.
  const authenticatedFunctionalCompositionCandidateIds =
    new Set(
      composedVisibleCandidates
        .map((candidate) =>
          String(
            candidate.candidateId ??
              candidate.id ??
              "",
          ).trim(),
        )
        .filter(Boolean),
    );

  if (visibleFunctionalCandidates.length > 0) {
    const existingCandidates = Array.isArray(
      (result as any).candidates,
    )
      ? (result as any).candidates
      : [];

    const projectedFunctionalCandidates =
      visibleFunctionalCandidates.map(
        (candidate, index) =>
          projectEmbryoFirstCandidateForAnalyzeV1Internal(
            candidate,
            payload,
            index,
            authenticatedFunctionalCompositionCandidateIds,
          ),
      );

    (result as any).candidates =
      orderEmbryoFirstCandidatesForAnalyzeV1([
        ...projectedFunctionalCandidates,
        ...existingCandidates,
      ]);
  }

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
  "structuralHypothesis",
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
  "structuralHypothesis",
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
    isFunctionalComposition: boolean;
    isStructuralHypothesis: boolean;
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

  if (
    !checks.isFunctionalComposition &&
    !checks.isStructuralHypothesis
  ) {
    if (!checks.isolatedStandaloneForm) {
      add("missing_isolatedStandaloneForm");
    }

    if (!checks.plainStandaloneGloss) {
      add("missing_plainStandaloneGloss");
    }

    if (!checks.sourceNote) {
      add("missing_sourceNote");
    }
  }

  if (
    !checks.isStructuralHypothesis &&
    !checks.semanticBridge
  ) {
    add("missing_semanticBridge");
  }

  if (
    !checks.isFunctionalComposition &&
    !checks.isStructuralHypothesis &&
    (
      !checks.isolatedStandaloneForm ||
      !checks.plainStandaloneGloss ||
      !checks.sourceNote ||
      !checks.semanticBridge
    )
  ) {
    add(
      "embryo_first_full_functional_validation_not_claimed",
    );
  }

  return reasons;
}

const EMPTY_AUTHENTICATED_FUNCTIONAL_COMPOSITION_IDS =
  new Set<string>();

export function projectEmbryoFirstCandidateForAnalyzeV1<T>(
  candidate: T,
  payload: unknown,
  index = 0,
): T & Record<string, unknown> {
  return projectEmbryoFirstCandidateForAnalyzeV1Internal(
    candidate,
    payload,
    index,
    EMPTY_AUTHENTICATED_FUNCTIONAL_COMPOSITION_IDS,
  );
}

function projectEmbryoFirstCandidateForAnalyzeV1Internal<T>(
  candidate: T,
  payload: unknown,
  index: number,
  authenticatedFunctionalCompositionCandidateIds:
    ReadonlySet<string>,
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

  const requestedClaimType =
    embryoFirstAllowed(
      candidateRecord.claimType,
      EMBRYO_FIRST_CLAIM_TYPES,
    );

  const isStructuralHypothesis =
    requestedClaimType ===
      "structuralHypothesis" &&
    sourceKind ===
      "logic_derived_structural_hypothesis";

  const isolatedStandaloneForm = embryoFirstFirstText(
    candidateRecord.isolatedStandaloneForm,
  );
  const plainStandaloneGloss = embryoFirstFirstText(candidateRecord.plainStandaloneGloss);
  const sourceNote = embryoFirstFirstText(candidateRecord.sourceNote);
  const semanticBridge =
    embryoFirstFirstText(
      candidateRecord.semanticBridge,
    );

  const segmentationRecord =
    embryoFirstRecord(
      candidateRecord.segmentation,
    );

  const rawCompositionComponents =
    Array.isArray(
      segmentationRecord.components,
    )
      ? segmentationRecord.components
      : [];

  const compositionComponents =
    rawCompositionComponents
      .map((component) =>
        embryoFirstRecord(component),
      )
      .filter((component) => {
        const evidenceState =
          embryoFirstText(
            component.evidenceState,
          );

        return Boolean(
          embryoFirstText(
            component.embryo,
          ) &&
            embryoFirstText(
              component.language,
            ) &&
            embryoFirstText(
              component.plainMeaning,
            ) &&
            (
              evidenceState ===
                "reviewed" ||
              evidenceState ===
                "structural"
            ),
        );
      });

  const declaresFunctionalComposition =
    embryoFirstText(
      segmentationRecord.kind,
    ) === "functionalComposition";

  const isFunctionalComposition =
    declaresFunctionalComposition &&
    rawCompositionComponents.length >= 2 &&
    compositionComponents.length ===
      rawCompositionComponents.length;

  const reviewedCompositionCount =
    compositionComponents.filter(
      (component) =>
        embryoFirstText(
          component.evidenceState,
        ) === "reviewed",
    ).length;

  const hasAuthenticatedFunctionalCompositionProvenance =
    Boolean(
      isFunctionalComposition &&
        sourceKind ===
          "rootmap_functional_composition" &&
        authenticatedFunctionalCompositionCandidateIds.has(
          candidateId,
        ),
    );

  const hasFunctionalCompositionEvidence =
    Boolean(
      hasAuthenticatedFunctionalCompositionProvenance &&
        semanticBridge &&
        reviewedCompositionCount > 0,
    );

  const embryo = embryoFirstFirstText(
    candidateRecord.embryo,
    isolatedStandaloneForm,
  );

  const embryoLanguage =
    isStructuralHypothesis
      ? embryoFirstText(
          candidateRecord.embryoLanguage,
        )
      : embryoFirstFirstText(
          candidateRecord.embryoLanguage,
          embryo
            ? candidateLanguage
            : null,
        );

  // Standalone lexical isolation can authorize a single-embryo
  // candidate, but it can never authenticate a multi-embryo
  // functional composition.
  const hasIsolationProof = Boolean(
    !declaresFunctionalComposition &&
      isolatedStandaloneForm &&
      plainStandaloneGloss &&
      sourceNote,
  );
  const hasFunctionalBridge = Boolean(hasIsolationProof && semanticBridge);

  let claimType =
    requestedClaimType ??
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

  if (
    declaresFunctionalComposition &&
    !hasFunctionalCompositionEvidence
  ) {
    // Composition truth fails closed unless provenance came from
    // the authenticated RootMap-owned overlay. Caller-supplied
    // component labels, isolation fields, semantic bridges, and
    // validation labels do not create composition authority.
    claimType =
      isSeed
        ? "seedPairing"
        : "surfaceResonance";

    validationOutcome =
      "blocked";
  } else if (
    claimType ===
      "functionalMotivation" &&
    !hasIsolationProof &&
    !hasFunctionalCompositionEvidence
  ) {
    claimType =
      isSeed
        ? "seedPairing"
        : "surfaceResonance";

    validationOutcome =
      "blocked";
  }

  if (
    validationOutcome ===
      "validated" &&
    (
      declaresFunctionalComposition ||
      !hasIsolationProof
    )
  ) {
    // Multi-embryo component evidence does not authorize a
    // Reviewed composition-level semantic bridge. Authenticated
    // RootMap compositions remain Partial; unauthenticated
    // caller-supplied compositions remain blocked.
    validationOutcome =
      hasFunctionalCompositionEvidence
        ? "partial"
        : "blocked";
  }

  let rankGroup =
    embryoFirstAllowed(
      candidateRecord.rankGroup,
      EMBRYO_FIRST_RANK_GROUPS,
    ) ??
    (validationOutcome === "validated" &&
    claimType === "functionalMotivation"
      ? "validatedFunctionalMotivation"
      : hasFunctionalCompositionEvidence
        ? "partialFunctionalMotivation"
        : hasIsolationProof
          ? "partialFunctionalMotivation"
          : isStructuralHypothesis
            ? "structuralHypothesis"
            : "surfaceOrSeedOnly");

  if (declaresFunctionalComposition) {
    if (hasFunctionalCompositionEvidence) {
      rankGroup =
        "partialFunctionalMotivation";
    } else if (
      rankGroup ===
        "validatedFunctionalMotivation" ||
      rankGroup ===
        "partialFunctionalMotivation"
    ) {
      rankGroup =
        "surfaceOrSeedOnly";
    }
  }

  const rankScore =
    declaresFunctionalComposition &&
    !hasFunctionalCompositionEvidence
      ? 25
      : embryoFirstNumber(
          candidateRecord.rankScore,
        ) ??
        (rankGroup ===
        "validatedFunctionalMotivation"
          ? 100
          : rankGroup ===
            "partialFunctionalMotivation"
            ? 60
            : isSeed
              ? 30
              : 25);

  const validationReasons = embryoFirstValidationReasons(
    declaresFunctionalComposition &&
    !hasAuthenticatedFunctionalCompositionProvenance
      ? []
      : candidateRecord.validationReasons,
    {
      isSeed,
      isFunctionalComposition:
        declaresFunctionalComposition,
      isStructuralHypothesis,
      isolatedStandaloneForm,
      plainStandaloneGloss,
      sourceNote,
      semanticBridge,
    },
  );

  if (
    declaresFunctionalComposition &&
    !isFunctionalComposition &&
    !validationReasons.includes(
      "malformed_functional_composition",
    )
  ) {
    validationReasons.push(
      "malformed_functional_composition",
    );
  }

  if (
    declaresFunctionalComposition &&
    !hasAuthenticatedFunctionalCompositionProvenance &&
    !validationReasons.includes(
      "functional_composition_provenance_not_authenticated",
    )
  ) {
    validationReasons.push(
      "functional_composition_provenance_not_authenticated",
    );
  }

  const segmentation =
    candidateRecord.segmentation ??
    candidateRecord.decomposition ??
    candidateRecord.morphology ??
    null;
  const expansionChain =
    embryoFirstStringList(candidateRecord.expansionChain) ??
    (embryo ? [embryo, displayForm] : [displayForm]);

  const rankReason =
    declaresFunctionalComposition &&
    !hasFunctionalCompositionEvidence
      ? "functional composition evidence provenance is not authenticated"
      : embryoFirstFirstText(
          candidateRecord.rankReason,
        ) ??
        (hasFunctionalCompositionEvidence
          ? "partial authenticated multi-embryo functional composition evidence is present"
          : hasIsolationProof
            ? "partial embryo-first functional motivation evidence is present"
            : isSeed
              ? "seed pairing only; sourceKind SEED is not validation"
              : "surface candidate only; embryo-first isolation proof is not supplied");

  const claimBoundary =
    declaresFunctionalComposition &&
    !hasFunctionalCompositionEvidence
      ? "unauthenticated composition evidence is not functional candidate truth"
      : embryoFirstFirstText(
          candidateRecord.claimBoundary,
        ) ??
        (hasFunctionalCompositionEvidence
          ? "partial functional composition only; composition-level reviewed semantic bridge is not authorized"
          : hasIsolationProof
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


export function orderEmbryoFirstCandidatesForAnalyzeV1<
  T extends Record<string, unknown>,
>(candidates: readonly T[]): T[] {
  return candidates
    .map((candidate, index) => ({ candidate, index }))
    .sort((left, right) => {
      const candidateTier = (
        candidate: Record<string, unknown>,
      ): number => {
        const rankGroup = embryoFirstAllowed(
          candidate.rankGroup,
          EMBRYO_FIRST_RANK_GROUPS,
        );
        const validationOutcome = embryoFirstAllowed(
          candidate.validationOutcome,
          EMBRYO_FIRST_VALIDATION_OUTCOMES,
        );

        switch (rankGroup) {
          case "validatedFunctionalMotivation":
            return validationOutcome === "validated" ? 0 : 5;

          case "partialFunctionalMotivation":
            return validationOutcome === "validated" ||
              validationOutcome === "partial"
              ? 1
              : 5;

          case "structuralHypothesis":
            return 2;

          case "surfaceOrSeedOnly":
            return 3;

          case "historicalContextOnly":
            return 4;

          case "unresolved":
            return 5;

          default:
            return 6;
        }
      };

      const leftTier = candidateTier(left.candidate);
      const rightTier = candidateTier(right.candidate);

      if (leftTier !== rightTier) {
        return leftTier - rightTier;
      }

      // Embryo-size ranking belongs inside functional groups and the
      // deterministic structural-hypothesis group. Surface/seed,
      // historical context, unresolved, and unknown candidates preserve
      // their existing deterministic order within their group.
      if (leftTier > 2) {
        return left.index - right.index;
      }

      const leftSize = embryoFirstNumber(left.candidate.embryoSize);
      const rightSize = embryoFirstNumber(right.candidate.embryoSize);

      if (leftSize != null && rightSize != null && leftSize !== rightSize) {
        return leftSize - rightSize;
      }

      if (leftSize != null && rightSize == null) {
        return -1;
      }

      if (leftSize == null && rightSize != null) {
        return 1;
      }

      if (leftTier === 2) {
        const leftOperationCount =
          Array.isArray(
            left.candidate.reductionSteps,
          )
            ? left.candidate
                .reductionSteps.length
            : Number.POSITIVE_INFINITY;

        const rightOperationCount =
          Array.isArray(
            right.candidate.reductionSteps,
          )
            ? right.candidate
                .reductionSteps.length
            : Number.POSITIVE_INFINITY;

        if (
          leftOperationCount !==
          rightOperationCount
        ) {
          return (
            leftOperationCount -
            rightOperationCount
          );
        }
      }

      return left.index - right.index;
    })
    .map(({ candidate }) => candidate);
}

function buildMindCandidates(payload: EnginePayload): Candidate[]  {
  const projected = buildMindCandidatesBase(payload).map((candidate, index) =>
    projectEmbryoFirstCandidateForAnalyzeV1(candidate, payload, index),
  );

  return orderEmbryoFirstCandidatesForAnalyzeV1(projected) as Candidate[];
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

function normalizeAnalysisWordForDeepRootV0_1(
  value: unknown,
): string {
  const raw =
    String(value ?? "")
      .normalize("NFC")
      .trim()
      .toLowerCase();

  // Current DeepRoot lexical normalization authority is bounded to
  // ASCII Latin letters plus canonical Ë.
  //
  // An unsupported Unicode letter/mark must not be deleted while
  // neighboring supported letters survive. That would silently
  // change lexical identity, e.g. résumé -> rsum.
  //
  // Inputs outside this lane therefore preserve the existing raw
  // fallback. Transliteration requires a separate reviewed contract.
  const hasUnsupportedUnicodeLetter =
    Array.from(raw).some(
      (symbol) =>
        /[\p{L}\p{M}]/u.test(
          symbol,
        ) &&
        !/[a-zë]/u.test(
          symbol,
        ),
    );

  if (
    hasUnsupportedUnicodeLetter
  ) {
    return raw;
  }

  const canonical =
    raw.replace(/[^a-zë]/g, "");

  // Preserve prior behavior for non-lexical punctuation/spacing
  // around currently supported Latin+Ë forms such as "study!".
  return canonical || raw;
}

function buildDeepRoot(
  payload: any,
  normalizedWord: string,
) {
  // normalizedWord is computed once by enginePayloadToAnalysisResult
  // and is the authority for DeepRoot hypotheses + RootMap.
  const authoritativeBasis =
    normalizeAnalysisWordForDeepRootV0_1(
      normalizedWord,
    );

  // DR3 min-roots
  // (Adjust opts to your current policy)
  const minRoots = buildMinRootHypotheses(authoritativeBasis, {
    allowSSh: true,
    langAllowList: ["sq"],
    maxHypotheses: 25,
    maxSegments: 5,
  });

  // DR4/DR5 output (hypotheses + optional rootFamilies; plus legacy alias candidates)
  return buildDeepRootOutputV1({
    basis: {
      // Preserve the existing public/reporting DeepRoot basis contract.
      // Internal RootMap authorization uses authoritativeBasis directly
      // and does not rediscover trust from this public field.
      word: String(
        payload.word ??
          authoritativeBasis,
      ),
      normalizedWord:
        authoritativeBasis,
    },
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
