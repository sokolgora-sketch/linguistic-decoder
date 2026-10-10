import type {
  MotivationEngineDiscoveryCandidateV0_1,
  MotivationEngineDiscoveryV0_1,
} from "@/shared/openInstrument/motivationEngineDiscovery.v0_1";
import type { HeartInstrumentV1 } from "@/v1/heartInstrument.v1";

export const FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_2 =
  "open-instrument.functional-motivation-interpretation.v0_2" as const;

export type FunctionalMotivationTruthLayerV0_2 =
  | "SOURCE_FACT"
  | "DERIVED_STRUCTURE"
  | "REVIEWED_FUNCTIONAL_EVIDENCE"
  | "ZRO_FUNCTIONAL_HYPOTHESIS"
  | "UNKNOWN_OR_NULL";

export type FunctionalMotivationRepresentationKindV0_2 =
  | "production_spoken"
  | "albanian_profile"
  | "orthographic_profile_derived"
  | "unknown";

export type FunctionalMotivationTargetSenseV0_2 = Readonly<{
  id: string;
  label: string;
  authority: "EXPLICIT_USER_OR_AUTHORIZED_SOURCE";
}>;

export type FunctionalMotivationSourceFactV0_2 = Readonly<{
  layer: "SOURCE_FACT";
  scope: "input" | "candidate";
  candidateId: string | null;
  language: string;
  form: string;
  gloss: string | null;
  sourceId: string;
  sourceStatus: string;
  attestationTruth: string;
  citationRefs: readonly string[];
  sourceUrlOrArchiveRef: string | null;
  entryLocator: string | null;
}>;

export type FunctionalMotivationNucleusEventV0_2 = Readonly<{
  layer: "DERIVED_STRUCTURE";
  pathIndex: number;
  voice: string;
  representationKind: FunctionalMotivationRepresentationKindV0_2;
  sourceIdentity: string;
  nucleusIndex: number | null;
  nucleusKind: string | null;
  movingNucleusBoundary: Readonly<{
    startPathIndex: number;
    endPathIndex: number;
  }> | null;
  recurrenceIndex: number;
}>;

export type FunctionalMotivationDerivedStructureV0_2 = Readonly<{
  layer: "DERIVED_STRUCTURE";
  inputVoicePath: readonly string[];
  voicePathSource: "production_spoken" | "albanian_profile" | "unknown";
  nucleusEvents: readonly FunctionalMotivationNucleusEventV0_2[];
  gamma: Readonly<{
    status: "source_pronunciation" | "profile_derived" | "NULL";
    orderedUnits: readonly string[];
    reason: string | null;
  }>;
  zeroConsonantalStructuralComposition: Readonly<{
    status: "source_pronunciation" | "NULL";
    variants: readonly unknown[];
    reason: string | null;
  }>;
  structuralHypotheses: readonly Readonly<{
    hypothesisId: string;
    embryo: string;
    expansionChain: readonly string[];
    reasonCodes: readonly string[];
  }>[];
}>;

export type ReviewedFunctionalEvidenceReferenceV0_2 = Readonly<{
  layer: "REVIEWED_FUNCTIONAL_EVIDENCE";
  candidateId: string;
  sourceId: string;
  evidenceRefs: readonly string[];
  sourceStatus: string;
  authorityStatus: "REVIEWED_ACCEPTED" | "UNKNOWN_OR_NULL";
  claimBoundary: "functional evidence only; not historical origin";
  reason: string | null;
}>;

export type ExistingCandidateReferenceV0_2 = MotivationEngineDiscoveryCandidateV0_1;

export type FunctionalMotivationInterpretationInputV0_2 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_2;
  inputWord: string;
  targetSense: FunctionalMotivationTargetSenseV0_2 | null;
  sourceFacts: readonly FunctionalMotivationSourceFactV0_2[];
  derivedStructure: FunctionalMotivationDerivedStructureV0_2;
  candidates: readonly ExistingCandidateReferenceV0_2[];
  reviewedFunctionalEvidence: readonly ReviewedFunctionalEvidenceReferenceV0_2[];
}>;

