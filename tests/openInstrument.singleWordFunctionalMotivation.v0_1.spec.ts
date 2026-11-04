import {
  analyzeStructuralInputV0_2,
} from "@/shared/structuralHypothesisDiscovery.v0_2";
import {
  buildSingleWordFunctionalMotivationProposalV0_1,
  type SingleWordFunctionalMotivationInputV0_1,
} from "@/shared/openInstrument/singleWordFunctionalMotivation.v0_1";

const kandilProposal: SingleWordFunctionalMotivationInputV0_1 = {
  targetWord: "KANDIL",
  targetLanguage: "Albanian",
  targetDialect: "",
  segments: [
    {
      exactSpelling: "KA",
      proposedMeaning: "has",
      proposedGrammaticalRole: "third-person singular verb form",
      language: "Albanian",
      dialect: "",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      evidenceReference: "FJALË, kam, 3sg ka",
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
      proposedMeaning: "sun",
      proposedGrammaticalRole: "noun",
      language: "Albanian",
      dialect: "Gheg",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      evidenceReference: "IE-CoR Cognate Set 491; Albanian Gheg form",
      unresolved: false,
    },
  ],
  unresolvedConnectingMaterial: "N has no established linker role in this proposal.",
  transformations: [{
    from: "LL",
    to: "L",
    explanation: "Proposed contraction needed to reach the target spelling.",
    evidenceReference: "",
  }],
  functionalExplanation: "Has sun / carries light",
  transparency: "METAPHORICAL",
};

