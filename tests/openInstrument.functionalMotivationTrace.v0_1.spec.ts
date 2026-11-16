import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1,
} from "@/ui/instrument/sections/functionalMotivationMethodExamplesAdapter.v0_1";
import { projectFunctionalMotivationTraceV0_1 } from "@/shared/openInstrument/functionalMotivationTrace.v0_1";

const cases = [
  {
    id: "STUDIM" as const,
    input: FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.STUDIM,
    equation: "SHTU (proposed increase function) + DI (know / knowledge) → Increasing or acquiring knowledge → STUDIM (the activity of studying)",
    reconstruction: "STU + DI + M = STUDIM · target STUDIM",
    reconstructionStatus: "EXACT_MATCH",
    voices: ["U@2", "I@4"],
    operation: {
      before: "SHTU", after: "STU", position: 1, removed: "H", omittedVoice: null,
      voicesBefore: ["U@3"], voicesAfter: ["U@2"],
    },
  },
  {
    id: "GJITHÇKA" as const,
    input: FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.GJITHÇKA,
    equation: "GJITHË (all / whole) + ÇKA (what / that which) → everything → GJITHÇKA (all things; everything)",
    reconstruction: "GJITHË + ÇKA = GJITHËÇKA · target GJITHÇKA",
    reconstructionStatus: "MISMATCH",
    voices: ["I@2", "A@7"],
    operation: {
      before: "GJITHËÇKA", after: "GJITHÇKA", position: 5, removed: "Ë", omittedVoice: "Ë@5",
      voicesBefore: ["I@2", "Ë@5", "A@8"], voicesAfter: ["I@2", "A@7"],
    },
  },
];

describe.each(cases)("shared functional-motivation trace projector: $id", (fixture) => {
  it("projects the equation, exact form, operation ledger, evidence boundaries and alternatives", () => {
    const result = projectFunctionalMotivationTraceV0_1(fixture.input);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    const { projection } = result;
    expect(projection.schemaVersion).toBe("open-instrument.functional-motivation-trace.v0_1");
    expect(projection.motivationEquation.equation).toBe(fixture.equation);
    expect(projection.target.writtenVoices).toEqual(fixture.voices);
    expect(projection.reconstruction.text).toBe(fixture.reconstruction);
    expect(projection.reconstruction.status).toBe(fixture.reconstructionStatus);
    expect(projection.reasoningTrace.length).toBeGreaterThan(0);
    expect(projection.operations).toHaveLength(1);
    expect(projection.operations[0]).toMatchObject({
      before: fixture.operation.before,
      after: fixture.operation.after,
      position: fixture.operation.position,
      removedText: fixture.operation.removed,
      operationCount: 1,
      cost: 1,
      kind: "OMIT",
      voicesBefore: fixture.operation.voicesBefore,
      voicesAfter: fixture.operation.voicesAfter,
      mechanicalStatus: "EXACT_MATCH",
      inverseStatus: "EXACT_MATCH",
      inverseForm: fixture.operation.before,
      authority: "USER_DECLARED_UNVERIFIED",
      linguisticApplicability: "NOT_ASSESSED",
    });
    expect(projection.operations[0]?.ledger.operations).toHaveLength(1);
    expect(projection.operations[0]?.ledger.operations[0]).toMatchObject({
      sequence: 1,
      before: fixture.operation.before,
      after: fixture.operation.after,
      positions: [fixture.operation.position],
      removedText: fixture.operation.removed,
      cost: 1,
      status: "APPLIED",
      inverse: {
        kind: "REINSERT_REMOVED_TEXT",
        positions: [fixture.operation.position],
        text: fixture.operation.removed,
      },
    });
    expect(projection.operations[0]?.ledger.inverseReplay).toMatchObject({
      status: "EXACT_MATCH",
      reconstructedInitialForm: fixture.operation.before,
    });
    expect(projection.operations[0]?.ledger.relationship.sourceAuthorityPromotion).toBe("NONE");
    if (fixture.operation.omittedVoice) {
      expect(projection.operations[0]?.omittedVoices).toContain(fixture.operation.omittedVoice);
    }
    expect(projection.sources.length).toBeGreaterThan(0);
    expect(projection.sources.every((source) =>
      source.citationStatus === "CITATION_ENTERED_UNVERIFIED" && source.licensingStatus === "NOT_ASSESSED",
    )).toBe(true);
    expect(projection.alternatives.length).toBeGreaterThan(0);
    expect(projection.selection).toEqual({
      mode: "no_single_winner",
      selectedCandidateId: null,
      userDecisionPosture: "user_decides",
    });
    expect(projection.interpretationDecisionPolicy.automaticInterpretationSelection).toBe("DISABLED");
    expect(projection.sourceAuthorityPromotion).toBe("NONE");
    expect(projection.productionAuthority).toBe("NONE");
    expect(projection.historicalOrigin).toBe("NOT_CLAIMED");
    expect(projectFunctionalMotivationTraceV0_1(fixture.input)).toEqual(result);
  });
});

