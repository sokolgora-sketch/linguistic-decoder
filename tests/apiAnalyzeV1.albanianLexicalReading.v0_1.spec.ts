import { POST } from "@/app/api/analyze-v1/route";

jest.mock("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1", () => {
  const actual = jest.requireActual(
    "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1",
  );
  const lexicalSource = jest.requireActual(
    "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1",
  );
  const drite = {
    sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
    entryLocator: "jsonl://word/drit%C3%AB/match/0",
    physicalRecordOrdinal: 3461,
    language: "Albanian",
    languageCode: "sq",
    form: "dritë",
    partOfSpeech: "noun",
    senses: [{ senseId: "drite-light", glosses: ["light", "light (such as a lamp)"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/ˈdɾitə/", tags: [] }],
    relatedForms: [{
      form: "dritare",
      relation: "SOURCE_RELATED_FORM",
      entryLocator: "jsonl://word/dritare",
    }],
    etymologyText: null,
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    },
  };
  const dritare = {
    sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
    entryLocator: "jsonl://word/dritare/match/0",
    physicalRecordOrdinal: 2171,
    language: "Albanian",
    languageCode: "sq",
    form: "dritare",
    partOfSpeech: "noun",
    senses: [{ senseId: "dritare-window", glosses: ["window", "access to knowledge"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/dɾiˈtaɾɛ/", tags: [] }],
    etymologyText: "From dritë (“light”) + -are (“-er”), meaning to let light through or similar.",
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    },
  };
  const albanianProvider = lexicalSource.createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
    facts: [drite, dritare],
  });
  const englishProvider = {
    query: async (query: unknown) => ({
      status: "LEXICAL_SENSE_SOURCE_NOT_FOUND",
      queryForm: typeof query === "string" ? query : "",
      records: [],
    }),
  };

  return {
    ...actual,
    buildMotivationEngineDiscoveryServerOnlyV0_1: async (input: any) => actual.buildMotivationEngineDiscoveryServerOnlyV0_1({
      ...input,
      provider: englishProvider,
      albanianLexicalSourceProvider: albanianProvider,
    }),
  };
});

async function analyzeDriteV0_1(): Promise<any> {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      word: "dritë",
      language: "sq",
      alphabet: "albanian",
      providerExecution: "disabled",
    }),
  }));
  return { status: response.status, body: await response.json() };
}

describe("analyze-v1 Albanian lexical reading reachability", () => {
  const originalMode = process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;

  afterEach(() => {
    if (originalMode === undefined) delete process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;
    else process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = originalMode;
  });

  it.each([
    ["normal mode", undefined],
    ["deterministic-only mode", "deterministic_only"],
  ])("keeps the source-bound dritë reading reachable in %s", async (_label, mode) => {
    if (mode === undefined) delete process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE;
    else process.env.OPEN_INSTRUMENT_PUBLIC_BETA_MODE = mode;

    const result = await analyzeDriteV0_1();
    expect(result.status).toBe(200);
    expect(result.body.motivationDiscoveryV0_1.exactLexicalSourceStatus.status).toBe("MATCHES_FOUND");
    expect(result.body.motivationDiscoveryV0_1.albanianLexicalReading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: { form: "dritë", etymologyText: null },
      relatedForms: [{
        form: "dritare",
        etymologyText: "From dritë (“light”) + -are (“-er”), meaning to let light through or similar.",
      }],
      interpretation: { status: "EXPLORATORY_ZHEJI_READING" },
      composition: {
        status: "NULL",
        relatedForm: "dritare",
        sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
      },
    });
  });
});
