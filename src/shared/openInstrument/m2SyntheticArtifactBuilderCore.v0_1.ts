import {
  canonicalSerializeOneEmbryoProofM2V0_1,
  findForbiddenM2BlindPayloadKeysV0_1,
  ONE_EMBRYO_PROOF_M2_SCHEMA_V0_1,
  selectFirstEligibleSyntheticM2CandidateV0_1,
  sha256OneEmbryoProofM2V0_1,
  type M2BlindPayloadV0_1,
  type M2SyntheticPoolCandidateV0_1,
} from "./oneEmbryoProofM2Preregistration.v0_1";
import {
  discoverStructuralHypothesesV0_1,
  type StructuralHypothesisV0_1,
} from "../structuralHypothesisDiscovery.v0_1";
import {
  extractSevenVowelsFromString,
} from "../math7.core";

export type M2SyntheticEligibilityDecisionV0_1 =
  | "ELIGIBLE"
  | "EXCLUDED"
  | "UNKNOWN";

export type M2SyntheticIdentityStatusV0_1 =
  | "UNAMBIGUOUS"
  | "AMBIGUOUS"
  | "UNKNOWN";

export type M2SyntheticOpaqueIdentityStatusV0_1 =
  | "REVIEWED_OPAQUE_IDENTITY"
  | "UNVERIFIED"
  | "UNKNOWN";

export type M2SyntheticSourceAuthorityStatusV0_1 =
  | "VERIFIED"
  | "UNRESOLVED"
  | "UNKNOWN";

export type M2SyntheticSenseAuthorityStatusV0_1 =
  | "RESOLVED_ONE_REVIEWABLE_SENSE"
  | "UNRESOLVED"
  | "CONFLICTING"
  | "UNKNOWN";

export type M2SyntheticPriorUseEvidenceV0_1 = Readonly<{
  baseline: boolean;
  control: boolean;
  reveal: boolean;
  priorTarget: boolean;
  priorResearch: boolean;
  previouslyUsed: boolean;
  previouslyRevealed: boolean;
}>;

export type M2SyntheticCandidateEligibilityDeclarationV0_1 = Readonly<{
  opaqueCandidateId: string;
  opaqueIdentityStatus: M2SyntheticOpaqueIdentityStatusV0_1;
  eligibilityDecision: M2SyntheticEligibilityDecisionV0_1;
  identityStatus: M2SyntheticIdentityStatusV0_1;
  sourceAuthorityStatus: M2SyntheticSourceAuthorityStatusV0_1;
  senseAuthorityStatus: M2SyntheticSenseAuthorityStatusV0_1;
  priorUseEvidence: M2SyntheticPriorUseEvidenceV0_1;
}>;

export type M2SyntheticEligibilityReasonCodeV0_1 =
  | "ELIGIBILITY_EVIDENCE_ACCEPTED"
  | "ELIGIBILITY_EVIDENCE_UNKNOWN"
  | "ELIGIBILITY_DECLARATION_INCOMPLETE"
  | "POOL_COVERAGE_INCOMPLETE"
  | "OPAQUE_CANDIDATE_ID_INVALID"
  | "OPAQUE_IDENTITY_UNVERIFIED"
  | "OPAQUE_IDENTITY_UNKNOWN"
  | "DUPLICATE_OPAQUE_CANDIDATE_ID"
  | "IDENTITY_AMBIGUOUS"
  | "IDENTITY_STATUS_UNKNOWN"
  | "SOURCE_AUTHORITY_UNRESOLVED"
  | "SOURCE_AUTHORITY_UNKNOWN"
  | "SENSE_AUTHORITY_UNRESOLVED"
  | "SENSE_AUTHORITY_CONFLICTING"
  | "SENSE_AUTHORITY_UNKNOWN"
  | "PRIOR_BASELINE"
  | "PRIOR_CONTROL"
  | "PRIOR_REVEAL"
  | "PRIOR_TARGET"
  | "PRIOR_RESEARCH"
  | "ALREADY_USED"
  | "ALREADY_REVEALED"
  | "EXPLICIT_EXCLUSION"
  | "NO_ELIGIBLE_CANDIDATE";

export type M2SyntheticEligibilityPoolResultV0_1 = Readonly<{
  complete: boolean;
  candidateRecords: readonly M2SyntheticPoolCandidateV0_1[];
  candidateEvidence: readonly M2SyntheticCandidateEligibilityEvidenceV0_1[];
  eligibleCandidates: readonly M2SyntheticPoolCandidateV0_1[];
  reasonCodes: readonly M2SyntheticEligibilityReasonCodeV0_1[];
}>;

export type M2SyntheticCandidateEligibilityEvidenceV0_1 = Readonly<{
  opaqueCandidateId: string;
  reasonCodes: readonly M2SyntheticEligibilityReasonCodeV0_1[];
}>;

const OPAQUE_CANDIDATE_ID_PATTERN_V0_1 =
  /^[A-Za-z0-9][A-Za-z0-9._:-]*$/u;

