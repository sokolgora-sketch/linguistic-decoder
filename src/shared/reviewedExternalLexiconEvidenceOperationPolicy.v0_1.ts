import {
  normalizeToAllowedOpId,
  type AllowedOpId,
} from "./ops/allowedOps.v0.1";

export type ReviewedExternalLexiconEvidenceOperationPolicyReasonV0_1 =
  | "policy_missing"
  | "policy_embryo_mismatch"
  | "operation_missing"
  | "operation_unsupported"
  | "operation_not_allowed"
  | "carrier_form_missing"
  | "carrier_form_not_allowed";

export type ReviewedExternalLexiconEvidenceOperationPolicyV0_1 = {
  policyVersion:
    "reviewed-external-lexicon-evidence-operation-policy.v0_1";
  sourceId: string;
  embryo: string;
  allowedEvidenceOps: readonly AllowedOpId[];
  allowedEvidenceCarrierForms: readonly string[];
};

export type ReviewedExternalLexiconEvidenceOperationEvaluationV0_1 = {
  evaluationVersion:
    "reviewed-external-lexicon-evidence-operation-evaluation.v0_1";
  sourceId: string;
  embryo: string;
  allowed: boolean;
  effectiveOps: readonly AllowedOpId[];
  effectiveCarrierForm: string | null;
  reasons:
    readonly ReviewedExternalLexiconEvidenceOperationPolicyReasonV0_1[];
};

export const reviewedExternalLexiconEvidenceOperationPoliciesV0_1 = [
  {
    policyVersion:
      "reviewed-external-lexicon-evidence-operation-policy.v0_1",
    sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
    embryo: "DI",
    allowedEvidenceOps: ["exact", "y_to_i"],
    allowedEvidenceCarrierForms: ["di"],
  },
  {
    policyVersion:
      "reviewed-external-lexicon-evidence-operation-policy.v0_1",
    sourceId: "reviewed.external.albanian-at.father.candidate.v0_1",
    embryo: "AT",
    allowedEvidenceOps: ["exact"],
    allowedEvidenceCarrierForms: ["at"],
  },
  {
    policyVersion:
      "reviewed-external-lexicon-evidence-operation-policy.v0_1",
    sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
    embryo: "DA",
    allowedEvidenceOps: ["exact"],
    allowedEvidenceCarrierForms: ["da"],
  },
] as const satisfies readonly ReviewedExternalLexiconEvidenceOperationPolicyV0_1[];

export function getReviewedExternalLexiconEvidenceOperationPolicyV0_1(
  sourceId: string,
): ReviewedExternalLexiconEvidenceOperationPolicyV0_1 | null {
  return (
    reviewedExternalLexiconEvidenceOperationPoliciesV0_1.find(
      (policy) => policy.sourceId === sourceId,
    ) ?? null
  );
}

function normalizeCarrierTextV0_1(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US")
    .replace(/ë/g, "e");
}

export function evaluateReviewedExternalLexiconEvidenceOperationPolicyV0_1(
  params: {
    sourceId: string;
    embryo: string;
    ops?: readonly unknown[] | null;
    segment?: unknown;
    carrierForm?: unknown;
  },
): ReviewedExternalLexiconEvidenceOperationEvaluationV0_1 {
  const reasons =
    new Set<ReviewedExternalLexiconEvidenceOperationPolicyReasonV0_1>();

  const policy =
    getReviewedExternalLexiconEvidenceOperationPolicyV0_1(
      params.sourceId,
    );

  const policyIdentityMatches =
    Boolean(
      policy &&
        policy.embryo === params.embryo,
    );

  if (!policy) {
    reasons.add("policy_missing");
  } else if (policy.embryo !== params.embryo) {
    reasons.add("policy_embryo_mismatch");
  }

  const rawOps = Array.isArray(params.ops) ? params.ops : [];
  const effectiveOps: AllowedOpId[] = [];

  const segment = normalizeCarrierTextV0_1(params.segment);
  const carrierForm = normalizeCarrierTextV0_1(
    params.carrierForm,
  );

  if (rawOps.length === 0) {
    if (
      segment.length > 0 &&
      carrierForm.length > 0 &&
      segment === carrierForm
    ) {
      effectiveOps.push("exact");
    } else {
      reasons.add("operation_missing");
    }
  } else {
    for (const rawOp of rawOps) {
      const normalized = normalizeToAllowedOpId(rawOp);

      if (!normalized) {
        reasons.add("operation_unsupported");
        continue;
      }

      if (!effectiveOps.includes(normalized)) {
        effectiveOps.push(normalized);
      }
    }
  }

  if (
    policyIdentityMatches &&
    policy &&
    effectiveOps.some(
      (operation) =>
        !policy.allowedEvidenceOps.includes(operation),
    )
  ) {
    reasons.add("operation_not_allowed");
  }

  if (
    policyIdentityMatches &&
    policy
  ) {
    if (!carrierForm) {
      reasons.add("carrier_form_missing");
    } else {
      const allowedCarrierForms =
        policy.allowedEvidenceCarrierForms.map(
          normalizeCarrierTextV0_1,
        );

      if (!allowedCarrierForms.includes(carrierForm)) {
        reasons.add("carrier_form_not_allowed");
      }
    }
  }

  const sortedReasons = [...reasons].sort();

  return {
    evaluationVersion:
      "reviewed-external-lexicon-evidence-operation-evaluation.v0_1",
    sourceId: params.sourceId,
    embryo: params.embryo,
    allowed: sortedReasons.length === 0,
    effectiveOps,
    effectiveCarrierForm:
      carrierForm || null,
    reasons: sortedReasons,
  };
}
