import {
  DOCTRINE_FUNCTIONAL_PROFILE_ENGINE_AUTHORITY_V0_1,
  DOCTRINE_FUNCTIONAL_PROFILE_SCHEMA_V0_1,
} from "./doctrineFunctionalProfile.v0_1";
import type { ComparativeVerdictV0_1 } from "./functionalRoleComparativeEvaluationContract.v0_1";
import {
  TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_PROFILE_REGISTRY_V1,
  type TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1,
  type TargetBoundCorrespondenceRationaleRelationshipV1,
  type TargetBoundCorrespondenceReviewReasonCodeV1,
} from "./targetBoundCorrespondenceDecisionRule.v1";
import {
  TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2,
  type TargetBoundCorrespondenceDecisionRuleV2,
  validateTargetBoundCorrespondenceDecisionRuleV2,
} from "./targetBoundCorrespondenceDecisionRule.v2";
import type {
  TargetBoundFunctionalCorrespondencePackageV1,
} from "./targetBoundFunctionalCorrespondence.v1";
import type { SourceEntryAttestationV1 } from "./sourceEntryAttestation.v1";
import type { TargetBlindReviewedSourceAttestationV1 } from "./targetBlindReviewedSourceAttestation.v1";

export const TARGET_BOUND_REVIEWED_CORRESPONDENCE_DECISION_REGISTRY_SCHEMA_V2 =
  "open-instrument.target-bound-reviewed-correspondence-decision-registry.v2" as const;

export const TARGET_BOUND_REVIEWED_CORRESPONDENCE_DECISION_REGISTRY_EXPECTED_COUNT_V2 =
  12 as const;

const TARGET_BOUND_PACKAGE_FINGERPRINT_V2 =
  "913d7d0904399333d79d4f30efb5d4e1085592ef80af1037efb7b02a693901c9" as const;
const TARGET_INPUT_FINGERPRINT_V2 =
  "2ff642a18d3c7ce62db2306b2085b747acbf082bf0d4364866e1004f58eb2a06" as const;
const SOURCE_ATTESTATION_ID_V2 =
  "source-entry-attestation.scaife-lewis-short.form-as.v1" as const;
const SOURCE_ATTESTATION_FINGERPRINT_V2 =
  "223c2730656fbbfc774fc2febfa41f2d8b9abe491cd4c59e0ebbfcb8e63d6ae3" as const;
const SOURCE_REVIEW_FINGERPRINT_V2 =
  "c3d9d65315c81c648d84a40e3cf3c31753f5a65d54e3a85b98a90d43a0cdbbe4" as const;
const SOURCE_ENTRY_ID_V2 = "n3855" as const;
const REVIEWER_V2 = "DF / Sokol Gora" as const;
const REVIEWED_AT_V2 = "2026-09-19" as const;

