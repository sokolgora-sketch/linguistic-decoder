import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { discoverStructuralHypothesesV0_1 } from "@/shared/structuralHypothesisDiscovery.v0_1";
import { buildGenericFunctionalWitnessRuntimeProjectionV1 } from "@/shared/openInstrument/genericFunctionalWitnessRuntimeProjection.v1";
import { GET } from "@/app/api/analyze-v1/route";

async function analyze(word: string): Promise<any> {
  const payload = await analyzeWordV1(word, { mode: "strict" } as any);
  return enginePayloadToAnalysisResult(payload as any) as any;
}

async function analyzeApi(word: string): Promise<any> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function findATProjection(output: any): any {
  return output.candidates
    ?.map((candidate: any) => candidate.genericFunctionalWitnessRuntimeProjectionV1)
    .find((projection: any) =>
      projection?.discovery?.matches?.some(
        (match: any) =>
          match.sourceId ===
          "reviewed.external.albanian-at.father.candidate.v0_1",
      ),
    );
}

describe("first natural reviewed witness end-to-end v0.1", () => {
  it.each(["pater", "mater"])(
    "%s reaches the reviewed AT witness through structural discovery",
    async (word) => {
      const output = await analyze(word);
      const structuralAT = output.candidates?.find(
        (candidate: any) =>
          candidate?.sourceKind === "logic_derived_structural_hypothesis" &&
          candidate?.embryo === "AT",
      );
      const projection = findATProjection(output);
      const match = projection?.discovery?.matches?.find(
        (candidate: any) =>
          candidate.sourceId ===
          "reviewed.external.albanian-at.father.candidate.v0_1",
      );

      expect(structuralAT).toBeTruthy();
      expect(projection?.discovery?.status).toBe("MATCHES_FOUND");
      expect(match).toMatchObject({
        sourceForm: "at",
        sourceAuthorityStatus: "reviewed_accepted",
        sourceAttestation: "SOURCE_RECORD_ONLY",
        historicalRelation: "NOT_CLAIMED",
        winnerClaim: "NOT_CLAIMED",
        noSingleWinner: true,
      });
      expect(
        projection.correspondences.find(
          (correspondence: any) => correspondence.sourceWitness?.sourceId === match.sourceId,
        ),
      ).toMatchObject({
        verdict: "UNKNOWN",
        functionalAcceptance: "NOT_AUTHORIZED",
        targetOriginClaim: "NOT_CLAIMED",
        targetSenseBinding: "TARGET_SENSE_UNBOUND",
      });
    },
  );

  it.each(["pater", "mater"])(
    "%s reaches the reviewed AT witness through the real analyze-v1 route",
    async (word) => {
      const output = await analyzeApi(word);
      const structuralAT = output.candidates?.find(
        (candidate: any) =>
          candidate?.sourceKind === "logic_derived_structural_hypothesis" &&
          candidate?.embryo === "AT",
      );
      const projection = findATProjection(output);

      expect(structuralAT).toBeTruthy();
      expect(projection?.discovery?.status).toBe("MATCHES_FOUND");
      expect(projection?.discovery?.matches).toHaveLength(1);
      expect(projection?.discovery?.matches[0]).toMatchObject({
        sourceId: "reviewed.external.albanian-at.father.candidate.v0_1",
        sourceForm: "at",
        sourceAuthorityStatus: "reviewed_accepted",
      });
    },
  );

  it("keeps a structurally valid HA control at Evidence Null when no reviewed row exists", async () => {
    await analyze("chaos");
    const hypothesis = discoverStructuralHypothesesV0_1("chaos").find(
      (candidate) => candidate.embryo === "HA",
    );
    const projection = hypothesis
      ? buildGenericFunctionalWitnessRuntimeProjectionV1({
          targetWord: "chaos",
          structuralHypothesis: hypothesis,
        })
      : null;

    expect(projection?.discovery?.status).toBe("NO_MATCHES");
    expect(projection?.discovery?.evidenceStatus).toBe("NO_EXTERNAL_EVIDENCE");
  });
});