describe("functional-motivation trace specimen boundaries", () => {
  it("keeps the STUDIM roots and ordinary morphology separate, with final M unresolved", () => {
    const result = projectFunctionalMotivationTraceV0_1(FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.STUDIM);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    const { projection } = result;
    expect(projection.motivationEquation.roles.join(" ")).toContain("DI: Independent Albanian lexical form");
    expect(projection.motivationEquation.roles.join(" ")).toContain("free_operator_attested");
    expect(projection.motivationEquation.roles.join(" ")).toContain("SHTOJ free-operator");
    expect(projection.motivationEquation.roles.join(" ")).toContain("SHTU: A proposed function-bearing form");
    expect(projection.components.at(-1)).toMatchObject({ spelling: "M", status: "UNKNOWN_OR_NULL" });
    expect(projection.alternatives.some((claim) => claim.text.includes("STUDIOJ"))).toBe(true);
    expect(projection.contrasts.some((claim) => claim.text.startsWith("SHTIM:"))).toBe(true);
    expect(projection.reasoningTrace.map((step) => step.id)).toHaveLength(9);
    expect(projection.surfaceReconciliation).toBeUndefined();
    expect(projection.motivationEquation.attribution).toMatchObject({
      text: expect.stringContaining("PETRO_ZHEJI_INSPIRED_RECONSTRUCTION"),
      claimLayer: "USER_PROPOSAL",
      status: "USER_PROPOSED",
    });
    expect(projection.motivationEquation.explanationPattern).toMatchObject({
      action: { text: "increase", claimLayer: "USER_PROPOSAL", status: "USER_PROPOSED" },
      patient: { text: "knowledge", claimLayer: "SOURCE_FACT", status: "CITATION_ENTERED_UNVERIFIED" },
      result: { text: "acquisition of knowledge", claimLayer: "LOGICAL_INFERENCE", status: "USER_PROPOSED" },
      wholeWordFunction: { text: "studying", claimLayer: "SOURCE_FACT", status: "CITATION_ENTERED_UNVERIFIED" },
    });
  });

  it("keeps GJITHÇKA raw concatenation mismatch distinct from replayed omission", () => {
    const result = projectFunctionalMotivationTraceV0_1(FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.GJITHÇKA);
    expect(result.status).toBe("READY");
    if (result.status !== "READY") return;

    const { projection } = result;
    expect(projection.reconstruction.status).toBe("MISMATCH");
    expect(projection.surfaceReconciliation).toEqual({
      operationLedgerId: "gjithcka-boundary-e-omission",
      status: "EXACT_MATCH",
      initialForm: "GJITHËÇKA",
      finalForm: "GJITHÇKA",
      operationCount: 1,
      cost: 1,
      inverseStatus: "EXACT_MATCH",
      inverseForm: "GJITHËÇKA",
    });
    expect(projection.operations[0]?.after).toBe("GJITHÇKA");
    expect(projection.operations[0]?.omittedVoices).toEqual(["Ë@5"]);
    expect(projection.reasoningTrace.find((step) => step.id === "reported-component-notation")?.sources[0]?.citationStatus)
      .toBe("CITATION_ENTERED_UNVERIFIED");
    expect(projection.unresolved.some((claim) => claim.claimLayer === "UNKNOWN_OR_NULL")).toBe(true);
    expect(projection.motivationEquation.attribution).toMatchObject({
      text: expect.stringContaining("Myrta (2014) reports Topalli (2011)"),
      claimLayer: "SOURCE_FACT",
      status: "CITATION_ENTERED_UNVERIFIED",
    });
    expect(projection.motivationEquation.explanationPattern).toBeUndefined();
    expect(projection.motivationEquation.status).toBe("USER_PROPOSED");
  });

  it("rejects a valid but unrelated ledger when it is claimed as surface reconciliation", () => {
    const input = FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.GJITHÇKA;
    const linkedInput = {
      ...input,
      operations: [
        ...input.operations,
        ...FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.STUDIM.operations,
      ],
      surfaceReconstruction: {
        ...input.surfaceReconstruction,
        reconciliationOperationId: "shtu-stu-h-omission",
      },
    };
    const result = projectFunctionalMotivationTraceV0_1(linkedInput);
    expect(result.status).toBe("REJECTED");
    if (result.status !== "REJECTED") return;
    expect(result.reasonCodes).toContain(
      "SURFACE_RECONCILIATION_INITIAL_FORM_MISMATCH:shtu-stu-h-omission",
    );
    expect(projectFunctionalMotivationTraceV0_1(linkedInput)).toEqual(result);
  });

  it("rejects a missing reconciliation ledger instead of returning READY", () => {
    const input = FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.GJITHÇKA;
    expect(projectFunctionalMotivationTraceV0_1({
      ...input,
      surfaceReconstruction: {
        ...input.surfaceReconstruction,
        reconciliationOperationId: "missing-ledger",
      },
    })).toEqual({
      status: "REJECTED",
      reasonCodes: ["UNKNOWN_SURFACE_RECONCILIATION_OPERATION:missing-ledger"],
    });
  });

  it("rejects an explicitly supplied empty reconciliation identifier", () => {
    const input = FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.GJITHÇKA;
    expect(projectFunctionalMotivationTraceV0_1({
      ...input,
      surfaceReconstruction: {
        ...input.surfaceReconstruction,
        reconciliationOperationId: "",
      },
    })).toEqual({
      status: "REJECTED",
      reasonCodes: ["SURFACE_RECONCILIATION_OPERATION_ID_MUST_BE_NONEMPTY"],
    });
  });

  it("rejects a linked ledger that fails its own validation", () => {
    const input = FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.GJITHÇKA;
    const linkedInput = {
      ...input,
      operations: input.operations.map((operation) => ({
        ...operation,
        input: { ...operation.input, initialForm: "" },
      })),
    };
    const result = projectFunctionalMotivationTraceV0_1(linkedInput);
    expect(result.status).toBe("REJECTED");
    if (result.status !== "REJECTED") return;
    expect(result.reasonCodes).toContain("OPERATION_LEDGER_NOT_READY:gjithcka-boundary-e-omission");
    expect(result.reasonCodes).toContain("SURFACE_RECONCILIATION_OPERATION_NOT_READY:gjithcka-boundary-e-omission");
  });

  it("rejects an expected Voice ledger that does not match the target spelling", () => {
    const input = FUNCTIONAL_MOTIVATION_TRACE_EXAMPLE_INPUTS_V0_1.STUDIM;
    const result = projectFunctionalMotivationTraceV0_1({
      ...input,
      target: { ...input.target, expectedWrittenVoices: [{ voice: "A", position: 2 }] },
    });
    expect(result).toEqual({
      status: "REJECTED",
      reasonCodes: ["TARGET_WRITTEN_VOICE_LEDGER_DOES_NOT_MATCH_EXACT_SPELLING"],
    });
  });

  it("does not contain example-name branches in the shared projector", () => {
    const projector = readFileSync(
      resolve(process.cwd(), "src/shared/openInstrument/functionalMotivationTrace.v0_1.ts"),
      "utf8",
    );
    expect(projector).not.toContain("STUDIM");
    expect(projector).not.toContain("GJITHÇKA");
  });
});
