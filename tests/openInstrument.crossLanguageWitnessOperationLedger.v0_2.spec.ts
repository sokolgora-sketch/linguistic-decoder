import {
  buildCrossLanguageWitnessOperationLedgerV0_2,
  type CrossLanguageWitnessOperationBindingIdentityV0_2,
} from "@/shared/openInstrument/crossLanguageWitnessOperationLedger.v0_2";

const etaEatBinding: CrossLanguageWitnessOperationBindingIdentityV0_2 = {
  targetComponentIndex: 1,
  targetComponentForm: "ETA",
  targetComponentLanguage: "Albanian",
  targetComponentDialect: "",
  witnessId: "witness-eat",
  witnessForm: "EAT",
  witnessLanguage: "English",
  witnessVariety: "",
};

describe("Cross-language witness-bound operation ledger v0.2", () => {
  it("derives ETA and EAT from the selected component/witness and preserves one transposition", () => {
    const result = buildCrossLanguageWitnessOperationLedgerV0_2({
      attachedIdentity: etaEatBinding,
      currentIdentity: etaEatBinding,
      operations: [{
        applicationId: "eta-to-eat",
        operationId: "TRANSPOSE_ADJACENT.v0_1",
        positions: [1, 2],
      }],
      proposedRelationship: "A user-proposed functional comparison.",
      evidenceReference: "",
    });

    expect(result.status).toBe("BUILT");
    if (result.status !== "BUILT") return;
    expect(result.binding).toEqual(etaEatBinding);
    expect(result.operationLedgerResult.status).toBe("READY");
    if (result.operationLedgerResult.status !== "READY") return;
    expect(result.operationLedgerResult.ledger).toMatchObject({
      initialForm: "ETA",
      declaredFinalForm: "EAT",
      mechanicalReconstructionStatus: "EXACT_MATCH",
      operationCount: 1,
      totalCost: 1,
      voiceConservation: "PRESERVED",
      omittedCanonicalVoices: [],
      inverseReplay: { status: "EXACT_MATCH", reconstructedInitialForm: "ETA" },
      relationship: {
        authority: "USER_DECLARED_UNVERIFIED",
        linguisticApplicabilityStatus: "NOT_ASSESSED",
        sourceAuthorityPromotion: "NONE",
      },
      selection: { mode: "no_single_winner", userDecisionPosture: "user_decides" },
    });
  });

  it("attaches MITA to MAT and retains removed I plus exact reverse replay", () => {
    const mitaMatBinding: CrossLanguageWitnessOperationBindingIdentityV0_2 = {
      targetComponentIndex: 0,
      targetComponentForm: "MITA",
      targetComponentLanguage: "User proposed",
      targetComponentDialect: "",
      witnessId: "witness-mat",
      witnessForm: "MAT",
      witnessLanguage: "User proposed",
      witnessVariety: "",
    };
    const result = buildCrossLanguageWitnessOperationLedgerV0_2({
      attachedIdentity: mitaMatBinding,
      currentIdentity: mitaMatBinding,
      operations: [
        { applicationId: "omit-i", operationId: "OMIT.v0_2", position: 1, expectedRemovedText: "I" },
        { applicationId: "swap-ta", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [1, 2] },
      ],
      proposedRelationship: "User-proposed comparison only.",
      evidenceReference: "https://example.test/entered-not-verified",
    });

    expect(result.status).toBe("BUILT");
    if (result.status !== "BUILT" || result.operationLedgerResult.status !== "READY") return;
    expect(result.operationLedgerResult.ledger).toMatchObject({
      initialForm: "MITA",
      declaredFinalForm: "MAT",
      mechanicalReconstructionStatus: "EXACT_MATCH",
      omittedCanonicalVoices: ["I"],
      inverseReplay: { status: "EXACT_MATCH", reconstructedInitialForm: "MITA" },
      relationship: {
        status: "USER_PROPOSED",
        evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
        evidenceReference: "https://example.test/entered-not-verified",
        authority: "USER_DECLARED_UNVERIFIED",
        linguisticApplicabilityStatus: "NOT_ASSESSED",
      },
    });
    expect(result.operationLedgerResult.ledger.operations[0]).toMatchObject({
      before: "MITA",
      after: "MTA",
      removedText: "I",
      omittedVoiceEvents: [{ voice: "I", position: 1 }],
    });
  });

  it("invalidates the attached result when either selected identity changes", () => {
    const witnessChanged = buildCrossLanguageWitnessOperationLedgerV0_2({
      attachedIdentity: etaEatBinding,
      currentIdentity: { ...etaEatBinding, witnessForm: "ATE" },
      operations: [{ applicationId: "eta-to-eat", operationId: "TRANSPOSE_ADJACENT.v0_1", positions: [1, 2] }],
      proposedRelationship: "Old witness claim.",
      evidenceReference: "https://example.test/old-witness",
    });
    expect(witnessChanged).toMatchObject({
      status: "STALE_BINDING",
      reasonCodes: ["ATTACHED_COMPONENT_OR_WITNESS_IDENTITY_CHANGED"],
    });
    expect(witnessChanged).not.toHaveProperty("operationLedgerResult");

    const componentChanged = buildCrossLanguageWitnessOperationLedgerV0_2({
      attachedIdentity: etaEatBinding,
      currentIdentity: { ...etaEatBinding, targetComponentIndex: 0, targetComponentForm: "DI" },
      operations: [],
      proposedRelationship: "Old component claim.",
      evidenceReference: "https://example.test/old-component",
    });
    expect(componentChanged).toMatchObject({ status: "STALE_BINDING" });
  });

  it("rejects inconsistent binding forms rather than replaying a user-selected free form", () => {
    const result = buildCrossLanguageWitnessOperationLedgerV0_2({
      attachedIdentity: etaEatBinding,
      currentIdentity: { ...etaEatBinding, targetComponentForm: "ETB" },
      operations: [],
      proposedRelationship: "",
      evidenceReference: "",
    });
    expect(result.status).toBe("STALE_BINDING");
  });
});