const hasBooleanFieldsV0_1 = (
  value: unknown,
): value is M2SyntheticPriorUseEvidenceV0_1 => {
  if (value === null || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  const keys = [
    "baseline",
    "control",
    "reveal",
    "priorTarget",
    "priorResearch",
    "previouslyUsed",
    "previouslyRevealed",
  ];
  return keys.every((key) => typeof record[key] === "boolean");
};

const sortedReasonCodesV0_1 = (
  values: readonly M2SyntheticEligibilityReasonCodeV0_1[],
): M2SyntheticEligibilityReasonCodeV0_1[] =>
  [...new Set(values)].sort() as M2SyntheticEligibilityReasonCodeV0_1[];

const isKnownValueV0_1 = <T extends string>(
  value: unknown,
  allowed: readonly T[],
): value is T =>
  typeof value === "string" && allowed.includes(value as T);

const ELIGIBILITY_DECISIONS_V0_1 = [
  "ELIGIBLE",
  "EXCLUDED",
  "UNKNOWN",
] as const;
const IDENTITY_STATUSES_V0_1 = [
  "UNAMBIGUOUS",
  "AMBIGUOUS",
  "UNKNOWN",
] as const;
const SOURCE_AUTHORITY_STATUSES_V0_1 = [
  "VERIFIED",
  "UNRESOLVED",
  "UNKNOWN",
] as const;
const SENSE_AUTHORITY_STATUSES_V0_1 = [
  "RESOLVED_ONE_REVIEWABLE_SENSE",
  "UNRESOLVED",
  "CONFLICTING",
  "UNKNOWN",
] as const;

export function validateM2SyntheticEligibilityPoolV0_1(
  declarations: readonly M2SyntheticCandidateEligibilityDeclarationV0_1[],
  coverage: "COMPLETE" | "INCOMPLETE",
): M2SyntheticEligibilityPoolResultV0_1 {
  const reasons: M2SyntheticEligibilityReasonCodeV0_1[] = [];
  const candidateRecords: M2SyntheticPoolCandidateV0_1[] = [];
  const candidateEvidence: M2SyntheticCandidateEligibilityEvidenceV0_1[] = [];
  const seenIds = new Set<string>();
  let complete = coverage === "COMPLETE";

  if (!complete) reasons.push("POOL_COVERAGE_INCOMPLETE");
  if (declarations.length === 0) {
    complete = false;
    reasons.push("ELIGIBILITY_DECLARATION_INCOMPLETE");
  }

  for (const declaration of declarations) {
    const candidateReasons: M2SyntheticEligibilityReasonCodeV0_1[] = [];
    const value = declaration as unknown as Record<string, unknown>;
    const priorUseEvidence = value.priorUseEvidence;
    const id = value.opaqueCandidateId;
    const opaqueIdentityStatus = value.opaqueIdentityStatus;
    const identityStatus = value.identityStatus;
    const sourceAuthorityStatus = value.sourceAuthorityStatus;
    const senseAuthorityStatus = value.senseAuthorityStatus;
    const eligibilityDecision = value.eligibilityDecision;
    const declarationComplete =
      typeof id === "string" &&
      isKnownValueV0_1(opaqueIdentityStatus, [
        "REVIEWED_OPAQUE_IDENTITY",
        "UNVERIFIED",
        "UNKNOWN",
      ] as const) &&
      isKnownValueV0_1(eligibilityDecision, ELIGIBILITY_DECISIONS_V0_1) &&
      isKnownValueV0_1(identityStatus, IDENTITY_STATUSES_V0_1) &&
      isKnownValueV0_1(
        sourceAuthorityStatus,
        SOURCE_AUTHORITY_STATUSES_V0_1,
      ) &&
      isKnownValueV0_1(
        senseAuthorityStatus,
        SENSE_AUTHORITY_STATUSES_V0_1,
      ) &&
      hasBooleanFieldsV0_1(priorUseEvidence);

    if (!declarationComplete) {
      complete = false;
      reasons.push("ELIGIBILITY_DECLARATION_INCOMPLETE");
      candidateReasons.push("ELIGIBILITY_DECLARATION_INCOMPLETE");
    }

    const candidateId = typeof id === "string" ? id : "";
    const idIsValid =
      candidateId.length > 0 &&
      OPAQUE_CANDIDATE_ID_PATTERN_V0_1.test(candidateId);
    const duplicateId = idIsValid && seenIds.has(candidateId);
    if (!idIsValid) {
      reasons.push("OPAQUE_CANDIDATE_ID_INVALID");
      candidateReasons.push("OPAQUE_CANDIDATE_ID_INVALID");
    }
    if (duplicateId) {
      complete = false;
      reasons.push("DUPLICATE_OPAQUE_CANDIDATE_ID");
      candidateReasons.push("DUPLICATE_OPAQUE_CANDIDATE_ID");
    }
    if (idIsValid) seenIds.add(candidateId);

    const prior = hasBooleanFieldsV0_1(priorUseEvidence)
      ? priorUseEvidence
      : {
          baseline: true,
          control: true,
          reveal: true,
          priorTarget: true,
          priorResearch: true,
          previouslyUsed: true,
          previouslyRevealed: true,
        };

    const excluded =
      !declarationComplete ||
      !idIsValid ||
      opaqueIdentityStatus !== "REVIEWED_OPAQUE_IDENTITY" ||
      identityStatus !== "UNAMBIGUOUS" ||
      sourceAuthorityStatus !== "VERIFIED" ||
      senseAuthorityStatus !== "RESOLVED_ONE_REVIEWABLE_SENSE" ||
      eligibilityDecision !== "ELIGIBLE" ||
      prior.baseline ||
      prior.control ||
      prior.reveal ||
      prior.priorTarget ||
      prior.priorResearch ||
      prior.previouslyUsed ||
      prior.previouslyRevealed ||
      duplicateId;

    if (identityStatus === "AMBIGUOUS") {
      reasons.push("IDENTITY_AMBIGUOUS");
      candidateReasons.push("IDENTITY_AMBIGUOUS");
    }
    if (opaqueIdentityStatus === "UNVERIFIED") {
      reasons.push("OPAQUE_IDENTITY_UNVERIFIED");
      candidateReasons.push("OPAQUE_IDENTITY_UNVERIFIED");
    }
    if (opaqueIdentityStatus === "UNKNOWN") {
      reasons.push("OPAQUE_IDENTITY_UNKNOWN");
      candidateReasons.push("OPAQUE_IDENTITY_UNKNOWN");
    }
    if (identityStatus === "UNKNOWN") {
      reasons.push("IDENTITY_STATUS_UNKNOWN");
      candidateReasons.push("IDENTITY_STATUS_UNKNOWN");
    }
    if (sourceAuthorityStatus === "UNRESOLVED") {
      reasons.push("SOURCE_AUTHORITY_UNRESOLVED");
      candidateReasons.push("SOURCE_AUTHORITY_UNRESOLVED");
    }
    if (sourceAuthorityStatus === "UNKNOWN") {
      reasons.push("SOURCE_AUTHORITY_UNKNOWN");
      candidateReasons.push("SOURCE_AUTHORITY_UNKNOWN");
    }
    if (senseAuthorityStatus === "UNRESOLVED") {
      reasons.push("SENSE_AUTHORITY_UNRESOLVED");
      candidateReasons.push("SENSE_AUTHORITY_UNRESOLVED");
    }
    if (senseAuthorityStatus === "CONFLICTING") {
      reasons.push("SENSE_AUTHORITY_CONFLICTING");
      candidateReasons.push("SENSE_AUTHORITY_CONFLICTING");
    }
    if (senseAuthorityStatus === "UNKNOWN") {
      reasons.push("SENSE_AUTHORITY_UNKNOWN");
      candidateReasons.push("SENSE_AUTHORITY_UNKNOWN");
    }
    if (prior.baseline) {
      reasons.push("PRIOR_BASELINE");
      candidateReasons.push("PRIOR_BASELINE");
    }
    if (prior.control) {
      reasons.push("PRIOR_CONTROL");
      candidateReasons.push("PRIOR_CONTROL");
    }
    if (prior.reveal) {
      reasons.push("PRIOR_REVEAL");
      candidateReasons.push("PRIOR_REVEAL");
    }
    if (prior.priorTarget) {
      reasons.push("PRIOR_TARGET");
      candidateReasons.push("PRIOR_TARGET");
    }
    if (prior.priorResearch) {
      reasons.push("PRIOR_RESEARCH");
      candidateReasons.push("PRIOR_RESEARCH");
    }
    if (prior.previouslyUsed) {
      reasons.push("ALREADY_USED");
      candidateReasons.push("ALREADY_USED");
    }
    if (prior.previouslyRevealed) {
      reasons.push("ALREADY_REVEALED");
      candidateReasons.push("ALREADY_REVEALED");
    }
    if (eligibilityDecision === "EXCLUDED") {
      reasons.push("EXPLICIT_EXCLUSION");
      candidateReasons.push("EXPLICIT_EXCLUSION");
    }
    if (eligibilityDecision === "UNKNOWN") {
      reasons.push("ELIGIBILITY_EVIDENCE_UNKNOWN");
      candidateReasons.push("ELIGIBILITY_EVIDENCE_UNKNOWN");
    }

    const candidate: M2SyntheticPoolCandidateV0_1 = {
      opaqueCandidateId: candidateId,
      eligibility: excluded ? "EXCLUDED" : "ELIGIBLE",
      previouslyUsed:
        prior.previouslyUsed ||
        prior.baseline ||
        prior.control ||
        prior.priorTarget ||
        prior.priorResearch,
      previouslyRevealed: prior.previouslyRevealed || prior.reveal,
      identityAmbiguous: identityStatus !== "UNAMBIGUOUS",
    };
    candidateRecords.push(candidate);

    if (!excluded) {
      reasons.push("ELIGIBILITY_EVIDENCE_ACCEPTED");
      candidateReasons.push("ELIGIBILITY_EVIDENCE_ACCEPTED");
    }
    candidateEvidence.push({
      opaqueCandidateId: candidateId,
      reasonCodes: sortedReasonCodesV0_1(candidateReasons),
    });
  }

  const eligibleCandidates = candidateRecords.filter(
    (candidate) => candidate.eligibility === "ELIGIBLE",
  );
  if (eligibleCandidates.length === 0) reasons.push("NO_ELIGIBLE_CANDIDATE");

  return {
    complete,
    candidateRecords,
    candidateEvidence,
    eligibleCandidates,
    reasonCodes: sortedReasonCodesV0_1(reasons),
  };
}

export const M2_CONTROLLER_PRIVATE_STRUCTURAL_FREEZE_SCHEMA_V0_1 =
  "open-instrument.m2-controller-private-structural-freeze.v0.1" as const;

export const M2_SHARED_STRUCTURAL_FINGERPRINT_DOMAIN_V0_1 =
  "open-instrument.m2.shared-structural-fingerprint.v0.1" as const;

const CONTROLLER_PRIVATE_RECORD_KEYS_V0_1 = [
  "schemaVersion",
  "visibility",
  "artifactId",
  "structuralHypothesis",
  "structuralFingerprint",
  "canonicalByteLength",
  "controllerArtifactSha256",
  "controllerArtifactByteLength",
] as const;

export type M2ControllerPrivateStructuralFreezeRecordV0_1 = Readonly<{
  schemaVersion: typeof M2_CONTROLLER_PRIVATE_STRUCTURAL_FREEZE_SCHEMA_V0_1;
  visibility: "CONTROLLER_PRIVATE";
  artifactId: "M2_STRUCTURAL_EMBRYO_FREEZE";
  structuralHypothesis: StructuralHypothesisV0_1;
  structuralFingerprint: string;
  canonicalByteLength: number;
  controllerArtifactSha256: string;
  controllerArtifactByteLength: number;
}>;

export function computeM2SharedStructuralFingerprintV0_1(
  structuralEmbryo: string,
  voicePath: readonly string[],
): string {
  const authorizedVisibleInput = {
    domainSeparator: M2_SHARED_STRUCTURAL_FINGERPRINT_DOMAIN_V0_1,
    structuralEmbryo,
    voicePath: [...voicePath],
  };
  return sha256OneEmbryoProofM2V0_1(
    canonicalSerializeOneEmbryoProofM2V0_1(authorizedVisibleInput),
  );
}

export type M2OperatorVisibleStructuralProjectionContextV0_1 = Readonly<{
  caseOpaqueId: string;
  sourceUniverseId: string;
  searchPolicyId: string;
  stopRuleId: string;
  claimBoundary: readonly string[];
}>;

export type M2StructuralVisibilityReasonCodeV0_1 =
  | "STRUCTURAL_NULL_PRESERVED"
  | "STRUCTURAL_FREEZE_PROJECTION_PRESERVED"
  | "M2_CONTROLLER_PRIVATE_RECORD_BUILT"
  | "M2_CONTROLLER_PRIVATE_RECORD_INVALID"
  | "M2_OPERATOR_PROJECTION_BUILT"
  | "M2_OPERATOR_PROJECTION_INPUT_INVALID"
  | "M2_OPERATOR_PROJECTION_FORBIDDEN_KEY"
  | "M2_OPERATOR_PROJECTION_FORBIDDEN_VALUE"
  | "M2_OPERATOR_PAYLOAD_SCHEMA_INVALID";

export type M2StructuralFreezeProjectionResultV0_1 = Readonly<{
  ready: boolean;
  structuralNull: boolean;
  reasonCodes: readonly M2StructuralVisibilityReasonCodeV0_1[];
}>;

export type M2OperatorVisibleStructuralProjectionResultV0_1 = Readonly<{
  status: "PROJECTED" | "STRUCTURAL_NULL" | "BLOCKED";
  operatorPayload: M2BlindPayloadV0_1 | null;
  payloadBytes: Buffer | null;
  payloadSha256: string | null;
  payloadByteLength: number | null;
  reasonCodes: readonly M2StructuralVisibilityReasonCodeV0_1[];
}>;

export type M2OperatorVisiblePayloadSerializationResultV0_1 = Readonly<{
  status: "SERIALIZED" | "BLOCKED";
  operatorPayload: M2BlindPayloadV0_1 | null;
  payloadBytes: Buffer | null;
  payloadSha256: string | null;
  payloadByteLength: number | null;
  reasonCodes: readonly M2StructuralVisibilityReasonCodeV0_1[];
}>;

const CONTROLLER_PRIVATE_STRUCTURAL_KEYS_V0_1 = new Set([
  "hypothesisId",
  "basis",
  "reductionSteps",
  "expansionChain",
  "evidenceRefs",
  "lexicalAttestation",
  "functionalSupportStatus",
  "independentStandaloneMeaning",
  "historicalOriginClaim",
  "historicalTransmissionClaim",
  "winnerClaim",
  "languageSuperiorityClaim",
  "candidateTruthClaim",
  "userDecisionPosture",
]);

export function findForbiddenM2OperatorVisibleProjectionKeysV0_1(
  value: unknown,
  path = "$",
): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((child, index) =>
      findForbiddenM2OperatorVisibleProjectionKeysV0_1(
        child,
        `${path}[${index}]`,
      ),
    );
  }
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) => [
    ...(CONTROLLER_PRIVATE_STRUCTURAL_KEYS_V0_1.has(key)
      ? [`${path}.${key}`]
      : []),
    ...findForbiddenM2OperatorVisibleProjectionKeysV0_1(
      child,
      `${path}.${key}`,
    ),
  ]);
}

