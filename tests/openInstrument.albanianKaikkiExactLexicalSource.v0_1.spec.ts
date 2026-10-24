import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticSourceFileV0_1,
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
  type AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1,
  projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1,
} from "@/shared/openInstrument/albanianKaikkiSourceIpaSevenVoiceProductInterpretation.v0_1";
import { projectAlbanianSourceOrderContextSignatureV0_1 } from "@/shared/openInstrument/albanianSourceOrderContextSignature.v0_1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import { createElement } from "react";
import { render, screen } from "@testing-library/react";

function fixtureFact(
  overrides: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1> = {},
): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  return {
    sourceRecordId: "kaikki-albanian-jsonl:word=nënë:ordinal=0",
    entryLocator: "jsonl://word/nënë/match/0",
    physicalRecordOrdinal: 12,
    language: "Albanian",
    languageCode: "sq",
    form: "nënë",
    partOfSpeech: "noun",
    senses: [{ senseId: "en-nënë-sq-noun-fixture", glosses: ["mother", "grandmother"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/nənə/", tags: [] }],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    },
    ...overrides,
  };
}

async function analysisFor(word: string) {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet: "albanian",
  });
  return enginePayloadToAnalysisResult(payload);
}

async function discoveryForFactsV0_1(
  facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[],
  word = facts[0]?.form ?? "",
) {
  const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts });
  const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
    word,
    inputLanguage: "sq",
    inputProfile: "albanian",
    analysis: await analysisFor(word),
    heart: buildHeartInstrumentV1(word),
    albanianLexicalSourceProvider: provider,
  });
  return result.discovery;
}

async function discoveryForFactV0_1(fact: AlbanianKaikkiExactLexicalSourceFactV0_1) {
  return discoveryForFactsV0_1([fact], fact.form);
}

