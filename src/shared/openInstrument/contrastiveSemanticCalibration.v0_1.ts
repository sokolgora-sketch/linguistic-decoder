import {
  buildSemanticAlignmentContextV0_1,
  SEMANTIC_ALIGNMENT_SCHEMA_V0_1,
  type SemanticAlignmentContextV0_1,
} from "@/shared/openInstrument/semanticAlignment.v0_1";
import type { DoctrineProjectionSuccessV0_1 } from "@/shared/openInstrument/doctrineProjection.v0_1";
import type { StructuralHypothesisV0_1 } from "@/shared/structuralHypothesisDiscovery.v0_1";

export const CONTRASTIVE_SEMANTIC_DECISION_CONTRACT_VERSION_V0_1 =
  "open-instrument.semantic-contrastive-decision-contract.v0_1" as const;

export const CONTROLLED_SEMANTIC_CONTRASTIVE_RUNNER_SCHEMA_V0_1 =
  "open-instrument.controlled-semantic-contrastive-runner.v0_1" as const;

export type ContrastiveSemanticSlotV0_1 = "sense_a" | "sense_b";
export type ContrastivePreferredSenseV0_1 =
  | ContrastiveSemanticSlotV0_1
  | "neither"
  | "both_or_unclear";

export type ContrastiveSemanticOptionV0_1 = Readonly<{
  targetSenseId: string;
  targetSenseLabel: string;
  targetSenseDefinition: string;
}>;

export type ContrastiveSemanticPairV0_1 = Readonly<{
  word: string;
  structuralHypothesisId: string;
  senseA: ContrastiveSemanticOptionV0_1;
  senseB: ContrastiveSemanticOptionV0_1;
}>;

export type ContrastiveSemanticContextV0_1 = Readonly<{
  schemaVersion: typeof SEMANTIC_ALIGNMENT_SCHEMA_V0_1;
  targetWord: string;
  structuralHypothesisId: string;
  embryo: string;
  expansionChain: readonly string[];
  reductionOperationIds: readonly string[];
  voicePath: SemanticAlignmentContextV0_1["voicePath"];
  doctrineProjection: DoctrineProjectionSuccessV0_1;
  permittedTransforms: readonly string[];
  claimBoundary: SemanticAlignmentContextV0_1["claimBoundary"];
  semanticOptions: Readonly<{
    sense_a: SemanticAlignmentContextV0_1;
    sense_b: SemanticAlignmentContextV0_1;
  }>;
}>;

export type ContrastiveSupportTraceV0_1 = Readonly<{
  structuralElements: readonly string[];
  doctrineRoles: readonly string[];
}>;

export type ContrastiveSemanticAssessmentV0_1 = Readonly<{
  schemaVersion: typeof SEMANTIC_ALIGNMENT_SCHEMA_V0_1;
  targetWord: string;
  structuralHypothesisId: string;
  preferredSense: ContrastivePreferredSenseV0_1;
  alignmentStatus: "proposed" | "unknown";
  semanticBridge: string | null;
  doctrineRoles: readonly string[];
  supportTrace: ContrastiveSupportTraceV0_1 | null;
  reasonCodes: readonly string[];
  providerId?: string;
  modelId?: string;
}>;

export type ContrastiveSemanticParseResultV0_1 =
  | Readonly<{ ok: true; assessment: ContrastiveSemanticAssessmentV0_1 }>
  | Readonly<{ ok: false; reasonCodes: readonly string[] }>;

export type ContrastiveSemanticContextResultV0_1 =
  | Readonly<{ ok: true; context: ContrastiveSemanticContextV0_1 }>
  | Readonly<{ ok: false; reasonCodes: readonly string[] }>;

function textV0_1(value: unknown): string {
  return typeof value === "string" ? value.normalize("NFKC").trim() : "";
}

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function stringArrayV0_1(value: unknown): string[] | null {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return null;
  }
  return value.map((item) => textV0_1(item));
}

function failV0_1(reasonCodes: readonly string[]): { ok: false; reasonCodes: readonly string[] } {
  return { ok: false, reasonCodes };
}

