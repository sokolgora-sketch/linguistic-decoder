jest.mock("@/shared/multiSourceFunctionalDiscovery.v0_1", () => {
  const actual = jest.requireActual(
    "@/shared/multiSourceFunctionalDiscovery.v0_1",
  ) as typeof import("@/shared/multiSourceFunctionalDiscovery.v0_1");

  return {
    ...actual,
    discoverMultiSourceFunctionalWitnessesV0_1: (
      input: Parameters<
        typeof actual.discoverMultiSourceFunctionalWitnessesV0_1
      >[0],
    ) =>
      actual
        .discoverMultiSourceFunctionalWitnessesV0_1(input)
        .map((witness) => ({
          ...witness,
          attestationTruth: "unknown" as const,
          functionalBridgeTruth: "unknown" as const,
        })),
  };
});

import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

describe(
  "deterministic research-witness proposal runtime truth boundary",
  () => {
    test("preserves unknown-status research witnesses without publishing a functional statement", async () => {
      const payload = await runAnalysisDeterministic("sterile", {
        mode: "strict",
        alphabet: "auto",
      });
      const result = enginePayloadToAnalysisResult(payload) as any;
      const researchCandidates = (Array.isArray(result.candidates)
        ? result.candidates
        : []
      ).filter(
        (candidate: any) =>
          candidate.sourceKind === "multi_source_research_witness",
      );

      expect(researchCandidates.length).toBeGreaterThan(0);
      expect(
        researchCandidates.every(
          (candidate: any) =>
            candidate.attestationTruth === "unknown" &&
            candidate.functionalBridgeTruth === "unknown" &&
            candidate.functionalStatement === undefined,
        ),
      ).toBe(true);
    });
  },
);