const isNonEmptyStringV0_1 = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const SHA256_PATTERN_V0_1 = /^[0-9a-f]{64}$/u;

const CANONICAL_SEVEN_VOICES_V0_1 = [
  "A",
  "E",
  "I",
  "O",
  "U",
  "Y",
  "Ë",
] as const;

function isStructuralHypothesisShapeV0_1(
  value: unknown,
): value is StructuralHypothesisV0_1 {
  if (value === null || typeof value !== "object") return false;
  const record = value as Record<string, unknown>;
  return (
    isNonEmptyStringV0_1(record.hypothesisId) &&
    isNonEmptyStringV0_1(record.basis) &&
    isNonEmptyStringV0_1(record.embryo) &&
    Array.isArray(record.reductionSteps) &&
    Array.isArray(record.expansionChain) &&
    Array.isArray(record.reasonCodes) &&
    Array.isArray(record.evidenceRefs)
  );
}

function isProjectionContextValidV0_1(
  value: unknown,
): boolean {
  if (value === null || typeof value !== "object") return false;
  const context = value as Record<string, unknown>;
  const claimBoundary = context.claimBoundary;
  return (
    typeof context.caseOpaqueId === "string" &&
    /^synthetic:[A-Za-z0-9._-]+$/u.test(context.caseOpaqueId) &&
    isNonEmptyStringV0_1(context.sourceUniverseId) &&
    isNonEmptyStringV0_1(context.searchPolicyId) &&
    isNonEmptyStringV0_1(context.stopRuleId) &&
    Array.isArray(claimBoundary) &&
    claimBoundary.length > 0 &&
    claimBoundary.every(isNonEmptyStringV0_1)
  );
}