export type FunctionalMotivationCandidateCorrespondenceV0_2 = Readonly<{
  layer: "DERIVED_STRUCTURE";
  matchClassification:
    | "STRUCTURAL_MOTIVATION_CANDIDATE"
    | "EXACT_LEXICAL_SELF_MATCH";
  presentationClassification:
    | "STRUCTURAL_MOTIVATION"
    | "LEXICAL_ENTRY_CONFIRMATION";
  matchedQuery: string;
  inputRepresentationKind: FunctionalMotivationRepresentationKindV0_2;
  candidateRepresentationKind: FunctionalMotivationRepresentationKindV0_2;
  representationCompatibility:
    | "SAME_REPRESENTATION"
    | "CROSS_REPRESENTATION"
    | "NOT_COMPARABLE_ACROSS_REPRESENTATIONS"
    | "UNKNOWN";
  inputVoicePath: readonly string[];
  candidateVoicePath: readonly string[];
  candidateVoicePathStatus: "AUTHORIZED" | "NULL_UNAUTHORIZED";
  voiceRelationship:
    | "EXACT_ORDERED_VOICE_MATCH"
    | "PARTIAL_ORDERED_VOICE_MATCH"
    | "EMBRYO_VOICE_MATCH"
    | "NO_AUTHORIZED_VOICE_RELATION"
    | "NOT_COMPARABLE_ACROSS_REPRESENTATIONS"
    | "UNKNOWN";
  gamma: readonly string[] | null;
  zeroConsonantalStructuralComposition: readonly unknown[] | null;
  operationIds: readonly string[];
  reasonCodes: readonly string[];
  unresolvedFields: readonly string[];
  matchReason: string;
}>;

export type FunctionalMotivationHypothesisV0_2 = Readonly<{
  layer: "ZRO_FUNCTIONAL_HYPOTHESIS" | "UNKNOWN_OR_NULL";
  status: "HYPOTHESIS" | "UNKNOWN_OR_NULL";
  statement: string | null;
  evidenceRefs: readonly string[];
  reason: string | null;
}>;

