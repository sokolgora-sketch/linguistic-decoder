import * as fs from "node:fs";
import * as path from "node:path";

import {
  canonicalOperatorProfilesV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

import {
  CANONICAL_OPERATOR_REUSE_MATRIX_VERSION_V0_1,
  REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1,
  canonicalOperatorReuseMatrixV0_1,
  evaluateCanonicalOperatorReuseMatrixV0_1,
} from "@/shared/canonicalOperatorReuseMatrix.v0_1";

function readRepoFile(
  relativePath: string,
): string {
  return fs.readFileSync(
    path.join(process.cwd(), relativePath),
    "utf8",
  );
}

describe(
  "DA/DI canonical-operator reuse matrix and metrics v0.1",
  () => {
    it("owns a unique data-driven matrix", () => {
      const caseIds =
        canonicalOperatorReuseMatrixV0_1.map(
          (matrixCase) => matrixCase.caseId,
        );

      expect(
        new Set(caseIds).size,
      ).toBe(caseIds.length);

      expect(
        canonicalOperatorReuseMatrixV0_1.length,
      ).toBeGreaterThanOrEqual(19);
    });

    it("covers every required v0.1 category", () => {
      const report =
        evaluateCanonicalOperatorReuseMatrixV0_1();

      expect(report.reportVersion).toBe(
        CANONICAL_OPERATOR_REUSE_MATRIX_VERSION_V0_1,
      );

      expect(report.coverageGaps).toEqual([]);

      expect(report.coveredCategories).toEqual(
        REQUIRED_CANONICAL_OPERATOR_REUSE_CATEGORIES_V0_1,
      );
    });

    it("includes every DA and DI reviewed proof word", () => {
      const reviewedInputs =
        new Set(
          canonicalOperatorReuseMatrixV0_1
            .filter(
              (matrixCase) =>
                matrixCase
                  .expectedReviewedOperators
                  .length > 0,
            )
            .map((matrixCase) =>
              matrixCase.input
                .trim()
                .toLocaleLowerCase("en-US"),
            ),
        );

      const profiles =
        canonicalOperatorProfilesV0_1.filter(
          (profile) =>
            profile.operatorId === "DA" ||
            profile.operatorId === "DI",
        );

      expect(
        profiles.map(
          (profile) => profile.operatorId,
        ),
      ).toEqual(["DA", "DI"]);

      for (const profile of profiles) {
        for (
          const proofWord
          of profile.positiveProofWords
        ) {
          expect(
            reviewedInputs.has(proofWord),
          ).toBe(true);
        }
      }
    });

    it("reports no false reviewed evidence or missed reviewed bridge", () => {
      const report =
        evaluateCanonicalOperatorReuseMatrixV0_1();

      expect(
        report.reviewedEvidenceExpectedAndPresent,
      ).toBeGreaterThan(0);

      expect(
        report.reviewedEvidenceExpectedMissing,
      ).toBe(0);

      expect(
        report.falseReviewedEvidence,
      ).toBe(0);
    });

    it("keeps structural DA and DI patterns candidate-only", () => {
      const report =
        evaluateCanonicalOperatorReuseMatrixV0_1();

      expect(
        report.candidateOnlyExpectedAndPresent,
      ).toBeGreaterThanOrEqual(4);

      expect(
        report.candidateOnlyExpectedMissing,
      ).toBe(0);
    });

    it("measures Null, collision, normalization, determinism, and operator safety", () => {
      const report =
        evaluateCanonicalOperatorReuseMatrixV0_1();

      expect(report.correctNull).toBe(4);
      expect(report.incorrectNull).toBe(0);
      expect(report.collisionFailure).toBe(0);
      expect(report.normalizationFailure).toBe(0);
      expect(report.determinismFailure).toBe(0);
      expect(report.unexpectedOperator).toBe(0);
      expect(report.pass).toBe(true);
    });

    it("does not pretend to inspect citation-bearing API projection", () => {
      const report =
        evaluateCanonicalOperatorReuseMatrixV0_1();

      expect(
        report.unexpectedCitationBearingEvidence,
      ).toBeNull();

      expect(
        report.citationBearingEvidenceMetricStatus,
      ).toBe(
        "not_measured_at_discovery_boundary_existing_live_smoke_required",
      );
    });

    it("contains only DA and DI operator expectations", () => {
      for (
        const matrixCase
        of canonicalOperatorReuseMatrixV0_1
      ) {
        const expectedOperators = [
          ...matrixCase.expectedReviewedOperators,
          ...(
            matrixCase
              .expectedCandidateOnlyOperators ??
            []
          ),
        ];

        expect(
          expectedOperators.every(
            (operatorId) =>
              operatorId === "DA" ||
              operatorId === "DI",
          ),
        ).toBe(true);
      }
    });

    it("does not mutate canonical profiles or runtime owners", () => {
      const matrixSource = readRepoFile(
        "src/shared/canonicalOperatorReuseMatrix.v0_1.ts",
      );

      const discoverySource = readRepoFile(
        "src/shared/canonicalOperatorDiscovery.v0_1.ts",
      );

      const profileSource = readRepoFile(
        "src/shared/canonicalOperatorProfile.v0_1.ts",
      );

      expect(matrixSource).toContain(
        "discoverCanonicalOperatorCandidatesV0_1",
      );

      expect(matrixSource).not.toContain(
        "runtimeExpansionAuthorized: true",
      );

      expect(discoverySource).not.toContain(
        "canonicalOperatorReuseMatrixV0_1",
      );

      expect(profileSource).not.toContain(
        "canonicalOperatorReuseMatrixV0_1",
      );
    });
  },
);
