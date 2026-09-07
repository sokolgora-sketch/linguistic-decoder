import { GET } from "../app/api/analyze-v1/route";

const FRESH_WORDS = [
  "candle",
  "staircase",
  "orchard",
  "tunnel",
  "ribbon",
  "helmet",
  "pocket",
  "chimney",
] as const;

async function analyze(word: string, sense = false): Promise<any> {
  const params = sense
    ? "&targetSenseId=fresh_bounded_sense&targetSenseLabel=fresh%20bounded%20sense"
    : "";
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict${params}`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

describe("logic-first fresh-word generalization v0.1", () => {
  it("records the real fresh-word distribution without requiring non-Null output", async () => {
    const rows = [] as Array<Record<string, unknown>>;

    for (const word of FRESH_WORDS) {
      const body = await analyze(word, true);
      const candidates = Array.isArray(body.candidates) ? body.candidates : [];
      const logicCount = candidates.filter(
        (candidate: any) =>
          candidate.sourceKind ===
          "logic_derived_functional_hypothesis",
      ).length;

      rows.push({
        word,
        status: body.analysisStatusV0_1?.status,
        logicCount,
      });

      expect(body.analysisStatusV0_1?.claimBoundary).toMatchObject({
        historicalOriginClaim: "not_claimed",
        historicalTransmissionClaim: "not_claimed",
        winnerClaim: "not_claimed",
        languageSuperiorityClaim: "not_claimed",
        candidateTruthClaim: "not_claimed",
        structuralOutputIsCandidateTruth: false,
        nullIsValid: true,
      });
    }

    console.log("FRESH_WORD_LOGIC_MATRIX", JSON.stringify(rows));
    expect(rows).toHaveLength(FRESH_WORDS.length);
  });

  it("does not emit a logic-derived hypothesis without an explicit target sense", async () => {
    for (const word of FRESH_WORDS) {
      const body = await analyze(word, false);
      const candidates = Array.isArray(body.candidates) ? body.candidates : [];

      expect(
        candidates.some(
          (candidate: any) =>
            candidate.sourceKind ===
            "logic_derived_functional_hypothesis",
        ),
      ).toBe(false);
    }
  });

  it("preserves research precedence and no-single-winner posture on a stronger-evidence control", async () => {
    const body = await analyze("sterile", true);
    const candidates = Array.isArray(body.candidates) ? body.candidates : [];

    expect(body.analysisStatusV0_1?.status).toBe(
      "research_functional_hypothesis",
    );
    expect(
      candidates.some(
        (candidate: any) =>
          candidate.sourceKind ===
          "logic_derived_functional_hypothesis",
      ),
    ).toBe(true);
    expect(
      candidates.every(
        (candidate: any) =>
          candidate.winnerClaim === undefined ||
          candidate.winnerClaim === "not_claimed",
      ),
    ).toBe(true);
  });
});
