export const REVIEWED_SOURCE_TRADITION_AUTHORITY_VERSION_V1 =
  "open-instrument.reviewed-source-tradition-authority.v1" as const;

export type ReviewedSourceTraditionAuthorityDimensionV1 =
  | "SOURCE_IDENTITY"
  | "PROVENANCE"
  | "REPRODUCIBILITY_OR_ARCHIVE_POSTURE"
  | "LICENSE_STATUS"
  | "SOURCE_TYPE"
  | "LANGUAGE_REPRESENTATION"
  | "VARIETY_REPRESENTATION"
  | "CLAIM_BOUNDARY_COMPATIBILITY";

export type ReviewedSourceTraditionAuthorityDimensionStatusV1 =
  | "PASS"
  | "FAIL"
  | "UNKNOWN";

export type ReviewedSourceTraditionAuthorityReasonCodeV1 =
  | "SOURCE_IDENTITY_UNRESOLVED"
  | "PROVENANCE_UNRESOLVED"
  | "ARCHIVE_POSTURE_UNRESOLVED"
  | "LICENSE_STATUS_UNRESOLVED"
  | "SOURCE_TYPE_REVIEW_REQUIRED"
  | "LANGUAGE_REPRESENTATION_UNRESOLVED"
  | "VARIETY_REPRESENTATION_UNRESOLVED"
  | "CLAIM_BOUNDARY_INCOMPATIBLE";

export type ReviewedSourceTraditionAuthorityInputV1 = Readonly<{
  sourceTraditionId: string | null;
  sourceTitle: string | null;
  sourceAuthorOrEditor: string | null;
  sourcePublisherOrHost: string | null;
  sourceDateOrVersion: string | null;
  sourceUrlOrArchiveRef: string | null;
  sourceHashOrArchiveHash: string | null;
  reproducibilityOrArchivePosture: string | null;
  licenseStatus: string | null;
  sourceType: string | null;
  citationTypes: readonly string[] | null;
  language: string | null;
  languageVariety: string | null;
  claimBoundary: Readonly<{
    historicalOriginClaim: boolean | null;
    historicalTransmissionClaim: boolean | null;
    winnerClaim: boolean | null;
    languageSuperiorityClaim: boolean | null;
    candidateTruthClaim: boolean | null;
    functionalCorrespondence: "NOT_EVALUATED" | null;
    historicalRelation: "NOT_CLAIMED" | null;
    userDecisionPosture: "user_decides" | null;
  }> | null;
}>;

export type ReviewedSourceTraditionAuthorityDimensionResultV1 = Readonly<{
  status: ReviewedSourceTraditionAuthorityDimensionStatusV1;
  reasonCodes: readonly ReviewedSourceTraditionAuthorityReasonCodeV1[];
}>;

export type ReviewedSourceTraditionAuthorityResultV1 = Readonly<{
  authorityVersion: typeof REVIEWED_SOURCE_TRADITION_AUTHORITY_VERSION_V1;
  gate: "SOURCE_TRADITION_AUTHORITY";
  status: "ELIGIBLE_FOR_REVIEWED_INTAKE" | "NOT_ELIGIBLE_FOR_REVIEWED_INTAKE";
  eligibleForReviewedIntake: boolean;
  dimensions: Readonly<
    Record<
      ReviewedSourceTraditionAuthorityDimensionV1,
      ReviewedSourceTraditionAuthorityDimensionResultV1
    >
  >;
  reasonCodes: readonly ReviewedSourceTraditionAuthorityReasonCodeV1[];
  sourceRecordAuthority: "NOT_EVALUATED";
  functionalRuntimeAuthority: "NOT_GRANTED";
  functionalCorrespondence: "NOT_EVALUATED";
  historicalRelation: "NOT_CLAIMED";
  winnerSelection: "NONE";
}>;

const SUPPORTED_SOURCE_TYPES_V1 = new Set([
  "reviewed_static_source",
  "reviewed_dictionary_source",
  "reviewed_lexical_source",
]);

const SUPPORTED_CITATION_TYPES_V1 = new Set([
  "dictionary_entry",
  "academic_lexical_reference",
]);

const SUPPORTED_ARCHIVE_POSTURES_V1 = new Set([
  "PINNED_SOURCE_HASH",
  "STABLE_ARCHIVE_REFERENCE",
  "REPRODUCIBLE_PUBLIC_SOURCE",
]);

const SUPPORTED_LICENSE_STATUSES_V1 = new Set([
  "EXPLICIT_OPEN_LICENSE",
  "PUBLIC_DOMAIN",
  "EXPLICIT_PERMISSION",
  "REVIEWED_LICENSE_POSTURE",
]);

