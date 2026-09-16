import {
  createMultiSourceFunctionalResearchEvidenceCatalogAdapterV1,
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  queryGenericFunctionalWitnessesV1,
  type GenericFunctionalWitnessSourceAdapterV1,
  type GenericFunctionalWitnessSourceRecordV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";
import {
  loadMultiSourceFunctionalResearchEvidenceCatalogV0_1,
} from "@/shared/multiSourceFunctionalResearchEvidenceCatalog.v0_1";

function query(embryo: string, voicePath = ["A"] as const) {
  return {
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    embryo,
    voicePath,
    queryNormalization: "EXACT_NFC" as const,
  };
}

function sourceRecord(
  overrides: Partial<GenericFunctionalWitnessSourceRecordV1> = {},
): GenericFunctionalWitnessSourceRecordV1 {
  return {
    queryForm: "ER",
    sourceId: "fixture.source.er.v0_1",
    evidenceFamily: "dialect_lexicon",
    language: "Fixture Albanian",
    sourceForm: "erë",
    sourceFormNormalization: "EXACT_PRESERVED",
    gloss: "wind",
    citationRefs: ["fixture:citation:er"],
    embryoRelation: "semantic_resemblance",
    relationOperationIds: [],
    attestationTruth: "fact",
    sourceStatus: "research_candidate",
    ...overrides,
  };
}

function adapter(
  adapterId: string,
  records: readonly GenericFunctionalWitnessSourceRecordV1[],
): GenericFunctionalWitnessSourceAdapterV1 {
  return {
    adapterId,
    query: () => ({ ok: true, records }),
  };
}

describe("generic functional witness discovery v1", () => {
  it("queries an embryo without requiring a target-word row", () => {
    const result = queryGenericFunctionalWitnessesV1(
      query("ER"),
      [adapter("fixture", [sourceRecord()])],
    );

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toMatchObject({
      queryForm: "ER",
      sourceId: "fixture.source.er.v0_1",
      sourceForm: "erë",
      gloss: "wind",
    });
    expect(JSON.stringify(result)).not.toContain("targetWord");
    expect(JSON.stringify(result)).not.toContain("targetSense");
  });

  it("returns deterministic NO_MATCHES as an Evidence Null outcome", () => {
    const first = queryGenericFunctionalWitnessesV1(query("ZZ"), [
      adapter("fixture", []),
    ]);
    const second = queryGenericFunctionalWitnessesV1(query("ZZ"), [
      adapter("fixture", []),
    ]);

    expect(first).toEqual(second);
    expect(first).toMatchObject({
      status: "NO_MATCHES",
      matches: [],
      sourceFailures: [],
      evidenceStatus: "NO_EXTERNAL_EVIDENCE",
    });
  });

  it("preserves multiple competing adapters without selecting a winner", () => {
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [
      adapter("zeta", [
        sourceRecord({
          sourceId: "zeta.er.v0_1",
          language: "Tosk",
          sourceForm: "er",
        }),
      ]),
      adapter("alpha", [
        sourceRecord({
          sourceId: "alpha.er.v0_1",
          language: "Gheg",
          sourceForm: "ër",
        }),
      ]),
    ]);

    expect(result.matches.map((match) => match.sourceId)).toEqual([
      "alpha.er.v0_1",
      "zeta.er.v0_1",
    ]);
    expect(result.matches.every((match) => match.winnerClaim === "NOT_CLAIMED")).toBe(
      true,
    );
    expect(result.noSingleWinner).toBe(true);
  });

  it("keeps dialect forms distinct and preserves exact source spelling", () => {
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [
      adapter("fixture", [
        sourceRecord({ sourceId: "fixture.decomposed.v0_1", sourceForm: "e\u0308r" }),
        sourceRecord({ sourceId: "fixture.diacritic.v0_1", sourceForm: "erë" }),
      ]),
    ]);

    expect(result.matches.map((match) => match.sourceForm)).toEqual([
      "e\u0308r",
      "erë",
    ]);
    expect(result.matches.map((match) => match.language)).toEqual([
      "Fixture Albanian",
      "Fixture Albanian",
    ]);
  });

  it("fails closed for an invalid query and never calls adapters", () => {
    const querySpy = jest.fn(() => ({ ok: true as const, records: [] }));
    const result = queryGenericFunctionalWitnessesV1(
      { ...query("ER"), voicePath: ["Ẽ"] },
      [{ adapterId: "fixture", query: querySpy }],
    );

    expect(result.status).toBe("INVALID_QUERY");
    expect(querySpy).not.toHaveBeenCalled();
  });

  it("reports adapter failures without manufacturing witnesses", () => {
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [
      {
        adapterId: "broken",
        query: () => ({ ok: false as const, reasonCode: "SOURCE_ADAPTER_FAILURE" }),
      },
    ]);

    expect(result).toMatchObject({
      status: "SOURCE_FAILURE",
      matches: [],
      sourceFailures: [
        { adapterId: "broken", reasonCode: "SOURCE_ADAPTER_FAILURE" },
      ],
    });
  });

  it("uses the existing research catalog by embryo only", () => {
    const adapter = createMultiSourceFunctionalResearchEvidenceCatalogAdapterV1(
      loadMultiSourceFunctionalResearchEvidenceCatalogV0_1(),
    );
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [adapter]);

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches.length).toBeGreaterThan(1);
    expect(result.matches.every((match) => match.queryForm === "ER")).toBe(true);
    expect(result.matches.every((match) => match.sourceAttestation === "SOURCE_RECORD_ONLY")).toBe(
      true,
    );
  });

  it("returns deeply immutable output and keeps canonical Y and Ë valid", () => {
    const result = queryGenericFunctionalWitnessesV1(
      query("YË", ["Y", "Ë"]),
      [adapter("fixture", [sourceRecord({ queryForm: "YË", sourceId: "fixture.yë.v0_1" })])],
    );

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.query)).toBe(true);
    expect(Object.isFrozen(result.matches)).toBe(true);
    expect(result.query?.voicePath).toEqual(["Y", "Ë"]);
  });

  it("rejects a malformed source record instead of creating attestation", () => {
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [
      adapter("fixture", [sourceRecord({ queryForm: "er" })]),
    ]);

    expect(result).toMatchObject({
      status: "SOURCE_FAILURE",
      matches: [],
      sourceFailures: [
        { adapterId: "fixture", reasonCode: "SOURCE_RECORD_INVALID" },
      ],
    });
  });

  it.each([
    ["undefined-result", () => undefined],
    ["missing-records", () => ({ ok: true })],
  ])("fails closed for a malformed adapter result: %s", (_adapterId, queryFn) => {
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [
      { adapterId: _adapterId, query: queryFn },
    ]);

    expect(result).toMatchObject({
      status: "SOURCE_FAILURE",
      matches: [],
      sourceFailures: [
        { adapterId: _adapterId, reasonCode: "SOURCE_ADAPTER_FAILURE" },
      ],
    });
  });

  it("fails closed for a null record without sorting or dereferencing it", () => {
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [
      {
        adapterId: "null-record",
        query: () => ({ ok: true as const, records: [null] }),
      },
    ]);

    expect(result).toMatchObject({
      status: "SOURCE_FAILURE",
      matches: [],
      sourceFailures: [
        { adapterId: "null-record", reasonCode: "SOURCE_RECORD_INVALID" },
      ],
    });
  });

  it("rejects an unsupported evidence family before creating attestation", () => {
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [
      adapter("invalid-family", [
        sourceRecord({ evidenceFamily: "invented" as never }),
      ]),
    ]);

    expect(result).toMatchObject({
      status: "SOURCE_FAILURE",
      matches: [],
      sourceFailures: [
        { adapterId: "invalid-family", reasonCode: "SOURCE_RECORD_INVALID" },
      ],
    });
  });

  it("does not freeze caller-owned query objects", () => {
    const input = query("YË", ["Y", "Ë"] as const);
    const result = queryGenericFunctionalWitnessesV1(input, [
      adapter("fixture", [sourceRecord({ queryForm: "YË", sourceId: "fixture.yë.v0_1" })]),
    ]);

    expect(Object.isFrozen(input)).toBe(false);
    expect(Object.isFrozen(input.voicePath)).toBe(false);
    expect(result.query).not.toBe(input);
    expect(result.query?.voicePath).not.toBe(input.voicePath);
  });

  it("keeps witness identities distinct when adapter and source IDs contain delimiters", () => {
    const result = queryGenericFunctionalWitnessesV1(query("ER"), [
      adapter("a", [sourceRecord({ sourceId: "b:c" })]),
      adapter("a:b", [sourceRecord({ sourceId: "c" })]),
    ]);

    expect(result.matches).toHaveLength(2);
    expect(new Set(result.matches.map((match) => match.witnessId)).size).toBe(2);
  });
});
