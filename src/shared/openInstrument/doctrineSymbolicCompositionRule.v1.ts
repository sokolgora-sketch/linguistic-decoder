import type { PrincipleRole } from "@/shared/sevenPrinciples.v1";
import { SEVEN_PRINCIPLES } from "@/shared/sevenPrinciples.v1";
import type { SevenVoiceKey } from "@/shared/sevenVoiceOrderedViews.v0.1";
import {
  DOCTRINE_PROJECTION_SCHEMA_V0_1,
} from "@/shared/openInstrument/doctrineProjection.v0_1";
import {
  DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
  evaluateDoctrineSemanticCompositionContractV0_1,
  type DoctrineSemanticCompositionFailureV0_1,
  type DoctrineSemanticCompositionInputV0_1,
  type DoctrineSemanticCompositionReasonCodeV0_1,
} from "@/shared/openInstrument/doctrineSemanticCompositionContract.v0_1";
import { sevenVoiceOrderedViewsSchemaVersion } from "@/shared/sevenVoiceOrderedViews.v0.1";

export const DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1 =
  "open-instrument.doctrine-symbolic-composition-rule.v1" as const;

export const DOCTRINE_SYMBOLIC_COMPOSITION_MODE_V1 =
  "ORDERED_STATE_TRANSITION" as const;

export const DOCTRINE_SYMBOLIC_COMPOSITION_STATUS_V1 = {
  supported: "SYMBOLIC_COMPOSITION_SUPPORTED",
  reject: "REJECT",
} as const;

export type DoctrineSymbolicStateV1 = Readonly<{
  pathIndex: number;
  voice: SevenVoiceKey;
  doctrineRole: PrincipleRole;
}>;

export type DoctrineSymbolicTransitionV1 = Readonly<{
  transitionIndex: number;
  transitionKind: typeof DOCTRINE_SYMBOLIC_COMPOSITION_MODE_V1;
  from: DoctrineSymbolicStateV1;
  to: DoctrineSymbolicStateV1;
}>;

