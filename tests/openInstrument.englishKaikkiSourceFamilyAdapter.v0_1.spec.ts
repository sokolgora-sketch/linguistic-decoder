import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import {
  adaptEnglishKaikkiJsonlRecordV0_1,
  createEnglishKaikkiGenericWitnessSourceAdapterV0_1,
  ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  lookupEnglishKaikkiSourceRecordsV0_1,
  projectEnglishKaikkiSourceRecordToGenericWitnessRecordsV0_1,
} from "@/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1";
import {
  GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
  queryGenericFunctionalWitnessesV1,
} from "@/shared/openInstrument/genericFunctionalWitnessDiscovery.v1";

const IMPLEMENTATION_PATH =
  "src/shared/openInstrument/englishKaikkiSourceFamilyAdapter.v0_1.ts";
const IMPLEMENTATION_ARTIFACT_PATH =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-source-family-adapter-v0.1/implementation.json";
const IMPLEMENTATION_MANIFEST_PATH =
  "docs/open-instrument/research-artifacts/source-family-lexical-substrate-v0.1-english-kaikki-source-family-adapter-v0.1/implementation-hash-manifest.json";

function bytes(value: string): Uint8Array {
  return new TextEncoder().encode(value);
}

function recordBytes(record: unknown, suffix = ""): Uint8Array {
  return bytes(`${JSON.stringify(record)}${suffix}`);
}

function adapt(record: unknown, ordinal = 1, suffix = "") {
  return adaptEnglishKaikkiJsonlRecordV0_1({
    recordBytes: recordBytes(record, suffix),
    recordOrdinal: ordinal,
    verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
  });
}

function sourceRecord(record: unknown, ordinal = 1, suffix = "") {
  const result = adapt(record, ordinal, suffix);
  if (!result.ok) throw new Error(`fixture did not adapt: ${result.reasonCode}`);
  return result.record;
}

function query(embryo: string) {
  return {
    schemaVersion: GENERIC_FUNCTIONAL_WITNESS_DISCOVERY_SCHEMA_V1,
    embryo,
    voicePath: ["A"] as const,
    queryNormalization: "EXACT_NFC" as const,
  };
}

