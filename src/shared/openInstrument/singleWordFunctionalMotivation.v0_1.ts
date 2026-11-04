import {
  analyzeStructuralInputV0_2,
  type StructuralInputAnalysisV0_2,
  type StructuralVoiceEventV0_2,
} from "@/shared/structuralHypothesisDiscovery.v0_2";

export const SINGLE_WORD_FUNCTIONAL_MOTIVATION_SCHEMA_V0_1 =
  "open-instrument.single-word-functional-motivation.v0_1" as const;

export type SingleWordSegmentEvidenceStatusV0_1 =
  | "USER_PROPOSED"
  | "CITATION_ENTERED_UNVERIFIED"
  | "UNKNOWN_OR_NULL";

export type SingleWordTransparencyV0_1 =
  | "ATOMIC"
  | "METAPHORICAL"
  | "OPAQUE"
  | "UNKNOWN_OR_NULL";

export type SingleWordFunctionalMotivationSegmentInputV0_1 = Readonly<{
  exactSpelling: string;
  proposedMeaning: string;
  proposedGrammaticalRole: string;
  language: string;
  dialect: string;
  evidenceStatus: SingleWordSegmentEvidenceStatusV0_1;
  evidenceReference: string;
  unresolved: boolean;
}>;

export type SingleWordFunctionalMotivationTransformationInputV0_1 = Readonly<{
  from: string;
  to: string;
  explanation: string;
  evidenceReference: string;
}>;

export type SingleWordFunctionalMotivationInputV0_1 = Readonly<{
  targetWord: string;
  targetLanguage: string;
  targetDialect: string;
  segments: readonly SingleWordFunctionalMotivationSegmentInputV0_1[];
  unresolvedConnectingMaterial: string;
  transformations: readonly SingleWordFunctionalMotivationTransformationInputV0_1[];
  functionalExplanation: string;
  transparency: SingleWordTransparencyV0_1;
}>;

