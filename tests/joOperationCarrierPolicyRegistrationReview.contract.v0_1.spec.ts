import { readFileSync } from "node:fs";

const REVIEW =
  "docs/open-instrument/reports/jo-operation-carrier-policy-registration-review-v0.1.md";

const POLICY =
  "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts";

const POLICY_TEST =
  "tests/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.spec.ts";

const REGISTRY =
  "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts";

const AUTHORIZATION =
  "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts";

const PROFILE =
  "src/shared/canonicalOperatorProfile.v0_1.ts";

const ADMISSION =
  "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts";

const JO_SOURCE =
  "reviewed.external.jo.refusal.candidate.v0_1";

const review = readFileSync(REVIEW, "utf8");
const policySource = readFileSync(POLICY, "utf8");
const policyTestSource = readFileSync(POLICY_TEST, "utf8");
const registrySource = readFileSync(REGISTRY, "utf8");
const authorizationSource =
  readFileSync(AUTHORIZATION, "utf8");
const profileSource = readFileSync(PROFILE, "utf8");
const admissionSource = readFileSync(ADMISSION, "utf8");

describe("JO Stage 2 operation/carrier policy registration review v0.1", () => {
  it("accepts the Stage-2 review and only the next implementation task", () => {
    expect(review).toContain(
      "JO_STAGE2_OPERATION_CARRIER_POLICY_REVIEW_ACCEPTED_READY_FOR_IMPLEMENTATION",
    );

    expect(review).toContain(
      "`JO_OPERATION_OR_CARRIER_POLICY_IMPLEMENTATION`",
    );

    expect(review).toContain(
      "No later JO transition is authorized by this review.",
    );
  });

  it("locks the exact JO operation and carrier policy", () => {
    for (const marker of [
      "`reviewed.external.jo.refusal.candidate.v0_1`",
      "`JO`",
      '`["exact"]`',
      '`["jo"]`',
      "`standalone_refusal_or_explicit_rejection`",
    ]) {
      expect(review).toContain(marker);
    }
  });

  it("locks the required positive and negative controls", () => {
    expect(review).toContain(
      "The required positive control is:",
    );
    expect(review).toContain("`jo`");

    for (const negative of [
      "`po`",
      "`da`",
      "`di`",
      "`major`",
      "`enjoy`",
      "`joke`",
      "`joint`",
      "`banjo`",
      "`judo`",
    ]) {
      expect(review).toContain(negative);
    }
  });

  it("locks all required fail-closed policy rejection classes", () => {
    for (const marker of [
      "prefix extraction",
      "suffix extraction",
      "substring extraction",
      "transformed carrier",
      "reconstructed carrier",
      "missing carrier",
      "unsupported operation",
      "embryo mismatch",
      "missing policy",
    ]) {
      expect(review).toContain(marker);
    }
  });

  it("authorizes only the shared operation/carrier production owner", () => {
    expect(review).toContain(
      "`src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts`",
    );

    for (const forbidden of [
      "`src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts`",
      "`src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts`",
      "`src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts`",
      "`src/shared/canonicalOperatorProfile.v0_1.ts`",
      "`src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts`",
      "`src/shared/canonicalOperatorReviewedTargetFamily.v0_1.ts`",
      "`src/shared/canonicalOperatorDiscovery.v0_1.ts`",
      "`src/shared/deepRoot.rootMap.builder.v1.ts`",
      "`scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts`",
      "`scripts/open-instrument/live-smoke.v0.1.ts`",
      "`app/api/analyze-v1`",
    ]) {
      expect(review).toContain(forbidden);
    }
  });

  it("records the current Stage-1 machine state without implementing Stage 2 in the review PR", () => {
    expect(registrySource).toContain(JO_SOURCE);

    const productionSet =
      registrySource.match(
        /const PRODUCTION_SOURCE_ROW_IDS_V0_1 = new Set<string>\(\[([\s\S]*?)\]\);/,
      )?.[1] ?? "";

    expect(productionSet).not.toContain(JO_SOURCE);

    expect(policySource).not.toContain(JO_SOURCE);
    expect(authorizationSource).not.toContain(JO_SOURCE);
    expect(profileSource).not.toMatch(
      /operatorId:\s*"JO"/,
    );
    expect(admissionSource).not.toContain('"JO"');

    for (const marker of [
      "`CANDIDATE_REGISTERED`",
      "`NOT_ADMITTED`",
      "`NOT_AUTHORIZED`",
      "`NOT_PROJECTED`",
      "`NOT_PROFILED`",
      "`NOT_OPERATION_REGISTERED`",
      "`NOT_CARRIER_REGISTERED`",
      "`NOT_LIVE_SMOKE_REGISTERED`",
      "`NOT_CANON_LOCK_ADMITTED`",
    ]) {
      expect(review).toContain(marker);
    }
  });

  it("explicitly reviews the production-row count coupling before implementation", () => {
    expect(policyTestSource).toContain(
      "toHaveLength(productionRows.length)",
    );

    for (const marker of [
      "Shared policy registry contract correction",
      "every production source row has exactly one shared operation/carrier policy",
      "an explicitly reviewed candidate-stage policy may exist before production",
      "admission when a dedicated reviewed transition authorizes it",
      "JO's Stage-2 policy must appear exactly once",
      "JO must remain outside production membership",
      "must not solve this by admitting JO to production early",
    ]) {
      expect(review).toContain(marker);
    }
  });

  it("preserves historical records while permitting minimal stale-current-state test corrections", () => {
    expect(review).toContain(
      "Historical Stage-1 reports and proposal-state tables remain historical records",
    );

    expect(review).toContain(
      "Historical reports must not be rewritten to pretend Stage 2 existed earlier.",
    );

    for (const file of [
      "`tests/joSourceRowDesignPackage.contract.v0_1.spec.ts`",
      "`tests/joSourceRowDesignPackageAcceptanceReview.contract.v0_1.spec.ts`",
      "`tests/joThirdOperatorScopeOperationCarrierControlMatrix.contract.v0_1.spec.ts`",
      "`tests/joThirdOperatorSourceReadinessDecision.contract.v0_1.spec.ts`",
      "`tests/joCandidateRegistryTransitionReview.contract.v0_1.spec.ts`",
      "`tests/joSourceRowTransitionProposal.contract.v0_1.spec.ts`",
    ]) {
      expect(review).toContain(file);
    }
  });

  it("locks the exact post-Stage-2 machine boundary", () => {
    for (const marker of [
      "`CANDIDATE_REGISTERED`",
      "`OPERATION_REGISTERED`",
      "`CARRIER_REGISTERED`",
      "`NOT_ADMITTED`",
      "`NOT_AUTHORIZED`",
      "`NOT_PROJECTED`",
      "`NOT_PROFILED`",
      "`NOT_LIVE_SMOKE_REGISTERED`",
      "`NOT_CANON_LOCK_ADMITTED`",
    ]) {
      expect(review).toContain(marker);
    }
  });

  it("preserves claim boundaries and user decision posture", () => {
    for (const marker of [
      "historical origin",
      "historical transmission",
      "borrowing direction",
      "linguistic ownership",
      "winner status",
      "language superiority",
      "candidate truth",
      "general sentence-level negation ownership",
      "unrestricted negative polarity",
      "PO/JO conceptual-polarity ownership",
      "`user_decides`",
    ]) {
      expect(review).toContain(marker);
    }
  });

  it("keeps rollback limited to Stage 2", () => {
    expect(review).toContain(
      "remove only the JO operation/carrier policy row",
    );
    expect(review).toContain(
      "leave the accepted Stage-1 JO candidate row intact",
    );
  });
});
