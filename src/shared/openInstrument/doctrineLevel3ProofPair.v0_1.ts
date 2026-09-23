import {
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
} from "@/shared/openInstrument/doctrineFunctionalProfile.v0_1";
import {
  sevenVoiceOrderedViewsSchemaVersion,
  isSevenVoiceKey,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";
import { renderDoctrineLevel3PairReadingV0_1 } from "@/shared/openInstrument/doctrineLevel3PairCandidateGenerator.v0_1";

export const DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1 =
  "open-instrument.doctrine-level3-proof-pair.v0_1" as const;

export const DOCTRINE_LEVEL3_PROOF_PAIR_RULE_ID_V0_1 =
  "level3.proof-pair.u-y.v0_1" as const;

export const DOCTRINE_LEVEL3_PROOF_PAIR_A_E_RULE_ID_V0_1 =
  "level3.proof-pair.a-e.v0_1" as const;

export const DOCTRINE_LEVEL3_PROOF_PAIR_E_A_RULE_ID_V0_1 =
  "level3.proof-pair.e-a.v0_1" as const;

export const DOCTRINE_LEVEL3_PROOF_PAIR_I_O_RULE_ID_V0_1 =
  "level3.proof-pair.i-o.v0_1" as const;

export const DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1 =
  "level3.generic-distinct-pair.v1" as const;

export const DOCTRINE_LEVEL3_GENERIC_COMPOSITION_AUTHORIZED_V1 =
  "AUTHORIZED" as const;

const AUTHORIZED_PATH_U_Y_V0_1 = Object.freeze(["U", "Y"] as const);
const AUTHORIZED_PATH_A_E_V0_1 = Object.freeze(["A", "E"] as const);
const AUTHORIZED_PATH_E_A_V0_1 = Object.freeze(["E", "A"] as const);
const AUTHORIZED_PATH_I_O_V0_1 = Object.freeze(["I", "O"] as const);

const CLAIM_BOUNDARY_V0_1 = Object.freeze({
  historicalOriginClaim: "not_claimed",
  historicalTransmissionClaim: "not_claimed",
  winnerClaim: "not_claimed",
  languageSuperiorityClaim: "not_claimed",
  candidateTruthClaim: "not_claimed",
  lexicalMeaningClaim: "not_claimed",
  externalEvidenceClaim: "not_claimed",
  reviewedFunctionalEvidenceClaim: "not_claimed",
  targetSenseValidation: "not_authorized",
  consonantSemantics: "not_authorized",
  causalRelation: "not_authorized",
  temporalProgression: "not_authorized",
  transformation: "not_authorized",
  dominance: "not_authorized",
  stateTransition: "not_authorized",
} as const);

const PROVENANCE_V0_1 = Object.freeze({
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_RULE_ID_V0_1,
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
  analyzedVoicePath: AUTHORIZED_PATH_U_Y_V0_1,
} as const);

const PROVENANCE_A_E_V0_1 = Object.freeze({
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_A_E_RULE_ID_V0_1,
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
  analyzedVoicePath: AUTHORIZED_PATH_A_E_V0_1,
} as const);

const PROVENANCE_E_A_V0_1 = Object.freeze({
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_E_A_RULE_ID_V0_1,
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
  analyzedVoicePath: AUTHORIZED_PATH_E_A_V0_1,
} as const);

const PROVENANCE_I_O_V0_1 = Object.freeze({
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_I_O_RULE_ID_V0_1,
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
  analyzedVoicePath: AUTHORIZED_PATH_I_O_V0_1,
} as const);

export type DoctrineLevel3ProofPairReadingV0_1 = Readonly<{
  schemaVersion: typeof DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1;
  ruleId:
    | typeof DOCTRINE_LEVEL3_PROOF_PAIR_RULE_ID_V0_1
    | typeof DOCTRINE_LEVEL3_PROOF_PAIR_A_E_RULE_ID_V0_1
    | typeof DOCTRINE_LEVEL3_PROOF_PAIR_E_A_RULE_ID_V0_1
    | typeof DOCTRINE_LEVEL3_PROOF_PAIR_I_O_RULE_ID_V0_1
    | typeof DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1;
  level: 3;
  analyzedVoicePath: DoctrineLevel3ProofPairVoicePathV0_1;
  reading: string;
  truthClassification: "inference";
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts";
  doctrineProfileSchema: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  outputShape: "bounded_phrase_or_short_clause";
  genericComposition:
    | "NOT_AUTHORIZED"
    | typeof DOCTRINE_LEVEL3_GENERIC_COMPOSITION_AUTHORIZED_V1;
  level4TransitionSemantics: "NOT_AUTHORIZED";
  providerIndependent: true;
  externalEvidenceIndependent: true;
  candidateWinnerIndependent: true;
  claimBoundary: typeof CLAIM_BOUNDARY_V0_1;
  userDecisionPosture: "user_decides";
  noSingleWinner: true;
  provenance:
    | typeof PROVENANCE_V0_1
    | typeof PROVENANCE_A_E_V0_1
    | typeof PROVENANCE_E_A_V0_1
    | typeof PROVENANCE_I_O_V0_1
    | DoctrineLevel3GenericProofPairProvenanceV1;
}>;

type DoctrineLevel3GenericProofPairProvenanceV1 = Readonly<{
  ruleId: typeof DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1;
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts";
  doctrineProfileSchema: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  orderedViewsSchema: typeof sevenVoiceOrderedViewsSchemaVersion;
  analyzedVoicePath: DoctrineLevel3ProofPairVoicePathV0_1;
}>;

export const DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1 = Object.freeze({
  schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_RULE_ID_V0_1,
  level: 3,
  analyzedVoicePath: AUTHORIZED_PATH_U_Y_V0_1,
  reading: "grounded depth with reflective exploration",
  truthClassification: "inference",
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  outputShape: "bounded_phrase_or_short_clause",
  genericComposition: DOCTRINE_LEVEL3_GENERIC_COMPOSITION_AUTHORIZED_V1,
  level4TransitionSemantics: "NOT_AUTHORIZED",
  providerIndependent: true,
  externalEvidenceIndependent: true,
  candidateWinnerIndependent: true,
  claimBoundary: CLAIM_BOUNDARY_V0_1,
  userDecisionPosture: "user_decides",
  noSingleWinner: true,
  provenance: PROVENANCE_V0_1,
} satisfies DoctrineLevel3ProofPairReadingV0_1);

export const DOCTRINE_LEVEL3_PROOF_PAIR_A_E_V0_1 = Object.freeze({
  schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_A_E_RULE_ID_V0_1,
  level: 3,
  analyzedVoicePath: AUTHORIZED_PATH_A_E_V0_1,
  reading: "initiating beginning with expanding growth",
  truthClassification: "inference",
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  outputShape: "bounded_phrase_or_short_clause",
  genericComposition: DOCTRINE_LEVEL3_GENERIC_COMPOSITION_AUTHORIZED_V1,
  level4TransitionSemantics: "NOT_AUTHORIZED",
  providerIndependent: true,
  externalEvidenceIndependent: true,
  candidateWinnerIndependent: true,
  claimBoundary: CLAIM_BOUNDARY_V0_1,
  userDecisionPosture: "user_decides",
  noSingleWinner: true,
  provenance: PROVENANCE_A_E_V0_1,
} satisfies DoctrineLevel3ProofPairReadingV0_1);

export const DOCTRINE_LEVEL3_PROOF_PAIR_E_A_V0_1 = Object.freeze({
  schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_E_A_RULE_ID_V0_1,
  level: 3,
  analyzedVoicePath: AUTHORIZED_PATH_E_A_V0_1,
  reading: "expanding growth with initiating beginning",
  truthClassification: "inference",
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  outputShape: "bounded_phrase_or_short_clause",
  genericComposition: DOCTRINE_LEVEL3_GENERIC_COMPOSITION_AUTHORIZED_V1,
  level4TransitionSemantics: "NOT_AUTHORIZED",
  providerIndependent: true,
  externalEvidenceIndependent: true,
  candidateWinnerIndependent: true,
  claimBoundary: CLAIM_BOUNDARY_V0_1,
  userDecisionPosture: "user_decides",
  noSingleWinner: true,
  provenance: PROVENANCE_E_A_V0_1,
} satisfies DoctrineLevel3ProofPairReadingV0_1);

export const DOCTRINE_LEVEL3_PROOF_PAIR_I_O_V0_1 = Object.freeze({
  schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_I_O_RULE_ID_V0_1,
  level: 3,
  analyzedVoicePath: AUTHORIZED_PATH_I_O_V0_1,
  reading: "clear understanding with balanced mediation",
  truthClassification: "inference",
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
  doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
  outputShape: "bounded_phrase_or_short_clause",
  genericComposition: DOCTRINE_LEVEL3_GENERIC_COMPOSITION_AUTHORIZED_V1,
  level4TransitionSemantics: "NOT_AUTHORIZED",
  providerIndependent: true,
  externalEvidenceIndependent: true,
  candidateWinnerIndependent: true,
  claimBoundary: CLAIM_BOUNDARY_V0_1,
  userDecisionPosture: "user_decides",
  noSingleWinner: true,
  provenance: PROVENANCE_I_O_V0_1,
} satisfies DoctrineLevel3ProofPairReadingV0_1);

export const DOCTRINE_LEVEL3_PROOF_PAIR_AUTHORITY_REGISTRY_V0_1 = Object.freeze([
  DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_A_E_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_E_A_V0_1,
  DOCTRINE_LEVEL3_PROOF_PAIR_I_O_V0_1,
] as const);

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function hasExactKeysV0_1(
  actual: Record<string, unknown>,
  expected: object,
): boolean {
  return JSON.stringify(Object.keys(actual).sort()) ===
    JSON.stringify(Object.keys(expected).sort());
}

function matchesClaimBoundaryV0_1(value: unknown): boolean {
  if (!isRecordV0_1(value) || !hasExactKeysV0_1(value, CLAIM_BOUNDARY_V0_1)) {
    return false;
  }

  return Object.entries(CLAIM_BOUNDARY_V0_1).every(
    ([key, expectedValue]) => value[key] === expectedValue,
  );
}

function matchesGenericProvenanceV1(value: unknown, expectedPath: readonly [SevenVoiceKey, SevenVoiceKey]): boolean {
  if (!isRecordV0_1(value)) return false;

  const expected = {
    ruleId: DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1,
    doctrineAuthority:
      "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts",
    doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
    orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
    analyzedVoicePath: expectedPath,
  } as const;

  return (
    hasExactKeysV0_1(value, expected) &&
    value.ruleId === expected.ruleId &&
    value.doctrineAuthority === expected.doctrineAuthority &&
    value.doctrineProfileSchema === expected.doctrineProfileSchema &&
    value.orderedViewsSchema === expected.orderedViewsSchema &&
    Array.isArray(value.analyzedVoicePath) &&
    value.analyzedVoicePath.length === expectedPath.length &&
    value.analyzedVoicePath[0] === expectedPath[0] &&
    value.analyzedVoicePath[1] === expectedPath[1]
  );
}

function buildGenericDistinctPairReadingV1(
  inputPath: DoctrineLevel3ProofPairVoicePathV0_1,
): DoctrineLevel3ProofPairReadingV0_1 {
  const analyzedVoicePath = Object.freeze([
    inputPath[0],
    inputPath[1],
  ] as [SevenVoiceKey, SevenVoiceKey]);

  const provenance = Object.freeze({
    ruleId: DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1,
    doctrineAuthority:
      "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts" as const,
    doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
    orderedViewsSchema: sevenVoiceOrderedViewsSchemaVersion,
    analyzedVoicePath,
  });

  return Object.freeze({
    schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
    ruleId: DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1,
    level: 3,
    analyzedVoicePath,
    reading: renderDoctrineLevel3PairReadingV0_1(
      analyzedVoicePath[0],
      analyzedVoicePath[1],
    ),
    truthClassification: "inference" as const,
    doctrineAuthority:
      "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts" as const,
    doctrineProfileSchema: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
    outputShape: "bounded_phrase_or_short_clause" as const,
    genericComposition: DOCTRINE_LEVEL3_GENERIC_COMPOSITION_AUTHORIZED_V1,
    level4TransitionSemantics: "NOT_AUTHORIZED" as const,
    providerIndependent: true as const,
    externalEvidenceIndependent: true as const,
    candidateWinnerIndependent: true as const,
    claimBoundary: CLAIM_BOUNDARY_V0_1,
    userDecisionPosture: "user_decides" as const,
    noSingleWinner: true as const,
    provenance,
  });
}

export function isDoctrineLevel3ProofPairReadingV0_1(
  value: unknown,
): value is DoctrineLevel3ProofPairReadingV0_1 {
  if (!isRecordV0_1(value)) return false;

  if (DOCTRINE_LEVEL3_PROOF_PAIR_AUTHORITY_REGISTRY_V0_1.some((authorized) =>
    value.schemaVersion === authorized.schemaVersion &&
    value.ruleId === authorized.ruleId &&
    value.level === authorized.level &&
    JSON.stringify(value.analyzedVoicePath) ===
      JSON.stringify(authorized.analyzedVoicePath) &&
    value.reading === authorized.reading &&
    value.truthClassification === authorized.truthClassification &&
    value.doctrineAuthority === authorized.doctrineAuthority &&
    value.doctrineProfileSchema === authorized.doctrineProfileSchema &&
    value.outputShape === authorized.outputShape &&
    value.genericComposition === authorized.genericComposition &&
    value.level4TransitionSemantics === authorized.level4TransitionSemantics &&
    value.providerIndependent === authorized.providerIndependent &&
    value.externalEvidenceIndependent === authorized.externalEvidenceIndependent &&
    value.candidateWinnerIndependent === authorized.candidateWinnerIndependent &&
    JSON.stringify(value.claimBoundary) ===
      JSON.stringify(authorized.claimBoundary) &&
    value.userDecisionPosture === authorized.userDecisionPosture &&
    value.noSingleWinner === authorized.noSingleWinner &&
    JSON.stringify(value.provenance) === JSON.stringify(authorized.provenance),
  )) {
    return true;
  }

  if (value.ruleId !== DOCTRINE_LEVEL3_GENERIC_DISTINCT_PAIR_RULE_ID_V1) {
    return false;
  }

  const path = value.analyzedVoicePath;
  if (
    !Array.isArray(path) ||
    path.length !== 2 ||
    typeof path[0] !== "string" ||
    typeof path[1] !== "string" ||
    !isSevenVoiceKey(path[0]) ||
    !isSevenVoiceKey(path[1]) ||
    path[0] === path[1]
  ) {
    return false;
  }

  const expected = buildGenericDistinctPairReadingV1([path[0], path[1]]);
  return (
    hasExactKeysV0_1(value, expected) &&
    value.schemaVersion === expected.schemaVersion &&
    value.ruleId === expected.ruleId &&
    value.level === expected.level &&
    Array.isArray(value.analyzedVoicePath) &&
    value.analyzedVoicePath[0] === expected.analyzedVoicePath[0] &&
    value.analyzedVoicePath[1] === expected.analyzedVoicePath[1] &&
    value.reading === expected.reading &&
    value.truthClassification === expected.truthClassification &&
    value.doctrineAuthority === expected.doctrineAuthority &&
    value.doctrineProfileSchema === expected.doctrineProfileSchema &&
    value.outputShape === expected.outputShape &&
    value.genericComposition === expected.genericComposition &&
    value.level4TransitionSemantics === expected.level4TransitionSemantics &&
    value.providerIndependent === expected.providerIndependent &&
    value.externalEvidenceIndependent === expected.externalEvidenceIndependent &&
    value.candidateWinnerIndependent === expected.candidateWinnerIndependent &&
    matchesClaimBoundaryV0_1(value.claimBoundary) &&
    value.userDecisionPosture === expected.userDecisionPosture &&
    value.noSingleWinner === expected.noSingleWinner &&
    matchesGenericProvenanceV1(value.provenance, [path[0], path[1]])
  );
}

export function projectLevel3DoctrineReadingV0_1(
  inputPath: unknown,
): DoctrineLevel3ProofPairReadingV0_1 | null {
  if (!Array.isArray(inputPath) || inputPath.length !== 2) {
    return null;
  }

  const [firstVoice, secondVoice] = inputPath;
  if (
    typeof firstVoice !== "string" ||
    typeof secondVoice !== "string" ||
    !isSevenVoiceKey(firstVoice) ||
    !isSevenVoiceKey(secondVoice) ||
    firstVoice === secondVoice
  ) {
    return null;
  }

  return buildGenericDistinctPairReadingV1([firstVoice, secondVoice]);
}

export type DoctrineLevel3ProofPairVoicePathV0_1 = readonly [
  SevenVoiceKey,
  SevenVoiceKey,
];
