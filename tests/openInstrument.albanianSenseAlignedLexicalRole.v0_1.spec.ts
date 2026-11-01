import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1,
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
  type AlbanianKaikkiExactLexicalSourceSenseV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  createAlbaNetSourceFamilyAdapterV0_1,
  type AlbaNetSourceRecordV0_1,
} from "@/shared/openInstrument/albanetSourceFamilyAdapter.v0_1";
import {
  ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1,
  type EnglishKaikkiServerOnlyExactIndexProviderV0_1,
} from "@/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1";
import { buildMotivationEngineDiscoveryServerOnlyV0_1 } from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import { cleanup, render, screen } from "@testing-library/react";
import { createElement } from "react";

afterEach(() => cleanup());

function unavailableEnglishProvider(): EnglishKaikkiServerOnlyExactIndexProviderV0_1 {
  const result = {
    status: "PROVIDER_CONFIGURATION_FAILURE" as const,
    reasonCode: "PROVIDER_CONFIGURATION_FAILURE",
    queryForm: null,
    records: Object.freeze([]) as readonly [],
  };
  return {
    providerId: ENGLISH_KAIKKI_SERVER_ONLY_EXACT_INDEX_PROVIDER_ID_V0_1,
    runtimeBoundary: "SERVER_ONLY",
    query: async () => result,
    queryWithMetrics: async () => ({
      result,
      metrics: {
        directoryBytesRead: 0,
        postingsBytesRead: 0,
        sourceBytesRead: 0,
        sourceRecordsRecovered: 0,
        adapterRecordsEmitted: 0,
      },
    }),
  };
}

function sourceSense(
  senseId: string,
  glosses: readonly string[],
  synonyms: readonly string[] = [],
  categories: AlbanianKaikkiExactLexicalSourceSenseV0_1["categories"] = [],
): AlbanianKaikkiExactLexicalSourceSenseV0_1 {
  return { senseId, glosses, synonyms, categories };
}

function kaikkiFact(
  form: string,
  senses: readonly AlbanianKaikkiExactLexicalSourceSenseV0_1[],
  overrides: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1> = {},
): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  const encodedForm = encodeURIComponent(form);
  return {
    sourceRecordId: `kaikki-albanian-jsonl:word=${encodedForm}:ordinal=0`,
    entryLocator: `jsonl://word/${encodedForm}/match/0`,
    physicalRecordOrdinal: 0,
    language: "Albanian",
    languageCode: "sq",
    form,
    partOfSpeech: "noun",
    senses,
    ipaObservations: [],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: ALBANIAN_KAIKKI_LEXICAL_PRONUNCIATION_AUTHORITY_V0_1,
    sourceSnapshot: {
      sourceFamilyId: ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
      sourceUrl: ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
      sha256: ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
      bytes: ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
    },
    ...overrides,
  };
}

function albanetRecord(
  synsetId: string,
  lemma: string,
  definition: string,
): AlbaNetSourceRecordV0_1 {
  const encodedLemma = encodeURIComponent(lemma);
  return {
    sourceRecordId: `albanet-omw-sq-v0.1:${synsetId}:lemma=${encodedLemma}`,
    synsetId,
    lemma,
    definitions: [definition],
    examples: [],
    relationTypes: ["als:def", "als:lemma"],
    entryLocator: `wns/als/wn-data-als.tab#synset=${synsetId};lemma=${encodedLemma}`,
  };
}

async function discover(
  word: string,
  fact: AlbanianKaikkiExactLexicalSourceFactV0_1,
  albaNetRecords: readonly AlbaNetSourceRecordV0_1[] | null,
) {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet: "albanian",
  });
  const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
    word,
    inputLanguage: "sq",
    inputProfile: "albanian",
    analysis: enginePayloadToAnalysisResult(payload),
    heart: buildHeartInstrumentV1(word),
    provider: unavailableEnglishProvider(),
    albanianLexicalSourceProvider: createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [fact],
    }),
    albanetSourceAdapter: albaNetRecords ? createAlbaNetSourceFamilyAdapterV0_1(albaNetRecords) : null,
    lexinSourceAdapter: null,
  });
  return result.discovery;
}

