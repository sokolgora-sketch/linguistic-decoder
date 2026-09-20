import mysteryPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/mystery.five-case.research-evidence-packet.v0_1.json";
import candlePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/candle.five-case.research-evidence-packet.v0_1.json";
import stonePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/stone.five-case.research-evidence-packet.v0_1.json";
import drinkPacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/drink.five-case.research-evidence-packet.v0_1.json";
import justicePacket from "../src/data/openInstrument/researchEvidencePackets.v0_1/justice.five-case.research-evidence-packet.v0_1.json";
import catalog from "../src/data/multiSourceFunctionalResearchEvidenceCatalog.v0_1.json";
import {
  compileOpenInstrumentResearchEvidencePacketInputV0_1,
} from "../src/shared/openInstrumentResearchEvidencePacket.v0_1";
import {
  admitOpenInstrumentResearchCatalogV0_1,
} from "../src/shared/openInstrumentResearchCatalogAdmission.v0_1";
import { runAnalysisDeterministic } from "../src/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "../src/shared/analysisAdapter";

const PACKETS = [mysteryPacket, candlePacket, stonePacket, drinkPacket, justicePacket];
const TARGET_COUNTS = {
  mystery: 3,
  candle: 2,
  stone: 2,
  drink: 3,
  justice: 3,
} as const;

describe("five-case accepted research witness admission v1", () => {
  it("preserves all 13 bounded target-functional rows through compilation and admission", () => {
    const compiled = PACKETS.flatMap((packet) =>
      compileOpenInstrumentResearchEvidencePacketInputV0_1(packet),
    );
    expect(compiled).toHaveLength(13);
    expect(compiled.every((row) => row.embryoRelation === "no_structural_relation")).toBe(true);
    expect(compiled.every((row) => row.relationOperationIds.length === 0)).toBe(true);
    expect(compiled.every((row) => row.attestationTruth === "fact")).toBe(true);
    expect(compiled.every((row) => row.userDecisionPosture === "user_decides")).toBe(true);
    expect(compiled.every((row) => row.winnerClaim === "not_claimed")).toBe(true);
    expect(compiled.every((row) => row.candidateTruthClaim === "not_claimed")).toBe(true);

    const rowsByTarget = new Map<string, number>();
    for (const row of compiled) {
      for (const hypothesis of row.functionalHypotheses) {
        rowsByTarget.set(hypothesis.targetWord, (rowsByTarget.get(hypothesis.targetWord) ?? 0) + 1);
        expect(hypothesis.functionalBridgeTruth).toBe("hypothesis");
        expect(hypothesis.claimBoundary).toBe("functional_hypothesis_only");
      }
    }
    expect(Object.fromEntries(rowsByTarget)).toEqual(TARGET_COUNTS);

    const persistedIds = new Set(
      catalog.rows
        .filter((row) => row.researchEvidenceId.includes("five-case"))
        .map((row) => row.researchEvidenceId),
    );
    expect(persistedIds.size).toBe(13);
    expect(compiled.every((row) => persistedIds.has(row.researchEvidenceId))).toBe(true);

    const preAdmission = {
      catalogVersion: catalog.catalogVersion,
      rows: catalog.rows.filter((row) => !persistedIds.has(row.researchEvidenceId)),
    };
    const admission = admitOpenInstrumentResearchCatalogV0_1(preAdmission, compiled);
    expect(admission.ok).toBe(true);
    if (!admission.ok) throw new Error(admission.reasonCodes.join(", "));
    expect(admission.dryRun).toMatchObject({
      incomingRowCount: 13,
      collisions: [],
      wouldChange: true,
    });
  });

  it("does not make a source form a structural witness", () => {
    const persisted = catalog.rows.filter((row) => row.researchEvidenceId.includes("five-case"));
    expect(persisted).toHaveLength(13);
    for (const row of persisted) {
      expect(row.embryoRelation).toBe("no_structural_relation");
      expect(row.form).not.toBe(row.embryo);
      expect(row.relationOperationIds).toEqual([]);
      expect(row.historicalOriginClaim).toBe("not_claimed");
      expect(row.historicalTransmissionClaim).toBe("not_claimed");
      expect(row.winnerClaim).toBe("not_claimed");
      expect(row.userDecisionPosture).toBe("user_decides");
    }
  });

  it("consumes every admitted witness alongside its unchanged structural candidate", async () => {
    const targets = [
      ["mystery", "user_sense_something_unknown_or_difficult_to_understand", "YST", 3],
      ["candle", "user_sense_a_wax_light_source", "AN", 2],
      ["stone", "user_sense_hard_natural_mineral_rock_material", "ONE", 2],
      ["drink", "user_sense_to_take_liquid_into_the_mouth_and_swallow_it", "INK", 3],
      ["justice", "user_sense_fairness_in_how_people_are_treated", "UST", 3],
    ] as const;

    for (const [word, targetSenseId, embryo, expectedWitnessCount] of targets) {
      const payload = await runAnalysisDeterministic(word, { mode: "strict" });
      (payload as any).inputs = {
        targetSenseId,
        targetSenseLabel: targetSenseId,
      };
      const result = enginePayloadToAnalysisResult(payload) as any;
      const research = result.candidates.filter(
        (candidate: any) => candidate.sourceKind === "multi_source_research_witness",
      );
      const structural = result.candidates.filter(
        (candidate: any) => candidate.sourceKind !== "multi_source_research_witness",
      );

      expect(result.analysisStatusV0_1.status).toBe("research_functional_hypothesis");
      expect(research).toHaveLength(expectedWitnessCount);
      expect(structural.some((candidate: any) => candidate.embryo === embryo)).toBe(true);
      expect(research.every((candidate: any) => candidate.targetWord === word)).toBe(true);
      expect(research.every((candidate: any) => candidate.targetSenseId === targetSenseId)).toBe(true);
      expect(research.every((candidate: any) => candidate.embryo === embryo)).toBe(true);
      expect(research.every((candidate: any) => candidate.form !== embryo)).toBe(true);
      expect(research.every((candidate: any) => candidate.embryoRelation === "no_structural_relation")).toBe(true);
      expect(research.every((candidate: any) => candidate.relationOperationIds.length === 0)).toBe(true);
      expect(research.every((candidate: any) => candidate.attestationTruth === "fact")).toBe(true);
      expect(research.every((candidate: any) => candidate.functionalBridgeTruth === "hypothesis")).toBe(true);
      expect(research.every((candidate: any) => candidate.claimBoundary === "research_functional_hypothesis_only")).toBe(true);
      expect(research.every((candidate: any) => candidate.evidenceRefs.length === 1)).toBe(true);
      expect(research.every((candidate: any) => candidate.winnerClaim === "not_claimed")).toBe(true);
      expect(research.every((candidate: any) => candidate.candidateTruthClaim === "not_claimed")).toBe(true);
      expect(research.every((candidate: any) => candidate.userDecisionPosture === "user_decides")).toBe(true);
    }
  });
});
