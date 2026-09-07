import {
  projectSevenVoiceDoctrineV0_1,
  type DoctrineProjectionSuccessV0_1,
} from "@/shared/openInstrument/doctrineProjection.v0_1";
import {
  STRUCTURAL_HYPOTHESIS_VERSION_V0_1,
  type StructuralHypothesisV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";
import type { SevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";
import type { SemanticAlignmentAssessmentV0_1 } from "@/shared/openInstrument/semanticAlignment.v0_1";

export const LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_SCHEMA_V0_1 =
  "open-instrument.logic-derived-functional-hypothesis.v0_1" as const;

export type LogicDerivedFunctionalHypothesisInputV0_1 = Readonly<{
  targetWord: string;
  targetSense: Readonly<{
    id: string;
    label: string;
  }>;
  structuralHypothesis: StructuralHypothesisV0_1;
  semanticAlignment?: SemanticAlignmentAssessmentV0_1;
}>;

export type LogicDerivedFunctionalHypothesisV0_1 = Readonly<{
  schemaVersion: typeof LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_SCHEMA_V0_1;
  hypothesisId: string;
  targetWord: string;
  targetSenseId: string;
  targetSenseLabel: string;
  aggregateStatus: "candidate_only";
  sourceKind: "logic_derived_functional_hypothesis";
  sourceStatus: "logic_derived_candidate";
  claimType: "functionalMotivation";
  embryo: string;
  embryoSize: number;
  structuralAnchor: Readonly<{
    hypothesisId: string;
    expansionChain: string[];
    reductionOperationIds: string[];
  }>;
  voicePath: SevenVoiceKey[];
  doctrineProjection: DoctrineProjectionSuccessV0_1;
  semanticAlignment: SemanticAlignmentAssessmentV0_1;
  semanticBridge: string;
  functionalBridgeTruth: "hypothesis";
  historicalOriginClaim: "not_claimed";
  historicalTransmissionClaim: "not_claimed";
  winnerClaim: "not_claimed";
  languageSuperiorityClaim: "not_claimed";
  candidateTruthClaim: "not_claimed";
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type LogicDerivedFunctionalHypothesisFailureV0_1 = Readonly<{
  ok: false;
  schemaVersion: typeof LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_SCHEMA_V0_1;
  reasonCodes: readonly string[];
}>;

export type LogicDerivedFunctionalHypothesisResultV0_1 =
  | Readonly<{
      ok: true;
      hypothesis: LogicDerivedFunctionalHypothesisV0_1;
    }>
  | LogicDerivedFunctionalHypothesisFailureV0_1;

function textV0_1(value: unknown): string {
  return typeof value === "string"
    ? value.normalize("NFKC").trim()
    : "";
}

function failureV0_1(
  reasonCodes: readonly string[],
): LogicDerivedFunctionalHypothesisFailureV0_1 {
  return {
    ok: false,
    schemaVersion:
      LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_SCHEMA_V0_1,
    reasonCodes,
  };
}

export function buildLogicDerivedFunctionalHypothesisV0_1(
  input: LogicDerivedFunctionalHypothesisInputV0_1,
): LogicDerivedFunctionalHypothesisResultV0_1 {
  const targetWord = textV0_1(input?.targetWord);
  const targetSenseId = textV0_1(input?.targetSense?.id);
  const targetSenseLabel = textV0_1(input?.targetSense?.label);
  const structural = input?.structuralHypothesis;
  const semanticAlignment = input?.semanticAlignment;

  if (!targetWord) {
    return failureV0_1(["TARGET_WORD_REQUIRED"]);
  }

  if (!targetSenseId || !targetSenseLabel) {
    return failureV0_1(["TARGET_SENSE_REQUIRED"]);
  }

  if (!semanticAlignment) {
    return failureV0_1(["SEMANTIC_ALIGNMENT_REQUIRED"]);
  }

  const semanticBridge = textV0_1(semanticAlignment.semanticBridge);
  if (
    !structural ||
    structural.hypothesisVersion !==
      STRUCTURAL_HYPOTHESIS_VERSION_V0_1 ||
    structural.discoveryStatus !== "structural_hypothesis" ||
    !textV0_1(structural.hypothesisId) ||
    !textV0_1(structural.embryo) ||
    !Array.isArray(structural.reductionSteps) ||
    structural.reductionSteps.length === 0 ||
    structural.historicalOriginClaim !== "not_claimed" ||
    structural.historicalTransmissionClaim !== "not_claimed" ||
    structural.winnerClaim !== "not_claimed" ||
    structural.languageSuperiorityClaim !== "not_claimed" ||
    structural.candidateTruthClaim !== "not_claimed" ||
    structural.userDecisionPosture !== "user_decides"
  ) {
    return failureV0_1(["STRUCTURAL_ANCHOR_INVALID"]);
  }

  const terminalStep =
    structural.reductionSteps[structural.reductionSteps.length - 1];

  if (
    !terminalStep ||
    !Array.isArray(terminalStep.voicePathAfter) ||
    terminalStep.voicePathAfter.length === 0
  ) {
    return failureV0_1(["VOICE_PATH_REQUIRED"]);
  }

  const doctrineProjection = projectSevenVoiceDoctrineV0_1(
    terminalStep.voicePathAfter,
  );

  if (!doctrineProjection.ok) {
    return failureV0_1([
      "DOCTRINE_PROJECTION_REJECTED",
      ...doctrineProjection.reasonCodes,
    ]);
  }

  const roles = doctrineProjection.projections.map(
    (projection) => projection.doctrineRole,
  );

  if (
    semanticAlignment.schemaVersion !==
      "open-instrument.semantic-alignment.v0_1" ||
    semanticAlignment.alignmentStatus !== "proposed" ||
    semanticAlignment.targetWord !== targetWord ||
    semanticAlignment.targetSenseId !== targetSenseId ||
    semanticAlignment.targetSenseLabel !== targetSenseLabel ||
    semanticAlignment.structuralHypothesisId !== structural.hypothesisId ||
    !semanticBridge ||
    semanticAlignment.alignmentSource === "deterministic_no_alignment" ||
    semanticAlignment.doctrineRoles.some(
      (role) => !roles.includes(role as (typeof roles)[number]),
    )
  ) {
    return failureV0_1(["SEMANTIC_ALIGNMENT_INVALID"]);
  }

  const voicePath = doctrineProjection.inputPath;
  const hypothesisId = [
    "logic-functional",
    targetWord.toLocaleLowerCase("en-US").replace(/[^a-z0-9ë]+/gu, "-"),
    targetSenseId,
    structural.hypothesisId,
  ].join(":");

  return {
    ok: true,
    hypothesis: {
      schemaVersion:
        LOGIC_DERIVED_FUNCTIONAL_HYPOTHESIS_SCHEMA_V0_1,
      hypothesisId,
      targetWord,
      targetSenseId,
      targetSenseLabel,
      aggregateStatus: "candidate_only",
      sourceKind: "logic_derived_functional_hypothesis",
      sourceStatus: "logic_derived_candidate",
      claimType: "functionalMotivation",
      embryo: structural.embryo,
      embryoSize: structural.embryoSize,
      structuralAnchor: {
        hypothesisId: structural.hypothesisId,
        expansionChain: [...structural.expansionChain],
        reductionOperationIds: structural.reductionSteps.map(
          (step) => step.operationId,
        ),
      },
      voicePath,
      doctrineProjection,
      semanticAlignment,
      semanticBridge,
      functionalBridgeTruth: "hypothesis",
      historicalOriginClaim: "not_claimed",
      historicalTransmissionClaim: "not_claimed",
      winnerClaim: "not_claimed",
      languageSuperiorityClaim: "not_claimed",
      candidateTruthClaim: "not_claimed",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    },
  };
}
