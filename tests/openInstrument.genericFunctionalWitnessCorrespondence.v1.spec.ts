import {
  createGenericFunctionalWitnessSourceAdapterV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessSourceAcquisition.v1";
import {
  queryGenericFunctionalWitnessesV1,
  type GenericFunctionalWitnessV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import {
  evaluateGenericFunctionalWitnessCorrespondenceV1,
  GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1,
  type GenericFunctionalWitnessCorrespondenceInputV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessCorrespondence.v1";

function witnessFor(
  embryo: string,
  voicePath: GenericFunctionalWitnessCorrespondenceInputV1["structuralAnalysis"]["voicePath"],
): GenericFunctionalWitnessV1 | null {
  const result = queryGenericFunctionalWitnessesV1(
    {
      schemaVersion: "open-instrument.generic-functional-witness-discovery.v1",
      embryo,
      voicePath,
      queryNormalization: "EXACT_NFC",
    },
    [createGenericFunctionalWitnessSourceAdapterV1()],
  );
  return result.matches[0] ?? null;
}

function inputFor(
  witness: GenericFunctionalWitnessV1 | null,
  overrides: Partial<GenericFunctionalWitnessCorrespondenceInputV1> = {},
): GenericFunctionalWitnessCorrespondenceInputV1 {
  return {
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1,
    targetAnalysis: {
      analysisId: "analysis:fresh-word",
      targetWord: "fresh-word",
      targetSense: null,
    },
    structuralAnalysis: {
      hypothesisId: "logic-structural:fresh-word:SHI",
      embryo: "SHI",
      voicePath: ["I"],
    },
    sourceWitness: witness,
    ...overrides,
  };
}

describe("Open Instrument Lane 3 bounded witness correspondence", () => {
  it("keeps exact form/source attestation separate from functional acceptance", () => {
    const witness = witnessFor("SHI", ["I"]);
    expect(witness).not.toBeNull();
    const exactWitness = witness
      ? { ...witness, embryoRelation: "exact_form" as const }
      : null;

    const result = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor(exactWitness),
    );

    expect(result).toMatchObject({
      verdict: "UNKNOWN",
      sourceAttestation: "SOURCE_RECORD_ONLY",
      functionalCorrespondence: "UNKNOWN",
      functionalAcceptance: "NOT_AUTHORIZED",
      historicalRelation: "NOT_CLAIMED",
      targetOriginClaim: "NOT_CLAIMED",
      winnerClaim: "NOT_CLAIMED",
      languageSuperiorityClaim: "NOT_CLAIMED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });
    expect(result.reasonCodes).toEqual([
      "EXACT_FORM_MATCH_ONLY",
      "FUNCTIONAL_CORRESPONDENCE_NOT_AUTHORIZED",
      "NO_REVIEWED_COMPARISON_RULE",
    ]);
    expect(result.sourceWitness?.sourceForm).toBe("shi");
    expect(result.sourceWitness?.gloss).toContain("rain");
  });

  it("does not treat exact form equality as supported correspondence", () => {
    const witness = witnessFor("SHI", ["I"]);
    expect(witness).not.toBeNull();
    const exactWitness = witness
      ? { ...witness, embryoRelation: "exact_form" as const }
      : null;
    const result = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor(exactWitness),
    );

    expect(result.verdict).not.toBe("SUPPORTED");
    expect(result.verdict).not.toBe("PARTIALLY_SUPPORTED");
    expect(result.reasonCodes).toContain("EXACT_FORM_MATCH_ONLY");
  });

  it("does not label non-exact source relations as exact matches", () => {
    const witness = witnessFor("SHI", ["I"]);
    if (!witness) throw new Error("expected frozen SHI witness");

    const result = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor({
        ...witness,
        embryoRelation: "semantic_resemblance",
      }),
    );

    expect(result.verdict).toBe("UNKNOWN");
    expect(result.reasonCodes).toContain("SOURCE_RELATION_REQUIRES_REVIEW");
    expect(result.reasonCodes).not.toContain("EXACT_FORM_MATCH_ONLY");
  });

  it("returns NULL when no witness is available", () => {
    const result = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor(null),
    );

    expect(result).toMatchObject({
      verdict: "NULL",
      sourceAttestation: "NOT_AVAILABLE",
      functionalCorrespondence: "NULL",
      sourceWitness: null,
    });
    expect(result.reasonCodes).toEqual(["NO_SOURCE_WITNESS"]);
  });

  it("evaluates multiple and conflicting witnesses independently", () => {
    const baseWitness = witnessFor("SHI", ["I"]);
    if (!baseWitness) throw new Error("expected frozen SHI witness");

    const conflictingWitness: GenericFunctionalWitnessV1 = Object.freeze({
      ...baseWitness,
      witnessId: "fixture:conflicting-shi",
      sourceId: "fixture.conflicting-shi",
      gloss: "a conflicting source-provided gloss",
      citationRefs: ["fixture.conflicting-shi.citation"],
      sourceProvenance: baseWitness.sourceProvenance
        ? Object.freeze({
            ...baseWitness.sourceProvenance,
            sourceRecordId: "fixture.conflicting-shi",
            sourceUrlOrArchiveRef: "fixture://conflicting-shi",
          })
        : undefined,
    });

    const results = [baseWitness, conflictingWitness].map((witness) =>
      evaluateGenericFunctionalWitnessCorrespondenceV1(
        inputFor(witness),
      ),
    );

    expect(results).toHaveLength(2);
    expect(results.map((result) => result.sourceWitness?.sourceId)).toEqual([
      baseWitness.sourceId,
      conflictingWitness.sourceId,
    ]);
    expect(results.every((result) => result.verdict === "UNKNOWN")).toBe(true);
    expect(results[0]?.sourceWitness?.gloss).not.toBe(
      results[1]?.sourceWitness?.gloss,
    );
    expect(results.every((result) => result.winnerClaim === "NOT_CLAIMED")).toBe(
      true,
    );
  });

  it("does not bind or require target sense", () => {
    const unbound = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor(witnessFor("SHI", ["I"])),
    );
    const presentButUnbound = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor(witnessFor("SHI", ["I"]), {
        targetAnalysis: {
          analysisId: "analysis:fresh-word",
          targetWord: "fresh-word",
          targetSense: { id: "sense:fresh", label: "a supplied sense" },
        },
      }),
    );

    expect(unbound.targetSenseBinding).toBe("TARGET_SENSE_UNBOUND");
    expect(presentButUnbound.targetSenseBinding).toBe(
      "TARGET_SENSE_PRESENT_NOT_BOUND",
    );
    expect(presentButUnbound.verdict).toBe("UNKNOWN");
  });

  it("preserves the multidimensional doctrine basis without path algebra", () => {
    const result = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor(witnessFor("DORË", ["O", "Ë"]), {
        structuralAnalysis: {
          hypothesisId: "logic-structural:fresh-word:DORË",
          embryo: "DORË",
          voicePath: ["O", "Ë"],
        },
      }),
    );

    expect(result.doctrineBasis?.voicePath).toEqual(["O", "Ë"]);
    expect(result.doctrineBasis?.profiles).toHaveLength(2);
    expect(result.doctrineBasis?.profiles[0]?.functionalProperties.length).toBeGreaterThan(1);
    expect(result.reasonCodes).not.toContain("UNAUTHORIZED_INTERACTION_SEMANTICS");
    expect(result.verdict).toBe("UNKNOWN");
  });

  it("fails closed for a witness from another embryo", () => {
    const result = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor(witnessFor("SHI", ["I"]), {
        structuralAnalysis: {
          hypothesisId: "logic-structural:fresh-word:OTHER",
          embryo: "OTHER",
          voicePath: ["O"],
        },
      }),
    );

    expect(result.verdict).toBe("NULL");
    expect(result.reasonCodes).toEqual(["SOURCE_WITNESS_EMBRYO_MISMATCH"]);
    expect(result.sourceWitness).toBeNull();
  });

  it("is deterministic and deeply immutable", () => {
    const input = inputFor(witnessFor("SHI", ["I"]));
    const first = evaluateGenericFunctionalWitnessCorrespondenceV1(input);
    const second = evaluateGenericFunctionalWitnessCorrespondenceV1(input);

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.reasonCodes)).toBe(true);
    expect(Object.isFrozen(first.doctrineBasis)).toBe(true);
    expect(Object.isFrozen(first.sourceWitness)).toBe(true);
  });

  it("rejects malformed input without inventing a semantic result", () => {
    const result = evaluateGenericFunctionalWitnessCorrespondenceV1({
      schemaVersion: GENERIC_FUNCTIONAL_WITNESS_CORRESPONDENCE_SCHEMA_V1,
      targetAnalysis: { analysisId: "", targetWord: "" },
      structuralAnalysis: { hypothesisId: "", embryo: "", voicePath: ["Ẽ"] },
      sourceWitness: null,
    });

    expect(result.verdict).toBe("NULL");
    expect(result.reasonCodes).toEqual([
      "STRUCTURAL_ANALYSIS_INVALID",
      "TARGET_ANALYSIS_INVALID",
      "VOICE_PATH_INVALID",
    ]);
  });

  it("rejects malformed target senses without returning them", () => {
    const result = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor(null, {
        targetAnalysis: {
          analysisId: "analysis:fresh-word",
          targetWord: "fresh-word",
          targetSense: { id: "", label: "malformed" },
        },
      }),
    );

    expect(result.verdict).toBe("NULL");
    expect(result.reasonCodes).toContain("TARGET_ANALYSIS_INVALID");
    expect(result.targetAnalysis).toBeNull();
  });

  it("strips unvalidated claim fields from returned witnesses", () => {
    const witness = witnessFor("SHI", ["I"]);
    if (!witness) throw new Error("expected frozen SHI witness");

    const result = evaluateGenericFunctionalWitnessCorrespondenceV1(
      inputFor({
        ...witness,
        targetOriginClaim: "CLAIMED_BY_INPUT",
        functionalAcceptance: "AUTHORIZED_BY_INPUT",
      } as GenericFunctionalWitnessV1),
    );

    expect(result.sourceWitness).not.toBeNull();
    expect(result.sourceWitness).not.toHaveProperty("targetOriginClaim");
    expect(result.sourceWitness).not.toHaveProperty("functionalAcceptance");
    expect(result.targetOriginClaim).toBe("NOT_CLAIMED");
    expect(result.functionalAcceptance).toBe("NOT_AUTHORIZED");
  });
});
