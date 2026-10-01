import { createHash } from "node:crypto";

export const ONE_EMBRYO_PROOF_M2_SCHEMA_V0_1 =
  "open-instrument.one-embryo-proof-m2-preregistration.v0.1" as const;
export const ONE_EMBRYO_PROOF_M2_CONTRACT_ID_V0_1 =
  "OPEN_INSTRUMENT_ONE_EMBRYO_PROOF_V1_M2_PREREGISTRATION_V0_1" as const;
export const ONE_EMBRYO_PROOF_M2_STATUS_V0_1 =
  "FROZEN_PREREGISTRATION_CONTRACT_ONLY" as const;

export const M2_REQUIRED_PRE_REVEAL_ARTIFACTS_V0_1 = [
  "M2_PREREGISTRATION_CONTRACT",
  "M2_TARGET_POOL_DEFINITION",
  "M2_TARGET_SELECTION_RECORD",
  "M2_STRUCTURAL_EMBRYO_FREEZE",
  "M2_BLIND_PAYLOAD",
  "M3_PRE_REVEAL_DISCOVERY",
  "M3_PRE_REVEAL_FUNCTION_OR_NULL",
  "M3_PRE_REVEAL_HASH_MANIFEST",
] as const;

export const M2_REQUIRED_VALID_PROOF_ARTIFACTS_V0_1 = [
  ...M2_REQUIRED_PRE_REVEAL_ARTIFACTS_V0_1,
  "M5_POST_REVEAL_CORRESPONDENCE_RESULT",
] as const;

export type M2RequiredArtifactIdV0_1 =
  (typeof M2_REQUIRED_VALID_PROOF_ARTIFACTS_V0_1)[number];

export type M2IntegrityFailureCodeV0_1 =
  | "REQUIRED_ARTIFACT_MISSING"
  | "ARTIFACT_HASH_UNVERIFIED"
  | "ARTIFACT_HASH_MISMATCH"
  | "ARTIFACT_CREATED_AFTER_REVEAL"
  | "ARTIFACT_NOT_IMMUTABLE"
  | "DUPLICATE_ARTIFACT_ID"
  | "HASH_CHAIN_UNVERIFIED"
  | "SEARCH_STATE_INCOMPLETE"
  | "PRE_REVEAL_DECISION_NOT_FROZEN"
  | "BLINDNESS_VIOLATION"
  | "MANUAL_REVEAL_AUTHORIZATION_MISSING"
  | "POST_REVEAL_RESULT_MISSING"
  | "POST_REVEAL_RESULT_HASH_UNVERIFIED"
  | "POST_REVEAL_EVALUATION_INCOMPLETE";

export type M2SyntheticPoolCandidateV0_1 = Readonly<{
  opaqueCandidateId: string;
  eligibility: "ELIGIBLE" | "EXCLUDED";
  previouslyUsed: boolean;
  previouslyRevealed: boolean;
  identityAmbiguous: boolean;
}>;

export type M2BlindPayloadV0_1 = Readonly<{
  schemaVersion: typeof ONE_EMBRYO_PROOF_M2_SCHEMA_V0_1;
  caseOpaqueId: string;
  structuralEmbryo: string;
  structuralFingerprint: string;
  voicePath: readonly string[];
  sourceUniverseId: string;
  searchPolicyId: string;
  stopRuleId: string;
  claimBoundary: readonly string[];
  targetRevealStatus: "FORBIDDEN_UNTIL_REVEAL_GATE";
}>;

export type M2ArtifactRecordV0_1 = Readonly<{
  artifactId: M2RequiredArtifactIdV0_1;
  present: boolean;
  expectedSha256: string | null;
  observedSha256: string | null;
  expectedByteLength: number | null;
  observedByteLength: number | null;
  createdBeforeReveal: boolean;
  immutableAfterFreeze: boolean;
}>;

