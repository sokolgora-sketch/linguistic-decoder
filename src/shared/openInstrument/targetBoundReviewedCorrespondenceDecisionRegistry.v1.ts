import {
  DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
} from "./doctrineFunctionalProfile.v0_1";
import type { ComparativeVerdictV0_1 } from "./functionalRoleComparativeEvaluationContract.v0_1";
import {
  TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_PROFILE_REGISTRY_V1,
  TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1,
  type TargetBoundCorrespondenceDecisionRuleV1,
  type TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1,
  type TargetBoundCorrespondenceRationaleRelationshipV1,
  type TargetBoundCorrespondenceReviewReasonCodeV1,
  validateTargetBoundCorrespondenceDecisionRuleV1,
} from "./targetBoundCorrespondenceDecisionRule.v1";
import type {
  TargetBoundFunctionalCorrespondencePackageV1,
} from "./targetBoundFunctionalCorrespondence.v1";
import type { SourceEntryAttestationV1 } from "./sourceEntryAttestation.v1";
import type { TargetBlindReviewedSourceAttestationV1 } from "./targetBlindReviewedSourceAttestation.v1";

export const TARGET_BOUND_REVIEWED_CORRESPONDENCE_DECISION_REGISTRY_SCHEMA_V1 =
  "open-instrument.target-bound-reviewed-correspondence-decision-registry.v1" as const;

export const TARGET_BOUND_REVIEWED_CORRESPONDENCE_DECISION_REGISTRY_EXPECTED_COUNT_V1 =
  12 as const;

const TARGET_BOUND_PACKAGE_FINGERPRINT_V1 =
  "913d7d0904399333d79d4f30efb5d4e1085592ef80af1037efb7b02a693901c9" as const;
const TARGET_INPUT_FINGERPRINT_V1 =
  "2ff642a18d3c7ce62db2306b2085b747acbf082bf0d4364866e1004f58eb2a06" as const;
const SOURCE_ATTESTATION_ID_V1 =
  "source-entry-attestation.scaife-lewis-short.form-as.v1" as const;
const SOURCE_ATTESTATION_FINGERPRINT_V1 =
  "223c2730656fbbfc774fc2febfa41f2d8b9abe491cd4c59e0ebbfcb8e63d6ae3" as const;
const SOURCE_REVIEW_FINGERPRINT_V1 =
  "c3d9d65315c81c648d84a40e3cf3c31753f5a65d54e3a85b98a90d43a0cdbbe4" as const;
const SOURCE_ENTRY_ID_V1 = "n3855" as const;
const REVIEWER_V1 = "DF / Sokol Gora" as const;
const REVIEWED_AT_V1 = "2026-09-19" as const;

type ReviewedDecisionFieldsV1 = Readonly<{
  sourceSenseId: string;
  comparisonUnitFingerprint: string;
  sourceSenseTextHash: string;
  verdict: ComparativeVerdictV0_1;
  relationship: TargetBoundCorrespondenceRationaleRelationshipV1;
  reasonCode: TargetBoundCorrespondenceReviewReasonCodeV1;
  rationale: string;
  limitations?: readonly string[];
  decisionFingerprint: string;
}>;

function deepFreezeV1<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV1(child, seen);
  }
  return Object.freeze(value);
}

function comparisonUnitIdV1(sourceSenseId: string): string {
  return `target-bound-comparison-unit:64:${TARGET_INPUT_FINGERPRINT_V1}:64:${SOURCE_ATTESTATION_FINGERPRINT_V1}:5:${SOURCE_ENTRY_ID_V1}:${sourceSenseId.length}:${sourceSenseId}`;
}

