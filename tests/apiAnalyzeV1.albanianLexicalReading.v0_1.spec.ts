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
    etymologyLinks: [
      { sourceForm: "dritë", reference: "dritë#Albanian" },
      { sourceForm: "-are", reference: "-are#Albanian" },
    ],
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
  const peshk = {
    sourceRecordId: "kaikki-albanian-jsonl:word=peshk:ordinal=0",
    entryLocator: "jsonl://word/peshk/match/0",
    physicalRecordOrdinal: 2352,
    language: "Albanian",
    languageCode: "sq",
    form: "peshk",
    partOfSpeech: "noun",
    senses: [{ senseId: "peshk-fish", glosses: ["fish"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "[pɛʃk]", tags: [] }],
    relatedForms: [{
      form: "peshkatar",
      relation: "SOURCE_DERIVED_FORM",
      entryLocator: "jsonl://word/peshkatar",
    }],
    etymologyText: null,
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const peshkatar = {
    sourceRecordId: "kaikki-albanian-jsonl:word=peshkatar:ordinal=0",
    entryLocator: "jsonl://word/peshkatar/match/0",
    physicalRecordOrdinal: 10353,
    language: "Albanian",
    languageCode: "sq",
    form: "peshkatar",
    partOfSpeech: "noun",
    senses: [{ senseId: "peshkatar-fisherman", glosses: ["fisherman"] }],
    ipaObservations: [],
    etymologyText: null,
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const pele = {
    sourceRecordId: "kaikki-albanian-jsonl:word=pel%C3%AB:ordinal=0",
    entryLocator: "jsonl://word/pel%C3%AB/match/0",
    physicalRecordOrdinal: 4275,
    language: "Albanian",
    languageCode: "sq",
    form: "pelë",
    partOfSpeech: "noun",
    senses: [{ senseId: "en-pelë-sq-noun-B0ryv46E", glosses: ["mare"] }],
    ipaObservations: [],
    relatedForms: [{ form: "pelar", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/pelar" }],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const pelar = {
    sourceRecordId: "kaikki-albanian-jsonl:word=pelar:ordinal=0",
    entryLocator: "jsonl://word/pelar/match/0",
    physicalRecordOrdinal: 1596,
    language: "Albanian",
    languageCode: "sq",
    form: "pelar",
    partOfSpeech: "noun",
    senses: [{ senseId: "en-pelar-sq-noun-RnBYACSN", glosses: ["stableman, ostler, groom (especially mares)"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/peˈlar/", tags: [] }],
    etymologyText: "From pelë (“mare”) + -ar.",
    etymologyLinks: [
      { sourceForm: "pelë", reference: "pelë#Albanian" },
      { sourceForm: "-ar", reference: "-ar#Albanian" },
    ],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const qymyr = {
    sourceRecordId: "kaikki-albanian-jsonl:word=qymyr:ordinal=0",
    entryLocator: "jsonl://word/qymyr/match/0",
    physicalRecordOrdinal: 10253,
    language: "Albanian",
    languageCode: "sq",
    form: "qymyr",
    partOfSpeech: "noun",
    senses: [{ senseId: "en-qymyr-sq-noun-bRFMlfv1", glosses: ["coal"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/cyˈmyɾ/", tags: [] }],
    etymologyText: "Borrowed from Ottoman Turkish كومور (kömür), which in Rumelian dialects is kümür.",
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const qymyrtar = {
    sourceRecordId: "kaikki-albanian-jsonl:word=qymyrtar:ordinal=0",
    entryLocator: "jsonl://word/qymyrtar/match/0",
    physicalRecordOrdinal: 18329,
    language: "Albanian",
    languageCode: "sq",
    form: "qymyrtar",
    partOfSpeech: "noun",
    senses: [{
      senseId: "en-qymyrtar-sq-noun-51rw1lY3",
      glosses: ["charcoal maker"],
      categories: [{
        name: "Occupations",
        kind: "other",
        parents: [],
        source: "w",
        orig: "sq:Occupations",
        langcode: "sq",
        _dis: null,
      }],
    }],
    ipaObservations: [],
    etymologyText: "From qymyr + tar.",
    etymologyLinks: [
      { sourceForm: "qymyr", reference: "qymyr#Albanian" },
      { sourceForm: "tar", reference: "tar#Albanian" },
    ],
    etymologyTemplates: [{
      name: "af",
      args: { "1": "sq", "2": "qymyr", "3": "tar" },
      expansion: "qymyr + tar",
    }],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const zjarrfikes = {
    sourceRecordId: "kaikki-albanian-jsonl:word=zjarrfik%C3%ABs:ordinal=0",
    entryLocator: "jsonl://word/zjarrfik%C3%ABs/match/0",
    physicalRecordOrdinal: 11480,
    language: "Albanian",
    languageCode: "sq",
    form: "zjarrfikës",
    partOfSpeech: "noun",
    senses: [
      { senseId: "en-zjarrfikës-sq-noun-P9hAbGCJ", glosses: ["firefighter"] },
      {
        senseId: "en-zjarrfikës-sq-noun-3IRd5pZ-",
        glosses: ["fireman"],
        categories: [{
          name: "Occupations",
          kind: "other",
          parents: [],
          source: "w+disamb",
          orig: "sq:Occupations",
          langcode: "sq",
          _dis: null,
        }],
      },
    ],
    ipaObservations: [{ soundIndex: 0, ipa: "/zjarfikəse/", tags: [] }],
    etymologyText: "From zjarr + fik + -ës.",
    etymologyLinks: [
      { sourceForm: "zjarr", reference: "zjarr#Albanian" },
      { sourceForm: "fik", reference: "fik#Albanian" },
      { sourceForm: "-ës", reference: "-ës#Albanian" },
    ],
    etymologyTemplates: [{
      name: "compound",
      args: { "1": "sq", "2": "zjarr", "3": "fik", "4": "-ës" },
      expansion: "zjarr + fik + -ës",
    }],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const zjarr = {
    sourceRecordId: "kaikki-albanian-jsonl:word=zjarr:ordinal=0",
    entryLocator: "jsonl://word/zjarr/match/0",
    physicalRecordOrdinal: 2090,
    language: "Albanian",
    languageCode: "sq",
    form: "zjarr",
    partOfSpeech: "noun",
    senses: [{ senseId: "zjarr-fire", glosses: ["fire"] }],
    ipaObservations: [],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const fikNoun = {
    sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=0",
    entryLocator: "jsonl://word/fik/match/0",
    physicalRecordOrdinal: 338,
    language: "Albanian",
    languageCode: "sq",
    form: "fik",
    partOfSpeech: "noun",
    senses: [{ senseId: "en-fik-sq-noun-jDnGNIgm", glosses: ["fig"] }],
    ipaObservations: [],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const fikVerb = {
    sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=1",
    entryLocator: "jsonl://word/fik/match/1",
    physicalRecordOrdinal: 339,
    language: "Albanian",
    languageCode: "sq",
    form: "fik",
    partOfSpeech: "verb",
    senses: [
      { senseId: "en-fik-sq-verb-3UhMn1WK", glosses: ["to extinguish (fire)"] },
      { senseId: "en-fik-sq-verb-j~6gALfc", glosses: ["to switch off, turn off"] },
      { senseId: "en-fik-sq-verb-JbZbl6zi", glosses: ["to bring misfortune, ruin, destroy"] },
    ],
    ipaObservations: [],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const zesSuffix = {
    sourceRecordId: "kaikki-albanian-jsonl:word=-%C3%ABs:ordinal=0",
    entryLocator: "jsonl://word/-%C3%ABs/match/0",
    physicalRecordOrdinal: 7944,
    language: "Albanian",
    languageCode: "sq",
    form: "-ës",
    partOfSpeech: "suffix",
    senses: [{ senseId: "en--ës-sq-suffix-5nXSOZjB", glosses: ["used to form agent nouns. -er"] }],
    ipaObservations: [],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const mal = {
    sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
    entryLocator: "jsonl://word/mal/match/0",
    physicalRecordOrdinal: 126,
    language: "Albanian",
    languageCode: "sq",
    form: "mal",
    partOfSpeech: "noun",
    senses: [
      { senseId: "en-mal-sq-noun-1FNvJVWD", glosses: ["mount"] },
      { senseId: "en-mal-sq-noun-O4DTj3aG", glosses: ["mountain"] },
      { senseId: "en-mal-sq-noun-YZoszxJs", glosses: ["forest"] },
      { senseId: "en-mal-sq-noun-FqyA2~S1", glosses: ["large amount of something"] },
    ],
    ipaObservations: [{ soundIndex: 0, ipa: "[mal]", tags: [] }],
    relatedForms: [{ form: "malor", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/malor" }],
    etymologyText: null,
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const malor = {
    sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
    entryLocator: "jsonl://word/malor/match/0",
    physicalRecordOrdinal: 4391,
    language: "Albanian",
    languageCode: "sq",
    form: "malor",
    partOfSpeech: "adj",
    senses: [{ senseId: "en-malor-sq-adj-Edmafqfe", glosses: ["mountainous"] }],
    ipaObservations: [],
    etymologyText: "From mal + -or.",
    etymologyLinks: [
      { sourceForm: "mal", reference: "mal#Albanian" },
      { sourceForm: "-or", reference: "-or#Albanian" },
    ],
    etymologyTemplates: [{ name: "suffix", args: { "1": "sq", "2": "mal", "3": "-or" }, expansion: "mal + -or" }],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: drite.sourceSnapshot,
  };
  const albanianProvider = lexicalSource.createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
    facts: [drite, dritare, peshk, peshkatar, pele, pelar, qymyr, qymyrtar, zjarrfikes, zjarr, fikNoun, fikVerb, zesSuffix, mal, malor],
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

async function analyzeDritareV0_1(): Promise<any> {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ word: "dritare", language: "sq", alphabet: "albanian", providerExecution: "disabled" }),
  }));
  return { status: response.status, body: await response.json() };
}

async function analyzePeshkV0_1(): Promise<any> {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      word: "peshk",
      language: "sq",
      alphabet: "albanian",
      providerExecution: "disabled",
    }),
  }));
  return { status: response.status, body: await response.json() };
}

async function analyzePeleV0_1(): Promise<any> {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ word: "pelë", language: "sq", alphabet: "albanian", providerExecution: "disabled" }),
  }));
  return { status: response.status, body: await response.json() };
}

async function analyzeQymyrtarV0_1(): Promise<any> {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ word: "qymyrtar", language: "sq", alphabet: "albanian", providerExecution: "disabled" }),
  }));
  return { status: response.status, body: await response.json() };
}

async function analyzeZjarrfikesV0_1(): Promise<any> {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ word: "zjarrfikës", language: "sq", alphabet: "albanian", providerExecution: "disabled" }),
  }));
  return { status: response.status, body: await response.json() };
}

