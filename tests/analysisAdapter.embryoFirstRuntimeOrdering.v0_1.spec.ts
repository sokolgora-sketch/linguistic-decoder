import {
  orderEmbryoFirstCandidatesForAnalyzeV1,
  projectEmbryoFirstCandidateForAnalyzeV1,
} from "@/shared/analysisAdapter";

describe("analyze-v1 embryo-first runtime ordering v0.1", () => {
  const payload = { word: "control" };

  function projected(
    id: string,
    embryo: string | null,
    validationOutcome: string,
  ) {
    return projectEmbryoFirstCandidateForAnalyzeV1(
      {
        id,
        candidateId: id,
        form: id,
        language: "sq",
        embryo,
        isolatedStandaloneForm: embryo,
        plainStandaloneGloss: embryo ? `gloss ${embryo}` : null,
        sourceNote: embryo ? `reviewed source ${embryo}` : null,
        semanticBridge: embryo ? `functional bridge ${embryo}` : null,
        validationOutcome,
        originClaim: "not_claimed",
        userDecisionPosture: "user_decides",
      },
      payload,
    );
  }

  it("orders validated functional embryos smallest to largest", () => {
    const larger = projected("larger", "DAMAGE", "partial");
    const smallest = projected("smallest", "DA", "partial");
    const middle = projected("middle", "DAM", "partial");

    const out = orderEmbryoFirstCandidatesForAnalyzeV1([
      larger,
      smallest,
      middle,
    ]);

    expect(out.map((candidate) => candidate.candidateId)).toEqual([
      "smallest",
      "middle",
      "larger",
    ]);

    expect(out.map((candidate) => candidate.embryoSize)).toEqual([
      2,
      3,
      6,
    ]);
  });

  it("keeps fully validated candidates ahead of smaller partial candidates", () => {
    const partialSmall = projected("partial-small", "DA", "partial");
    const validatedLarge = projected("validated-large", "ROOT", "validated");

    const out = orderEmbryoFirstCandidatesForAnalyzeV1([
      partialSmall,
      validatedLarge,
    ]);

    expect(out.map((candidate) => candidate.candidateId)).toEqual([
      "validated-large",
      "partial-small",
    ]);
  });

  it("preserves original deterministic order for equal embryo sizes", () => {
    const first = projected("first", "DA", "partial");
    const second = projected("second", "DI", "partial");
    const third = projected("third", "PO", "partial");

    const out = orderEmbryoFirstCandidatesForAnalyzeV1([
      first,
      second,
      third,
    ]);

    expect(out.map((candidate) => candidate.candidateId)).toEqual([
      "first",
      "second",
      "third",
    ]);
  });

  it("does not promote blocked or unevaluated candidates ahead of validated functional candidates", () => {
    const blocked = projected("blocked", "A", "blocked");
    const validated = projected("validated", "DA", "partial");
    const unevaluated = projected("unevaluated", "I", "not_evaluated");

    const out = orderEmbryoFirstCandidatesForAnalyzeV1([
      blocked,
      unevaluated,
      validated,
    ]);

    expect(out[0]?.candidateId).toBe("validated");
    expect(out.slice(1).map((candidate) => candidate.candidateId)).toEqual([
      "blocked",
      "unevaluated",
    ]);
  });

  it("keeps validated historical context behind partial functional motivation", () => {
    const historicalValidated =
      projectEmbryoFirstCandidateForAnalyzeV1(
        {
          id: "historical-validated",
          candidateId: "historical-validated",
          form: "historical",
          language: "la",
          embryo: "H",
          embryoSize: 1,
          isolatedStandaloneForm: "H",
          plainStandaloneGloss: "historical context fixture",
          sourceNote: "reviewed historical-context source fixture",
          semanticBridge: "historical relation context only",
          claimType: "historicalTransmission",
          validationOutcome: "validated",
          rankGroup: "historicalContextOnly",
          originClaim: "context_only",
          userDecisionPosture: "user_decides",
        },
        payload,
      );

    const partialFunctional = projected(
      "partial-functional",
      "FUNCTION",
      "partial",
    );

    const out = orderEmbryoFirstCandidatesForAnalyzeV1([
      historicalValidated,
      partialFunctional,
    ]);

    expect(out.map((candidate) => candidate.candidateId)).toEqual([
      "partial-functional",
      "historical-validated",
    ]);
  });

  it("does not mutate the supplied candidate array", () => {
    const larger = projected("larger", "DAM", "partial");
    const smaller = projected("smaller", "DA", "partial");

    const input = [larger, smaller];
    const before = input.map((candidate) => candidate.candidateId);

    orderEmbryoFirstCandidatesForAnalyzeV1(input);

    expect(input.map((candidate) => candidate.candidateId)).toEqual(before);
  });
});
