import {
  SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
} from "./sourceEntryAttestation.v1";
import {
  TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
  type TargetBlindReviewedSourceAttestationV1,
} from "./targetBlindReviewedSourceAttestation.v1";

export const TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REGISTRY_SCHEMA_V1 =
  "open-instrument.target-blind-reviewed-source-attestation-registry.v1" as const;

export const TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEWER_V1 =
  "DF / Sokol Gora" as const;

export const TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEW_DATE_V1 =
  "2026-09-18" as const;

function acceptedReviewV1(
  attestationId: string,
  attestationFingerprint: string,
): TargetBlindReviewedSourceAttestationV1 {
  return Object.freeze({
    schemaVersion: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
    attestationSchemaVersion: SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
    attestationId,
    attestationFingerprint,
    reviewDecision: "accepted",
    reviewer: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEWER_V1,
    reviewedAt: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEW_DATE_V1,
    reasonCodes: Object.freeze([]),
    claimBoundary: "SOURCE_ATTESTATION_ONLY",
  });
}

export const targetBlindReviewedSourceAttestationRegistryV1 = Object.freeze([
  acceptedReviewV1(
    "source-entry-attestation.scaife-lewis-short.form-as.v1",
    "223c2730656fbbfc774fc2febfa41f2d8b9abe491cd4c59e0ebbfcb8e63d6ae3",
  ),
  acceptedReviewV1(
    "source-entry-attestation.scaife-lewis-short.form-in.v1",
    "f379107238d53e2b5054b8e1dcc4d4c81056e4a749d9f77e8fee890eddd28c28",
  ),
  acceptedReviewV1(
    "source-entry-attestation.scaife-lewis-short.form-is.v1",
    "0a4a233779d54fb5a9f95680fe0dbfaeba5468b956ff16806d690e8ae551ea1e",
  ),
] as const);