describe("sense-aligned Albanian lexical role evidence v0.1", () => {
  it("links only zanatçi sense 1 to the exact AlbaNet worker definition and keeps sense 2 separate", async () => {
    const occupationCategory = {
      name: "Occupations",
      kind: "other",
      parents: [],
      source: "w+disamb",
      orig: "sq:Occupations",
      langcode: "sq",
      _dis: "34 66",
    };
    const fact = kaikkiFact("zanatçi", [
      sourceSense("en-zanatçi-sq-noun-j1cZU1Us", ["craftsman", "artisan"], ["zejtar"]),
      sourceSense("en-zanatçi-sq-noun-AzycDuJd", ["master", "expert"], ["mjeshtër"], [occupationCategory]),
    ], {
      etymologyText: "By surface analysis, zanat (“craft”) + -çi.",
      etymologyTemplates: [{
        name: "surf",
        args: { "1": "sq", "2": "zanat", "3": "çi" },
        expansion: "zanat + -çi",
      }],
    });
    const discovery = await discover("zanatçi", fact, [
      albanetRecord("09974648-n", "zejtar", "një punëtor i afte qe praktikon një zanat"),
      albanetRecord("05643190-n", "mjeshtër", "Puna që bën mjeshtri në një zeje, në një fushë të caktuar të prodhimit ose të veprimtarisë shoqërore etj.; zanat, profesion"),
      albanetRecord("09974648-n", "mjeshter", "një punëtor i afte qe praktikon një zanat"),
    ]);
    const reading = discovery.albanianLexicalReading!;
    const role = reading.senseAlignedLexicalRole!;
    expect(role).toMatchObject({
      status: "SUPPORTED",
      functionalOperation: null,
      noSingleWinner: true,
      lineageIndependence: "INDEPENDENCE_NOT_ESTABLISHED",
    });
    expect(role.candidates).toEqual(expect.arrayContaining([
      expect.objectContaining({
        sourceFact: expect.objectContaining({
          sourceSenseOrdinal: 0,
          sourceSenseId: "en-zanatçi-sq-noun-j1cZU1Us",
          synonym: "zejtar",
        }),
        crossSourceFact: expect.objectContaining({
          lemma: "zejtar",
          synsetId: "09974648-n",
          definitions: ["një punëtor i afte qe praktikon një zanat"],
        }),
        inference: expect.objectContaining({ status: "SUPPORTED", roleLabel: "HUMAN_ROLE" }),
        functionalOperation: null,
      }),
      expect.objectContaining({
        sourceFact: expect.objectContaining({
          sourceSenseOrdinal: 1,
          sourceSenseId: "en-zanatçi-sq-noun-AzycDuJd",
          synonym: "mjeshtër",
        }),
        crossSourceFact: expect.objectContaining({ lemma: "mjeshtër", synsetId: "05643190-n" }),
        inference: expect.objectContaining({ status: "UNKNOWN_OR_NULL", roleLabel: null }),
        reasonCodes: ["ALBANET_DEFINITION_NOT_REVIEWED_FOR_HUMAN_ROLE"],
      }),
    ]));
    expect(reading.functionalMeaningBridge.functionalHypothesis.functionalOperation).toBeNull();
    expect(reading.functionalMeaningBridge.status).toBe("NULL");
    expect(role.candidates[1]?.crossSourceFact?.lemma).not.toBe("mjeshter");
    expect(role.claimBoundary).toContain("does not authorize the existing AGENT operation");

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1?.kind).toBe("present");
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-sense-aligned-lexical-role")).toHaveTextContent("HUMAN_ROLE");
      expect(screen.getByTestId("albanian-sense-aligned-lexical-role")).toHaveTextContent("sense 1");
      expect(screen.getByTestId("albanian-sense-aligned-lexical-role")).toHaveTextContent("Functional operation: Null");
      expect(screen.getByTestId("albanian-sense-aligned-lexical-role")).toHaveTextContent("mjeshtër");
    }

    const readingValue = discovery.albanianLexicalReading!;
    const supportedCandidate = role.candidates.find((candidate) => candidate.inference.status === "SUPPORTED")!;
    const forgedDiscovery = {
      ...discovery,
      albanianLexicalReading: {
        ...readingValue,
        senseAlignedLexicalRole: {
          ...role,
          candidates: role.candidates.map((candidate) => candidate === supportedCandidate
            ? { ...candidate, sourceFact: { ...candidate.sourceFact, sourceSenseId: "forged-sense-id" } }
            : candidate),
        },
      },
    };
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: forgedDiscovery }).motivationDiscoveryV0_1)
      .toMatchObject({ kind: "missing" });
  });

  it("generalizes through veprues sense 1 → aktor without selecting a functional operation", async () => {
    const fact = kaikkiFact("veprues", [
      sourceSense("en-veprues-sq-noun-KfI-FzAy", ["actor, actress"], ["aktor"]),
    ]);
    const discovery = await discover("veprues", fact, [
      albanetRecord("09765278-n", "aktor", "aktoret teatrale"),
    ]);
    expect(discovery.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "SUPPORTED",
      candidates: [{
        sourceFact: { sourceSenseId: "en-veprues-sq-noun-KfI-FzAy", synonym: "aktor" },
        crossSourceFact: { synsetId: "09765278-n", definitions: ["aktoret teatrale"] },
        inference: { status: "SUPPORTED", roleLabel: "HUMAN_ROLE" },
        functionalOperation: null,
      }],
      functionalOperation: null,
    });
  });

  it("returns Null for missing, multiply owned, ambiguous, unreviewed, and diacritic-mismatched links", async () => {
    const missingSynonym = await discover("zanatçi", kaikkiFact("zanatçi", [
      sourceSense("sense-no-synonym", ["craftsman"]),
    ]), [albanetRecord("09974648-n", "zejtar", "një punëtor i afte qe praktikon një zanat")]);
    expect(missingSynonym.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      candidates: [{ reasonCodes: ["SOURCE_SENSE_SYNONYM_MISSING"] }],
      functionalOperation: null,
    });

    const multiplyOwned = await discover("zanatçi", kaikkiFact("zanatçi", [
      sourceSense("sense-one", ["craftsman"], ["zejtar"]),
      sourceSense("sense-two", ["artisan"], ["zejtar"]),
    ]), [albanetRecord("09974648-n", "zejtar", "një punëtor i afte qe praktikon një zanat")]);
    expect(multiplyOwned.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      candidates: [
        { inference: { status: "UNKNOWN_OR_NULL" }, reasonCodes: ["SOURCE_SYNONYM_SENSE_OWNERSHIP_AMBIGUOUS"] },
        { inference: { status: "UNKNOWN_OR_NULL" }, reasonCodes: ["SOURCE_SYNONYM_SENSE_OWNERSHIP_AMBIGUOUS"] },
      ],
    });

    const duplicateSenseId = await discover("zanatçi", kaikkiFact("zanatçi", [
      sourceSense("duplicate-sense", ["craftsman"], ["zejtar"]),
      sourceSense("duplicate-sense", ["artisan"], ["zejtar"]),
    ]), [albanetRecord("09974648-n", "zejtar", "një punëtor i afte qe praktikon një zanat")]);
    expect(duplicateSenseId.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      candidates: [
        { inference: { status: "UNKNOWN_OR_NULL" }, reasonCodes: ["SOURCE_SENSE_IDENTITY_AMBIGUOUS"] },
        { inference: { status: "UNKNOWN_OR_NULL" }, reasonCodes: ["SOURCE_SENSE_IDENTITY_AMBIGUOUS"] },
      ],
    });

    const duplicateSynonym = await discover("zanatçi", kaikkiFact("zanatçi", [
      sourceSense("sense-duplicate-synonym", ["craftsman"], ["zejtar", "zejtar"]),
    ]), [albanetRecord("09974648-n", "zejtar", "një punëtor i afte qe praktikon një zanat")]);
    expect(duplicateSynonym.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      candidates: [
        { inference: { status: "UNKNOWN_OR_NULL" }, reasonCodes: ["SOURCE_SENSE_SYNONYM_DUPLICATE"] },
        { inference: { status: "UNKNOWN_OR_NULL" }, reasonCodes: ["SOURCE_SENSE_SYNONYM_DUPLICATE"] },
      ],
    });

    const mismatchedSynonym = await discover("zanatçi", kaikkiFact("zanatçi", [
      sourceSense("sense-mismatched-synonym", ["craftsman"], ["zejtar-extra"]),
    ]), [albanetRecord("09974648-n", "zejtar", "një punëtor i afte qe praktikon një zanat")]);
    expect(mismatchedSynonym.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      candidates: [{ reasonCodes: ["ALBANET_LEMMA_NOT_FOUND_OR_DEFINITION_MISSING"], inference: { status: "UNKNOWN_OR_NULL" } }],
    });

    const ambiguous = await discover("mjek", kaikkiFact("mjek", [
      sourceSense("en-mjek-sq-noun-fixture", ["doctor, medic"], ["doktor"]),
    ]), [
      albanetRecord("10020890-n", "doktor", "një praktikues mjekësie i licensuar"),
      albanetRecord("10305802-n", "doktor", "dikush qe praktikon mjeksine"),
    ]);
    expect(ambiguous.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      candidates: [{ reasonCodes: ["ALBANET_LEMMA_SYNSET_AMBIGUOUS"], crossSourceFact: null }],
    });

    const unreviewed = await discover("zanatçi", kaikkiFact("zanatçi", [
      sourceSense("sense-mjeshter", ["master, expert"], ["mjeshtër"]),
    ]), [
      albanetRecord("05643190-n", "mjeshtër", "Puna që bën mjeshtri në një zeje, në një fushë të caktuar të prodhimit ose të veprimtarisë shoqërore etj.; zanat, profesion"),
      albanetRecord("09974648-n", "mjeshter", "një punëtor i afte qe praktikon një zanat"),
    ]);
    expect(unreviewed.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      candidates: [{
        crossSourceFact: { lemma: "mjeshtër", synsetId: "05643190-n" },
        inference: { status: "UNKNOWN_OR_NULL" },
        reasonCodes: ["ALBANET_DEFINITION_NOT_REVIEWED_FOR_HUMAN_ROLE"],
      }],
    });

    const unverifiedKaikki = await discover("zanatçi", kaikkiFact("zanatçi", [
      sourceSense("sense-unverified", ["craftsman"], ["zejtar"]),
    ], { sourceSnapshot: { ...kaikkiFact("zanatçi", []).sourceSnapshot, sha256: "0".repeat(64) } }), [
      albanetRecord("09974648-n", "zejtar", "një punëtor i afte qe praktikon një zanat"),
    ]);
    expect(unverifiedKaikki.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      reasonCodes: ["KAIKKI_SOURCE_IDENTITY_UNVERIFIED"],
      candidates: [],
    });

    const missingAlbaNet = await discover("zanatçi", kaikkiFact("zanatçi", [
      sourceSense("sense-no-albanet", ["craftsman"], ["zejtar"]),
    ]), null);
    expect(missingAlbaNet.albanianLexicalReading?.senseAlignedLexicalRole).toMatchObject({
      status: "NULL",
      reasonCodes: ["ALBANET_SOURCE_ADAPTER_UNAVAILABLE"],
      candidates: [],
      functionalOperation: null,
    });
  });
});
