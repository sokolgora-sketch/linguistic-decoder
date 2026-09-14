import {
  buildDeterministicResearchWitnessFunctionalProposalV1,
} from "@/shared/openInstrument/deterministicResearchWitnessFunctionalProposal.v1";
import {
  discoverStructuralHypothesesV0_1,
} from "@/shared/structuralHypothesisDiscovery.v0_1";
import {
  discoverMultiSourceFunctionalWitnessesV0_1,
} from "@/shared/multiSourceFunctionalDiscovery.v0_1";
import {
  buildMultiSourceFunctionalResearchInputsV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import {
  multiSourceFunctionalResearchEvidenceRowsErV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRows.er.v0_1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

function realInput() {
  const structuralHypothesis = discoverStructuralHypothesesV0_1(
    "sterile",
  ).find(
    (hypothesis) =>
      hypothesis.embryo === "ER" &&
      hypothesis.expansionChain.includes("STERILE"),
  );

  if (!structuralHypothesis) {
    throw new Error("expected the deterministic ER structural hypothesis");
  }

  const sources = buildMultiSourceFunctionalResearchInputsV0_1({
    targetWord: "sterile",
    embryo: "ER",
    rows: multiSourceFunctionalResearchEvidenceRowsErV0_1,
  });

  const witness = discoverMultiSourceFunctionalWitnessesV0_1({
    targetWord: "sterile",
    embryo: "ER",
    structuralExpansionChain: structuralHypothesis.expansionChain,
    sources,
  }).find((candidate) => candidate.semanticBridge != null);

  if (!witness) {
    throw new Error("expected an ER witness with a bounded semantic bridge");
  }

  return { structuralHypothesis, witness };
}

describe(
  "deterministic research-witness functional proposal adapter v1",
  () => {
    test("accepts an existing witness as research scope only", () => {
      const input = realInput();
      const result =
        buildDeterministicResearchWitnessFunctionalProposalV1(input);

      expect(result.decision).toBe("ACCEPT");
      expect(result.acceptance?.acceptedFunctionalCandidate).toMatchObject({
        admissionScope: "research_hypothesis_only",
        evidenceState: "research_candidate",
        functionalComponents: [],
        noSingleWinner: true,
        userDecisionPosture: "user_decides",
      });
    });

    test("copies the witness bridge into both bounded proposal fields", () => {
      const input = realInput();
      const result =
        buildDeterministicResearchWitnessFunctionalProposalV1(input);

      expect(result.proposal?.functionalStatement).toBe(
        input.witness.semanticBridge,
      );
      expect(result.proposal?.semanticBridge).toBe(
        input.witness.semanticBridge,
      );
      expect(
        result.acceptance?.acceptedFunctionalCandidate?.functionalStatement,
      ).toBe(input.witness.semanticBridge);
      expect(
        result.acceptance?.acceptedFunctionalCandidate?.semanticBridge,
      ).toBe(input.witness.semanticBridge);
    });

    test("preserves witness provenance and citation references", () => {
      const input = realInput();
      const result =
        buildDeterministicResearchWitnessFunctionalProposalV1(input);

      expect(result.proposal?.proposalProvenance).toEqual({
        kind: "research_catalog",
        sourceId: input.witness.sourceId,
      });
      expect(result.proposal?.evidenceRefs).toEqual(
        input.witness.citationRefs,
      );
      expect(
        result.acceptance?.acceptedFunctionalCandidate?.evidenceRefs,
      ).toEqual(input.witness.citationRefs);
    });

    test("does not fabricate target-sense alignment or components", () => {
      const result =
        buildDeterministicResearchWitnessFunctionalProposalV1(realInput());

      expect(result.proposal?.targetSenseRequirement).toBe("OPTIONAL");
      expect(result.proposal?.targetSense).toBeUndefined();
      expect(result.proposal?.semanticAlignment).toBeNull();
      expect(result.proposal?.functionalComponents).toEqual([]);
      expect(result.proposal?.componentRequirement).toBe("not_applicable");
    });

    test("rejects a missing bridge through the acceptance contract", () => {
      const input = realInput();
      const result = buildDeterministicResearchWitnessFunctionalProposalV1({
        ...input,
        witness: { ...input.witness, semanticBridge: null },
      });

      expect(result.decision).toBe("INSUFFICIENT_SUPPORT");
      expect(result.reasonCodes).toContain("MISSING_SEMANTIC_BRIDGE");
      expect(result.proposal).toBeNull();
    });

    test("rejects a witness without evidence references before admission", () => {
      const input = realInput();
      const result = buildDeterministicResearchWitnessFunctionalProposalV1({
        ...input,
        witness: { ...input.witness, citationRefs: [] },
      });

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toEqual([
        "RESEARCH_WITNESS_EVIDENCE_REFS_REQUIRED",
      ]);
      expect(result.acceptance).toBeNull();
    });

    test("rejects a reviewed-status witness instead of promoting it", () => {
      const input = realInput();
      const result = buildDeterministicResearchWitnessFunctionalProposalV1({
        ...input,
        witness: { ...input.witness, sourceStatus: "reviewed_candidate" },
      });

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toEqual([
        "RESEARCH_WITNESS_MUST_REMAIN_RESEARCH",
      ]);
      expect(result.proposal).toBeNull();
    });

    test("keeps an invalid structural anchor fail-closed", () => {
      const result =
        buildDeterministicResearchWitnessFunctionalProposalV1({
          ...realInput(),
          structuralHypothesis: null,
        });

      expect(result.decision).toBe("INSUFFICIENT_SUPPORT");
      expect(result.reasonCodes).toContain("MISSING_STRUCTURAL_ANCHOR");
      expect(result.proposal).toBeNull();
    });

    test("rejects a witness bound to a different structural word", () => {
      const input = realInput();
      const result =
        buildDeterministicResearchWitnessFunctionalProposalV1({
          ...input,
          witness: { ...input.witness, targetWord: "different" },
        });

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toEqual([
        "RESEARCH_WITNESS_TARGET_WORD_MISMATCH",
      ]);
    });

    test("is deterministic for identical structural and witness input", () => {
      const input = realInput();

      expect(
        buildDeterministicResearchWitnessFunctionalProposalV1(input),
      ).toEqual(
        buildDeterministicResearchWitnessFunctionalProposalV1(input),
      );
    });

    test("enriches existing structural research candidates without changing ownership", async () => {
      const payload = await runAnalysisDeterministic("sterile", {
        mode: "strict",
        alphabet: "auto",
      });
      const result = enginePayloadToAnalysisResult(payload) as any;
      const candidates = Array.isArray(result.candidates)
        ? result.candidates
        : [];
      const candidateIds = candidates.map((candidate: any) => candidate.candidateId);
      const researchCandidates = candidates.filter(
        (candidate: any) =>
          candidate.sourceKind === "multi_source_research_witness",
      );
      const enrichedCandidates = researchCandidates.filter(
        (candidate: any) => typeof candidate.functionalStatement === "string",
      );

      expect(researchCandidates.length).toBeGreaterThan(0);
      expect(enrichedCandidates.length).toBeGreaterThan(0);
      expect(new Set(candidateIds).size).toBe(candidateIds.length);

      for (const candidate of enrichedCandidates) {
        expect(candidate.functionalStatement).toBe(candidate.semanticBridge);
        expect(candidate.sourceStatus).toBe("research_candidate");
        expect(candidate.claimBoundary).toBe(
          "research_functional_hypothesis_only",
        );
        expect(candidate.userDecisionPosture).toBe("user_decides");
        expect(candidate.functionalComponents).toBeUndefined();
      }
    });
  },
);
