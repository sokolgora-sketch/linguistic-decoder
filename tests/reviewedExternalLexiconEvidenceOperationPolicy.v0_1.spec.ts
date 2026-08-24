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

const JO_SOURCE =
  "reviewed.external.jo.refusal.candidate.v0_1";

describe("reviewed external lexicon evidence operation policy v0.1", () => {
  it("covers every production source row exactly once while allowing only the reviewed JO Stage-2 pre-production policy", () => {
    const productionRows =
      getReviewedExternalLexiconProductionSourceRowsV0_1();

    for (const row of productionRows) {
      const matches =
        reviewedExternalLexiconEvidenceOperationPoliciesV0_1.filter(
          (policy) => policy.sourceId === row.sourceId,
        );

      expect(matches).toHaveLength(1);
      expect(matches[0].embryo).toBe(row.embryo);
      expect(
        matches[0].allowedEvidenceCarrierForms,
      ).toContain(row.isolatedStandaloneForm);
    }

    expect(
      productionRows.map((row) => row.sourceId),
    ).not.toContain(JO_SOURCE);

    const joPolicies =
      reviewedExternalLexiconEvidenceOperationPoliciesV0_1.filter(
        (policy) => policy.sourceId === JO_SOURCE,
      );

    expect(joPolicies).toHaveLength(1);
    expect(joPolicies[0]).toMatchObject({
      sourceId: JO_SOURCE,
      embryo: "JO",
      allowedEvidenceOps: ["exact"],
      allowedEvidenceCarrierForms: ["jo"],
    });

    const expectedPolicySourceIds = [
      ...productionRows.map((row) => row.sourceId),
      JO_SOURCE,
    ].sort();

    const actualPolicySourceIds =
      reviewedExternalLexiconEvidenceOperationPoliciesV0_1
        .map((policy) => policy.sourceId)
        .slice()
        .sort();

    expect(actualPolicySourceIds).toEqual(
      expectedPolicySourceIds,
    );
  });

  it("registers JO exact-only operation and jo-only carrier policy", () => {
    expect(
      getReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        JO_SOURCE,
      ),
    ).toMatchObject({
      sourceId: JO_SOURCE,
      embryo: "JO",
      allowedEvidenceOps: ["exact"],
      allowedEvidenceCarrierForms: ["jo"],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: JO_SOURCE,
          embryo: "JO",
          ops: ["exact"],
          segment: "jo",
          carrierForm: "jo",
        },
      ),
    ).toMatchObject({
      allowed: true,
      effectiveOps: ["exact"],
      effectiveCarrierForm: "jo",
      reasons: [],
    });

    for (const carrierForm of [
      "po",
      "da",
      "di",
      "major",
      "enjoy",
      "joke",
      "joint",
      "banjo",
      "judo",
      "*jo",
    ]) {
      expect(
        evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
          {
            sourceId: JO_SOURCE,
            embryo: "JO",
            ops: ["exact"],
            segment: carrierForm,
            carrierForm,
          },
        ),
      ).toMatchObject({
        allowed: false,
        effectiveOps: ["exact"],
        effectiveCarrierForm: carrierForm,
        reasons: ["carrier_form_not_allowed"],
      });
    }

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: JO_SOURCE,
          embryo: "JO",
          ops: ["vowel_swap"],
          segment: "jo",
          carrierForm: "jo",
        },
      ),
    ).toMatchObject({
      allowed: false,
      reasons: ["operation_not_allowed"],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: JO_SOURCE,
          embryo: "JO",
          ops: [],
          segment: "j",
          carrierForm: "jo",
        },
      ),
    ).toMatchObject({
      allowed: false,
      effectiveOps: [],
      effectiveCarrierForm: "jo",
      reasons: ["operation_missing"],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: JO_SOURCE,
          embryo: "JO",
          ops: ["exact"],
          segment: "jo",
          carrierForm: "",
        },
      ),
    ).toMatchObject({
      allowed: false,
      effectiveOps: ["exact"],
      effectiveCarrierForm: null,
      reasons: ["carrier_form_missing"],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: JO_SOURCE,
          embryo: "DA",
          ops: ["exact"],
          segment: "jo",
          carrierForm: "jo",
        },
      ),
    ).toMatchObject({
      allowed: false,
      reasons: ["policy_embryo_mismatch"],
    });
  });

  it("allows exact DA evidence only through carrier da", () => {
    expect(
      getReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        DA_SOURCE,
      ),
    ).toMatchObject({
      sourceId: DA_SOURCE,
      embryo: "DA",
      allowedEvidenceOps: ["exact"],
      allowedEvidenceCarrierForms: ["da"],
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
      effectiveCarrierForm: "da",
      reasons: [],
    });

    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: DA_SOURCE,
          embryo: "DA",
          ops: ["exact"],
          segment: "daj",
          carrierForm: "daj",
        },
      ),
    ).toMatchObject({
      allowed: false,
      effectiveOps: ["exact"],
      effectiveCarrierForm: "daj",
      reasons: ["carrier_form_not_allowed"],
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
      effectiveCarrierForm: "da",
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
      effectiveCarrierForm: "da",
      reasons: ["operation_missing"],
    });
  });

  it("allows DI exact and y_to_i only through reviewed carrier di", () => {
    expect(
      getReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        DI_SOURCE,
      ),
    ).toMatchObject({
      sourceId: DI_SOURCE,
      embryo: "DI",
      allowedEvidenceOps: ["exact", "y_to_i"],
      allowedEvidenceCarrierForms: ["di"],
    });

    for (const params of [
      {
        ops: ["exact"],
        segment: "di",
        carrierForm: "di",
      },
      {
        ops: ["y_to_i"],
        segment: "dy",
        carrierForm: "di",
      },
    ]) {
      expect(
        evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
          {
            sourceId: DI_SOURCE,
            embryo: "DI",
            ...params,
          },
        ),
      ).toMatchObject({
        allowed: true,
        effectiveCarrierForm: "di",
        reasons: [],
      });
    }
  });

  it.each(["dij", "dije", "dit"])(
    "withholds reviewed DI evidence from unreviewed carrier %s",
    (carrierForm) => {
      expect(
        evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
          {
            sourceId: DI_SOURCE,
            embryo: "DI",
            ops: ["exact"],
            segment: carrierForm,
            carrierForm,
          },
        ),
      ).toMatchObject({
        allowed: false,
        effectiveOps: ["exact"],
        effectiveCarrierForm: carrierForm,
        reasons: ["carrier_form_not_allowed"],
      });
    },
  );

  it("fails closed for missing carrier identity", () => {
    expect(
      evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
        {
          sourceId: DI_SOURCE,
          embryo: "DI",
          ops: ["exact"],
          segment: "di",
          carrierForm: "",
        },
      ),
    ).toMatchObject({
      allowed: false,
      effectiveOps: ["exact"],
      effectiveCarrierForm: null,
      reasons: ["carrier_form_missing"],
    });
  });

  it("remains fail closed for missing policy, embryo mismatch and unsupported operations", () => {
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