const DIMENSIONS_V1: readonly ReviewedSourceTraditionAuthorityDimensionV1[] = [
  "SOURCE_IDENTITY",
  "PROVENANCE",
  "REPRODUCIBILITY_OR_ARCHIVE_POSTURE",
  "LICENSE_STATUS",
  "SOURCE_TYPE",
  "LANGUAGE_REPRESENTATION",
  "VARIETY_REPRESENTATION",
  "CLAIM_BOUNDARY_COMPATIBILITY",
];

function hasTextV1(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function hasOwnPropertyV1(value: unknown, key: string): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.prototype.hasOwnProperty.call(value, key)
  );
}

function freezeReasonCodesV1(
  reasonCodes: Iterable<ReviewedSourceTraditionAuthorityReasonCodeV1>,
): readonly ReviewedSourceTraditionAuthorityReasonCodeV1[] {
  return Object.freeze([...new Set(reasonCodes)].sort());
}

function dimensionResultV1(
  status: ReviewedSourceTraditionAuthorityDimensionStatusV1,
  reasonCodes: readonly ReviewedSourceTraditionAuthorityReasonCodeV1[] = [],
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  return Object.freeze({
    status,
    reasonCodes: freezeReasonCodesV1(reasonCodes),
  });
}

function evaluateSourceIdentityV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  const requiredFields = [
    "sourceTraditionId",
    "sourceTitle",
    "sourcePublisherOrHost",
    "sourceAuthorOrEditor",
    "sourceDateOrVersion",
  ] as const;

  const represented = requiredFields.every((field) =>
    hasOwnPropertyV1(input, field),
  );
  if (!represented) {
    return dimensionResultV1("UNKNOWN", ["SOURCE_IDENTITY_UNRESOLVED"]);
  }

  if (
    !hasTextV1(input.sourceTraditionId) ||
    !hasTextV1(input.sourceTitle) ||
    !hasTextV1(input.sourcePublisherOrHost)
  ) {
    return dimensionResultV1("UNKNOWN", ["SOURCE_IDENTITY_UNRESOLVED"]);
  }

  return dimensionResultV1("PASS");
}

function evaluateProvenanceV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  if (
    !hasOwnPropertyV1(input, "sourceUrlOrArchiveRef") ||
    !hasOwnPropertyV1(input, "sourceHashOrArchiveHash") ||
    !hasTextV1(input.sourceUrlOrArchiveRef)
  ) {
    return dimensionResultV1("UNKNOWN", ["PROVENANCE_UNRESOLVED"]);
  }

  return dimensionResultV1("PASS");
}

function evaluateArchivePostureV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  const posture = input.reproducibilityOrArchivePosture;
  if (!hasTextV1(posture) || !SUPPORTED_ARCHIVE_POSTURES_V1.has(posture)) {
    return dimensionResultV1("UNKNOWN", ["ARCHIVE_POSTURE_UNRESOLVED"]);
  }

  if (
    posture === "PINNED_SOURCE_HASH" &&
    !hasTextV1(input.sourceHashOrArchiveHash)
  ) {
    return dimensionResultV1("UNKNOWN", ["ARCHIVE_POSTURE_UNRESOLVED"]);
  }

  if (
    (posture === "STABLE_ARCHIVE_REFERENCE" ||
      posture === "REPRODUCIBLE_PUBLIC_SOURCE") &&
    !hasTextV1(input.sourceUrlOrArchiveRef)
  ) {
    return dimensionResultV1("UNKNOWN", ["ARCHIVE_POSTURE_UNRESOLVED"]);
  }

  return dimensionResultV1("PASS");
}

function evaluateLicenseV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  if (
    !hasTextV1(input.licenseStatus) ||
    !SUPPORTED_LICENSE_STATUSES_V1.has(input.licenseStatus)
  ) {
    return dimensionResultV1("UNKNOWN", ["LICENSE_STATUS_UNRESOLVED"]);
  }

  return dimensionResultV1("PASS");
}

function evaluateSourceTypeV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  if (
    !hasTextV1(input.sourceType) ||
    !SUPPORTED_SOURCE_TYPES_V1.has(input.sourceType) ||
    !Array.isArray(input.citationTypes) ||
    input.citationTypes.length === 0 ||
    !input.citationTypes.every((citationType) =>
      SUPPORTED_CITATION_TYPES_V1.has(citationType),
    )
  ) {
    return dimensionResultV1("FAIL", ["SOURCE_TYPE_REVIEW_REQUIRED"]);
  }

  return dimensionResultV1("PASS");
}

