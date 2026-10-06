import {
  createAlbanianLexicalSubstrateWitnessAdapterV0_1,
  getAlbanianLexicalSubstrateRecordsV0_1,
} from "@/shared/openInstrument/albanianLexicalSubstrate.v0_1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  queryGenericFunctionalWitnessesV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

function query(embryo: string, voicePath = ["I"] as const) {
  return {
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    embryo,
    voicePath,
    queryNormalization: "EXACT_NFC" as const,
  };
}

describe("bounded Albanian lexical substrate v0.1", () => {
  it("projects source facts without target-bound research fields", () => {
    const records = getAlbanianLexicalSubstrateRecordsV0_1();
    const di = records.find((record) => record.sourceForm === "di");
    const zemer = records.find((record) => record.sourceForm === "zemër");

    expect(di).toMatchObject({
      queryForm: "DI",
      language: "sq",
      gloss: "know / knowledge",
      sourceStatus: "reviewed_candidate",
      sourceAuthorityStatus: "reviewed_accepted",
    });
    expect(zemer).toMatchObject({
      queryForm: "ZEMËR",
      language: "Albanian",
      gloss: "heart; central organ of the circulatory system",
      sourceStatus: "research_candidate",
    });

    const serialized = JSON.stringify(records);
    expect(serialized).not.toContain("targetWord");
    expect(serialized).not.toContain("semanticBridge");
    expect(serialized).not.toContain("functionalHypothesis");
  });

  it("retrieves DI generically without the target-specific reviewed adapter", () => {
    const result = queryGenericFunctionalWitnessesV1(
      query("DI"),
      [createAlbanianLexicalSubstrateWitnessAdapterV0_1()],
    );

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toMatchObject({
      queryForm: "DI",
      sourceForm: "di",
      sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
      sourceAttestation: "SOURCE_RECORD_ONLY",
      functionalCorrespondence: "NOT_EVALUATED",
      targetMeaning: "NOT_CLAIMED",
    });
  });

  it("keeps the source-backed ZEMËR lexical fact queryable by its generic key", () => {
    const result = queryGenericFunctionalWitnessesV1(
      query("ZEMËR", ["E", "Ë"]),
      [createAlbanianLexicalSubstrateWitnessAdapterV0_1()],
    );

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches).toHaveLength(1);
    expect(result.matches[0]).toMatchObject({
      queryForm: "ZEMËR",
      sourceForm: "zemër",
      language: "Albanian",
      sourceStatus: "research_candidate",
    });
  });

  it("preserves an explicit Null for an unsupported substrate key", () => {
    const result = queryGenericFunctionalWitnessesV1(
      query("ZZ"),
      [createAlbanianLexicalSubstrateWitnessAdapterV0_1()],
    );

    expect(result).toMatchObject({
      status: "NO_MATCHES",
      matches: [],
      evidenceStatus: "NO_EXTERNAL_EVIDENCE",
      noSingleWinner: true,
    });
  });
});
