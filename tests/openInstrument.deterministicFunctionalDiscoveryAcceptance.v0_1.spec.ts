import {
  evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1,
  type FunctionalDiscoveryAcceptanceInputV0_1,
} from "../src/shared/openInstrument/deterministicFunctionalDiscoveryAcceptance.v0_1";
import type {
  StructuralHypothesisV0_1,
} from "../src/shared/structuralHypothesisDiscovery.v0_1";

function structuralFixture(): StructuralHypothesisV0_1 {
  return {
    hypothesisVersion: "z-zero.structural-hypothesis.v0_1",
    hypothesisId: "logic-structural:fixture:ER:peel_left_consonant_frame",
    basis: "fixture",
    embryo: "ER",
    embryoSize: 2,
    discoveryStatus: "structural_hypothesis",
    independentStandaloneMeaning: null,
    lexicalAttestation: "not_evaluated",
    functionalSupportStatus: "unknown",
    reductionSteps: [
      {
        from: "FIXTURE",
        to: "ER",
        operationId: "peel_left_consonant_frame",
        reasonCodes: [
          "structural_reduction_applied",
          "left_consonant_frame_preserved",
          "structural_containment_preserved",
          "deterministic_operation_authorized",
          "voice_path_recorded",
        ],
        fromSpan: { start: 0, end: 2 },
        removedOrChanged: "FIX",
        voicePathBefore: ["I"],
        voicePathAfter: ["E"],
      },
    ],
    expansionChain: ["ER", "FIXTURE"],
    reasonCodes: [
      "structural_reduction_applied",
      "structural_containment_preserved",
      "deterministic_operation_authorized",
      "terminal_structural_hypothesis_reached",
      "voice_path_recorded",
      "independent_meaning_unknown",
      "lexical_attestation_not_required_for_discovery",
      "historical_origin_not_claimed",
      "candidate_truth_not_claimed",
      "production_promotion_not_claimed",
    ],
    evidenceRefs: [],
    historicalOriginClaim: "not_claimed",
    historicalTransmissionClaim: "not_claimed",
    winnerClaim: "not_claimed",
    languageSuperiorityClaim: "not_claimed",
    candidateTruthClaim: "not_claimed",
    userDecisionPosture: "user_decides",
  };
}

const boundary = {
  historicalOriginClaim: "not_claimed" as const,
  historicalTransmissionClaim: "not_claimed" as const,
  winnerClaim: "not_claimed" as const,
  languageSuperiorityClaim: "not_claimed" as const,
  candidateTruthClaim: "not_claimed" as const,
};

const alignment = {
  schemaVersion: "open-instrument.semantic-alignment.v0_1" as const,
  targetWord: "fixture",
  targetSenseId: "fixture_sense",
  targetSenseLabel: "a bounded test object",
  structuralHypothesisId: structuralFixture().hypothesisId,
  alignmentStatus: "proposed" as const,
  alignmentSource: "user_asserted_hypothesis" as const,
  semanticBridge:
    "A bounded object can be tested as a functional relation to the structural anchor without asserting lexical truth.",
  doctrineRoles: ["Expansion/Bridge"],
  reasonCodes: [],
};

function completeInput(
  overrides: Partial<FunctionalDiscoveryAcceptanceInputV0_1> = {},
): FunctionalDiscoveryAcceptanceInputV0_1 {
  return {
    candidateId: "candidate:fixture",
    targetWord: "fixture",
    structuralHypothesis: structuralFixture(),
    targetSenseRequirement: "REQUIRED",
    targetSense: {
      id: "fixture_sense",
      label: "a bounded test object",
    },
    functionalStatement: "A bounded object can be tested as a functional relation.",
    functionalComponents: [
      {
        candidateId: "candidate:fixture",
        embryo: "ER",
        language: "test",
        plainMeaning: "bounded relation",
        role: "Expansion/Bridge",
        evidenceState: "research_candidate",
        evidenceRefs: ["research:fixture"],
      },
    ],
    componentRequirement: "required",
    semanticAlignment: alignment,
    semanticBridge: alignment.semanticBridge,
    evidenceState: "research_candidate",
    evidenceRefs: ["research:fixture"],
    claimBoundary: boundary,
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
    proposalProvenance: {
      kind: "research_catalog",
      sourceId: "research:fixture",
    },
    ...overrides,
  };
}

