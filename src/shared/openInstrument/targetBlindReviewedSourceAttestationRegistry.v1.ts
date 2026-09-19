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

const AQUA_REVIEW_DATE_V1 = "2026-09-19" as const;

function acceptedReviewV1(
  attestationId: string,
  attestationFingerprint: string,
  reviewedAt: string = TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEW_DATE_V1,
): TargetBlindReviewedSourceAttestationV1 {
  return Object.freeze({
    schemaVersion: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_SCHEMA_V1,
    attestationSchemaVersion: SOURCE_ENTRY_ATTESTATION_SCHEMA_V1,
    attestationId,
    attestationFingerprint,
    reviewDecision: "accepted",
    reviewer: TARGET_BLIND_REVIEWED_SOURCE_ATTESTATION_REVIEWER_V1,
    reviewedAt,
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
  acceptedReviewV1(
    "source-entry-attestation.scaife-lewis-short.form-ăqua.v1",
    "0a4bdc13e2f422f3724b3a52fcd9279260e6b7c40875caba33b432502b6f00d7",
    AQUA_REVIEW_DATE_V1,
  ),
] as const);
