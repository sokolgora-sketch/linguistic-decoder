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

const AUTHORIZED_PATH_V0_1 = Object.freeze(["U", "Y"] as const);

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
  analyzedVoicePath: AUTHORIZED_PATH_V0_1,
} as const);

export type DoctrineLevel3ProofPairReadingV0_1 = Readonly<{
  schemaVersion: typeof DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1;
  ruleId: typeof DOCTRINE_LEVEL3_PROOF_PAIR_RULE_ID_V0_1;
  level: 3;
  analyzedVoicePath: typeof AUTHORIZED_PATH_V0_1;
  reading: "grounded depth with reflective exploration";
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
  provenance: typeof PROVENANCE_V0_1;
}>;

export const DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1 = Object.freeze({
  schemaVersion: DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1,
  ruleId: DOCTRINE_LEVEL3_PROOF_PAIR_RULE_ID_V0_1,
  level: 3,
  analyzedVoicePath: AUTHORIZED_PATH_V0_1,
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

function isRecordV0_1(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function isDoctrineLevel3ProofPairReadingV0_1(
  value: unknown,
): value is DoctrineLevel3ProofPairReadingV0_1 {
  if (!isRecordV0_1(value)) return false;

  return (
    value.schemaVersion === DOCTRINE_LEVEL3_PROOF_PAIR_SCHEMA_V0_1 &&
    value.ruleId === DOCTRINE_LEVEL3_PROOF_PAIR_RULE_ID_V0_1 &&
    value.level === 3 &&
    JSON.stringify(value.analyzedVoicePath) ===
      JSON.stringify(AUTHORIZED_PATH_V0_1) &&
    value.reading === "grounded depth with reflective exploration" &&
    value.truthClassification === "inference" &&
    value.doctrineAuthority ===
      "src/shared/openInstrument/doctrineFunctionalProfile.v0_1.ts" &&
    value.doctrineProfileSchema === DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1 &&
    value.outputShape === "bounded_phrase_or_short_clause" &&
    value.genericComposition === "NOT_AUTHORIZED" &&
    value.level4TransitionSemantics === "NOT_AUTHORIZED" &&
    value.providerIndependent === true &&
    value.externalEvidenceIndependent === true &&
    value.candidateWinnerIndependent === true &&
    JSON.stringify(value.claimBoundary) ===
      JSON.stringify(CLAIM_BOUNDARY_V0_1) &&
    value.userDecisionPosture === "user_decides" &&
    value.noSingleWinner === true &&
    JSON.stringify(value.provenance) === JSON.stringify(PROVENANCE_V0_1)
  );
}

export function projectLevel3DoctrineReadingV0_1(
  inputPath: unknown,
): DoctrineLevel3ProofPairReadingV0_1 | null {
  if (!Array.isArray(inputPath) || inputPath.length !== AUTHORIZED_PATH_V0_1.length) {
    return null;
  }

  if (
    inputPath[0] !== AUTHORIZED_PATH_V0_1[0] ||
    inputPath[1] !== AUTHORIZED_PATH_V0_1[1]
  ) {
    return null;
  }

  return DOCTRINE_LEVEL3_PROOF_PAIR_U_Y_V0_1;
}

export type DoctrineLevel3ProofPairVoicePathV0_1 = readonly [
  SevenVoiceKey,
  SevenVoiceKey,
];
