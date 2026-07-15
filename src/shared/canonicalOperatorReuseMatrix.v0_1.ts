import {
  discoverCanonicalOperatorCandidatesV0_1,
  type CanonicalOperatorDiscoveryCandidateV0_1,
} from "./canonicalOperatorDiscovery.v0_1";

export const CANONICAL_OPERATOR_REUSE_MATRIX_VERSION_V0_1 =
  "canonical-operator-reuse-matrix.v0_1" as const;

export const REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1 = [
  "da_reviewed_positive",
  "di_reviewed_positive",
  "da_unreviewed_structural",
  "di_unreviewed_structural",
  "embedded_substring_collision",
  "operation_collision",
  "cross_operator_negative",
  "case_and_whitespace_normalization",
  "punctuation_normalization",
  "unicode_normalization",
  "unsupported_null",
  "repeated_run_determinism",
] as const;

export type CanonicalOperatorReuseCategoryV0_1 =
  (typeof REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1)[number];

export type CanonicalOperatorIdV0_1 = "DA" | "DI";

export type CanonicalOperatorReuseMatrixCaseV0_1 = {
  caseId: string;
  input: string;
  categories:
    readonly CanonicalOperatorReuseCategoryV0_1[];
  expectedReviewedOperators:
    readonly CanonicalOperatorIdV0_1[];
  expectedCandidateOnlyOperators?:
    readonly CanonicalOperatorIdV0_1[];
  expectedNoCandidates?: boolean;
  normalizationEquivalentToCaseId?: string;
  notes: readonly string[];
};

export type CanonicalOperatorReuseObservationV0_1 = {
  caseId: string;
  input: string;
  categories:
    readonly CanonicalOperatorReuseCategoryV0_1[];
  expectedReviewedOperators:
    readonly CanonicalOperatorIdV0_1[];
  actualReviewedOperators: readonly string[];
  expectedCandidateOnlyOperators:
    readonly CanonicalOperatorIdV0_1[] | null;
  actualCandidateOnlyOperators: readonly string[];
  allObservedOperators: readonly string[];
  candidateCount: number;
  deterministic: boolean;
  normalizationEquivalent: boolean | null;
  reviewedExpectationPassed: boolean;
  candidateOnlyExpectationPassed: boolean;
  nullExpectationPassed: boolean;
  unexpectedReviewedOperators: readonly string[];
  missingReviewedOperators: readonly string[];
  unexpectedCandidateOnlyOperators: readonly string[];
  missingCandidateOnlyOperators: readonly string[];
  unexpectedOperators: readonly string[];
  collisionSafe: boolean;
  candidates:
    readonly CanonicalOperatorDiscoveryCandidateV0_1[];
};

export type CanonicalOperatorReuseMetricsV0_1 = {
  reportVersion:
    typeof CANONICAL_OPERATOR_REUSE_MATRIX_VERSION_V0_1;
  caseCount: number;
  categoryCount: number;
  coveredCategories:
    readonly CanonicalOperatorReuseCategoryV0_1[];
  coverageGaps:
    readonly CanonicalOperatorReuseCategoryV0_1[];
  reviewedEvidenceExpectedAndPresent: number;
  reviewedEvidenceExpectedMissing: number;
  falseReviewedEvidence: number;
  candidateOnlyExpectedAndPresent: number;
  candidateOnlyExpectedMissing: number;
  correctNull: number;
  incorrectNull: number;
  collisionFailure: number;
  normalizationFailure: number;
  determinismFailure: number;
  unexpectedOperator: number;
  unexpectedCitationBearingEvidence: null;
  citationBearingEvidenceMetricStatus:
    "not_measured_at_discovery_boundary_existing_live_smoke_required";
  pass: boolean;
  observations:
    readonly CanonicalOperatorReuseObservationV0_1[];
};

