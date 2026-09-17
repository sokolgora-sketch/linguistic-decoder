import rawSourceDataset from "../src/data/openInstrument/genericFunctionalWitnessSourceRecords.v1.json";
import {
  createGenericFunctionalWitnessSourceAdapterV1,
  loadGenericFunctionalWitnessSourceDatasetV1,
  parseGenericFunctionalWitnessSourceDatasetV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessSourceAcquisition.v1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
  queryGenericFunctionalWitnessesV1,
  type GenericFunctionalWitnessQueryV1,
  type GenericFunctionalWitnessSourceAdapterV1,
  type GenericFunctionalWitnessSourceRecordV1,
} from "../src/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

function query(
  embryo: string,
  voicePath: GenericFunctionalWitnessQueryV1["voicePath"] = ["I"],
): GenericFunctionalWitnessQueryV1 {
  return {
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    embryo,
    voicePath,
    queryNormalization: GENERIC_FUNCTIONAL_WITNESS_QUERY_NORMALIZATION_V1,
  };
}

function sourceRecord(
  overrides: Partial<GenericFunctionalWitnessSourceRecordV1> = {},
): GenericFunctionalWitnessSourceRecordV1 {
  return {
    queryForm: "ERË",
    sourceId: "fixture.source.erë.v0_1",
    evidenceFamily: "lexical_dictionary",
    language: "Albanian",
    languageVariety: null,
    sourceForm: "erë",
    sourceFormNormalization: "EXACT_PRESERVED",
    gloss: "source-provided gloss",
    citationRefs: ["fixture.citation.erë.v0_1"],
    embryoRelation: "authorized_transformation",
    relationOperationIds: ["structural_display_form_v0_1"],
    attestationTruth: "fact",
    sourceStatus: "research_candidate",
    sourceProvenance: {
      sourceRecordId: "fixture.source.erë.v0_1",
      sourceTraditionId: "fixture.source.v0_1",
      sourceTitle: "Fixture source",
      sourceDateOrVersion: "fixture v0.1",
      sourceUrlOrArchiveRef: "fixture://source/erë",
      entryLocator: "erë entry",
      sourceHashOrArchiveHash: null,
      languageVariety: null,
    },
    ...overrides,
  };
}

function adapter(
  records: readonly GenericFunctionalWitnessSourceRecordV1[],
): GenericFunctionalWitnessSourceAdapterV1 {
  return {
    adapterId: "fixture-varieties",
    query: () => ({ ok: true, records }),
  };
}

