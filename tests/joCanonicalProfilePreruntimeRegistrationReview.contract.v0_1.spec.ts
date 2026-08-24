import fs from "node:fs";

const REPORT =
  "docs/open-instrument/reports/jo-canonical-profile-preruntime-registration-review-v0.1.md";

const PROFILE =
  "src/shared/canonicalOperatorProfile.v0_1.ts";

const REGISTRY =
  "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts";

const POLICY =
  "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts";

const AUTHORIZATION =
  "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts";

const PROJECTION =
  "src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts";

const TARGET_FAMILY =
  "src/shared/canonicalOperatorReviewedTargetFamily.v0_1.ts";

const ADMISSION =
  "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts";

const report = fs.readFileSync(REPORT, "utf8");
const profileSource = fs.readFileSync(PROFILE, "utf8");
const registrySource = fs.readFileSync(REGISTRY, "utf8");
const policySource = fs.readFileSync(POLICY, "utf8");
const authorizationSource =
  fs.readFileSync(AUTHORIZATION, "utf8");
const projectionSource =
  fs.readFileSync(PROJECTION, "utf8");
const targetFamilySource =
  fs.readFileSync(TARGET_FAMILY, "utf8");
const admissionSource =
  fs.readFileSync(ADMISSION, "utf8");

const JO_SOURCE =
  "reviewed.external.jo.refusal.candidate.v0_1";