export const canonicalOperatorReuseMatrixV0_1:
readonly CanonicalOperatorReuseMatrixCaseV0_1[] = [
  {
    caseId: "da-reviewed-exact",
    input: "da",
    categories: [
      "da_reviewed_positive",
      "cross_operator_negative",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DA"],
    expectedCandidateOnlyOperators: [],
    notes: [
      "Canon-locked DA exact positive.",
      "DI reviewed evidence must remain absent.",
    ],
  },
  {
    caseId: "da-reviewed-dam",
    input: "dam",
    categories: [
      "da_reviewed_positive",
      "cross_operator_negative",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DA"],
    expectedCandidateOnlyOperators: [],
    notes: [
      "Reviewed DA bridge word.",
      "No reviewed DI projection is expected.",
    ],
  },
  {
    caseId: "da-reviewed-damage",
    input: "damage",
    categories: [
      "da_reviewed_positive",
      "cross_operator_negative",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DA"],
    expectedCandidateOnlyOperators: [],
    notes: [
      "Reviewed DA bridge word.",
      "Legacy dëm compatibility output is outside this discovery metric.",
    ],
  },
  {
    caseId: "di-reviewed-exact",
    input: "di",
    categories: [
      "di_reviewed_positive",
      "cross_operator_negative",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DI"],
    expectedCandidateOnlyOperators: [],
    notes: [
      "Canon-locked DI exact positive.",
      "DA reviewed evidence must remain absent.",
    ],
  },
  {
    caseId: "di-reviewed-study",
    input: "study",
    categories: [
      "di_reviewed_positive",
      "cross_operator_negative",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DI"],
    expectedCandidateOnlyOperators: [],
    notes: [
      "Reviewed DI bridge through y_to_i.",
      "SHTU compatibility material does not grant canonical authorization.",
    ],
  },
  {
    caseId: "di-reviewed-studim",
    input: "studim",
    categories: [
      "di_reviewed_positive",
      "cross_operator_negative",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DI"],
    expectedCandidateOnlyOperators: [],
    notes: [
      "Reviewed DI bridge word.",
      "DA reviewed evidence must remain absent.",
    ],
  },
  {
    caseId: "da-unreviewed-data",
    input: "data",
    categories: [
      "da_unreviewed_structural",
      "embedded_substring_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    expectedCandidateOnlyOperators: ["DA"],
    notes: [
      "Structural DA pattern is observable.",
      "Reviewed evidence remains unauthorized.",
    ],
  },
  {
    caseId: "di-unreviewed-dij",
    input: "dij",
    categories: [
      "di_unreviewed_structural",
      "embedded_substring_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    expectedCandidateOnlyOperators: ["DI"],
    notes: [
      "Structural DI pattern is observable.",
      "Reviewed evidence remains unauthorized.",
    ],
  },
  {
    caseId: "di-unreviewed-dije",
    input: "dije",
    categories: [
      "di_unreviewed_structural",
      "embedded_substring_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    expectedCandidateOnlyOperators: ["DI"],
    notes: [
      "Structural DI pattern is observable.",
      "Reviewed evidence remains unauthorized.",
    ],
  },
  {
    caseId: "di-unreviewed-dit",
    input: "dit",
    categories: [
      "di_unreviewed_structural",
      "embedded_substring_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    expectedCandidateOnlyOperators: ["DI"],
    notes: [
      "Structural DI pattern is observable.",
      "Semantic drift does not authorize reviewed evidence.",
    ],
  },
  {
    caseId: "operation-collision-mode",
    input: "mode",
    categories: [
      "operation_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    expectedCandidateOnlyOperators: [],
    expectedNoCandidates: true,
    notes: [
      "Unsupported operation path must not create a canonical candidate.",
    ],
  },
  {
    caseId: "operation-collision-made",
    input: "made",
    categories: [
      "operation_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    expectedCandidateOnlyOperators: [],
    expectedNoCandidates: true,
    notes: [
      "Unsupported operation path must not create a canonical candidate.",
    ],
  },
  {
    caseId: "operation-collision-dome",
    input: "dome",
    categories: [
      "operation_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    expectedCandidateOnlyOperators: [],
    expectedNoCandidates: true,
    notes: [
      "Unsupported operation path must not create a canonical candidate.",
    ],
  },
  {
    caseId: "unsupported-null-xyz",
    input: "xyz",
    categories: [
      "unsupported_null",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    expectedCandidateOnlyOperators: [],
    expectedNoCandidates: true,
    notes: [
      "Null is valid when no canonical candidate is supported.",
    ],
  },
  {
    caseId: "normalization-damage-case-whitespace",
    input: "  DAMAGE  ",
    categories: [
      "case_and_whitespace_normalization",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DA"],
    expectedCandidateOnlyOperators: [],
    normalizationEquivalentToCaseId:
      "da-reviewed-damage",
    notes: [
      "ASCII case and surrounding whitespace normalize to damage.",
    ],
  },
  {
    caseId: "normalization-di-uppercase",
    input: "DI",
    categories: [
      "case_and_whitespace_normalization",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DI"],
    expectedCandidateOnlyOperators: [],
    normalizationEquivalentToCaseId:
      "di-reviewed-exact",
    notes: [
      "ASCII uppercase normalizes to di.",
    ],
  },
  {
    caseId: "normalization-study-unicode-space",
    input: "\u00a0STUDY\u00a0",
    categories: [
      "unicode_normalization",
      "case_and_whitespace_normalization",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: ["DI"],
    expectedCandidateOnlyOperators: [],
    normalizationEquivalentToCaseId:
      "di-reviewed-study",
    notes: [
      "Unicode non-breaking spaces are trimmed.",
      "No Unicode lexical equivalence beyond current normalization is claimed.",
    ],
  },
  {
    caseId: "punctuation-damage",
    input: "damage!",
    categories: [
      "punctuation_normalization",
      "embedded_substring_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    notes: [
      "Punctuation is not an authorized reviewed bridge transformation.",
      "A structural candidate may exist, but reviewed evidence must remain absent.",
    ],
  },
  {
    caseId: "punctuation-di",
    input: "di,",
    categories: [
      "punctuation_normalization",
      "embedded_substring_collision",
      "repeated_run_determinism",
    ],
    expectedReviewedOperators: [],
    notes: [
      "Punctuation is not an authorized reviewed bridge transformation.",
      "A structural candidate may exist, but reviewed evidence must remain absent.",
    ],
  },
];

function uniqueSorted(values: readonly string[]): string[] {
  return Array.from(new Set(values)).sort((left, right) =>
    left.localeCompare(right),
  );
}

function candidateSignature(
  candidates:
    readonly CanonicalOperatorDiscoveryCandidateV0_1[],
): string {
  return JSON.stringify(
    candidates.map((candidate) => ({
      discoveryVersion:
        candidate.discoveryVersion,
      basis: candidate.basis,
      operatorId: candidate.operatorId,
      embryo: candidate.embryo,
      sourceId: candidate.sourceId,
      language: candidate.language,
      segment: candidate.segment,
      segmentStart: candidate.segmentStart,
      carrierForm: candidate.carrierForm,
      operations: [...candidate.operations],
      functionalBridgeStatus:
        candidate.functionalBridgeStatus,
      reviewedEvidenceEligible:
        candidate.reviewedEvidenceEligible,
      discoveryAuthority:
        candidate.discoveryAuthority,
    })),
  );
}

function observeCandidates(
  input: string,
): {
  candidates:
    readonly CanonicalOperatorDiscoveryCandidateV0_1[];
  signature: string;
  reviewedOperators: readonly string[];
  candidateOnlyOperators: readonly string[];
  allOperators: readonly string[];
} {
  const candidates =
    discoverCanonicalOperatorCandidatesV0_1(input);

  return {
    candidates,
    signature: candidateSignature(candidates),
    reviewedOperators: uniqueSorted(
      candidates
        .filter(
          (candidate) =>
            candidate.reviewedEvidenceEligible,
        )
        .map((candidate) => candidate.operatorId),
    ),
    candidateOnlyOperators: uniqueSorted(
      candidates
        .filter(
          (candidate) =>
            !candidate.reviewedEvidenceEligible,
        )
        .map((candidate) => candidate.operatorId),
    ),
    allOperators: uniqueSorted(
      candidates.map(
        (candidate) => candidate.operatorId,
      ),
    ),
  };
}

function sameStringSet(
  left: readonly string[],
  right: readonly string[],
): boolean {
  return (
    JSON.stringify(uniqueSorted(left)) ===
    JSON.stringify(uniqueSorted(right))
  );
}

function difference(
  left: readonly string[],
  right: readonly string[],
): string[] {
  const rightSet = new Set(right);
  return uniqueSorted(
    left.filter((value) => !rightSet.has(value)),
  );
}

function hasCollisionCategory(
  categories:
    readonly CanonicalOperatorReuseCategoryV0_1[],
): boolean {
  return categories.some((category) =>
    [
      "embedded_substring_collision",
      "operation_collision",
      "cross_operator_negative",
      "punctuation_normalization",
      "unsupported_null",
    ].includes(category),
  );
}

export function evaluateCanonicalOperatorReuseMatrixV0_1(
  matrix:
    readonly CanonicalOperatorReuseMatrixCaseV0_1[] =
      canonicalOperatorReuseMatrixV0_1,
): CanonicalOperatorReuseMetricsV0_1 {
  const firstObservations = new Map(
    matrix.map((matrixCase) => [
      matrixCase.caseId,
      observeCandidates(matrixCase.input),
    ]),
  );

  const observations =
    matrix.map((matrixCase) => {
      const first =
        firstObservations.get(matrixCase.caseId);

      if (!first) {
        throw new Error(
          `Missing first observation for ${matrixCase.caseId}.`,
        );
      }

      const repeatedSignatures = [
        first.signature,
        observeCandidates(matrixCase.input).signature,
        observeCandidates(matrixCase.input).signature,
      ];

      const deterministic =
        repeatedSignatures.every(
          (signature) =>
            signature === repeatedSignatures[0],
        );

      const expectedReviewed =
        uniqueSorted(
          matrixCase.expectedReviewedOperators,
        );

      const actualReviewed =
        uniqueSorted(first.reviewedOperators);

      const expectedCandidateOnly =
        matrixCase.expectedCandidateOnlyOperators
          ? uniqueSorted(
              matrixCase.expectedCandidateOnlyOperators,
            )
          : null;

      const actualCandidateOnly =
        uniqueSorted(first.candidateOnlyOperators);

      const reviewedExpectationPassed =
        sameStringSet(
          expectedReviewed,
          actualReviewed,
        );

      const candidateOnlyExpectationPassed =
        expectedCandidateOnly === null
          ? true
          : sameStringSet(
              expectedCandidateOnly,
              actualCandidateOnly,
            );

      const nullExpectationPassed =
        matrixCase.expectedNoCandidates
          ? first.candidates.length === 0
          : true;

      const referenceCaseId =
        matrixCase.normalizationEquivalentToCaseId;

      const referenceObservation =
        referenceCaseId
          ? firstObservations.get(referenceCaseId)
          : null;

      if (
        referenceCaseId &&
        !referenceObservation
      ) {
        throw new Error(
          `Missing normalization reference ${referenceCaseId}.`,
        );
      }

      const normalizationEquivalent =
        referenceObservation
          ? first.signature ===
            referenceObservation.signature
          : null;

      const unexpectedReviewedOperators =
        difference(
          actualReviewed,
          expectedReviewed,
        );

      const missingReviewedOperators =
        difference(
          expectedReviewed,
          actualReviewed,
        );

      const unexpectedCandidateOnlyOperators =
        expectedCandidateOnly === null
          ? []
          : difference(
              actualCandidateOnly,
              expectedCandidateOnly,
            );

      const missingCandidateOnlyOperators =
        expectedCandidateOnly === null
          ? []
          : difference(
              expectedCandidateOnly,
              actualCandidateOnly,
            );

      const unexpectedOperators =
        first.allOperators.filter(
          (operatorId) =>
            operatorId !== "DA" &&
            operatorId !== "DI",
        );

      const collisionSafe =
        !hasCollisionCategory(
          matrixCase.categories,
        ) ||
        (
          reviewedExpectationPassed &&
          candidateOnlyExpectationPassed &&
          nullExpectationPassed &&
          unexpectedOperators.length === 0
        );

      return {
        caseId: matrixCase.caseId,
        input: matrixCase.input,
        categories: matrixCase.categories,
        expectedReviewedOperators:
          matrixCase.expectedReviewedOperators,
        actualReviewedOperators:
          actualReviewed,
        expectedCandidateOnlyOperators:
          matrixCase.expectedCandidateOnlyOperators ??
          null,
        actualCandidateOnlyOperators:
          actualCandidateOnly,
        allObservedOperators:
          first.allOperators,
        candidateCount:
          first.candidates.length,
        deterministic,
        normalizationEquivalent,
        reviewedExpectationPassed,
        candidateOnlyExpectationPassed,
        nullExpectationPassed,
        unexpectedReviewedOperators,
        missingReviewedOperators,
        unexpectedCandidateOnlyOperators,
        missingCandidateOnlyOperators,
        unexpectedOperators,
        collisionSafe,
        candidates: first.candidates,
      };
    });

  const coveredCategories =
    REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1.filter(
      (requiredCategory) =>
        observations.some((observation) =>
          observation.categories.includes(
            requiredCategory,
          ),
        ),
    );

  const coverageGaps =
    REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1.filter(
      (requiredCategory) =>
        !coveredCategories.includes(
          requiredCategory,
        ),
    );

  const reviewedEvidenceExpectedAndPresent =
    observations.reduce(
      (total, observation) =>
        total +
        observation.expectedReviewedOperators.filter(
          (operatorId) =>
            observation.actualReviewedOperators.includes(
              operatorId,
            ),
        ).length,
      0,
    );

  const reviewedEvidenceExpectedMissing =
    observations.reduce(
      (total, observation) =>
        total +
        observation.missingReviewedOperators.length,
      0,
    );

  const falseReviewedEvidence =
    observations.reduce(
      (total, observation) =>
        total +
        observation.unexpectedReviewedOperators.length,
      0,
    );

  const candidateOnlyExpectedAndPresent =
    observations.reduce(
      (total, observation) => {
        const expected =
          observation.expectedCandidateOnlyOperators;

        if (!expected) return total;

        return (
          total +
          expected.filter((operatorId) =>
            observation.actualCandidateOnlyOperators.includes(
              operatorId,
            ),
          ).length
        );
      },
      0,
    );

  const candidateOnlyExpectedMissing =
    observations.reduce(
      (total, observation) =>
        total +
        observation.missingCandidateOnlyOperators.length,
      0,
    );

  const correctNull =
    observations.filter(
      (observation) => {
        const matrixCase = matrix.find(
          (candidate) =>
            candidate.caseId ===
            observation.caseId,
        );

        return (
          matrixCase?.expectedNoCandidates === true &&
          observation.candidateCount === 0
        );
      },
    ).length;

  const incorrectNull =
    observations.filter(
      (observation) => {
        const matrixCase = matrix.find(
          (candidate) =>
            candidate.caseId ===
            observation.caseId,
        );

        return (
          matrixCase?.expectedNoCandidates === true &&
          observation.candidateCount !== 0
        );
      },
    ).length;

  const collisionFailure =
    observations.filter(
      (observation) =>
        !observation.collisionSafe,
    ).length;

  const normalizationFailure =
    observations.filter(
      (observation) =>
        observation.normalizationEquivalent ===
        false,
    ).length;

  const determinismFailure =
    observations.filter(
      (observation) =>
        !observation.deterministic,
    ).length;

  const unexpectedOperator =
    observations.reduce(
      (total, observation) =>
        total +
        observation.unexpectedOperators.length,
      0,
    );

  const pass =
    coverageGaps.length === 0 &&
    reviewedEvidenceExpectedMissing === 0 &&
    falseReviewedEvidence === 0 &&
    candidateOnlyExpectedMissing === 0 &&
    incorrectNull === 0 &&
    collisionFailure === 0 &&
    normalizationFailure === 0 &&
    determinismFailure === 0 &&
    unexpectedOperator === 0;

  return {
    reportVersion:
      CANONICAL_OPERATOR_REUSE_MATRIX_VERSION_V0_1,
    caseCount: matrix.length,
    categoryCount:
      REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1.length,
    coveredCategories,
    coverageGaps,
    reviewedEvidenceExpectedAndPresent,
    reviewedEvidenceExpectedMissing,
    falseReviewedEvidence,
    candidateOnlyExpectedAndPresent,
    candidateOnlyExpectedMissing,
    correctNull,
    incorrectNull,
    collisionFailure,
    normalizationFailure,
    determinismFailure,
    unexpectedOperator,
    unexpectedCitationBearingEvidence: null,
    citationBearingEvidenceMetricStatus:
      "not_measured_at_discovery_boundary_existing_live_smoke_required",
    pass,
    observations,
  };
}