export type SingleWordFunctionalMotivationProposalV0_1 = Readonly<{
  schemaVersion: typeof SINGLE_WORD_FUNCTIONAL_MOTIVATION_SCHEMA_V0_1;
  target: Readonly<{
    exactWord: string;
    language: string;
    dialect: string | null;
  }>;
  segments: readonly Readonly<{
    exactSpelling: string;
    proposedMeaning: string | null;
    proposedGrammaticalRole: string | null;
    language: string;
    dialect: string | null;
    unresolved: boolean;
    evidence: Readonly<{
      status: SingleWordSegmentEvidenceStatusV0_1;
      sourceReference: string | null;
      enteredBy: "USER";
      independentlyVerifiedByWorkbench: false;
    }>;
  }>[];
  unresolvedConnectingMaterial: string | null;
  declaredTransformations: readonly Readonly<{
    from: string;
    to: string;
    explanation: string | null;
    sourceReference: string | null;
    status: "USER_DECLARED_UNVERIFIED";
    appliedToReconstruction: false;
  }>[];
  reconstruction: Readonly<{
    exactConcatenation: string;
    targetSpelling: string;
    formExactMatch: boolean;
    formComparison: "EXACT_MATCH" | "MISMATCH";
    comparisonRule: "exact_string_equality_no_normalization_or_repair";
  }>;
  functionalMotivation: Readonly<{
    explanation: string;
    transparency: SingleWordTransparencyV0_1;
    evidenceStatus: "PROPOSED";
  }>;
  strictEmbryoMeaning: Readonly<{
    status: "UNKNOWN_OR_NULL";
    meaning: null;
    reasonCode: "USER_PROPOSAL_DOES_NOT_ESTABLISH_EMBRYO_MEANING";
  }>;
  compoundAttestation: "NOT_CLAIMED";
  historicalOrigin: "NOT_CLAIMED";
  writtenStructure: Readonly<{
    status: "COMPLETE" | "UNKNOWN_OR_NULL";
    voicePath: readonly string[];
    voiceEvents: readonly StructuralVoiceEventV0_2[];
    eventCount: number | null;
    sourcePositionUnit: "unicode_code_point_in_nfc_input";
    representationAuthority: "orthographic";
    pronunciationAuthority: "not_established";
    reasonCode: string | null;
  }>;
  candidateStatus: "PROPOSED";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type SingleWordFunctionalMotivationBuildResultV0_1 =
  | Readonly<{ status: "READY"; proposal: SingleWordFunctionalMotivationProposalV0_1 }>
  | Readonly<{ status: "INVALID"; reasonCodes: readonly string[] }>;

const EVIDENCE_STATUSES_V0_1 = new Set<SingleWordSegmentEvidenceStatusV0_1>([
  "USER_PROPOSED",
  "CITATION_ENTERED_UNVERIFIED",
  "UNKNOWN_OR_NULL",
]);

const TRANSPARENCY_LEVELS_V0_1 = new Set<SingleWordTransparencyV0_1>([
  "ATOMIC",
  "METAPHORICAL",
  "OPAQUE",
  "UNKNOWN_OR_NULL",
]);

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function singleToken(value: unknown): value is string {
  return nonEmpty(value) && !/\s/u.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateInputV0_1(input: unknown): string[] {
  if (!isRecord(input)) return ["MALFORMED_PROPOSAL"];

  const reasons: string[] = [];
  if (!singleToken(input.targetWord) || Array.from(input.targetWord).length > 80) {
    reasons.push("TARGET_WORD_REQUIRED_AS_ONE_SUPPORTED_TOKEN");
  }
  if (!nonEmpty(input.targetLanguage) || input.targetLanguage.length > 80) {
    reasons.push("TARGET_LANGUAGE_REQUIRED");
  }
  if (typeof input.targetDialect !== "string" || input.targetDialect.length > 80) {
    reasons.push("TARGET_DIALECT_MALFORMED");
  }
  if (!Array.isArray(input.segments) || input.segments.length < 2 || input.segments.length > 12) {
    reasons.push("TWO_TO_TWELVE_ORDERED_SEGMENTS_REQUIRED");
  } else {
    for (const [index, segment] of input.segments.entries()) {
      if (!isRecord(segment)) {
        reasons.push(`SEGMENT_${index + 1}_MALFORMED`);
        continue;
      }
      if (!singleToken(segment.exactSpelling) || Array.from(segment.exactSpelling).length > 80) {
        reasons.push(`SEGMENT_${index + 1}_EXACT_SPELLING_REQUIRED`);
      }
      if (typeof segment.unresolved !== "boolean") {
        reasons.push(`SEGMENT_${index + 1}_UNRESOLVED_FLAG_REQUIRED`);
      }
      if (typeof segment.proposedMeaning !== "string" || segment.proposedMeaning.length > 300) {
        reasons.push(`SEGMENT_${index + 1}_MEANING_MALFORMED`);
      } else if (!segment.unresolved && !nonEmpty(segment.proposedMeaning)) {
        reasons.push(`SEGMENT_${index + 1}_MEANING_AND_ROLE_REQUIRED_OR_MARK_UNRESOLVED`);
      }
      if (typeof segment.proposedGrammaticalRole !== "string" || segment.proposedGrammaticalRole.length > 200) {
        reasons.push(`SEGMENT_${index + 1}_GRAMMATICAL_ROLE_MALFORMED`);
      } else if (!segment.unresolved && !nonEmpty(segment.proposedGrammaticalRole)) {
        reasons.push(`SEGMENT_${index + 1}_MEANING_AND_ROLE_REQUIRED_OR_MARK_UNRESOLVED`);
      }
      if (!nonEmpty(segment.language) || segment.language.length > 80) {
        reasons.push(`SEGMENT_${index + 1}_LANGUAGE_REQUIRED`);
      } else if (segment.language !== input.targetLanguage) {
        reasons.push(`SEGMENT_${index + 1}_LANGUAGE_MUST_MATCH_TARGET`);
      }
      if (typeof segment.dialect !== "string" || segment.dialect.length > 80) {
        reasons.push(`SEGMENT_${index + 1}_DIALECT_MALFORMED`);
      }
      if (!EVIDENCE_STATUSES_V0_1.has(segment.evidenceStatus as SingleWordSegmentEvidenceStatusV0_1)) {
        reasons.push(`SEGMENT_${index + 1}_EVIDENCE_STATUS_UNSUPPORTED`);
      }
      if (typeof segment.evidenceReference !== "string" || segment.evidenceReference.length > 500) {
        reasons.push(`SEGMENT_${index + 1}_EVIDENCE_REFERENCE_MALFORMED`);
      } else if (
        segment.evidenceStatus === "CITATION_ENTERED_UNVERIFIED" &&
        !nonEmpty(segment.evidenceReference)
      ) {
        reasons.push(`SEGMENT_${index + 1}_CITATION_REFERENCE_REQUIRED`);
      }
    }
  }
  if (typeof input.unresolvedConnectingMaterial !== "string" || input.unresolvedConnectingMaterial.length > 500) {
    reasons.push("UNRESOLVED_CONNECTING_MATERIAL_MALFORMED");
  }
  if (!Array.isArray(input.transformations) || input.transformations.length > 8) {
    reasons.push("ZERO_TO_EIGHT_TRANSFORMATIONS_REQUIRED");
  } else {
    for (const [index, transformation] of input.transformations.entries()) {
      if (!isRecord(transformation) || !nonEmpty(transformation.from) || !nonEmpty(transformation.to)) {
        reasons.push(`TRANSFORMATION_${index + 1}_SOURCE_AND_TARGET_REQUIRED`);
        continue;
      }
      if (transformation.from.length > 80 || transformation.to.length > 80 ||
        typeof transformation.explanation !== "string" || transformation.explanation.length > 300 ||
        typeof transformation.evidenceReference !== "string" || transformation.evidenceReference.length > 500) {
        reasons.push(`TRANSFORMATION_${index + 1}_MALFORMED`);
      }
    }
  }
  if (!nonEmpty(input.functionalExplanation) || input.functionalExplanation.length > 1000) {
    reasons.push("FUNCTIONAL_EXPLANATION_REQUIRED");
  }
  if (!TRANSPARENCY_LEVELS_V0_1.has(input.transparency as SingleWordTransparencyV0_1)) {
    reasons.push("TRANSPARENCY_LEVEL_UNSUPPORTED");
  }
  return [...new Set(reasons)];
}

export function buildSingleWordFunctionalMotivationProposalV0_1(
  input: SingleWordFunctionalMotivationInputV0_1,
): SingleWordFunctionalMotivationBuildResultV0_1 {
  const reasonCodes = validateInputV0_1(input);
  if (reasonCodes.length) return { status: "INVALID", reasonCodes };

  let analysis: StructuralInputAnalysisV0_2;
  try {
    analysis = analyzeStructuralInputV0_2(input.targetWord);
  } catch {
    return { status: "INVALID", reasonCodes: ["ORTHOGRAPHIC_STRUCTURE_ANALYSIS_FAILED"] };
  }

  const exactConcatenation = input.segments.map((segment) => segment.exactSpelling).join("");
  const formExactMatch = exactConcatenation === input.targetWord;
  const voiceEvents = analysis.inputVoiceSequenceStatus === "complete"
    ? analysis.inputVoiceEvents.map((event) => ({ ...event, sourceSpan: { ...event.sourceSpan } }))
    : [];

  return {
    status: "READY",
    proposal: {
      schemaVersion: SINGLE_WORD_FUNCTIONAL_MOTIVATION_SCHEMA_V0_1,
      target: {
        exactWord: input.targetWord,
        language: input.targetLanguage,
        dialect: input.targetDialect.trim() ? input.targetDialect : null,
      },
      segments: input.segments.map((segment) => ({
        exactSpelling: segment.exactSpelling,
        proposedMeaning: segment.proposedMeaning.trim() || null,
        proposedGrammaticalRole: segment.proposedGrammaticalRole.trim() || null,
        language: segment.language,
        dialect: segment.dialect.trim() || null,
        unresolved: segment.unresolved,
        evidence: {
          status: segment.evidenceStatus,
          sourceReference: segment.evidenceReference.trim() || null,
          enteredBy: "USER",
          independentlyVerifiedByWorkbench: false,
        },
      })),
      unresolvedConnectingMaterial: input.unresolvedConnectingMaterial.trim() || null,
      declaredTransformations: input.transformations.map((transformation) => ({
        from: transformation.from,
        to: transformation.to,
        explanation: transformation.explanation.trim() || null,
        sourceReference: transformation.evidenceReference.trim() || null,
        status: "USER_DECLARED_UNVERIFIED",
        appliedToReconstruction: false,
      })),
      reconstruction: {
        exactConcatenation,
        targetSpelling: input.targetWord,
        formExactMatch,
        formComparison: formExactMatch ? "EXACT_MATCH" : "MISMATCH",
        comparisonRule: "exact_string_equality_no_normalization_or_repair",
      },
      functionalMotivation: {
        explanation: input.functionalExplanation,
        transparency: input.transparency,
        evidenceStatus: "PROPOSED",
      },
      strictEmbryoMeaning: {
        status: "UNKNOWN_OR_NULL",
        meaning: null,
        reasonCode: "USER_PROPOSAL_DOES_NOT_ESTABLISH_EMBRYO_MEANING",
      },
      compoundAttestation: "NOT_CLAIMED",
      historicalOrigin: "NOT_CLAIMED",
      writtenStructure: {
        status: analysis.inputVoiceSequenceStatus === "complete" ? "COMPLETE" : "UNKNOWN_OR_NULL",
        voicePath: voiceEvents.map((event) => event.voice),
        voiceEvents,
        eventCount: analysis.inputVoiceSequenceStatus === "complete" ? voiceEvents.length : null,
        sourcePositionUnit: "unicode_code_point_in_nfc_input",
        representationAuthority: "orthographic",
        pronunciationAuthority: "not_established",
        reasonCode: analysis.inputVoiceSequenceStatus === "complete" ? null : analysis.inputVoiceSequenceStatus,
      },
      candidateStatus: "PROPOSED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    },
  };
}