/**
 * Controller-side only. Callers must not attach this record to an
 * operator-facing result or transport object.
 */
export function buildM2ControllerPrivateStructuralFreezeRecordV0_1(
  hypothesis: StructuralHypothesisV0_1,
): M2ControllerPrivateStructuralFreezeRecordV0_1 {
  const canonicalStructural = canonicalSerializeOneEmbryoProofM2V0_1(
    hypothesis,
  );
  const recordContent = {
    schemaVersion: M2_CONTROLLER_PRIVATE_STRUCTURAL_FREEZE_SCHEMA_V0_1,
    visibility: "CONTROLLER_PRIVATE" as const,
    artifactId: "M2_STRUCTURAL_EMBRYO_FREEZE" as const,
    structuralHypothesis: hypothesis,
    structuralFingerprint: computeM2SharedStructuralFingerprintV0_1(
      hypothesis.embryo,
      extractSevenVowelsFromString(hypothesis.embryo),
    ),
    canonicalByteLength: Buffer.byteLength(canonicalStructural, "utf8"),
  };
  const controllerArtifactBytes = Buffer.from(
    `${canonicalSerializeOneEmbryoProofM2V0_1(recordContent)}\n`,
    "utf8",
  );
  return {
    ...recordContent,
    controllerArtifactSha256: sha256OneEmbryoProofM2V0_1(
      controllerArtifactBytes,
    ),
    controllerArtifactByteLength: controllerArtifactBytes.byteLength,
  };
}

