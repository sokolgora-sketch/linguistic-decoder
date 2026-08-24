import fs from "node:fs";
import path from "node:path";

import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
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
  proposedJoSourceRowDesignPolicyV0_1,
  proposedJoSourceRowDesignV0_1,
  validateProposedJoSourceRowDesignV0_1,
} from "./fixtures/joSourceRowDesignPackage.v0_1";

const root = process.cwd();

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

const operationPolicySource = fs.readFileSync(
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
  "JO design-only source-row package v0.1",
  () => {
    it("matches the exact current source-row schema", () => {
      const row:
        ReviewedExternalLexiconCandidateSourceRowV0_1 =
          proposedJoSourceRowDesignV0_1;

      expect(row).toMatchObject({
        sourceId:
          "reviewed.external.jo.refusal.candidate.v0_1",
        candidateId:
          "albanian-jo-standalone-refusal-functional",
        candidateLanguage:
          "sq",
        displayForm:
          "JO standalone refusal candidate",
        sourceKind:
          "reviewed_dictionary_source",
        sourceStatus:
          "reviewed_accepted",
        embryo:
          "JO",
        isolatedStandaloneForm:
          "jo",
        plainStandaloneGloss:
          "standalone refusal / explicit rejection",
        originClaim:
          false,
        historicalTransmissionClaim:
          false,
        winnerClaim:
          false,
        languageSuperiorityClaim:
          false,
        candidateTruthClaim:
          false,
        publicationEvidenceClaim:
          false,
        scientificEvidenceClaim:
          false,
        userDecisionPosture:
          "user_decides",
      });
    });

    it("preserves exact candidate-specific JO citation identity", () => {
      expect(
        proposedJoSourceRowDesignV0_1.externalCitations,
      ).toHaveLength(1);

      expect(
        proposedJoSourceRowDesignV0_1.externalCitations[0],
      ).toMatchObject({
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
        sourceDateOrVersion:
          "first publication 2024; source snapshot reviewed 2026-07-14",
        sourceUrlOrArchiveRef:
          JO_SOURCE_ROW_DESIGN_LOCATOR_V0_1,
        attestedForm:
          "jo",
        reviewedBy:
          "open-instrument-source-row-design-review",
        reviewedAt:
          "2026-07-14",
        sourceHashOrArchiveHash:
          JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1,
      });

      expect(
        proposedJoSourceRowDesignV0_1.externalCitations[0]
          .entryLocator,
      ).toContain("post ID 25210");

      expect(
        proposedJoSourceRowDesignV0_1.externalCitations[0]
          .attestedGrammarNote,
      ).toContain("classification Simplex");

      expect(
        proposedJoSourceRowDesignV0_1.externalCitations[0]
          .reviewNote,
      ).toContain("FGJSSH 745f.");
    });

    it("passes its candidate-specific design validator", () => {
      expect(
        validateProposedJoSourceRowDesignV0_1(
          proposedJoSourceRowDesignV0_1,
        ),
      ).toEqual({
        valid: true,
        reasons: [],
      });
    });

    it("is structurally ready under generic lexical-readiness machinery", () => {
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

    it("passes the generic citation-packaging checklist without gaining production status", () => {
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

    it("remains machine-unauthorized because its source ID is not admitted", () => {
      expect(
        isReviewedExternalLexiconSourceIdFunctionallyRuntimeAuthorizedV0_1(
          JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        ),
      ).toBe(false);

      const authorization =
        evaluateReviewedExternalLexiconFunctionalRuntimeAuthorizationV0_1(
          proposedJoSourceRowDesignV0_1,
        );

      expect(authorization).toMatchObject({
        sourceId:
          JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        candidateId:
          "albanian-jo-standalone-refusal-functional",
        authorized:
          false,
      });

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

      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1(),
      ).toHaveLength(3);

      expect(
        getReviewedExternalLexiconProductionSourceRowsV0_1().map(
          (row) => row.sourceId,
        ),
      ).toEqual([
        "reviewed.external.di.knowledge.candidate.v0_1",
        "reviewed.external.albanian-at.father.candidate.v0_1",
        "reviewed.external.gheg-da.damage.candidate.v0_1",
      ]);
    });

    it("is candidate-registered while remaining absent from authorization", () => {
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

    it("preserves exact-only operation and jo-only carrier proposals", () => {
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

      expect(
        proposedJoSourceRowDesignPolicyV0_1
          .crossOperatorNegativeControls,
      ).toEqual(["po", "da", "di"]);
    });

    it("preserves substring, prefix, suffix and separated-letter rejection controls", () => {
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

    it("rejects missing or wrong candidate-specific locator evidence", () => {
      const missingLocator = {
        ...proposedJoSourceRowDesignV0_1,
        externalCitations: [
          {
            ...proposedJoSourceRowDesignV0_1
              .externalCitations[0],
            sourceUrlOrArchiveRef: "",
            entryLocator: "",
          },
        ],
      } as unknown as
        ReviewedExternalLexiconCandidateSourceRowV0_1;

      const wrongLocator = {
        ...proposedJoSourceRowDesignV0_1,
        externalCitations: [
          {
            ...proposedJoSourceRowDesignV0_1
              .externalCitations[0],
            sourceUrlOrArchiveRef:
              "https://www.dpwa.gwi.uni-muenchen.de/dictionary/",
            entryLocator:
              "generic dictionary portal",
          },
        ],
      } as unknown as
        ReviewedExternalLexiconCandidateSourceRowV0_1;

      expect(
        validateProposedJoSourceRowDesignV0_1(
          missingLocator,
        ).reasons,
      ).toContain(
        "post_id_or_locator_mismatch",
      );

      expect(
        validateProposedJoSourceRowDesignV0_1(
          wrongLocator,
        ).reasons,
      ).toContain(
        "post_id_or_locator_mismatch",
      );
    });

    it("rejects wrong article identity and reconstructed substitution", () => {
      for (const sourceTitle of [
        "PO 2",
        "*SHTÚ",
        "TERR 1",
      ]) {
        const changed = {
          ...proposedJoSourceRowDesignV0_1,
          externalCitations: [
            {
              ...proposedJoSourceRowDesignV0_1
                .externalCitations[0],
              sourceTitle,
            },
          ],
        } as unknown as
          ReviewedExternalLexiconCandidateSourceRowV0_1;

        expect(
          validateProposedJoSourceRowDesignV0_1(
            changed,
          ).reasons,
        ).toContain("article_head_mismatch");
      }
    });

    it("rejects PO, DA and DI citation leakage", () => {
      for (const sourceUrlOrArchiveRef of [
        "https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=32319",
        "https://doi.org/10.3765/plsa.v8i1.5501",
        "https://en.wiktionary.org/wiki/di#Albanian",
      ]) {
        const changed = {
          ...proposedJoSourceRowDesignV0_1,
          externalCitations: [
            {
              ...proposedJoSourceRowDesignV0_1
                .externalCitations[0],
              sourceUrlOrArchiveRef,
            },
          ],
        } as unknown as
          ReviewedExternalLexiconCandidateSourceRowV0_1;

        expect(
          validateProposedJoSourceRowDesignV0_1(
            changed,
          ).reasons,
        ).toContain(
          "post_id_or_locator_mismatch",
        );
      }
    });

    it("rejects changed source snapshots", () => {
      const changed = {
        ...proposedJoSourceRowDesignV0_1,
        externalCitations: [
          {
            ...proposedJoSourceRowDesignV0_1
              .externalCitations[0],
            sourceHashOrArchiveHash:
              "changed-source-snapshot",
          },
        ],
      } as unknown as
        ReviewedExternalLexiconCandidateSourceRowV0_1;

      expect(
        validateProposedJoSourceRowDesignV0_1(
          changed,
        ).reasons,
      ).toContain("source_hash_mismatch");
    });

    it("rejects broader functional scope and unrelated attested forms", () => {
      const broadScope = {
        ...proposedJoSourceRowDesignV0_1,
        plainStandaloneGloss:
          "general sentence-level negation",
      } as unknown as
        ReviewedExternalLexiconCandidateSourceRowV0_1;

      const unrelatedForm = {
        ...proposedJoSourceRowDesignV0_1,
        externalCitations: [
          {
            ...proposedJoSourceRowDesignV0_1
              .externalCitations[0],
            attestedForm:
              "po",
          },
        ],
      } as unknown as
        ReviewedExternalLexiconCandidateSourceRowV0_1;

      expect(
        validateProposedJoSourceRowDesignV0_1(
          broadScope,
        ).reasons,
      ).toContain("bounded_gloss_mismatch");

      expect(
        validateProposedJoSourceRowDesignV0_1(
          unrelatedForm,
        ).reasons,
      ).toContain("attested_form_mismatch");
    });

    it("rejects every prohibited claim and preserves user decision", () => {
      for (const key of [
        "originClaim",
        "historicalTransmissionClaim",
        "winnerClaim",
        "languageSuperiorityClaim",
        "candidateTruthClaim",
        "publicationEvidenceClaim",
        "scientificEvidenceClaim",
      ] as const) {
        const changed = {
          ...proposedJoSourceRowDesignV0_1,
          [key]: true,
        } as unknown as
          ReviewedExternalLexiconCandidateSourceRowV0_1;

        expect(
          validateProposedJoSourceRowDesignV0_1(
            changed,
          ).valid,
        ).toBe(false);
      }

      const changedDecision = {
        ...proposedJoSourceRowDesignV0_1,
        userDecisionPosture:
          "model_decides",
      } as unknown as
        ReviewedExternalLexiconCandidateSourceRowV0_1;

      expect(
        validateProposedJoSourceRowDesignV0_1(
          changedDecision,
        ).reasons,
      ).toContain(
        "user_decision_posture_mismatch",
      );
    });

    it("allows only the later reviewed Stage-2 operation policy while profile and canon-lock owners remain absent", () => {
      expect(operationPolicySource).toContain(
        'sourceId: "reviewed.external.jo.refusal.candidate.v0_1"',
      );

      expect(operationPolicySource).toMatch(
        /embryo:\s*"JO"/,
      );

      expect(operationPolicySource).toContain(
        'allowedEvidenceOps: ["exact"]',
      );

      expect(operationPolicySource).toContain(
        'allowedEvidenceCarrierForms: ["jo"]',
      );

      expect(profileSource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(admissionSource).not.toContain(
        '"JO"',
      );
    });

    it("keeps every production and lifecycle boundary explicit", () => {
      expect(
        proposedJoSourceRowDesignPolicyV0_1,
      ).toMatchObject({
        packageStatus:
          "design_only",
        productionRegistryStatus:
          "not_registered",
        functionalRuntimeAuthorization:
          "not_authorized",
        productionMembership:
          "not_admitted",
        runtimeProjection:
          "not_projected",
        canonicalProfile:
          "not_registered",
        operationPolicy:
          "not_registered",
        carrierPolicy:
          "not_registered",
        liveSmoke:
          "not_registered",
        canonLockAdmission:
          "not_admitted",
        boundedFunctionalScope:
          "standalone_refusal_or_explicit_rejection",
      });
    });

    it("preserves every claim boundary", () => {
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
    });
  },
);