function decisionV1(fields: ReviewedDecisionFieldsV1): TargetBoundCorrespondenceDecisionRuleV1 {
  const review = {
    reviewStatus: "REVIEWED" as const,
    verdict: fields.verdict,
    reviewer: REVIEWER_V1,
    reviewerKind: "HUMAN" as const,
    reviewedAt: REVIEWED_AT_V1,
    rationale: {
      relationship: fields.relationship,
      limitations: [...(fields.limitations ?? [])],
    },
    reasonCodes: [fields.reasonCode],
  };

  return deepFreezeV1({
    schemaVersion: TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V1,
    targetBoundPackageFingerprint: TARGET_BOUND_PACKAGE_FINGERPRINT_V1,
    comparisonUnitId: comparisonUnitIdV1(fields.sourceSenseId),
    comparisonUnitFingerprint: fields.comparisonUnitFingerprint,
    targetInputFingerprint: TARGET_INPUT_FINGERPRINT_V1,
    sourceAttestationId: SOURCE_ATTESTATION_ID_V1,
    sourceAttestationFingerprint: SOURCE_ATTESTATION_FINGERPRINT_V1,
    sourceReviewFingerprint: SOURCE_REVIEW_FINGERPRINT_V1,
    sourceEntryId: SOURCE_ENTRY_ID_V1,
    sourceSenseId: fields.sourceSenseId,
    sourceSenseLocator: `TEI.2 entryFree id="${SOURCE_ENTRY_ID_V1}" key="as" sense id="${fields.sourceSenseId}"`,
    sourceSenseTextHash: fields.sourceSenseTextHash,
    doctrineProfileSchemaVersion: DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
    doctrineProfileEngineAuthority: DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
    doctrineProfileRegistry: TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_PROFILE_REGISTRY_V1,
    doctrineVoicePath: ["A"],
    targetSenseBinding: "TARGET_SENSE_PRESENT_USER_PROVIDED",
    review,
    claimBoundary: "TARGET_BOUND_CORRESPONDENCE_REVIEW_ONLY",
    functionalAcceptance: "NOT_AUTHORIZED",
    historicalRelation: "NOT_CLAIMED",
    winnerClaim: "NOT_CLAIMED",
    productionMembership: "NOT_AUTHORIZED",
    runtimeAuthorization: "NOT_AUTHORIZED",
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
    decisionFingerprint: fields.decisionFingerprint,
  });
}

