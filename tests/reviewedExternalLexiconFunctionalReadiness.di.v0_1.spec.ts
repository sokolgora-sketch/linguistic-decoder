import type {
  ReviewedExternalLexiconCandidateSourceRowV0_1,
} from "../src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1";
import {
  reviewedExternalLexiconSourceRowCandidateRegistryV0_1,
} from "../src/shared/reviewedExternalLexiconSourceRowRegistry.v0_1";
import {
  buildReviewedExternalLexiconFunctionalReadinessV0_1,
} from "../src/shared/reviewedExternalLexiconFunctionalReadiness.v0_1";

describe("reviewed external lexicon functional readiness DI v0.1", () => {
  const sourceId = "reviewed.external.di.knowledge.candidate.v0_1";

  const row = reviewedExternalLexiconSourceRowCandidateRegistryV0_1.find(
    (candidate) => candidate.sourceId === sourceId,
  );

  it("finds the reviewed DI candidate row", () => {
    expect(row).toBeDefined();
    expect(row).toMatchObject({
      sourceId,
      candidateId: "albanian-di-know-functional",
      embryo: "DI",
      isolatedStandaloneForm: "di",
      plainStandaloneGloss: "know / knowledge",
    });
  });

  it("accepts DI for bounded functional lexical use without making historical claims", () => {
    expect(row).toBeDefined();

    const readiness =
      buildReviewedExternalLexiconFunctionalReadinessV0_1(row!);

    expect(readiness).toEqual(
      expect.objectContaining({
        readinessVersion:
          "reviewed-external-lexicon-functional-readiness.v0_1",
        sourceId,
        candidateId: "albanian-di-know-functional",
        functionalReady: true,
        historicalOriginClaim: "not_claimed",
        userDecisionPosture: "user_decides",
      }),
    );

    expect(
      readiness.items.filter((item) => !item.passed),
    ).toEqual([]);

    expect(row).toEqual(
      expect.objectContaining({
        isolatedStandaloneForm: "di",
        originClaim: false,
        historicalTransmissionClaim: false,
        winnerClaim: false,
        candidateTruthClaim: false,
        userDecisionPosture: "user_decides",
      }),
    );

    expect(row!.externalCitations).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          citationStatus: "reviewed_accepted",
          citationType: "dictionary_entry",
          attestedForm: "di",
          attestedGloss: "know / knowledge",
        }),
      ]),
    );
  });

  it("fails when the exact lexical form is replaced by an unrelated form", () => {
    expect(row).toBeDefined();

    const changed: ReviewedExternalLexiconCandidateSourceRowV0_1 = {
      ...row!,
      externalCitations: row!.externalCitations.map((citation, index) =>
        index === 0
          ? {
              ...citation,
              attestedForm: "unrelated",
            }
          : citation,
      ),
    };

    const readiness =
      buildReviewedExternalLexiconFunctionalReadinessV0_1(changed);

    expect(readiness.functionalReady).toBe(false);
    expect(
      readiness.items.find(
        (item) => item.id === "exact_attested_form_present",
      )?.passed,
    ).toBe(false);
  });

  it("fails when a historical-origin claim is introduced", () => {
    expect(row).toBeDefined();

    const changed = {
      ...row!,
      originClaim: true,
    } as unknown as ReviewedExternalLexiconCandidateSourceRowV0_1;

    const readiness =
      buildReviewedExternalLexiconFunctionalReadinessV0_1(changed);

    expect(readiness.functionalReady).toBe(false);
    expect(
      readiness.items.find(
        (item) => item.id === "historical_origin_not_claimed",
      )?.passed,
    ).toBe(false);
  });
});