export function buildContrastiveSemanticContextV0_1(
  pair: ContrastiveSemanticPairV0_1,
  structuralHypothesis: StructuralHypothesisV0_1,
): ContrastiveSemanticContextResultV0_1 {
  const senseA = buildSemanticAlignmentContextV0_1({
    targetWord: pair.word,
    targetSenseId: pair.senseA.targetSenseId,
    targetSenseLabel: pair.senseA.targetSenseLabel,
    targetSenseDefinition: pair.senseA.targetSenseDefinition,
    structuralHypothesis,
  });
  const senseB = buildSemanticAlignmentContextV0_1({
    targetWord: pair.word,
    targetSenseId: pair.senseB.targetSenseId,
    targetSenseLabel: pair.senseB.targetSenseLabel,
    targetSenseDefinition: pair.senseB.targetSenseDefinition,
    structuralHypothesis,
  });

  if (!senseA.ok || !senseB.ok) {
    return failV0_1([
      "CONTRASTIVE_SEMANTIC_CONTEXT_INVALID",
      ...(!senseA.ok ? senseA.reasonCodes : []),
      ...(!senseB.ok ? senseB.reasonCodes : []),
    ]);
  }
  if (senseA.context.structuralHypothesisId !== senseB.context.structuralHypothesisId) {
    return failV0_1(["CONTRASTIVE_STRUCTURAL_HYPOTHESIS_MISMATCH"]);
  }

  return {
    ok: true,
    context: {
      schemaVersion: senseA.context.schemaVersion,
      targetWord: senseA.context.targetWord,
      structuralHypothesisId: senseA.context.structuralHypothesisId,
      embryo: senseA.context.embryo,
      expansionChain: senseA.context.expansionChain,
      reductionOperationIds: senseA.context.reductionOperationIds,
      voicePath: senseA.context.voicePath,
      doctrineProjection: senseA.context.doctrineProjection,
      permittedTransforms: senseA.context.permittedTransforms,
      claimBoundary: senseA.context.claimBoundary,
      semanticOptions: { sense_a: senseA.context, sense_b: senseB.context },
    },
  };
}

function supportTraceV0_1(value: unknown): ContrastiveSupportTraceV0_1 | null {
  if (!isRecordV0_1(value)) return null;
  const structuralElements = stringArrayV0_1(value.structuralElements);
  const doctrineRoles = stringArrayV0_1(value.doctrineRoles);
  if (!structuralElements || !doctrineRoles || structuralElements.some((item) => !item) || doctrineRoles.some((item) => !item)) return null;
  return { structuralElements, doctrineRoles };
}

function qualityFailureCodesV0_1(
  bridge: string,
  context: ContrastiveSemanticContextV0_1,
): string[] {
  const lowerBridge = bridge.toLocaleLowerCase("en-US");
  const lowerWord = context.targetWord.toLocaleLowerCase("en-US");
  const definitions = [
    context.semanticOptions.sense_a.targetSenseDefinition ?? "",
    context.semanticOptions.sense_b.targetSenseDefinition ?? "",
  ].map((value) => value.toLocaleLowerCase("en-US"));
  const labels = [
    context.semanticOptions.sense_a.targetSenseLabel,
    context.semanticOptions.sense_b.targetSenseLabel,
  ].map((value) => value.toLocaleLowerCase("en-US"));
  const codes: string[] = [];
  if (bridge.length < 24) codes.push("CONTRASTIVE_BRIDGE_TOO_SHORT");
  if (definitions.some((definition) => definition && lowerBridge.includes(definition))) {
    codes.push("CONTRASTIVE_BRIDGE_REPEATS_DEFINITION");
  }
  if (labels.some((label) => label && lowerBridge === label)) {
    codes.push("CONTRASTIVE_BRIDGE_REPEATS_LABEL");
  }
  if (lowerBridge === lowerWord) codes.push("CONTRASTIVE_BRIDGE_REPEATS_WORD");
  if (/\b(?:proven|true meaning|historical origin|historically|winner|language superiority|candidate truth|reviewed evidence|dictionary|cognat|borrow(?:ed|ing)?|transmission)\b/i.test(bridge)) {
    codes.push("FORBIDDEN_SEMANTIC_CLAIM_LANGUAGE");
  }
  return codes;
}

