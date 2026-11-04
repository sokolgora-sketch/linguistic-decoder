import {
  examineSingleWordMechanicalInterpretationV0_1,
  notSubmittedMechanicalInterpretationV0_1,
  type MechanicalEditInputV0_1,
  type SingleWordMechanicalExaminerInputV0_1,
} from "@/shared/openInstrument/singleWordMechanicalExaminer.v0_1";

function examine(
  targetWord: string,
  componentSpellings: readonly string[],
  operations: readonly MechanicalEditInputV0_1[] = [],
) {
  return examineSingleWordMechanicalInterpretationV0_1({
    submitted: true,
    targetWord,
    componentSpellings,
    operations,
  });
}

describe("Single-word mechanical examiner v0.1", () => {
  it("replays the exact KANDIL substitution and reports the whole LL digraph effect", () => {
    const result = examine("KANDIL", ["KAN", "DILL"], [{
      kind: "SUBSTITUTE", position: 5, expectedText: "LL", replacementText: "L",
    }]);

    expect(result.status).toBe("EXAMINED");
    expect(result.targetWord).toBe("KANDIL");
    expect(result.componentSpellings).toEqual(["KAN", "DILL"]);
    expect(result.rawConcatenation).toBe("KANDILL");
    expect(result.operationResults[0]).toMatchObject({
      status: "APPLIED", position: 5, intermediateBefore: "KANDILL", intermediateAfter: "KANDIL",
    });
    expect(result.finalMechanicalSpelling).toBe("KANDIL");
    expect(result.exactComparison).toBe("MATCH");
    expect(result.warnings).toContainEqual(expect.objectContaining({ code: "DIGRAPH_REMOVED", digraph: "LL" }));
    expect(result.authority).toBe("USER_DECLARED_UNVERIFIED");
    expect(result.linguisticValidity).toBe("NOT_ASSESSED");
  });

  it("accepts the explicit DRITARE H omission and identifies TH at the component seam", () => {
    const result = examine("DRITARE", ["DRIT", "HARE"], [{
      kind: "OMIT", position: 4, expectedText: "H", replacementText: "",
    }]);

    expect(result.rawConcatenation).toBe("DRITHARE");
    expect(result.finalMechanicalSpelling).toBe("DRITARE");
    expect(result.exactComparison).toBe("MATCH");
    expect(result.warnings).toEqual(expect.arrayContaining([
      expect.objectContaining({ code: "DIGRAPH_CROSSES_COMPONENT_BOUNDARY", digraph: "TH", position: 4 }),
      expect.objectContaining({ code: "DIGRAPH_REMOVED", digraph: "TH", operationIndex: 0 }),
    ]));
  });

  it.each([
    ["position mismatch", [{ kind: "OMIT", position: 4, expectedText: "X", replacementText: "" }], "EXPECTED_TEXT_MISMATCH"],
    ["expected-text mismatch", [{ kind: "SUBSTITUTE", position: 5, expectedText: "X", replacementText: "Z" }], "EXPECTED_TEXT_MISMATCH"],
    ["out-of-range edit", [{ kind: "OMIT", position: 99, expectedText: "L", replacementText: "" }], "POSITION_OUT_OF_RANGE_OR_NOT_AN_INTEGER"],
  ] as const)("rejects a %s without returning a final spelling", (_label, operations, reasonCode) => {
    const result = examine("KANDIL", ["KAN", "DILL"], operations);
    expect(result.status).toBe("REJECTED");
    expect(result.finalMechanicalSpelling).toBeNull();
    expect(result.operationResults[0]?.reasonCodes).toContain(reasonCode);
  });

  it("supports insertion and applies ordered edits to each current intermediate string", () => {
    const inserted = examine("ABXCD", ["AB", "CD"], [{
      kind: "INSERT", position: 2, expectedText: "", replacementText: "X",
    }]);
    expect(inserted.finalMechanicalSpelling).toBe("ABXCD");

    const validOrdered = examine("ABCE", ["AB", "C"], [
      { kind: "INSERT", position: 3, expectedText: "", replacementText: "D" },
      { kind: "SUBSTITUTE", position: 3, expectedText: "D", replacementText: "E" },
    ]);
    expect(validOrdered.operationResults.map((operation) => operation.intermediateAfter)).toEqual(["ABCD", "ABCE"]);
    expect(validOrdered.finalMechanicalSpelling).toBe("ABCE");
  });

  it("uses Unicode code-point positions and preserves the original text without normalization", () => {
    const supplementary = examine("A🙂XB", ["A🙂", "B"], [{
      kind: "INSERT", position: 2, expectedText: "", replacementText: "X",
    }]);
    expect(supplementary.finalMechanicalSpelling).toBe("A🙂XB");
    expect(supplementary.operationResults[0]?.position).toBe(2);
    expect(supplementary.warnings.some((item) => item.code === "UNSUPPORTED_ORTHOGRAPHIC_CHARACTER")).toBe(true);

    const decomposed = "E\u0308";
    const nfc = examine("Ë", [decomposed, "X"], [{
      kind: "OMIT", position: 2, expectedText: "X", replacementText: "",
    }]);
    expect(nfc.componentSpellings[0]).toBe(decomposed);
    expect(nfc.rawConcatenation).toBe(`${decomposed}X`);
    expect(nfc.finalMechanicalSpelling).toBe(decomposed);
    expect(nfc.exactComparison).toBe("MISMATCH");
    expect(nfc.nfcEquivalent).toBe(true);

    const noAccentRepair = examine("ËT", ["E", "T"]);
    expect(noAccentRepair.rawConcatenation).toBe("ET");
    expect(noAccentRepair.exactComparison).toBe("MISMATCH");
    expect(noAccentRepair.finalMechanicalSpelling).toBe("ET");
  });

  it.each(["DH", "GJ", "LL", "NJ", "RR", "SH", "TH", "XH", "ZH"])(
    "reports the Albanian %s digraph across an explicit component seam",
    (digraph) => {
      const result = examine(digraph, [digraph[0]!, digraph[1]!]);
      expect(result.status).toBe("EXAMINED");
      expect(result.finalMechanicalSpelling).toBe(digraph);
      expect(result.warnings).toContainEqual(expect.objectContaining({
        code: "DIGRAPH_CROSSES_COMPONENT_BOUNDARY",
        digraph,
      }));
    },
  );

  it("does not apply later edits after a rejected edit", () => {
    const result = examine("ABZ", ["AB", "C"], [
      { kind: "SUBSTITUTE", position: 2, expectedText: "X", replacementText: "Y" },
      { kind: "INSERT", position: 2, expectedText: "", replacementText: "Z" },
    ]);
    expect(result.status).toBe("REJECTED");
    expect(result.operationResults.map((operation) => operation.status)).toEqual(["REJECTED", "NOT_RUN"]);
    expect(result.lastValidIntermediate).toBe("ABC");
    expect(result.finalMechanicalSpelling).toBeNull();
  });

  it("rejects boundaries inside a combining sequence", () => {
    const result = examine("ÄXY", ["A\u0308X", "Y"], [{
      kind: "OMIT", position: 1, expectedText: "\u0308", replacementText: "",
    }]);
    expect(result.status).toBe("REJECTED");
    expect(result.operationResults[0]?.reasonCodes).toContain("UNSAFE_UNICODE_COMBINING_SEQUENCE_BOUNDARY");
  });

  it("has no word allowlist and reports unsupported characters without inventing a linguistic verdict", () => {
    const ordinary = examine("BALONI", ["BA", "LONI"]);
    expect(ordinary.status).toBe("EXAMINED");
    expect(ordinary.exactComparison).toBe("MATCH");
    expect(ordinary.linguisticValidity).toBe("NOT_ASSESSED");

    const unsupported = examine("Résumé", ["Ré", "sumé"]);
    expect(unsupported.status).toBe("EXAMINED");
    expect(unsupported.finalMechanicalSpelling).toBe("Résumé");
    expect(unsupported.warnings.filter((item) => item.code === "UNSUPPORTED_ORTHOGRAPHIC_CHARACTER")).not.toHaveLength(0);
  });

  it.each([
    ["DRIDHJE", ["DRIT", "HIJE"], "DRITHIJE", "MISMATCH"],
    ["NJERIU", ["NJË", "I", "RIU"], "NJËIRIU", "MISMATCH"],
    ["UJËSJELLËS", ["UJË", "SJELLËS"], "UJËSJELLËS", "MATCH"],
    ["RRËNJË", ["RRË", "NJË"], "RRËNJË", "MATCH"],
  ] as const)("mechanically reports the user-entered %s components without inferring a repair", (target, components, raw, comparison) => {
    const result = examine(target, components);
    expect(result.rawConcatenation).toBe(raw);
    expect(result.finalMechanicalSpelling).toBe(raw);
    expect(result.exactComparison).toBe(comparison);
    expect(result.authority).toBe("USER_DECLARED_UNVERIFIED");
    expect(result.linguisticValidity).toBe("NOT_ASSESSED");
  });

  it("keeps an unexamined proposal in NOT_SUBMITTED state", () => {
    const result = notSubmittedMechanicalInterpretationV0_1("BUKË");
    expect(result.status).toBe("NOT_SUBMITTED");
    expect(result.targetWord).toBe("BUKË");
    expect(result.exactComparison).toBe("NOT_COMPUTED");
    expect(result.finalMechanicalSpelling).toBeNull();
    expect(result.authority).toBe("USER_DECLARED_UNVERIFIED");
  });

  it("rejects forged authority, source-fact and functional claims", () => {
    const forged = {
      submitted: true,
      targetWord: "AB",
      componentSpellings: ["A", "B"],
      operations: [],
      authority: "VERIFIED",
      claimType: "SOURCE_FACT",
      operation: "AGENT",
    } as unknown as SingleWordMechanicalExaminerInputV0_1;
    const result = examineSingleWordMechanicalInterpretationV0_1(forged);
    expect(result.status).toBe("REJECTED");
    expect(result.reasonCodes).toContain("UNRECOGNIZED_INPUT_FIELD");
    expect(result.authority).toBe("USER_DECLARED_UNVERIFIED");
    expect(result.linguisticValidity).toBe("NOT_ASSESSED");
    expect(result).not.toHaveProperty("claimType");
    expect(result).not.toHaveProperty("operation");
  });
});