export const targetBoundReviewedCorrespondenceDecisionRegistryV1 = Object.freeze([
  decisionV1({
    sourceSenseId: "n3855.0",
    comparisonUnitFingerprint: "1d50a4cd3059d6b56bdf109dc013238523dc110ce1c38deedbb2199ded9d198b",
    sourceSenseTextHash: "889db35f20630f8b632a9ab71117656fd66aac1c80bb4164924eb6510b071c46",
    verdict: "UNKNOWN",
    relationship: "UNDETERMINED",
    reasonCode: "INSUFFICIENT_AUTHORIZED_INFORMATION",
    rationale: "The cell contains grammatical, citation, and form material without sufficient standalone functional meaning to determine correspondence to the bound target sense.",
    decisionFingerprint: "a380426b7cfdf4097e142bb6e0436582593a13243d88092e538d333df148efbf",
  }),
  decisionV1({
    sourceSenseId: "n3855.1",
    comparisonUnitFingerprint: "1f216188dbacc117ecb68f9d531a9d72981f4252035b20d8c3ae86dd2e8d9e91",
    sourceSenseTextHash: "4ee9bd3a1360f40a7eaaaaf4fc3783c5e84bc3d94b30c2fde945549bb3ab8b9c",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes unity, a unit, and quantitative standards; these functions do not correspond to the bound target sense \"I speak / I talk\".",
    decisionFingerprint: "9dbccaa9ed7e63b259062bd22810bc9c9f7fdd80cf76233bdc33a20195cfd1a9",
  }),
  decisionV1({
    sourceSenseId: "n3855.2",
    comparisonUnitFingerprint: "26b2b603ac49251f29b43b1a9d4591665af6890a157444bcfe6903b7bb73073f",
    sourceSenseTextHash: "c282b38b0b484f134152184d7ba7414054c86f91c98d1c4be6b29c278d38a4e4",
    verdict: "UNKNOWN",
    relationship: "UNDETERMINED",
    reasonCode: "INSUFFICIENT_AUTHORIZED_INFORMATION",
    rationale: "The cell is a lexicographic structural marker without sufficient standalone semantic material for correspondence judgment.",
    decisionFingerprint: "0c259c4e945d29bc649e4a363b212e080fd4204af0d70a63643523ad2c370a25",
  }),
  decisionV1({
    sourceSenseId: "n3855.3",
    comparisonUnitFingerprint: "92e57e917ceacab4d7f16c258ac5271ed069c6b2b46a995521446d4c641039b9",
    sourceSenseTextHash: "4992e458de13d583be1804e304f6eaddda3029cf243863371a9ac73bf636c7eb",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes a coin, monetary value, and valuation functions; these do not correspond to the bound target sense.",
    decisionFingerprint: "f72cbc714b2631ccc87cfc27a183585079e0a296d9f0a402ce337c8782c90701",
  }),
  decisionV1({
    sourceSenseId: "n3855.4",
    comparisonUnitFingerprint: "937161bfbe0e066d8206499e624010350f7017866dee6e6b700ce87f2af6689b",
    sourceSenseTextHash: "08d3a34ae8d9ac01b89e89064215ccb5fc4fab0028a9dd49a936fc9085117349",
    verdict: "NULL",
    relationship: "NOT_APPLICABLE",
    reasonCode: "NO_DEFENSIBLE_COMPARISON",
    rationale: "The cell is an incomplete continuation heading rather than a complete lexical meaning, so no defensible functional comparison can be made.",
    limitations: ["Incomplete continuation marker only."],
    decisionFingerprint: "ae9ceea31d9213159d5fef865805a41dd921aeec96328f8ce8d76ac30cdcb724",
  }),
  decisionV1({
    sourceSenseId: "n3855.5",
    comparisonUnitFingerprint: "0f98839ffedf64d8db4968932e8c5a9ec73a85c5eae153466bc952a497a00c9a",
    sourceSenseTextHash: "181a498f7b1796b82bda980203fb19cdac44182a76c9db7258d1677a01799db5",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes possession-based valuation and personal worth rather than speaking or talking.",
    decisionFingerprint: "e4f8aac12e012837e50fb70d7b81445aa6b5bcffda1ec7336406d2d0ba4ebdea",
  }),
  decisionV1({
    sourceSenseId: "n3855.6",
    comparisonUnitFingerprint: "04c3956a786b91f184b018cfd5713c822de0e157e4012426e7510b28ba8d10e7",
    sourceSenseTextHash: "e82ccf47feb5146fa853fe6f4ebc54f6aa4007f592339f490389b95658178ef9",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "Although the source mentions petitioning context, its attested functional center is deferential giving to a superior rather than speaking or talking.",
    decisionFingerprint: "88725cdc029659af0c333354e43c1a47dc4204fa644628b915caebc37d66e34e",
  }),
  decisionV1({
    sourceSenseId: "n3855.7",
    comparisonUnitFingerprint: "a74e9c6b9a225c59b3fa5825460eb082d471944f642af17aabfe41d639d3415e",
    sourceSenseTextHash: "a62386d86718883a0e9b263fadccb9f210cbd62f810974c8c04a29e32396db2c",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes inheritance portions, ownership shares, and completeness rather than speaking or talking.",
    decisionFingerprint: "c74ea763f6430aab630c146be1bff59445bce63b471c13452f90ff22cd55b479",
  }),
  decisionV1({
    sourceSenseId: "n3855.8",
    comparisonUnitFingerprint: "c6ed83b1120ad9debff443c21833351a514e58388322aee1b02a3369b98342aa",
    sourceSenseTextHash: "c35914df87ee706ab4adaa17b8337ece0f21636ce486cb8c523cfc51fedd65d7",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes measurement of spatial extent rather than speaking or talking.",
    decisionFingerprint: "0c7ea2275c98b8b3b111cfbcab4204aac48f602f9c12a16c7fdf006f61dd6c3a",
  }),
  decisionV1({
    sourceSenseId: "n3855.9",
    comparisonUnitFingerprint: "d9cfadf4f7aaeec2005b7eee1e447f9f9fcc9f3f5ed4fdd97d88c0344d96259d",
    sourceSenseTextHash: "d82efc9a30d19e5246f43492828be5ba04f285b227fffbc67a80277d6f0c6af0",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes an acre and land-area measurement rather than speaking or talking.",
    decisionFingerprint: "4970e817905a74dadf12607f1ff598d7e8011f224ca49edcdb1afa21afb1dd6d",
  }),
  decisionV1({
    sourceSenseId: "n3855.10",
    comparisonUnitFingerprint: "9c55644693a73ff70a703128154ef5750c552894c889135e1f83187fe88d052c",
    sourceSenseTextHash: "fbd9a3ecc406b7ec674b67445c57bd143cb13c150add87a5a03a69abb1bcb8fa",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source identifies a unit of length and does not functionally correspond to speaking or talking.",
    decisionFingerprint: "1729c7a0a2d2523b5dac56ea6e31c0d5f047d7b418d96368e5a801d7ccdf0ec0",
  }),
  decisionV1({
    sourceSenseId: "n3855.11",
    comparisonUnitFingerprint: "724818d1401bbdc0113eaabd2eb2d435585e471a07750eb9ff1cf3fa3bbdfd81",
    sourceSenseTextHash: "7187fbdb5d07963676d34ef35e255b74aec5582f304dbda7a341a4aa02ec37b6",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes weight, a pound, and numerical terminology rather than speaking or talking.",
    decisionFingerprint: "acae842977d4b35a7de00fdcd306e2ba7767323d61307988106e76cea2b8af7c",
  }),
] as const);

