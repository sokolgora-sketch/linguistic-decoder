import {
  canonicalOperatorProfilesV0_1,
} from "./canonicalOperatorProfile.v0_1";

export const CANONICAL_OPERATOR_PROFILE_DRIVEN_REUSE_CORPUS_VERSION_V0_1 =
  "canonical-operator-profile-driven-reuse-corpus.v0_1" as const;

export type ProfileDrivenCanonicalOperatorIdV0_1 =
  | "DA"
  | "DI";

export type CanonicalOperatorProfileDrivenReuseCaseV0_1 = {
  corpusVersion:
    typeof CANONICAL_OPERATOR_PROFILE_DRIVEN_REUSE_CORPUS_VERSION_V0_1;
  caseId: string;
  input: string;
  expectedReviewedOperators:
    readonly ProfileDrivenCanonicalOperatorIdV0_1[];
  negativeControlOperators:
    readonly ProfileDrivenCanonicalOperatorIdV0_1[];
  sourceProfileIds: readonly string[];
  generationAuthority:
    "canonical_operator_profile_positive_and_negative_words";
};

type MutableProfileDrivenCaseV0_1 = {
  input: string;
  expectedReviewedOperators:
    Set<ProfileDrivenCanonicalOperatorIdV0_1>;
  negativeControlOperators:
    Set<ProfileDrivenCanonicalOperatorIdV0_1>;
  sourceProfileIds: Set<string>;
};

function isSupportedOperatorIdV0_1(
  value: string,
): value is ProfileDrivenCanonicalOperatorIdV0_1 {
  return value === "DA" || value === "DI";
}

function normalizeProfileWordV0_1(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase("en-US");
}

function slugProfileWordV0_1(
  value: string,
): string {
  const slug = value
    .toLocaleLowerCase("en-US")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "empty";
}

export function buildCanonicalOperatorProfileDrivenReuseCasesV0_1():
readonly CanonicalOperatorProfileDrivenReuseCaseV0_1[] {
  const profileOrder =
    new Map<ProfileDrivenCanonicalOperatorIdV0_1, number>();

  const cases =
    new Map<string, MutableProfileDrivenCaseV0_1>();

  function ensureCase(
    input: string,
  ): MutableProfileDrivenCaseV0_1 {
    const existing = cases.get(input);

    if (existing) return existing;

    const created: MutableProfileDrivenCaseV0_1 = {
      input,
      expectedReviewedOperators:
        new Set<ProfileDrivenCanonicalOperatorIdV0_1>(),
      negativeControlOperators:
        new Set<ProfileDrivenCanonicalOperatorIdV0_1>(),
      sourceProfileIds: new Set<string>(),
    };

    cases.set(input, created);
    return created;
  }

  for (
    const [profileIndex, profile]
    of canonicalOperatorProfilesV0_1.entries()
  ) {
    if (
      !isSupportedOperatorIdV0_1(
        profile.operatorId,
      )
    ) {
      continue;
    }

    const operatorId = profile.operatorId;

    profileOrder.set(operatorId, profileIndex);

    for (
      const rawPositiveWord
      of profile.positiveProofWords
    ) {
      const input =
        normalizeProfileWordV0_1(rawPositiveWord);

      if (!input) continue;

      const generatedCase = ensureCase(input);

      generatedCase.expectedReviewedOperators.add(
        operatorId,
      );

      generatedCase.sourceProfileIds.add(
        profile.sourceId,
      );
    }

    for (
      const rawNegativeWord
      of profile.negativeControlWords
    ) {
      const input =
        normalizeProfileWordV0_1(rawNegativeWord);

      if (!input) continue;

      const generatedCase = ensureCase(input);

      generatedCase.negativeControlOperators.add(
        operatorId,
      );

      generatedCase.sourceProfileIds.add(
        profile.sourceId,
      );
    }
  }

  function sortOperators(
    values:
      Iterable<ProfileDrivenCanonicalOperatorIdV0_1>,
  ): ProfileDrivenCanonicalOperatorIdV0_1[] {
    return Array.from(values).sort(
      (left, right) =>
        (profileOrder.get(left) ?? 999) -
        (profileOrder.get(right) ?? 999),
    );
  }

  return Array.from(cases.values()).map(
    (generatedCase) => {
      const expectedReviewedOperators =
        sortOperators(
          generatedCase.expectedReviewedOperators,
        );

      const negativeControlOperators =
        sortOperators(
          generatedCase.negativeControlOperators,
        );

      const reviewedLabel =
        expectedReviewedOperators.length > 0
          ? expectedReviewedOperators
              .join("-")
              .toLocaleLowerCase("en-US")
          : "control";

      return {
        corpusVersion:
          CANONICAL_OPERATOR_PROFILE_DRIVEN_REUSE_CORPUS_VERSION_V0_1,
        caseId:
          `profile-${reviewedLabel}-` +
          slugProfileWordV0_1(
            generatedCase.input,
          ),
        input: generatedCase.input,
        expectedReviewedOperators,
        negativeControlOperators,
        sourceProfileIds:
          Array.from(
            generatedCase.sourceProfileIds,
          ).sort((left, right) =>
            left.localeCompare(right),
          ),
        generationAuthority:
          "canonical_operator_profile_positive_and_negative_words",
      };
    },
  );
}