function controllerPrivateArtifactBytesV0_1(
  record: M2ControllerPrivateStructuralFreezeRecordV0_1,
): Buffer {
  const recordContent = {
    schemaVersion: record.schemaVersion,
    visibility: record.visibility,
    artifactId: record.artifactId,
    structuralHypothesis: record.structuralHypothesis,
    structuralFingerprint: record.structuralFingerprint,
    canonicalByteLength: record.canonicalByteLength,
  };
  return Buffer.from(
    `${canonicalSerializeOneEmbryoProofM2V0_1(recordContent)}\n`,
    "utf8",
  );
}

function isControllerPrivateRecordValidV0_1(
  value: unknown,
): boolean {
  if (value === null || typeof value !== "object") return false;
  const ownKeys = Reflect.ownKeys(value);
  if (
    ownKeys.length !== CONTROLLER_PRIVATE_RECORD_KEYS_V0_1.length ||
    !CONTROLLER_PRIVATE_RECORD_KEYS_V0_1.every((key) => ownKeys.includes(key))
  ) {
    return false;
  }
  const record = value as Record<string, unknown>;
  if (
    record.schemaVersion !== M2_CONTROLLER_PRIVATE_STRUCTURAL_FREEZE_SCHEMA_V0_1 ||
    record.visibility !== "CONTROLLER_PRIVATE" ||
    record.artifactId !== "M2_STRUCTURAL_EMBRYO_FREEZE" ||
    !isStructuralHypothesisShapeV0_1(record.structuralHypothesis)
  ) {
    return false;
  }
  const canonicalStructural = canonicalSerializeOneEmbryoProofM2V0_1(
    record.structuralHypothesis,
  );
  const controllerArtifactBytes = controllerPrivateArtifactBytesV0_1(
    record as M2ControllerPrivateStructuralFreezeRecordV0_1,
  );
  return (
    record.structuralFingerprint ===
      computeM2SharedStructuralFingerprintV0_1(
        record.structuralHypothesis.embryo,
        extractSevenVowelsFromString(record.structuralHypothesis.embryo),
      ) &&
    record.canonicalByteLength ===
      Buffer.byteLength(canonicalStructural, "utf8") &&
    typeof record.controllerArtifactSha256 === "string" &&
    SHA256_PATTERN_V0_1.test(record.controllerArtifactSha256) &&
    record.controllerArtifactSha256 ===
      sha256OneEmbryoProofM2V0_1(controllerArtifactBytes) &&
    record.controllerArtifactByteLength === controllerArtifactBytes.byteLength
  );
}

const OPERATOR_PAYLOAD_KEYS_V0_1 = [
  "schemaVersion",
  "caseOpaqueId",
  "structuralEmbryo",
  "structuralFingerprint",
  "voicePath",
  "sourceUniverseId",
  "searchPolicyId",
  "stopRuleId",
  "claimBoundary",
  "targetRevealStatus",
] as const;

function exactOperatorPayloadKeysV0_1(value: unknown): boolean {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const keys = Reflect.ownKeys(value);
  return (
    keys.length === OPERATOR_PAYLOAD_KEYS_V0_1.length &&
    OPERATOR_PAYLOAD_KEYS_V0_1.every((key) => keys.includes(key))
  );
}

function operatorPayloadShapeValidV0_1(
  value: unknown,
): value is M2BlindPayloadV0_1 {
  if (!exactOperatorPayloadKeysV0_1(value)) return false;
  const record = value as Record<string, unknown>;
  const voicePath = record.voicePath;
  const claimBoundary = record.claimBoundary;
  return (
    record.schemaVersion === ONE_EMBRYO_PROOF_M2_SCHEMA_V0_1 &&
    typeof record.caseOpaqueId === "string" &&
    /^synthetic:[A-Za-z0-9._-]+$/u.test(record.caseOpaqueId) &&
    isNonEmptyStringV0_1(record.structuralEmbryo) &&
    typeof record.structuralFingerprint === "string" &&
    SHA256_PATTERN_V0_1.test(record.structuralFingerprint) &&
    Array.isArray(voicePath) &&
    voicePath.length > 0 &&
    voicePath.every(
      (voice) =>
        typeof voice === "string" &&
        CANONICAL_SEVEN_VOICES_V0_1.includes(
          voice as (typeof CANONICAL_SEVEN_VOICES_V0_1)[number],
        ),
    ) &&
    isNonEmptyStringV0_1(record.sourceUniverseId) &&
    isNonEmptyStringV0_1(record.searchPolicyId) &&
    isNonEmptyStringV0_1(record.stopRuleId) &&
    Array.isArray(claimBoundary) &&
    claimBoundary.length > 0 &&
    claimBoundary.every(isNonEmptyStringV0_1) &&
    record.targetRevealStatus === "FORBIDDEN_UNTIL_REVEAL_GATE"
  );
}

