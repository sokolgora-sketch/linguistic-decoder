import {
  analyzeWordV1,
} from "@/engine/analyzeWordV1";

import {
  enginePayloadToAnalysisResult,
} from "@/shared/analysisAdapter";

async function analyze(
  word: string,
): Promise<any> {
  const payload =
    await analyzeWordV1(
      word,
      {
        mode: "strict",
      } as any,
    );

  return (
    enginePayloadToAnalysisResult(
      payload as any,
    ) as any
  );
}

describe(
  "father reviewed AT runtime projection v0.1",
  () => {
    it("surfaces AT as the first reviewed functional candidate for father", async () => {
      const out =
        await analyze("father");

      const atKey =
        out
          .rootMap
          ?.keys
          ?.find(
            (key: any) =>
              key?.token === "AT",
          );

      expect(atKey).toBeTruthy();
      expect(atKey.status).toBe(
        "supported",
      );

      const evidence =
        Array.isArray(
          atKey.evidence,
        )
          ? atKey.evidence.join(
              "\n",
            )
          : "";

      expect(evidence).toContain(
        "reviewed functional free-operator evidence",
      );

      expect(evidence).toContain(
        "The Albanian inherited lexicon",
      );

      expect(evidence).toContain(
        "at [m] (tg) {2} 'father'",
      );

      expect(evidence).toContain(
        "https://ieed.ullet.net/alb.html",
      );

      expect(evidence).toContain(
        "historicalOriginClaim=not_claimed",
      );

      const functional =
        out.candidates.find(
          (candidate: any) =>
            candidate
              ?.candidateId ===
            "albanian-at-father-functional",
        );

      expect(functional).toMatchObject({
        candidateId:
          "albanian-at-father-functional",
        displayForm: "AT",
        candidateLanguage: "sq",
        claimType:
          "functionalMotivation",
        embryo: "AT",
        isolatedStandaloneForm:
          "at",
        plainStandaloneGloss:
          "father",
        validationOutcome:
          "validated",
        rankGroup:
          "validatedFunctionalMotivation",
        originClaim:
          "not_claimed",
        userDecisionPosture:
          "user_decides",
      });

      expect(
        out.candidates[0]
          ?.candidateId,
      ).toBe(
        "albanian-at-father-functional",
      );

      expect(
        out
          .analysisStatusV0_1
          ?.reviewedOperators,
      ).toContain("AT");

      expect(
        out
          .analysisStatusV0_1
          ?.status,
      ).not.toBe(
        "null_no_supported_candidate",
      );
    });

    it("does not promote bare at homograph input to reviewed father truth", async () => {
      const out =
        await analyze("at");

      const reviewedAt =
        out.candidates.filter(
          (candidate: any) =>
            candidate?.embryo ===
              "AT" &&
            candidate
              ?.validationOutcome ===
              "validated" &&
            candidate
              ?.claimType ===
              "functionalMotivation",
        );

      expect(
        reviewedAt,
      ).toEqual([]);

      expect(
        out
          .analysisStatusV0_1
          ?.reviewedOperators ??
          [],
      ).not.toContain(
        "AT",
      );
    });

    it("preserves father surface/functional path separation", async () => {
      const out =
        await analyze("father");

      // This helper exercises analyzeWordV1 -> analysisAdapter
      // directly rather than the full analyze-v1 route. The direct
      // engine payload carries its canonical vowel sequence through
      // math7_summary.path, which the adapter exposes through Heart.
      // Route-level raw surface evidence is tested separately.
      expect(
        out
          .heart
          ?.math7
          ?.primary
          ?.vowels,
      ).toEqual([
        "A",
        "E",
      ]);

      expect(
        out
          .deepRoot
          ?.functionalRoots
          ?.[0]
          ?.vowelPath,
      ).toBe(
        "A→Ë",
      );
    });
  },
);