function evaluateLanguageV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  if (!hasTextV1(input.language)) {
    return dimensionResultV1("UNKNOWN", [
      "LANGUAGE_REPRESENTATION_UNRESOLVED",
    ]);
  }

  return dimensionResultV1("PASS");
}

function evaluateVarietyV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  if (!hasOwnPropertyV1(input, "languageVariety")) {
    return dimensionResultV1("UNKNOWN", [
      "VARIETY_REPRESENTATION_UNRESOLVED",
    ]);
  }

  if (
    input.languageVariety !== null &&
    !hasTextV1(input.languageVariety)
  ) {
    return dimensionResultV1("UNKNOWN", [
      "VARIETY_REPRESENTATION_UNRESOLVED",
    ]);
  }

  return dimensionResultV1("PASS");
}

function evaluateClaimBoundaryV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  const boundary = input.claimBoundary;
  if (!boundary) {
    return dimensionResultV1("UNKNOWN", ["CLAIM_BOUNDARY_INCOMPATIBLE"]);
  }

  const prohibitedClaims = [
    "historicalOriginClaim",
    "historicalTransmissionClaim",
    "winnerClaim",
    "languageSuperiorityClaim",
    "candidateTruthClaim",
  ] as const;

  const represented = prohibitedClaims.every((claim) =>
    hasOwnPropertyV1(boundary, claim),
  );
  if (!represented) {
    return dimensionResultV1("UNKNOWN", ["CLAIM_BOUNDARY_INCOMPATIBLE"]);
  }

  if (
    prohibitedClaims.some((claim) => boundary[claim] !== false) ||
    boundary.functionalCorrespondence !== "NOT_EVALUATED" ||
    boundary.historicalRelation !== "NOT_CLAIMED" ||
    boundary.userDecisionPosture !== "user_decides"
  ) {
    return dimensionResultV1("FAIL", ["CLAIM_BOUNDARY_INCOMPATIBLE"]);
  }

  return dimensionResultV1("PASS");
}

function evaluateDimensionV1(
  dimension: ReviewedSourceTraditionAuthorityDimensionV1,
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityDimensionResultV1 {
  switch (dimension) {
    case "SOURCE_IDENTITY":
      return evaluateSourceIdentityV1(input);
    case "PROVENANCE":
      return evaluateProvenanceV1(input);
    case "REPRODUCIBILITY_OR_ARCHIVE_POSTURE":
      return evaluateArchivePostureV1(input);
    case "LICENSE_STATUS":
      return evaluateLicenseV1(input);
    case "SOURCE_TYPE":
      return evaluateSourceTypeV1(input);
    case "LANGUAGE_REPRESENTATION":
      return evaluateLanguageV1(input);
    case "VARIETY_REPRESENTATION":
      return evaluateVarietyV1(input);
    case "CLAIM_BOUNDARY_COMPATIBILITY":
      return evaluateClaimBoundaryV1(input);
  }
}

export function evaluateReviewedSourceTraditionAuthorityV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): ReviewedSourceTraditionAuthorityResultV1 {
  const dimensions = Object.freeze(
    Object.fromEntries(
      DIMENSIONS_V1.map((dimension) => [
        dimension,
        evaluateDimensionV1(dimension, input),
      ]),
    ) as Record<
      ReviewedSourceTraditionAuthorityDimensionV1,
      ReviewedSourceTraditionAuthorityDimensionResultV1
    >,
  );
  const reasonCodes = freezeReasonCodesV1(
    DIMENSIONS_V1.flatMap((dimension) => dimensions[dimension].reasonCodes),
  );
  const eligibleForReviewedIntake = DIMENSIONS_V1.every(
    (dimension) => dimensions[dimension].status === "PASS",
  );

  return Object.freeze({
    authorityVersion: REVIEWED_SOURCE_TRADITION_AUTHORITY_VERSION_V1,
    gate: "SOURCE_TRADITION_AUTHORITY",
    status: eligibleForReviewedIntake
      ? "ELIGIBLE_FOR_REVIEWED_INTAKE"
      : "NOT_ELIGIBLE_FOR_REVIEWED_INTAKE",
    eligibleForReviewedIntake,
    dimensions,
    reasonCodes,
    sourceRecordAuthority: "NOT_EVALUATED",
    functionalRuntimeAuthority: "NOT_GRANTED",
    functionalCorrespondence: "NOT_EVALUATED",
    historicalRelation: "NOT_CLAIMED",
    winnerSelection: "NONE",
  });
}

export function isReviewedSourceTraditionEligibleV1(
  input: ReviewedSourceTraditionAuthorityInputV1,
): boolean {
  return evaluateReviewedSourceTraditionAuthorityV1(input).eligibleForReviewedIntake;
}