describe("single-word functional motivation proposal v0.1", () => {
  it("keeps KANDIL's proposal, exact mismatch, unresolved N, and unverified LL to L declaration together", () => {
    const result = buildSingleWordFunctionalMotivationProposalV0_1(kandilProposal);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.proposal.target).toEqual({ exactWord: "KANDIL", language: "Albanian", dialect: null });
    expect(result.proposal.segments.map((segment) => segment.exactSpelling)).toEqual(["KA", "N", "DILL"]);
    expect(result.proposal.segments.map((segment) => segment.evidence.status)).toEqual([
      "CITATION_ENTERED_UNVERIFIED",
      "UNKNOWN_OR_NULL",
      "CITATION_ENTERED_UNVERIFIED",
    ]);
    expect(result.proposal.segments[0].evidence.independentlyVerifiedByWorkbench).toBe(false);
    expect(result.proposal.segments[1]).toMatchObject({ unresolved: true, proposedMeaning: null, proposedGrammaticalRole: null });
    expect(result.proposal.reconstruction).toMatchObject({
      exactConcatenation: "KANDILL",
      targetSpelling: "KANDIL",
      formExactMatch: false,
      formComparison: "MISMATCH",
    });
    expect(result.proposal.declaredTransformations).toEqual([expect.objectContaining({
      from: "LL",
      to: "L",
      status: "USER_DECLARED_UNVERIFIED",
      appliedToReconstruction: false,
    })]);
    expect(result.proposal.functionalMotivation).toMatchObject({
      explanation: "Has sun / carries light",
      transparency: "METAPHORICAL",
      evidenceStatus: "PROPOSED",
    });
    expect(result.proposal.candidateStatus).toBe("PROPOSED");
    expect(result.proposal.strictEmbryoMeaning).toMatchObject({ status: "UNKNOWN_OR_NULL", meaning: null });
    expect(result.proposal.compoundAttestation).toBe("NOT_CLAIMED");
  });

  it("accepts a generic exact single-word proposal without KANDIL-specific behavior", () => {
    const result = buildSingleWordFunctionalMotivationProposalV0_1({
      ...kandilProposal,
      targetWord: "PËRDO",
      targetLanguage: "Test language",
      segments: [
        { ...kandilProposal.segments[0], exactSpelling: "PËR", language: "Test language", evidenceStatus: "USER_PROPOSED", evidenceReference: "" },
        { ...kandilProposal.segments[1], exactSpelling: "DO", proposedMeaning: "give", proposedGrammaticalRole: "verb", language: "Test language", unresolved: false, evidenceStatus: "UNKNOWN_OR_NULL" },
      ],
      unresolvedConnectingMaterial: "",
      transformations: [],
      functionalExplanation: "A user-entered explanation.",
      transparency: "ATOMIC",
    });
    expect(result.status).toBe("READY");
    if (result.status === "READY") {
      expect(result.proposal.reconstruction).toMatchObject({ exactConcatenation: "PËRDO", formExactMatch: true });
      expect(result.proposal.candidateStatus).toBe("PROPOSED");
    }
  });

  it("retains every written vowel event from the existing orthographic conservation analyzer", () => {
    const expected = analyzeStructuralInputV0_2("KANDIL");
    const result = buildSingleWordFunctionalMotivationProposalV0_1(kandilProposal);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.proposal.writtenStructure.status).toBe("COMPLETE");
    expect(result.proposal.writtenStructure.voicePath).toEqual(["A", "I"]);
    expect(result.proposal.writtenStructure.voiceEvents).toEqual(expected.inputVoiceEvents);
    expect(result.proposal.writtenStructure.eventCount).toBe(2);
    expect(result.proposal.writtenStructure.pronunciationAuthority).toBe("not_established");
  });

  it("keeps missing component evidence as Unknown/Null and never upgrades a cited proposal to Reviewed", () => {
    const result = buildSingleWordFunctionalMotivationProposalV0_1({
      ...kandilProposal,
      segments: kandilProposal.segments.map((segment) => ({
        ...segment,
        evidenceStatus: "UNKNOWN_OR_NULL",
        evidenceReference: "",
      })),
    });
    expect(result.status).toBe("READY");
    if (result.status === "READY") {
      expect(result.proposal.segments.every((segment) => segment.evidence.status === "UNKNOWN_OR_NULL")).toBe(true);
      expect(result.proposal.functionalMotivation.evidenceStatus).toBe("PROPOSED");
      expect(result.proposal.candidateStatus).toBe("PROPOSED");
    }
  });

  it("rejects malformed proposals, unsupported evidence statuses, and citations without references", () => {
    const malformed = buildSingleWordFunctionalMotivationProposalV0_1({
      ...kandilProposal,
      targetWord: "TWO WORDS",
      segments: [kandilProposal.segments[0]],
    });
    expect(malformed).toMatchObject({ status: "INVALID" });

    const reviewed = buildSingleWordFunctionalMotivationProposalV0_1({
      ...kandilProposal,
      segments: kandilProposal.segments.map((segment, index) => index === 0
        ? { ...segment, evidenceStatus: "REVIEWED_ACCEPTED" as never }
        : segment),
    });
    expect(reviewed).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["SEGMENT_1_EVIDENCE_STATUS_UNSUPPORTED"]) });

    const noCitation = buildSingleWordFunctionalMotivationProposalV0_1({
      ...kandilProposal,
      segments: kandilProposal.segments.map((segment, index) => index === 0
        ? { ...segment, evidenceReference: "" }
        : segment),
    });
    expect(noCitation).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["SEGMENT_1_CITATION_REFERENCE_REQUIRED"]) });

    const malformedUnresolved = buildSingleWordFunctionalMotivationProposalV0_1({
      ...kandilProposal,
      segments: kandilProposal.segments.map((segment, index) => index === 1
        ? { ...segment, proposedMeaning: null as never }
        : segment),
    });
    expect(malformedUnresolved).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["SEGMENT_2_MEANING_MALFORMED"]) });

    const crossLanguage = buildSingleWordFunctionalMotivationProposalV0_1({
      ...kandilProposal,
      segments: kandilProposal.segments.map((segment, index) => index === 2
        ? { ...segment, language: "Greek" }
        : segment),
    });
    expect(crossLanguage).toMatchObject({ status: "INVALID", reasonCodes: expect.arrayContaining(["SEGMENT_3_LANGUAGE_MUST_MATCH_TARGET"]) });
  });
});