function blockedOperatorPayloadSerializationV0_1(
  reasonCodes: readonly M2StructuralVisibilityReasonCodeV0_1[],
): M2OperatorVisiblePayloadSerializationResultV0_1 {
  return {
    status: "BLOCKED",
    operatorPayload: null,
    payloadBytes: null,
    payloadSha256: null,
    payloadByteLength: null,
    reasonCodes,
  };
}

/**
 * Copies only the allowlisted operator payload fields before serialization.
 * No input object is returned, including on failure.
 */
export function serializeM2OperatorVisiblePayloadV0_1(
  value: unknown,
): M2OperatorVisiblePayloadSerializationResultV0_1 {
  if (!exactOperatorPayloadKeysV0_1(value)) {
    const privateKeys =
      value !== null && typeof value === "object"
        ? Reflect.ownKeys(value).filter(
            (key): key is string =>
              typeof key === "string" &&
              CONTROLLER_PRIVATE_STRUCTURAL_KEYS_V0_1.has(key),
          )
        : [];
    return blockedOperatorPayloadSerializationV0_1(
      privateKeys.length > 0
        ? [
            "M2_OPERATOR_PROJECTION_FORBIDDEN_KEY",
            "M2_OPERATOR_PAYLOAD_SCHEMA_INVALID",
          ]
        : ["M2_OPERATOR_PAYLOAD_SCHEMA_INVALID"],
    );
  }
  if (!operatorPayloadShapeValidV0_1(value)) {
    return blockedOperatorPayloadSerializationV0_1([
      "M2_OPERATOR_PAYLOAD_SCHEMA_INVALID",
    ]);
  }
  const operatorPayload: M2BlindPayloadV0_1 = {
    schemaVersion: value.schemaVersion,
    caseOpaqueId: value.caseOpaqueId,
    structuralEmbryo: value.structuralEmbryo,
    structuralFingerprint: value.structuralFingerprint,
    voicePath: [...value.voicePath],
    sourceUniverseId: value.sourceUniverseId,
    searchPolicyId: value.searchPolicyId,
    stopRuleId: value.stopRuleId,
    claimBoundary: [...value.claimBoundary],
    targetRevealStatus: value.targetRevealStatus,
  };
  const forbiddenKeys = [
    ...findForbiddenM2BlindPayloadKeysV0_1(operatorPayload),
    ...findForbiddenM2OperatorVisibleProjectionKeysV0_1(operatorPayload),
  ];
  const forbiddenContent = findForbiddenM2BlindPayloadContentV0_1(
    operatorPayload,
  );
  if (forbiddenKeys.length > 0 || forbiddenContent.length > 0) {
    return blockedOperatorPayloadSerializationV0_1([
      ...(forbiddenKeys.length > 0
        ? ["M2_OPERATOR_PROJECTION_FORBIDDEN_KEY" as const]
        : []),
      ...(forbiddenContent.length > 0
        ? ["M2_OPERATOR_PROJECTION_FORBIDDEN_VALUE" as const]
        : []),
    ]);
  }
  const payloadBytes = Buffer.from(
    `${canonicalSerializeOneEmbryoProofM2V0_1(operatorPayload)}\n`,
    "utf8",
  );
  return {
    status: "SERIALIZED",
    operatorPayload,
    payloadBytes,
    payloadSha256: sha256OneEmbryoProofM2V0_1(payloadBytes),
    payloadByteLength: payloadBytes.byteLength,
    reasonCodes: ["M2_OPERATOR_PROJECTION_BUILT"],
  };
}

export function projectM2ControllerPrivateStructuralFreezeToOperatorV0_1(
  record: M2ControllerPrivateStructuralFreezeRecordV0_1,
  context: M2OperatorVisibleStructuralProjectionContextV0_1,
): M2OperatorVisibleStructuralProjectionResultV0_1 {
  if (!isControllerPrivateRecordValidV0_1(record)) {
    return {
      status: "BLOCKED",
      operatorPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: ["M2_CONTROLLER_PRIVATE_RECORD_INVALID"],
    };
  }
  if (!isProjectionContextValidV0_1(context)) {
    return {
      status: "BLOCKED",
      operatorPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: ["M2_OPERATOR_PROJECTION_INPUT_INVALID"],
    };
  }

  const validRecord = record as M2ControllerPrivateStructuralFreezeRecordV0_1;
  const validContext = context as M2OperatorVisibleStructuralProjectionContextV0_1;
  const hypothesis = validRecord.structuralHypothesis;
  const operatorPayload = {
    schemaVersion: ONE_EMBRYO_PROOF_M2_SCHEMA_V0_1,
    caseOpaqueId: validContext.caseOpaqueId,
    structuralEmbryo: hypothesis.embryo,
    structuralFingerprint: validRecord.structuralFingerprint,
    voicePath: extractSevenVowelsFromString(hypothesis.embryo),
    sourceUniverseId: validContext.sourceUniverseId,
    searchPolicyId: validContext.searchPolicyId,
    stopRuleId: validContext.stopRuleId,
    claimBoundary: validContext.claimBoundary,
    targetRevealStatus: "FORBIDDEN_UNTIL_REVEAL_GATE",
  };
  const serialized = serializeM2OperatorVisiblePayloadV0_1(operatorPayload);
  if (serialized.status !== "SERIALIZED") {
    return {
      status: "BLOCKED",
      operatorPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: serialized.reasonCodes,
    };
  }
  return {
    status: "PROJECTED",
    operatorPayload: serialized.operatorPayload,
    payloadBytes: serialized.payloadBytes,
    payloadSha256: serialized.payloadSha256,
    payloadByteLength: serialized.payloadByteLength,
    reasonCodes: [
      "M2_CONTROLLER_PRIVATE_RECORD_BUILT",
      "M2_OPERATOR_PROJECTION_BUILT",
    ],
  };
}