export type M2RevealGateInputV0_1 = Readonly<{
  artifacts: readonly M2ArtifactRecordV0_1[];
  hashChainVerified: boolean;
  searchStateComplete: boolean;
  preRevealDecisionFrozen: boolean;
  blindnessViolation: boolean;
  manualRevealAuthorization: boolean;
}>;

export type M2RevealGateResultV0_1 = Readonly<{
  allowed: boolean;
  reasonCodes: readonly M2IntegrityFailureCodeV0_1[];
}>;

export type M2ProofValidityInputV0_1 = Readonly<{
  revealGate: M2RevealGateInputV0_1;
  postRevealArtifact: M2ArtifactRecordV0_1 | null;
  targetRevealPerformed: boolean;
  postRevealEvaluationComplete: boolean;
}>;

export type M2ProofValidityResultV0_1 = Readonly<{
  valid: boolean;
  reasonCodes: readonly M2IntegrityFailureCodeV0_1[];
}>;

const SHA256_PATTERN_V0_1 = /^[0-9a-f]{64}$/u;

const sortStringsV0_1 = (values: readonly string[]): string[] =>
  [...values].sort((left, right) => (left < right ? -1 : left > right ? 1 : 0));

export function canonicalSerializeOneEmbryoProofM2V0_1(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(canonicalSerializeOneEmbryoProofM2V0_1).join(",")}]`;
  }
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record)
    .sort()
    .map(
      (key) =>
        `${JSON.stringify(key)}:${canonicalSerializeOneEmbryoProofM2V0_1(record[key])}`,
    )
    .join(",")}}`;
}

export function sha256OneEmbryoProofM2V0_1(value: string | Buffer): string {
  return createHash("sha256").update(value).digest("hex");
}

export function selectFirstEligibleSyntheticM2CandidateV0_1(
  candidates: readonly M2SyntheticPoolCandidateV0_1[],
): M2SyntheticPoolCandidateV0_1 | null {
  return (
    [...candidates]
      .filter(
        (candidate) =>
          candidate.eligibility === "ELIGIBLE" &&
          !candidate.previouslyUsed &&
          !candidate.previouslyRevealed &&
          !candidate.identityAmbiguous,
      )
      .sort((left, right) =>
        left.opaqueCandidateId < right.opaqueCandidateId
          ? -1
          : left.opaqueCandidateId > right.opaqueCandidateId
            ? 1
            : 0,
      )[0] ?? null
  );
}

const FORBIDDEN_M2_BLIND_PAYLOAD_KEYS_V0_1 = new Set([
  "targetWord",
  "targetOrthography",
  "targetPronunciation",
  "targetSense",
  "targetSenseId",
  "targetSenseLabel",
  "targetSenseDefinition",
  "targetGloss",
  "translation",
  "etymology",
  "historicalSourceMaterial",
  "functionalEvidence",
  "expectedFunction",
  "postRevealInterpretation",
]);

export function findForbiddenM2BlindPayloadKeysV0_1(
  value: unknown,
  path = "$",
): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((child, index) =>
      findForbiddenM2BlindPayloadKeysV0_1(child, `${path}[${index}]`),
    );
  }
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => [
    ...(FORBIDDEN_M2_BLIND_PAYLOAD_KEYS_V0_1.has(key)
      ? [`${path}.${key}`]
      : []),
    ...findForbiddenM2BlindPayloadKeysV0_1(child, `${path}.${key}`),
  ]);
}

