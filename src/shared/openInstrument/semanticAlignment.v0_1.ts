import {
  projectSevenVoiceDoctrineV0_1,
  type DoctrineProjectionSuccessV0_1,
} from "@/shared/openInstrument/doctrineProjection.v0_1";
import type {
  StructuralHypothesisV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";
import type { SevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";

export const SEMANTIC_ALIGNMENT_SCHEMA_V0_1 =
  "open-instrument.semantic-alignment.v0_1" as const;

export type SemanticAlignmentStatusV0_1 =
  | "proposed"
  | "unknown"
  | "rejected";

export type SemanticAlignmentSourceV0_1 =
  | "provider_proposed_hypothesis"
  | "user_asserted_hypothesis"
  | "deterministic_no_alignment";

export type SemanticAlignmentContextV0_1 = Readonly<{
  schemaVersion: typeof SEMANTIC_ALIGNMENT_SCHEMA_V0_1;
  targetWord: string;
  targetSenseId: string;
  targetSenseLabel: string;
  targetSenseDefinition?: string;
  structuralHypothesisId: string;
  embryo: string;
  expansionChain: readonly string[];
  reductionOperationIds: readonly string[];
  voicePath: readonly SevenVoiceKey[];
  doctrineProjection: DoctrineProjectionSuccessV0_1;
  permittedTransforms: readonly string[];
  claimBoundary: Readonly<{
    historicalOriginClaim: "not_claimed";
    historicalTransmissionClaim: "not_claimed";
    winnerClaim: "not_claimed";
    languageSuperiorityClaim: "not_claimed";
    candidateTruthClaim: "not_claimed";
    userDecisionPosture: "user_decides";
  }>;
}>;

export type SemanticAlignmentAssessmentV0_1 = Readonly<{
  schemaVersion: typeof SEMANTIC_ALIGNMENT_SCHEMA_V0_1;
  targetWord: string;
  targetSenseId: string;
  targetSenseLabel: string;
  structuralHypothesisId: string;
  alignmentStatus: SemanticAlignmentStatusV0_1;
  alignmentSource: SemanticAlignmentSourceV0_1;
  semanticBridge: string | null;
  doctrineRoles: readonly string[];
  reasonCodes: readonly string[];
  providerId?: string;
  modelId?: string;
}>;

export type SemanticAlignmentContextResultV0_1 =
  | Readonly<{
      ok: true;
      context: SemanticAlignmentContextV0_1;
    }>
  | Readonly<{
      ok: false;
      reasonCodes: readonly string[];
    }>;

export type SemanticAlignmentParseResultV0_1 =
  | Readonly<{
      ok: true;
      assessment: SemanticAlignmentAssessmentV0_1;
    }>
  | Readonly<{
      ok: false;
      reasonCodes: readonly string[];
    }>;

type RecordV0_1 = Record<string, unknown>;

function isRecordV0_1(value: unknown): value is RecordV0_1 {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function textV0_1(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFKC").trim() : "";
}

function stringArrayV0_1(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return null;
  }

  return value.map((item) => textV0_1(item));
}

function failureV0_1(
  reasonCodes: readonly string[],
): SemanticAlignmentContextResultV0_1 {
  return { ok: false, reasonCodes };
}

function parseFailureV0_1(
  reasonCodes: readonly string[],
): SemanticAlignmentParseResultV0_1 {
  return { ok: false, reasonCodes };
}

export function buildSemanticAlignmentContextV0_1(
  input: Readonly<{
    targetWord: unknown;
    targetSenseId: unknown;
    targetSenseLabel: unknown;
    targetSenseDefinition?: unknown;
    structuralHypothesis: unknown;
  }>,
): SemanticAlignmentContextResultV0_1 {
  const targetWord = textV0_1(input?.targetWord);
  const targetSenseId = textV0_1(input?.targetSenseId);
  const targetSenseLabel = textV0_1(input?.targetSenseLabel);
  const targetSenseDefinition = textV0_1(input?.targetSenseDefinition);
  const structural = isRecordV0_1(input?.structuralHypothesis)
    ? input.structuralHypothesis
    : null;

  if (!targetWord) return failureV0_1(["TARGET_WORD_REQUIRED"]);
  if (!targetSenseId || !targetSenseLabel) {
    return failureV0_1(["TARGET_SENSE_REQUIRED"]);
  }
  if (!structural) return failureV0_1(["STRUCTURAL_HYPOTHESIS_REQUIRED"]);

  const reductionSteps = Array.isArray(structural.reductionSteps)
    ? structural.reductionSteps
    : [];
  const terminalReductionStep = reductionSteps.at(-1);
  const voicePath = stringArrayV0_1(
    isRecordV0_1(terminalReductionStep)
      ? terminalReductionStep.voicePathAfter
      : null,
  );
  const expansionChain = stringArrayV0_1(structural.expansionChain);
  const reductionOperationIds = reductionSteps
    ? reductionSteps.map((step) =>
        isRecordV0_1(step) ? textV0_1(step.operationId) : "",
      )
    : null;
  const embryo = textV0_1(structural.embryo);
  const structuralHypothesisId = textV0_1(structural.hypothesisId);

  if (!voicePath || voicePath.length === 0) {
    return failureV0_1(["VOICE_PATH_REQUIRED"]);
  }
  if (!expansionChain || expansionChain.length < 2) {
    return failureV0_1(["EXPANSION_CHAIN_REQUIRED"]);
  }
  if (
    !reductionOperationIds ||
    reductionOperationIds.length === 0 ||
    reductionOperationIds.some((operationId) => !operationId)
  ) {
    return failureV0_1(["REDUCTION_OPERATIONS_REQUIRED"]);
  }
  if (!embryo || !structuralHypothesisId) {
    return failureV0_1(["STRUCTURAL_IDENTITY_REQUIRED"]);
  }

  const doctrineProjection = projectSevenVoiceDoctrineV0_1(voicePath);
  if (!doctrineProjection.ok) {
    return failureV0_1([
      "DOCTRINE_PROJECTION_REJECTED",
      ...doctrineProjection.reasonCodes,
    ]);
  }

  return {
    ok: true,
    context: {
      schemaVersion: SEMANTIC_ALIGNMENT_SCHEMA_V0_1,
      targetWord,
      targetSenseId,
      targetSenseLabel,
      ...(targetSenseDefinition ? { targetSenseDefinition } : {}),
      structuralHypothesisId,
      embryo,
      expansionChain,
      reductionOperationIds,
      voicePath: doctrineProjection.inputPath,
      doctrineProjection,
      permittedTransforms: reductionOperationIds,
      claimBoundary: {
        historicalOriginClaim: "not_claimed",
        historicalTransmissionClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        userDecisionPosture: "user_decides",
      },
    },
  };
}

function qualityFailureCodesV0_1(
  bridge: string,
  context: SemanticAlignmentContextV0_1,
): string[] {
  const lowerBridge = bridge.toLocaleLowerCase("en-US");
  const lowerSense = context.targetSenseLabel.toLocaleLowerCase("en-US");
  const lowerWord = context.targetWord.toLocaleLowerCase("en-US");
  const forbiddenClaimLanguage =
    /\b(?:proven|true meaning|historical origin|historically|winner|language superiority|candidate truth|reviewed evidence|dictionary|cognat|borrow(?:ed|ing)?|transmission)\b/i;
  const codes: string[] = [];

  if (bridge.length < 24) codes.push("SEMANTIC_BRIDGE_TOO_SHORT");
  if (lowerSense && lowerBridge.includes(lowerSense)) {
    codes.push("SEMANTIC_BRIDGE_REPEATS_TARGET_SENSE");
  }
  if (lowerWord && lowerBridge === lowerWord) {
    codes.push("SEMANTIC_BRIDGE_REPEATS_TARGET_WORD");
  }
  if (forbiddenClaimLanguage.test(bridge)) {
    codes.push("FORBIDDEN_SEMANTIC_CLAIM_LANGUAGE");
  }

  return codes;
}

export function parseSemanticAlignmentProposalV0_1(
  value: unknown,
  context: SemanticAlignmentContextV0_1,
  metadata: Readonly<{
    alignmentSource: SemanticAlignmentSourceV0_1;
    providerId?: string;
    modelId?: string;
  }>,
): SemanticAlignmentParseResultV0_1 {
  if (!isRecordV0_1(value)) {
    return parseFailureV0_1(["MALFORMED_ALIGNMENT_OUTPUT"]);
  }

  const alignmentStatus = textV0_1(value.alignmentStatus);
  const allowedStatuses = new Set<SemanticAlignmentStatusV0_1>([
    "proposed",
    "unknown",
    "rejected",
  ]);
  if (!allowedStatuses.has(alignmentStatus as SemanticAlignmentStatusV0_1)) {
    return parseFailureV0_1(["ALIGNMENT_STATUS_INVALID"]);
  }

  const doctrineRoles = stringArrayV0_1(value.doctrineRoles);
  if (!doctrineRoles || doctrineRoles.some((role) => !role)) {
    return parseFailureV0_1(["DOCTRINE_ROLES_INVALID"]);
  }

  const allowedRoles = new Set(
    context.doctrineProjection.projections.map((projection) => projection.doctrineRole),
  );
  if (
    doctrineRoles.some(
      (role) => !allowedRoles.has(role as (typeof context.doctrineProjection.projections)[number]["doctrineRole"]),
    )
  ) {
    return parseFailureV0_1(["DOCTRINE_ROLE_NOT_IN_CONTEXT"]);
  }

  const semanticBridge = textV0_1(value.semanticBridge);
  const status = alignmentStatus as SemanticAlignmentStatusV0_1;
  if (status === "proposed") {
    if (metadata.alignmentSource !== "provider_proposed_hypothesis" &&
        metadata.alignmentSource !== "user_asserted_hypothesis") {
      return parseFailureV0_1(["PROPOSED_SOURCE_INVALID"]);
    }
    if (!semanticBridge) {
      return parseFailureV0_1(["SEMANTIC_BRIDGE_REQUIRED"]);
    }
    const qualityCodes = qualityFailureCodesV0_1(semanticBridge, context);
    if (qualityCodes.length > 0) return parseFailureV0_1(qualityCodes);
    if (doctrineRoles.length === 0) {
      return parseFailureV0_1(["DOCTRINE_ROLE_REQUIRED"]);
    }
  } else if (semanticBridge || doctrineRoles.length > 0) {
    return parseFailureV0_1(["NON_PROPOSED_OUTPUT_MUST_BE_EMPTY"]);
  }

  return {
    ok: true,
    assessment: {
      schemaVersion: SEMANTIC_ALIGNMENT_SCHEMA_V0_1,
      targetWord: context.targetWord,
      targetSenseId: context.targetSenseId,
      targetSenseLabel: context.targetSenseLabel,
      structuralHypothesisId: context.structuralHypothesisId,
      alignmentStatus: status,
      alignmentSource: metadata.alignmentSource,
      semanticBridge: status === "proposed" ? semanticBridge : null,
      doctrineRoles: status === "proposed" ? doctrineRoles : [],
      reasonCodes: stringArrayV0_1(value.reasonCodes) ?? [],
      ...(metadata.providerId ? { providerId: metadata.providerId } : {}),
      ...(metadata.modelId ? { modelId: metadata.modelId } : {}),
    },
  };
}

export function deterministicNoAlignmentV0_1(
  context: SemanticAlignmentContextV0_1,
  reasonCodes: readonly string[] = ["SEMANTIC_ALIGNMENT_UNAVAILABLE"],
): SemanticAlignmentAssessmentV0_1 {
  return {
    schemaVersion: SEMANTIC_ALIGNMENT_SCHEMA_V0_1,
    targetWord: context.targetWord,
    targetSenseId: context.targetSenseId,
    targetSenseLabel: context.targetSenseLabel,
    structuralHypothesisId: context.structuralHypothesisId,
    alignmentStatus: "unknown",
    alignmentSource: "deterministic_no_alignment",
    semanticBridge: null,
    doctrineRoles: [],
    reasonCodes: [...reasonCodes],
  };
}