export function inspectM2StructuralFreezeProjectionV0_1(
  hypothesis: StructuralHypothesisV0_1 | null,
): M2StructuralFreezeProjectionResultV0_1 {
  if (hypothesis === null) {
    return {
      ready: true,
      structuralNull: true,
      reasonCodes: ["STRUCTURAL_NULL_PRESERVED"],
    };
  }
  const record = buildM2ControllerPrivateStructuralFreezeRecordV0_1(hypothesis);
  return {
    ready: isControllerPrivateRecordValidV0_1(record),
    structuralNull: false,
    reasonCodes: isControllerPrivateRecordValidV0_1(record)
      ? ["STRUCTURAL_FREEZE_PROJECTION_PRESERVED"]
      : ["M2_CONTROLLER_PRIVATE_RECORD_INVALID"],
  };
}

const FORBIDDEN_BLIND_CONTENT_PATTERNS_V0_1 = [
  /target[\s_-]?(?:word|orthography|pronunciation|sense(?:[\s_-]?(?:id|label|definition))?)/iu,
  /(?:post[\s_-]?reveal[\s_-]?interpretation|expected[\s_-]?function)/iu,
  /(?:translation|gloss|etymology)/iu,
  /historical[\s_-]?target[\s_-]?source/iu,
];

export function findForbiddenM2BlindPayloadContentV0_1(
  value: unknown,
  path = "$",
): string[] {
  if (typeof value === "string") {
    return FORBIDDEN_BLIND_CONTENT_PATTERNS_V0_1.some((pattern) => pattern.test(value))
      ? [path]
      : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((child, index) =>
      findForbiddenM2BlindPayloadContentV0_1(child, `${path}[${index}]`),
    );
  }
  if (value === null || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, child]) =>
    findForbiddenM2BlindPayloadContentV0_1(child, `${path}.${key}`),
  );
}

export type M2SyntheticArtifactCoreInputV0_1 = Readonly<{
  poolCoverage: "COMPLETE" | "INCOMPLETE";
  candidateDeclarations: readonly M2SyntheticCandidateEligibilityDeclarationV0_1[];
  caseOpaqueId: string;
  structuralInput: string;
  sourceUniverseId: string;
  searchPolicyId: string;
  stopRuleId: string;
  claimBoundary: readonly string[];
}>;

export type M2SyntheticArtifactCoreReasonCodeV0_1 =
  | M2SyntheticEligibilityReasonCodeV0_1
  | M2StructuralVisibilityReasonCodeV0_1
  | "SYNTHETIC_CASE_ID_REQUIRED"
  | "BLIND_PAYLOAD_CONTRACT_INPUT_INVALID"
  | "STRUCTURAL_NULL_PRESERVED"
  | "STRUCTURAL_FREEZE_PROJECTION_PRESERVED"
  | "M2_STRUCTURAL_FREEZE_BLINDNESS_CONTRACT_CONFLICT"
  | "BLIND_PAYLOAD_FORBIDDEN_KEY"
  | "BLIND_PAYLOAD_FORBIDDEN_VALUE"
  | "SYNTHETIC_PAYLOAD_CORE_BUILT";

export type M2SyntheticArtifactCoreResultV0_1 = Readonly<{
  status: "ELIGIBILITY_BLOCKED" | "STRUCTURAL_NULL" | "SYNTHETIC_PAYLOAD_BUILT";
  selectedCandidate: M2SyntheticPoolCandidateV0_1 | null;
  structural: Readonly<{
    kind: "HYPOTHESIS" | "NULL";
    embryo: string | null;
    hypothesisFingerprint: string | null;
    candidateCount: number;
    selectedIndex: number | null;
  }>;
  structuralFreeze: M2StructuralFreezeProjectionResultV0_1;
  blindPayload: M2BlindPayloadV0_1 | null;
  payloadBytes: Buffer | null;
  payloadSha256: string | null;
  payloadByteLength: number | null;
  reasonCodes: readonly M2SyntheticArtifactCoreReasonCodeV0_1[];
}>;

const coreReasonsV0_1 = (
  values: readonly M2SyntheticArtifactCoreReasonCodeV0_1[],
): M2SyntheticArtifactCoreReasonCodeV0_1[] =>
  [...new Set(values)].sort() as M2SyntheticArtifactCoreReasonCodeV0_1[];