describe("Open Instrument Lane 2 generic source acquisition", () => {
  it("loads a target-blind frozen dataset with exact source forms", () => {
    const parsed = parseGenericFunctionalWitnessSourceDatasetV1(rawSourceDataset);
    expect(parsed.ok).toBe(true);

    const dataset = loadGenericFunctionalWitnessSourceDatasetV1();
    expect(dataset.records).toHaveLength(4);
    expect(dataset.records.map((record) => record.sourceForm)).toEqual([
      "dorë",
      "jetë",
      "shi",
      "amo",
    ]);
    expect(JSON.stringify(rawSourceDataset)).not.toContain("targetWord");
    expect(JSON.stringify(rawSourceDataset)).not.toContain("targetSense");
    expect(JSON.stringify(rawSourceDataset)).not.toContain("functionalHypotheses");
    expect(JSON.stringify(rawSourceDataset)).not.toContain("semanticBridge");
  });

  it("preserves canonically decomposed source forms while normalizing only the lookup key", () => {
    const decomposedDataset = JSON.parse(JSON.stringify(rawSourceDataset)) as typeof rawSourceDataset;
    const record = decomposedDataset.records[0];
    record.sourceForm = "e\u0308r";
    record.queryForm = "ËR";
    record.lookupForm = "ËR";
    record.citation.attestedForm = "e\u0308r";

    const parsed = parseGenericFunctionalWitnessSourceDatasetV1(decomposedDataset);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;
    const decomposedRecord = parsed.dataset.records.find(
      (candidate) => candidate.sourceRecordId === "research.external.albanian-shi-rain.scale50.v0_1",
    );
    expect(decomposedRecord?.sourceForm).toBe("e\u0308r");
    expect(decomposedRecord?.lookupForm).toBe("ËR");
  });

  it("rejects a source record whose evidence family disagrees with the verified tradition", () => {
    const mismatchedDataset = JSON.parse(JSON.stringify(rawSourceDataset)) as typeof rawSourceDataset;
    mismatchedDataset.records[0].evidenceFamily = "scholarly_paper";

    const parsed = parseGenericFunctionalWitnessSourceDatasetV1(mismatchedDataset);

    expect(parsed).toEqual({
      ok: false,
      reasonCodes: ["SOURCE_RECORD_INVALID"],
    });
  });

  it("returns an exact lookup hit with source provenance and source semantics", () => {
    const result = queryGenericFunctionalWitnessesV1(
      query("SHI", ["I"]),
      [createGenericFunctionalWitnessSourceAdapterV1()],
    );

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toMatchObject({
      sourceId: "research.external.albanian-shi-rain.scale50.v0_1",
      language: "Albanian",
      sourceForm: "shi",
      sourceFormNormalization: "EXACT_PRESERVED",
      gloss: "rain; precipitation formed from atmospheric water vapor and falling in drops",
      sourceStatus: "research_candidate",
      sourceAttestation: "SOURCE_RECORD_ONLY",
      functionalCorrespondence: "NOT_EVALUATED",
      targetMeaning: "NOT_CLAIMED",
      historicalRelation: "NOT_CLAIMED",
      winnerClaim: "NOT_CLAIMED",
      languageSuperiorityClaim: "NOT_CLAIMED",
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    });
    expect(result.matches[0]?.citationRefs).toEqual([
      "research.external.fjale-shi-rain.scale50.citation.v0_1",
    ]);
    expect(result.matches[0]?.sourceProvenance).toMatchObject({
      sourceTraditionId: "fjale.fjalor-shqip.v0_1",
      sourceUrlOrArchiveRef: "https://fjale.al/shi",
      entryLocator: "SHI m., sense 1",
    });
  });

  it("keeps misses as Evidence Null and rejects case or Unicode variants", () => {
    const adapterV1 = createGenericFunctionalWitnessSourceAdapterV1();

    const lowercase = queryGenericFunctionalWitnessesV1(query("shi"), [adapterV1]);
    expect(lowercase.status).toBe("NO_MATCHES");
    expect(lowercase.evidenceStatus).toBe("NO_EXTERNAL_EVIDENCE");
    expect(lowercase.matches).toEqual([]);

    const unicodeVariant = queryGenericFunctionalWitnessesV1(query("SHİ"), [
      adapterV1,
    ]);
    expect(unicodeVariant.status).toBe("NO_MATCHES");
    expect(unicodeVariant.evidenceStatus).toBe("NO_EXTERNAL_EVIDENCE");
    expect(unicodeVariant.matches).toEqual([]);

    const trailingSpace = queryGenericFunctionalWitnessesV1(query("SHI "), [
      adapterV1,
    ]);
    expect(trailingSpace.status).toBe("INVALID_QUERY");
    expect(trailingSpace.matches).toEqual([]);
  });

  it("preserves multiple source varieties without choosing a winner", () => {
    const result = queryGenericFunctionalWitnessesV1(
      query("ERË", ["E"]),
      [
        adapter([
          sourceRecord({
            sourceId: "fixture.gheg.erë.v0_1",
            languageVariety: "Gheg",
            sourceProvenance: {
              ...sourceRecord().sourceProvenance!,
              sourceRecordId: "fixture.gheg.erë.v0_1",
              languageVariety: "Gheg",
            },
          }),
          sourceRecord({
            sourceId: "fixture.tosk.erë.v0_1",
            languageVariety: "Tosk",
            sourceProvenance: {
              ...sourceRecord().sourceProvenance!,
              sourceRecordId: "fixture.tosk.erë.v0_1",
              languageVariety: "Tosk",
            },
          }),
        ]),
      ],
    );

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches.map((match) => match.languageVariety)).toEqual([
      "Gheg",
      "Tosk",
    ]);
    expect(result.matches.every((match) => match.winnerClaim === "NOT_CLAIMED")).toBe(
      true,
    );
  });

  it("is target-blind, deterministic, and deeply immutable", () => {
    const adapterV1 = createGenericFunctionalWitnessSourceAdapterV1();
    const input = query("DORË", ["O", "Ë"]);
    const first = queryGenericFunctionalWitnessesV1(input, [adapterV1]);
    const second = queryGenericFunctionalWitnessesV1(input, [adapterV1]);

    expect(first).toEqual(second);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.matches)).toBe(true);
    expect(first.query).not.toHaveProperty("targetWord");
    expect(first.matches[0]?.sourceProvenance?.sourceRecordId).toBe(
      "research.external.albanian-dore-hand.scale50.v0_1",
    );
  });

  it("keeps canonical Y and Ë valid without inventing witnesses", () => {
    const adapterV1 = createGenericFunctionalWitnessSourceAdapterV1();
    const yAndSchwa = queryGenericFunctionalWitnessesV1(query("YË", ["Y", "Ë"]), [
      adapterV1,
    ]);
    const gj = queryGenericFunctionalWitnessesV1(query("GJAK", ["A"]), [adapterV1]);
    const ba = queryGenericFunctionalWitnessesV1(query("BA", ["A"]), [adapterV1]);

    expect(yAndSchwa.status).toBe("NO_MATCHES");
    expect(gj.status).toBe("NO_MATCHES");
    expect(ba.status).toBe("NO_MATCHES");
  });
});
