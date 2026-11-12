import {
  buildWholeWordOpaqueFunctionalMotivationV0_2,
  type WholeWordOpaqueFunctionalMotivationInputV0_2,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_2";
import {
  buildSingleWordFunctionalMotivationProposalV0_1,
  type SingleWordFunctionalMotivationInputV0_1,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";

const opaqueBuke: WholeWordOpaqueFunctionalMotivationInputV0_2 = {
  mode: "WHOLE_WORD_OPAQUE",
  targetWord: "BUKË",
  targetLanguage: "Albanian",
  targetDialect: "",
  wholeWordMeaningClaim: "bread; meal",
  sourceEvidenceStatus: "CITATION_ENTERED_UNVERIFIED",
  sourceReference: "https://fjale.al/buk%C3%AB",
  functionalDescription: "",
};

describe("whole-word opaque functional motivation v0.2", () => {
  it("records BUKË without segments and preserves complete written Voice events and provenance", () => {
    const result = buildWholeWordOpaqueFunctionalMotivationV0_2(opaqueBuke);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    const { proposal } = result;
    expect(proposal.schemaVersion).toBe("open-instrument.single-word-functional-motivation.v0_2");
    expect(proposal.mode).toBe("WHOLE_WORD_OPAQUE");
    expect(proposal.target).toEqual({ exactWord: "BUKË", language: "Albanian", dialect: null });
    expect(proposal.proposedComponents).toEqual([]);
    expect(proposal.wholeWordMeaningClaim).toEqual({
      text: "bread; meal",
      status: "USER_PROPOSED",
      enteredBy: "USER",
    });
    expect(proposal.wholeWordSourceEvidence).toEqual({
      status: "CITATION_ENTERED_UNVERIFIED",
      sourceReference: "https://fjale.al/buk%C3%AB",
      enteredBy: "USER",
      independentlyVerifiedByWorkbench: false,
    });
    expect(proposal.componentReconstruction).toMatchObject({
      status: "NOT_APPLICABLE",
      componentCount: 0,
      reasonCode: "WHOLE_WORD_OPAQUE_HAS_NO_PROPOSED_COMPONENTS",
    });
    expect(proposal.internalFunctionalStructure).toMatchObject({ status: "UNKNOWN_OR_NULL", meaning: null });
    expect(proposal.functionalMotivation).toMatchObject({ description: null, status: "UNKNOWN_OR_NULL" });
    expect(proposal.writtenStructure.status).toBe("COMPLETE");
    expect(proposal.writtenStructure.voicePath).toEqual(["U", "Ë"]);
    expect(proposal.writtenStructure.voiceEvents.map((event) => [event.voice, event.sourcePosition])).toEqual([
      ["U", 1],
      ["Ë", 3],
    ]);
    expect(proposal.writtenStructure.voiceEvents.map((event) => event.sourceSpan)).toEqual([
      { start: 1, end: 2 },
      { start: 3, end: 4 },
    ]);
    expect(proposal.writtenStructure.representationAuthority).toBe("orthographic");
    expect(proposal.writtenStructure.pronunciationAuthority).toBe("not_established");
    expect(proposal.sourceAuthorityPromotion).toBe("NONE");
    expect(proposal.noSingleWinner).toBe(true);
    expect(proposal.userDecisionPosture).toBe("user_decides");
  });

  it("keeps a user-proposed description distinct from absent meaning evidence", () => {
    const result = buildWholeWordOpaqueFunctionalMotivationV0_2({
      ...opaqueBuke,
      wholeWordMeaningClaim: "",
      sourceEvidenceStatus: "UNKNOWN_OR_NULL",
      sourceReference: "",
      functionalDescription: "A user-entered whole-word functional reading.",
    });
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.proposal.wholeWordMeaningClaim).toMatchObject({ text: null, status: "UNKNOWN_OR_NULL" });
    expect(result.proposal.wholeWordSourceEvidence).toMatchObject({
      status: "UNKNOWN_OR_NULL",
      sourceReference: null,
      independentlyVerifiedByWorkbench: false,
    });
    expect(result.proposal.functionalMotivation).toMatchObject({
      description: "A user-entered whole-word functional reading.",
      status: "USER_PROPOSED",
      enteredBy: "USER",
    });
  });

  it("rejects a citation without a reference and a reference with Unknown / Null status", () => {
    const missingCitation = buildWholeWordOpaqueFunctionalMotivationV0_2({
      ...opaqueBuke,
      sourceReference: "",
    });
    expect(missingCitation).toMatchObject({
      status: "INVALID",
      reasonCodes: expect.arrayContaining(["WHOLE_WORD_CITATION_REFERENCE_REQUIRED"]),
    });

    const unclassifiedReference = buildWholeWordOpaqueFunctionalMotivationV0_2({
      ...opaqueBuke,
      sourceEvidenceStatus: "UNKNOWN_OR_NULL",
    });
    expect(unclassifiedReference).toMatchObject({
      status: "INVALID",
      reasonCodes: expect.arrayContaining(["WHOLE_WORD_REFERENCE_REQUIRES_CITATION_STATUS"]),
    });
  });

  it("leaves the existing v0.1 segmented builder and mismatch contract intact", () => {
    const segmented: SingleWordFunctionalMotivationInputV0_1 = {
      targetWord: "KANDIL",
      targetLanguage: "Albanian",
      targetDialect: "",
      segments: [
        {
          exactSpelling: "KA",
          proposedMeaning: "has",
          proposedGrammaticalRole: "verb",
          language: "Albanian",
          dialect: "",
          evidenceStatus: "USER_PROPOSED",
          evidenceReference: "",
          unresolved: false,
        },
        {
          exactSpelling: "N",
          proposedMeaning: "",
          proposedGrammaticalRole: "",
          language: "Albanian",
          dialect: "",
          evidenceStatus: "UNKNOWN_OR_NULL",
          evidenceReference: "",
          unresolved: true,
        },
        {
          exactSpelling: "DILL",
          proposedMeaning: "light",
          proposedGrammaticalRole: "noun",
          language: "Albanian",
          dialect: "Gheg",
          evidenceStatus: "USER_PROPOSED",
          evidenceReference: "",
          unresolved: false,
        },
      ],
      unresolvedConnectingMaterial: "N remains unresolved.",
      transformations: [],
      functionalExplanation: "Has light.",
      transparency: "METAPHORICAL",
    };
    const result = buildSingleWordFunctionalMotivationProposalV0_1(segmented);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.proposal.schemaVersion).toBe("open-instrument.single-word-functional-motivation.v0_1");
    expect(result.proposal.segments).toHaveLength(3);
    expect(result.proposal.reconstruction).toMatchObject({
      exactConcatenation: "KANDILL",
      targetSpelling: "KANDIL",
      formComparison: "MISMATCH",
    });
  });
});
