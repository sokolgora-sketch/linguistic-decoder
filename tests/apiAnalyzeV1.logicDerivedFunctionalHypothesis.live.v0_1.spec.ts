import { GET } from "../app/api/analyze-v1/route";

async function analyze(
  word: string,
  query = "",
): Promise<any> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${word}&mode=strict${query}`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

describe("/api/analyze-v1 logic-derived functional hypothesis v0.1", () => {
  it("emits a verified, explicitly sense-bound hypothesis when requested", async () => {
    const body = await analyze(
      "sterile",
      "&targetSenseId=bounded_functional_sense&targetSenseLabel=bounded%20functional%20sense",
    );

    const logicCandidates = (body.candidates ?? []).filter(
      (candidate: any) =>
        candidate.sourceKind ===
          "logic_derived_functional_hypothesis",
    );

    expect(logicCandidates.length).toBeGreaterThan(0);
    expect(body.analysisStatusV0_1.status).toBe("research_functional_hypothesis");

    for (const candidate of logicCandidates) {
      expect(candidate.targetWord).toBe("sterile");
      expect(candidate.targetSenseId).toBe("bounded_functional_sense");
      expect(candidate.claimType).toBe("functionalMotivation");
      expect(candidate.functionalBridgeTruth).toBe("hypothesis");
      expect(candidate.validationOutcome).toBe("not_evaluated");
      expect(candidate.historicalOriginClaim).toBe("not_claimed");
      expect(candidate.historicalTransmissionClaim).toBe("not_claimed");
      expect(candidate.winnerClaim).toBe("not_claimed");
      expect(candidate.languageSuperiorityClaim).toBe("not_claimed");
      expect(candidate.candidateTruthClaim).toBe("not_claimed");
      expect(candidate.userDecisionPosture).toBe("user_decides");
      expect(
        candidate.logicDerivedFunctionalHypothesisVerificationV0_1.accepted,
      ).toBe(true);
    }
  });

  it("does not emit the logic-derived layer without an explicit target sense", async () => {
    const body = await analyze("sterile");

    expect(
      (body.candidates ?? []).some(
        (candidate: any) =>
          candidate.sourceKind ===
          "logic_derived_functional_hypothesis",
      ),
    ).toBe(false);
  });

  it("derives an opaque sense id from a label-only request", async () => {
    const body = await analyze(
      "candle",
      "&targetSenseLabel=a%20wax%20light%20source",
    );

    const logicCandidate = (body.candidates ?? []).find(
      (candidate: any) =>
        candidate.sourceKind === "logic_derived_functional_hypothesis",
    );

    expect(body.analysisStatusV0_1.status).toBe("candidate_only");
    expect(logicCandidate?.targetWord).toBe("candle");
    expect(logicCandidate?.targetSenseId).toBe("user_sense_a_wax_light_source");
    expect(logicCandidate?.targetSenseLabel).toBe("a wax light source");
    expect(logicCandidate?.expansionChain).toEqual([
      "AN",
      "CAN",
      "CANDLE",
    ]);
    expect(logicCandidate?.functionalBridgeTruth).toBe("hypothesis");
    expect(logicCandidate?.historicalOriginClaim).toBe("not_claimed");
    expect(logicCandidate?.winnerClaim).toBe("not_claimed");
    expect(logicCandidate?.candidateTruthClaim).toBe("not_claimed");
  });
});
