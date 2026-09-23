import {
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
} from "@/shared/openInstrument/doctrineFunctionalProfile.v0_1";
import {
  sevenVoiceOrderedViewsSchemaVersion,
  type SevenVoiceKey,
} from "@/shared/sevenVoiceOrderedViews.v0.1";

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
    | typeof DOCTRINE_LEVEL3_PROOF_PAIR_I_O_RULE_ID_V0_1;
  level: 3;
  analyzedVoicePath:
    | typeof AUTHORIZED_PATH_U_Y_V0_1
    | typeof AUTHORIZED_PATH_A_E_V0_1
    | typeof AUTHORIZED_PATH_E_A_V0_1
    | typeof AUTHORIZED_PATH_I_O_V0_1;
  reading:
    | "grounded depth with reflective exploration"
    | "initiating beginning with expanding growth"
    | "expanding growth with initiating beginning"
    | "clear understanding with balanced mediation";
  truthClassification: "inference";
  doctrineAuthority: "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts";
  doctrineProfileSchema: typeof DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1;
  outputShape: "bounded_phrase_or_short_clause";
  genericComposition: "NOT_AUTHORIZED";
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
    | typeof PROVENANCE_I_O_V0_1;
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
  genericComposition: "NOT_AUTHORIZED",
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
  genericComposition: "NOT_AUTHORIZED",
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
  genericComposition: "NOT_AUTHORIZED",
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
  genericComposition: "NOT_AUTHORIZED",
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

export function isDoctrineLevel3ProofPairReadingV0_1(
  value: unknown,
): value is DoctrineLevel3ProofPairReadingV0_1 {
  if (!isRecordV0_1(value)) return false;

  return DOCTRINE_LEVEL3_PROOF_PAIR_AUTHORITY_REGISTRY_V0_1.some((authorized) =>
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
  );
}

export function projectLevel3DoctrineReadingV0_1(
  inputPath: unknown,
): DoctrineLevel3ProofPairReadingV0_1 | null {
  if (!Array.isArray(inputPath) || inputPath.length !== 2) {
    return null;
  }

  return (
    DOCTRINE_LEVEL3_PROOF_PAIR_AUTHORITY_REGISTRY_V0_1.find(
      (authorized) =>
        inputPath[0] === authorized.analyzedVoicePath[0] &&
        inputPath[1] === authorized.analyzedVoicePath[1],
    ) ?? null
  );
}

export type DoctrineLevel3ProofPairVoicePathV0_1 = readonly [
  SevenVoiceKey,
  SevenVoiceKey,
];
