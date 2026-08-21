import {
  getCanonicalOperatorProfileV0_1,
  type CanonicalOperatorProfileV0_1,
} from "@/shared/canonicalOperatorProfile.v0_1";

import {
  canonicalOperatorReviewedTargetFamilyPoliciesV0_1,
  resolveCanonicalOperatorReviewedTargetFamilyV0_1,
} from "@/shared/canonicalOperatorReviewedTargetFamily.v0_1";

function profile(
  operatorId: "DA" | "DI" | "AT",
): CanonicalOperatorProfileV0_1 {
  const value =
    getCanonicalOperatorProfileV0_1(
      operatorId,
    );

  if (!value) {
    throw new Error(
      `Missing canonical profile ${operatorId}`,
    );
  }

  return value;
}

function familyMatch(
  operatorId: "DA" | "DI" | "AT",
  input: string,
) {
  return resolveCanonicalOperatorReviewedTargetFamilyV0_1(
    profile(operatorId),
    input,
  );
}

describe(
  "canonical reviewed target-family bridge v0.1",
  () => {
    it("locks explicit reviewed target-family anchors and transformation authority", () => {
      expect(
        canonicalOperatorReviewedTargetFamilyPoliciesV0_1,
      ).toEqual([
        {
          operatorId: "DI",
          proofWord: "study",
          allowedRules: [
            "plural_y_to_ies",
            "past_y_to_ied",
            "gerund_plus_ing",
          ],
        },
        {
          operatorId: "DA",
          proofWord: "damage",
          allowedRules: [
            "plural_s",
            "past_terminal_e_plus_d",
            "gerund_drop_terminal_e",
          ],
        },
        {
          operatorId: "AT",
          proofWord: "father",
          allowedRules: [
            "plural_s",
            "derivational_hood",
            "derivational_ly",
          ],
        },
      ]);

      for (
        const policy
        of canonicalOperatorReviewedTargetFamilyPoliciesV0_1
      ) {
        expect(
          profile(
            policy.operatorId,
          )
            .positiveProofWords
            .map((word) =>
              word
                .trim()
                .toLocaleLowerCase(
                  "en-US",
                ),
            ),
        ).toContain(
          policy.proofWord,
        );
      }
    });

    it.each([
      ["DI", "study", "study", "exact"],
      [
        "DI",
        "studies",
        "study",
        "plural_y_to_ies",
      ],
      [
        "DI",
        "studied",
        "study",
        "past_y_to_ied",
      ],
      [
        "DI",
        "studying",
        "study",
        "gerund_plus_ing",
      ],

      ["DA", "damage", "damage", "exact"],
      [
        "DA",
        "damages",
        "damage",
        "plural_s",
      ],
      [
        "DA",
        "damaged",
        "damage",
        "past_terminal_e_plus_d",
      ],
      [
        "DA",
        "damaging",
        "damage",
        "gerund_drop_terminal_e",
      ],

      ["AT", "father", "father", "exact"],
      [
        "AT",
        "fathers",
        "father",
        "plural_s",
      ],
      [
        "AT",
        "fatherhood",
        "father",
        "derivational_hood",
      ],
      [
        "AT",
        "fatherly",
        "father",
        "derivational_ly",
      ],
    ] as const)(
      "%s safely relates %s to reviewed proof word %s through %s",
      (
        operatorId,
        input,
        proofWord,
        ruleId,
      ) => {
        expect(
          familyMatch(
            operatorId,
            input,
          ),
        ).toEqual({
          bridgeVersion:
            "canonical-operator-reviewed-target-family.v0_1",
          operatorId,
          normalizedInput:
            input,
          matchedProofWord:
            proofWord,
          matchKind:
            ruleId === "exact"
              ? "exact"
              : "reviewed_target_family",
          ruleId,
          reviewedFamilyEligible:
            true,
        });
      },
    );

    it.each([
      ["DA", "database"],
      ["DA", "data"],
      ["DA", "daisy"],
      ["DA", "damage!"],

      ["DI", "digital"],
      ["DI", "dinner"],
      ["DI", "dij"],
      ["DI", "dije"],
      ["DI", "dit"],
      ["DI", "study!"],

      ["AT", "at"],
      ["AT", "atom"],
      ["AT", "atlas"],
      ["AT", "attic"],
      ["AT", "father!"],

      ["DA", "river"],
      ["DI", "stone"],
      ["AT", "music"],
    ] as const)(
      "%s does not promote collision or unsupported input %s",
      (
        operatorId,
        input,
      ) => {
        expect(
          familyMatch(
            operatorId,
            input,
          ),
        ).toBeNull();
      },
    );

    it("normalizes case and surrounding whitespace without expanding punctuation authority", () => {
      expect(
        familyMatch(
          "DI",
          "  STUDIED  ",
        ),
      ).toMatchObject({
        operatorId: "DI",
        normalizedInput:
          "studied",
        matchedProofWord:
          "study",
        ruleId:
          "past_y_to_ied",
        reviewedFamilyEligible:
          true,
      });

      expect(
        familyMatch(
          "DA",
          "  DAMAGES  ",
        ),
      ).toMatchObject({
        operatorId: "DA",
        normalizedInput:
          "damages",
        matchedProofWord:
          "damage",
        ruleId:
          "plural_s",
        reviewedFamilyEligible:
          true,
      });

      expect(
        familyMatch(
          "AT",
          "  FATHERHOOD  ",
        ),
      ).toMatchObject({
        operatorId: "AT",
        normalizedInput:
          "fatherhood",
        matchedProofWord:
          "father",
        ruleId:
          "derivational_hood",
        reviewedFamilyEligible:
          true,
      });
    });

    it("requires an already reviewed canonical positive proof word as the family anchor", () => {
      for (
        const operatorId
        of ["DA", "DI", "AT"] as const
      ) {
        const current =
          profile(operatorId);

        const cases = [
          familyMatch(
            operatorId,
            operatorId === "DA"
              ? "damaged"
              : operatorId === "DI"
                ? "studied"
                : "fathers",
          ),
        ];

        for (const result of cases) {
          expect(result).not.toBeNull();

          expect(
            current
              .positiveProofWords
              .map((word) =>
                word
                  .trim()
                  .toLocaleLowerCase(
                    "en-US",
                  ),
              )
              .includes(
                result!
                  .matchedProofWord,
              ),
          ).toBe(true);
        }
      }
    });

    it.each([
      ["DI", "studyhood"],
      ["DI", "studyly"],
      ["DI", "studys"],
      ["DI", "studyed"],

      ["DI", "studims"],
      ["DI", "studimhood"],
      ["DI", "studimly"],

      ["DA", "damagehood"],
      ["DA", "damagely"],
      ["DA", "damageing"],
      ["DA", "damagement"],

      ["AT", "fathering"],
      ["AT", "fathered"],
      ["AT", "fatherhoods"],
      ["AT", "fatherliness"],
    ] as const)(
      "%s does not authorize undeclared target-family transformation %s",
      (
        operatorId,
        input,
      ) => {
        expect(
          familyMatch(
            operatorId,
            input,
          ),
        ).toBeNull();
      },
    );

    it("keeps family matching independent from structural substring discovery", () => {
      expect(
        familyMatch(
          "DA",
          "database",
        ),
      ).toBeNull();

      expect(
        familyMatch(
          "DI",
          "digital",
        ),
      ).toBeNull();

      expect(
        familyMatch(
          "AT",
          "atom",
        ),
      ).toBeNull();
    });
  },
);
