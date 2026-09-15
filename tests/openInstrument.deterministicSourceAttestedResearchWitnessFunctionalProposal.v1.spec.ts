import {
  evaluateSourceAttestedFunctionalDiscoveryAcceptanceV0_1,
  type FunctionalDiscoverySourceAttestedAcceptanceInputV0_1,
} from "@/shared/openInstrument/deterministicFunctionalDiscoveryAcceptance.v0_1";
import {
  buildDeterministicSourceAttestedResearchWitnessFunctionalProposalV1,
} from "@/shared/openInstrument/deterministicSourceAttestedResearchWitnessFunctionalProposal.v1";
import {
  discoverSourceAttestedFunctionalWitnessesV0_1,
} from "@/shared/multiSourceFunctionalDiscovery.v0_1";
import {
  buildSourceAttestedFunctionalResearchInputGroupsV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceRegistry.v0_1";
import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";

function sourceAttestedWitness() {
  const groups = buildSourceAttestedFunctionalResearchInputGroupsV0_1({
    targetWord: "love",
    rows: loadMultiSourceFunctionalResearchEvidenceCatalogV0_1(),
  });
  const group = groups[0];

  if (!group) {
    throw new Error("expected an existing source-attested love group");
  }

  const witness = discoverSourceAttestedFunctionalWitnessesV0_1({
    targetWord: "love",
    embryo: group.embryo,
    sources: group.sources,
  })[0];

  if (!witness) {
    throw new Error("expected an existing source-attested love witness");
  }

  return witness;
}

function buildProposal(
  witness = sourceAttestedWitness(),
  targetWord = "love",
) {
  return buildDeterministicSourceAttestedResearchWitnessFunctionalProposalV1({
    witness,
    targetWord,
  });
}

describe(
  "deterministic source-attested research-witness functional proposal v1",
  () => {
    test("accepts an exact-form witness only as research scope", () => {
      const witness = sourceAttestedWitness();
      const result = buildProposal(witness);

      expect(result.decision).toBe("ACCEPT");
      expect(result.acceptance?.acceptedFunctionalCandidate).toMatchObject({
        anchorKind: "source_attested_exact_form",
        anchorId: witness.witnessId,
        admissionScope: "research_hypothesis_only",
        evidenceState: "research_candidate",
        functionalComponents: [],
        noSingleWinner: true,
        userDecisionPosture: "user_decides",
      });
      expect(
        result.acceptance?.acceptedFunctionalCandidate?.structuralHypothesisId,
      ).toBeUndefined();
    });

    test("copies the existing bridge, citations, and provenance", () => {
      const witness = sourceAttestedWitness();
      const result = buildProposal(witness);

      expect(result.proposal?.functionalStatement).toBe(
        witness.semanticBridge,
      );
      expect(result.proposal?.semanticBridge).toBe(witness.semanticBridge);
      expect(result.proposal?.evidenceRefs).toEqual(witness.citationRefs);
      expect(result.proposal?.proposalProvenance).toEqual({
        kind: "research_catalog",
        sourceId: witness.sourceId,
      });
      expect(
        result.acceptance?.acceptedFunctionalCandidate?.evidenceRefs,
      ).toEqual(witness.citationRefs);
    });

    test.each([
      ["fact", "hypothesis"],
      ["inference", "fact"],
      ["hypothesis", "inference"],
    ] as const)(
      "accepts usable truth states: %s/%s",
      (attestationTruth, functionalBridgeTruth) => {
        const witness = sourceAttestedWitness();
        const result = buildProposal({
          ...witness,
          attestationTruth,
          functionalBridgeTruth,
        });

        expect(result.decision).toBe("ACCEPT");
      },
    );

    test.each([
      ["attestationTruth", "unknown", "SOURCE_ATTESTED_ATTESTATION_TRUTH_SUPPORT_REQUIRED"],
      ["functionalBridgeTruth", "unknown", "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE_TRUTH_SUPPORT_REQUIRED"],
    ] as const)(
      "keeps unknown %s insufficient",
      (field, value, reason) => {
        const witness = sourceAttestedWitness();
        const result = buildProposal({ ...witness, [field]: value });

        expect(result.decision).toBe("INSUFFICIENT_SUPPORT");
        expect(result.reasonCodes).toEqual([reason]);
        expect(result.proposal).toBeNull();
        expect(result.acceptance).toBeNull();
      },
    );

    test("fails closed for a missing bridge through shared acceptance", () => {
      const result = buildProposal({
        ...sourceAttestedWitness(),
        semanticBridge: null,
      });

      expect(result.decision).toBe("INSUFFICIENT_SUPPORT");
      expect(result.reasonCodes).toContain("MISSING_SEMANTIC_BRIDGE");
      expect(result.proposal).toBeNull();
    });

    test("rejects missing citations before admission", () => {
      const result = buildProposal({
        ...sourceAttestedWitness(),
        citationRefs: [],
      });

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toEqual([
        "SOURCE_ATTESTED_EVIDENCE_REFS_REQUIRED",
      ]);
    });

    test("rejects non-research source status", () => {
      const result = buildProposal({
        ...sourceAttestedWitness(),
        sourceStatus: "reviewed_candidate",
      });

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toEqual([
        "SOURCE_ATTESTED_MUST_REMAIN_RESEARCH",
      ]);
    });

    test("rejects a source-form mismatch instead of treating it as an anchor", () => {
      const result = buildProposal({
        ...sourceAttestedWitness(),
        sourceForm: "different-form",
      });

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toEqual([
        "SOURCE_ATTESTED_EMBRYO_FORM_MISMATCH",
      ]);
    });

    test("rejects a witness bound to a different analyzed target", () => {
      const result = buildProposal(sourceAttestedWitness(), "hope");

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toEqual([
        "SOURCE_ATTESTED_TARGET_WORD_MISMATCH",
      ]);
    });

    test("requires an independent analyzed target binding", () => {
      const result = buildProposal(sourceAttestedWitness(), "");

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toEqual([
        "SOURCE_ATTESTED_EXPECTED_TARGET_WORD_REQUIRED",
      ]);
    });

    test("does not fabricate target alignment or components", () => {
      const result = buildProposal();

      expect(result.proposal?.targetSenseRequirement).toBe("NOT_APPLICABLE");
      expect(result.proposal?.semanticAlignment).toBeNull();
      expect(result.proposal?.functionalComponents).toEqual([]);
      expect(result.proposal?.componentRequirement).toBe("not_applicable");
    });

    test("rejects claim-boundary violations through shared acceptance", () => {
      const proposal = buildProposal().proposal;

      if (!proposal) {
        throw new Error("expected a valid source-attested proposal");
      }

      const invalid: FunctionalDiscoverySourceAttestedAcceptanceInputV0_1 = {
        ...proposal,
        claimBoundary: {
          ...proposal.claimBoundary,
          winnerClaim: "claimed" as never,
        },
      };
      const result =
        evaluateSourceAttestedFunctionalDiscoveryAcceptanceV0_1(invalid);

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toContain("CLAIM_BOUNDARY_MISSING");
    });

    test("is deterministic for repeated identical input", () => {
      const input = { witness: sourceAttestedWitness(), targetWord: "love" };
      expect(
        buildDeterministicSourceAttestedResearchWitnessFunctionalProposalV1(
          input,
        ),
      ).toEqual(
        buildDeterministicSourceAttestedResearchWitnessFunctionalProposalV1(
          input,
        ),
      );
    });
  },
);
