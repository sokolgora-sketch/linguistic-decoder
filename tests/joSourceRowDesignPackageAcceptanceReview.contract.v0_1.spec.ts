import fs from "node:fs";
import path from "node:path";

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
  proposedJoSourceRowDesignPolicyV0_1,
  proposedJoSourceRowDesignV0_1,
  validateProposedJoSourceRowDesignV0_1,
} from "./fixtures/joSourceRowDesignPackage.v0_1";

const root = process.cwd();

const report = fs.readFileSync(
  path.join(
    root,
    "docs/open-instrument/reports/jo-source-row-design-package-acceptance-review-v0.1.md",
  ),
  "utf8",
);

const registrySource = fs.readFileSync(
  path.join(
    root,
    "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
  ),
  "utf8",
);

const authorizationSource = fs.readFileSync(
  path.join(
    root,
    "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
  ),
  "utf8",
);

const operationSource = fs.readFileSync(
  path.join(
    root,
    "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
  ),
  "utf8",
);

const profileSource = fs.readFileSync(
  path.join(
    root,
    "src/shared/canonicalOperatorProfile.v0_1.ts",
  ),
  "utf8",
);

const admissionSource = fs.readFileSync(
  path.join(
    root,
    "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
  ),
  "utf8",
);

describe(
  "JO source-row design-package acceptance review v0.1",
  () => {
    it("records a decision-only acceptance-review posture", () => {
      expect(report).toContain(
        "Status: `ACCEPTANCE_REVIEW_DECISION_ONLY`",
      );

      expect(report).toContain(
        "`JO_SOURCE_ROW_DESIGN_PACKAGE_ACCEPTED_FOR_TRANSITION_PROPOSAL`",
      );

      expect(report).toContain(
        "`DESIGN_DEDICATED_JO_SOURCE_ROW_TRANSITION_PROPOSAL`",
      );

      expect(report).toContain(
        "`JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`",
      );
    });

    it("preserves exact proposed JO identity", () => {
      expect(proposedJoSourceRowDesignV0_1).toMatchObject({
        sourceId:
          "reviewed.external.jo.refusal.candidate.v0_1",
        candidateId:
          "albanian-jo-standalone-refusal-functional",
        candidateLanguage:
          "sq",
        embryo:
          "JO",
        isolatedStandaloneForm:
          "jo",
        plainStandaloneGloss:
          "standalone refusal / explicit rejection",
        sourceStatus:
          "reviewed_accepted",
        userDecisionPosture:
          "user_decides",
      });
    });

    it("preserves exact candidate-specific source identity", () => {
      const citation =
        proposedJoSourceRowDesignV0_1.externalCitations[0];

      expect(citation).toMatchObject({
        sourceTitle:
          "JO part.",
        sourceUrlOrArchiveRef:
          JO_SOURCE_ROW_DESIGN_LOCATOR_V0_1,
        attestedForm:
          "jo",
        sourceHashOrArchiveHash:
          JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1,
      });

      expect(citation.entryLocator).toContain(
        "post ID 25210",
      );

      expect(citation.entryLocator).toContain(
        "JO part.",
      );

      expect(citation.sourceAuthorOrEditor).toContain(
        "Bardhyl Demiraj",
      );

      expect(citation.sourceAuthorOrEditor).toContain(
        "Olav Hackstein",
      );

      expect(citation.reviewNote).toContain(
        "FGJSSH 745f.",
      );
    });

    it("passes its candidate-specific validator", () => {
      expect(
        validateProposedJoSourceRowDesignV0_1(
          proposedJoSourceRowDesignV0_1,
        ),
      ).toEqual({
        valid: true,
        reasons: [],
      });
    });

    it("passes generic functional readiness", () => {
      const readiness =
        buildReviewedExternalLexiconFunctionalReadinessV0_1(
          proposedJoSourceRowDesignV0_1,
        );

      expect(readiness).toMatchObject({
        sourceId:
          JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        candidateId:
          "albanian-jo-standalone-refusal-functional",
        functionalReady:
          true,
        historicalOriginClaim:
          "not_claimed",
        userDecisionPosture:
          "user_decides",
      });

      expect(
        readiness.items.every(
          (item) => item.passed,
        ),
      ).toBe(true);
    });

    it("passes generic citation packaging and direct locator review", () => {
      const checklist =
        buildReviewedExternalLexiconPromotionChecklistV0_1(
          proposedJoSourceRowDesignV0_1,
        );

      expect(checklist.promotionReady).toBe(true);

      expect(checklist.items).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id:
              "direct_authoritative_locator_or_archive",
            passed:
              true,
          }),
        ]),
      );

      expect(
        isReviewedExternalLexiconRegistryRowProductionSafeV0_1(
          proposedJoSourceRowDesignV0_1,
        ),
      ).toBe(true);
    });

    it("remains machine-unauthorized", () => {
      expect(
        isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
          JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        ),
      ).toBe(false);

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          proposedJoSourceRowDesignV0_1,
        );

      expect(authorization.authorized).toBe(false);

      expect(authorization.reasons).toContain(
        "source_id_not_authorized",
      );

      expect(
        authorization.readiness.functionalReady,
      ).toBe(true);
    });

    it("remains outside production membership and runtime projection", () => {
      expect(
        isReviewedExternalLexiconSourceIdInProductionMembershipV0_1(
          JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        ),
      ).toBe(false);

      expect(
        projectReviewedExternalLexiconProductionRowForRuntimeV0_1(
          proposedJoSourceRowDesignV0_1,
        ),
      ).toBeNull();
    });

    it("keeps JO outside production while preserving admitted production rows", () => {
      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1().map(
          (row) => row.sourceId,
        ),
      ).toEqual([
        "reviewed.external.di.knowledge.candidate.v0_1",
        "reviewed.external.albanian-at.father.candidate.v0_1",
        "reviewed.external.gheg-da.damage.candidate.v0_1",
      ]);

      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1(),
      ).toHaveLength(3);
    });

    it("keeps JO candidate-registered but absent from authorization owner", () => {
      expect(
        reviewedExternalLexiconSourceRowCandidateRegistryV0_1.map(
          (row) => row.sourceId,
        ),
      ).toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );

      expect(registrySource).toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );

      expect(authorizationSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );
    });

    it("preserves exact-only operation and jo-only carrier posture", () => {
      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .proposedEvidenceOperations,
      ).toEqual(["exact"]);

      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .proposedEvidenceCarrierForms,
      ).toEqual(["jo"]);

      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .proposedPositiveProofWords,
      ).toEqual(["jo"]);
    });

    it("preserves all cross-operator and collision negatives", () => {
      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .crossOperatorNegativeControls,
      ).toEqual(["po", "da", "di"]);

      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .collisionNegativeControls,
      ).toEqual([
        "major",
        "enjoy",
        "joke",
        "joint",
        "banjo",
        "judo",
      ]);
    });

    it("preserves the bounded scope and excluded scopes", () => {
      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .boundedFunctionalScope,
      ).toBe(
        "standalone_refusal_or_explicit_rejection",
      );

      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .excludedFunctionalScopes,
      ).toEqual(
        expect.arrayContaining([
          "general_sentence_level_negation",
          "unrestricted_negative_polarity",
          "symbolic_po_jo_opposition",
          "prefix_behavior",
          "suffix_behavior",
          "substring_projection",
        ]),
      );
    });

    it("does not register JO in operation, profile or admission owners", () => {
      expect(operationSource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(operationSource).not.toMatch(
        /embryo:\s*"JO"/,
      );

      expect(profileSource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(admissionSource).not.toMatch(
        /operatorId:\s*"JO"/,
      );
    });

    it("requires a separate design-only transition proposal", () => {
      expect(report).toContain(
        "The next lane must remain design-only.",
      );

      expect(report).toContain(
        "source-row candidate registry placement",
      );

      expect(report).toContain(
        "production-membership placement",
      );

      expect(report).toContain(
        "functional runtime authorization",
      );

      expect(report).toContain(
        "canonical profile registration",
      );

      expect(report).toContain(
        "evidence-operation policy",
      );

      expect(report).toContain(
        "carrier policy",
      );

      expect(report).toContain(
        "runtime projection eligibility",
      );

      expect(report).toContain(
        "profile-backed live-smoke coverage",
      );

      expect(report).toContain(
        "canon-lock admission",
      );
    });

    it("keeps implementation explicitly unauthorized", () => {
      expect(report).toContain(
        "The proposal must not perform any of these changes.",
      );

      expect(report).toContain(
        "This lane does not modify:",
      );

      expect(report).toContain(
        "`JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`",
      );
    });

    it("preserves all claim boundaries and user decision", () => {
      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .claimBoundary,
      ).toEqual({
        historicalOrigin:
          "not_claimed",
        historicalTransmission:
          "not_claimed",
        borrowingDirection:
          "not_claimed",
        linguisticOwnership:
          "not_claimed",
        winnerStatus:
          "not_claimed",
        languageSuperiority:
          "not_claimed",
        candidateTruth:
          "not_claimed",
        scientificProof:
          "not_claimed",
        publicationGradeOpenInstrumentProof:
          "not_claimed",
        generalNegationOwnership:
          "not_claimed",
        userDecisionPosture:
          "user_decides",
      });

      expect(report).toContain(
        "`user_decides`",
      );
    });
  },
);
