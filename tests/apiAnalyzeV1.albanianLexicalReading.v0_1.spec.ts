import { POST } from "@/app/api/analyze-v1/route";

jest.mock("@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1", () => {
  const actual = jest.requireActual(
    "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1",
  );
  const lexicalSource = jest.requireActual(
    "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1",
  );
  const drite = {
    sourceRecordId: "synthetic-albanian:word=drite:ordinal=0",
    entryLocator: "synthetic://albanian/drite/0",
    physicalRecordOrdinal: 0,
    language: "Albanian",
    languageCode: "sq",
    form: "dritë",
    partOfSpeech: "noun",
    senses: [{ senseId: "drite-light", glosses: ["light", "light (such as a lamp)"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/ˈdɾitə/", tags: [] }],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: {
      sourceFamilyId: "synthetic-albanian-v0.1",
      sourceUrl: "synthetic://albanian",
      sha256: "synthetic-sha256",
      bytes: 1,
    },
  };
  const albanianProvider = lexicalSource.createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
    facts: [drite],
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
      primarySourceFact: { form: "dritë" },
      interpretation: { status: "EXPLORATORY_ZHEJI_READING" },
    });
  });
});
