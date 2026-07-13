import {
  evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1,
  getReviewedExternalLexiconEvidenceOperationPolicyV0_1,
  reviewedExternalLexiconEvidenceOperationPoliciesV0_1,
} from "@/shared/reviewedExternalLexiconEvidenceOperationPolicy.v0_1";

import {
  getReviewedExternalLexiconProductionSourceRowsV0_1,
} from "@/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";

const DA_SOURCE =
  "reviewed.external.gheg-da.damage.candidate.v0_1";

const DI_SOURCE =
  "reviewed.external.di.knowledge.candidate.v0_1";

describe("reviewed external lexicon evidence operation policy v0.1", () => {
  it("covers every production source row exactly once", () => {
    const productionRows =
      getReviewedExternalLexiconProductionSourceRowsV0_1();

    expect(
      reviewedExternalLexiconEvidenceOperationPoliciesV0_1,
    ).toHaveLength(productionRows.length);

    for (const row of productionRows) {
      const matches =
        reviewedExternalLexiconEvidenceOperationPoliciesV0_1.filter(
          (policy) => policy.sourceId === row.sourceId,
        );

      expect(matches).toHaveLength(1);
      expect(matches[0].embryo).toBe(row.embryo);
    }
  });

  it("allows exact DA evidence only", () => {
    expect(
      getReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        DA_SOURCE,
      ),
    ).toMatchObject({
      sourceId: DA_SOURCE,
      embryo: "DA",
      allowedEvidenceOps: ["exact"],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: DA_SOURCE,
          embryo: "DA",
          ops: ["exact"],
          segment: "da",
          carrierForm: "da",
        },
      ),
    ).toMatchObject({
      allowed: true,
      effectiveOps: ["exact"],
      reasons: [],
    });

    for (const operation of [
      "final_swap",
      "vowel_swap",
    ]) {
      expect(
        evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
          {
            sourceId: DA_SOURCE,
            embryo: "DA",
            ops: [operation],
            segment: "de",
            carrierForm: "da",
          },
        ),
      ).toMatchObject({
        allowed: false,
        reasons: ["operation_not_allowed"],
      });
    }
  });

  it("treats an empty operation list as exact only when segment and carrier form are identical", () => {
    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: DA_SOURCE,
          embryo: "DA",
          ops: [],
          segment: "da",
          carrierForm: "da",
        },
      ),
    ).toMatchObject({
      allowed: true,
      effectiveOps: ["exact"],
      reasons: [],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: DA_SOURCE,
          embryo: "DA",
          ops: [],
          segment: "de",
          carrierForm: "da",
        },
      ),
    ).toMatchObject({
      allowed: false,
      effectiveOps: [],
      reasons: ["operation_missing"],
    });
  });

  it("allows DI y_to_i while remaining fail closed", () => {
    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: DI_SOURCE,
          embryo: "DI",
          ops: ["y_to_i"],
          segment: "dy",
          carrierForm: "di",
        },
      ),
    ).toMatchObject({
      allowed: true,
      effectiveOps: ["y_to_i"],
      reasons: [],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: "reviewed.external.unknown.v0_1",
          embryo: "UNKNOWN",
          ops: ["exact"],
          segment: "x",
          carrierForm: "x",
        },
      ),
    ).toMatchObject({
      allowed: false,
      reasons: ["policy_missing"],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: DA_SOURCE,
          embryo: "DI",
          ops: ["exact"],
          segment: "da",
          carrierForm: "da",
        },
      ),
    ).toMatchObject({
      allowed: false,
      reasons: ["policy_embryo_mismatch"],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: DA_SOURCE,
          embryo: "DA",
          ops: ["not_a_real_operation"],
          segment: "da",
          carrierForm: "da",
        },
      ),
    ).toMatchObject({
      allowed: false,
      reasons: ["operation_unsupported"],
    });
  });
});
