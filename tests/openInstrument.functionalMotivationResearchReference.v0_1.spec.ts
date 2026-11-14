import {
  buildCrossLanguageOperationLedgerV0_2,
} from "@/shared/openInstrument/crossLanguageOperationLedger.v0_2";
import {
  STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_1 as specimen,
} from "@/shared/openInstrument/functionalMotivationResearchReference.v0_1";
import {
  buildSingleWordFunctionalMotivationProposalV0_1,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";

describe("data-driven functional-motivation research reference v0.1", () => {
  it("keeps the approved STUDIM example active and separates claim layers", () => {
    expect(specimen).toMatchObject({
      status: "ACTIVE_METHOD_SPECIMEN",
      referenceId: "sq.standard.studim.two-root-method-specimen.v0_1",
      authorityBoundary: {
        canonicality: "APPROVED_RESEARCH_EXAMPLE_AND_METHOD_ONLY",
        productionAuthority: "NONE",
        sourceAuthorityPromotion: "NONE",
        historicalOrigin: "NOT_CLAIMED",
      },
      target: {
        exactSpelling: "STUDIM",
        language: "Albanian",
        variety: "Standard Albanian",
        selectedMeaning: {
          text: "studying; acquiring knowledge",
          claimLayer: "SOURCE_FACT",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        },
      },
      functionalProposal: {
        roots: [
          { proposedSpelling: "SHTU", proposedFunction: "add / increase", claimLayer: "USER_PROPOSAL" },
          { proposedSpelling: "DI", proposedFunction: "know / knowledge", claimLayer: "USER_PROPOSAL" },
        ],
        synthesis: {
          text: "Increasing or acquiring knowledge through study.",
          claimLayer: "LOGICAL_INFERENCE",
          proposalStatus: "USER_PROPOSED",
          sourceAuthorityPromotion: "NONE",
        },
      },
    });
    expect(specimen.sourceFacts.every((fact) => fact.evidenceStatus === "CITATION_ENTERED_UNVERIFIED")).toBe(true);
  });

  it("reuses SingleWord v0.1 for the exact STU + DI + M proposal and written Voices", () => {
    const result = buildSingleWordFunctionalMotivationProposalV0_1(specimen.singleWordProposalInput);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.proposal.reconstruction).toMatchObject({
      exactConcatenation: "STUDIM",
      targetSpelling: "STUDIM",
      formExactMatch: true,
      formComparison: "EXACT_MATCH",
      comparisonRule: "exact_string_equality_no_normalization_or_repair",
    });
    expect(result.proposal.segments.map((segment) => segment.exactSpelling)).toEqual(["STU", "DI", "M"]);
    expect(result.proposal.segments[2]).toMatchObject({ unresolved: true, proposedMeaning: null, proposedGrammaticalRole: null });
    expect(result.proposal.writtenStructure.voiceEvents.map(({ voice, sourcePosition }) => `${voice}@${sourcePosition}`)).toEqual([
      "U@2",
      "I@4",
    ]);
    expect(result.proposal).toMatchObject({
      strictEmbryoMeaning: { status: "UNKNOWN_OR_NULL", meaning: null },
      compoundAttestation: "NOT_CLAIMED",
      historicalOrigin: "NOT_CLAIMED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(result.proposal.declaredTransformations).toMatchObject([
      { from: "SHTU", to: "STU", status: "USER_DECLARED_UNVERIFIED", appliedToReconstruction: false },
    ]);
  });

  it("reuses the reversible operation ledger for SHTU → STU without assessing linguistic validity", () => {
    const hOmission = specimen.operationLedgers[0]!;
    const result = buildCrossLanguageOperationLedgerV0_2(hOmission.operationLedgerInput);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.ledger).toMatchObject({
      initialForm: "SHTU",
      declaredFinalForm: "STU",
      replayedFinalForm: "STU",
      mechanicalReconstructionStatus: "EXACT_MATCH",
      operationCount: 1,
      totalCost: 1,
      inverseReplay: { status: "EXACT_MATCH", reconstructedInitialForm: "SHTU" },
      relationship: {
        status: "USER_PROPOSED",
        authority: "USER_DECLARED_UNVERIFIED",
        linguisticApplicabilityStatus: "NOT_ASSESSED",
        sourceAuthorityPromotion: "NONE",
      },
    });
    expect(result.ledger.operations[0]).toMatchObject({
      kind: "OMIT",
      before: "SHTU",
      after: "STU",
      positions: [1],
      removedText: "H",
      removedSpan: { start: 1, end: 2 },
      cost: 1,
      inverse: { kind: "REINSERT_REMOVED_TEXT", positions: [1], text: "H" },
    });
    expect(hOmission).toMatchObject({
      ledgerId: "shtu-to-stu-h-omission",
      operationCount: 1,
      mechanicalCost: 1,
      expectedPosition: 1,
      inverseReconstruction: "EXACT_MATCH",
      linguisticApplicability: "NOT_ASSESSED",
    });
  });

  it("keeps STUDIOJ / -IM as a separate alternative and SHTIM from inheriting DI", () => {
    expect(specimen.alternativeReadings).toEqual([
      expect.objectContaining({
        alternativeId: "studioj-im-morphology",
        separateFromProposedSegmentation: true,
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      }),
    ]);
    expect(specimen.contrastCases).toEqual([
      expect.objectContaining({
        exactForm: "SHTIM",
        mustNotInheritRootIds: ["di-knowledge"],
        claimLayer: "UNKNOWN_OR_NULL",
      }),
    ]);
    expect(specimen.unresolvedClaims.map(({ claimId }) => claimId)).toEqual([
      "final-m-function",
      "shtu-linguistic-applicability",
      "historical-origin",
    ]);
    expect(specimen.crossLanguageWitnesses.status).toBe("NOT_ASSERTED");
    expect(specimen.interpretationBoundary).toMatchObject({
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
      embryoMeaning: "UNKNOWN_OR_NULL",
    });
  });
});