describe(
  "JO Stage 3 canonical-profile pre-runtime registration review v0.1",
  () => {
    it("accepts only the dedicated Stage-3 implementation lane", () => {
      expect(report).toContain(
        "JO_STAGE3_CANONICAL_PROFILE_PRERUNTIME_REVIEW_ACCEPTED_READY_FOR_IMPLEMENTATION",
      );

      expect(report).toContain(
        "JO_STAGE3_CANONICAL_PROFILE_PRERUNTIME_IMPLEMENTATION",
      );

      for (const forbidden of [
        "JO_PRODUCTION_MEMBERSHIP_IMPLEMENTATION",
        "JO_FUNCTIONAL_MACHINE_AUTHORIZATION",
        "JO_RUNTIME_PROJECTION_IMPLEMENTATION",
        "JO_TARGET_FAMILY_IMPLEMENTATION",
        "JO_PROFILE_BACKED_LIVE_SMOKE_REGISTRATION",
        "JO_RUNTIME_VERIFIED_TRANSITION",
        "JO_CANON_LOCK_IMPLEMENTATION",
      ]) {
        expect(report).toContain(forbidden);
      }

      expect(report).toContain(
        "No later JO stage is authorized by this review.",
      );
    });

    it("locks the exact Stage-3 JO profile metadata", () => {
      for (const marker of [
        "operator ID:\n  `JO`",
        "embryo:\n  `JO`",
        `source ID:\n  \`${JO_SOURCE}\``,
        "language:\n  `sq`",
        "standalone refusal / explicit rejection functional motivation",
        "reviewed evidence status:\n  `reviewed_functional`",
        "lifecycle:\n  `candidate`",
        "authorization scope:\n  `bounded_functional_lexical_projection`",
        "discovery scope:\n  `bounded_targets`",
        '`["jo"]`',
        '`["po", "da", "di", "major", "enjoy", "joke", "joint", "banjo", "judo"]`',
      ]) {
        expect(report).toContain(marker);
      }
    });

    it("selects candidate as the smallest existing pre-runtime lifecycle without inventing a state", () => {
      expect(report).toContain(
        "Stage 3 uses:\n\n`candidate`",
      );

      expect(report).toContain(
        "No new lifecycle value is authorized.",
      );

      expect(report).toContain(
        "using `functionally_ready`, `machine_authorized`, `production_member`,",
      );

      expect(report).toContain(
        "`runtime_verified` or `canon_locked` would claim a later transition",
      );
    });

    it("preserves a runtime-mature consumer view instead of directly appending JO to it", () => {
      expect(report).toContain(
        "must not directly append a pre-runtime JO profile to the existing",
      );

      expect(report).toContain(
        "preserve `canonicalOperatorProfilesV0_1` as the runtime-mature derived view",
      );

      expect(report).toContain(
        "DA, DI and AT remain the only members of that runtime-mature view",
      );

      expect(report).toContain(
        "must not maintain separate copied DA/DI/AT/JO profile",
      );
    });

    it("records the current Stage-2 machine truth before implementation", () => {
      expect(registrySource).toContain(JO_SOURCE);

      expect(policySource).toContain(JO_SOURCE);
      expect(policySource).toContain(
        'embryo: "JO"',
      );
      expect(policySource).toContain(
        'allowedEvidenceOps: ["exact"]',
      );
      expect(policySource).toContain(
        'allowedEvidenceCarrierForms: ["jo"]',
      );

      expect(profileSource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(authorizationSource).not.toContain(
        JO_SOURCE,
      );

      expect(projectionSource).not.toContain(
        JO_SOURCE,
      );

      expect(targetFamilySource).not.toMatch(
        /operatorId:\s*"JO"/,
      );

      expect(admissionSource).not.toContain(
        '"JO"',
      );
    });

    it("keeps JO outside production membership at the review stage", () => {
      const productionSet =
        registrySource.match(
          /const PRODUCTION_SOURCE_ROW_IDS_V0_1[\s\S]*?new Set<string>\(\[([\s\S]*?)\]\);/,
        );

      expect(productionSet).not.toBeNull();

      expect(
        productionSet?.[1] ?? "",
      ).not.toContain(JO_SOURCE);
    });

    it("authorizes exactly one Stage-3 production owner", () => {
      expect(report).toContain(
        "Only this production owner is authorized for Stage 3:",
      );

      expect(report).toContain(
        "`src/shared/canonicalOperatorProfile.v0_1.ts`",
      );

      for (const forbiddenOwner of [
        "src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1.ts",
        "src/shared/reviewedExternalLexiconFunctionalRuntimeAuthorization.v0_1.ts",
        "src/shared/reviewedExternalLexiconRuntimeProjection.v0_1.ts",
        "src/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1.ts",
        "src/shared/canonicalOperatorReviewedTargetFamily.v0_1.ts",
        "src/shared/canonicalOperatorCanonLockAdmission.v0_1.ts",
        "src/shared/canonicalOperatorDiscovery.v0_1.ts",
        "src/shared/deepRoot.rootMap.builder.v1.ts",
        "scripts/open-instrument/canonical-operator-live-smoke-cases.v0.1.ts",
        "scripts/open-instrument/live-smoke.v0.1.ts",
      ]) {
        expect(report).toContain(forbiddenOwner);
      }

      expect(report).toContain(
        "Stage 3 must not change:",
      );
    });

    it("locks the exact post-Stage-3 non-promotion state", () => {
      for (const marker of [
        "CANDIDATE_REGISTERED",
        "OPERATION_REGISTERED",
        "CARRIER_REGISTERED",
        "PROFILE_REGISTERED",
        "NOT_ADMITTED",
        "NOT_AUTHORIZED",
        "NOT_PROJECTED",
        "NOT_RUNTIME_MATURE",
        "NOT_LIVE_SMOKE_REGISTERED",
        "NOT_CANON_LOCK_ADMITTED",
      ]) {
        expect(report).toContain(`\`${marker}\``);
      }
    });

    it("preserves Stage-1 and Stage-2 rollback independence", () => {
      expect(report).toContain(
        "Stage-1 JO candidate row",
      );

      expect(report).toContain(
        "Stage-2 JO operation policy",
      );

      expect(report).toContain(
        "Stage-2 JO carrier policy",
      );
    });

    it("preserves claim boundaries and user-decision posture", () => {
      for (const marker of [
        "historical origin",
        "historical transmission",
        "borrowing direction",
        "linguistic ownership",
        "language superiority",
        "candidate truth",
        "scientific proof",
        "publication evidence",
        "universal negation ownership",
        "unrestricted negative polarity",
        "PO/JO polarity ownership",
        "single etymological winner",
        "`user_decides`",
      ]) {
        expect(report).toContain(marker);
      }
    });
  },
);
