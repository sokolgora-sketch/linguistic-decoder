import {
  getSevenVoiceDoctrineFunctionalProfileV0_1,
  SEVEN_VOICE_DOCTRINE_PROFILE_RELATIONS_V0_1,
  type DoctrineFunctionalProfileSourceRefV0_1,
  type SevenVoiceDoctrineFunctionalProfileV0_1,
} from "./doctrineFunctionalProfile.v0_1";
import {
  isSevenVoiceKey,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";
import type { StructuralHypothesisV0_1 } from "@/shared/structuralHypothesisDiscovery.v0_1";

export const GENERIC_FUNCTIONAL_HYPOTHESIS_SCHEMA_V1 =
  "open-instrument.generic-functional-hypothesis.v1" as const;

export const GENERIC_FUNCTIONAL_HYPOTHESIS_SOURCE_KIND_V1 =
  "logic_derived_generic_functional_hypothesis" as const;

export const GENERIC_FUNCTIONAL_HYPOTHESIS_CLAIM_TYPE_V1 =
  "genericFunctionalHypothesis" as const;

export const GENERIC_FUNCTIONAL_HYPOTHESIS_COMPOSITION_MODE_V1 =
  "ORDERED_INDEPENDENT_COMPONENTS" as const;

export type GenericFunctionalHypothesisComponentV1 = Readonly<{
  position: number;
  voice: SevenVoiceKey;
  profileSchemaVersion: SevenVoiceDoctrineFunctionalProfileV0_1["schemaVersion"];
  profileAuthority: SevenVoiceDoctrineFunctionalProfileV0_1["engineAuthority"];
  profileTruthClassification: SevenVoiceDoctrineFunctionalProfileV0_1["truthClassification"];
  profileCompleteness: SevenVoiceDoctrineFunctionalProfileV0_1["profileCompleteness"];
  functionalProperties: SevenVoiceDoctrineFunctionalProfileV0_1["functionalProperties"];
  principleAssociation: SevenVoiceDoctrineFunctionalProfileV0_1["principleAssociation"];
  relationalPropertyIds: SevenVoiceDoctrineFunctionalProfileV0_1["relationalPropertyIds"];
  symbolicMetadata: SevenVoiceDoctrineFunctionalProfileV0_1["symbolicMetadata"];
  unresolvedTensionIds: SevenVoiceDoctrineFunctionalProfileV0_1["unresolvedTensionIds"];
  sourceRefs: readonly DoctrineFunctionalProfileSourceRefV0_1[];
}>;

export type GenericFunctionalHypothesisClaimBoundaryV1 = Readonly<{
  lexicalMeaning: "NOT_CLAIMED";
  historicalRelation: "NOT_CLAIMED";
  etymologicalRelation: "NOT_CLAIMED";
  targetSenseBinding: "NOT_EVALUATED";
  semanticInteraction: "NOT_AUTHORIZED";
  evidencePromotion: "NOT_AUTHORIZED";
  productionCandidate: "NOT_CLAIMED";
  pathComposition: "NOT_AUTHORIZED";
}>;

export type GenericFunctionalHypothesisV1 = Readonly<{
  schemaVersion: typeof GENERIC_FUNCTIONAL_HYPOTHESIS_SCHEMA_V1;
  sourceKind: typeof GENERIC_FUNCTIONAL_HYPOTHESIS_SOURCE_KIND_V1;
  claimType: typeof GENERIC_FUNCTIONAL_HYPOTHESIS_CLAIM_TYPE_V1;
  truthClassification: "hypothesis";
  targetWord: string;
  structuralHypothesisId: string;
  embryo: string;
  expansionChain: readonly string[];
  voicePath: readonly SevenVoiceKey[];
  compositionMode: typeof GENERIC_FUNCTIONAL_HYPOTHESIS_COMPOSITION_MODE_V1;
  functionalComponents: readonly GenericFunctionalHypothesisComponentV1[];
  functionalStatement: null;
  semanticBridge: null;
  semanticInteraction: "NOT_AUTHORIZED";
  targetBinding: "NOT_EVALUATED";
  historicalRelation: "NOT_CLAIMED";
  lexicalMeaning: "NOT_CLAIMED";
  evidenceStatus: "NO_EXTERNAL_EVIDENCE";
  evidenceRefs: readonly [];
  sourceRefs: readonly DoctrineFunctionalProfileSourceRefV0_1[];
  claimBoundary: GenericFunctionalHypothesisClaimBoundaryV1;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
}>;

export type GenericFunctionalHypothesisProducerReasonCodeV1 =
  | "STRUCTURAL_HYPOTHESIS_MISSING"
  | "STRUCTURAL_HYPOTHESIS_INVALID"
  | "VOICE_PATH_MISSING"
  | "VOICE_PATH_INVALID"
  | "DOCTRINE_PROFILE_UNAVAILABLE"
  | "TARGET_WORD_MISSING";

export type GenericFunctionalHypothesisProducerResultV1 =
  | Readonly<{
      ok: true;
      hypothesis: GenericFunctionalHypothesisV1;
    }>
  | Readonly<{
      ok: false;
      reasonCodes: readonly GenericFunctionalHypothesisProducerReasonCodeV1[];
    }>;

export type GenericFunctionalHypothesisProducerInputV1 = Readonly<{
  targetWord: string;
  structuralHypothesis: StructuralHypothesisV0_1;
  voicePath: readonly SevenVoiceKey[];
}>;

const CLAIM_BOUNDARY_V1: GenericFunctionalHypothesisClaimBoundaryV1 =
  Object.freeze({
    lexicalMeaning: "NOT_CLAIMED",
    historicalRelation: "NOT_CLAIMED",
    etymologicalRelation: "NOT_CLAIMED",
    targetSenseBinding: "NOT_EVALUATED",
    semanticInteraction: "NOT_AUTHORIZED",
    evidencePromotion: "NOT_AUTHORIZED",
    productionCandidate: "NOT_CLAIMED",
    pathComposition: "NOT_AUTHORIZED",
  });

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function freezeDeepV1<T>(value: T): T {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const child of Object.values(value as Record<string, unknown>)) {
      freezeDeepV1(child);
    }
  }
  return value;
}