export function parseContrastiveSemanticProposalV0_1(
  value: unknown,
  context: ContrastiveSemanticContextV0_1,
  metadata: Readonly<{ providerId?: string; modelId?: string }>,
): ContrastiveSemanticParseResultV0_1 {
  if (!isRecordV0_1(value)) return failV0_1(["MALFORMED_CONTRASTIVE_OUTPUT"]);
  const decision = isRecordV0_1(value.contrastiveDecision)
    ? textV0_1(value.contrastiveDecision.preferredSense)
    : "";
  if (!["sense_a", "sense_b", "neither", "both_or_unclear"].includes(decision)) {
    return failV0_1(["CONTRASTIVE_DECISION_REQUIRED"]);
  }
  const reasonCodes = stringArrayV0_1(value.reasonCodes);
  const doctrineRoles = stringArrayV0_1(value.doctrineRoles);
  if (!reasonCodes || reasonCodes.some((item) => !item) || !doctrineRoles || doctrineRoles.some((item) => !item)) {
    return failV0_1(["CONTRASTIVE_OUTPUT_FIELDS_INVALID"]);
  }
  const allowedRoles = new Set(context.doctrineProjection.projections.map((projection) => projection.doctrineRole));
  if (doctrineRoles.some((role) => !allowedRoles.has(role as (typeof context.doctrineProjection.projections)[number]["doctrineRole"]))) {
    return failV0_1(["CONTRASTIVE_DOCTRINE_ROLE_NOT_IN_CONTEXT"]);
  }
  const bridge = textV0_1(value.semanticBridge);
  const trace = value.supportTrace === undefined || value.supportTrace === null ? null : supportTraceV0_1(value.supportTrace);
  if (value.supportTrace !== undefined && value.supportTrace !== null && !trace) return failV0_1(["CONTRASTIVE_SUPPORT_TRACE_INVALID"]);

  if (decision === "neither" || decision === "both_or_unclear") {
    const required = decision === "neither" ? "CONTRASTIVE_RELATION_NEITHER" : "CONTRASTIVE_RELATION_BOTH_OR_UNCLEAR";
    if (bridge || doctrineRoles.length || trace || !reasonCodes.includes(required)) {
      return failV0_1(["CONTRASTIVE_NON_SELECTED_OUTPUT_INVALID"]);
    }
  } else {
    if (!bridge || doctrineRoles.length === 0 || !trace) return failV0_1(["CONTRASTIVE_SELECTED_OUTPUT_INCOMPLETE"]);
    if (!reasonCodes.includes("CONTRASTIVE_RELATION_STRUCTURE_SPECIFIC")) {
      return failV0_1(["CONTRASTIVE_RELATION_REASON_CODE_MISSING"]);
    }
    const suppliedStructuralElements = new Set([
      context.structuralHypothesisId,
      context.embryo,
      ...context.expansionChain,
      ...context.reductionOperationIds,
    ]);
    if (trace.structuralElements.some((element) => !suppliedStructuralElements.has(element))) {
      return failV0_1(["CONTRASTIVE_SUPPORT_TRACE_STRUCTURAL_ELEMENT_INVALID"]);
    }
    if (trace.doctrineRoles.some((role) => !allowedRoles.has(role as (typeof context.doctrineProjection.projections)[number]["doctrineRole"]))) {
      return failV0_1(["CONTRASTIVE_SUPPORT_TRACE_DOCTRINE_ROLE_INVALID"]);
    }
    const qualityCodes = qualityFailureCodesV0_1(bridge, context);
    if (qualityCodes.length) return failV0_1(qualityCodes);
  }

  const preferredSense = decision as ContrastivePreferredSenseV0_1;
  return {
    ok: true,
    assessment: {
      schemaVersion: SEMANTIC_ALIGNMENT_SCHEMA_V0_1,
      targetWord: context.targetWord,
      structuralHypothesisId: context.structuralHypothesisId,
      preferredSense,
      alignmentStatus: preferredSense === "sense_a" || preferredSense === "sense_b" ? "proposed" : "unknown",
      semanticBridge: preferredSense === "sense_a" || preferredSense === "sense_b" ? bridge : null,
      doctrineRoles: preferredSense === "sense_a" || preferredSense === "sense_b" ? doctrineRoles : [],
      supportTrace: preferredSense === "sense_a" || preferredSense === "sense_b" ? trace : null,
      reasonCodes,
      ...(metadata.providerId ? { providerId: metadata.providerId } : {}),
      ...(metadata.modelId ? { modelId: metadata.modelId } : {}),
    },
  };
}
