import fs from "node:fs";
import path from "node:path";

import {
  JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1,
  JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
  proposedJoSourceRowDesignPolicyV0_1,
  proposedJoSourceRowDesignV0_1,
} from "./fixtures/joSourceRowDesignPackage.v0_1";

const root = process.cwd();

const read = (relativePath: string): string =>
  fs.readFileSync(
    path.join(root, relativePath),
    "utf8",
  );

const report = read(
  "docs/open-instrument/reports/jo-source-row-transition-proposal-v0.1.md",
);

const registrySource = read(
  "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
);

const authorizationSource = read(
  "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
);

const projectionSource = read(
  "src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts",
);

const operationPolicySource = read(
  "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
);

const profileSource = read(
  "src/shared/canonicalOperatorProfile.v0_1.ts",
);

const admissionSource = read(
  "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
);

const rootMapSource = read(
  "src/shared/deepRoot.rootMap.builder.v1.ts",
);

const liveSmokeCaseSource = read(
  "scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts",
);

const liveSmokeRunnerSource = read(
  "scripts/open-instrument/live-smoke.v0.1.ts",
);

describe(
  "dedicated JO source-row transition proposal v0.1",
  () => {
    it("records a design-only transition proposal", () => {
      expect(report).toContain(
        "`TRANSITION_PROPOSAL_DESIGN_ONLY`",
      );

      expect(report).toContain(
        "`DEDICATED_JO_SOURCE_ROW_TRANSITION_PROPOSAL_DESIGNED`",
      );

      expect(report).toContain(
        "`JO_CANDIDATE_REGISTRY_TRANSITION_REVIEW`",
      );

      expect(report).toContain(
        "`JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`",
      );

      expect(report).toContain(
        "`JO_CANON_LOCK_IMPLEMENTATION`",
      );
    });

    it("preserves the exact accepted JO package identity", () => {
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
        userDecisionPosture:
          "user_decides",
      });

      expect(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      ).toBe(
        "reviewed.external.jo.refusal.candidate.v0_1",
      );

      expect(
        JO_SOURCE_ROW_DESIGN_ARTICLE_SHA256_V0_1,
      ).toBe(
        "f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e",
      );
    });

    it("preserves exact-only operation and jo-only carrier", () => {
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

    it("preserves all accepted negative controls", () => {
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

    it("records the exact shared architecture owners", () => {
      const requiredOwners = [
        "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
        "src/shared/reviewedExternalLexiconFunctionalReadiness.v0_1.ts",
        "src/shared/reviewedExternalLexiconSourceRowPromotionChecklist.v0_1.ts",
        "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
        "src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts",
        "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
        "src/shared/canonicalOperatorProfile.v0_1.ts",
        "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
        "src/shared/deepRoot.rootMap.builder.v1.ts",
        "scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts",
        "scripts/open-instrument/live-smoke.v0.1.ts",
        "tests/openInstrument.canonicalOperatorLiveSmoke.profileDriven.v0_1.spec.ts",
      ];

      for (const owner of requiredOwners) {
        expect(report).toContain(`\`${owner}\``);
      }
    });

    it("defines the complete dependency order", () => {
      expect(report).toContain(
        "1. accepted source package;",
      );

      expect(report).toContain(
        "2. candidate-registry placement;",
      );

      expect(report).toContain(
        "3. operation and carrier policy;",
      );

      expect(report).toContain(
        "4. pre-runtime canonical profile metadata;",
      );

      expect(report).toContain(
        "5. production-membership review;",
      );

      expect(report).toContain(
        "6. functional machine authorization;",
      );

      expect(report).toContain(
        "7. generic runtime projection proof;",
      );

      expect(report).toContain(
        "8. shared RootMap proof;",
      );

      expect(report).toContain(
        "9. profile-backed live smoke;",
      );

      expect(report).toContain(
        "10. runtime-verified lifecycle review;",
      );

      expect(report).toContain(
        "11. canon-lock admission review.",
      );
    });

    it("keeps candidate registration separate from production", () => {
      expect(report).toContain(
        "### Stage 1 — candidate-registry placement",
      );

      expect(report).toContain(
        "`CANDIDATE_REGISTERED`",
      );

      expect(report).toContain(
        "`NOT_ADMITTED`",
      );

      expect(report).toContain(
        "`NOT_AUTHORIZED`",
      );

      expect(report).toContain(
        "`NOT_PROJECTED`",
      );
    });

    it("requires policy registration before runtime authorization", () => {
      expect(report).toContain(
        "### Stage 2 — operation and carrier policy registration",
      );

      expect(report).toContain(
        "allowed operation:\n  `exact`",
      );

      expect(report).toContain(
        "allowed carrier:\n  `jo`",
      );

      expect(report.indexOf(
        "### Stage 2 — operation and carrier policy registration",
      )).toBeLessThan(
        report.indexOf(
          "### Stage 5 — functional machine authorization",
        ),
      );
    });

    it("keeps profile lifecycle below runtime maturity before proof", () => {
      expect(report).toContain(
        "### Stage 3 — canonical profile pre-runtime registration",
      );

      expect(report).toContain(
        "Pre-runtime lifecycle must not be:",
      );

      expect(report).toContain(
        "`runtime_verified`",
      );

      expect(report).toContain(
        "`canon_locked`",
      );

      expect(report).toContain(
        "No new lifecycle label may be invented",
      );
    });

    it("requires explicit production membership and authorization", () => {
      expect(report).toContain(
        "### Stage 4 — production membership",
      );

      expect(report).toContain(
        "### Stage 5 — functional machine authorization",
      );

      expect(report).toContain(
        "`bounded_functional_lexical_projection`",
      );

      expect(report).toContain(
        "Stage 4 alone must not be treated as sufficient runtime authorization.",
      );
    });

    it("requires generic projection and forbids a bespoke JO projector", () => {
      expect(report).toContain(
        "### Stage 6 — generic runtime projection eligibility",
      );

      expect(report).toContain(
        "projection is `null`",
      );

      expect(report).toContain(
        "A bespoke JO projector branch is prohibited.",
      );

      expect(projectionSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );
    });

    it("requires shared RootMap consumption without JO branching", () => {
      expect(report).toContain(
        "### Stage 7 — shared RootMap consumption",
      );

      expect(report).toContain(
        "no bespoke JO branch should be required",
      );

      expect(rootMapSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );
    });

    it("requires profile-backed live smoke", () => {
      expect(report).toContain(
        "### Stage 8 — profile-backed live-smoke verification",
      );

      expect(report).toContain(
        "`npm run open-instrument:live-smoke -- --skip-focused-tests`",
      );

      expect(report).toContain(
        "no bespoke JO smoke runner",
      );

      expect(liveSmokeCaseSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );

      expect(liveSmokeRunnerSource).not.toContain(
        JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
      );
    });

    it("keeps runtime verification and canon lock as separate transitions", () => {
      expect(report).toContain(
        "### Stage 9 — runtime-verified lifecycle transition",
      );

      expect(report).toContain(
        "This transition belongs in a separate lifecycle review.",
      );

      expect(report).toContain(
        "### Stage 10 — canon-lock admission",
      );

      expect(report).toContain(
        "The first JO implementation PR must not canon-lock JO.",
      );
    });

    it("defines reverse-order rollback", () => {
      expect(report).toContain(
        "Rollback must proceed in reverse dependency order:",
      );

      expect(report).toContain(
        "1. remove canon-lock admission;",
      );

      expect(report).toContain(
        "8. remove candidate-registry row.",
      );

      expect(report).toContain(
        "generic JO runtime projection must be null",
      );
    });

    it("forbids bespoke route, RootMap, UI, projector and smoke branches", () => {
      const forbiddenShortcuts = [
        "a bespoke JO RootMap branch",
        "a bespoke JO analyze-v1 branch",
        "a bespoke JO UI branch",
        "a bespoke JO runtime projector",
        "a bespoke JO live-smoke runner",
      ];

      for (const shortcut of forbiddenShortcuts) {
        expect(report).toContain(shortcut);
      }
    });

    it("leaves JO absent from every current production owner", () => {
      const currentOwners = [
        registrySource,
        authorizationSource,
        projectionSource,
        operationPolicySource,
        profileSource,
        admissionSource,
        rootMapSource,
      ];

      for (const source of currentOwners) {
        expect(source).not.toContain(
          JO_SOURCE_ROW_DESIGN_SOURCE_ID_V0_1,
        );
      }

      expect(operationPolicySource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(profileSource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(admissionSource).not.toMatch(
        /operatorId:\s*"JO"/,
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