function sourceRefKeyV1(ref: DoctrineFunctionalProfileSourceRefV0_1): string {
  return `${ref.sourceId}:${ref.locator}`;
}

function uniqueSourceRefsV1(
  refs: readonly DoctrineFunctionalProfileSourceRefV0_1[],
): readonly DoctrineFunctionalProfileSourceRefV0_1[] {
  const seen = new Set<string>();
  return refs.filter((ref) => {
    const key = sourceRefKeyV1(ref);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sourceRefsForProfileV1(
  profile: SevenVoiceDoctrineFunctionalProfileV0_1,
): readonly DoctrineFunctionalProfileSourceRefV0_1[] {
  const functionalRefs = profile.functionalProperties.flatMap(
    (property) => property.sourceRefs,
  );
  const relationRefs = profile.relationalPropertyIds.flatMap(
    (relationId) =>
      SEVEN_VOICE_DOCTRINE_PROFILE_RELATIONS_V0_1[relationId].sourceRefs,
  );

  return uniqueSourceRefsV1([
    ...functionalRefs,
    ...profile.principleAssociation.sourceRefs,
    ...relationRefs,
    ...profile.symbolicMetadata.color.sourceRefs,
  ]);
}

function structuralHypothesisValidV1(
  value: unknown,
): value is StructuralHypothesisV0_1 {
  if (!isRecordV1(value)) return false;
  return (
    typeof value.hypothesisId === "string" && value.hypothesisId.trim().length > 0 &&
    typeof value.embryo === "string" && value.embryo.trim().length > 0 &&
    value.discoveryStatus === "structural_hypothesis" &&
    value.independentStandaloneMeaning === null &&
    Array.isArray(value.expansionChain) &&
    value.expansionChain.every((item) => typeof item === "string") &&
    Array.isArray(value.evidenceRefs) &&
    value.evidenceRefs.length === 0
  );
}

function voicePathValidV1(
  value: unknown,
): value is readonly SevenVoiceKey[] {
  return (
    Array.isArray(value) &&
    value.length > 0 &&
    value.every((voice) => typeof voice === "string" && isSevenVoiceKey(voice))
  );
}

function componentV1(
  voice: SevenVoiceKey,
  position: number,
): GenericFunctionalHypothesisComponentV1 | null {
  const profile = getSevenVoiceDoctrineFunctionalProfileV0_1(voice);
  if (!profile) return null;

  return {
    position,
    voice,
    profileSchemaVersion: profile.schemaVersion,
    profileAuthority: profile.engineAuthority,
    profileTruthClassification: profile.truthClassification,
    profileCompleteness: profile.profileCompleteness,
    functionalProperties: profile.functionalProperties,
    principleAssociation: profile.principleAssociation,
    relationalPropertyIds: profile.relationalPropertyIds,
    symbolicMetadata: profile.symbolicMetadata,
    unresolvedTensionIds: profile.unresolvedTensionIds,
    sourceRefs: sourceRefsForProfileV1(profile),
  };
}

export function produceGenericFunctionalHypothesisV1(
  input: GenericFunctionalHypothesisProducerInputV1,
): GenericFunctionalHypothesisProducerResultV1 {
  const targetWord =
    typeof input?.targetWord === "string" ? input.targetWord.trim() : "";
  if (!targetWord) {
    return { ok: false, reasonCodes: ["TARGET_WORD_MISSING"] };
  }

  if (!input?.structuralHypothesis) {
    return { ok: false, reasonCodes: ["STRUCTURAL_HYPOTHESIS_MISSING"] };
  }
  if (!structuralHypothesisValidV1(input.structuralHypothesis)) {
    return { ok: false, reasonCodes: ["STRUCTURAL_HYPOTHESIS_INVALID"] };
  }

  if (!input?.voicePath) {
    return { ok: false, reasonCodes: ["VOICE_PATH_MISSING"] };
  }
  if (!voicePathValidV1(input.voicePath)) {
    return { ok: false, reasonCodes: ["VOICE_PATH_INVALID"] };
  }

  const functionalComponents = input.voicePath.map((voice, position) =>
    componentV1(voice, position),
  );
  if (functionalComponents.some((component) => component === null)) {
    return { ok: false, reasonCodes: ["DOCTRINE_PROFILE_UNAVAILABLE"] };
  }

  const components = functionalComponents as GenericFunctionalHypothesisComponentV1[];
  const sourceRefs = uniqueSourceRefsV1(
    components.flatMap((component) => component.sourceRefs),
  );
  const hypothesis = freezeDeepV1({
    schemaVersion: GENERIC_FUNCTIONAL_HYPOTHESIS_SCHEMA_V1,
    sourceKind: GENERIC_FUNCTIONAL_HYPOTHESIS_SOURCE_KIND_V1,
    claimType: GENERIC_FUNCTIONAL_HYPOTHESIS_CLAIM_TYPE_V1,
    truthClassification: "hypothesis",
    targetWord,
    structuralHypothesisId: input.structuralHypothesis.hypothesisId,
    embryo: input.structuralHypothesis.embryo,
    expansionChain: [...input.structuralHypothesis.expansionChain],
    voicePath: [...input.voicePath],
    compositionMode: GENERIC_FUNCTIONAL_HYPOTHESIS_COMPOSITION_MODE_V1,
    functionalComponents: components,
    functionalStatement: null,
    semanticBridge: null,
    semanticInteraction: "NOT_AUTHORIZED",
    targetBinding: "NOT_EVALUATED",
    historicalRelation: "NOT_CLAIMED",
    lexicalMeaning: "NOT_CLAIMED",
    evidenceStatus: "NO_EXTERNAL_EVIDENCE",
    evidenceRefs: [],
    sourceRefs,
    claimBoundary: CLAIM_BOUNDARY_V1,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  } satisfies GenericFunctionalHypothesisV1);

  return { ok: true, hypothesis };
}

export type GenericFunctionalHypothesisValidationResultV1 = Readonly<{
  ok: boolean;
  reasonCodes: readonly string[];
}>;

export function validateGenericFunctionalHypothesisV1(
  value: unknown,
): GenericFunctionalHypothesisValidationResultV1 {
  if (!isRecordV1(value)) {
    return { ok: false, reasonCodes: ["HYPOTHESIS_NOT_OBJECT"] };
  }

  const reasons: string[] = [];
  if (value.schemaVersion !== GENERIC_FUNCTIONAL_HYPOTHESIS_SCHEMA_V1) {
    reasons.push("SCHEMA_VERSION_INVALID");
  }
  if (value.sourceKind !== GENERIC_FUNCTIONAL_HYPOTHESIS_SOURCE_KIND_V1) {
    reasons.push("SOURCE_KIND_INVALID");
  }
  if (value.claimType !== GENERIC_FUNCTIONAL_HYPOTHESIS_CLAIM_TYPE_V1) {
    reasons.push("CLAIM_TYPE_INVALID");
  }
  if (value.truthClassification !== "hypothesis") {
    reasons.push("TRUTH_CLASSIFICATION_INVALID");
  }
  if (!voicePathValidV1(value.voicePath)) {
    reasons.push("VOICE_PATH_INVALID");
  }
  if (
    typeof value.targetWord !== "string" ||
    value.targetWord.trim().length === 0 ||
    typeof value.structuralHypothesisId !== "string" ||
    value.structuralHypothesisId.trim().length === 0 ||
    typeof value.embryo !== "string" ||
    value.embryo.trim().length === 0 ||
    !Array.isArray(value.expansionChain) ||
    !value.expansionChain.every((item) => typeof item === "string") ||
    value.compositionMode !==
      GENERIC_FUNCTIONAL_HYPOTHESIS_COMPOSITION_MODE_V1
  ) {
    reasons.push("STRUCTURAL_ANCHOR_INVALID");
  }
  if (
    value.functionalStatement !== null ||
    value.semanticBridge !== null ||
    value.semanticInteraction !== "NOT_AUTHORIZED" ||
    value.targetBinding !== "NOT_EVALUATED" ||
    value.evidenceStatus !== "NO_EXTERNAL_EVIDENCE" ||
    !Array.isArray(value.evidenceRefs) ||
    value.evidenceRefs.length !== 0 ||
    value.userDecisionPosture !== "user_decides" ||
    value.noSingleWinner !== true
  ) {
    reasons.push("EPISTEMIC_BOUNDARY_INVALID");
  }
  if ("targetSense" in value || "semanticAlignment" in value || "startState" in value || "resultState" in value || "transitions" in value) {
    reasons.push("PROHIBITED_SEMANTIC_FIELD_PRESENT");
  }

  if (
    voicePathValidV1(value.voicePath) &&
    Array.isArray(value.functionalComponents)
  ) {
    const expectedComponents = value.voicePath.map((voice, position) =>
      componentV1(voice, position),
    );
    const allExpectedComponents = expectedComponents.every(
      (component): component is GenericFunctionalHypothesisComponentV1 =>
        component !== null,
    );
    if (!allExpectedComponents) {
      reasons.push("FUNCTIONAL_COMPONENTS_INVALID");
    } else {
      if (
        JSON.stringify(value.functionalComponents) !==
        JSON.stringify(expectedComponents)
      ) {
        reasons.push("FUNCTIONAL_COMPONENTS_INVALID");
      }

      const expectedSourceRefs = uniqueSourceRefsV1(
        expectedComponents.flatMap((component) => component.sourceRefs),
      );
      if (
        JSON.stringify(value.sourceRefs) !== JSON.stringify(expectedSourceRefs)
      ) {
        reasons.push("SOURCE_REFS_INVALID");
      }
    }
  } else {
    reasons.push("FUNCTIONAL_COMPONENTS_INVALID");
  }

  return { ok: reasons.length === 0, reasonCodes: [...new Set(reasons)] };
}