async function analyzeMalorV0_1(): Promise<any> {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ word: "malor", language: "sq", alphabet: "albanian", providerExecution: "disabled" }),
  }));
  return { status: response.status, body: await response.json() };
}

async function analyzeMalV0_1(): Promise<any> {
  const response = await POST(new Request("http://localhost/api/analyze-v1", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ word: "mal", language: "sq", alphabet: "albanian", providerExecution: "disabled" }),
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
      relatedCandidateEvaluations: expect.arrayContaining([
        expect.objectContaining({
          relatedForm: "dritare",
          sourceRelation: "SOURCE_RELATED_FORM",
          resolution: "RESOLVED",
          functionalMeaningBridge: expect.objectContaining({
            status: "SUPPORTED",
            relatedForm: "dritare",
            functionalHypothesis: expect.objectContaining({ functionalOperation: "ENABLE_PASSAGE" }),
          }),
        }),
      ]),
      sourceLinkedComparison: {
        status: "SUPPORTED",
        relation: {
          referencedForm: "dritë",
          reference: "dritë#Albanian",
        },
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        truthLayers: ["SOURCE_FACT", "DERIVED_STRUCTURE", "EXPLORATORY_FUNCTIONAL_HYPOTHESIS"],
        relatedForm: "dritare",
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: "ENABLE_PASSAGE",
        },
      },
      interpretation: { status: "EXPLORATORY_ZHEJI_READING" },
      composition: {
        status: "NULL",
        relatedForm: "dritare",
        sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
      },
    });
    const interpretation = result.body.motivationDiscoveryV0_1.albanianLexicalReading.interpretation;
    expect(interpretation.statement).toEqual(expect.stringContaining("Integrated source-bounded functional reading"));
    expect(interpretation.statement).toEqual(expect.stringContaining("dritare"));
    expect(interpretation.statement).toEqual(expect.stringContaining("light through"));
    expect(interpretation.basis).toEqual(expect.arrayContaining([
      "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE",
      "SOURCE_AUTHORED_TRANSMISSION_EXPLANATION",
      "STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL",
    ]));
  });

  it("projects direct dritare as the primary input with the existing directional passage bridge", async () => {
    const result = await analyzeDritareV0_1();
    expect(result.status).toBe(200);
    expect(result.body.motivationDiscoveryV0_1.albanianLexicalReading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
        form: "dritare",
        meaningGlosses: ["window", "access to knowledge"],
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        relatedForm: "dritare",
        sourceFacts: {
          primary: { form: "dritë", meaningGlosses: ["light", "light (such as a lamp)"] },
          related: { form: "dritare", sourceAuthoredExplanation: "From dritë (“light”) + -are (“-er”), meaning to let light through or similar." },
        },
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: "ENABLE_PASSAGE",
        },
      },
      relatedCandidateEvaluations: [expect.objectContaining({
        relatedForm: "dritare",
        sourceRelation: "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
        sourceLinkedComparison: expect.objectContaining({
          status: "SUPPORTED",
          relation: expect.objectContaining({
            primarySourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
            relatedSourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
            direction: "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE",
            referencedForm: "dritë",
            reference: "dritë#Albanian",
          }),
        }),
        functionalMeaningBridge: expect.objectContaining({
          status: "SUPPORTED",
          functionalHypothesis: expect.objectContaining({ functionalOperation: "ENABLE_PASSAGE" }),
        }),
      })],
      interpretation: expect.objectContaining({
        status: "EXPLORATORY_ZHEJI_READING",
        basis: expect.arrayContaining([
          "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE",
          "SOURCE_AUTHORED_TRANSMISSION_EXPLANATION",
          "STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL",
        ]),
      }),
      composition: { status: "NULL" },
    });
  });

  it("projects direct malor as the queried adjective with the base-attested entity-property bridge", async () => {
    const result = await analyzeMalorV0_1();
    expect(result.status).toBe(200);
    const reading = result.body.motivationDiscoveryV0_1.albanianLexicalReading;
    expect(reading.status).toBe("SUPPORTED");
    expect(reading.primarySourceFact).toMatchObject({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      form: "malor",
      partOfSpeech: "adj",
      meaningGlosses: ["mountainous"],
    });
    expect(reading.sourcePronunciation).toBeNull();
    expect(reading.relatedForms).toEqual([]);
    const candidate = reading.relatedCandidateEvaluations.find((item: any) => item.relatedForm === "malor");
    expect(candidate).toMatchObject({
      relatedForm: "malor",
      sourceRelation: "SOURCE_DERIVED_FORM",
      sourceLinkedComparison: {
        status: "SUPPORTED",
        relation: {
          primarySourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
          relatedSourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
          relation: "SOURCE_DERIVED_FORM",
          referencedForm: "mal",
          reference: "mal#Albanian",
        },
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        functionalHypothesis: {
          functionalOperation: null,
          statement: expect.stringContaining("entity → attributed property"),
        },
      },
    });
    expect(reading.functionalMeaningBridge.status).toBe("SUPPORTED");
    expect(reading.functionalMeaningBridge.sourceFacts.primary.form).toBe("mal");
    expect(reading.functionalMeaningBridge.sourceFacts.related.form).toBe("malor");
    expect(reading.functionalMeaningBridge.functionalHypothesis.functionalOperation).toBeNull();
    expect(reading.interpretation.status).toBe("EXPLORATORY_ZHEJI_READING");
    expect(reading.interpretation.statement).toContain("Integrated source-bounded functional reading");
    expect(reading.interpretation.basis).toContain("STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL");
    expect(reading.composition.status).toBe("NULL");
    expect(reading.interpretation.alternatives).toContain(
      "The base source record has multiple attested senses; this reading does not select or align one unique base sense.",
    );
  });

  it("preserves direct mal's existing entity-property bridge and all attested base senses", async () => {
    const result = await analyzeMalV0_1();
    expect(result.status).toBe(200);
    const reading = result.body.motivationDiscoveryV0_1.albanianLexicalReading;
    expect(reading.primarySourceFact).toMatchObject({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      form: "mal",
      partOfSpeech: "noun",
      meaningGlosses: ["mount", "mountain", "forest", "large amount of something"],
    });
    expect(reading.functionalMeaningBridge).toMatchObject({
      status: "SUPPORTED",
      relatedForm: "malor",
      functionalHypothesis: {
        functionalOperation: null,
        statement: expect.stringContaining("entity → attributed property"),
      },
    });
    expect(reading.functionalMeaningBridge.sourceFacts.primary.sourceSenses.map((sense: any) => sense.senseId)).toEqual([
      "en-mal-sq-noun-1FNvJVWD",
      "en-mal-sq-noun-O4DTj3aG",
      "en-mal-sq-noun-YZoszxJs",
      "en-mal-sq-noun-FqyA2~S1",
    ]);
    expect(reading.interpretation.alternatives).toContain(
      "The base source record has multiple attested senses; this reading does not select or align one unique base sense.",
    );
  });

  it("projects an integrated source-bounded AGENT reading through the API", async () => {
    const result = await analyzePeshkV0_1();
    expect(result.status).toBe(200);
    expect(result.body.motivationDiscoveryV0_1.albanianLexicalReading).toMatchObject({
      status: "SUPPORTED",
      functionalMeaningBridge: {
        status: "SUPPORTED",
        relatedForm: "peshkatar",
        functionalHypothesis: { functionalOperation: "AGENT" },
      },
      interpretation: {
        status: "EXPLORATORY_ZHEJI_READING",
        statement: expect.stringContaining("Integrated source-bounded functional reading"),
        basis: expect.arrayContaining([
          "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE",
          "STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL",
        ]),
      },
    });
  });

  it("projects the source-bounded pelar AGENT reading while keeping research authorization disabled", async () => {
    const result = await analyzePeleV0_1();
    expect(result.status).toBe(200);
    const reading = result.body.motivationDiscoveryV0_1.albanianLexicalReading;
    expect(reading.relatedCandidateEvaluations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        relatedForm: "pelar",
        sourceLinkedComparison: expect.objectContaining({
          status: "SUPPORTED",
          relation: expect.objectContaining({ relation: "SOURCE_DERIVED_FORM", relatedForm: "pelar" }),
        }),
        functionalMeaningBridge: expect.objectContaining({
          status: "SUPPORTED",
          sourceFacts: expect.objectContaining({
            related: expect.objectContaining({
              sourceRecordId: "kaikki-albanian-jsonl:word=pelar:ordinal=0",
              sourceSenses: [expect.objectContaining({
                senseId: "en-pelar-sq-noun-RnBYACSN",
                glosses: ["stableman, ostler, groom (especially mares)"],
              })],
            }),
          }),
          functionalHypothesis: expect.objectContaining({
            functionalOperation: "AGENT",
            basis: expect.arrayContaining([
              "SOURCE_ATTESTED_AGENT_MEANING",
              "SOURCE_DERIVED_FORM_LINK",
            ]),
            statement: expect.stringContaining("stableman, ostler, groom (especially mares)"),
          }),
        }),
      }),
    ]));
    expect(reading.interpretation).toMatchObject({
      status: "EXPLORATORY_ZHEJI_READING",
      statement: expect.stringContaining("Integrated source-bounded functional reading"),
      basis: expect.arrayContaining([
        "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE",
        "STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL",
      ]),
    });
    expect(reading.occupationalRoleResearchCandidates).toMatchObject({
      status: "CANDIDATES_FOUND",
      sourceArtifactSha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      candidates: expect.arrayContaining([
        expect.objectContaining({
          sourceRecordId: "kaikki-albanian-jsonl:word=pelar:ordinal=0",
          senseId: "en-pelar-sq-noun-RnBYACSN",
          functionalOperation: null,
          productionAuthorization: "NOT_AUTHORIZED",
          reasonCodes: expect.not.arrayContaining(["SOURCE_OCCUPATIONS_CATEGORY_ATTESTED"]),
          researchHypothesis: expect.objectContaining({
            hypothesisStatus: "PROPOSED_NOT_REVIEWED",
            reviewCandidate: null,
            ownerApproval: null,
          }),
        }),
      ]),
    });
  });

  it("projects direct qymyrtar input through the API as target-authored, source-bounded AGENT evidence", async () => {
    const result = await analyzeQymyrtarV0_1();
    expect(result.status).toBe(200);
    const reading = result.body.motivationDiscoveryV0_1.albanianLexicalReading;
    expect(reading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId: "kaikki-albanian-jsonl:word=qymyrtar:ordinal=0",
        form: "qymyrtar",
        meaningGlosses: ["charcoal maker"],
        etymologyText: "From qymyr + tar.",
      },
      relatedForms: [],
      relatedCandidateEvaluations: [expect.objectContaining({
        relatedForm: "qymyrtar",
        sourceRelation: "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
        sourceLinkedComparison: expect.objectContaining({
          status: "SUPPORTED",
          relation: expect.objectContaining({
            relation: "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
            primarySourceRecordId: "kaikki-albanian-jsonl:word=qymyr:ordinal=0",
            relatedSourceRecordId: "kaikki-albanian-jsonl:word=qymyrtar:ordinal=0",
            direction: "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE",
            referencedForm: "qymyr",
            reference: "qymyr#Albanian",
          }),
        }),
        functionalMeaningBridge: expect.objectContaining({
          status: "SUPPORTED",
          relatedForm: "qymyrtar",
          functionalHypothesis: expect.objectContaining({
            functionalOperation: "AGENT",
            basis: expect.arrayContaining([
              "TARGET_SOURCE_AUTHORED_ETYMOLOGY_REFERENCE",
              "SOURCE_STRUCTURED_ALBANIAN_REFERENCE",
              "SOURCE_ATTESTED_FINAL_SENSE_CATEGORY",
            ]),
            statement: expect.stringContaining("does not create a base-side SOURCE_DERIVED_FORM assertion"),
          }),
        }),
      })],
      functionalMeaningBridge: expect.objectContaining({
        status: "SUPPORTED",
        functionalHypothesis: expect.objectContaining({ functionalOperation: "AGENT" }),
      }),
      interpretation: expect.objectContaining({
        status: "EXPLORATORY_ZHEJI_READING",
        statement: expect.stringContaining("Integrated source-bounded functional reading"),
        basis: expect.arrayContaining(["STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL"]),
      }),
    });
    expect(reading.functionalMeaningBridge.functionalHypothesis.basis).not.toContain("SOURCE_DERIVED_FORM_LINK");
    const batchCandidate = reading.occupationalRoleResearchCandidates?.candidates.find((candidate: any) => candidate.sourceRecord.lemma === "qymyrtar");
    if (batchCandidate) {
      expect(batchCandidate).toMatchObject({ functionalOperation: null, productionAuthorization: "NOT_AUTHORIZED" });
    }
  });

  it("projects the three-component source hypothesis through the API without AGENT authorization", async () => {
    const result = await analyzeZjarrfikesV0_1();
    expect(result.status).toBe(200);
    const reading = result.body.motivationDiscoveryV0_1.albanianLexicalReading;
    expect(reading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId: "kaikki-albanian-jsonl:word=zjarrfik%C3%ABs:ordinal=0",
        form: "zjarrfikës",
        meaningGlosses: ["firefighter", "fireman"],
      },
      sourceLinkedComponentReading: {
        status: "SUPPORTED",
        relation: { relation: "SOURCE_EXPLICIT_THREE_COMPONENT_COMPOUND" },
        componentResolutions: [
          { sourceForm: "zjarr", status: "RESOLVED" },
          { sourceForm: "fik", status: "AMBIGUOUS", sourceRecordIds: [
            "kaikki-albanian-jsonl:word=fik:ordinal=0",
            "kaikki-albanian-jsonl:word=fik:ordinal=1",
          ] },
          { sourceForm: "-ës", status: "RESOLVED" },
        ],
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: null,
          evidenceRefs: expect.arrayContaining([
            expect.objectContaining({
              sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=0",
              senseIds: ["en-fik-sq-noun-jDnGNIgm"],
            }),
            expect.objectContaining({
              sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=1",
              senseIds: ["en-fik-sq-verb-3UhMn1WK", "en-fik-sq-verb-j~6gALfc", "en-fik-sq-verb-JbZbl6zi"],
            }),
          ]),
        },
      },
      functionalMeaningBridge: { status: "NULL" },
      composition: { status: "NULL", interpretation: { status: "UNKNOWN_OR_NULL", statement: null } },
      interpretation: { status: "UNKNOWN_OR_NULL", statement: null },
    });
    const hypothesis = reading.sourceLinkedComponentReading.functionalHypothesis;
    expect(hypothesis.functionalOperation).toBeNull();
    expect(hypothesis.statement).toContain("no component sense is aligned to a target sense");
  });
});
