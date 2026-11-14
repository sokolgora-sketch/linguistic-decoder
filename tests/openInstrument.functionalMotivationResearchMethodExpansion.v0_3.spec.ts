import {
  buildCrossLanguageOperationLedgerV0_2,
  type CrossLanguageOperationLedgerInputV0_2,
} from "@/shared/openInstrument/crossLanguageOperationLedger.v0_2";
import { isInterpretationDecisionPolicyV0_1 } from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";
import {
  FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_SOURCES_V0_3 as sources,
  FUNCTIONAL_MOTIVATION_RESEARCH_METHOD_EXPANSION_V0_3 as extension,
} from "@/shared/openInstrument/functionalMotivationResearchMethodExpansion.v0_3";
import {
  STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2,
} from "@/shared/openInstrument/functionalMotivationResearchReference.v0_2";
import {
  buildSingleWordFunctionalMotivationProposalV0_1,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";

describe("STUDIM / STUDY and GJITHË method expansion v0.3", () => {
  it("reuses the v0.2 STUDIM specimen without changing its unresolved claims or alternatives", () => {
    expect(extension.studimSpecimen).toBe(STUDIM_FUNCTIONAL_MOTIVATION_REFERENCE_V0_2);
    expect(extension.studimSpecimen).toMatchObject({
      referenceId: "sq.standard.studim.two-root-method-specimen.v0_2",
      target: {
        exactSpelling: "STUDIM",
        selectedMeaning: {
          text: "studying; acquiring knowledge",
          evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        },
      },
      writtenStructure: {
        exactCodePoints: [
          { character: "S", position: 0 },
          { character: "T", position: 1 },
          { character: "U", position: 2 },
          { character: "D", position: 3 },
          { character: "I", position: 4 },
          { character: "M", position: 5 },
        ],
        writtenVoices: [
          { voice: "U", position: 2 },
          { voice: "I", position: 4 },
        ],
      },
      functionalProposal: {
        synthesis: {
          text: "Increasing or acquiring knowledge through study.",
          claimLayer: "LOGICAL_INFERENCE",
          proposalStatus: "USER_PROPOSED",
          sourceAuthorityPromotion: "NONE",
        },
      },
      exactSegmentation: {
        exactConcatenation: "STUDIM",
        unresolvedComponents: ["M: function unresolved"],
      },
      alternativeReadings: [
        expect.objectContaining({
          alternativeId: "studioj-im-morphology",
          separateFromProposedSegmentation: true,
        }),
      ],
      contrastCases: [
        expect.objectContaining({
          exactForm: "SHTIM",
          mustNotInheritRootIds: ["di-knowledge"],
        }),
      ],
      unresolvedClaims: [
        expect.objectContaining({ claimId: "final-m-function", claimLayer: "UNKNOWN_OR_NULL" }),
        expect.objectContaining({ claimId: "shtu-linguistic-applicability", claimLayer: "UNKNOWN_OR_NULL" }),
        expect.objectContaining({ claimId: "historical-origin", claimLayer: "UNKNOWN_OR_NULL" }),
      ],
    });
    expect(extension.studimSpecimen.functionalProposal.roots[0]).toMatchObject({
      proposedSpelling: "SHTU",
      proposedFunction: "add / increase",
      claimLayer: "USER_PROPOSAL",
    });
    expect(extension.studimSpecimen.functionalProposal.roots[1]).toMatchObject({
      proposedSpelling: "DI",
      proposedFunction: "know / knowledge",
      claimLayer: "USER_PROPOSAL",
    });
  });

  it("compares only the selected STUDIM / STUDY learning senses and preserves Y", () => {
    const comparison = extension.studyComparison;
    expect(comparison.albanian.exactSpelling).toBe("STUDIM");
    expect(comparison.english.exactSpelling).toBe("STUDY");
    expect(comparison.albanian.exactCodePoints.map(({ character, position }) => character + position))
      .toEqual(["S0", "T1", "U2", "D3", "I4", "M5"]);
    expect(comparison.english.exactCodePoints.map(({ character, position }) => character + position))
      .toEqual(["S0", "T1", "U2", "D3", "Y4"]);
    expect(comparison.albanian.writtenVoiceEvents).toEqual([
      { voice: "U", position: 2 },
      { voice: "I", position: 4 },
    ]);
    expect(comparison.english.writtenVoiceEvents).toEqual([
      { voice: "U", position: 2 },
      { voice: "Y", position: 4 },
    ]);
    expect(comparison.sharedWrittenSequence).toMatchObject({
      exactSequence: "STUD",
      albanianSpan: { start: 0, end: 4 },
      englishSpan: { start: 0, end: 4 },
      interpretation: "OBSERVED_ORTHOGRAPHIC_SEQUENCE_ONLY",
      rootOrHistoricalRelationship: "NOT_CLAIMED",
    });
    expect(comparison.selectedSenseRelation.claimLayer).toBe("LOGICAL_INFERENCE");
    expect(comparison.mechanicalCorrespondence).toMatchObject({
      status: "NOT_ASSERTED",
      operationLedgerInput: null,
      reasonCode: "SELECTED_SENSE_COMPARISON_DOES_NOT_ASSERT_WORD_RECONSTRUCTION",
    });
    expect(comparison.proposedComponents).toEqual([]);
    expect(comparison.excludedEnglishSenseExamples.length).toBeGreaterThan(0);
    expect(comparison.authorityBoundary).toMatchObject({
      translationEquivalence: "SELECTED_SENSE_ONLY",
      historicalOrigin: "NOT_CLAIMED",
      sourceAuthorityPromotion: "NONE",
      userDecisionPosture: "user_decides",
    });
  });

  it("replays GJITHË + ÇKA with exact code-point, Voice-loss, cost, and inverse accounting", () => {
    const input = extension.gjithckaCase.operationLedgerInput;
    expect(input).toMatchObject({
      initialForm: "GJITHËÇKA",
      declaredFinalForm: "GJITHÇKA",
      operations: [
        {
          operationId: "OMIT.v0_2",
          position: 5,
          expectedRemovedText: "Ë",
        },
      ],
    });
    expect(extension.gjithckaCase.components.map(({ exactSpelling, codePointSpan }) => ({
      exactSpelling,
      codePointSpan,
    }))).toEqual([
      { exactSpelling: "GJITHË", codePointSpan: { start: 0, end: 6 } },
      { exactSpelling: "ÇKA", codePointSpan: { start: 6, end: 9 } },
    ]);
    expect(extension.gjithckaCase.target.exactCodePoints.map(({ character, position }) => character + position))
      .toEqual(["G0", "J1", "I2", "T3", "H4", "Ç5", "K6", "A7"]);
    expect(extension.gjithckaCase.target.writtenVoiceEvents).toEqual([
      { voice: "I", position: 2 },
      { voice: "A", position: 7 },
    ]);
    expect(extension.gjithckaCase.functionalReading).toMatchObject({
      text: "all + what/that which → everything",
      claimLayer: "LOGICAL_INFERENCE",
      interpretationStatus: "USER_PROPOSED",
      sourceAuthorityPromotion: "NONE",
    });

    const result = buildCrossLanguageOperationLedgerV0_2(input);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.ledger).toMatchObject({
      initialForm: "GJITHËÇKA",
      declaredFinalForm: "GJITHÇKA",
      replayedFinalForm: "GJITHÇKA",
      mechanicalReconstructionStatus: "EXACT_MATCH",
      positionUnit: "zero_based_unicode_code_point",
      spanConvention: "half_open",
      operationCount: 1,
      totalCost: 1,
      voiceConservation: "CHANGED",
      omittedCanonicalVoices: ["Ë"],
      inverseReplay: {
        status: "EXACT_MATCH",
        reconstructedInitialForm: "GJITHËÇKA",
      },
      relationship: {
        status: "USER_PROPOSED",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        authority: "USER_DECLARED_UNVERIFIED",
        linguisticApplicabilityStatus: "NOT_ASSESSED",
        sourceAuthorityPromotion: "NONE",
      },
      selection: {
        mode: "no_single_winner",
        selectedCandidateId: null,
        userDecisionPosture: "user_decides",
      },
    });
    expect(result.ledger.initialWrittenVoices.events.map(({ voice, position }) => voice + "@" + position))
      .toEqual(["I@2", "Ë@5", "A@8"]);
    expect(result.ledger.finalWrittenVoices.events.map(({ voice, position }) => voice + "@" + position))
      .toEqual(["I@2", "A@7"]);
    expect(result.ledger.operations[0]).toMatchObject({
      kind: "OMIT",
      before: "GJITHËÇKA",
      after: "GJITHÇKA",
      positions: [5],
      removedText: "Ë",
      removedSpan: { start: 5, end: 6 },
      originalInputSpan: { start: 5, end: 6 },
      cost: 1,
      inverse: { kind: "REINSERT_REMOVED_TEXT", positions: [5], text: "Ë" },
      omittedVoiceEvents: [
        {
          voice: "Ë",
          position: 5,
          originalInputSpan: { start: 5, end: 6 },
        },
      ],
    });
  });

  it("keeps the GJITHË-family spellings and scholarly reports distinct", () => {
    const [gjithmone, gjithnje, gjithekombetar] = extension.familyContrasts;
    expect(sources.find(({ sourceId }) => sourceId === "myrta-2014-elbasanishtja")?.locator)
      .toBe("Myrta 2014, section 2.3.1.2, ‘Drejtshkrimi i zanores ë paratheksore’, printed page 102, compound table: gjithë + çka → gjithçka; gjithë + një → gjithnjë; gjithë + mo(t)në → gjithmonë; gjithë + kombëtar → gjithëkombëtar. The table is discussed in relation to Kolec Topalli (2011), printed page 272; this source record is Myrta’s report, not a direct Topalli source record.");
    expect(gjithmone?.target.exactSpelling).toBe("GJITHMONË");
    expect(gjithmone?.sourceReportedFormation.exactNotation).toBe("gjithë + mo(t)në → gjithmonë");
    expect(gjithmone?.mechanicalAuditInput).toBeNull();
    expect(gjithmone?.mechanicalAuditReasonCode).toBe("PARENTHETICAL_T_IS_SOURCE_NOTATION_NOT_A_FROZEN_FORM");

    expect(gjithnje?.target.exactSpelling).toBe("GJITHNJË");
    expect(gjithnje?.sourceReportedFormation.exactNotation).toBe("gjithë + një → gjithnjë");
    expect(gjithnje?.mechanicalAuditInput).not.toBeNull();
    const audit = buildCrossLanguageOperationLedgerV0_2(gjithnje!.mechanicalAuditInput!);
    expect(audit.status).toBe("READY");
    if (audit.status === "READY") {
      expect(audit.ledger).toMatchObject({
        initialForm: "GJITHËNJË",
        declaredFinalForm: "GJITHNJË",
        mechanicalReconstructionStatus: "EXACT_MATCH",
        totalCost: 1,
        omittedCanonicalVoices: ["Ë"],
        inverseReplay: { status: "EXACT_MATCH", reconstructedInitialForm: "GJITHËNJË" },
        relationship: {
          authority: "USER_DECLARED_UNVERIFIED",
          linguisticApplicabilityStatus: "NOT_ASSESSED",
          sourceAuthorityPromotion: "NONE",
        },
      });
    }

    expect(gjithekombetar?.target.exactSpelling).toBe("GJITHËKOMBËTAR");
    expect(gjithekombetar?.sourceReportedFormation.exactNotation)
      .toBe("gjithë + kombëtar → gjithëkombëtar");
    expect(gjithekombetar?.sourceReportsUnstressedEStatus).toBe("RETAINED_IN_LISTED_FORM");
    expect(gjithekombetar?.sourceDiscussedAlternativeSpelling).toMatchObject({
      exactSpelling: "gjithkombëtar",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
    });
    expect(gjithekombetar?.mechanicalAuditInput).toBeNull();
    expect(extension.orthographicGeneralization.status).toBe("NOT_ASSERTED");
  });

  it("rejects unsupported operations, automatic selection, and unearned source authority", () => {
    const unsupportedOperationInput: CrossLanguageOperationLedgerInputV0_2 = {
      initialForm: "STUDIM",
      declaredFinalForm: "STUDY",
      operations: [
        {
          applicationId: "invented-i-to-y",
          operationId: "SUBSTITUTE_I_TO_Y",
          position: 4,
          expectedRemovedText: "I",
        } as never,
      ],
      proposedRelationship: "Unsupported spelling substitution.",
      evidenceReference: "",
    };
    const unsupportedOperation = buildCrossLanguageOperationLedgerV0_2(unsupportedOperationInput);
    expect(unsupportedOperation.status).toBe("INVALID");
    if (unsupportedOperation.status === "INVALID") {
      expect(unsupportedOperation.reasonCodes).toContain("APPLICATION_1_OPERATION_UNSUPPORTED");
    }

    const undeclaredVoiceEquivalence = buildCrossLanguageOperationLedgerV0_2({
      initialForm: "STUDIM",
      declaredFinalForm: "STUDY",
      operations: [
        { applicationId: "remove-final-m", operationId: "OMIT.v0_2", position: 5, expectedRemovedText: "M" },
      ],
      proposedRelationship: "Mechanical comparison only.",
      evidenceReference: "",
    });
    expect(undeclaredVoiceEquivalence.status).toBe("READY");
    if (undeclaredVoiceEquivalence.status === "READY") {
      expect(undeclaredVoiceEquivalence.ledger.replayedFinalForm).toBe("STUDI");
      expect(undeclaredVoiceEquivalence.ledger.mechanicalReconstructionStatus).toBe("MISMATCH");
      expect(undeclaredVoiceEquivalence.ledger.finalWrittenVoices.path).toEqual(["U", "I"]);
    }

    expect(isInterpretationDecisionPolicyV0_1({
      ...extension.functionalMotivationBoundary.interpretationDecisionPolicy,
    })).toBe(true);
    expect(isInterpretationDecisionPolicyV0_1({
      ...extension.functionalMotivationBoundary.interpretationDecisionPolicy,
      automaticInterpretationSelection: "ENABLED",
    })).toBe(false);
    expect(extension.authorityBoundary).toMatchObject({
      productionAuthority: "NONE",
      sourceAuthorityPromotion: "NONE",
      automaticSemanticPrediction: "NONE",
      historicalOrigin: "NOT_CLAIMED",
    });
    expect(sources.every((source) =>
      source.citationStatus === "CITATION_ENTERED_UNVERIFIED" &&
      source.licensingStatus === "NOT_ASSESSED"
    )).toBe(true);

    const promotedSegment = {
      ...extension.studimSpecimen.singleWordProposalInput.segments[0]!,
      evidenceStatus: "REVIEWED_ACCEPTED",
    };
    const noPromotion = buildSingleWordFunctionalMotivationProposalV0_1({
      ...extension.studimSpecimen.singleWordProposalInput,
      segments: [
        promotedSegment as never,
        ...extension.studimSpecimen.singleWordProposalInput.segments.slice(1),
      ],
    });
    expect(noPromotion.status).toBe("INVALID");
  });

  it("replays all declared audits deterministically", () => {
    const auditInputs = [
      extension.gjithckaCase.operationLedgerInput,
      extension.familyContrasts[1].mechanicalAuditInput,
    ];

    for (const input of auditInputs) {
      if (input === null) throw new Error("Expected declared mechanical audit input.");
      const first = buildCrossLanguageOperationLedgerV0_2(input);
      const second = buildCrossLanguageOperationLedgerV0_2(input);
      expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    }
  });
});
