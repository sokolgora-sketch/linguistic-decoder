import {
  buildCrossLanguageOperationLedgerV0_2,
  CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_2,
  type CrossLanguageOperationLedgerInputV0_2,
} from "@/shared/openInstrument/crossLanguageOperationLedger.v0_2";

function makeLedger(overrides: Partial<CrossLanguageOperationLedgerInputV0_2> = {}) {
  return buildCrossLanguageOperationLedgerV0_2({
    initialForm: "MITA",
    declaredFinalForm: "MAT",
    operations: [
      { applicationId: "omit-i", operationId: "OMIT.v0_2", position: 1, expectedRemovedText: "I" },
      { applicationId: "swap-ta", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [1, 2] },
    ],
    proposedRelationship: "A user-proposed comparison only.",
    evidenceReference: "",
    ...overrides,
  });
}

describe("Cross-language reversible operation ledger v0.2", () => {
  it("adds OMIT without changing the v0.1 operation definitions", () => {
    expect(CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_2).toEqual([
      { operationId: "IDENTITY.v0_1", kind: "IDENTITY", version: "0.1", positionUnit: "none", cost: 0 },
      { operationId: "TRANSPOSE_ADJACENT.v0_1", kind: "TRANSPOSE_ADJACENT", version: "0.1", positionUnit: "zero_based_unicode_code_point", cost: 1 },
      { operationId: "OMIT.v0_2", kind: "OMIT", version: "0.2", positionUnit: "zero_based_unicode_code_point", cost: 1, removedCodePointsPerApplication: 1 },
    ]);
  });

  it("records MITA → MTA → MAT, omitted I, Voice change and exact reverse replay", () => {
    const result = makeLedger();
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    expect(result.ledger).toMatchObject({
      initialForm: "MITA",
      declaredFinalForm: "MAT",
      replayedFinalForm: "MAT",
      mechanicalReconstructionStatus: "EXACT_MATCH",
      operationCount: 2,
      totalCost: 2,
      initialWrittenVoices: { status: "COMPLETE", path: ["I", "A"] },
      finalWrittenVoices: { status: "COMPLETE", path: ["A"] },
      voiceConservation: "CHANGED",
      omittedCanonicalVoices: ["I"],
      inverseReplay: {
        status: "EXACT_MATCH",
        reconstructedInitialForm: "MITA",
        applications: [
          { kind: "TRANSPOSE_ADJACENT", before: "MAT", after: "MTA", positions: [1, 2], status: "APPLIED" },
          { kind: "REINSERT_REMOVED_TEXT", before: "MTA", after: "MITA", positions: [1], text: "I", status: "APPLIED" },
        ],
      },
      relationship: {
        status: "USER_PROPOSED",
        authority: "USER_DECLARED_UNVERIFIED",
        linguisticApplicabilityStatus: "NOT_ASSESSED",
        sourceAuthorityPromotion: "NONE",
      },
      selection: { mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" },
    });
    expect(result.ledger.operations[0]).toMatchObject({
      kind: "OMIT",
      before: "MITA",
      after: "MTA",
      removedText: "I",
      removedSpan: { start: 1, end: 2 },
      originalInputSpan: { start: 1, end: 2 },
      omittedVoiceEvents: [{ voice: "I", position: 1, sourceSpan: { start: 1, end: 2 }, originalInputSpan: { start: 1, end: 2 } }],
      inverse: { kind: "REINSERT_REMOVED_TEXT", positions: [1], text: "I" },
    });
    expect(result.ledger.operations.map((operation) => [operation.before, operation.after])).toEqual([
      ["MITA", "MTA"],
      ["MTA", "MAT"],
    ]);
  });

  it("preserves ETA → EAT as one cost-1 transposition with no omitted Voice", () => {
    const result = makeLedger({
      initialForm: "ETA",
      declaredFinalForm: "EAT",
      operations: [{ applicationId: "swap-ta", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [1, 2] }],
      proposedRelationship: "A user-proposed comparison.",
    });
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.ledger).toMatchObject({
      replayedFinalForm: "EAT",
      mechanicalReconstructionStatus: "EXACT_MATCH",
      operationCount: 1,
      totalCost: 1,
      initialWrittenVoices: { path: ["E", "A"] },
      finalWrittenVoices: { path: ["E", "A"] },
      voiceConservation: "PRESERVED",
      omittedCanonicalVoices: [],
      inverseReplay: { status: "EXACT_MATCH", reconstructedInitialForm: "ETA" },
    });
  });

  it("rejects the wrong expected code point and out-of-range positions", () => {
    const wrongCharacter = makeLedger({
      operations: [{ applicationId: "omit-i", operationId: "OMIT.v0_2", position: 1, expectedRemovedText: "X" }],
    });
    expect(wrongCharacter.status).toBe("REJECTED");
    if (wrongCharacter.status === "REJECTED") {
      expect(wrongCharacter.reasonCodes).toContain("OMIT_EXPECTED_TEXT_MISMATCH");
      expect(wrongCharacter.reasonCodes).not.toContain("PREVIOUS_APPLICATION_REJECTED");
      expect(wrongCharacter.ledger.operations[0]).toMatchObject({ status: "REJECTED", after: null, removedText: null });
      expect(wrongCharacter.ledger.voiceConservation).toBe("UNKNOWN_OR_NULL");
    }

    const outOfRange = makeLedger({
      operations: [{ applicationId: "omit-i", operationId: "OMIT.v0_2", position: 4, expectedRemovedText: "I" }],
    });
    expect(outOfRange.status).toBe("REJECTED");
    if (outOfRange.status === "REJECTED") expect(outOfRange.reasonCodes).toContain("OMIT_POSITION_OUT_OF_RANGE");
  });

  it("rejects an omission that splits a Unicode combining sequence", () => {
    const result = makeLedger({
      initialForm: "E\u0301TA",
      declaredFinalForm: "\u0301TA",
      operations: [{ applicationId: "omit-e", operationId: "OMIT.v0_2", position: 0, expectedRemovedText: "E" }],
    });
    expect(result.status).toBe("REJECTED");
    if (result.status === "REJECTED") expect(result.reasonCodes).toContain("OMIT_WOULD_SPLIT_UNICODE_COMBINING_SEQUENCE");
  });

  it("uses Unicode code-point coordinates and preserves the exact source span", () => {
    const result = makeLedger({
      initialForm: "😀AI",
      declaredFinalForm: "😀A",
      operations: [{ applicationId: "omit-i", operationId: "OMIT.v0_2", position: 2, expectedRemovedText: "I" }],
    });
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;
    expect(result.ledger.operations[0]).toMatchObject({
      before: "😀AI",
      after: "😀A",
      positions: [2],
      removedSpan: { start: 2, end: 3 },
      originalInputSpan: { start: 2, end: 3 },
    });
  });

  it("keeps an undeclared spelling change mismatched and never calls changed Voices preserved", () => {
    const undeclared = makeLedger({ operations: [] });
    expect(undeclared.status).toBe("READY");
    if (undeclared.status === "READY") {
      expect(undeclared.ledger).toMatchObject({
        replayedFinalForm: "MITA",
        declaredFinalForm: "MAT",
        mechanicalReconstructionStatus: "MISMATCH",
        inverseReplay: { status: "EXACT_MATCH", reconstructedInitialForm: "MITA" },
      });
    }

    const changedVoices = makeLedger({
      operations: [{ applicationId: "omit-i", operationId: "OMIT.v0_2", position: 1, expectedRemovedText: "I" }],
      declaredFinalForm: "MTA",
    });
    expect(changedVoices.status).toBe("READY");
    if (changedVoices.status === "READY") {
      expect(changedVoices.ledger.voiceConservation).toBe("CHANGED");
      expect(changedVoices.ledger.operations[0]?.voiceConservation).toBe("CHANGED");
      expect(changedVoices.ledger.voiceConservation).not.toBe("PRESERVED");
    }
  });
});