describe("English Kaikki source-family adapter v0.1", () => {
  it("projects one admitted record without loading a source", () => {
    const record = sourceRecord({
      word: "Élan",
      lang: "English",
      lang_code: "en",
      pos: "noun",
      senses: [
        {
          id: "noun.1",
          glosses: ["momentum", "vitality"],
          raw_glosses: ["ignored fallback"],
          tags: ["countable"],
          raw_tags: ["source-label"],
          examples: [{ text: "ignored example" }],
          sounds: [{ ipa: "/eɪˈlɒn/" }],
        },
      ],
      forms: [{ form: "élans" }],
      voice_path: ["A"],
    });

    expect(record.word).toBe("Élan");
    expect(record.queryForm).toBe("élan");
    expect(record.senses[0]).toMatchObject({
      sourceSenseId: "noun.1",
      glosses: ["momentum", "vitality"],
      tags: ["countable"],
      raw_tags: ["source-label"],
    });
    expect(JSON.stringify(record)).not.toContain("example");
    expect(JSON.stringify(record)).not.toContain("sounds");
    expect(JSON.stringify(record)).not.toContain("voice_path");
    expect(Object.isFrozen(record)).toBe(true);
  });

  it("binds identity to exact bytes, ordinal, and the frozen snapshot", () => {
    const payload = {
      word: "alpha",
      lang: "English",
      lang_code: "en",
      pos: "noun",
      senses: [{ id: "noun.1", glosses: ["first"] }],
    };
    const exactBytes = recordBytes(payload, "\n");
    const expectedHash = createHash("sha256").update(exactBytes).digest("hex");
    const result = adaptEnglishKaikkiJsonlRecordV0_1({
      recordBytes: exactBytes,
      recordOrdinal: 7,
      verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
    });

    expect(result).toMatchObject({ ok: true });
    if (!result.ok) return;
    expect(result.record.recordSha256).toBe(expectedHash);
    expect(result.record.sourceRecordId).toBe(
      `open-instrument.wiktionary-kaikki-english-lexical-sense.snapshot.2026-10-03.v0_1#jsonl-record-7#record-sha256-${expectedHash}`,
    );
    expect(result.record.entryLocator).toBe(
      `jsonl://record/7;recordSha256=${expectedHash}`,
    );
    expect(result.record.senses[0]?.senseId).toBe(
      `${result.record.sourceRecordId}#sense-1#source-sense-id-noun.1`,
    );
  });

  it("fails closed for snapshot mismatch and malformed JSONL", () => {
    const valid = recordBytes({
      word: "alpha",
      lang: "English",
      lang_code: "en",
      pos: "noun",
      senses: [{ id: "noun.1", glosses: ["first"] }],
    });

    expect(
      adaptEnglishKaikkiJsonlRecordV0_1({
        recordBytes: valid,
        recordOrdinal: 1,
        verifiedSnapshot: { byteLength: 1, sha256: "wrong" },
      }),
    ).toEqual({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
    expect(
      adaptEnglishKaikkiJsonlRecordV0_1({
        recordBytes: bytes("{not-json"),
        recordOrdinal: 1,
        verifiedSnapshot: ENGLISH_KAIKKI_ADAPTER_EXPECTED_SNAPSHOT_IDENTITY_V0_1,
      }),
    ).toEqual({ ok: false, reasonCode: "SOURCE_ADAPTER_FAILURE" });
  });

  it("rejects invalid admitted fields without salvaging the record", () => {
    const base = {
      word: "alpha",
      lang: "English",
      lang_code: "en",
      pos: "noun",
      senses: [{ id: "noun.1", glosses: ["first"] }],
    };
    expect(adapt({ ...base, lang_code: "fr" })).toEqual({
      ok: false,
      reasonCode: "SOURCE_RECORD_INVALID",
    });
    expect(adapt({ ...base, senses: [{ glosses: ["first"] }] })).toEqual({
      ok: false,
      reasonCode: "SOURCE_RECORD_INVALID",
    });
    expect(adapt({ ...base, senses: [{ id: "noun.1", tags: [3] }] })).toEqual({
      ok: false,
      reasonCode: "SOURCE_RECORD_INVALID",
    });
  });

  it("preserves multiple senses and glosses, with raw_glosses fallback", () => {
    const record = sourceRecord({
      word: "poly",
      lang: "English",
      lang_code: "en",
      pos: "noun",
      senses: [
        { id: "noun.1", glosses: ["first", "second"] },
        { id: "noun.2", glosses: [], raw_glosses: ["fallback"] },
      ],
    });
    const projected = projectEnglishKaikkiSourceRecordToGenericWitnessRecordsV0_1(
      record,
    );

    expect(projected.map((item) => item.gloss)).toEqual([
      "first",
      "second",
      "fallback",
    ]);
    expect(projected.map((item) => item.sourceId)).toEqual([
      `${record.senses[0]?.senseId}#gloss-1`,
      `${record.senses[0]?.senseId}#gloss-2`,
      `${record.senses[1]?.senseId}#gloss-1`,
    ]);
    expect(projected[0]?.sourceProvenance).toEqual({
      sourceRecordId: projected[0]?.sourceId,
      sourceTraditionId:
        "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
      sourceTitle: "English Wiktionary -> Wiktextract -> Kaikki English JSONL",
      sourceDateOrVersion: "Kaikki build 2026-10-03; upstream dump 2026-09-02",
      sourceUrlOrArchiveRef:
        "https://kaikki.org/dictionary/English/kaikki.org-dictionary-English.jsonl",
      entryLocator: record.entryLocator,
      sourceHashOrArchiveHash:
        "sha256:9978ce34256e4143c3498387564d293a9a2971ef376c1e038d369a2021c02195",
      languageVariety: null,
    });
  });

  it("returns valid NULL results for missing source and missing gloss", () => {
    const noGloss = sourceRecord({
      word: "empty",
      lang: "English",
      lang_code: "en",
      pos: "noun",
      senses: [{ id: "noun.1", glosses: [], raw_glosses: [] }],
    });
    expect(lookupEnglishKaikkiSourceRecordsV0_1("missing", [noGloss])).toMatchObject({
      status: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      records: [],
    });
    expect(lookupEnglishKaikkiSourceRecordsV0_1("EMPTY", [noGloss])).toMatchObject({
      status: "LEXICAL_SENSE_GLOSS_NOT_FOUND",
      queryForm: "empty",
      records: [],
      matchingSourceRecordIds: [noGloss.sourceRecordId],
    });
  });

  it("keeps repeated same-word/POS records separate and never selects a winner", () => {
    const first = sourceRecord(
      {
        word: "homograph",
        lang: "English",
        lang_code: "en",
        pos: "noun",
        senses: [{ id: "noun.1", glosses: ["one"] }],
      },
      1,
    );
    const second = sourceRecord(
      {
        word: "homograph",
        lang: "English",
        lang_code: "en",
        pos: "noun",
        senses: [{ id: "noun.1", glosses: ["two"] }],
      },
      2,
    );
    const adapter = createEnglishKaikkiGenericWitnessSourceAdapterV0_1([
      first,
      second,
    ]);
    const result = queryGenericFunctionalWitnessesV1(query("homograph"), [adapter]);

    expect(first.sourceRecordId).not.toBe(second.sourceRecordId);
    expect(result.matches.map((match) => match.gloss).sort()).toEqual(["one", "two"]);
    expect(result.matches).toHaveLength(2);
    expect(result.matches.every((match) => match.winnerClaim === "NOT_CLAIMED")).toBe(
      true,
    );
    expect(result.noSingleWinner).toBe(true);
    expect(result.userDecisionPosture).toBe("user_decides");
  });

  it("preserves the generic source-only truth posture and unauthorized Voice boundary", () => {
    const record = sourceRecord({
      word: "fact",
      lang: "English",
      lang_code: "en",
      pos: "noun",
      senses: [{ id: "noun.1", glosses: ["a source gloss"] }],
    });
    const result = queryGenericFunctionalWitnessesV1(query("fact"), [
      createEnglishKaikkiGenericWitnessSourceAdapterV0_1([record]),
    ]);
    const match = result.matches[0];

    expect(match).toMatchObject({
      sourceAttestation: "SOURCE_RECORD_ONLY",
      functionalCorrespondence: "NOT_EVALUATED",
      targetMeaning: "NOT_CLAIMED",
      historicalRelation: "NOT_CLAIMED",
      winnerClaim: "NOT_CLAIMED",
      languageSuperiorityClaim: "NOT_CLAIMED",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
      candidateVoicePathPolicy: "NULL_UNAUTHORIZED",
      sourceStatus: "research_candidate",
      attestationTruth: "fact",
    });
    expect(JSON.stringify(match)).not.toContain("pronunciation");
    expect(JSON.stringify(match)).not.toContain("voicePath");
    expect(JSON.stringify(match)).not.toContain("targetMeaningClaim");
  });

  it("is deterministic across repeated execution and has no runtime/index wiring", () => {
    const record = {
      word: "deterministic",
      lang: "English",
      lang_code: "en",
      pos: "adjective",
      senses: [{ id: "adj.1", glosses: ["repeatable"] }],
    };
    const first = adapt(record, 11);
    const second = adapt(record, 11);
    expect(first).toEqual(second);

    const implementation = readFileSync(IMPLEMENTATION_PATH, "utf8");
    expect(implementation).not.toContain("buildGenericFunctionalWitnessRuntimeProjectionV1");
    expect(implementation).not.toContain("createReadStream");
    expect(implementation).not.toContain("targetWord");
    expect(implementation).not.toContain("STUDY");
    expect(implementation).not.toContain("ZEMËR");
    expect(implementation).not.toContain("createIndex");
    expect(implementation).not.toContain("buildIndex");
  });

  it("records implementation separately without changing the frozen contract", () => {
    const implementation = JSON.parse(
      readFileSync(IMPLEMENTATION_ARTIFACT_PATH, "utf8"),
    ) as {
      contractStatusPreserved: string;
      implementationStatus: string;
      state: Record<string, unknown>;
      nextAction: string;
    };
    const manifest = JSON.parse(
      readFileSync(IMPLEMENTATION_MANIFEST_PATH, "utf8"),
    ) as {
      status: string;
      state: Record<string, unknown>;
      validation: Record<string, unknown>;
    };

    expect(implementation).toMatchObject({
      contractStatusPreserved: "DEFINED_AND_FROZEN_NOT_IMPLEMENTED",
      implementationStatus: "IMPLEMENTED_SOURCE_RECORD_BOUNDARY_ONLY",
      nextAction: "DEFINE_AND_FREEZE_ENGLISH_KAIKKI_DETERMINISTIC_INDEX_V0_1",
    });
    expect(implementation.state).toMatchObject({
      sourceContentBoundedSchemaInspection: true,
      sourceImported: false,
      adapterImplemented: true,
      indexBuilt: false,
      coverageEvaluated: false,
      runtimeAuthorized: false,
      runtimeChanged: false,
      s4: "NOT_STARTED",
    });
    expect(manifest).toMatchObject({
      status: "IMPLEMENTED_SOURCE_RECORD_BOUNDARY_ONLY",
      state: expect.objectContaining({
        sourceAcquired: true,
        sourceSnapshotVerified: true,
        sourceImported: false,
        adapterImplemented: true,
        indexBuilt: false,
        coverageEvaluated: false,
        runtimeAuthorized: false,
        runtimeChanged: false,
        s4: "NOT_STARTED",
      }),
      validation: expect.objectContaining({
        absoluteMachineLocalPathExposed: false,
        fullCorpusParsed: false,
        persistentIndexConstructed: false,
        runtimeWiringAdded: false,
      }),
    });
    expect(readFileSync(IMPLEMENTATION_ARTIFACT_PATH, "utf8")).not.toContain(
      "/Users/",
    );
  });
});