export function buildSyntheticM2ArtifactCoreV0_1(
  input: M2SyntheticArtifactCoreInputV0_1,
): M2SyntheticArtifactCoreResultV0_1 {
  const eligibility = validateM2SyntheticEligibilityPoolV0_1(
    input.candidateDeclarations,
    input.poolCoverage,
  );
  const reasons: M2SyntheticArtifactCoreReasonCodeV0_1[] = [
    ...eligibility.reasonCodes,
  ];
  const selectedCandidate =
    eligibility.complete && eligibility.eligibleCandidates.length > 0
      ? selectFirstEligibleSyntheticM2CandidateV0_1(
          eligibility.candidateRecords,
        )
      : null;

  const emptyStructural = {
    kind: "NULL" as const,
    embryo: null,
    hypothesisFingerprint: null,
    candidateCount: 0,
    selectedIndex: null,
  };

  if (selectedCandidate === null) {
    return {
      status: "ELIGIBILITY_BLOCKED",
      selectedCandidate: null,
      structural: emptyStructural,
      structuralFreeze: inspectM2StructuralFreezeProjectionV0_1(null),
      blindPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: coreReasonsV0_1(reasons),
    };
  }

  if (!/^synthetic:[A-Za-z0-9._-]+$/u.test(input.caseOpaqueId)) {
    reasons.push("SYNTHETIC_CASE_ID_REQUIRED");
    return {
      status: "ELIGIBILITY_BLOCKED",
      selectedCandidate,
      structural: emptyStructural,
      structuralFreeze: inspectM2StructuralFreezeProjectionV0_1(null),
      blindPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: coreReasonsV0_1(reasons),
    };
  }

  const contractInputsAreComplete =
    [input.sourceUniverseId, input.searchPolicyId, input.stopRuleId].every(
      (value) => typeof value === "string" && value.trim().length > 0,
    ) &&
    input.claimBoundary.length > 0 &&
    input.claimBoundary.every(
      (value) => typeof value === "string" && value.trim().length > 0,
    );
  if (!contractInputsAreComplete) {
    reasons.push("BLIND_PAYLOAD_CONTRACT_INPUT_INVALID");
    return {
      status: "ELIGIBILITY_BLOCKED",
      selectedCandidate,
      structural: emptyStructural,
      structuralFreeze: inspectM2StructuralFreezeProjectionV0_1(null),
      blindPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: coreReasonsV0_1(reasons),
    };
  }

  const hypotheses = discoverStructuralHypothesesV0_1(input.structuralInput);
  const hypothesis = hypotheses[0] ?? null;

  if (hypothesis === null) {
    reasons.push("STRUCTURAL_NULL_PRESERVED");
    return {
      status: "STRUCTURAL_NULL",
      selectedCandidate,
      structural: emptyStructural,
      structuralFreeze: inspectM2StructuralFreezeProjectionV0_1(null),
      blindPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: coreReasonsV0_1(reasons),
    };
  }

  const controllerPrivateRecord =
    buildM2ControllerPrivateStructuralFreezeRecordV0_1(hypothesis);
  const visibilityBoundary = projectM2ControllerPrivateStructuralFreezeToOperatorV0_1(
    controllerPrivateRecord,
    {
      caseOpaqueId: input.caseOpaqueId,
      sourceUniverseId: input.sourceUniverseId,
      searchPolicyId: input.searchPolicyId,
      stopRuleId: input.stopRuleId,
      claimBoundary: input.claimBoundary,
    },
  );
  reasons.push(...visibilityBoundary.reasonCodes);
  if (
    visibilityBoundary.reasonCodes.includes(
      "M2_OPERATOR_PROJECTION_FORBIDDEN_KEY",
    )
  ) {
    reasons.push("BLIND_PAYLOAD_FORBIDDEN_KEY");
  }
  if (
    visibilityBoundary.reasonCodes.includes(
      "M2_OPERATOR_PROJECTION_FORBIDDEN_VALUE",
    )
  ) {
    reasons.push("BLIND_PAYLOAD_FORBIDDEN_VALUE");
  }
  if (visibilityBoundary.status !== "PROJECTED") {
    return {
      status: "ELIGIBILITY_BLOCKED",
      selectedCandidate,
      structural: {
        kind: "HYPOTHESIS",
        embryo: hypothesis.embryo,
        hypothesisFingerprint: controllerPrivateRecord.structuralFingerprint,
        candidateCount: hypotheses.length,
        selectedIndex: 0,
      },
      structuralFreeze: {
        ready: false,
        structuralNull: false,
        reasonCodes: visibilityBoundary.reasonCodes,
      },
      blindPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: coreReasonsV0_1(reasons),
    };
  }

  const blindPayload = visibilityBoundary.operatorPayload;
  const payloadBytes = visibilityBoundary.payloadBytes;
  const payloadSha256 = visibilityBoundary.payloadSha256;
  if (!blindPayload || !payloadBytes || !payloadSha256) {
    return {
      status: "ELIGIBILITY_BLOCKED",
      selectedCandidate,
      structural: emptyStructural,
      structuralFreeze: {
        ready: false,
        structuralNull: false,
        reasonCodes: ["M2_OPERATOR_PROJECTION_INPUT_INVALID"],
      },
      blindPayload: null,
      payloadBytes: null,
      payloadSha256: null,
      payloadByteLength: null,
      reasonCodes: coreReasonsV0_1([
        ...reasons,
        "M2_OPERATOR_PROJECTION_INPUT_INVALID",
      ]),
    };
  }
  reasons.push("SYNTHETIC_PAYLOAD_CORE_BUILT");

  return {
    status: "SYNTHETIC_PAYLOAD_BUILT",
    selectedCandidate,
    structural: {
      kind: "HYPOTHESIS",
      embryo: hypothesis.embryo,
      hypothesisFingerprint: controllerPrivateRecord.structuralFingerprint,
      candidateCount: hypotheses.length,
      selectedIndex: 0,
    },
    structuralFreeze: {
      ready: true,
      structuralNull: false,
      reasonCodes: ["STRUCTURAL_FREEZE_PROJECTION_PRESERVED"],
    },
    blindPayload,
    payloadBytes,
    payloadSha256,
    payloadByteLength: payloadBytes.byteLength,
    reasonCodes: coreReasonsV0_1(reasons),
  };
}