export type FunctionalMotivationCandidateInterpretationV0_2 = Readonly<{
  candidateId: string;
  candidateLanguage: string;
  candidateForm: string;
  candidateGloss: string;
  candidateEmbryo: string;
  sourceFact: FunctionalMotivationSourceFactV0_2;
  correspondence: FunctionalMotivationCandidateCorrespondenceV0_2;
  reviewedFunctionalEvidence: ReviewedFunctionalEvidenceReferenceV0_2;
  hypothesis: FunctionalMotivationHypothesisV0_2;
  unresolved: readonly Readonly<{
    layer: "UNKNOWN_OR_NULL";
    reason: string;
  }>[];
  historicalRelation: "not_claimed";
  candidateTruthClaim: "not_claimed";
  winnerClaim: "not_claimed";
  languageSuperiorityClaim: "not_claimed";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type FunctionalMotivationClaimBoundaryV0_2 = Readonly<{
  historicalRelation: "not_claimed";
  historicalTransmission: "not_claimed";
  borrowingOrCognacy: "not_claimed";
  candidateTruthClaim: "not_claimed";
  winnerClaim: "not_claimed";
  languageSuperiorityClaim: "not_claimed";
  consonantSemantics: "not_generated";
  spellingDerivedPronunciation: "not_authorized";
  nullIsValid: true;
}>;

export type FunctionalMotivationInterpretationV0_2 = Readonly<{
  schemaVersion: typeof FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_2;
  status: "INTERPRETATIONS_FOUND" | "NO_SUPPORTED_INTERPRETATION";
  input: Readonly<{
    inputWord: string;
    targetSense: FunctionalMotivationTargetSenseV0_2 | null;
    sourceFacts: readonly FunctionalMotivationSourceFactV0_2[];
    derivedStructure: FunctionalMotivationDerivedStructureV0_2;
  }>;
  candidates: readonly FunctionalMotivationCandidateInterpretationV0_2[];
  reviewedFunctionalEvidence: readonly ReviewedFunctionalEvidenceReferenceV0_2[];
  unresolved: readonly Readonly<{
    layer: "UNKNOWN_OR_NULL";
    reason: string;
  }>[];
  claimBoundary: FunctionalMotivationClaimBoundaryV0_2;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

type RecordV0_2 = Record<string, unknown>;

function isRecordV0_2(value: unknown): value is RecordV0_2 {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function compareTextV0_2(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function uniqueSortedV0_2(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort(compareTextV0_2);
}

function deepFreezeV0_2<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object") return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.freeze(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV0_2(child, seen);
  }
  return value;
}

function sourceFactFromCandidateV0_2(
  candidate: MotivationEngineDiscoveryCandidateV0_1,
): FunctionalMotivationSourceFactV0_2 {
  return {
    layer: "SOURCE_FACT",
    scope: "candidate",
    candidateId: candidate.candidateId,
    language: candidate.candidateLanguage,
    form: candidate.candidateForm,
    gloss: candidate.candidateGloss,
    sourceId: candidate.sourceFact.sourceId,
    sourceStatus: candidate.sourceFact.sourceStatus,
    attestationTruth: candidate.sourceFact.attestationTruth,
    citationRefs: [...candidate.sourceFact.evidenceRefs].sort(compareTextV0_2),
    sourceUrlOrArchiveRef: candidate.sourceFact.sourceUrlOrArchiveRef,
    entryLocator: candidate.sourceFact.entryLocator,
  };
}

function sourceFactFromInputV0_2(
  discovery: MotivationEngineDiscoveryV0_1,
): FunctionalMotivationSourceFactV0_2 {
  return {
    layer: "SOURCE_FACT",
    scope: "input",
    candidateId: null,
    language: discovery.sourceFact.language,
    form: discovery.inputWord,
    gloss: null,
    sourceId: discovery.sourceFact.profile,
    sourceStatus: discovery.sourceFact.sourceStatus,
    attestationTruth: "not_claimed",
    citationRefs: [],
    sourceUrlOrArchiveRef: null,
    entryLocator: null,
  };
}

function nucleusEventsV0_2(
  discovery: MotivationEngineDiscoveryV0_1,
  heart?: HeartInstrumentV1,
): readonly FunctionalMotivationNucleusEventV0_2[] {
  const representationKind = discovery.sourceFact.representation;
  const events: FunctionalMotivationNucleusEventV0_2[] = [];

  if (
    representationKind === "production_spoken" &&
    heart?.spokenPronunciation.status === "defined"
  ) {
    const variant = heart.spokenPronunciation.variants.find(
      (candidate) => candidate.reasonCode === null && candidate.canonicalVoicePath !== null,
    );
    if (variant) {
      const recurrence = new Map<string, number>();
      let pathIndex = 0;
      for (const nucleus of variant.nuclei) {
        const anchors = [...nucleus.voiceAnchors];
        const boundary = anchors.length > 1
          ? { startPathIndex: pathIndex, endPathIndex: pathIndex + anchors.length - 1 }
          : null;
        for (const voice of anchors) {
          const recurrenceIndex = (recurrence.get(voice) ?? 0) + 1;
          recurrence.set(voice, recurrenceIndex);
          events.push({
            layer: "DERIVED_STRUCTURE",
            pathIndex,
            voice,
            representationKind: "production_spoken",
            sourceIdentity: `${variant.variant.sourceProfileId}:${variant.variant.sourceNotation}:${variant.variant.sourceRevision}:${nucleus.sourceToken}`,
            nucleusIndex: nucleus.nucleusIndex,
            nucleusKind: nucleus.kind,
            movingNucleusBoundary: boundary,
            recurrenceIndex,
          });
          pathIndex += 1;
        }
      }
      return events;
    }
  }

  if (representationKind !== "unknown") {
    const recurrence = new Map<string, number>();
    return discovery.derivedStructure.voicePath.map((voice, pathIndex) => {
      const recurrenceIndex = (recurrence.get(voice) ?? 0) + 1;
      recurrence.set(voice, recurrenceIndex);
      return {
        layer: "DERIVED_STRUCTURE" as const,
        pathIndex,
        voice,
        representationKind,
        sourceIdentity: `${discovery.inputProfile}:profile-derived:${discovery.inputWord}`,
        nucleusIndex: pathIndex,
        nucleusKind: null,
        movingNucleusBoundary: null,
        recurrenceIndex,
      };
    });
  }

  return [];
}

function derivedStructureV0_2(
  discovery: MotivationEngineDiscoveryV0_1,
  heart?: HeartInstrumentV1,
): FunctionalMotivationDerivedStructureV0_2 {
  return {
    layer: "DERIVED_STRUCTURE",
    inputVoicePath: [...discovery.derivedStructure.voicePath],
    voicePathSource: discovery.derivedStructure.voicePathSource,
    nucleusEvents: nucleusEventsV0_2(discovery, heart),
    gamma: {
      status: discovery.derivedStructure.gamma.status,
      orderedUnits: [...discovery.derivedStructure.gamma.orderedUnits],
      reason: discovery.derivedStructure.gamma.reason,
    },
    zeroConsonantalStructuralComposition: {
      status: discovery.derivedStructure.zeroConsonantalStructuralComposition.status,
      variants: [...discovery.derivedStructure.zeroConsonantalStructuralComposition.variants],
      reason: discovery.derivedStructure.zeroConsonantalStructuralComposition.reason,
    },
    structuralHypotheses: discovery.derivedStructure.structuralHypotheses.map((hypothesis) => ({
      hypothesisId: hypothesis.hypothesisId,
      embryo: hypothesis.embryo,
      expansionChain: [...hypothesis.expansionChain],
      reasonCodes: [...hypothesis.reasonCodes],
    })),
  };
}

function reviewedEvidenceForCandidateV0_2(
  candidate: MotivationEngineDiscoveryCandidateV0_1,
): ReviewedFunctionalEvidenceReferenceV0_2 {
  const admitted =
    candidate.functionalInterpretation.status === "REVIEWED_HYPOTHESIS" &&
    candidate.functionalInterpretation.evidenceKind === "reviewed_functional_evidence" &&
    candidate.sourceFact.sourceStatus === "reviewed_accepted" &&
    candidate.functionalInterpretation.evidenceRefs.length > 0;

  return {
    layer: "REVIEWED_FUNCTIONAL_EVIDENCE",
    candidateId: candidate.candidateId,
    sourceId: candidate.sourceFact.sourceId,
    evidenceRefs: admitted
      ? [...candidate.functionalInterpretation.evidenceRefs].sort(compareTextV0_2)
      : [],
    sourceStatus: candidate.sourceFact.sourceStatus,
    authorityStatus: admitted ? "REVIEWED_ACCEPTED" : "UNKNOWN_OR_NULL",
    claimBoundary: "functional evidence only; not historical origin",
    reason: admitted ? null : "REVIEWED_FUNCTIONAL_EVIDENCE_NOT_AUTHORIZED",
  };
}

function structuralRelationAuthorizedV0_2(
  candidate: MotivationEngineDiscoveryCandidateV0_1,
): boolean {
  const comparison = candidate.structuralComparison;
  return (
    comparison.matchClassification === "STRUCTURAL_MOTIVATION_CANDIDATE" &&
    comparison.representationCompatibility !== "UNKNOWN" &&
    (
      comparison.authorizedOperationIds.length > 0 ||
      comparison.expansionOrCompositionChain.length > 0 ||
      candidate.derivedStructure.protoRoots.length > 0
    )
  );
}

function hypothesisV0_2(
  candidate: MotivationEngineDiscoveryCandidateV0_1,
  targetSense: FunctionalMotivationTargetSenseV0_2 | null,
  reviewed: ReviewedFunctionalEvidenceReferenceV0_2,
): FunctionalMotivationHypothesisV0_2 {
  if (candidate.structuralComparison.matchClassification === "EXACT_LEXICAL_SELF_MATCH") {
    return {
      layer: "UNKNOWN_OR_NULL",
      status: "UNKNOWN_OR_NULL",
      statement: null,
      evidenceRefs: [],
      reason: "LEXICAL_SELF_MATCH_NOT_FUNCTIONAL_MOTIVATION",
    };
  }
  if (!structuralRelationAuthorizedV0_2(candidate)) {
    return {
      layer: "UNKNOWN_OR_NULL",
      status: "UNKNOWN_OR_NULL",
      statement: null,
      evidenceRefs: [],
      reason: "NO_AUTHORIZED_STRUCTURAL_RELATION",
    };
  }
  if (targetSense === null) {
    return {
      layer: "UNKNOWN_OR_NULL",
      status: "UNKNOWN_OR_NULL",
      statement: null,
      evidenceRefs: [],
      reason: "MISSING_TARGET_SENSE",
    };
  }
  if (reviewed.authorityStatus !== "REVIEWED_ACCEPTED") {
    return {
      layer: "UNKNOWN_OR_NULL",
      status: "UNKNOWN_OR_NULL",
      statement: null,
      evidenceRefs: [],
      reason: "INSUFFICIENT_FUNCTIONAL_EVIDENCE",
    };
  }

  return {
    layer: "ZRO_FUNCTIONAL_HYPOTHESIS",
    status: "HYPOTHESIS",
    statement: candidate.functionalInterpretation.statement,
    evidenceRefs: [...reviewed.evidenceRefs],
    reason: null,
  };
}

function candidateInterpretationV0_2(
  candidate: MotivationEngineDiscoveryCandidateV0_1,
  targetSense: FunctionalMotivationTargetSenseV0_2 | null,
): FunctionalMotivationCandidateInterpretationV0_2 {
  const reviewed = reviewedEvidenceForCandidateV0_2(candidate);
  const hypothesis = hypothesisV0_2(candidate, targetSense, reviewed);
  const comparison = candidate.structuralComparison;
  const unresolvedReasons = hypothesis.status === "UNKNOWN_OR_NULL" && hypothesis.reason
    ? [hypothesis.reason]
    : [];

  return {
    candidateId: candidate.candidateId,
    candidateLanguage: candidate.candidateLanguage,
    candidateForm: candidate.candidateForm,
    candidateGloss: candidate.candidateGloss,
    candidateEmbryo: candidate.candidateEmbryo,
    sourceFact: sourceFactFromCandidateV0_2(candidate),
    correspondence: {
      layer: "DERIVED_STRUCTURE",
      matchClassification: comparison.matchClassification,
      presentationClassification: comparison.presentationClassification,
      matchedQuery: comparison.matchedQuery,
      inputRepresentationKind: comparison.inputRepresentationKind,
      candidateRepresentationKind: comparison.candidateRepresentationKind,
      representationCompatibility: comparison.representationCompatibility,
      inputVoicePath: [...comparison.inputVoicePath],
      candidateVoicePath: [...comparison.candidateVoicePath],
      candidateVoicePathStatus: comparison.candidateVoicePath.length > 0
        ? "AUTHORIZED"
        : "NULL_UNAUTHORIZED",
      voiceRelationship: comparison.voiceRelationship,
      gamma: comparison.inputConsonantalStructure.gamma
        ? [...comparison.inputConsonantalStructure.gamma]
        : null,
      zeroConsonantalStructuralComposition:
        comparison.inputConsonantalStructure.zeroConsonantalStructuralComposition
          ? [...comparison.inputConsonantalStructure.zeroConsonantalStructuralComposition]
          : null,
      operationIds: [...comparison.authorizedOperationIds].sort(compareTextV0_2),
      reasonCodes: [...comparison.reasonCodes].sort(compareTextV0_2),
      unresolvedFields: uniqueSortedV0_2(comparison.unresolvedFields),
      matchReason: comparison.matchReason,
    },
    reviewedFunctionalEvidence: reviewed,
    hypothesis,
    unresolved: uniqueSortedV0_2([
      ...comparison.unresolvedFields,
      ...unresolvedReasons,
    ]).map((reason) => ({
      layer: "UNKNOWN_OR_NULL" as const,
      reason,
    })),
    historicalRelation: "not_claimed",
    candidateTruthClaim: "not_claimed",
    winnerClaim: "not_claimed",
    languageSuperiorityClaim: "not_claimed",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  };
}

function buildInputV0_2(
  discovery: MotivationEngineDiscoveryV0_1,
  targetSense: FunctionalMotivationTargetSenseV0_2 | null,
  heart?: HeartInstrumentV1,
): FunctionalMotivationInterpretationInputV0_2 {
  const candidates = [...discovery.candidates].sort((left, right) =>
    compareTextV0_2(left.candidateId, right.candidateId),
  );
  const reviewedFunctionalEvidence = candidates
    .map(reviewedEvidenceForCandidateV0_2)
    .sort((left, right) => compareTextV0_2(left.candidateId, right.candidateId));

  return {
    schemaVersion: FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_2,
    inputWord: discovery.inputWord,
    targetSense,
    sourceFacts: [
      sourceFactFromInputV0_2(discovery),
      ...candidates.map(sourceFactFromCandidateV0_2),
    ],
    derivedStructure: derivedStructureV0_2(discovery, heart),
    candidates,
    reviewedFunctionalEvidence,
  };
}

const CLAIM_BOUNDARY_V0_2: FunctionalMotivationClaimBoundaryV0_2 = Object.freeze({
  historicalRelation: "not_claimed",
  historicalTransmission: "not_claimed",
  borrowingOrCognacy: "not_claimed",
  candidateTruthClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  consonantSemantics: "not_generated",
  spellingDerivedPronunciation: "not_authorized",
  nullIsValid: true,
});

export function projectFunctionalMotivationInterpretationV0_2(
  input: FunctionalMotivationInterpretationInputV0_2,
): FunctionalMotivationInterpretationV0_2 {
  const candidates = [...input.candidates]
    .sort((left, right) => compareTextV0_2(left.candidateId, right.candidateId))
    .map((candidate) => candidateInterpretationV0_2(candidate, input.targetSense));
  const unresolved = candidates
    .flatMap((candidate) => candidate.unresolved.map((item) => item.reason))
    .concat(input.targetSense === null && candidates.length > 0 ? ["MISSING_TARGET_SENSE"] : [])
    .filter((reason, index, values) => values.indexOf(reason) === index)
    .sort(compareTextV0_2)
    .map((reason) => ({ layer: "UNKNOWN_OR_NULL" as const, reason }));

  return deepFreezeV0_2({
    schemaVersion: FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_2,
    status: candidates.some((candidate) => candidate.hypothesis.status === "HYPOTHESIS")
      ? "INTERPRETATIONS_FOUND" as const
      : "NO_SUPPORTED_INTERPRETATION" as const,
    input: {
      inputWord: input.inputWord,
      targetSense: input.targetSense,
      sourceFacts: [...input.sourceFacts],
      derivedStructure: input.derivedStructure,
    },
    candidates,
    reviewedFunctionalEvidence: [...input.reviewedFunctionalEvidence],
    unresolved,
    claimBoundary: CLAIM_BOUNDARY_V0_2,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  });
}

export function buildFunctionalMotivationInterpretationV0_2(input: {
  discovery: MotivationEngineDiscoveryV0_1;
  targetSense: FunctionalMotivationTargetSenseV0_2 | null;
  heart?: HeartInstrumentV1;
}): FunctionalMotivationInterpretationV0_2 {
  return projectFunctionalMotivationInterpretationV0_2(
    buildInputV0_2(input.discovery, input.targetSense, input.heart),
  );
}

function stringArrayV0_2(value: unknown): value is readonly string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validTargetSenseV0_2(value: unknown): boolean {
  if (value === null) return true;
  if (!isRecordV0_2(value)) return false;
  return (
    typeof value.id === "string" && value.id.length > 0 &&
    typeof value.label === "string" && value.label.length > 0 &&
    value.authority === "EXPLICIT_USER_OR_AUTHORIZED_SOURCE"
  );
}

function validSourceFactV0_2(value: unknown): value is FunctionalMotivationSourceFactV0_2 {
  if (!isRecordV0_2(value)) return false;
  return (
    value.layer === "SOURCE_FACT" &&
    (value.scope === "input" || value.scope === "candidate") &&
    (value.candidateId === null || typeof value.candidateId === "string") &&
    typeof value.language === "string" &&
    typeof value.form === "string" &&
    (value.gloss === null || typeof value.gloss === "string") &&
    typeof value.sourceId === "string" &&
    typeof value.sourceStatus === "string" &&
    typeof value.attestationTruth === "string" &&
    stringArrayV0_2(value.citationRefs) &&
    (value.sourceUrlOrArchiveRef === null || typeof value.sourceUrlOrArchiveRef === "string") &&
    (value.entryLocator === null || typeof value.entryLocator === "string")
  );
}

function validDerivedStructureV0_2(value: unknown): boolean {
  if (!isRecordV0_2(value)) return false;
  const gamma = isRecordV0_2(value.gamma) ? value.gamma : null;
  const zc = isRecordV0_2(value.zeroConsonantalStructuralComposition)
    ? value.zeroConsonantalStructuralComposition
    : null;
  const events = Array.isArray(value.nucleusEvents) ? value.nucleusEvents : null;
  return (
    value.layer === "DERIVED_STRUCTURE" &&
    stringArrayV0_2(value.inputVoicePath) &&
    (value.voicePathSource === "production_spoken" || value.voicePathSource === "albanian_profile" || value.voicePathSource === "unknown") &&
    events !== null &&
    events.every((event) => {
      if (!isRecordV0_2(event)) return false;
      return (
        event.layer === "DERIVED_STRUCTURE" &&
        Number.isInteger(event.pathIndex) &&
        typeof event.voice === "string" &&
        typeof event.sourceIdentity === "string" &&
        (event.nucleusIndex === null || Number.isInteger(event.nucleusIndex)) &&
        (event.nucleusKind === null || typeof event.nucleusKind === "string") &&
        (event.movingNucleusBoundary === null || isRecordV0_2(event.movingNucleusBoundary)) &&
        Number.isInteger(event.recurrenceIndex)
      );
    }) &&
    gamma !== null &&
    (gamma.status === "source_pronunciation" || gamma.status === "profile_derived" || gamma.status === "NULL") &&
    stringArrayV0_2(gamma.orderedUnits) &&
    (gamma.reason === null || typeof gamma.reason === "string") &&
    zc !== null &&
    (zc.status === "source_pronunciation" || zc.status === "NULL") &&
    Array.isArray(zc.variants) &&
    (zc.reason === null || typeof zc.reason === "string") &&
    Array.isArray(value.structuralHypotheses)
  );
}

function validEvidenceV0_2(value: unknown): value is ReviewedFunctionalEvidenceReferenceV0_2 {
  if (!isRecordV0_2(value)) return false;
  return (
    value.layer === "REVIEWED_FUNCTIONAL_EVIDENCE" &&
    typeof value.candidateId === "string" &&
    typeof value.sourceId === "string" &&
    stringArrayV0_2(value.evidenceRefs) &&
    typeof value.sourceStatus === "string" &&
    (value.authorityStatus === "REVIEWED_ACCEPTED" || value.authorityStatus === "UNKNOWN_OR_NULL") &&
    value.claimBoundary === "functional evidence only; not historical origin" &&
    (value.reason === null || typeof value.reason === "string")
  );
}

export function isFunctionalMotivationInterpretationV0_2(
  value: unknown,
): value is FunctionalMotivationInterpretationV0_2 {
  if (!isRecordV0_2(value)) return false;
  const input = isRecordV0_2(value.input) ? value.input : null;
  const boundary = isRecordV0_2(value.claimBoundary) ? value.claimBoundary : null;
  const candidates = Array.isArray(value.candidates) ? value.candidates : null;
  const reviewed = Array.isArray(value.reviewedFunctionalEvidence)
    ? value.reviewedFunctionalEvidence
    : null;
  const unresolved = Array.isArray(value.unresolved) ? value.unresolved : null;
  return (
    value.schemaVersion === FUNCTIONAL_MOTIVATION_INTERPRETATION_SCHEMA_V0_2 &&
    (value.status === "INTERPRETATIONS_FOUND" || value.status === "NO_SUPPORTED_INTERPRETATION") &&
    input !== null &&
    typeof input.inputWord === "string" &&
    validTargetSenseV0_2(input.targetSense) &&
    Array.isArray(input.sourceFacts) &&
    input.sourceFacts.every(validSourceFactV0_2) &&
    validDerivedStructureV0_2(input.derivedStructure) &&
    candidates !== null &&
    candidates.every((candidate) => {
      if (!isRecordV0_2(candidate)) return false;
      const source = candidate.sourceFact;
      const correspondence = candidate.correspondence;
      const reviewedEvidence = candidate.reviewedFunctionalEvidence;
      const hypothesis = candidate.hypothesis;
      return (
        typeof candidate.candidateId === "string" &&
        typeof candidate.candidateLanguage === "string" &&
        typeof candidate.candidateForm === "string" &&
        typeof candidate.candidateGloss === "string" &&
        typeof candidate.candidateEmbryo === "string" &&
        validSourceFactV0_2(source) &&
        source.scope === "candidate" &&
        source.candidateId === candidate.candidateId &&
        isRecordV0_2(correspondence) &&
        correspondence.layer === "DERIVED_STRUCTURE" &&
        typeof correspondence.matchedQuery === "string" &&
        stringArrayV0_2(correspondence.inputVoicePath) &&
        stringArrayV0_2(correspondence.candidateVoicePath) &&
        validEvidenceV0_2(reviewedEvidence) &&
        reviewedEvidence.candidateId === candidate.candidateId &&
        isRecordV0_2(hypothesis) &&
        (hypothesis.layer === "ZRO_FUNCTIONAL_HYPOTHESIS" || hypothesis.layer === "UNKNOWN_OR_NULL") &&
        (hypothesis.status === "HYPOTHESIS" || hypothesis.status === "UNKNOWN_OR_NULL") &&
        (hypothesis.statement === null || typeof hypothesis.statement === "string") &&
        stringArrayV0_2(hypothesis.evidenceRefs) &&
        (hypothesis.reason === null || typeof hypothesis.reason === "string") &&
        Array.isArray(candidate.unresolved) &&
        candidate.unresolved.every((item) =>
          isRecordV0_2(item) && item.layer === "UNKNOWN_OR_NULL" && typeof item.reason === "string",
        ) &&
        candidate.historicalRelation === "not_claimed" &&
        candidate.candidateTruthClaim === "not_claimed" &&
        candidate.winnerClaim === "not_claimed" &&
        candidate.languageSuperiorityClaim === "not_claimed" &&
        candidate.userDecisionPosture === "user_decides" &&
        candidate.noSingleWinner === true
      );
    }) &&
    reviewed !== null &&
    reviewed.every(validEvidenceV0_2) &&
    unresolved !== null &&
    unresolved.every((item) =>
      isRecordV0_2(item) && item.layer === "UNKNOWN_OR_NULL" && typeof item.reason === "string",
    ) &&
    boundary !== null &&
    boundary.historicalRelation === "not_claimed" &&
    boundary.historicalTransmission === "not_claimed" &&
    boundary.borrowingOrCognacy === "not_claimed" &&
    boundary.candidateTruthClaim === "not_claimed" &&
    boundary.winnerClaim === "not_claimed" &&
    boundary.languageSuperiorityClaim === "not_claimed" &&
    boundary.consonantSemantics === "not_generated" &&
    boundary.spellingDerivedPronunciation === "not_authorized" &&
    boundary.nullIsValid === true &&
    value.userDecisionPosture === "user_decides" &&
    value.noSingleWinner === true
  );
}
