import {
  analyzeStructuralInputV0_2,
  type StructuralVoiceEventV0_2,
} from "@/shared/structuralHypothesisDiscovery.v0_2";

export const SINGLE_WORD_FUNCTIONAL_MOTIVATION_SCHEMA_V0_2 =
  "open-instrument.single-word-functional-motivation.v0_2" as const;

export type WholeWordOpaqueSourceEvidenceStatusV0_2 =
  | "CITATION_ENTERED_UNVERIFIED"
  | "UNKNOWN_OR_NULL";

export type WholeWordOpaqueFunctionalMotivationInputV0_2 = Readonly<{
  mode: "WHOLE_WORD_OPAQUE";
  targetWord: string;
  targetLanguage: string;
  targetDialect: string;
  wholeWordMeaningClaim: string;
  sourceEvidenceStatus: WholeWordOpaqueSourceEvidenceStatusV0_2;
  sourceReference: string;
  functionalDescription: string;
}>;

export type WholeWordOpaqueFunctionalMotivationProposalV0_2 = Readonly<{
  schemaVersion: typeof SINGLE_WORD_FUNCTIONAL_MOTIVATION_SCHEMA_V0_2;
  mode: "WHOLE_WORD_OPAQUE";
  target: Readonly<{
    exactWord: string;
    language: string;
    dialect: string | null;
  }>;
  proposedComponents: readonly [];
  wholeWordMeaningClaim: Readonly<{
    text: string | null;
    status: "USER_PROPOSED" | "UNKNOWN_OR_NULL";
    enteredBy: "USER";
  }>;
  wholeWordSourceEvidence: Readonly<{
    status: WholeWordOpaqueSourceEvidenceStatusV0_2;
    sourceReference: string | null;
    enteredBy: "USER";
    independentlyVerifiedByWorkbench: false;
  }>;
  componentReconstruction: Readonly<{
    status: "NOT_APPLICABLE";
    componentCount: 0;
    reasonCode: "WHOLE_WORD_OPAQUE_HAS_NO_PROPOSED_COMPONENTS";
  }>;
  internalFunctionalStructure: Readonly<{
    status: "UNKNOWN_OR_NULL";
    meaning: null;
    reasonCode: "NO_COMPONENT_STRUCTURE_PROPOSED";
  }>;
  functionalMotivation: Readonly<{
    description: string | null;
    status: "USER_PROPOSED" | "UNKNOWN_OR_NULL";
    enteredBy: "USER";
  }>;
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
  strictEmbryoMeaning: Readonly<{
    status: "UNKNOWN_OR_NULL";
    meaning: null;
  }>;
  compoundAttestation: "NOT_CLAIMED";
  historicalOrigin: "NOT_CLAIMED";
  sourceAuthorityPromotion: "NONE";
  candidateStatus: "PROPOSED";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type WholeWordOpaqueFunctionalMotivationBuildResultV0_2 =
  | Readonly<{ status: "READY"; proposal: WholeWordOpaqueFunctionalMotivationProposalV0_2 }>
  | Readonly<{ status: "INVALID"; reasonCodes: readonly string[] }>;

function nonEmpty(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function singleToken(value: unknown): value is string {
  return nonEmpty(value) && !/\s/u.test(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function validateInputV0_2(input: unknown): string[] {
  if (!isRecord(input)) return ["MALFORMED_OPAQUE_PROPOSAL"];

  const reasons: string[] = [];
  if (input.mode !== "WHOLE_WORD_OPAQUE") reasons.push("WHOLE_WORD_OPAQUE_MODE_REQUIRED");
  if (!singleToken(input.targetWord) || Array.from(input.targetWord).length > 80) {
    reasons.push("TARGET_WORD_REQUIRED_AS_ONE_SUPPORTED_TOKEN");
  }
  if (!nonEmpty(input.targetLanguage) || input.targetLanguage.length > 80) {
    reasons.push("TARGET_LANGUAGE_REQUIRED");
  }
  if (typeof input.targetDialect !== "string" || input.targetDialect.length > 80) {
    reasons.push("TARGET_DIALECT_MALFORMED");
  }
  if (typeof input.wholeWordMeaningClaim !== "string" || input.wholeWordMeaningClaim.length > 300) {
    reasons.push("WHOLE_WORD_MEANING_CLAIM_MALFORMED");
  }
  if (input.sourceEvidenceStatus !== "CITATION_ENTERED_UNVERIFIED" && input.sourceEvidenceStatus !== "UNKNOWN_OR_NULL") {
    reasons.push("WHOLE_WORD_SOURCE_EVIDENCE_STATUS_UNSUPPORTED");
  }
  if (typeof input.sourceReference !== "string" || input.sourceReference.length > 500) {
    reasons.push("WHOLE_WORD_SOURCE_REFERENCE_MALFORMED");
  } else if (input.sourceEvidenceStatus === "CITATION_ENTERED_UNVERIFIED" && !nonEmpty(input.sourceReference)) {
    reasons.push("WHOLE_WORD_CITATION_REFERENCE_REQUIRED");
  } else if (input.sourceEvidenceStatus === "UNKNOWN_OR_NULL" && nonEmpty(input.sourceReference)) {
    reasons.push("WHOLE_WORD_REFERENCE_REQUIRES_CITATION_STATUS");
  }
  if (typeof input.functionalDescription !== "string" || input.functionalDescription.length > 1000) {
    reasons.push("WHOLE_WORD_FUNCTIONAL_DESCRIPTION_MALFORMED");
  }
  return [...new Set(reasons)];
}

export function buildWholeWordOpaqueFunctionalMotivationV0_2(
  input: WholeWordOpaqueFunctionalMotivationInputV0_2,
): WholeWordOpaqueFunctionalMotivationBuildResultV0_2 {
  const reasonCodes = validateInputV0_2(input);
  if (reasonCodes.length) return { status: "INVALID", reasonCodes };

  let analysis;
  try {
    analysis = analyzeStructuralInputV0_2(input.targetWord);
  } catch {
    return { status: "INVALID", reasonCodes: ["ORTHOGRAPHIC_STRUCTURE_ANALYSIS_FAILED"] };
  }

  const voiceEvents = analysis.inputVoiceSequenceStatus === "complete"
    ? analysis.inputVoiceEvents.map((event) => ({ ...event, sourceSpan: { ...event.sourceSpan } }))
    : [];
  const wholeWordMeaning = input.wholeWordMeaningClaim.trim();
  const functionalDescription = input.functionalDescription.trim();

  return {
    status: "READY",
    proposal: {
      schemaVersion: SINGLE_WORD_FUNCTIONAL_MOTIVATION_SCHEMA_V0_2,
      mode: "WHOLE_WORD_OPAQUE",
      target: {
        exactWord: input.targetWord,
        language: input.targetLanguage,
        dialect: input.targetDialect.trim() ? input.targetDialect : null,
      },
      proposedComponents: [],
      wholeWordMeaningClaim: {
        text: wholeWordMeaning || null,
        status: wholeWordMeaning ? "USER_PROPOSED" : "UNKNOWN_OR_NULL",
        enteredBy: "USER",
      },
      wholeWordSourceEvidence: {
        status: input.sourceEvidenceStatus,
        sourceReference: input.sourceReference.trim() || null,
        enteredBy: "USER",
        independentlyVerifiedByWorkbench: false,
      },
      componentReconstruction: {
        status: "NOT_APPLICABLE",
        componentCount: 0,
        reasonCode: "WHOLE_WORD_OPAQUE_HAS_NO_PROPOSED_COMPONENTS",
      },
      internalFunctionalStructure: {
        status: "UNKNOWN_OR_NULL",
        meaning: null,
        reasonCode: "NO_COMPONENT_STRUCTURE_PROPOSED",
      },
      functionalMotivation: {
        description: functionalDescription || null,
        status: functionalDescription ? "USER_PROPOSED" : "UNKNOWN_OR_NULL",
        enteredBy: "USER",
      },
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
      strictEmbryoMeaning: { status: "UNKNOWN_OR_NULL", meaning: null },
      compoundAttestation: "NOT_CLAIMED",
      historicalOrigin: "NOT_CLAIMED",
      sourceAuthorityPromotion: "NONE",
      candidateStatus: "PROPOSED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    },
  };
}
