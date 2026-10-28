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
  createAlbanianKaikkiServerOnlyUnavailableProviderV0_1,
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

function fiveWindowsFixtureFactsV0_1(): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  return [
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
      entryLocator: "jsonl://word/dritare/match/0",
      physicalRecordOrdinal: 2171,
      form: "dritare",
      senses: [{ senseId: "dritare-window", glosses: ["window", "access to the sea"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/dɾiˈtaɾɛ/", tags: ["Gheg"] }],
      etymologyText: "From dritë (“light”) + -are (“-er”), meaning to let light through or similar.",
      etymologyLinks: [{ sourceForm: "dritë", reference: "dritë#Albanian" }],
      etymologyTemplates: [{ name: "der", args: { "1": "sq", "2": "dritë" }, expansion: "dritë" }],
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=f%C3%ABnjesht%C3%ABr:ordinal=0",
      entryLocator: "jsonl://word/f%C3%ABnjesht%C3%ABr/match/0",
      physicalRecordOrdinal: 11257,
      form: "fënjeshtër",
      senses: [{ senseId: "fënjeshtër-window", glosses: ["window"] }],
      ipaObservations: [
        { soundIndex: 0, ipa: "/fəˈɲeʃtəɾ/", tags: ["Tosk"] },
        { soundIndex: 1, ipa: "/fəˈɲeʃtər/", tags: ["Northern", "Tosk", "variant"] },
        { soundIndex: 2, ipa: null, tags: [] },
      ],
      etymologyText: "Borrowed from Vulgar Latin, from Latin fenestra. Doublet of finestër.",
      etymologyLinks: [{ sourceForm: "fenestra", reference: "fenestra#Latin" }],
      etymologyTemplates: [
        { name: "bor+", args: { "1": "sq", "2": "la-vul", "3": "-" }, expansion: "Borrowed from Vulgar Latin" },
        { name: "der", args: { "1": "sq", "2": "la", "3": "fenestra" }, expansion: "Latin fenestra" },
      ],
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=finest%C3%ABr:ordinal=0",
      entryLocator: "jsonl://word/finest%C3%ABr/match/0",
      physicalRecordOrdinal: 11258,
      form: "finestër",
      senses: [{ senseId: "finestër-window", glosses: ["window"] }],
      ipaObservations: [],
      etymologyText: "Borrowed from Italian finestra. Doublet of fënjeshtër.",
      etymologyLinks: [{ sourceForm: "finestra", reference: "finestra#Italian" }],
      etymologyTemplates: [
        { name: "bor+", args: { "1": "sq", "2": "it", "3": "finestra" }, expansion: "Borrowed from Italian finestra" },
      ],
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=penxhere:ordinal=0",
      entryLocator: "jsonl://word/penxhere/match/0",
      physicalRecordOrdinal: 12549,
      form: "penxhere",
      senses: [{ senseId: "penxhere-window", glosses: ["window"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/penˈd͡ʒeɾe/", tags: ["Southern", "Gheg"] }],
      etymologyText: "Borrowed from Ottoman Turkish پنجره (pencere), from Classical Persian پنجره (panjara).",
      etymologyLinks: [{ sourceForm: "پنجره", reference: "پنجره#Ottoman_Turkish" }],
      etymologyTemplates: [
        { name: "bor+", args: { "1": "sq", "2": "ota", "3": "پنجره", tr: "pencere" }, expansion: "Borrowed from Ottoman Turkish پنجره (pencere)" },
        { name: "der", args: { "1": "sq", "2": "fa-cls", "3": "پنجره", tr: "panjara" }, expansion: "Classical Persian پنجره (panjara)" },
      ],
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=derk%C3%AB:ordinal=0",
      entryLocator: "jsonl://word/derk%C3%AB/match/0",
      physicalRecordOrdinal: 22393,
      form: "derkë",
      senses: [{ senseId: "derkë-window", glosses: ["window"] }],
      ipaObservations: [],
      etymologyText: "From derë (“door”) + -kë.",
      etymologyLinks: [{ sourceForm: "derë", reference: "derë#Albanian" }],
      etymologyTemplates: [{ name: "af", args: { "1": "sq", "2": "derë", "3": "-kë", t1: "door" }, expansion: "derë (“door”) + -kë" }],
    }),
  ];
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

async function discoveryForMalorDerivedFunctionalRelationTextV0_1(etymologyText: string) {
  const mal = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
    entryLocator: "jsonl://word/mal/match/0",
    form: "mal",
    partOfSpeech: "noun",
    senses: [{ senseId: "mal-1", glosses: ["mountain"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
    relatedForms: [{ form: "malor", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/malor" }],
  });
  const malor = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
    entryLocator: "jsonl://word/malor/match/0",
    form: "malor",
    partOfSpeech: "adj",
    senses: [{ senseId: "malor-1", glosses: ["mountainous"] }],
    ipaObservations: [],
    etymologyText,
    etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    etymologyTemplates: [{
      name: "suffix",
      args: { "1": "sq", "2": "mal", "3": "-or" },
      expansion: "mal + -or",
    }],
  });
  return discoveryForFactsV0_1([mal, malor], "mal");
}

async function discoveryForDriteDritareRelationTextV0_1(etymologyText: string) {
  const drite = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
    entryLocator: "jsonl://word/drit%C3%AB/match/0",
    form: "dritë",
    senses: [{ senseId: "drite-light", glosses: ["light", "light (such as a lamp)"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/ˈdɾitə/", tags: [] }],
    relatedForms: [{ form: "dritare", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/dritare" }],
  });
  const dritare = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
    entryLocator: "jsonl://word/dritare/match/0",
    form: "dritare",
    senses: [{ senseId: "dritare-window", glosses: ["window", "opening"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/dɾiˈtaɾɛ/", tags: [] }],
    etymologyText,
    etymologyLinks: [{ sourceForm: "dritë", reference: "dritë#Albanian" }],
  });
  return discoveryForFactsV0_1([drite, dritare], "dritë");
}

type SyntheticSourceRecordV0_1 = Readonly<{
  word: string;
  lang_code: "sq";
  pos: string;
  senses: readonly Readonly<{
    id: string;
    glosses: readonly string[];
    categories?: readonly Readonly<{
      name: string;
      kind?: string;
      parents?: readonly string[];
      source?: string;
      orig?: string;
      langcode?: string;
      _dis?: string;
    }>[];
    related?: readonly Readonly<{ word: string }>[];
    derived?: readonly Readonly<{ word: string }>[];
  }>[];
  categories?: readonly Readonly<Record<string, unknown>>[];
  sounds: readonly Readonly<{ ipa: string; tags: readonly string[] }>[];
  related?: readonly Readonly<{ word: string }>[];
  derived?: readonly Readonly<{ word: string }>[];
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
  it("preserves a nested source-derived link and exposes one bounded AGENT operation through the UI adapter", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "peshk",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "peshk-1", glosses: ["fish"], derived: [{ word: "peshkatar" }] }],
        sounds: [{ ipa: "[pɛʃk]", tags: [] }],
      },
      {
        word: "peshkatar",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "peshkatar-1", glosses: ["fisherman"] }],
        sounds: [],
      },
    ], async ({ provider }) => {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "peshk",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor("peshk"),
        heart: buildHeartInstrumentV1("peshk"),
        albanianLexicalSourceProvider: provider,
      });
      const reading = result.discovery.albanianLexicalReading;

      expect(reading).toMatchObject({
        status: "SUPPORTED",
        primarySourceFact: { form: "peshk", partOfSpeech: "noun", meaningGlosses: ["fish"] },
        relatedForms: [{
          form: "peshkatar",
          relation: "SOURCE_DERIVED_FORM",
          resolution: "RESOLVED",
          partOfSpeech: "noun",
          meaningGlosses: ["fisherman"],
        }],
        sourceLinkedComparison: {
          status: "NULL",
          reasonCodes: ["SOURCE_FORM_REFERENCE_NOT_PRESENT"],
        },
        functionalMeaningBridge: {
          status: "SUPPORTED",
          relatedForm: "peshkatar",
          derivedStructure: null,
          functionalHypothesis: {
            status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
            functionalOperation: "AGENT",
            basis: [
              "SOURCE_ATTESTED_PRIMARY_MEANING",
              "SOURCE_ATTESTED_AGENT_MEANING",
              "SOURCE_DERIVED_FORM_LINK",
            ],
          },
        },
        composition: { status: "NULL", relatedForm: "peshkatar" },
        interpretation: {
          status: "EXPLORATORY_ZHEJI_READING",
          statement: expect.stringContaining("Integrated source-bounded functional reading"),
          basis: expect.arrayContaining([
            "SOURCE_ATTESTED_FUNCTIONAL_BRIDGE",
            "STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL",
          ]),
        },
      });
      const statement = reading?.functionalMeaningBridge.functionalHypothesis.statement;
      expect(statement).toContain("preserves AGENT as an exploratory label");
      expect(statement).toContain("does not assign an entity, resource, or other semantic role to the primary word");
      expect(statement).not.toContain("models peshk as the entity or resource");

      const vm = adaptAnalysisToTelemetryVM({
        motivationDiscoveryV0_1: {
          ...result.discovery,
          exactLexicalSourceFacts: undefined,
          sourceIpaSevenVoiceAnalyses: undefined,
        },
      });
      expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
      if (vm.motivationDiscoveryV0_1?.kind === "present") {
        render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
        expect(screen.getByTestId("albanian-reading-related-form")).toHaveTextContent("peshkatar");
        expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("Source-bounded functional operation AGENT");
        expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
        expect(screen.getByTestId("albanian-reading-functional-bridge-derived-structure-null")).toHaveTextContent("Null");
        expect(screen.getByTestId("albanian-reading-interpretation")).toHaveTextContent("Integrated source-bounded functional reading");
        expect(screen.getByTestId("albanian-reading-interpretation")).toHaveTextContent("independent functional meaning for any structural embryo remains Unknown / Null");
      }
    });
  });

  it("keeps AGENT Null when the source-derived related gloss is not an agent or profession", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "peshk",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "peshk-1", glosses: ["fish"], derived: [{ word: "peshkatar" }] }],
        sounds: [{ ipa: "[pɛʃk]", tags: [] }],
      },
      {
        word: "peshkatar",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "peshkatar-1", glosses: ["boat"] }],
        sounds: [],
      },
    ], async ({ provider }) => {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "peshk",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor("peshk"),
        heart: buildHeartInstrumentV1("peshk"),
        albanianLexicalSourceProvider: provider,
      });

      expect(result.discovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
        status: "NULL",
        relatedForm: "peshkatar",
        functionalHypothesis: {
          status: "UNKNOWN_OR_NULL",
          functionalOperation: null,
        },
      });
    });
  });

  it("recognizes a source-derived singer as the existing AGENT operation without changing the taxonomy", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "këngë",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "këngë-1", glosses: ["song"], derived: [{ word: "këngëtar" }] }],
        sounds: [{ ipa: "/ˈkən.ɡə/", tags: ["Tosk"] }],
      },
      {
        word: "këngëtar",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "këngëtar-1", glosses: ["singer"] }],
        sounds: [{ ipa: "/kənɡəˈtaɾ/", tags: [] }],
        etymology_text: "From këngë (“song”) + -tar.",
        etymology_links: [["këngë", "këngë#Albanian"]],
      },
    ], async ({ provider }) => {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "këngë",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor("këngë"),
        heart: buildHeartInstrumentV1("këngë"),
        albanianLexicalSourceProvider: provider,
      });
      const reading = result.discovery.albanianLexicalReading;

      expect(reading).toMatchObject({
        status: "SUPPORTED",
        primarySourceFact: { form: "këngë", meaningGlosses: ["song"] },
        relatedForms: [{
          form: "këngëtar",
          relation: "SOURCE_DERIVED_FORM",
          resolution: "RESOLVED",
          partOfSpeech: "noun",
          meaningGlosses: ["singer"],
        }],
        sourceLinkedComparison: {
          status: "SUPPORTED",
          relation: {
            relatedForm: "këngëtar",
            referencedForm: "këngë",
            reference: "këngë#Albanian",
          },
        },
        functionalMeaningBridge: {
          status: "SUPPORTED",
          relatedForm: "këngëtar",
          functionalHypothesis: {
            status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
            functionalOperation: "AGENT",
            statement: expect.stringContaining("singer"),
          },
        },
        interpretation: {
          status: "EXPLORATORY_ZHEJI_READING",
          statement: expect.stringContaining("Integrated source-bounded functional reading"),
        },
      });

      const vm = adaptAnalysisToTelemetryVM({
        word: "këngë",
        sanitized: "këngë",
        engineVersion: "fixture",
        primaryPath: { voicePath: ["Ë", "Ë"] },
        candidates: [],
        motivationDiscoveryV0_1: {
          ...result.discovery,
          exactLexicalSourceFacts: undefined,
          sourceIpaSevenVoiceAnalyses: undefined,
        },
      });
      expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
      if (vm.motivationDiscoveryV0_1?.kind === "present") {
        render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
        expect(screen.getByTestId("albanian-reading-related-form")).toHaveTextContent("këngëtar");
        expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
        expect(screen.getByTestId("albanian-reading-interpretation")).toHaveTextContent("Integrated source-bounded functional reading");
      }
    });
  });

  it("uses exact final-sense sq:Occupations evidence without flattening category scope", async () => {
    const occupationCategory = {
      name: "Occupations",
      kind: "other",
      parents: [],
      source: "w",
      orig: "sq:Occupations",
      langcode: "sq",
    } as const;
    await withSyntheticSourceFileV0_1([
      {
        word: "bletë",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "bletë-1", glosses: ["bee"], derived: [{ word: "bletar" }] }],
        sounds: [],
      },
      {
        word: "bletar",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "bletar-1", glosses: ["beekeeper"], categories: [occupationCategory] }],
        sounds: [],
        etymology_text: "From bletë (“bee”) + -ar noun suffix.",
        etymology_links: [["bletë", "bletë#Albanian"]],
      },
      {
        word: "përkthej",
        lang_code: "sq",
        pos: "verb",
        senses: [{ id: "përkthej-1", glosses: ["to translate"], derived: [{ word: "përkthyes" }] }],
        sounds: [],
      },
      {
        word: "përkthyes",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "përkthyes-1", glosses: ["translator; interpreter"], categories: [occupationCategory] }],
        sounds: [],
        etymology_text: "From përkthej (“to translate”) + -s.",
        etymology_links: [["përkthej", "përkthej#Albanian"]],
      },
    ], async ({ provider }) => {
      for (const [word, relatedForm] of [["bletë", "bletar"], ["përkthej", "përkthyes"]] as const) {
        const discovery = await buildMotivationEngineDiscoveryServerOnlyV0_1({
          word,
          inputLanguage: "sq",
          inputProfile: "albanian",
          analysis: await analysisFor(word),
          heart: buildHeartInstrumentV1(word),
          albanianLexicalSourceProvider: provider,
        });
        expect(discovery.discovery.albanianLexicalReading).toMatchObject({
          functionalMeaningBridge: {
            status: "SUPPORTED",
            relatedForm,
            functionalHypothesis: {
              functionalOperation: "AGENT",
              basis: expect.arrayContaining(["SOURCE_ATTESTED_FINAL_SENSE_CATEGORY"]),
              statement: expect.stringContaining("sq:Occupations"),
            },
            sourceFacts: {
              related: {
                sourceSenses: [{
                  categories: [expect.objectContaining({
                    name: "Occupations",
                    orig: "sq:Occupations",
                    langcode: "sq",
                    source: "w",
                  })],
                }],
              },
            },
          },
        });
      }
    });
  });

  it("recognizes a source-derived verb-to-agent formation while keeping non-agent derivatives Null", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "gjuaj",
        lang_code: "sq",
        pos: "verb",
        senses: [{ id: "gjuaj-1", glosses: ["to hunt"], derived: [{ word: "gjuetar" }, { word: "gjueti" }] }],
        sounds: [],
      },
      {
        word: "gjuetar",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "gjuetar-1", glosses: ["hunter"] }],
        sounds: [],
        etymology_text: "From gjuaj (“hunt; throw”) + -tar.",
        etymology_links: [["gjuaj", "gjuaj#Albanian"]],
        etymology_templates: [{
          name: "suffix",
          args: { "1": "sq", "2": "gjuaj", "3": "-tar" },
          expansion: "gjuaj (“hunt; throw”) + -tar",
        }],
      },
      {
        word: "gjueti",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "gjueti-1", glosses: ["hunting"] }],
        sounds: [],
        etymology_text: "From gjuaj (“to hunt”).",
        etymology_links: [["gjuaj", "gjuaj#Albanian"]],
      },
    ], async ({ provider }) => {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "gjuaj",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor("gjuaj"),
        heart: buildHeartInstrumentV1("gjuaj"),
        albanianLexicalSourceProvider: provider,
      });
      const reading = result.discovery.albanianLexicalReading;

      expect(reading).toMatchObject({
        status: "SUPPORTED",
        primarySourceFact: { form: "gjuaj", partOfSpeech: "verb", meaningGlosses: ["to hunt"] },
        sourcePronunciation: null,
        sourceLinkedComparison: {
          status: "SUPPORTED",
          relation: { relatedForm: "gjuetar", referencedForm: "gjuaj", reference: "gjuaj#Albanian" },
        },
        functionalMeaningBridge: {
          status: "SUPPORTED",
          relatedForm: "gjuetar",
          functionalHypothesis: {
            functionalOperation: "AGENT",
            statement: expect.stringContaining("hunter"),
          },
        },
      });
      expect(reading?.relatedCandidateEvaluations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          relatedForm: "gjueti",
          sourceLinkedComparison: expect.objectContaining({ status: "SUPPORTED" }),
          functionalMeaningBridge: expect.objectContaining({
            status: "NULL",
            reasonCodes: ["DERIVED_STRUCTURE_NOT_SUPPORTED_FOR_BOTH_RECORDS"],
            functionalHypothesis: expect.objectContaining({ functionalOperation: null, statement: null }),
          }),
        }),
      ]));

      const vm = adaptAnalysisToTelemetryVM({
        word: "gjuaj",
        sanitized: "gjuaj",
        engineVersion: "fixture",
        primaryPath: { voicePath: [] },
        candidates: [],
        motivationDiscoveryV0_1: {
          ...result.discovery,
          exactLexicalSourceFacts: undefined,
          sourceIpaSevenVoiceAnalyses: undefined,
        },
      });
      expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
      if (vm.motivationDiscoveryV0_1?.kind === "present") {
        render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
        expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("gjuetar");
        expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
        expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("does not assign an entity, resource, or other semantic role to the primary word");
        expect(screen.getByTestId("albanian-reading-interpretation")).toHaveTextContent("Integrated source-bounded functional reading");
      }
    });
  });

  it.each([
    ["wrong category provenance", { name: "Occupations", kind: "other", parents: [], source: "w", orig: "en:Occupations", langcode: "en" }],
    ["missing sense identity", { name: "Occupations", kind: "other", parents: [], source: "w", orig: "sq:Occupations", langcode: "sq" }],
  ] as const)("keeps category-backed AGENT Null for %s", async (_label, category) => {
    const primary = fixtureFact({
      form: "bletë",
      senses: [{ senseId: "bletë-1", glosses: ["bee"] }],
      relatedForms: [{ form: "bletar", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/bletar" }],
    });
    const related = fixtureFact({
      form: "bletar",
      partOfSpeech: "noun",
      senses: [{ senseId: _label === "missing sense identity" ? null : "bletar-1", glosses: ["beekeeper"], categories: [category] }],
      etymologyText: "From bletë (“bee”) + -ar noun suffix.",
      etymologyLinks: [{ sourceForm: "bletë", reference: "bletë#Albanian" }],
    });
    const result = await discoveryForFactsV0_1([primary, related], "bletë");
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      relatedForm: "bletar",
      functionalHypothesis: { functionalOperation: null, status: "UNKNOWN_OR_NULL" },
    });
  });

  it("does not promote entry-level-only category metadata to a final-sense AGENT", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "bletë",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "bletë-1", glosses: ["bee"], derived: [{ word: "bletar" }] }],
        sounds: [],
      },
      {
        word: "bletar",
        lang_code: "sq",
        pos: "noun",
        categories: [{ name: "Occupations", orig: "sq:Occupations", langcode: "sq", source: "w" }],
        senses: [{ id: "bletar-1", glosses: ["beekeeper"] }],
        sounds: [],
        etymology_text: "From bletë (“bee”) + -ar noun suffix.",
        etymology_links: [["bletë", "bletë#Albanian"]],
      },
    ], async ({ provider }) => {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "bletë",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor("bletë"),
        heart: buildHeartInstrumentV1("bletë"),
        albanianLexicalSourceProvider: provider,
      });
      expect(result.discovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
        status: "NULL",
        functionalHypothesis: { functionalOperation: null, status: "UNKNOWN_OR_NULL" },
      });
    });
  });

  it("keeps ambiguous final category senses Null", async () => {
    const category = { name: "Occupations", kind: "other", parents: [], source: "w", orig: "sq:Occupations", langcode: "sq" } as const;
    const primary = fixtureFact({
      form: "root",
      senses: [{ senseId: "root-1", glosses: ["root"] }],
      relatedForms: [{ form: "agent-term", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/agent-term" }],
    });
    const related = fixtureFact({
      form: "agent-term",
      partOfSpeech: "noun",
      senses: [
        { senseId: "agent-1", glosses: ["one who does the work"], categories: [category] },
        { senseId: "agent-2", glosses: ["a different occupation sense"], categories: [category] },
      ],
      etymologyText: "From root + agent suffix.",
      etymologyLinks: [{ sourceForm: "root", reference: "root#Albanian" }],
    });
    const result = await discoveryForFactsV0_1([primary, related], "root");
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      relatedForm: "agent-term",
      functionalHypothesis: { functionalOperation: null, status: "UNKNOWN_OR_NULL" },
    });
  });

  it("keeps the source-backed ujë control Null when its derived noun is not an agent gloss", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "ujë",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "ujë-1", glosses: ["water"], derived: [{ word: "ansujë" }] }],
        sounds: [{ ipa: "/ˈujə/", tags: [] }],
      },
      {
        word: "ansujë",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "ansujë-1", glosses: ["island, islet"] }],
        sounds: [],
        etymology_text: "A compound of anë (“side”) + ujë (“water”).",
        etymology_links: [["ujë", "ujë#Albanian"]],
      },
    ], async ({ provider }) => {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "ujë",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor("ujë"),
        heart: buildHeartInstrumentV1("ujë"),
        albanianLexicalSourceProvider: provider,
      });
      const reading = result.discovery.albanianLexicalReading;

      expect(reading).toMatchObject({
        status: "SUPPORTED",
        sourcePronunciation: {
          rawIpa: "/ˈujə/",
          status: "NULL",
          reasonCodes: ["NUCLEUS_STRUCTURE_UNRESOLVED"],
        },
        sourceLinkedComparison: {
          status: "SUPPORTED",
          relation: { relatedForm: "ansujë", referencedForm: "ujë" },
        },
        functionalMeaningBridge: {
          status: "NULL",
          relatedForm: "ansujë",
          functionalHypothesis: {
            status: "UNKNOWN_OR_NULL",
            functionalOperation: null,
          },
        },
        interpretation: { status: "UNKNOWN_OR_NULL" },
      });
    });
  });

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
          functionalOperation: "ENABLE_PASSAGE",
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
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("Directional functional interpretation");
      expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: ENABLE_PASSAGE");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("enabling input");
      const functionalBridgeBasis = screen.getByTestId("albanian-reading-functional-bridge-basis");
      expect(functionalBridgeBasis).toHaveTextContent("SOURCE_AUTHORED_TRANSMISSION_EXPLANATION");
      expect(functionalBridgeBasis).toHaveClass("break-words");
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

  it("preserves source-derived form provenance when indexing raw derived links", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "mal",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "mal-1", glosses: ["mountain"] }],
        sounds: [{ ipa: "/ˈmal/", tags: [] }],
        derived: [{ word: "malor" }],
      },
      {
        word: "malor",
        lang_code: "sq",
        pos: "adj",
        senses: [{ id: "malor-1", glosses: ["mountainous"] }],
        sounds: [],
        etymology_text: "From mal + -or.",
        etymology_links: [["mal", "mal#Albanian"]],
        etymology_templates: [{
          name: "suffix",
          args: { "1": "sq", "2": "mal", "3": "-or" },
          expansion: "mal + -or",
        }],
      },
    ], async ({ provider }) => {
      await expect(provider.query("mal")).resolves.toMatchObject({
        status: "MATCHES_FOUND",
        facts: [{
          form: "mal",
          relatedForms: [{
            form: "malor",
            relation: "SOURCE_DERIVED_FORM",
            entryLocator: "jsonl://word/malor",
          }],
        }],
      });
    });
  });

  it("projects sense-level related links while preserving source order and duplicate behavior", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "abonoj",
        lang_code: "sq",
        pos: "verb",
        senses: [{
          id: "abonoj-1",
          glosses: ["to subscribe"],
          related: [{ word: "abonohem" }, { word: "abonuar" }, { word: "abonohem" }],
          derived: [{ word: "abonuar-derived" }],
        }],
        sounds: [{ ipa: "[abonɔj]", tags: [] }],
        related: [{ word: "record-related" }],
        derived: [{ word: "record-derived" }],
      },
      ...["record-related", "record-derived", "abonohem", "abonuar", "abonuar-derived"].map((word) => ({
        word,
        lang_code: "sq" as const,
        pos: "noun",
        senses: [{ id: `${word}-1`, glosses: [word] }],
        sounds: [],
      })),
    ], async ({ provider }) => {
      await expect(provider.query("abonoj")).resolves.toMatchObject({
        status: "MATCHES_FOUND",
        facts: [{
          form: "abonoj",
          relatedForms: [
            { form: "record-related", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/record-related" },
            { form: "record-derived", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/record-derived" },
            { form: "abonohem", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/abonohem" },
            { form: "abonuar", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/abonuar" },
            { form: "abonohem", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/abonohem" },
            { form: "abonuar-derived", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/abonuar-derived" },
          ],
        }],
      });
    });
  });

  it("finds a supported source-derived functional candidate beyond the related-form lookup window", async () => {
    const derivedCandidates = Array.from({ length: 8 }, (_, index) => ({ word: `mal-candidate-${index}` }));
    await withSyntheticSourceFileV0_1([
      {
        word: "mal",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "mal-1", glosses: ["mountain"] }],
        sounds: [{ ipa: "/ˈmal/", tags: [] }],
        related: [{ word: "majë" }],
        derived: [...derivedCandidates, { word: "malor" }],
      },
      ...derivedCandidates.map((candidate, index) => ({
        word: candidate.word,
        lang_code: "sq" as const,
        pos: "noun",
        senses: [{ id: `candidate-${index}`, glosses: ["candidate"] }],
        sounds: [],
      })),
      {
        word: "malor",
        lang_code: "sq",
        pos: "adj",
        senses: [{ id: "malor-1", glosses: ["mountainous"] }],
        sounds: [],
        etymology_text: "From mal + -or.",
        etymology_links: [["mal", "mal#Albanian"]],
        etymology_templates: [{
          name: "suffix",
          args: { "1": "sq", "2": "mal", "3": "-or" },
          expansion: "mal + -or",
        }],
      },
    ], async ({ provider }) => {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "mal",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor("mal"),
        heart: buildHeartInstrumentV1("mal"),
        albanianLexicalSourceProvider: provider,
      });
      const reading = result.discovery.albanianLexicalReading;
      expect(reading?.relatedForms.find((related) => related.form === "malor")).toMatchObject({
        form: "malor",
        relation: "SOURCE_DERIVED_FORM",
        resolution: "RESOLVED",
      });
      expect(reading).toMatchObject({
        sourceLinkedComparison: {
          status: "SUPPORTED",
          relation: { relation: "SOURCE_DERIVED_FORM", relatedForm: "malor" },
        },
        functionalMeaningBridge: {
          status: "SUPPORTED",
          relatedForm: "malor",
        },
      });
    });
  });

  it("resolves the 39th source-derived lookup while preserving source order and a finite boundary", async () => {
    const derivedForms = Array.from({ length: 40 }, (_, index) => ({
      form: index === 23
        ? "luleshitës"
        : index === 30
          ? "pijeshitës"
          : index === 35
            ? "rakishitës"
            : `shitës-candidate-${index}`,
      relation: "SOURCE_DERIVED_FORM" as const,
      entryLocator: `jsonl://word/derived-${index}`,
    }));
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=shit%C3%ABs:ordinal=0",
      entryLocator: "jsonl://word/shit%C3%ABs/match/0",
      form: "shitës",
      partOfSpeech: "noun",
      senses: [{ senseId: "shitës-1", glosses: ["seller, vendor, salesman, grocer"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈʃitəs/", tags: [] }],
      relatedForms: derivedForms,
    });
    const derivedFacts = derivedForms.slice(0, 39).map(({ form }, index) => {
      const base = {
        sourceRecordId: `kaikki-albanian-jsonl:word=${form}:ordinal=0`,
        entryLocator: `jsonl://word/${form}/match/0`,
        form,
        partOfSpeech: "noun" as const,
        senses: [{ senseId: `${form}-${index}`, glosses: ["candidate"] }],
        ipaObservations: [],
      };
      if (form === "luleshitës") {
        return fixtureFact({
          ...base,
          senses: [{ senseId: "luleshitës-1", glosses: ["flower seller, florist"] }],
          ipaObservations: [{ soundIndex: 0, ipa: "/luleˈʃitəs/", tags: [] }],
          etymologyText: "From lule + shitës.",
          etymologyLinks: [{ sourceForm: "shitës", reference: "shitës#Albanian" }],
        });
      }
      if (form === "pijeshitës") {
        return fixtureFact({
          ...base,
          senses: [{ senseId: "pijeshitës-1", glosses: ["a seller of drinks, alcohol; bartender"] }],
          etymologyText: "From pije + shitës.",
          etymologyLinks: [{ sourceForm: "shitës", reference: "shitës#Albanian" }],
        });
      }
      if (form === "rakishitës") {
        return fixtureFact({
          ...base,
          senses: [{ senseId: "rakishitës-1", glosses: ["seller of brandy or any alcoholic beverage"] }],
          ipaObservations: [{ soundIndex: 0, ipa: "/ɾakiˈʃitəs/", tags: [] }],
          etymologyText: "From raki + shitës.",
          etymologyLinks: [{ sourceForm: "shitës", reference: "shitës#Albanian" }],
        });
      }
      return fixtureFact(base);
    });
    const baseProvider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [primary, ...derivedFacts],
    });
    const queries: string[] = [];
    const provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 = Object.freeze({
      ...baseProvider,
      query: async (query: string) => {
        queries.push(query);
        return baseProvider.query(query);
      },
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "shitës",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("shitës"),
      heart: buildHeartInstrumentV1("shitës"),
      albanianLexicalSourceProvider: provider,
    });
    const reading = result.discovery.albanianLexicalReading;

    expect(queries).toHaveLength(40);
    expect(queries.slice(1)).toEqual(derivedForms.slice(0, 39).map(({ form }) => form));
    expect(queries).not.toContain(derivedForms[39].form);
    expect(reading?.relatedForms).toHaveLength(40);
    expect(reading?.relatedForms.slice(0, 39).every((candidate) => candidate.resolution === "RESOLVED")).toBe(true);
    expect(reading?.relatedForms[39]).toMatchObject({
      form: derivedForms[39].form,
      relation: "SOURCE_DERIVED_FORM",
      resolution: "UNRESOLVED",
    });
    expect(reading?.relatedCandidateEvaluations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        relatedForm: "luleshitës",
        functionalMeaningBridge: expect.objectContaining({
          status: "SUPPORTED",
          functionalHypothesis: expect.objectContaining({ functionalOperation: "AGENT" }),
        }),
      }),
      expect.objectContaining({
        relatedForm: "pijeshitës",
        functionalMeaningBridge: expect.objectContaining({
          status: "SUPPORTED",
          functionalHypothesis: expect.objectContaining({ functionalOperation: "AGENT" }),
        }),
      }),
      expect.objectContaining({
        relatedForm: "rakishitës",
        sourceLinkedComparison: expect.objectContaining({ status: "SUPPORTED" }),
        functionalMeaningBridge: expect.objectContaining({
          status: "SUPPORTED",
          functionalHypothesis: expect.objectContaining({ functionalOperation: "AGENT" }),
        }),
      }),
    ]));
    expect(reading?.functionalMeaningBridge).toMatchObject({
      status: "SUPPORTED",
      relatedForm: "luleshitës",
      functionalHypothesis: { functionalOperation: "AGENT" },
    });
    const agentStatements = reading?.relatedCandidateEvaluations
      ?.filter((candidate) => ["luleshitës", "pijeshitës", "rakishitës"].includes(candidate.relatedForm))
      .map((candidate) => candidate.functionalMeaningBridge.functionalHypothesis.statement) ?? [];
    expect(agentStatements).toHaveLength(3);
    for (const statement of agentStatements) {
      expect(statement).toContain("preserves AGENT as an exploratory label");
      expect(statement).toContain("does not assign an entity, resource, or other semantic role to the primary word");
      expect(statement).not.toContain("models shitës as the entity or resource");
    }
  });

  it("supports the source-bounded mal to malor entity-property reading through the VM and UI", async () => {
    const mal = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      partOfSpeech: "noun",
      senses: [{ senseId: "mal-1", glosses: ["mountain"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
      relatedForms: [{ form: "malor", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/malor" }],
    });
    const malor = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      partOfSpeech: "adj",
      senses: [{ senseId: "malor-1", glosses: ["mountainous"] }],
      ipaObservations: [],
      etymologyText: "From mal + -or.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
      etymologyTemplates: [{
        name: "suffix",
        args: { "1": "sq", "2": "mal", "3": "-or" },
        expansion: "mal + -or",
      }],
    });
    const discovery = await discoveryForFactsV0_1([mal, malor], "mal");
    expect(discovery.albanianLexicalReading).toMatchObject({
      status: "SUPPORTED",
      relatedForms: [{ form: "malor", relation: "SOURCE_DERIVED_FORM", resolution: "RESOLVED" }],
      sourceLinkedComparison: {
        status: "SUPPORTED",
        relation: { relation: "SOURCE_DERIVED_FORM", relatedForm: "malor" },
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        truthLayers: ["SOURCE_FACT", "EXPLORATORY_FUNCTIONAL_HYPOTHESIS"],
        derivedStructure: null,
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          statement: expect.stringContaining("entity → attributed property"),
        },
      },
      composition: { status: "NULL" },
    });

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("entity → attributed property");
      expect(screen.getByTestId("albanian-reading-functional-bridge-derived-structure-null")).toHaveTextContent("Null");
      expect(screen.getByTestId("albanian-reading-functional-bridge-derived-structure-null")).toHaveTextContent("no Voice or phonological semantic relation is claimed");
      expect(screen.getByTestId("albanian-reading-composition-null")).toHaveTextContent("Null");
      expect(screen.queryByTestId("albanian-reading-null-candidate-summary")).not.toBeInTheDocument();
    }
  });

  it("keeps the illumination fallback when no supported functional bridge exists", async () => {
    const result = await discoveryForDriteDritareRelationTextV0_1(
      "A source-authored note describes the related form without a transmission explanation.",
    );
    const reading = result.albanianLexicalReading;

    expect(reading).toMatchObject({
      status: "SUPPORTED",
      sourcePronunciation: {
        status: "SUPPORTED",
        voicePath: ["I", "Ë"],
      },
      functionalMeaningBridge: {
        status: "NULL",
        functionalHypothesis: {
          status: "UNKNOWN_OR_NULL",
          functionalOperation: null,
          statement: null,
        },
      },
      interpretation: {
        status: "EXPLORATORY_ZHEJI_READING",
        statement: expect.stringContaining("illumination → clarity reading"),
      },
    });
    expect(reading?.interpretation.statement).not.toContain("Integrated source-bounded functional reading");
  });

  it.each([
    ["negated", "Not from mal + -or.."],
    ["qualified", "Possibly from mal + -or."],
    ["contradictory", "From another root, not mal + -or."],
  ])("fails closed for %s source-authored suffix explanation", async (_label, etymologyText) => {
    const discovery = await discoveryForMalorDerivedFunctionalRelationTextV0_1(etymologyText);

    expect(discovery.albanianLexicalReading).toMatchObject({
      status: "SUPPORTED",
      sourceLinkedComparison: {
        status: "SUPPORTED",
        relation: { relation: "SOURCE_DERIVED_FORM", relatedForm: "malor" },
      },
      functionalMeaningBridge: {
        status: "NULL",
        relatedForm: "malor",
        reasonCodes: ["DERIVED_STRUCTURE_NOT_SUPPORTED_FOR_BOTH_RECORDS"],
        functionalHypothesis: { status: "UNKNOWN_OR_NULL", statement: null },
      },
      composition: { status: "NULL" },
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

  it("selects the first later candidate with supported comparison while preserving an unsupported operation as Null", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      relatedForms: [
        { form: "missing", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/missing" },
        { form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" },
      ],
    });
    const malor = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      senses: [{ senseId: "malor-1", glosses: ["mountainous"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/maˈloɾ/", tags: [] }],
      etymologyText: "From mal, meaning related to a mountain.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const result = await discoveryForFactsV0_1([primary, malor], "mal");

    expect(result.albanianLexicalReading?.relatedForms).toMatchObject([
      { form: "missing", resolution: "UNRESOLVED" },
      { form: "malor", resolution: "RESOLVED" },
    ]);
    expect(result.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "SUPPORTED",
      relation: { relatedForm: "malor" },
    });
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      relatedForm: "malor",
      reasonCodes: ["FUNCTIONAL_OPERATION_NOT_SUPPORTED"],
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", statement: null },
    });
  });

  it("exposes every source-resolved AGENT relationship while preserving the selected primary bridge", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "shitës",
        lang_code: "sq",
        pos: "noun",
        senses: [{
          id: "shites-1",
          glosses: ["seller, vendor, salesman, grocer"],
          derived: [{ word: "luleshitës" }, { word: "pijeshitës" }, { word: "rakishitës" }, { word: "missing-shitës" }],
        }],
        sounds: [{ ipa: "/ˈʃitəs/", tags: [] }],
      },
      {
        word: "shitës",
        lang_code: "sq",
        pos: "adj",
        senses: [{ id: "shites-adjective-1", glosses: ["selling, that sells"] }],
        sounds: [{ ipa: "/ˈʃitəs/", tags: [] }],
      },
      {
        word: "luleshitës",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "luleshites-1", glosses: ["flower seller, florist"] }],
        sounds: [{ ipa: "/luleˈʃitəs/", tags: [] }],
      },
      {
        word: "pijeshitës",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "pijeshites-1", glosses: ["a seller of drinks, alcohol; bartender"] }],
        sounds: [],
      },
      {
        word: "rakishitës",
        lang_code: "sq",
        pos: "noun",
        senses: [{ id: "rakishites-1", glosses: ["seller of brandy or any alcoholic beverage"] }],
        sounds: [{ ipa: "/ɾakiˈʃitəs/", tags: [] }],
      },
    ], async ({ provider }) => {
      const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
        word: "shitës",
        inputLanguage: "sq",
        inputProfile: "albanian",
        analysis: await analysisFor("shitës"),
        heart: buildHeartInstrumentV1("shitës"),
        albanianLexicalSourceProvider: provider,
      });
      const reading = result.discovery.albanianLexicalReading;

      expect(reading?.primarySourceFact).toMatchObject({
        form: "shitës",
        partOfSpeech: "noun",
        sourceRecordId: "kaikki-albanian-jsonl:word=shit%C3%ABs:ordinal=0",
      });
      expect(result.discovery.exactLexicalSourceFacts).toHaveLength(2);
      expect(reading?.functionalMeaningBridge).toMatchObject({
        status: "SUPPORTED",
        relatedForm: "luleshitës",
        functionalHypothesis: { functionalOperation: "AGENT" },
      });
      expect(reading?.relatedCandidateEvaluations).toEqual(expect.arrayContaining([
        expect.objectContaining({
          relatedForm: "luleshitës",
          sourceRelation: "SOURCE_DERIVED_FORM",
          resolution: "RESOLVED",
          sourceLinkedComparison: expect.objectContaining({ status: "NULL" }),
          functionalMeaningBridge: expect.objectContaining({
            status: "SUPPORTED",
            relatedForm: "luleshitës",
            functionalHypothesis: expect.objectContaining({ functionalOperation: "AGENT" }),
          }),
        }),
        expect.objectContaining({
          relatedForm: "pijeshitës",
          functionalMeaningBridge: expect.objectContaining({
            status: "SUPPORTED",
            relatedForm: "pijeshitës",
            functionalHypothesis: expect.objectContaining({ functionalOperation: "AGENT" }),
          }),
        }),
        expect.objectContaining({
          relatedForm: "rakishitës",
          functionalMeaningBridge: expect.objectContaining({
            status: "SUPPORTED",
            relatedForm: "rakishitës",
            functionalHypothesis: expect.objectContaining({ functionalOperation: "AGENT" }),
          }),
        }),
        expect.objectContaining({
          relatedForm: "missing-shitës",
          resolution: "UNRESOLVED",
          functionalMeaningBridge: expect.objectContaining({
            status: "NULL",
            functionalHypothesis: expect.objectContaining({ functionalOperation: null }),
          }),
        }),
      ]));

      const vm = adaptAnalysisToTelemetryVM({
        motivationDiscoveryV0_1: {
          ...result.discovery,
          exactLexicalSourceFacts: undefined,
          sourceIpaSevenVoiceAnalyses: undefined,
        },
      });
      expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
      if (vm.motivationDiscoveryV0_1?.kind === "present") {
        render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
        expect(screen.getByTestId("albanian-reading-related-candidate-evaluations")).toHaveTextContent("3 bounded functional relationships shown");
        expect(screen.getByTestId("albanian-reading-related-candidate-evaluations")).toHaveTextContent("1 other evaluated link remain Null");
        expect(screen.getAllByTestId("albanian-reading-related-candidate")).toHaveLength(3);
        expect(screen.getByTestId("albanian-reading-null-candidate-summary")).toHaveTextContent("Inspect 1 Null candidate");
        expect(screen.getByTestId("albanian-reading-null-candidate")).toHaveTextContent("missing-shitës");
        expect(screen.getByTestId("albanian-reading-null-candidate")).toHaveTextContent("SOURCE_DERIVED_FORM · resolution UNRESOLVED · comparison NULL");
        expect(screen.getByTestId("albanian-reading-null-candidate")).toHaveTextContent("Comparison reasons: SOURCE_LINK_UNRESOLVED");
        expect(screen.getByTestId("albanian-reading-null-candidate")).toHaveTextContent("Functional operation: Null — no bounded functional operation is authorized.");
        expect(screen.getByTestId("albanian-reading-null-candidate")).toHaveTextContent("Functional reasons: SOURCE_LINKED_RELATION_NOT_SUPPORTED");
        expect(screen.getByTestId("albanian-reading-interpretation")).toHaveTextContent("Integrated source-bounded functional reading");
        expect(screen.getByTestId("albanian-reading-interpretation")).toHaveTextContent("Source-bounded functional operation AGENT");
        expect(screen.getByTestId("albanian-reading-related-candidate-evaluations")).toHaveTextContent("luleshitës");
        expect(screen.getByTestId("albanian-reading-related-candidate-evaluations")).toHaveTextContent("pijeshitës");
        expect(screen.getByTestId("albanian-reading-related-candidate-evaluations")).toHaveTextContent("rakishitës");
      }
    });
  });

  it("keeps the first source-linked comparison when no directional functional operation is supported", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      relatedForms: [
        { form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" },
        { form: "malet", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malet" },
      ],
    });
    const comparisonOnly = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      senses: [],
      ipaObservations: [{ soundIndex: 0, ipa: "/maˈloɾ/", tags: [] }],
      etymologyText: "From mal, meaning related to a mountain.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const bridgeSupported = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malet:ordinal=0",
      entryLocator: "jsonl://word/malet/match/0",
      form: "malet",
      senses: [{ senseId: "malet-1", glosses: ["mountains"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmalɛt/", tags: [] }],
      etymologyText: "From mal, referring to mountains.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const result = await discoveryForFactsV0_1([primary, comparisonOnly, bridgeSupported], "mal");

    expect(result.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "SUPPORTED",
      relation: { relatedForm: "malor" },
    });
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      relatedForm: "malor",
      reasonCodes: ["RELATED_MEANING_EVIDENCE_MISSING"],
    });
  });

  it("preserves source order when multiple candidates are fully supported", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      relatedForms: [
        { form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" },
        { form: "malet", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malet" },
      ],
    });
    const first = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
      etymologyText: "From mal, meaning related to a mountain.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const second = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malet:ordinal=0",
      entryLocator: "jsonl://word/malet/match/0",
      form: "malet",
      etymologyText: "From mal, referring to mountains.",
      etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }],
    });
    const result = await discoveryForFactsV0_1([primary, first, second], "mal");

    expect(result.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "SUPPORTED",
      relation: { relatedForm: "malor" },
    });
    expect(result.albanianLexicalReading?.functionalMeaningBridge.relatedForm).toBe("malor");
  });

  it("keeps the first deterministic Null when no candidate comparison is supported", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      relatedForms: [
        { form: "malor", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malor" },
        { form: "malet", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/malet" },
      ],
    });
    const first = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      entryLocator: "jsonl://word/malor/match/0",
      form: "malor",
    });
    const second = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=malet:ordinal=0",
      entryLocator: "jsonl://word/malet/match/0",
      form: "malet",
    });
    const result = await discoveryForFactsV0_1([primary, first, second], "mal");

    expect(result.albanianLexicalReading?.sourceLinkedComparison).toMatchObject({
      status: "NULL",
      reasonCodes: ["SOURCE_FORM_REFERENCE_NOT_PRESENT"],
      relation: { relatedForm: "malor" },
    });
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      relatedForm: "malor",
    });
  });

  it("keeps all listed related forms visible while limiting related lookups to eight", async () => {
    const relatedForms = Array.from({ length: 10 }, (_, index) => ({
      form: `mal-${index}`,
      relation: "SOURCE_RELATED_FORM" as const,
      entryLocator: `jsonl://word/mal-${index}`,
    }));
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      entryLocator: "jsonl://word/mal/match/0",
      form: "mal",
      relatedForms,
    });
    const relatedFacts = relatedForms.map((relation, index) => fixtureFact({
      sourceRecordId: `kaikki-albanian-jsonl:word=${relation.form}:ordinal=0`,
      entryLocator: `${relation.entryLocator}/match/0`,
      form: relation.form,
      senses: [{ senseId: `${relation.form}-1`, glosses: [`related ${index}`] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈmal/", tags: [] }],
    }));
    const baseProvider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [primary, ...relatedFacts],
    });
    const queries: unknown[] = [];
    const provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 = Object.freeze({
      ...baseProvider,
      query: async (query: unknown) => {
        queries.push(query);
        return baseProvider.query(query);
      },
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "mal",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("mal"),
      heart: buildHeartInstrumentV1("mal"),
      albanianLexicalSourceProvider: provider,
    });

    expect(queries).toHaveLength(9);
    expect(queries.slice(1)).toEqual(relatedForms.slice(0, 8).map(({ form }) => form));
    expect(result.discovery.albanianLexicalReading?.relatedForms).toHaveLength(10);
    expect(result.discovery.albanianLexicalReading?.relatedForms.slice(0, 8).every((item) => item.resolution === "RESOLVED")).toBe(true);
    expect(result.discovery.albanianLexicalReading?.relatedForms.slice(8).every((item) => item.resolution === "UNRESOLVED")).toBe(true);
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
        { senseId: "nene-1", glosses: ["mother", "grandmother"], categories: [] },
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
    expect(screen.getByText("SOURCE RECORD SELECTION UNKNOWN")).toBeInTheDocument();
    expect(screen.queryByText(/ALTERNATIVE SOURCE RECORD/)).not.toBeInTheDocument();
    expect(screen.queryByTestId("albanian-source-record-links")).not.toBeInTheDocument();
  });

  it("exposes source links for an alternative exact record without evaluating it as the primary reading", async () => {
    const shqipRelatedForms = [
      "shqipe",
      "shqipe",
      "shqipëllim",
      "shqipëlloj",
      "shqipëlluar",
      "Shqipëri",
      "shqipërim",
      "shqipëroj",
      "shqipëruar",
      "shqipoj",
      "shqiponjë",
      "shqiptar",
      "shqiptare",
      "Skipetár",
      "shqiptim",
      "shqiptohem",
      "shqiptoj",
      "shqiptuar",
      "shqipuar",
    ] as const;
    const adjective = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=shqip:ordinal=0",
      entryLocator: "jsonl://word/shqip/match/0",
      physicalRecordOrdinal: 866,
      form: "shqip",
      partOfSpeech: "adj",
      senses: [{ senseId: "shqip-adjective", glosses: ["Albanian"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ʃcip/", tags: ["Tosk"] }],
    });
    const adverb = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=shqip:ordinal=1",
      entryLocator: "jsonl://word/shqip/match/1",
      physicalRecordOrdinal: 867,
      form: "shqip",
      partOfSpeech: "adv",
      senses: [{ senseId: "shqip-adverb", glosses: ["in the Albanian language", "clear, understandable, comprehensive, unequivocally"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ʃcip/", tags: ["Tosk"] }],
      relatedForms: shqipRelatedForms.map((form) => ({
        form,
        relation: "SOURCE_RELATED_FORM" as const,
        entryLocator: `jsonl://word/${encodeURIComponent(form)}`,
      })),
    });
    const discovery = await discoveryForFactsV0_1([adjective, adverb], "shqip");
    expect(discovery.albanianLexicalReading?.primarySourceFact).toMatchObject({
      sourceRecordId: adjective.sourceRecordId,
      partOfSpeech: "adj",
    });
    expect(discovery.albanianLexicalReading?.relatedForms).toEqual([]);
    expect(discovery.albanianLexicalReading?.functionalMeaningBridge.status).toBe("NULL");

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));

    const exactFacts = screen.getByTestId("albanian-exact-lexical-source-facts");
    expect(exactFacts).toHaveTextContent("SELECTED PRIMARY SOURCE RECORD");
    expect(exactFacts).toHaveTextContent("ALTERNATIVE SOURCE RECORD — NOT EVALUATED AS THE SELECTED PRIMARY READING");
    expect(exactFacts).toHaveTextContent(adjective.sourceRecordId);
    expect(exactFacts).toHaveTextContent(adverb.sourceRecordId);
    expect(exactFacts).toHaveTextContent("Source-provided form links (19)");
    expect(screen.getAllByTestId("albanian-source-record-links")).toHaveLength(1);
    expect(screen.getByTestId("albanian-source-record-links")).not.toHaveAttribute("open");

    const disclosure = screen.getByTestId("albanian-source-record-links");
    expect(disclosure).toHaveTextContent("shqipe");
    expect(disclosure).toHaveTextContent("SOURCE_RELATED_FORM");
    expect(disclosure).toHaveTextContent("jsonl://word/shqipe");
    expect(screen.getAllByTestId("albanian-source-record-link").map((node) => node.textContent?.split(" · ")[0])).toEqual([...shqipRelatedForms]);
    expect(exactFacts).toHaveTextContent("Alternative-record links are not evaluated in the selected primary functional reading.");
  });

  it("keeps a proper-name exact record separate from the selected common-noun reading", async () => {
    const noun = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
      entryLocator: "jsonl://word/drit%C3%AB/match/0",
      physicalRecordOrdinal: 3461,
      form: "dritë",
      partOfSpeech: "noun",
      senses: [{ senseId: "drite-noun", glosses: ["light"] }],
      relatedForms: [{ form: "dritare", relation: "SOURCE_RELATED_FORM", entryLocator: "jsonl://word/dritare" }],
    });
    const name = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=1",
      entryLocator: "jsonl://word/drit%C3%AB/match/1",
      physicalRecordOrdinal: 9053,
      form: "Dritë",
      partOfSpeech: "name",
      senses: [{ senseId: "drite-name", glosses: ["indefinite form of Drita"] }],
      ipaObservations: [],
    });
    const discovery = await discoveryForFactsV0_1([noun, name], "dritë");

    expect(discovery.exactLexicalSourceFacts).toHaveLength(2);
    expect(discovery.albanianLexicalReading?.primarySourceFact).toMatchObject({
      sourceRecordId: noun.sourceRecordId,
      partOfSpeech: "noun",
    });
    expect(discovery.albanianLexicalReading?.relatedForms).toMatchObject([{
      form: "dritare",
      relation: "SOURCE_RELATED_FORM",
    }]);
    expect(discovery.albanianLexicalReading?.primarySourceFact?.sourceRecordId).not.toBe(name.sourceRecordId);
  });

  it("renders a source-authored two-component Albanian reading without promoting IPA or composition", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%ABshkrim:ordinal=0",
      entryLocator: "jsonl://word/drit%C3%ABshkrim/match/0",
      physicalRecordOrdinal: 11429,
      form: "dritëshkrim",
      senses: [{ senseId: "driteshkrim-photo", glosses: ["photograph"] }],
      ipaObservations: [],
      etymologyText: "From dritë (“light”) + shkrim. Coined by Albanian linguist Faik Konica.",
      etymologyLinks: [
        { sourceForm: "dritë", reference: "dritë#Albanian" },
        { sourceForm: "shkrim", reference: "shkrim#Albanian" },
      ],
      etymologyTemplates: [{
        name: "compound",
        args: { "1": "sq", "2": "dritë", "3": "shkrim", t1: "light" },
        expansion: "dritë (“light”) + shkrim",
      }],
    });
    const light = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
      entryLocator: "jsonl://word/drit%C3%AB/match/0",
      physicalRecordOrdinal: 3461,
      form: "dritë",
      senses: [{ senseId: "drite-light", glosses: ["light"] }],
      ipaObservations: [],
    });
    const writing = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=shkrim:ordinal=0",
      entryLocator: "jsonl://word/shkrim/match/0",
      physicalRecordOrdinal: 5056,
      form: "shkrim",
      senses: [{ senseId: "shkrim-writing", glosses: ["writing"] }],
      ipaObservations: [],
    });
    const discovery = await discoveryForFactsV0_1([primary, light, writing], "dritëshkrim");
    const reading = discovery.albanianLexicalReading;

    expect(reading).toMatchObject({
      status: "SUPPORTED",
      sourcePronunciation: null,
      sourceLinkedComponentReading: {
        status: "SUPPORTED",
        relation: {
          relation: "SOURCE_EXPLICIT_TWO_COMPONENT_COMPOUND",
          references: [
            { sourceForm: "dritë", reference: "dritë#Albanian" },
            { sourceForm: "shkrim", reference: "shkrim#Albanian" },
          ],
        },
        primary: { form: "dritëshkrim", meaningGlosses: ["photograph"], pronunciationVariants: [] },
        components: [
          { form: "dritë", meaningGlosses: ["light"], pronunciationVariants: [] },
          { form: "shkrim", meaningGlosses: ["writing"], pronunciationVariants: [] },
        ],
        exploratoryRelationship: { status: "EXPLORATORY_SOURCE_COMPONENT_RELATION" },
      },
      composition: { status: "NULL" },
      functionalMeaningBridge: { status: "NULL" },
    });

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      const card = screen.getByTestId("albanian-source-linked-component-reading");
      expect(card).toHaveTextContent("photograph");
      expect(card).toHaveTextContent("dritë");
      expect(card).toHaveTextContent("light");
      expect(card).toHaveTextContent("shkrim");
      expect(card).toHaveTextContent("writing");
      expect(card).toHaveTextContent("dritë#Albanian");
      expect(card).toHaveTextContent("shkrim#Albanian");
      expect(card).toHaveTextContent("IPA variants: Null");
      expect(card).toHaveTextContent("engine does not independently prove");
      expect(screen.getByTestId("albanian-reading-composition-null")).toHaveTextContent("Null");
    }
  });

  it("keeps supported component pronunciation evidence while using a neutral comparison boundary", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%ABshkrim:ordinal=0",
      entryLocator: "jsonl://word/drit%C3%ABshkrim/match/0",
      form: "dritëshkrim",
      senses: [{ senseId: "driteshkrim-photo", glosses: ["photograph"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/dɾitəʃkɾim/", tags: [] }],
      etymologyText: "From dritë (“light”) + shkrim.",
      etymologyLinks: [
        { sourceForm: "dritë", reference: "dritë#Albanian" },
        { sourceForm: "shkrim", reference: "shkrim#Albanian" },
      ],
      etymologyTemplates: [{
        name: "compound",
        args: { "1": "sq", "2": "dritë", "3": "shkrim" },
        expansion: "dritë + shkrim",
      }],
    });
    const light = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
      entryLocator: "jsonl://word/drit%C3%AB/match/0",
      form: "dritë",
      senses: [{ senseId: "drite-light", glosses: ["light"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈdɾitə/", tags: [] }],
    });
    const writing = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=shkrim:ordinal=0",
      entryLocator: "jsonl://word/shkrim/match/0",
      form: "shkrim",
      senses: [{ senseId: "shkrim-writing", glosses: ["writing"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/ʃkɾim/", tags: [] }],
    });
    const reading = (await discoveryForFactsV0_1([primary, light, writing], "dritëshkrim")).albanianLexicalReading;

    expect(reading).toMatchObject({
      status: "SUPPORTED",
      sourceLinkedComponentReading: {
        status: "SUPPORTED",
        components: [
          { form: "dritë", pronunciationVariants: [{ status: "SUPPORTED" }] },
          { form: "shkrim", pronunciationVariants: [{ status: "SUPPORTED" }] },
        ],
        exploratoryRelationship: {
          alternatives: expect.arrayContaining(["Component phonetic and Voice comparison is not performed in this reading."]),
        },
      },
      composition: { status: "NULL" },
    });
    const alternatives = reading?.sourceLinkedComponentReading?.exploratoryRelationship.alternatives ?? [];
    expect(alternatives.join(" ")).not.toContain("absent IPA");
  });

  it.each([
    ["historical transmission", "From dritë (“light”), through an unattested intermediate form."],
    ["historical route", "From dritë via Proto-Albanian, through later forms."],
    ["explicit negation", "dritare does not let light through."],
    ["negative transmission", "dritare never allows light to enter."],
    ["unrelated keyword groups", "The source mentions light and an opening through historical transmission."],
    ["missing operation evidence", "From dritë (“light”) + -are (“-er”)."],
  ])("keeps %s source prose Null instead of inferring functional transmission", async (_label, etymologyText) => {
    const reading = (await discoveryForDriteDritareRelationTextV0_1(etymologyText)).albanianLexicalReading;

    expect(reading).toMatchObject({
      status: "SUPPORTED",
      sourceLinkedComparison: { status: "SUPPORTED", relation: { relatedForm: "dritare" } },
      functionalMeaningBridge: {
        status: "NULL",
        relatedForm: "dritare",
        reasonCodes: ["FUNCTIONAL_OPERATION_NOT_SUPPORTED"],
        functionalHypothesis: { status: "UNKNOWN_OR_NULL", statement: null },
      },
    });
  });

  it("fails closed for source-authored compounds with three or more components", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=triword:ordinal=0",
      entryLocator: "jsonl://word/triword/match/0",
      form: "triword",
      senses: [{ senseId: "triword-term", glosses: ["three-part term"] }],
      ipaObservations: [],
      etymologyText: "From alpha + beta + gamma.",
      etymologyLinks: [
        { sourceForm: "alpha", reference: "alpha#Albanian" },
        { sourceForm: "beta", reference: "beta#Albanian" },
        { sourceForm: "gamma", reference: "gamma#Albanian" },
      ],
      etymologyTemplates: [{
        name: "compound",
        args: { "1": "sq", "2": "alpha", "3": "beta", "4": "gamma" },
        expansion: "alpha + beta + gamma",
      }],
    });
    const component = (form: string, gloss: string) => fixtureFact({
      sourceRecordId: `kaikki-albanian-jsonl:word=${form}:ordinal=0`,
      entryLocator: `jsonl://word/${form}/match/0`,
      form,
      senses: [{ senseId: form, glosses: [gloss] }],
      ipaObservations: [],
    });

    const discovery = await discoveryForFactsV0_1([
      primary,
      component("alpha", "first"),
      component("beta", "second"),
      component("gamma", "third"),
    ], "triword");
    const reading = discovery.albanianLexicalReading?.sourceLinkedComponentReading;

    expect(reading).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining(["SOURCE_COMPOUND_ARITY_UNSUPPORTED"]),
      relation: {
        relation: "SOURCE_COMPOUND_ARITY_UNSUPPORTED",
        references: [
          { sourceForm: "alpha", reference: "alpha#Albanian" },
          { sourceForm: "beta", reference: "beta#Albanian" },
          { sourceForm: "gamma", reference: "gamma#Albanian" },
        ],
      },
      components: [
        { form: "alpha" },
        { form: "beta" },
        { form: "gamma" },
      ],
    });
    expect(reading?.relation.relation).not.toBe("SOURCE_EXPLICIT_TWO_COMPONENT_COMPOUND");
    expect(discovery.albanianLexicalReading?.composition.status).toBe("NULL");

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      expect(vm.motivationDiscoveryV0_1.value.albanianLexicalReading?.sourceLinkedComponentReading).toMatchObject({
        status: "NULL",
        reasonCodes: expect.arrayContaining(["SOURCE_COMPOUND_ARITY_UNSUPPORTED"]),
        relation: { relation: "SOURCE_COMPOUND_ARITY_UNSUPPORTED" },
      });
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      const card = screen.getByTestId("albanian-source-linked-component-reading");
      expect(card).toHaveTextContent("Null — SOURCE_COMPOUND_ARITY_UNSUPPORTED.");
      expect(card).toHaveTextContent("alpha → alpha#Albanian");
      expect(card).toHaveTextContent("beta → beta#Albanian");
      expect(card).toHaveTextContent("gamma → gamma#Albanian");
      expect(screen.getByTestId("albanian-reading-composition-null")).toHaveTextContent("Null");
    }

    const cloneDiscovery = () => JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const malformedSupported = cloneDiscovery();
    const malformedSupportedReading = (malformedSupported.albanianLexicalReading as Record<string, unknown>)
      .sourceLinkedComponentReading as Record<string, unknown>;
    malformedSupportedReading.status = "SUPPORTED";
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformedSupported }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const malformedRelation = cloneDiscovery();
    const malformedRelationReading = (malformedRelation.albanianLexicalReading as Record<string, unknown>)
      .sourceLinkedComponentReading as Record<string, unknown>;
    (malformedRelationReading.relation as Record<string, unknown>).relation = "SOURCE_EXPLICIT_TWO_COMPONENT_COMPOUND";
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformedRelation }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it.each([
    {
      label: "missing component record",
      facts: (primary: AlbanianKaikkiExactLexicalSourceFactV0_1) => [primary],
      reasonCode: "SOURCE_COMPONENT_RECORD_NOT_FOUND",
    },
    {
      label: "foreign-language component reference",
      facts: (primary: AlbanianKaikkiExactLexicalSourceFactV0_1) => [
        primary,
        fixtureFact({ form: "dritë", senses: [{ senseId: "light", glosses: ["light"] }], ipaObservations: [] }),
        fixtureFact({ form: "shkrim", senses: [{ senseId: "writing", glosses: ["writing"] }], ipaObservations: [] }),
      ],
      reasonCode: "SOURCE_COMPONENT_REFERENCE_IDENTITY_INVALID",
    },
    {
      label: "component with missing meaning",
      facts: (primary: AlbanianKaikkiExactLexicalSourceFactV0_1) => [
        primary,
        fixtureFact({ form: "dritë", senses: [], ipaObservations: [] }),
        fixtureFact({ form: "shkrim", senses: [{ senseId: "writing", glosses: ["writing"] }], ipaObservations: [] }),
      ],
      reasonCode: "SOURCE_COMPONENT_MEANING_EVIDENCE_MISSING",
    },
  ])("fails closed for a $label", async ({ facts, reasonCode, label }) => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%ABshkrim:ordinal=0",
      entryLocator: "jsonl://word/drit%C3%ABshkrim/match/0",
      physicalRecordOrdinal: 11429,
      form: "dritëshkrim",
      senses: [{ senseId: "driteshkrim-photo", glosses: ["photograph"] }],
      ipaObservations: [],
      etymologyText: "From dritë + shkrim.",
      etymologyLinks: [
        { sourceForm: "dritë", reference: label === "foreign-language component reference" ? "dritë#French" : "dritë#Albanian" },
        { sourceForm: "shkrim", reference: "shkrim#Albanian" },
      ],
      etymologyTemplates: [{
        name: "compound",
        args: { "1": "sq", "2": "dritë", "3": "shkrim" },
        expansion: "dritë + shkrim",
      }],
    });
    const discovery = await discoveryForFactsV0_1(facts(primary), "dritëshkrim");
    expect(discovery.albanianLexicalReading?.sourceLinkedComponentReading).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining([reasonCode]),
    });
    expect(discovery.albanianLexicalReading?.composition.status).toBe("NULL");
  });

  it("does not treat two spelling-like links without a compound template as a component reading", async () => {
    const primary = fixtureFact({
      form: "dritëshkrim",
      senses: [{ senseId: "photo", glosses: ["photograph"] }],
      ipaObservations: [],
      etymologyLinks: [
        { sourceForm: "dritë", reference: "dritë#Albanian" },
        { sourceForm: "shkrim", reference: "shkrim#Albanian" },
      ],
    });
    const discovery = await discoveryForFactsV0_1([
      primary,
      fixtureFact({ form: "dritë", senses: [{ senseId: "light", glosses: ["light"] }], ipaObservations: [] }),
      fixtureFact({ form: "shkrim", senses: [{ senseId: "writing", glosses: ["writing"] }], ipaObservations: [] }),
    ], "dritëshkrim");
    expect(discovery.albanianLexicalReading?.sourceLinkedComponentReading).toBeNull();
  });

  it("fails closed when a component source form resolves to multiple Albanian records", async () => {
    const primary = fixtureFact({
      form: "dritëshkrim",
      senses: [{ senseId: "photo", glosses: ["photograph"] }],
      ipaObservations: [],
      etymologyLinks: [
        { sourceForm: "dritë", reference: "dritë#Albanian" },
        { sourceForm: "shkrim", reference: "shkrim#Albanian" },
      ],
      etymologyTemplates: [{
        name: "compound",
        args: { "1": "sq", "2": "dritë", "3": "shkrim" },
        expansion: "dritë + shkrim",
      }],
    });
    const discovery = await discoveryForFactsV0_1([
      primary,
      fixtureFact({ form: "dritë", senses: [{ senseId: "light-1", glosses: ["light"] }], ipaObservations: [] }),
      fixtureFact({ form: "dritë", senses: [{ senseId: "light-2", glosses: ["firefly"] }], ipaObservations: [] }),
      fixtureFact({ form: "shkrim", senses: [{ senseId: "writing", glosses: ["writing"] }], ipaObservations: [] }),
    ], "dritëshkrim");
    expect(discovery.albanianLexicalReading?.sourceLinkedComponentReading).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining(["SOURCE_COMPONENT_RECORD_AMBIGUOUS"]),
    });
  });

  it("exposes the bounded Five Windows comparison with source-gated classifications and four additional queries", async () => {
    const facts = fiveWindowsFixtureFactsV0_1();
    const baseProvider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts });
    const queries: string[] = [];
    const provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 = Object.freeze({
      ...baseProvider,
      query: async (query: string) => {
        queries.push(query);
        return baseProvider.query(query);
      },
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "dritare",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("dritare"),
      heart: buildHeartInstrumentV1("dritare"),
      albanianLexicalSourceProvider: provider,
    });
    const comparison = result.discovery.albanianLexicalReading?.fiveWindowsComparison;

    expect(queries).toEqual(["dritare", "fënjeshtër", "finestër", "penxhere", "derkë"]);
    expect(comparison).toMatchObject({
      comparisonId: "FIVE_WINDOWS",
      queryForm: "dritare",
      members: [
        { form: "dritare", status: "MATCHES_FOUND", records: [{ classification: "ALBANIAN_INTERNAL_FORMATION" }] },
        { form: "fënjeshtër", status: "MATCHES_FOUND", records: [{ classification: "SOURCE_ATTRIBUTED_BORROWING", borrowedFromLanguage: "Vulgar Latin", ultimateSourceLanguage: "Latin" }] },
        { form: "finestër", status: "MATCHES_FOUND", records: [{ classification: "SOURCE_ATTRIBUTED_BORROWING", borrowedFromLanguage: "Italian", ultimateSourceLanguage: null }] },
        { form: "penxhere", status: "MATCHES_FOUND", records: [{ classification: "SOURCE_ATTRIBUTED_BORROWING", borrowedFromLanguage: "Ottoman Turkish", ultimateSourceLanguage: "Classical Persian" }] },
        { form: "derkë", status: "MATCHES_FOUND", records: [{ classification: "ALBANIAN_INTERNAL_FORMATION" }] },
      ],
    });
    expect(comparison?.members.every((member) => member.records.every((record) => record.usageNotes.length === 0))).toBe(true);
    expect(comparison?.members.find((member) => member.form === "dritare")?.records[0]?.sourceIpaSevenVoiceAnalyses).toMatchObject([{
      sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
      soundIndex: 0,
      rawIpa: "/dɾiˈtaɾɛ/",
      status: "SUPPORTED",
      authorityBoundary: "CURRENT_KAIKKI_IPA_SOURCE_DERIVED_PRODUCT_INTERPRETATION_NOT_FROZEN_PRONUNCIATION_AUTHORITY",
    }]);
    expect(comparison?.members.find((member) => member.form === "fënjeshtër")?.records[0]?.sourceIpaSevenVoiceAnalyses).toMatchObject([
      { sourceRecordId: expect.stringContaining("word=f%C3%ABnjesht%C3%ABr"), soundIndex: 0, status: "SUPPORTED" },
      { sourceRecordId: expect.stringContaining("word=f%C3%ABnjesht%C3%ABr"), soundIndex: 1, tags: ["Northern", "Tosk", "variant"] },
      { sourceRecordId: expect.stringContaining("word=f%C3%ABnjesht%C3%ABr"), soundIndex: 2, rawIpa: null, status: "NULL", reasonCodes: ["IPA_OBSERVATION_MISSING"] },
    ]);
    expect(comparison?.members.find((member) => member.form === "fënjeshtër")?.records[0]?.sourceIpaSevenVoiceAnalyses).toHaveLength(3);
    expect(comparison?.members.find((member) => member.form === "finestër")?.records[0]?.sourceIpaSevenVoiceAnalyses).toEqual([]);
    expect(comparison?.members.find((member) => member.form === "derkë")?.records[0]?.sourceIpaSevenVoiceAnalyses).toEqual([]);

    const vm = adaptAnalysisToTelemetryVM({
      word: "dritare",
      sanitized: "dritare",
      engineVersion: "fixture",
      primaryPath: { voicePath: ["I", "A"] },
      candidates: [],
      motivationDiscoveryV0_1: result.discovery,
    });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("FIVE WINDOWS — ALBANIAN WORD COMPARISON");
      expect(screen.getAllByTestId("albanian-five-windows-member")).toHaveLength(5);
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("fënjeshtër");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Vulgar Latin");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Usage / register: Unknown / Null");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Source IPA → Seven Voices");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Derived Voice path:");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Source IPA: Null · Derived Voice path: Null · Reason: IPA_OBSERVATION_MISSING");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Source sound tags: Gheg");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Source sound tags: Tosk");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Source sound tags: Northern, Tosk, variant");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Source sound tags: Southern, Gheg");
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("Source sound tags: not provided");
      expect(screen.getAllByTestId("albanian-five-windows-ipa-analysis")).toHaveLength(5);
      const vmComparison = vm.motivationDiscoveryV0_1.value.albanianLexicalReading?.fiveWindowsComparison;
      expect(vmComparison?.members[0]?.records[0]?.sourceIpaSevenVoiceAnalyses[0]).toMatchObject({
        sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
        soundIndex: 0,
        tags: ["Gheg"],
      });
      expect(vmComparison?.members[1]?.records[0]?.sourceIpaSevenVoiceAnalyses[1]).toMatchObject({
        sourceRecordId: "kaikki-albanian-jsonl:word=f%C3%ABnjesht%C3%ABr:ordinal=0",
        soundIndex: 1,
        tags: ["Northern", "Tosk", "variant"],
      });
    }
  });

  it("rejects Five Windows IPA projections with source-record or sound-index misalignment", async () => {
    const facts = fiveWindowsFixtureFactsV0_1();
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "dritare",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("dritare"),
      heart: buildHeartInstrumentV1("dritare"),
      albanianLexicalSourceProvider: provider,
    });
    const comparison = result.discovery.albanianLexicalReading?.fiveWindowsComparison;
    if (!comparison) throw new Error("Five Windows comparison was not produced");
    const malformed = {
      ...result.discovery,
      albanianLexicalReading: {
        ...result.discovery.albanianLexicalReading,
        fiveWindowsComparison: {
          ...comparison,
          members: comparison.members.map((member, index) => index === 0
            ? {
                ...member,
                records: member.records.map((record) => ({
                  ...record,
                  sourceIpaSevenVoiceAnalyses: record.sourceIpaSevenVoiceAnalyses.map((analysis) => ({
                    ...analysis,
                    sourceRecordId: "wrong-source-record",
                  })),
                })),
              }
            : member),
        },
      },
    };
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformed }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it("preserves multiple source records and explicit Null members without inferring absence or lookup-limit causation", async () => {
    const [dritare] = fiveWindowsFixtureFactsV0_1();
    const secondRecord = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=f%C3%ABnjesht%C3%ABr:ordinal=1",
      entryLocator: "jsonl://word/f%C3%ABnjesht%C3%ABr/match/1",
      physicalRecordOrdinal: 99999,
      form: "fënjeshtër",
      senses: [{ senseId: "fënjeshtër-window-alt", glosses: ["window variant"] }],
      ipaObservations: [],
    });
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [dritare, secondRecord],
    });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "dritare",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("dritare"),
      heart: buildHeartInstrumentV1("dritare"),
      albanianLexicalSourceProvider: provider,
    });
    const comparison = result.discovery.albanianLexicalReading?.fiveWindowsComparison;
    expect(comparison?.members.find((member) => member.form === "fënjeshtër")).toMatchObject({
      status: "MATCHES_FOUND",
      records: [
        { form: "fënjeshtër", sourceRecordId: expect.stringContaining("ordinal=1") },
      ],
    });
    expect(comparison?.members.find((member) => member.form === "finestër")).toMatchObject({
      status: "SOURCE_NOT_FOUND",
      records: [],
      reasonCodes: ["ALBANIAN_EXACT_FORM_NOT_FOUND"],
    });
    expect(comparison?.members.find((member) => member.form === "finestër")?.reasonCodes).not.toContain("LOOKUP_LIMIT");
  });

  it("keeps the comparison absent outside Albanian input and fails closed when the source is unavailable", async () => {
    const dritare = fiveWindowsFixtureFactsV0_1()[0];
    const fixtureProvider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts: [dritare] });
    const nonAlbanian = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "dritare",
      inputLanguage: "en",
      inputProfile: "english",
      analysis: await analysisFor("dritare"),
      heart: buildHeartInstrumentV1("dritare"),
      albanianLexicalSourceProvider: fixtureProvider,
    });
    expect(nonAlbanian.discovery.albanianLexicalReading?.fiveWindowsComparison).toBeNull();

    const unavailableBase = createAlbanianKaikkiServerOnlyUnavailableProviderV0_1("ALBANIAN_SOURCE_PATH_NOT_CONFIGURED");
    let unavailableQueries = 0;
    const unavailableProvider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 = Object.freeze({
      ...unavailableBase,
      query: async (query: string) => {
        unavailableQueries += 1;
        return unavailableBase.query(query);
      },
    });
    const unavailable = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "dritare",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("dritare"),
      heart: buildHeartInstrumentV1("dritare"),
      albanianLexicalSourceProvider: unavailableProvider,
    });
    const comparison = unavailable.discovery.albanianLexicalReading?.fiveWindowsComparison;
    expect(unavailableQueries).toBe(1);
    expect(comparison?.members.every((member) => member.status === "UNAVAILABLE")).toBe(true);
    expect(comparison?.members.every((member) => member.reasonCodes.includes("ALBANIAN_SOURCE_PATH_NOT_CONFIGURED"))).toBe(true);

    const unavailableVm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: unavailable.discovery });
    expect(unavailableVm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (unavailableVm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: unavailableVm.motivationDiscoveryV0_1 }));
      expect(screen.queryByTestId("albanian-lexical-reading")).toBeNull();
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("FIVE WINDOWS — ALBANIAN WORD COMPARISON");
      expect(screen.getAllByTestId("albanian-five-windows-member")).toHaveLength(5);
      expect(screen.getByTestId("albanian-five-windows-comparison")).toHaveTextContent("ALBANIAN_SOURCE_PATH_NOT_CONFIGURED");
    }
  });
});
