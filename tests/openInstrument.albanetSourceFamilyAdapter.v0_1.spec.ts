import {
  ALBANET_SOURCE_FAMILY_ID_V0_1,
  ALBANET_SOURCE_FILE_RELATIVE_PATH_V0_1,
  createAlbaNetSourceFamilyAdapterV0_1,
  loadAlbaNetServerOnlySourceV0_1,
  normalizeAlbaNetLemmaV0_1,
  parseAlbaNetTabV0_1,
} from "@/shared/openInstrument/albanetSourceFamilyAdapter.v0_1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  queryGenericFunctionalWitnessesV1,
  type GenericFunctionalWitnessSourceAdapterV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

const fixture = [
  "# Albanet\tals\thttp://fjalnet.com/\tCC BY 3.0",
  "00000001-n\tals:lemma\tËmbël",
  "00000001-n\tals:def\t0\tpleasantly sweet",
  "00000001-n\tals:exe\t0\tKjo është e ëmbël.",
  "00000002-n\tals:lemma\tëmbël",
  "00000002-n\tals:def\t0\tnot the same synset",
  "00000003-n\tals:lemma\tvetëm",
].join("\n");

function query(embryo: string) {
  return {
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    embryo,
    voicePath: ["Ë"] as const,
    queryNormalization: "EXACT_NFC" as const,
  };
}

describe("AlbaNet source-family adapter v0.1", () => {
  it("parses source rows into deterministic synset records", () => {
    const parsed = parseAlbaNetTabV0_1(fixture);

    expect(parsed.ok).toBe(true);
    if (!parsed.ok) return;

    expect(parsed.records.map((record) => record.synsetId)).toEqual([
      "00000001-n",
      "00000002-n",
      "00000003-n",
    ]);
    expect(parsed.records[0]).toMatchObject({
      sourceRecordId: `${ALBANET_SOURCE_FAMILY_ID_V0_1}:00000001-n:lemma=%C3%8Bmb%C3%ABl`,
      lemma: "Ëmbël",
      definitions: ["pleasantly sweet"],
      examples: ["Kjo është e ëmbël."],
      relationTypes: ["als:def", "als:exe", "als:lemma"],
      entryLocator: `${ALBANET_SOURCE_FILE_RELATIVE_PATH_V0_1}#synset=00000001-n;lemma=%C3%8Bmb%C3%ABl`,
    });
  });

  it("matches NFC-normalized Albanian lemmas and preserves multiple synsets", () => {
    const parsed = parseAlbaNetTabV0_1(fixture);
    if (!parsed.ok) throw new Error("fixture did not parse");
    const adapter = createAlbaNetSourceFamilyAdapterV0_1(parsed.records);
    expect(normalizeAlbaNetLemmaV0_1("e\u0308MBËL")).toBe("ëmbël");
    const result = queryGenericFunctionalWitnessesV1(query("ËMBËL"), [adapter]);

    expect(result.status).toBe("MATCHES_FOUND");
    expect(result.matches.map((match) => match.sourceId)).toHaveLength(2);
    expect(result.matches.map((match) => match.sourceProvenance?.sourceTraditionId)).toEqual([
      ALBANET_SOURCE_FAMILY_ID_V0_1,
      ALBANET_SOURCE_FAMILY_ID_V0_1,
    ]);
    expect(result.matches[0]?.sourceDetails).toMatchObject({
      synsetId: "00000001-n",
      definitions: ["pleasantly sweet"],
      examples: ["Kjo është e ëmbël."],
      license: "CC BY 3.0",
    });
    expect(result.matches.every((match) => match.functionalCorrespondence === "NOT_EVALUATED")).toBe(true);
    expect(result.matches.every((match) => match.targetMeaning === "NOT_CLAIMED")).toBe(true);
    expect(result.noSingleWinner).toBe(true);
    expect(result.userDecisionPosture).toBe("user_decides");
  });

  it("adds AlbaNet evidence without suppressing a competing source", () => {
    const parsed = parseAlbaNetTabV0_1(fixture);
    if (!parsed.ok) throw new Error("fixture did not parse");
    const toinen: GenericFunctionalWitnessSourceAdapterV1 = {
      adapterId: "fixture-kaikki-source",
      query: () => ({
        ok: true,
        records: [{
          queryForm: "ëmbël",
          sourceId: "fixture-kaikki:ëmbël",
          evidenceFamily: "lexical_dictionary",
          language: "Albanian",
          sourceForm: "ëmbël",
          sourceFormNormalization: "EXACT_PRESERVED",
          gloss: "sweet",
          citationRefs: ["fixture:kaikki"],
          embryoRelation: "exact_form",
          relationOperationIds: [],
          attestationTruth: "fact",
          sourceStatus: "research_candidate",
        }],
      }),
    };
    const albaNet = createAlbaNetSourceFamilyAdapterV0_1(parsed.records);
    const result = queryGenericFunctionalWitnessesV1(query("ëmbël"), [toinen, albaNet]);

    expect(result.matches.map((match) => match.sourceId)).toEqual([
      "fixture-kaikki:ëmbël",
      expect.stringContaining(ALBANET_SOURCE_FAMILY_ID_V0_1),
      expect.stringContaining(ALBANET_SOURCE_FAMILY_ID_V0_1),
    ]);
    expect(result.noSingleWinner).toBe(true);
  });

  it("keeps missing, Kaikki-only, and no-definition forms Null at the AlbaNet seam", () => {
    const parsed = parseAlbaNetTabV0_1(fixture);
    if (!parsed.ok) throw new Error("fixture did not parse");
    const adapter = createAlbaNetSourceFamilyAdapterV0_1(parsed.records);

    expect(queryGenericFunctionalWitnessesV1(query("pelar"), [adapter])).toMatchObject({
      status: "NO_MATCHES",
      matches: [],
      noSingleWinner: true,
    });
    expect(queryGenericFunctionalWitnessesV1(query("vetëm"), [adapter])).toMatchObject({
      status: "NO_MATCHES",
      matches: [],
    });
    expect(queryGenericFunctionalWitnessesV1(query("thëngjilltar"), [adapter])).toMatchObject({
      status: "NO_MATCHES",
      matches: [],
    });
  });

  it("fails closed for malformed rows and unverified external files", async () => {
    expect(parseAlbaNetTabV0_1("# wrong header\n")).toEqual({
      ok: false,
      reasonCode: "ALBANET_SOURCE_PARSE_FAILURE",
    });
    expect(parseAlbaNetTabV0_1(`${fixture}\n00000004-n\tunknown:relation\tvalue`)).toEqual({
      ok: false,
      reasonCode: "ALBANET_SOURCE_PARSE_FAILURE",
    });

    const result = await loadAlbaNetServerOnlySourceV0_1(process.execPath);
    expect(result).toMatchObject({
      status: "UNAVAILABLE",
      reasonCode: "ALBANET_SOURCE_BYTE_LENGTH_MISMATCH",
      adapter: null,
      records: [],
    });
  });
});
