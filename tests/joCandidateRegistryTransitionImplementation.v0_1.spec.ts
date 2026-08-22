import { readFileSync } from "node:fs";

import {
  evaluateReviewedExternalLexiconEvidenceGateV0_1,
} from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";

import {
  buildReviewedExternalLexiconFunctionalReadinessV0_1,
} from "../src/shared/reviewedExternalLexiconFunctionalReadiness.v0_1";

import {
  evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1,
  isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1,
} from "../src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1";

import {
  projectReviewedExternalLexiconProductionRowForRuntimeV0_1,
} from "../src/shared/reviewedExternalLexiconRuntimeProjection.v0_1";

import {
  buildReviewedExternalLexiconPromotionChecklistV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1";

import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  isReviewedExternalLexiconRegistryRowProductionSafeV0_1,
  isReviewedExternalLexiconSourceIdInProductionMembershipV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

import {
  JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1,
  JO_SOURCE_ROW_DESIGN_LOCATOR_V0_1,
  JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
  validateProposedJoSourceRowDesignV0_1,
} from "./fixtures/joSourceRowDesignPackage.v0_1";

describe(
  "JO candidate-registry transition implementation v0.1",
  () => {
    it("registers the exact accepted JO candidate exactly once", () => {
      const joRows =
        reviewedExternalLexiconSourceRowCandidateRegistryV0_1.filter(
          (row) =>
            row.sourceId ===
            JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        );

      expect(joRows).toHaveLength(1);

      const row = joRows[0];

      expect(row).toBeDefined();

      if (!row) {
        return;
      }

      expect(row).toMatchObject({
        sourceId:
          "reviewed.external.jo.refusal.candidate.v0_1",
        candidateId:
          "albanian-jo-standalone-refusal-functional",
        candidateLanguage: "sq",
        displayForm:
          "JO standalone refusal candidate",
        sourceKind:
          "reviewed_dictionary_source",
        sourceStatus:
          "reviewed_accepted",
        embryo: "JO",
        isolatedStandaloneForm: "jo",
        plainStandaloneGloss:
          "standalone refusal / explicit rejection",
        originClaim: false,
        historicalTransmissionClaim: false,
        winnerClaim: false,
        languageSuperiorityClaim: false,
        candidateTruthClaim: false,
        publicationEvidenceClaim: false,
        scientificEvidenceClaim: false,
        userDecisionPosture: "user_decides",
      });

      expect(row.externalCitations).toHaveLength(1);

      expect(row.externalCitations[0]).toMatchObject({
        citationId:
          "reviewed.external.jo.refusal.candidate.citation.v0_1",
        citationStatus:
          "reviewed_accepted",
        citationType:
          "dictionary_entry",
        sourceTitle:
          "JO part.",
        sourceAuthorOrEditor:
          "Bardhyl Demiraj; Olav Hackstein",
        sourceUrlOrArchiveRef:
          JO_SOURCE_ROW_DESIGN_LOCATOR_V0_1,
        attestedForm:
          "jo",
        reviewedAt:
          "2026-07-14",
        sourceHashOrArchiveHash:
          JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1,
      });

      expect(
        row.externalCitations[0].entryLocator,
      ).toContain("post ID 25210");

      expect(
        validateProposedJoSourceRowDesignV0_1(
          row,
        ),
      ).toEqual({
        valid: true,
        reasons: [],
      });
    });

    it("passes generic evidence gates while remaining candidate-only", () => {
      const row =
        reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
          (candidate) =>
            candidate.sourceId ===
            JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        );

      expect(row).toBeDefined();

      if (!row) {
        return;
      }

      const evidenceGate =
        evaluateReviewedExternalLexiconEvidenceGateV0_1(
          row,
        );

      expect(evidenceGate).toMatchObject({
        eligible: true,
        validationOutcome:
          "source_validation_eligible",
        validationReasons: [],
        originClaim:
          "not_claimed",
        userDecisionPosture:
          "user_decides",
      });

      const readiness =
        buildReviewedExternalLexiconFunctionalReadinessV0_1(
          row,
        );

      expect(readiness.functionalReady).toBe(true);

      expect(
        readiness.items.every(
          (item) => item.passed,
        ),
      ).toBe(true);

      const checklist =
        buildReviewedExternalLexiconPromotionChecklistV0_1(
          row,
        );

      expect(checklist.promotionReady).toBe(true);

      expect(
        isReviewedExternalLexiconRegistryRowProductionSafeV0_1(
          row,
        ),
      ).toBe(true);

      expect(
        isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
          JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        ),
      ).toBe(false);

      expect(
        isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
          JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        ),
      ).toBe(false);

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          row,
        );

      expect(authorization.authorized).toBe(false);

      expect(authorization.reasons).toContain(
        "source_id_not_authorized",
      );

      expect(
        projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
          row,
        ),
      ).toBeNull();

      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1().map(
          (candidate) => candidate.sourceId,
        ),
      ).toEqual([
        "reviewed.external.di.knowledge.candidate.v0_1",
        "reviewed.external.albanian-at.father.candidate.v0_1",
        "reviewed.external.gheg-da.damage.candidate.v0_1",
      ]);
    });

    it("keeps every later JO runtime and governance owner unwired", () => {
      const registrySource =
        readFileSync(
          "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
          "utf8",
        );

      const authorizationSource =
        readFileSync(
          "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
          "utf8",
        );

      const operationSource =
        readFileSync(
          "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
          "utf8",
        );

      const projectionSource =
        readFileSync(
          "src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts",
          "utf8",
        );

      const profileSource =
        readFileSync(
          "src/shared/canonicalOperatorProfile.v0_1.ts",
          "utf8",
        );

      const admissionSource =
        readFileSync(
          "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
          "utf8",
        );

      const targetFamilySource =
        readFileSync(
          "src/shared/canonicalOperatorReviewedTargetFamily.v0_1.ts",
          "utf8",
        );

      const smokeCasesSource =
        readFileSync(
          "scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts",
          "utf8",
        );

      expect(registrySource).toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );

      expect(registrySource).not.toContain(
        "tests/fixtures/joSourceRowDesignPackage.v0_1",
      );

      expect(authorizationSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );

      expect(operationSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );

      expect(operationSource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(operationSource).not.toMatch(
        /embryo:\s*"JO"/,
      );

      expect(projectionSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );

      expect(profileSource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(admissionSource).not.toContain(
        '"JO"',
      );

      expect(targetFamilySource).not.toContain(
        '"JO"',
      );

      expect(smokeCasesSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );
    });
  },
);