async function discoveryForMalorRelationTextV0_1(etymologyText: string | null | undefined) {
  const mal = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
    entryLocator: "jsonl://word/mal/match/0",
    form: "mal",
    senses: [{ senseId: "mal-1", glosses: ["mountain"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
    relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
  });
  const malor = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
    entryLocator: "jsonl://word/malor/match/0",
    form: "malor",
    senses: [{ senseId: "malor-1", glosses: ["mountainous"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/maˈloɾ/", tags: [] }],
    etymologyText,
  });
  return discoveryForFactsV0_1([mal, malor], "mal");
}

type SyntheticSourceRecordV0_1 = Readonly<{
  word: string;
  lang_code: "sq";
  pos: string;
  senses: readonly Readonly<{ id: string; glosses: readonly string[] }>[];
  sounds: readonly Readonly<{ ipa: string; tags: readonly string[] }>[];
  etymology_text?: string;
  etymology_links?: readonly (readonly [string, string])[];
  etymology_templates?: readonly Readonly<{
    name: string;
    args: Readonly<Record<string, string>>;
    expansion: string;
  }>[];
}>;

async function withSyntheticSourceFileV0_1(
  records: readonly SyntheticSourceRecordV0_1[],
  callback: (input: Readonly<{
    provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1;
    sourcePath: string;
    sourceBytes: Buffer;
    sourceText: Buffer;
  }>) => Promise<void>,
): Promise<void> {
  const sourceText = Buffer.from(
    `${records.map((record) => JSON.stringify(record)).join("\n")}\n`,
    "utf8",
  );
  const directory = await mkdtemp(join(tmpdir(), "open-instrument-albanian-index-"));
  const sourcePath = join(directory, "fixture.jsonl");
  await writeFile(sourcePath, sourceText);
  const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticSourceFileV0_1({
    sourcePath,
    sourceSha256: createHash("sha256").update(sourceText).digest("hex"),
    sourceBytes: sourceText.byteLength,
  });

  try {
    await callback({ provider, sourcePath, sourceBytes: sourceText, sourceText });
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

const indexedFixtureRecordsV0_1: readonly SyntheticSourceRecordV0_1[] = [
  {
    word: "nënë",
    lang_code: "sq",
    pos: "noun",
    senses: [{ id: "nene-1", glosses: ["mother", "grandmother"] }],
    sounds: [{ ipa: "/nənə/", tags: [] }, { ipa: "/nɛːnɛ/", tags: ["variant"] }],
  },
  {
    word: "nënë",
    lang_code: "sq",
    pos: "noun",
    senses: [{ id: "nene-2", glosses: ["maternal grandmother"] }],
    sounds: [{ ipa: "/nənə/", tags: ["regional"] }],
  },
  {
    word: "dritë",
    lang_code: "sq",
    pos: "noun",
    senses: [{ id: "drite-1", glosses: ["light"] }],
    sounds: [{ ipa: "/dɾitə/", tags: [] }],
  },
  {
    word: "yll",
    lang_code: "sq",
    pos: "noun",
    senses: [{ id: "yll-1", glosses: ["star"] }],
    sounds: [{ ipa: "/yl/", tags: [] }],
  },
];

describe("real Albanian exact lexical source integration v0.1", () => {
  it("builds a source-bound Albanian reading with computed IPA Voices and related-form extensions", async () => {
    const drite = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
      entryLocator: "jsonl://word/drit%C3%AB/match/0",
      physicalRecordOrdinal: 3461,
      form: "dritë",
      senses: [{ senseId: "drite-light", glosses: ["light", "light (such as a lamp)"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈdɾitə/", tags: [] }],
      relatedForms: [{
        form: "dritare",
        relation: "SOURCE_RELATED_FORM",
        entryLocator: "jsonl://word/dritare",
      }],
    });
    const dritare = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
      entryLocator: "jsonl://word/dritare/match/0",
      physicalRecordOrdinal: 3462,
      form: "dritare",
      senses: [{ senseId: "dritare-window", glosses: ["window"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/dɾitˈaɾe/", tags: [] }],
      etymologyText: "From dritë (“light”) + -are (“-er”), meaning to let light through or similar.",
      etymologyLinks: [{ sourceForm: "dritë", reference: "dritë#Albanian" }],
      etymologyTemplates: [{
        name: "der",
        args: { "1": "sq", "2": "dritë" },
        expansion: "dritë",
      }],
    });
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [drite, dritare],
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "dritë",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("dritë"),
      heart: buildHeartInstrumentV1("dritë"),
      albanianLexicalSourceProvider: provider,
    });

    expect(result.discovery.albanianLexicalReading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: {
        form: "dritë",
        meaningGlosses: ["light", "light (such as a lamp)"],
        etymologyText: null,
      },
      sourcePronunciation: {
        rawIpa: "/ˈdɾitə/",
        status: "SUPPORTED",
        voicePath: ["I", "Ë"],
      },
      relatedForms: [{
        form: "dritare",
        resolution: "RESOLVED",
        meaningGlosses: ["window"],
        etymologyText: "From dritë (“light”) + -are (“-er”), meaning to let light through or similar.",
      }],
      interpretation: { status: "EXPLORATORY_ZHEJI_READING" },
      composition: {
        status: "NULL",
        relatedForm: "dritare",
        sourceRelation: {
          status: "SOURCE_RELATION_NOT_VERIFIED",
        },
      },
      sourceLinkedComparison: {
        status: "SUPPORTED",
        relation: {
          relatedForm: "dritare",
          referencedForm: "dritë",
          reference: "dritë#Albanian",
        },
        primary: {
          form: "dritë",
          sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
          pronunciationVariants: [{
            rawIpa: "/ˈdɾitə/",
            voicePath: ["I", "Ë"],
            status: "SUPPORTED",
          }],
        },
        related: {
          form: "dritare",
          etymologyLinks: [{ sourceForm: "dritë", reference: "dritë#Albanian" }],
          etymologyTemplates: [{ name: "der" }],
        },
        summary: {
          voicePathRelationship: "SHARED_INITIAL_VOICE_DIFFERENT_LATER_PATH",
        },
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        truthLayers: ["SOURCE_FACT", "DERIVED_STRUCTURE", "EXPLORATORY_FUNCTIONAL_HYPOTHESIS"],
        relatedForm: "dritare",
        sourceFacts: {
          primary: { form: "dritë", meaningGlosses: ["light", "light (such as a lamp)"] },
          related: {
            form: "dritare",
            meaningGlosses: ["window"],
            sourceAuthoredExplanation: "From dritë (“light”) + -are (“-er”), meaning to let light through or similar.",
          },
        },
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
        },
      },
    });

    const vm = adaptAnalysisToTelemetryVM({
      word: "dritë",
      sanitized: "dritë",
      engineVersion: "fixture",
      primaryPath: { voicePath: ["I", "Ë"] },
      candidates: [],
      motivationDiscoveryV0_1: result.discovery,
    });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      expect(vm.motivationDiscoveryV0_1.value.albanianLexicalReading?.sourcePronunciation?.voicePath).toEqual(["I", "Ë"]);
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-reading-related-form")).toHaveTextContent("source-authored etymology (attributed): From dritë");
      expect(screen.getByTestId("albanian-source-linked-comparison")).toHaveTextContent("dritë#Albanian");
      expect(screen.getByTestId("albanian-source-linked-comparison")).toHaveTextContent("SHARED_INITIAL_VOICE_DIFFERENT_LATER_PATH");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("let light through");
      expect(screen.getByTestId("albanian-reading-composition-null")).toHaveTextContent("Null");
    }
  });

  it.each([
    ["foreign language", "mal#French", "SOURCE_FORM_REFERENCE_IDENTITY_INVALID"],
    ["different target", "male#Albanian", "SOURCE_FORM_REFERENCE_IDENTITY_INVALID"],
    ["missing language section", "mal", "SOURCE_FORM_REFERENCE_IDENTITY_INVALID"],
  ])("fails closed for a %s structured reference", async (_label, reference, reasonCode) => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      senses: [{ senseId: "mal-1", glosses: ["mountain"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
      relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
    });
    const related = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      senses: [{ senseId: "malor-1", glosses: ["mountainous"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/maˈloɾ/", tags: [] }],
      etymologyLinks: [{ sourceForm: "mal", reference }],
    });
    const result = await discoveryForFactsV0_1([primary, related], "mal");

    expect(result.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "NULL",
      reasonCodes: [reasonCode],
      related: null,
    });
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", statement: null },
    });
  });

  it("requires source meaning, source relation and supported structure before emitting the bridge", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      senses: [{ senseId: "mal-1", glosses: ["mountain"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
      relatedForms: [{ form: "formal", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/formal" }],
    });
    const relatedWithoutMeaning = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=formal:ordinal=0",
      entryLocator: "jsonl://word/formal/match/0",
      form: "formal",
      senses: [{ senseId: "formal-1", glosses: [] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/foɾˈmal/", tags: [] }],
      etymologyText: "A source-authored note mentions the related-looking spelling without stating a relation.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const missingMeaning = await discoveryForFactsV0_1([primary, relatedWithoutMeaning], "mal");
    expect(missingMeaning.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining(["RELATED_MEANING_EVIDENCE_MISSING"]),
    });
    expect(missingMeaning.albanianLexicalReading?.functionalMeaningBridge.functionalHypothesis.statement).toBeNull();

    const unsupportedRelated = fixtureFact({
      ...relatedWithoutMeaning,
      senses: [{ senseId: "formal-1", glosses: ["formal"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "[?]", tags: [] }],
      etymologyText: "From mal, meaning related to a mountain.",
    });
    const unsupportedStructure = await discoveryForFactsV0_1([primary, unsupportedRelated], "mal");
    expect(unsupportedStructure.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining(["DERIVED_STRUCTURE_NOT_SUPPORTED_FOR_BOTH_RECORDS"]),
    });

    const orthographicOnly = await discoveryForFactsV0_1([fixtureFact({
      form: "mal",
      senses: [{ senseId: "mal-1", glosses: ["mountain"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
      relatedForms: [{ form: "formal", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/formal" }],
    })], "mal");
    expect(orthographicOnly.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining(["SOURCE_LINKED_RELATION_NOT_SUPPORTED"]),
    });
  });

  it.each([
    ["no senses", []],
    ["empty gloss array", [{ senseId: "mal-empty", glosses: [] }]],
    ["whitespace-only glosses", [{ senseId: "mal-whitespace", glosses: [" ", "\t"] }]],
  ] as const)("blocks the bridge when the primary record has %s", async (_label, senses) => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      senses,
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
      relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
    });
    const related = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      senses: [{ senseId: "malor-1", glosses: ["mountainous"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/maˈloɾ/", tags: [] }],
      etymologyText: "From mal, meaning mountainous.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const result = await discoveryForFactsV0_1([primary, related], "mal");
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      sourceFacts: {
        primary: { meaningGlosses: senses.flatMap((sense) => sense.glosses) },
        related: { meaningGlosses: ["mountainous"] },
      },
      derivedStructure: expect.any(Object),
      functionalHypothesis: {
        status: "UNKNOWN_OR_NULL",
        statement: null,
        basis: [],
      },
      reasonCodes: expect.arrayContaining(["PRIMARY_MEANING_EVIDENCE_MISSING"]),
    });
    expect(result.albanianLexicalReading?.functionalMeaningBridge.functionalHypothesis.basis)
      .not.toContain("SOURCE_ATTESTED_PRIMARY_MEANING");
    expect(result.albanianLexicalReading?.composition.status).toBe("NULL");
  });

  it("blocks the bridge when both primary and related meanings are missing", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      senses: [],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
      relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
    });
    const related = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      senses: [{ senseId: "malor-empty", glosses: [] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/maˈloɾ/", tags: [] }],
      etymologyText: "From mal, meaning mountainous.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const result = await discoveryForFactsV0_1([primary, related], "mal");
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", statement: null },
      reasonCodes: expect.arrayContaining([
        "PRIMARY_MEANING_EVIDENCE_MISSING",
        "RELATED_MEANING_EVIDENCE_MISSING",
      ]),
    });
  });

  it("rejects ambiguous duplicate Albanian references while preserving the exact positive case", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
    });
    const related = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      etymologyLinks: [
        { sourceForm: "mal", reference: "mal#Albanian" },
        { sourceForm: "mal", reference: "mal#Albanian" },
      ],
    });
    const ambiguous = await discoveryForFactsV0_1([primary, related], "mal");
    expect(ambiguous.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "NULL",
      reasonCodes: ["SOURCE_FORM_REFERENCE_AMBIGUOUS"],
    });

    const positiveRelated = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=1",
      entryLocator: "jsonl://word/malor/match/1",
      form: "malor",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const positive = await discoveryForFactsV0_1([primary, positiveRelated], "mal");
    expect(positive.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "SUPPORTED",
      relation: { referencedForm: "mal", reference: "mal#Albanian" },
    });
  });

  it("preserves optional prefix, inter-nucleus, and suffix consonants", () => {
    const cases = [
      ["/(m)a/", "prefix"],
      ["/a(m)a/", "inter"],
      ["/a(m)/", "suffix"],
    ] as const;

    for (const [ipa, region] of cases) {
      const fact = fixtureFact({ ipaObservations: [{ soundIndex: 0, ipa, tags: ["optional-fixture"] }] });
      const [analysis] = projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(fact);
      const context = projectAlbanianSourceOrderContextSignatureV0_1({ fact, analysis });
      expect(context).toMatchObject({ status: "SUPPORTED" });
      const segments = region === "prefix"
        ? context.prefixConsonants
        : region === "inter"
          ? context.interNucleusRegions?.[0]?.consonants
          : context.suffixConsonants;
      expect(segments).toEqual([expect.objectContaining({ raw: "m", baseSymbol: "m", optional: true })]);
    }
  });

  it("preserves every supported pronunciation variant identity and tag", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=ma:ordinal=0",
      entryLocator: "jsonl://word/ma/match/0",
      form: "ma",
      ipaObservations: [
        { soundIndex: 0, ipa: "/ma(l)/", tags: ["optional"] },
        { soundIndex: 1, ipa: "/mal/", tags: ["variant"] },
      ],
      relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
    });
    const related = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      etymologyLinks: [{ sourceForm: "ma", reference: "ma#Albanian" }],
    });
    const result = await discoveryForFactsV0_1([primary, related], "ma");
    expect(result.albanianLexicalReading?.sourceLinkedComparison?.primary.pronunciationVariants).toMatchObject([
      { soundIndex: 0, rawIpa: "/ma(l)/", tags: ["optional"] },
      { soundIndex: 1, rawIpa: "/mal/", tags: ["variant"] },
    ]);
  });

  it("keeps optional and mandatory consonantal contexts distinct and renders optionality", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=ma:ordinal=0",
      entryLocator: "jsonl://word/ma/match/0",
      form: "ma",
      ipaObservations: [{ soundIndex: 0, ipa: "/ma(l)/", tags: ["optional"] }],
      relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
    });
    const mandatoryRelated = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      ipaObservations: [{ soundIndex: 0, ipa: "/mal/", tags: ["mandatory"] }],
      etymologyLinks: [{ sourceForm: "ma", reference: "ma#Albanian" }],
    });
    const mandatoryComparison = await discoveryForFactsV0_1([primary, mandatoryRelated], "ma");
    expect(mandatoryComparison.albanianLexicalReading?.sourceLinkedComparison?.summary).toMatchObject({
      consonantalContextRelationship: "DIFFERENT_SUPPORTED_CONTEXTS",
    });
    expect(mandatoryComparison.albanianLexicalReading?.sourceLinkedComparison?.primary.pronunciationVariants[0]?.consonantalContext.suffixConsonants).toEqual([
      { raw: "l", baseSymbol: "l", optional: true },
    ]);

    const optionalRelated = fixtureFact({
      ...mandatoryRelated,
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=1",
      entryLocator: "jsonl://word/malor/match/1",
      ipaObservations: [{ soundIndex: 0, ipa: "/ma(l)/", tags: ["optional"] }],
    });
    const exactComparison = await discoveryForFactsV0_1([primary, optionalRelated], "ma");
    expect(exactComparison.albanianLexicalReading?.sourceLinkedComparison?.summary).toMatchObject({
      consonantalContextRelationship: "EXACT_SUPPORTED_CONTEXT_SET_MATCH",
    });

    const vm = adaptAnalysisToTelemetryVM({
      word: "ma",
      sanitized: "ma",
      engineVersion: "fixture",
      primaryPath: { voicePath: ["A"] },
      candidates: [],
      motivationDiscoveryV0_1: mandatoryComparison,
    });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-source-linked-comparison")).toHaveTextContent("l (optional)");
    }
  });

  it("keeps unrelated, ambiguous, and related-only light glosses Null", async () => {
    const unrelatedLight = await discoveryForFactV0_1(fixtureFact({
      form: "lehtë",
      senses: [{ senseId: "light-weight", glosses: ["light (not heavy)", "easy"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈlɛht/", tags: [] }],
    }));
    const ambiguousLight = await discoveryForFactV0_1(fixtureFact({
      form: "ambiguous-light",
      senses: [{ senseId: "mixed-light", glosses: ["light", "light (not heavy)"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
    }));
    const zemer = await discoveryForFactV0_1(fixtureFact({
      form: "zemër",
      senses: [{ senseId: "zemer-heart", glosses: ["heart", "courage"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈzeməɾ/", tags: [] }],
    }));
    const shqip = await discoveryForFactV0_1(fixtureFact({
      form: "shqip",
      partOfSpeech: "adverb",
      senses: [{ senseId: "shqip-albanian", glosses: ["Albanian"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ʃcip/", tags: [] }],
    }));

    for (const discovery of [unrelatedLight, ambiguousLight, zemer, shqip]) {
      expect(discovery.albanianLexicalReading?.interpretation).toMatchObject({
        status: "UNKNOWN_OR_NULL",
        statement: null,
      });
    }
  });

  it("does not promote a related form's illumination gloss into the queried form", async () => {
    const dritare = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
      entryLocator: "jsonl://word/dritare/match/0",
      form: "dritare",
      senses: [{ senseId: "dritare-window", glosses: ["window"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/dɾitˈaɾe/", tags: [] }],
      relatedForms: [{
        form: "dritë",
        relation: "SOURCE_RELATED_FORM",
        entryLocator: "jsonl://word/drit%C3%AB",
      }],
    });
    const drite = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=1",
      entryLocator: "jsonl://word/drit%C3%AB/match/1",
      form: "dritë",
      senses: [{ senseId: "drite-light", glosses: ["light", "light (such as a lamp)"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈdɾitə/", tags: [] }],
    });
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [dritare, drite],
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "dritare",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("dritare"),
      heart: buildHeartInstrumentV1("dritare"),
      albanianLexicalSourceProvider: provider,
    });

    expect(result.discovery.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
    expect(result.discovery.albanianLexicalReading?.composition).toMatchObject({
      status: "NULL",
      sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
    });
    expect(result.discovery.albanianLexicalReading?.relatedForms[0]).toMatchObject({
      resolution: "RESOLVED",
      entryLocator: "jsonl://word/drit%C3%AB/match/1",
    });
  });

  it("keeps a source-linked form without source relation evidence Null", async () => {
    const shqiptar = await discoveryForFactV0_1(fixtureFact({
      form: "shqiptar",
      senses: [{ senseId: "shqiptar-1", glosses: ["Albanian"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ʃciptaɾ/", tags: [] }],
      relatedForms: [{
        form: "shqip",
        relation: "SOURCE_RELATED_FORM",
        entryLocator: "jsonl://word/shqip",
      }],
    }));
    expect(shqiptar.albanianLexicalReading?.composition).toMatchObject({
      status: "NULL",
      relatedForm: null,
      sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
    });
  });

  it("returns a Null lexical composition for an unsupported Albanian word", async () => {
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [fixtureFact({ form: "shqiptar" })],
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "shqiptarx",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("shqiptarx"),
      heart: buildHeartInstrumentV1("shqiptarx"),
      albanianLexicalSourceProvider: provider,
    });
    expect(result.discovery.albanianLexicalReading).toMatchObject({
      status: "NULL",
      composition: { status: "NULL", relatedForm: null },
    });
  });

  it("keeps the currently absent dritëshkurtër source record as Null", async () => {
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "dritëshkurtër",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("dritëshkurtër"),
      heart: buildHeartInstrumentV1("dritëshkurtër"),
      albanianLexicalSourceProvider: createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
        facts: [fixtureFact({ form: "dritë" })],
      }),
    });
    expect(result.discovery.albanianLexicalReading).toMatchObject({
      status: "NULL",
      functionalMeaningBridge: {
        status: "NULL",
        reasonCodes: ["PRIMARY_SOURCE_RECORD_NOT_FOUND"],
      },
    });
  });

  it("keeps source-authored relation prose attributed without deriving machine composition", async () => {
    const mal = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      senses: [{ senseId: "mal-1", glosses: ["mountain"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
      relatedForms: [{
        form: "malor",
        relation: "SOURCE_RELATED_FORM",
        entryLocator: "jsonl://word/malor",
      }],
    });
    const malor = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      senses: [{ senseId: "malor-1", glosses: ["mountainous"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/maˈloɾ/", tags: [] }],
      etymologyText: "From mal + -or, meaning related to a mountain.",
    });
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [mal, malor],
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "mal",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("mal"),
      heart: buildHeartInstrumentV1("mal"),
      albanianLexicalSourceProvider: provider,
    });
    expect(result.discovery.albanianLexicalReading?.relatedForms[0]).toMatchObject({
      form: "malor",
      etymologyText: "From mal + -or, meaning related to a mountain.",
    });
    expect(result.discovery.albanianLexicalReading?.composition).toMatchObject({
      status: "NULL",
      relatedForm: "malor",
      sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
    });
  });

  it.each([
    ["substring", "From formal, referring to an unrelated explanatory form."],
    ["unrelated clause", "From an unrelated root, the explanatory clause mentions mal."],
    ["missing relation marker", "A formal note mentions mal but does not state a derivation."],
    ["negated from", "Not from mal."],
    ["negated derived from", "Not derived from mal."],
    ["rather than", "From another root rather than mal."],
    ["unlike", "Unlike mal."],
    ["not related", "Not related to mal."],
    ["possibly", "Possibly from mal."],
    ["perhaps", "Perhaps from mal."],
    ["may be", "May be from mal."],
    ["from X not mal", "From X, not mal."],
    ["not to be confused", "Not to be confused with mal."],
    ["competing origins", "From mal or another root."],
  ])("does not promote %s source prose into a machine relation", async (_label, etymologyText) => {
    const result = await discoveryForMalorRelationTextV0_1(etymologyText);
    expect(result.albanianLexicalReading?.composition).toMatchObject({
      status: "NULL",
      sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
    });
    expect(result.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "NULL",
      reasonCodes: ["SOURCE_FORM_REFERENCE_NOT_PRESENT"],
    });
  });

  it("keeps a missing source-linked record and unsupported IPA comparison Null", async () => {
    const primary = fixtureFact({
      form: "mal",
      relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
    });
    const result = await discoveryForFactV0_1(primary);
    expect(result.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "NULL",
      reasonCodes: ["SOURCE_LINK_UNRESOLVED"],
      related: null,
    });
  });

  it("keeps a missing related source record Null", async () => {
    const mal = fixtureFact({
      form: "mal",
      relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" }],
    });
    const result = await discoveryForFactV0_1(mal);
    expect(result.albanianLexicalReading?.relatedForms[0]).toMatchObject({
      form: "malor",
      resolution: "UNRESOLVED",
      etymologyText: null,
    });
    expect(result.albanianLexicalReading?.composition).toMatchObject({
      status: "NULL",
      relatedForm: null,
      sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
    });
  });

  it("rejects a form found only in an unrelated explanatory clause", async () => {
    const result = await discoveryForMalorRelationTextV0_1(
      "From an unrelated root, the explanatory clause mentions mal.",
    );
    expect(result.albanianLexicalReading?.composition).toMatchObject({
      status: "NULL",
      sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
    });
  });

  it("rejects source text without an explicit relation marker", async () => {
    const result = await discoveryForMalorRelationTextV0_1(
      "A formal note mentions mal but does not state a derivation.",
    );
    expect(result.albanianLexicalReading?.composition).toMatchObject({
      status: "NULL",
      sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
    });
  });

  it("rejects ambiguous source relation evidence", async () => {
    const result = await discoveryForMalorRelationTextV0_1("Possibly from mal or another root.");
    expect(result.albanianLexicalReading?.composition).toMatchObject({
      status: "NULL",
      sourceRelation: { status: "SOURCE_RELATION_NOT_VERIFIED" },
    });
  });

  it("verifies once, indexes exact records, and reuses the index for different words", async () => {
    await withSyntheticSourceFileV0_1(indexedFixtureRecordsV0_1, async ({ provider, sourceBytes }) => {
      const nene = await provider.queryWithMetrics("NËNË");
      const drite = await provider.queryWithMetrics("dritë");

      expect(nene.result).toMatchObject({ status: "MATCHES_FOUND", queryForm: "NËNË" });
      expect(nene.result.status === "MATCHES_FOUND" ? nene.result.facts : []).toHaveLength(2);
      expect(nene.result.status === "MATCHES_FOUND" ? nene.result.facts.map((fact) => fact.physicalRecordOrdinal) : []).toEqual([0, 1]);
      expect(nene.result.status === "MATCHES_FOUND" ? nene.result.facts[0]?.senses : []).toEqual([
        { senseId: "nene-1", glosses: ["mother", "grandmother"] },
      ]);
      expect(nene.result.status === "MATCHES_FOUND" ? nene.result.facts[0]?.ipaObservations : []).toEqual([
        { soundIndex: 0, ipa: "/nənə/", tags: [] },
        { soundIndex: 1, ipa: "/nɛːnɛ/", tags: ["variant"] },
      ]);
      expect(drite.result).toMatchObject({ status: "MATCHES_FOUND", queryForm: "dritë" });
      expect(drite.result.status === "MATCHES_FOUND" ? drite.result.facts[0]?.form : null).toBe("dritë");
      expect(nene.metrics.indexInitializationCount).toBe(1);
      expect(drite.metrics.indexInitializationCount).toBe(1);
      expect(nene.metrics.fullSourceScanCount).toBe(1);
      expect(drite.metrics.fullSourceScanCount).toBe(1);
      expect(nene.metrics.fullSourceBytesScanned).toBe(sourceBytes.byteLength);
      expect(drite.metrics.indexedLookupBytesRead).toBeLessThan(sourceBytes.byteLength);
    });
  });

  it("preserves Ë, ë, and Y lookup identity and returns explicit Null for a miss", async () => {
    await withSyntheticSourceFileV0_1(indexedFixtureRecordsV0_1, async ({ provider }) => {
      const decomposedDrite = await provider.query("DRIT" + "E\u0308");
      const yll = await provider.query("YLL");
      const missing = await provider.query("not-a-word");

      expect(decomposedDrite).toMatchObject({ status: "MATCHES_FOUND", facts: [{ form: "dritë" }] });
      expect(yll).toMatchObject({ status: "MATCHES_FOUND", facts: [{ form: "yll" }] });
      expect(missing).toMatchObject({
        status: "SOURCE_NOT_FOUND",
        reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND",
        facts: [],
      });
    });
  });

  it("fails closed when an indexed source record is corrupted after initialization", async () => {
    await withSyntheticSourceFileV0_1(indexedFixtureRecordsV0_1, async ({ provider, sourcePath, sourceBytes }) => {
      await expect(provider.query("nënë")).resolves.toMatchObject({ status: "MATCHES_FOUND" });
      const corrupted = Buffer.from(sourceBytes);
      const markerOffset = corrupted.indexOf(Buffer.from("mother", "utf8"));
      expect(markerOffset).toBeGreaterThanOrEqual(0);
      corrupted[markerOffset] = "f".charCodeAt(0);
      await writeFile(sourcePath, corrupted);

      await expect(provider.query("nënë")).resolves.toMatchObject({
        status: "UNAVAILABLE",
        reasonCode: "ALBANIAN_SOURCE_IDENTITY_MISMATCH",
        facts: [],
      });
    });
  });

  it("shares one deterministic index initialization across concurrent exact queries", async () => {
    await withSyntheticSourceFileV0_1(indexedFixtureRecordsV0_1, async ({ provider }) => {
      const results = await Promise.all(
        Array.from({ length: 8 }, (_, index) => provider.queryWithMetrics(index % 2 === 0 ? "nënë" : "dritë")),
      );

      expect(results.every(({ result }) => result.status === "MATCHES_FOUND")).toBe(true);
      expect(results.map(({ metrics }) => metrics.indexInitializationCount)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
      expect(results.map(({ metrics }) => metrics.fullSourceScanCount)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
    });
  });

  it("preserves exact Unicode form, senses, IPA observations, and snapshot provenance", async () => {
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [fixtureFact()],
    });

    await expect(provider.query("NËNË")).resolves.toMatchObject({
      status: "MATCHES_FOUND",
      queryForm: "NËNË",
      facts: [{
        form: "nënë",
        senses: [{ glosses: ["mother", "grandmother"] }],
        ipaObservations: [{ ipa: "/nənə/", tags: [] }],
        pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
        sourceSnapshot: {
          sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
          bytes: 67438537,
        },
      }],
    });
  });

  it("preserves structured source-authored etymology references without promoting them", async () => {
    await withSyntheticSourceFileV0_1([{
      word: "dritare",
      lang_code: "sq",
      pos: "noun",
      senses: [{ id: "dritare-1", glosses: ["window"] }],
      sounds: [{ ipa: "/dɾiˈtaɾɛ/", tags: [] }],
      etymology_text: "From dritë + -are.",
      etymology_links: [["dritë", "dritë#Albanian"]],
      etymology_templates: [{
        name: "inh",
        args: { "1": "sq", "2": "sqj-pro", "3": "*dritā" },
        expansion: "Proto-Albanian *dritā",
      }],
    }], async ({ provider }) => {
      await expect(provider.query("dritare")).resolves.toMatchObject({
        status: "MATCHES_FOUND",
        facts: [{
          etymologyText: "From dritë + -are.",
          etymologyLinks: [{ sourceForm: "dritë", reference: "dritë#Albanian" }],
          etymologyTemplates: [{
            name: "inh",
            args: { "3": "*dritā" },
            expansion: "Proto-Albanian *dritā",
          }],
        }],
      });
    });
  });

  it("returns an explicit source miss without inventing a lexical fact", async () => {
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [fixtureFact()],
    });

    await expect(provider.query("yll")).resolves.toMatchObject({
      status: "SOURCE_NOT_FOUND",
      reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND",
      facts: [],
    });
  });

  it("keeps exact Albanian facts separate from candidates and Voice authority", async () => {
    const word = "nënë";
    const heart = buildHeartInstrumentV1(word);
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [fixtureFact()],
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor(word),
      heart,
      albanianLexicalSourceProvider: provider,
    });

    expect(result.discovery.exactLexicalSourceStatus).toMatchObject({
      status: "MATCHES_FOUND",
      queryForm: "nënë",
      reasonCode: null,
    });
    expect(result.discovery.exactLexicalSourceFacts).toHaveLength(1);
    expect(result.discovery.exactLexicalSourceFacts?.[0]?.form).toBe("nënë");
    expect(result.discovery.exactLexicalSourceFacts?.[0]?.ipaObservations[0]?.ipa).toBe("/nənə/");
    expect(result.discovery.derivedStructure.voicePathSource).toBe("albanian_profile");
    expect(result.discovery.derivedStructure.gamma.status).toBe("profile_derived");
    expect(result.discovery.candidates.every((candidate) => candidate.candidateForm !== "nënë")).toBe(true);
    expect(result.discovery.sourceIpaSevenVoiceAnalyses).toMatchObject([{
      rawIpa: "/nənə/",
      status: "SUPPORTED",
      voicePath: ["Ë", "Ë"],
      authorityBoundary: "CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY",
      sourceRecordId: "kaikki-albanian-jsonl:word=nënë:ordinal=0",
    }]);
  });

  it("maps supported source IPA and preserves explicit Null for glide and missing observations", () => {
    const analyses = projectAlbanianKaikkiFactSourceIpaToSevenVoicesV0_1(fixtureFact({
      ipaObservations: [
        { soundIndex: 0, ipa: "/nənə/", tags: [] },
        { soundIndex: 1, ipa: "/ujə/", tags: ["variant"] },
        { soundIndex: 2, ipa: null, tags: ["missing"] },
        { soundIndex: 3, ipa: "/pi.a/", tags: ["explicit-boundary"] },
        { soundIndex: 4, ipa: "/pia/", tags: ["unresolved-adjacency"] },
        { soundIndex: 5, ipa: "/ˈpi·a/", tags: ["stress-explicit-boundary"] },
        { soundIndex: 6, ipa: "/sy/", tags: ["y"] },
      ],
    }));

    expect(analyses[0]).toMatchObject({ status: "SUPPORTED", voicePath: ["Ë", "Ë"], nucleusStructure: "SEQUENTIAL_NUCLEI" });
    expect(analyses[1]).toMatchObject({
      status: "NULL",
      voicePath: [],
      nucleusStructure: "UNRESOLVED_NUCLEUS_STRUCTURE",
      reasonCodes: ["NUCLEUS_STRUCTURE_UNRESOLVED"],
      tags: ["variant"],
    });
    expect(analyses[2]).toMatchObject({
      status: "NULL",
      rawIpa: null,
      reasonCodes: ["IPA_OBSERVATION_MISSING"],
      tags: ["missing"],
    });
    expect(analyses[3]).toMatchObject({
      status: "SUPPORTED",
      voicePath: ["I", "A"],
      nucleusStructure: "SEQUENTIAL_NUCLEI",
      pronunciationBody: "pia",
    });
    expect(analyses[4]).toMatchObject({
      status: "NULL",
      voicePath: [],
      nucleusStructure: "UNRESOLVED_NUCLEUS_STRUCTURE",
      reasonCodes: ["NUCLEUS_STRUCTURE_UNRESOLVED", "PLAIN_IPA_ADJACENCY_INSUFFICIENT"],
    });
    expect(analyses[5]).toMatchObject({ status: "SUPPORTED", voicePath: ["I", "A"] });
    expect(analyses[6]).toMatchObject({ status: "SUPPORTED", voicePath: ["Y"] });
  });

  it("accepts canonical source Voice paths and rejects malformed Voice/category payloads", async () => {
    const neneDiscovery = await discoveryForFactV0_1(fixtureFact());
    const yDiscovery = await discoveryForFactV0_1(fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=sy:ordinal=0",
      entryLocator: "jsonl://word/sy/match/0",
      form: "sy",
      ipaObservations: [{ soundIndex: 0, ipa: "/sy/", tags: [] }],
    }));
    const nullDiscovery = await discoveryForFactV0_1(fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=ujë:ordinal=0",
      entryLocator: "jsonl://word/ujë/match/0",
      form: "ujë",
      ipaObservations: [{ soundIndex: 0, ipa: "/ujə/", tags: [] }],
    }));

    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: neneDiscovery }).motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: yDiscovery }).motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: nullDiscovery }).motivationDiscoveryV0_1).toMatchObject({ kind: "present" });

    const yAnalysis = yDiscovery.sourceIpaSevenVoiceAnalyses?.[0];
    const neneAnalysis = neneDiscovery.sourceIpaSevenVoiceAnalyses?.[0];
    expect(yAnalysis?.voicePath).toEqual(["Y"]);
    expect(neneAnalysis?.voicePath).toEqual(["Ë", "Ë"]);

    const invalidVoicePath = {
      ...yDiscovery,
      sourceIpaSevenVoiceAnalyses: yDiscovery.sourceIpaSevenVoiceAnalyses?.map((analysis) => ({
        ...analysis,
        voicePath: ["X"],
      })),
    };
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: invalidVoicePath }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const invalidNucleusVoice = {
      ...neneDiscovery,
      sourceIpaSevenVoiceAnalyses: neneDiscovery.sourceIpaSevenVoiceAnalyses?.map((analysis) => ({
        ...analysis,
        nuclei: analysis.nuclei.map((nucleus) => ({ ...nucleus, voice: "X" })),
      })),
    };
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: invalidNucleusVoice }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const invalidCategoryVoicePair = {
      ...neneDiscovery,
      sourceIpaSevenVoiceAnalyses: neneDiscovery.sourceIpaSevenVoiceAnalyses?.map((analysis) => ({
        ...analysis,
        nuclei: analysis.nuclei.map((nucleus) => ({
          ...nucleus,
          category: "HIGH_FRONT_UNROUNDED",
        })),
      })),
    };
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: invalidCategoryVoicePair }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const invalidNucleusCategory = {
      ...neneDiscovery,
      sourceIpaSevenVoiceAnalyses: neneDiscovery.sourceIpaSevenVoiceAnalyses?.map((analysis) => ({
        ...analysis,
        nuclei: analysis.nuclei.map((nucleus) => ({
          ...nucleus,
          category: "INVALID_CATEGORY",
        })),
      })),
    };
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: invalidNucleusCategory }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it("renders exact Albanian source facts as a separate UI section", () => {
    const discovery = {
      schemaVersion: "open-instrument.motivation-engine-discovery.v0_1" as const,
      status: "NO_MATCHES" as const,
      inputWord: "nënë",
      inputLanguage: "sq",
      inputProfile: "albanian",
      sourceFact: {
        layer: "SOURCE_FACT" as const,
        language: "sq",
        profile: "albanian",
        representation: "albanian_profile" as const,
        sourceStatus: "explicit_profile_binding_without_spoken_authority",
        authorityBoundary: "Albanian Discovery profile only; no production pronunciation promotion",
      },
      exactLexicalSourceStatus: {
        status: "MATCHES_FOUND" as const,
        queryForm: "nënë",
        reasonCode: null,
      },
      exactLexicalSourceFacts: [fixtureFact()],
      sourceIpaSevenVoiceAnalyses: projectAlbanianKaikkiFactsSourceIpaToSevenVoicesV0_1([fixtureFact()]),
      derivedStructure: {
        layer: "DERIVED_STRUCTURE" as const,
        voicePath: ["A", "I"],
        voicePathSource: "albanian_profile" as const,
        math7: { basis: "AI", totalMod7: 3, principlesPath: [] },
        gamma: { status: "profile_derived" as const, orderedUnits: ["n"], reason: "profile" },
        zeroConsonantalStructuralComposition: { status: "NULL" as const, variants: [], reason: "not authorized" },
        structuralHypotheses: [],
      },
      candidates: [],
      interpretation: {
        layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS" as const,
        status: "UNKNOWN_OR_NULL" as const,
        note: "Null",
      },
      unknownOrNull: { layer: "UNKNOWN_OR_NULL" as const, reason: "NO_GENERIC_AUTHORIZED_SOURCE_WITNESS" },
      userDecisionPosture: "user_decides" as const,
      noSingleWinner: true as const,
    };
    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));

    expect(screen.getByTestId("albanian-exact-lexical-source-facts")).toBeInTheDocument();
    expect(screen.getAllByText("nënë").length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText("mother · grandmother")).toBeInTheDocument();
    expect(screen.getAllByText("/nənə/", { exact: false }).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByText(/CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE/)).toBeInTheDocument();
    expect(screen.getByTestId("albanian-source-ipa-seven-voices")).toBeInTheDocument();
    expect(screen.getByText("Ë → Ë", { exact: false })).toBeInTheDocument();
    expect(screen.getByText(/CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY/)).toBeInTheDocument();
    expect(screen.getByTestId("motivation-discovery-card")).toHaveTextContent("albanian_profile");
  });
});