describe("deterministic functional discovery acceptance v0.1", () => {
  test("returns insufficient support for a structural candidate alone", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1({
      ...completeInput(),
      functionalStatement: null,
      functionalComponents: [],
      semanticAlignment: null,
      semanticBridge: null,
      evidenceState: "structural_hypothesis",
      proposalProvenance: {
        kind: "deterministic_static",
      },
    });

    expect(result.decision).toBe("INSUFFICIENT_SUPPORT");
    expect(result.acceptedFunctionalCandidate).toBeUndefined();
    expect(result.reasonCodes).toEqual([
      "FUNCTIONAL_STATEMENT_NOT_BOUND_TO_TARGET_SENSE",
      "MISSING_FUNCTIONAL_COMPONENTS",
      "MISSING_FUNCTIONAL_STATEMENT",
      "MISSING_SEMANTIC_BRIDGE",
    ]);
  });

  test("rejects an explicitly unsupported semantic bridge", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        semanticAlignment: {
          ...alignment,
          alignmentStatus: "rejected",
        },
      }),
    );

    expect(result.decision).toBe("REJECT");
    expect(result.reasonCodes).toContain("UNSUPPORTED_SEMANTIC_BRIDGE");
  });

  test("accepts bounded research support only as a research hypothesis", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput(),
    );

    expect(result.decision).toBe("ACCEPT");
    expect(result.acceptedFunctionalCandidate).toMatchObject({
      admissionScope: "research_hypothesis_only",
      evidenceState: "research_candidate",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(result.reasonCodes).toEqual([
      "RESEARCH_EVIDENCE_NOT_PRODUCTION_AUTHORITY",
    ]);
    expect(result.acceptedFunctionalCandidate?.semanticBridge).toBe(
      alignment.semanticBridge,
    );
  });

  test("rejects a conflicting explicit semantic bridge", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({ semanticBridge: "a different bridge" }),
    );

    expect(result.decision).toBe("REJECT");
    expect(result.reasonCodes).toContain("SEMANTIC_BRIDGE_MISMATCH");
    expect(result.acceptedFunctionalCandidate).toBeUndefined();
  });

  test("accepts reviewed evidence only with existing reviewed authorization", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        evidenceState: "reviewed_accepted",
        functionalComponents: [
          {
            candidateId: "candidate:fixture",
            embryo: "ER",
            language: "test",
            plainMeaning: "bounded relation",
            role: "Expansion/Bridge",
            evidenceState: "reviewed",
            evidenceRefs: ["reviewed:fixture"],
          },
        ],
        proposalProvenance: {
          kind: "reviewed_external_evidence",
          sourceId: "reviewed:fixture",
        },
        evidenceRefs: ["reviewed:fixture"],
        reviewedAuthorization: {
          authorized: true,
          sourceStatus: "reviewed_accepted",
        },
      }),
    );

    expect(result).toMatchObject({
      decision: "ACCEPT",
      reasonCodes: [],
      acceptedFunctionalCandidate: {
        admissionScope: "reviewed_functional_evidence",
      },
    });
  });

  test("rejects provider research-only provenance from reviewed scope", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        evidenceState: "reviewed_accepted",
        functionalComponents: [
          {
            candidateId: "candidate:fixture",
            embryo: "ER",
            language: "test",
            plainMeaning: "bounded relation",
            role: "Expansion/Bridge",
            evidenceState: "reviewed",
            evidenceRefs: ["reviewed:fixture"],
          },
        ],
        proposalProvenance: {
          kind: "provider_proposed_hypothesis",
          providerId: "provider",
          modelId: "model",
          providerAuthorization: "research_only",
        },
        evidenceRefs: ["reviewed:fixture"],
        reviewedAuthorization: {
          authorized: true,
          sourceStatus: "reviewed_accepted",
        },
      }),
    );

    expect(result.decision).toBe("REJECT");
    expect(result.reasonCodes).toContain(
      "PROVIDER_RESEARCH_ONLY_CANNOT_BE_REVIEWED",
    );
    expect(result.acceptedFunctionalCandidate).toBeUndefined();
  });

  test("keeps provider research-only provenance at research scope", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        proposalProvenance: {
          kind: "provider_proposed_hypothesis",
          providerId: "provider",
          modelId: "model",
          providerAuthorization: "research_only",
        },
      }),
    );

    expect(result).toMatchObject({
      decision: "ACCEPT",
      acceptedFunctionalCandidate: {
        admissionScope: "research_hypothesis_only",
        evidenceState: "research_candidate",
      },
    });
  });

  test("allows provider reviewed-production provenance only through reviewed gates", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        evidenceState: "reviewed_accepted",
        functionalComponents: [
          {
            candidateId: "candidate:fixture",
            embryo: "ER",
            language: "test",
            plainMeaning: "bounded relation",
            role: "Expansion/Bridge",
            evidenceState: "reviewed",
            evidenceRefs: ["reviewed:fixture"],
          },
        ],
        proposalProvenance: {
          kind: "provider_proposed_hypothesis",
          providerId: "provider",
          modelId: "model",
          providerAuthorization: "reviewed_production",
        },
        evidenceRefs: ["reviewed:fixture"],
        reviewedAuthorization: {
          authorized: true,
          sourceStatus: "reviewed_accepted",
        },
      }),
    );

    expect(result).toMatchObject({
      decision: "ACCEPT",
      acceptedFunctionalCandidate: {
        admissionScope: "reviewed_functional_evidence",
      },
    });
  });

  test.each(["research_candidate", "unresolved", "unknown_state"])(
    "rejects reviewed scope when a required component is %s",
    (evidenceState) => {
      const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
        completeInput({
          evidenceState: "reviewed_accepted",
          functionalComponents: [
            {
              candidateId: "candidate:fixture",
              embryo: "ER",
              language: "test",
              plainMeaning: "bounded relation",
              role: "Expansion/Bridge",
              evidenceState,
              evidenceRefs: ["reviewed:fixture"],
            },
          ],
          proposalProvenance: {
            kind: "reviewed_external_evidence",
            sourceId: "reviewed:fixture",
          },
          evidenceRefs: ["reviewed:fixture"],
          reviewedAuthorization: {
            authorized: true,
            sourceStatus: "reviewed_accepted",
          },
        }),
      );

      expect(result.decision).toBe("REJECT");
      expect(result.reasonCodes).toContain(
        "REVIEWED_COMPONENT_SUPPORT_REQUIRED",
      );
    },
  );

  test("rejects reviewed status without reviewed authorization", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        evidenceState: "reviewed_accepted",
        proposalProvenance: {
          kind: "research_catalog",
        },
      }),
    );

    expect(result.decision).toBe("REJECT");
    expect(result.reasonCodes).toContain(
      "REVIEWED_EVIDENCE_REQUIRED_FOR_PRODUCTION",
    );
  });

  test("fails closed for missing target-sense binding", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        targetSense: null,
        semanticAlignment: null,
      }),
    );

    expect(result.decision).toBe("REJECT");
    expect(result.reasonCodes).toEqual([
      "FUNCTIONAL_STATEMENT_NOT_BOUND_TO_TARGET_SENSE",
      "MISSING_TARGET_SENSE_WHEN_REQUIRED",
    ]);
  });

  test("rejects cross-candidate component ownership", () => {
    const input = completeInput();
    const component = input.functionalComponents?.[0];
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        functionalComponents: [
          { ...component!, candidateId: "candidate:other" },
        ],
      }),
    );

    expect(result.decision).toBe("REJECT");
    expect(result.reasonCodes).toContain("INVALID_COMPONENT_OWNERSHIP");
  });

  test("rejects missing user_decides and no-single-winner posture", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        userDecisionPosture: "automatic",
        noSingleWinner: false,
      }),
    );

    expect(result.decision).toBe("REJECT");
    expect(result.reasonCodes).toEqual([
      "SINGLE_WINNER_POSTURE_FORBIDDEN",
      "USER_DECIDES_MISSING",
    ]);
  });

  test("rejects unauthorized provider proposals", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(
      completeInput({
        proposalProvenance: {
          kind: "provider_proposed_hypothesis",
          providerId: "provider",
          modelId: "model",
          providerAuthorization: "unauthorized",
        },
      }),
    );

    expect(result.decision).toBe("REJECT");
    expect(result.reasonCodes).toContain("PROVIDER_OUTPUT_NOT_AUTHORIZED");
  });

  test("preserves valid Null as insufficient support", () => {
    const result = evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1({
      ...completeInput(),
      structuralHypothesis: null,
      functionalStatement: null,
      functionalComponents: [],
      semanticAlignment: null,
      semanticBridge: null,
      evidenceState: "not_emitted",
      proposalProvenance: null,
    });

    expect(result.decision).toBe("INSUFFICIENT_SUPPORT");
    expect(result.acceptedFunctionalCandidate).toBeUndefined();
  });

  test("is deterministic for identical input", () => {
    const input = completeInput();
    expect(
      evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(input),
    ).toEqual(
      evaluateDeterministicFunctionalDiscoveryAcceptanceV0_1(input),
    );
  });
});