type ReviewedDecisionFieldsV2 = Readonly<{
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

function deepFreezeV2<T>(value: T, seen = new WeakSet<object>()): T {
  if (value === null || typeof value !== "object" || seen.has(value)) return value;
  seen.add(value);
  for (const child of Object.values(value as Record<string, unknown>)) {
    deepFreezeV2(child, seen);
  }
  return Object.freeze(value);
}

function comparisonUnitIdV2(sourceSenseId: string): string {
  return `target-bound-comparison-unit:64:${TARGET_INPUT_FINGERPRINT_V2}:64:${SOURCE_ATTESTATION_FINGERPRINT_V2}:5:${SOURCE_ENTRY_ID_V2}:${sourceSenseId.length}:${sourceSenseId}`;
}

function decisionV2(fields: ReviewedDecisionFieldsV2): TargetBoundCorrespondenceDecisionRuleV2 {
  const review = {
    reviewStatus: "REVIEWED" as const,
    verdict: fields.verdict,
    reviewer: REVIEWER_V2,
    reviewerKind: "HUMAN" as const,
    reviewedAt: REVIEWED_AT_V2,
    rationale: {
      relationship: fields.relationship,
      limitations: [...(fields.limitations ?? [])],
      text: fields.rationale,
    },
    reasonCodes: [fields.reasonCode],
  };

  return deepFreezeV2({
    schemaVersion: TARGET_BOUND_CORRESPONDENCE_DECISION_RULE_SCHEMA_V2,
    targetBoundPackageFingerprint: TARGET_BOUND_PACKAGE_FINGERPRINT_V2,
    comparisonUnitId: comparisonUnitIdV2(fields.sourceSenseId),
    comparisonUnitFingerprint: fields.comparisonUnitFingerprint,
    targetInputFingerprint: TARGET_INPUT_FINGERPRINT_V2,
    sourceAttestationId: SOURCE_ATTESTATION_ID_V2,
    sourceAttestationFingerprint: SOURCE_ATTESTATION_FINGERPRINT_V2,
    sourceReviewFingerprint: SOURCE_REVIEW_FINGERPRINT_V2,
    sourceEntryId: SOURCE_ENTRY_ID_V2,
    sourceSenseId: fields.sourceSenseId,
    sourceSenseLocator: `TEI.2 entryFree id="${SOURCE_ENTRY_ID_V2}" key="as" sense id="${fields.sourceSenseId}"`,
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

export const targetBoundReviewedCorrespondenceDecisionRegistryV2 = Object.freeze([
  decisionV2({
    sourceSenseId: "n3855.0",
    comparisonUnitFingerprint: "1d50a4cd3059d6b56bdf109dc013238523dc110ce1c38deedbb2199ded9d198b",
    sourceSenseTextHash: "889db35f20630f8b632a9ab71117656fd66aac1c80bb4164924eb6510b071c46",
    verdict: "UNKNOWN",
    relationship: "UNDETERMINED",
    reasonCode: "INSUFFICIENT_AUTHORIZED_INFORMATION",
    rationale: "The cell contains grammatical, citation, and form material without sufficient standalone functional meaning to determine correspondence to the bound target sense.",
    decisionFingerprint: "e7e479815953d26836b59199259211b49b36e05adcb76ca66d98cab59acc441c",
  }),
  decisionV2({
    sourceSenseId: "n3855.1",
    comparisonUnitFingerprint: "1f216188dbacc117ecb68f9d531a9d72981f4252035b20d8c3ae86dd2e8d9e91",
    sourceSenseTextHash: "4ee9bd3a1360f40a7eaaaaf4fc3783c5e84bc3d94b30c2fde945549bb3ab8b9c",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes unity, a unit, and quantitative standards; these functions do not correspond to the bound target sense \"I speak / I talk\".",
    decisionFingerprint: "65a7cf45e7405cc4983858c26a78d0960f642171b68537ad1d6b58d35eefc706",
  }),
  decisionV2({
    sourceSenseId: "n3855.2",
    comparisonUnitFingerprint: "26b2b603ac49251f29b43b1a9d4591665af6890a157444bcfe6903b7bb73073f",
    sourceSenseTextHash: "c282b38b0b484f134152184d7ba7414054c86f91c98d1c4be6b29c278d38a4e4",
    verdict: "UNKNOWN",
    relationship: "UNDETERMINED",
    reasonCode: "INSUFFICIENT_AUTHORIZED_INFORMATION",
    rationale: "The cell is a lexicographic structural marker without sufficient standalone semantic material for correspondence judgment.",
    decisionFingerprint: "3f65a69291c60cc1e93c913e724308a6eab59bd3e1d4870570ca0f810c0afef7",
  }),
  decisionV2({
    sourceSenseId: "n3855.3",
    comparisonUnitFingerprint: "92e57e917ceacab4d7f16c258ac5271ed069c6b2b46a995521446d4c641039b9",
    sourceSenseTextHash: "4992e458de13d583be1804e304f6eaddda3029cf243863371a9ac73bf636c7eb",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes a coin, monetary value, and valuation functions; these do not correspond to the bound target sense.",
    decisionFingerprint: "4bee931b77ab367f40dfcabe9ecec7564854ba3e9b7591657446973977ba606f",
  }),
  decisionV2({
    sourceSenseId: "n3855.4",
    comparisonUnitFingerprint: "937161bfbe0e066d8206499e624010350f7017866dee6e6b700ce87f2af6689b",
    sourceSenseTextHash: "08d3a34ae8d9ac01b89e89064215ccb5fc4fab0028a9dd49a936fc9085117349",
    verdict: "NULL",
    relationship: "NOT_APPLICABLE",
    reasonCode: "NO_DEFENSIBLE_COMPARISON",
    rationale: "The cell is an incomplete continuation heading rather than a complete lexical meaning, so no defensible functional comparison can be made.",
    limitations: ["Incomplete continuation marker only."],
    decisionFingerprint: "5bb5568090bff9a29488d85d0cc6f756b8e5729d4cbb0ef4e2eace2caf3b301f",
  }),
  decisionV2({
    sourceSenseId: "n3855.5",
    comparisonUnitFingerprint: "0f98839ffedf64d8db4968932e8c5a9ec73a85c5eae153466bc952a497a00c9a",
    sourceSenseTextHash: "181a498f7b1796b82bda980203fb19cdac44182a76c9db7258d1677a01799db5",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes possession-based valuation and personal worth rather than speaking or talking.",
    decisionFingerprint: "160c0bd674d88400077f40df29907d2cdb7b66377e24fe6a128a732c96c6e7a3",
  }),
  decisionV2({
    sourceSenseId: "n3855.6",
    comparisonUnitFingerprint: "04c3956a786b91f184b018cfd5713c822de0e157e4012426e7510b28ba8d10e7",
    sourceSenseTextHash: "e82ccf47feb5146fa853fe6f4ebc54f6aa4007f592339f490389b95658178ef9",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "Although the source mentions petitioning context, its attested functional center is deferential giving to a superior rather than speaking or talking.",
    decisionFingerprint: "be1fecbd3417d2832194b3a5a983cfc249531e4f31d76bd16111a0a7c7be94a5",
  }),
  decisionV2({
    sourceSenseId: "n3855.7",
    comparisonUnitFingerprint: "a74e9c6b9a225c59b3fa5825460eb082d471944f642af17aabfe41d639d3415e",
    sourceSenseTextHash: "a62386d86718883a0e9b263fadccb9f210cbd62f810974c8c04a29e32396db2c",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes inheritance portions, ownership shares, and completeness rather than speaking or talking.",
    decisionFingerprint: "a7dbe411e7d5cf84a23f1e0885f18920899ec0ca056269ca8c3e296907035eaa",
  }),
  decisionV2({
    sourceSenseId: "n3855.8",
    comparisonUnitFingerprint: "c6ed83b1120ad9debff443c21833351a514e58388322aee1b02a3369b98342aa",
    sourceSenseTextHash: "c35914df87ee706ab4adaa17b8337ece0f21636ce486cb8c523cfc51fedd65d7",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes measurement of spatial extent rather than speaking or talking.",
    decisionFingerprint: "8c9e4873d60ca8452a01726d82220403cc86504716c8d23f34c16e1a54664a25",
  }),
  decisionV2({
    sourceSenseId: "n3855.9",
    comparisonUnitFingerprint: "d9cfadf4f7aaeec2005b7eee1e447f9f9fcc9f3f5ed4fdd97d88c0344d96259d",
    sourceSenseTextHash: "d82efc9a30d19e5246f43492828be5ba04f285b227fffbc67a80277d6f0c6af0",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes an acre and land-area measurement rather than speaking or talking.",
    decisionFingerprint: "035f3e63f77383597f816fc47ada5bc701a7a9c2f02b5fa6f0e928029a63c427",
  }),
  decisionV2({
    sourceSenseId: "n3855.10",
    comparisonUnitFingerprint: "9c55644693a73ff70a703128154ef5750c552894c889135e1f83187fe88d052c",
    sourceSenseTextHash: "fbd9a3ecc406b7ec674b67445c57bd143cb13c150add87a5a03a69abb1bcb8fa",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source identifies a unit of length and does not functionally correspond to speaking or talking.",
    decisionFingerprint: "f45c851a658c614db5c5ac5a0992b407f287b48cd849f9ddaf89bd85be86f6d0",
  }),
  decisionV2({
    sourceSenseId: "n3855.11",
    comparisonUnitFingerprint: "724818d1401bbdc0113eaabd2eb2d435585e471a07750eb9ff1cf3fa3bbdfd81",
    sourceSenseTextHash: "7187fbdb5d07963676d34ef35e255b74aec5582f304dbda7a341a4aa02ec37b6",
    verdict: "UNSUPPORTED",
    relationship: "NONE",
    reasonCode: "REVIEWED_NON_SUPPORT",
    rationale: "The source describes weight, a pound, and numerical terminology rather than speaking or talking.",
    decisionFingerprint: "c2faa8aefad199c4af7903c76d7a660130412b81223c5199958ad75e8ac3de9f",
  }),
] as const);

export type TargetBoundReviewedCorrespondenceDecisionRegistryValidationReasonCodeV2 =
  | "REGISTRY_INPUT_NOT_ARRAY"
  | "REGISTRY_COUNT_INVALID"
  | "REGISTRY_NOT_DEEPLY_IMMUTABLE"
  | "RECORD_NOT_REVIEWED"
  | "REVIEWER_KIND_NOT_HUMAN"
  | "DUPLICATE_COMPARISON_UNIT_ID"
  | "CONFLICTING_COMPARISON_UNIT_ID"
  | TargetBoundCorrespondenceDecisionRuleValidationReasonCodeV1;

export type TargetBoundReviewedCorrespondenceDecisionRegistryValidationResultV2 = Readonly<
  | { ok: true; registry: readonly TargetBoundCorrespondenceDecisionRuleV2[] }
  | {
      ok: false;
      reasonCodes: readonly TargetBoundReviewedCorrespondenceDecisionRegistryValidationReasonCodeV2[];
    }
>;

function isRecordV2(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isDeepFrozenV2(value: unknown, seen = new WeakSet<object>()): boolean {
  if (value === null || typeof value !== "object" || seen.has(value)) return true;
  if (!Object.isFrozen(value)) return false;
  seen.add(value);
  return Object.values(value as Record<string, unknown>).every((child) =>
    isDeepFrozenV2(child, seen),
  );
}

export function validateTargetBoundReviewedCorrespondenceDecisionRegistryV2(
  value: unknown,
  packageValue: unknown,
  attestationValue: unknown,
  sourceReviewValue: unknown,
): TargetBoundReviewedCorrespondenceDecisionRegistryValidationResultV2 {
  if (!Array.isArray(value)) return { ok: false, reasonCodes: ["REGISTRY_INPUT_NOT_ARRAY"] };
  const reasons = new Set<TargetBoundReviewedCorrespondenceDecisionRegistryValidationReasonCodeV2>();
  if (value.length !== TARGET_BOUND_REVIEWED_CORRESPONDENCE_DECISION_REGISTRY_EXPECTED_COUNT_V2) {
    reasons.add("REGISTRY_COUNT_INVALID");
  }
  if (!isDeepFrozenV2(value)) reasons.add("REGISTRY_NOT_DEEPLY_IMMUTABLE");

  const seen = new Map<string, Record<string, unknown>>();
  for (const candidate of value) {
    if (!isRecordV2(candidate)) {
      reasons.add("INPUT_NOT_OBJECT");
      continue;
    }
    if (
      !isRecordV2(candidate.review) ||
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

    const decisionResult = validateTargetBoundCorrespondenceDecisionRuleV2(
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
    registry: value as readonly TargetBoundCorrespondenceDecisionRuleV2[],
  };
}

export function getTargetBoundReviewedCorrespondenceDecisionV2(
  comparisonUnitId: string,
): TargetBoundCorrespondenceDecisionRuleV2 | null {
  return targetBoundReviewedCorrespondenceDecisionRegistryV2.find(
    (decision) => decision.comparisonUnitId === comparisonUnitId,
  ) ?? null;
}
