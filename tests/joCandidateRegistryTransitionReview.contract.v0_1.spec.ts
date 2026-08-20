import { readFileSync } from "node:fs";

import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

import {
  proposedJoSourceRowDesignV0_1,
  proposedJoSourceRowDesignPolicyV0_1,
  validateProposedJoSourceRowDesignV0_1,
} from "./fixtures/joSourceRowDesignPackage.v0_1";

describe("JO candidate registry transition review v0.1", () => {
  const review = readFileSync(
    "docs/open-instrument/reports/jo-candidate-registry-transition-review-v0.1.md",
    "utf8",
  );

  const proposal = readFileSync(
    "docs/open-instrument/reports/jo-source-row-transition-proposal-v0.1.md",
    "utf8",
  );

  const registrySource = readFileSync(
    "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
    "utf8",
  );

  const authorizationSource = readFileSync(
    "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
    "utf8",
  );

  const policySource = readFileSync(
    "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
    "utf8",
  );

  const profileSource = readFileSync(
    "src/shared/canonicalOperatorProfile.v0_1.ts",
    "utf8",
  );

  const admissionSource = readFileSync(
    "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
    "utf8",
  );

  it("accepts the proposal-selected review lane", () => {
    expect(proposal).toContain(
      "`JO_CANDIDATE_REGISTRY_TRANSITION_REVIEW`",
    );

    expect(review).toContain(
      "`JO_CANDIDATE_REGISTRY_TRANSITION_REVIEW_ACCEPTED`",
    );

    expect(review).toContain(
      "`JO_CANDIDATE_REGISTRY_TRANSITION_IMPLEMENTATION`",
    );
  });

  it("locks the exact accepted JO source identity", () => {
    expect(proposedJoSourceRowDesignV0_1).toMatchObject({
      sourceId:
        "reviewed.external.jo.refusal.candidate.v0_1",
      candidateId:
        "albanian-jo-standalone-refusal-functional",
      candidateLanguage: "sq",
      embryo: "JO",
      isolatedStandaloneForm: "jo",
      plainStandaloneGloss:
        "standalone refusal / explicit rejection",
      userDecisionPosture: "user_decides",
    });

    expect(
      proposedJoSourceRowDesignV0_1.externalCitations[0],
    ).toMatchObject({
      sourceTitle: "JO part.",
      sourceUrlOrArchiveRef:
        "https://www.dpwa.gwi.uni-muenchen.de/dictionary/?lemmaid=25210",
      sourceHashOrArchiveHash:
        "f482a54f8f5648803b1eb7c91bed1b2013becf894e4d32f80e06f8f134a66a9e",
      attestedForm: "jo",
    });

    expect(
      proposedJoSourceRowDesignV0_1.externalCitations[0]
        .entryLocator,
    ).toContain("post ID 25210");

    expect(
      validateProposedJoSourceRowDesignV0_1(
        proposedJoSourceRowDesignV0_1,
      ),
    ).toEqual({
      valid: true,
      reasons: [],
    });
  });

  it("records the narrow proposed functional and policy boundary without implementing it", () => {
    expect(
      proposedJoSourceRowDesignPolicyV0_1,
    ).toMatchObject({
      packageStatus: "design_only",
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
      proposedEvidenceOperations: ["exact"],
      proposedEvidenceCarrierForms: ["jo"],
      proposedPositiveProofWords: ["jo"],
      crossOperatorNegativeControls: [
        "po",
        "da",
        "di",
      ],
      collisionNegativeControls: [
        "major",
        "enjoy",
        "joke",
        "joint",
        "banjo",
        "judo",
      ],
    });
  });

  it("records the current main baseline as DA DI AT while JO remains absent", () => {
    expect(
      reviewedExternalLexiconSourceRowCandidateRegistryV0_1.map(
        (row) => row.sourceId,
      ),
    ).toEqual([
      "reviewed.external.di.knowledge.candidate.v0_1",
      "reviewed.external.albanian-at.father.candidate.v0_1",
      "reviewed.external.gheg-da.damage.candidate.v0_1",
    ]);

    expect(
      getReviewedExternalLexiconProductionSourceRowsV0_1().map(
        (row) => row.sourceId,
      ),
    ).toEqual([
      "reviewed.external.di.knowledge.candidate.v0_1",
      "reviewed.external.albanian-at.father.candidate.v0_1",
      "reviewed.external.gheg-da.damage.candidate.v0_1",
    ]);

    expect(registrySource).not.toContain(
      "reviewed.external.jo.refusal.candidate.v0_1",
    );

    expect(profileSource).not.toMatch(
      /operatorId:\s*"JO"/,
    );

    expect(admissionSource).not.toContain(
      "\"JO\"",
    );
  });

  it("authorizes candidate-registry placement only", () => {
    for (const marker of [
      "candidate-registry placement",
      "reviewedExternalLexiconSourceRowCandidateRegistryV0_1",
      "Production code must not import",
      "CANDIDATE_REGISTERED",
      "NOT_ADMITTED",
      "NOT_AUTHORIZED",
      "NOT_PROJECTED",
      "NOT_PROFILED",
      "NOT_OPERATION_REGISTERED",
      "NOT_CARRIER_REGISTERED",
      "NOT_LIVE_SMOKE_REGISTERED",
      "NOT_CANON_LOCK_ADMITTED",
    ]) {
      expect(review).toContain(marker);
    }

    expect(review).toContain(
      "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
    );
  });

  it("keeps production runtime policy profile and canon stages unauthorized", () => {
    for (const marker of [
      "`JO_OPERATION_OR_CARRIER_POLICY_IMPLEMENTATION`",
      "`JO_CANONICAL_PROFILE_IMPLEMENTATION`",
      "`JO_PRODUCTION_REGISTRY_OR_RUNTIME_IMPLEMENTATION`",
      "`JO_RUNTIME_VERIFIED_TRANSITION`",
      "`JO_CANON_LOCK_IMPLEMENTATION`",
    ]) {
      expect(review).toContain(marker);
    }

    expect(authorizationSource).not.toContain(
      "reviewed.external.jo.refusal.candidate.v0_1",
    );

    expect(policySource).not.toMatch(
      /operatorId:\s*"JO"/,
    );
  });

  it("keeps JO out of production membership during the review lane", () => {
    expect(registrySource).not.toMatch(
      /PRODUCTION_SOURCE_ROW_IDS_V0_1[\s\S]*reviewed\.external\.jo\.refusal\.candidate\.v0_1/,
    );

    expect(review).toContain(
      "Candidate registration is not production admission.",
    );

    expect(review).toContain(
      "Candidate registration is not runtime authorization.",
    );
  });

  it("preserves fail-closed claim boundaries and user decision posture", () => {
    expect(proposedJoSourceRowDesignV0_1).toMatchObject({
      originClaim: false,
      historicalTransmissionClaim: false,
      winnerClaim: false,
      languageSuperiorityClaim: false,
      candidateTruthClaim: false,
      publicationEvidenceClaim: false,
      scientificEvidenceClaim: false,
      userDecisionPosture: "user_decides",
    });

    for (const marker of [
      "historical origin",
      "historical transmission",
      "borrowing direction",
      "linguistic ownership",
      "winner status",
      "language superiority",
      "candidate truth",
      "scientific proof",
      "publication-grade Open Instrument proof",
      "ownership of general grammatical negation",
      "`user_decides`",
    ]) {
      expect(review).toContain(marker);
    }
  });

  it("locks the small Stage 1 rollback boundary", () => {
    expect(review).toContain(
      "remove only the JO candidate-registry row",
    );

    expect(review).toContain(
      "restore candidate-registry membership to its prior DA/DI/AT state",
    );
  });
});