export type DoctrineSymbolicCompositionSuccessV1 = Readonly<{
  schemaVersion: typeof DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1;
  status: typeof DOCTRINE_SYMBOLIC_COMPOSITION_STATUS_V1.supported;
  structuralHypothesisId: string;
  embryo: string;
  sourceCompositionMode: "ORDERED_ROLES_ONLY";
  compositionMode: typeof DOCTRINE_SYMBOLIC_COMPOSITION_MODE_V1;
  terminalVoicePath: readonly SevenVoiceKey[];
  orderedRoleProjection: readonly DoctrineSymbolicStateV1[];
  startState: DoctrineSymbolicStateV1;
  terminalState: DoctrineSymbolicStateV1;
  transitions: readonly DoctrineSymbolicTransitionV1[];
  truthClassification: Readonly<{
    registryMapping: "fact";
    structuralProjection: "inference";
    symbolicComposition: "inference";
    targetBoundRelation: "not_applicable" | "unknown";
  }>;
  targetSense?: Readonly<{
    id: string;
    label: string;
    definition?: string;
  }>;
  provenance: Readonly<{
    contractSchema: typeof DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1;
    sourceCompositionContract:
      typeof DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1;
    doctrineProjectionSchema: typeof DOCTRINE_PROJECTION_SCHEMA_V0_1;
    orderedViewsSchema: typeof sevenVoiceOrderedViewsSchemaVersion;
    doctrineAuthority: "src/shared/doctrine/voiceDoctrine.v0.1.ts";
    roleVocabularyAuthority: "src/shared/sevenPrinciples.v1.ts";
    structuralHypothesisId: string;
    terminalVoicePath: readonly SevenVoiceKey[];
    targetSenseId?: string;
  }>;
  claimBoundary: Readonly<{
    historicalOriginClaim: "not_claimed";
    historicalTransmissionClaim: "not_claimed";
    winnerClaim: "not_claimed";
    languageSuperiorityClaim: "not_claimed";
    candidateTruthClaim: "not_claimed";
    lexicalMeaningClaim: "not_claimed";
  }>;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type DoctrineSymbolicCompositionFailureV1 = Readonly<{
  schemaVersion: typeof DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1;
  status: typeof DOCTRINE_SYMBOLIC_COMPOSITION_STATUS_V1.reject;
  reasonCodes: readonly DoctrineSemanticCompositionReasonCodeV0_1[];
  failures: DoctrineSemanticCompositionFailureV0_1["failures"];
}>;

export type DoctrineSymbolicCompositionResultV1 =
  | DoctrineSymbolicCompositionSuccessV1
  | DoctrineSymbolicCompositionFailureV1;

function rejectedV1(
  failure: DoctrineSemanticCompositionFailureV0_1,
): DoctrineSymbolicCompositionFailureV1 {
  return {
    schemaVersion: DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1,
    status: DOCTRINE_SYMBOLIC_COMPOSITION_STATUS_V1.reject,
    reasonCodes: [...failure.reasonCodes],
    failures: [...failure.failures],
  };
}

function stateForVoiceV1(
  pathIndex: number,
  voice: SevenVoiceKey,
): DoctrineSymbolicStateV1 {
  return {
    pathIndex,
    voice,
    doctrineRole: SEVEN_PRINCIPLES[voice].role,
  };
}

export function evaluateDoctrineSymbolicCompositionRuleV1(
  input: DoctrineSemanticCompositionInputV0_1,
): DoctrineSymbolicCompositionResultV1 {
  const base = evaluateDoctrineSemanticCompositionContractV0_1(input);

  if (base.status === "REJECT") {
    return rejectedV1(base);
  }

  const terminalVoicePath = [...base.terminalVoicePath];
  const orderedRoleProjection = terminalVoicePath.map((voice, pathIndex) =>
    stateForVoiceV1(pathIndex, voice),
  );
  const startState = orderedRoleProjection[0];
  const terminalState = orderedRoleProjection[orderedRoleProjection.length - 1];

  if (!startState || !terminalState) {
    return rejectedV1({
      schemaVersion: DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
      status: "REJECT",
      reasonCodes: ["TERMINAL_VOICE_PATH_REQUIRED"],
      failures: [
        {
          code: "TERMINAL_VOICE_PATH_REQUIRED",
          field: "terminalVoicePath",
        },
      ],
    });
  }

  const transitions = orderedRoleProjection
    .slice(0, -1)
    .map((from, transitionIndex) => ({
      transitionIndex,
      transitionKind: DOCTRINE_SYMBOLIC_COMPOSITION_MODE_V1,
      from,
      to: orderedRoleProjection[transitionIndex + 1],
    }));

  return {
    schemaVersion: DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1,
    status: DOCTRINE_SYMBOLIC_COMPOSITION_STATUS_V1.supported,
    structuralHypothesisId: base.structuralHypothesisId,
    embryo: base.embryo,
    sourceCompositionMode: "ORDERED_ROLES_ONLY",
    compositionMode: DOCTRINE_SYMBOLIC_COMPOSITION_MODE_V1,
    terminalVoicePath,
    orderedRoleProjection,
    startState,
    terminalState,
    transitions,
    truthClassification: {
      registryMapping: base.truthClassification.registryMapping,
      structuralProjection: base.truthClassification.structuralProjection,
      symbolicComposition: "inference",
      targetBoundRelation: base.truthClassification.targetBoundRelation,
    },
    ...(base.targetSense ? { targetSense: base.targetSense } : {}),
    provenance: {
      contractSchema: DOCTRINE_SYMBOLIC_COMPOSITION_RULE_SCHEMA_V1,
      sourceCompositionContract:
        DOCTRINE_SEMANTIC_COMPOSITION_CONTRACT_SCHEMA_V0_1,
      doctrineProjectionSchema: DOCTRINE_PROJECTION_SCHEMA_V0_1,
      orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
      doctrineAuthority: "src/shared/doctrine/voiceDoctrine.v0.1.ts",
      roleVocabularyAuthority: "src/shared/sevenPrinciples.v1.ts",
      structuralHypothesisId: base.structuralHypothesisId,
      terminalVoicePath: [...terminalVoicePath],
      ...(base.targetSense ? { targetSenseId: base.targetSense.id } : {}),
    },
    claimBoundary: base.claimBoundary,
    userDecisionPosture: base.userDecisionPosture,
    noSingleWinner: base.noSingleWinner,
  };
}