function validArtifactRecordV0_1(
  record: M2ArtifactRecordV0_1 | undefined,
): M2IntegrityFailureCodeV0_1[] {
  if (!record || !record.present) return ["REQUIRED_ARTIFACT_MISSING"];

  const reasons: M2IntegrityFailureCodeV0_1[] = [];
  if (
    !record.expectedSha256 ||
    !record.observedSha256 ||
    !SHA256_PATTERN_V0_1.test(record.expectedSha256) ||
    !SHA256_PATTERN_V0_1.test(record.observedSha256)
  ) {
    reasons.push("ARTIFACT_HASH_UNVERIFIED");
  } else if (record.expectedSha256 !== record.observedSha256) {
    reasons.push("ARTIFACT_HASH_MISMATCH");
  }
  if (
    record.expectedByteLength === null ||
    record.observedByteLength === null ||
    record.expectedByteLength !== record.observedByteLength
  ) {
    reasons.push("ARTIFACT_HASH_MISMATCH");
  }
  if (!record.createdBeforeReveal) reasons.push("ARTIFACT_CREATED_AFTER_REVEAL");
  if (!record.immutableAfterFreeze) reasons.push("ARTIFACT_NOT_IMMUTABLE");
  return reasons;
}

function uniqueSortedReasonsV0_1(
  reasons: readonly M2IntegrityFailureCodeV0_1[],
): M2IntegrityFailureCodeV0_1[] {
  return sortStringsV0_1([...new Set(reasons)]) as M2IntegrityFailureCodeV0_1[];
}

export function evaluateOneEmbryoM2RevealGateV0_1(
  input: M2RevealGateInputV0_1,
): M2RevealGateResultV0_1 {
  const reasons: M2IntegrityFailureCodeV0_1[] = [];
  const seen = new Set<string>();
  const records = new Map<string, M2ArtifactRecordV0_1>();

  for (const record of input.artifacts) {
    if (seen.has(record.artifactId)) reasons.push("DUPLICATE_ARTIFACT_ID");
    seen.add(record.artifactId);
    records.set(record.artifactId, record);
  }

  for (const artifactId of M2_REQUIRED_PRE_REVEAL_ARTIFACTS_V0_1) {
    reasons.push(...validArtifactRecordV0_1(records.get(artifactId)));
  }
  if (!input.hashChainVerified) reasons.push("HASH_CHAIN_UNVERIFIED");
  if (!input.searchStateComplete) reasons.push("SEARCH_STATE_INCOMPLETE");
  if (!input.preRevealDecisionFrozen) reasons.push("PRE_REVEAL_DECISION_NOT_FROZEN");
  if (input.blindnessViolation) reasons.push("BLINDNESS_VIOLATION");
  if (!input.manualRevealAuthorization) {
    reasons.push("MANUAL_REVEAL_AUTHORIZATION_MISSING");
  }

  const reasonCodes = uniqueSortedReasonsV0_1(reasons);
  return { allowed: reasonCodes.length === 0, reasonCodes };
}

export function evaluateOneEmbryoM2ProofValidityV0_1(
  input: M2ProofValidityInputV0_1,
): M2ProofValidityResultV0_1 {
  const revealGate = evaluateOneEmbryoM2RevealGateV0_1(input.revealGate);
  const reasons = [...revealGate.reasonCodes];
  const postRevealReasons = validArtifactRecordV0_1(input.postRevealArtifact ?? undefined);
  if (postRevealReasons.includes("REQUIRED_ARTIFACT_MISSING")) {
    reasons.push("POST_REVEAL_RESULT_MISSING");
  } else {
    if (postRevealReasons.includes("ARTIFACT_HASH_UNVERIFIED")) {
      reasons.push("POST_REVEAL_RESULT_HASH_UNVERIFIED");
    }
    if (postRevealReasons.includes("ARTIFACT_HASH_MISMATCH")) {
      reasons.push("POST_REVEAL_RESULT_HASH_UNVERIFIED");
    }
  }
  if (!input.targetRevealPerformed) reasons.push("POST_REVEAL_RESULT_MISSING");
  if (!input.postRevealEvaluationComplete) reasons.push("POST_REVEAL_EVALUATION_INCOMPLETE");
  const reasonCodes = uniqueSortedReasonsV0_1(reasons);
  return { valid: reasonCodes.length === 0, reasonCodes };
}
