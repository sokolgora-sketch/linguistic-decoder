import {
  buildWordSpecificFunctionalDepthV0_1,
  isWordSpecificFunctionalDepthV0_1,
  WordSpecificFunctionalDepthContractSchema,
} from "@/shared/openInstrument/wordSpecificFunctionalDepth.v0_1";

const claimBoundary = {
  historicalOriginClaim: "not_claimed" as const,
  historicalTransmissionClaim: "not_claimed" as const,
  winnerClaim: "not_claimed" as const,
  languageSuperiorityClaim: "not_claimed" as const,
  linguisticOwnershipClaim: "not_claimed" as const,
  candidateTruthClaim: "not_claimed" as const,
  structuralOutputIsCandidateTruth: false as const,
  nullIsValid: true as const,
};

const reviewedStatus = {
  schemaVersion: "open-instrument.analysis-status.v0_1" as const,
  status: "reviewed_functional_evidence" as const,
  summary: "reviewed",
  reviewedOperators: [],
  candidateOnlyOperators: [],
  researchHypothesisEmbryos: [],
  structuralTokens: ["STUDY"],
  claimBoundary,
  userDecisionPosture: "user_decides" as const,
};

function reviewedCandidate(id: string, form: string) {
  return {
    id,
    form,
    sourceKind: "reviewed_dictionary_source",
    sourceStatus: "reviewed_accepted",
    claimType: "functionalMotivation",
    validationOutcome: "validated",
    functionalStatement: `${form} provides a bounded functional motivation`,
    semanticBridge: `${form} has a bounded functional bridge`,
    evidenceRefs: [`${id}:citation`],
    claimBoundary: "functional motivation evidence only; not historical origin",
    embryo: form.toUpperCase(),
    expansionChain: [form.toUpperCase(), "TARGET"],
    userDecisionPosture: "user_decides",
  };
}

describe("word-specific functional depth v0.1", () => {
  it("qualifies reviewed functional results without changing candidate multiplicity", () => {
    const depth = buildWordSpecificFunctionalDepthV0_1({
      word: "study",
      analysisStatus: reviewedStatus,
      candidates: [
        reviewedCandidate("di", "di"),
        reviewedCandidate("di-2", "di-2"),
        {
          id: "structural",
          form: "DI",
          sourceKind: "logic_derived_structural_hypothesis",
          claimType: "structuralHypothesis",
          validationOutcome: "not_evaluated",
        },
      ],
    });

    expect(depth.status).toBe("reviewed_functional_evidence");
    expect(depth.authorityClass).toBe("reviewed_functional");
    expect(depth.results.map((result) => result.candidateId)).toEqual(["di", "di-2"]);
    expect(depth.noSingleWinner).toBe(true);
    expect(depth.userDecisionPosture).toBe("user_decides");
    expect(WordSpecificFunctionalDepthContractSchema.parse(depth)).toEqual(depth);
    expect(isWordSpecificFunctionalDepthV0_1(depth)).toBe(true);
  });

  it("keeps lexical and structural candidates out of word-specific functional depth", () => {
    const depth = buildWordSpecificFunctionalDepthV0_1({
      word: "sea",
      analysisStatus: {
        ...reviewedStatus,
        status: "structural_unreviewed",
      },
      candidates: [
        {
          id: "structural-sea",
          form: "EA",
          sourceKind: "logic_derived_structural_hypothesis",
          claimType: "structuralHypothesis",
          validationOutcome: "not_evaluated",
        },
        {
          id: "lexical-sea",
          form: "det",
          sourceKind: "multi_source_research_witness",
          sourceStatus: "research_candidate",
          claimType: "unresolved",
          evidenceBasis: "lexical_equivalence",
          evidenceRefs: ["lexical-sea:citation"],
          claimBoundary: "lexical_source_evidence_only",
        },
      ],
    });

    expect(depth.status).toBeNull();
    expect(depth.authorityClass).toBeNull();
    expect(depth.results).toEqual([]);
    expect(depth.nullReason).toBe("no_supported_word_specific_functional_motivation");
    expect(WordSpecificFunctionalDepthContractSchema.parse(depth)).toEqual(depth);
  });

  it("requires the existing research-functional gates for research depth", () => {
    const researchStatus = {
      ...reviewedStatus,
      status: "research_functional_hypothesis" as const,
    };
    const candidate = {
      id: "research-witness",
      form: "witness",
      sourceKind: "multi_source_research_witness",
      sourceStatus: "research_candidate",
      claimType: "functionalMotivation",
      evidenceBasis: "functional_correspondence",
      attestationTruth: "fact",
      functionalBridgeTruth: "hypothesis",
      claimBoundary: "research_functional_hypothesis_only",
      targetWord: "arbitrary",
      semanticBridge: "an independently bounded functional bridge",
      evidenceRefs: ["research-witness:citation"],
      userDecisionPosture: "user_decides",
    };

    const qualified = buildWordSpecificFunctionalDepthV0_1({
      word: "arbitrary",
      analysisStatus: researchStatus,
      candidates: [candidate],
    });
    expect(qualified.status).toBe("research_functional_hypothesis");

    const lexicalOnly = buildWordSpecificFunctionalDepthV0_1({
      word: "arbitrary",
      analysisStatus: researchStatus,
      candidates: [{ ...candidate, evidenceBasis: "lexical_equivalence" }],
    });
    expect(lexicalOnly.status).toBeNull();
  });
});
