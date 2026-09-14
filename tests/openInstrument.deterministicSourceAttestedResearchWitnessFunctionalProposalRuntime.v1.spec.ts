import { GET } from "@/app/api/analyze-v1/route";

async function analyze(word: string): Promise<any> {
  const response = await GET(
    new Request(
      "http://localhost/api/analyze-v1?word=" +
        encodeURIComponent(word) +
        "&mode=strict",
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function sourceAttestedCandidates(body: any): any[] {
  return Array.isArray(body?.candidates)
    ? body.candidates.filter(
        (candidate: any) =>
          candidate?.sourceKind === "multi_source_research_witness",
      )
    : [];
}

describe(
  "source-attested research-witness functional proposal runtime v1",
  () => {
    test.each([
      ["love", ["DUA", "AMO"]],
      ["hope", ["shpresë", "spēs"]],
    ] as const)(
      "enriches existing %s candidates without changing ownership or order",
      async (word, expectedEmbryos) => {
        const body = await analyze(word);
        const candidates = sourceAttestedCandidates(body);

        expect(candidates.map((candidate) => candidate.embryo)).toEqual(
          expectedEmbryos,
        );
        expect(new Set(candidates.map((candidate) => candidate.candidateId)).size).toBe(
          candidates.length,
        );

        for (const candidate of candidates) {
          expect(candidate.candidateId).toBe(
            `research-functional:multi-source-functional:${word}:${candidate.embryo}:${candidate.sourceId}`,
          );
          expect(candidate.functionalStatement).toBe(candidate.semanticBridge);
          expect(candidate.sourceStatus).toBe("research_candidate");
          expect(candidate.claimBoundary).toBe(
            "research_functional_hypothesis_only",
          );
          expect(candidate.functionalComponents).toBeUndefined();
          expect(candidate.userDecisionPosture).toBe("user_decides");
        }
      },
    );

    test("does not outrank existing reviewed candidates", async () => {
      for (const word of ["study", "damage", "father"]) {
        const body = await analyze(word);
        expect(sourceAttestedCandidates(body)).toEqual([]);
        expect(body.analysisStatusV0_1.status).toBe(
          "reviewed_functional_evidence",
        );
      }
    });
  },
);