export type TargetBoundReviewedCorrespondenceDecisionRegistryValidationReasonCodeV1 =
  | "REGISTRY_INPUT_NOT_ARRAY"
  | "REGISTRY_COUNT_INVALID"
  | "REGISTRY_NOT_DEEPLY_IMMUTABLE"
  | "RECORD_NOT_REVIEWED"
  | "REVIEWER_KIND_NOT_HUMAN"
  | "DUPLICATE_COMPARISON_UNIT_ID"
  | "CONFLICTING_COMPARISON_UNIT_ID"
  | TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1;

export type TargetBoundReviewedCorrespondenceDecisionRegistryValidationResultV1 = Readonly<
  | { ok: true; registry: readonly TargetBoundCorrespondenceDecisionRuleV1[] }
  | {
      ok: false;
      reasonCodes: readonly TargetBoundReviewedCorrespondenceDecisionRegistryValidationReasonCodeV1[];
    }
>;

function isRecordV1(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDeepFrozenV1(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value);
  return Object.values(value as Record<string, unknown>).every((child) =>
    isDeepFrozenV1(child, seen),
  );
}

export function validateTargetBoundReviewedCorrespondenceDecisionRegistryV1(
  value: unknown,
  packageValue: unknown,
  attestationValue: unknown,
  sourceReviewValue: unknown,
): TargetBoundReviewedCorrespondenceDecisionRegistryValidationResultV1 {
  if (!Array.isArray(value)) return { ok: false, reasonCodes: ["REGISTRY_INPUT_NOT_ARRAY"] };
  const reasons = new Set<TargetBoundReviewedCorrespondenceDecisionRegistryValidationReasonCodeV1>();
  if (value.length !== TARGET_BOUND_REVIEWED_CORRESPONDENCE_DECISION_REGISTRY_EXPECTED_COUNT_V1) {
    reasons.add("REGISTRY_COUNT_INVALID");
  }
  if (!isDeepFrozenV1(value)) reasons.add("REGISTRY_NOT_DEEPLY_IMMUTABLE");

  const seen = new Map<string, Record<string, unknown>>();
  for (const candidate of value) {
    if (!isRecordV1(candidate)) {
      reasons.add("INPUT_NOT_OBJECT");
      continue;
    }
    if (
      !isRecordV1(candidate.review) ||
      candidate.review.reviewStatus !== "REVIEWED"
    ) {
      reasons.add("RECORD_NOT_REVIEWED");
    } else if (candidate.review.reviewerKind !== "HUMAN") {
      reasons.add("REVIEWER_KIND_NOT_HUMAN");
    }

    const comparisonUnitId = candidate.comparisonUnitId;
    if (typeof comparisonUnitId === "string") {
      const prior = seen.get(comparisonUnitId);
      if (prior) {
        if (prior.decisionFingerprint === candidate.decisionFingerprint) {
          reasons.add("DUPLICATE_COMPARISON_UNIT_ID");
        } else {
          reasons.add("CONFLICTING_COMPARISON_UNIT_ID");
        }
      } else {
        seen.set(comparisonUnitId, candidate);
      }
    }

    const decisionResult = validateTargetBoundCorrespondenceDecisionRuleV1(
      candidate,
      packageValue,
      attestationValue,
      sourceReviewValue,
    );
    if (!decisionResult.ok) {
      for (const reasonCode of decisionResult.reasonCodes) reasons.add(reasonCode);
    }
  }

  const reasonCodes = [...reasons].sort();
  if (reasonCodes.length > 0) return { ok: false, reasonCodes };
  return {
    ok: true,
    registry: value as readonly TargetBoundCorrespondenceDecisionRuleV1[],
  };
}

export function getTargetBoundReviewedCorrespondenceDecisionV1(
  comparisonUnitId: string,
): TargetBoundCorrespondenceDecisionRuleV1 | null {
  return targetBoundReviewedCorrespondenceDecisionRegistryV1.find(
    (decision) => decision.comparisonUnitId === comparisonUnitId,
  ) ?? null;
}
