import { createHash } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildAlbanianFunctionalMeaningBridgeV0_1,
  buildMotivationEngineDiscoveryServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticSourceFileV0_1,
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1,
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
  createAlbanianKaikkiServerOnlyUnavailableProviderV0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
  type AlbanianKaikkiSourceRelationAssertionV0_1,
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
import { cleanup, render, screen } from "@testing-library/react";

function fixtureFact(
  overrides: Omit<Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>, "relatedForms"> & {
    relatedForms?: readonly Readonly<{
      form: string;
      relation: "SOURCE_RELATED_FORM" | "SOURCE_DERIVED_FORM";
      entryLocator: string;
      sourceRelationAssertion?: AlbanianKaikkiSourceRelationAssertionV0_1;
    }>[];
  } = {},
): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  const relatedForms = overrides.relatedForms?.map((relation) => Object.freeze({
    ...relation,
    sourceRelationAssertion: relation.sourceRelationAssertion ?? Object.freeze({
      assertionScope: "UNKNOWN_OR_NULL" as const,
      sourceSenseId: null,
      sourceSenseOrdinal: null,
      sourceSenseIdentityStatus: "UNKNOWN_OR_NULL" as const,
      sourceAssertionOrdinal: null,
      reasonCodes: Object.freeze(["SOURCE_RELATION_PROVENANCE_NOT_PROJECTED"]),
    }),
  }));
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
    ...(relatedForms ? { relatedForms: Object.freeze(relatedForms) } : {}),
  };
}

function legacyPayloadWithoutSenseOwnershipV0_1<T>(value: T): T {
  const copy = JSON.parse(JSON.stringify(value)) as unknown;
  const stripOwnership = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(stripOwnership);
      return;
    }
    if (!node || typeof node !== "object") return;
    const record = node as Record<string, unknown>;
    delete record.sourceRelationAssertion;
    delete record.sourceSenseOrdinal;
    Object.values(record).forEach(stripOwnership);
  };
  stripOwnership(copy);
  return copy as T;
}

function unsupportedAfArityFixtureFactsV0_1(
  example: "kalimtar" | "prurës",
): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  if (example === "kalimtar") {
    const component = (form: string, ordinal: number, physicalRecordOrdinal: number, partOfSpeech: string, senseId: string) => fixtureFact({
      sourceRecordId: `kaikki-albanian-jsonl:word=${encodeURIComponent(form)}:ordinal=${ordinal}`,
      entryLocator: `jsonl://word/${encodeURIComponent(form)}/match/${ordinal}`,
      physicalRecordOrdinal,
      form,
      partOfSpeech,
      senses: [{ senseId, glosses: [form] }],
      ipaObservations: [],
    });
    return [
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=kalimtar:ordinal=0",
        entryLocator: "jsonl://word/kalimtar/match/0",
        physicalRecordOrdinal: 4392,
        form: "kalimtar",
        partOfSpeech: "adj",
        senses: [{ senseId: "en-kalimtar-sq-adj-8BUehbSv", glosses: ["transitive"] }],
        etymologyText: "From kaloj + im + tar.",
        etymologyLinks: [
          { sourceForm: "kaloj", reference: "kaloj#Albanian" },
          { sourceForm: "im", reference: "im#Albanian" },
          { sourceForm: "tar", reference: "tar#Albanian" },
        ],
        etymologyTemplates: [{
          name: "af",
          args: { "1": "sq", "2": "kaloj", "3": "im", "4": "tar" },
          expansion: "kaloj + im + tar",
        }],
        ipaObservations: [],
      }),
      component("kaloj", 0, 3374, "verb", "en-kaloj-sq-verb-36Iaz9AY"),
      component("im", 0, 1085, "pron", "en-im-sq-pron-am1FLga5"),
      component("im", 1, 1086, "noun", "en-im-sq-noun-W9uF~iF3"),
      component("im", 2, 1087, "verb", "en-im-sq-verb-TO-8OvcU"),
    ];
  }

  const wPlusDisambPeopleCategory = {
    name: "People",
    kind: "other",
    parents: [],
    source: "w+disamb",
    orig: "sq:People",
    langcode: "sq",
    _dis: null,
  } as const;
  return [
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=prur%C3%ABs:ordinal=0",
      entryLocator: "jsonl://word/prur%C3%ABs/match/0",
      physicalRecordOrdinal: 11285,
      form: "prurës",
      partOfSpeech: "noun",
      senses: [{ senseId: "en-prurës-sq-noun-r8aOcTYu", glosses: ["messenger, one who brings news"], categories: [wPlusDisambPeopleCategory] }],
      etymologyText: "From prur-, aorist stem of bie (“to bring”), + -ës.",
      etymologyLinks: [
        { sourceForm: "bie", reference: "bie#Albanian" },
        { sourceForm: "-ës", reference: "-ës#Albanian" },
      ],
      etymologyTemplates: [{ name: "af", args: { "1": "sq", "2": "-ës" }, expansion: "-ës" }],
      ipaObservations: [],
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=-%C3%ABs:ordinal=0",
      entryLocator: "jsonl://word/-%C3%ABs/match/0",
      physicalRecordOrdinal: 7944,
      form: "-ës",
      partOfSpeech: "suffix",
      senses: [{ senseId: "en--ës-sq-suffix-5nXSOZjB", glosses: ["used to form agent nouns. -er"] }],
      ipaObservations: [],
    }),
  ];
}

function sellerFamilyFixtureFactsV0_1(): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  const names = ["flower seller", "drinks seller", "brandy seller"];
  const forms = ["luleshitës", "pijeshitës", "rakishitës"];
  return [
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=shit%C3%ABs:ordinal=fixture",
      entryLocator: "jsonl://word/shit%C3%ABs/match/fixture",
      form: "shitës",
      senses: [{ senseId: "shites-seller-fixture", glosses: ["seller, vendor"] }],
      relatedForms: [
        ...forms.map((form) => ({ form, relation: "SOURCE_DERIVED_FORM" as const, entryLocator: `jsonl://word/${encodeURIComponent(form)}` })),
        { form: "missing-shitës", relation: "SOURCE_DERIVED_FORM" as const, entryLocator: "jsonl://word/missing-shit%C3%ABs" },
      ],
      ipaObservations: [],
    }),
    ...forms.map((form, index) => fixtureFact({
      sourceRecordId: `kaikki-albanian-jsonl:word=${encodeURIComponent(form)}:ordinal=fixture`,
      entryLocator: `jsonl://word/${encodeURIComponent(form)}/match/fixture`,
      form,
      senses: [{ senseId: `${form}-sense-fixture`, glosses: [names[index]!] }],
      etymologyLinks: [{ sourceForm: "shitës", reference: "shitës#Albanian" }],
      ipaObservations: [],
    })),
  ];
}

function shkenceScientistFixtureFactsV0_1(
  relatedOverrides: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1> = {},
  relation: "SOURCE_RELATED_FORM" | "SOURCE_DERIVED_FORM" = "SOURCE_RELATED_FORM",
): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  const occupationsCategory = {
    name: "Occupations",
    kind: null,
    parents: [],
    source: "w",
    orig: "sq:Occupations",
    langcode: "sq",
    _dis: null,
  } as const;
  const primary = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=shkenc%C3%AB:ordinal=fixture",
    entryLocator: "jsonl://word/shkenc%C3%AB/match/fixture",
    form: "shkencë",
    partOfSpeech: "noun",
    senses: [{ senseId: "shkence-fixture-sense", glosses: ["science"] }],
    ipaObservations: [{ soundIndex: 0, ipa: "/ʃkɛnts(ə)/", tags: [] }],
    relatedForms: [{ form: "shkencëtar", relation, entryLocator: "jsonl://word/shkenc%C3%ABtar" }],
  });
  const related = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=shkenc%C3%ABtar:ordinal=fixture",
    entryLocator: "jsonl://word/shkenc%C3%ABtar/match/fixture",
    form: "shkencëtar",
    partOfSpeech: "noun",
    senses: [{ senseId: "shkencetar-scientist-fixture", glosses: ["scientist"], categories: [occupationsCategory] }],
    ipaObservations: [],
    etymologyText: "From shkencë + -tar.",
    etymologyLinks: [{ sourceForm: "shkencë", reference: "shkencë#Albanian" }],
    etymologyTemplates: [{
      name: "suffix",
      args: { "1": "sq", "2": "shkencë", "3": "tar" },
      expansion: "shkencë + -tar",
    }],
    ...relatedOverrides,
  });
  return Object.freeze([primary, related]);
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
  return discoveryForProviderV0_1(provider, word);
}

function dritareTargetFirstFixtureFactsV0_1(): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  return [
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
      entryLocator: "jsonl://word/dritare/match/0",
      physicalRecordOrdinal: 2171,
      form: "dritare",
      senses: [
        { senseId: "en-dritare-sq-noun-RP97AsgN", glosses: ["window"] },
        { senseId: "en-dritare-sq-noun-~k6zu7Ra", glosses: ["access to the sea"] },
        { senseId: "en-dritare-sq-noun-1Zl6eJVE", glosses: ["key, opening, access to knowledge (that helps broadening your horizon of knowledge)"] },
        { senseId: "en-dritare-sq-noun-CIjOT75H", glosses: ["free time (between work hours or lessons)"] },
      ],
      ipaObservations: [{ soundIndex: 0, ipa: "/dɾiˈtaɾɛ/", tags: [] }],
      etymologyText: "From dritë (“light”) + -are (“-er”), meaning to let light through or similar.",
      etymologyLinks: [
        { sourceForm: "dritë", reference: "dritë#Albanian" },
        { sourceForm: "-are", reference: "-are#Albanian" },
      ],
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=0",
      entryLocator: "jsonl://word/drit%C3%AB/match/0",
      physicalRecordOrdinal: 3461,
      form: "dritë",
      senses: [
        { senseId: "en-dritë-sq-noun-macCYXLU", glosses: ["light"] },
        { senseId: "en-dritë-sq-noun-ssgdmJru", glosses: ["light (such as a lamp)"] },
        { senseId: "en-dritë-sq-noun-r6wyfnNp", glosses: ["firefly"] },
      ],
      ipaObservations: [{ soundIndex: 0, ipa: "/ˈdɾitə/", tags: [] }],
    }),
  ];
}

function zjarrfikesThreeComponentFixtureFactsV0_1(overrides: Readonly<{
  primary?: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>;
  object?: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>;
  actionNoun?: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>;
  actionVerb?: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>;
  suffix?: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>;
}> = {}): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  const occupationCategory = {
    name: "Occupations",
    kind: "other",
    parents: [],
    source: "w+disamb",
    orig: "sq:Occupations",
    langcode: "sq",
    _dis: null,
  } as const;
  return [
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=zjarrfik%C3%ABs:ordinal=0",
      entryLocator: "jsonl://word/zjarrfik%C3%ABs/match/0",
      physicalRecordOrdinal: 11480,
      form: "zjarrfikës",
      partOfSpeech: "noun",
      senses: [
        { senseId: "en-zjarrfikës-sq-noun-P9hAbGCJ", glosses: ["firefighter"] },
        { senseId: "en-zjarrfikës-sq-noun-3IRd5pZ-", glosses: ["fireman"], categories: [occupationCategory] },
      ],
      ipaObservations: [],
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
      ...overrides.primary,
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=zjarr:ordinal=0",
      entryLocator: "jsonl://word/zjarr/match/0",
      physicalRecordOrdinal: 2090,
      form: "zjarr",
      partOfSpeech: "noun",
      senses: [
        { senseId: "zjarr-fire", glosses: ["fire"] },
        { senseId: "zjarr-family", glosses: ["family, clan"] },
      ],
      ipaObservations: [],
      ...overrides.object,
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=0",
      entryLocator: "jsonl://word/fik/match/0",
      physicalRecordOrdinal: 338,
      form: "fik",
      partOfSpeech: "noun",
      senses: [{ senseId: "en-fik-sq-noun-jDnGNIgm", glosses: ["fig"] }],
      ipaObservations: [],
      ...overrides.actionNoun,
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=1",
      entryLocator: "jsonl://word/fik/match/1",
      physicalRecordOrdinal: 339,
      form: "fik",
      partOfSpeech: "verb",
      senses: [
        { senseId: "en-fik-sq-verb-3UhMn1WK", glosses: ["to extinguish (fire)"] },
        { senseId: "en-fik-sq-verb-j~6gALfc", glosses: ["to switch off, turn off"] },
        { senseId: "en-fik-sq-verb-JbZbl6zi", glosses: ["to bring misfortune, ruin, destroy"] },
      ],
      ipaObservations: [],
      ...overrides.actionVerb,
    }),
    fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=-%C3%ABs:ordinal=0",
      entryLocator: "jsonl://word/-%C3%ABs/match/0",
      physicalRecordOrdinal: 7944,
      form: "-ës",
      partOfSpeech: "suffix",
      senses: [{ senseId: "en--ës-sq-suffix-5nXSOZjB", glosses: ["used to form agent nouns. -er"] }],
      ipaObservations: [],
      ...overrides.suffix,
    }),
  ];
}

async function discoveryForProviderV0_1(
  provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
  word: string,
) {
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

function targetFirstAgentFixtureFactsV0_1(input: Readonly<{
  target: string;
  targetGloss: string;
  targetSenseId: string;
  base: string;
  baseGloss: string;
  templateComponent: string;
  templateExpansion?: string;
  sourceEtymologyText?: string;
  sourceOccupationCategory?: boolean;
  otherTargetSense?: Readonly<{ senseId: string; gloss: string }>;
}>): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  const category = {
    name: "Occupations",
    kind: "other",
    parents: [],
    source: "w",
    orig: "sq:Occupations",
    langcode: "sq",
    _dis: null,
  } as const;
  const targetSenses = [
    {
      senseId: input.targetSenseId,
      glosses: [input.targetGloss],
      ...(input.sourceOccupationCategory ? { categories: [category] } : {}),
    },
    ...(input.otherTargetSense ? [{
      senseId: input.otherTargetSense.senseId,
      glosses: [input.otherTargetSense.gloss],
    }] : []),
  ];
  const target = fixtureFact({
    sourceRecordId: `kaikki-albanian-jsonl:word=${encodeURIComponent(input.target)}:ordinal=fixture`,
    entryLocator: `jsonl://word/${encodeURIComponent(input.target)}/match/fixture`,
    form: input.target,
    partOfSpeech: "noun",
    senses: targetSenses,
    ipaObservations: [],
    etymologyText: input.sourceEtymologyText ?? `From ${input.templateExpansion ?? `${input.base} + ${input.templateComponent}`}.`,
    etymologyLinks: [
      { sourceForm: input.base, reference: `${input.base}#Albanian` },
      { sourceForm: input.templateComponent, reference: `${input.templateComponent}#Albanian` },
    ],
    etymologyTemplates: [{
      name: "af",
      args: { "1": "sq", "2": input.base, "3": input.templateComponent },
      expansion: input.templateExpansion ?? `${input.base} + ${input.templateComponent}`,
    }],
  });
  const base = fixtureFact({
    sourceRecordId: `kaikki-albanian-jsonl:word=${encodeURIComponent(input.base)}:ordinal=fixture`,
    entryLocator: `jsonl://word/${encodeURIComponent(input.base)}/match/fixture`,
    form: input.base,
    partOfSpeech: "noun",
    senses: [{ senseId: `${input.base}-fixture-sense`, glosses: [input.baseGloss] }],
    ipaObservations: [],
  });
  return Object.freeze([target, base]);
}

function orendreqesAfTargetFixtureFactsV0_1(input: Readonly<{
  targetOverrides?: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>;
  componentRecords?: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
}> = {}): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  const occupationCategory = {
    name: "Occupations",
    kind: "other",
    parents: [],
    source: "w",
    orig: "sq:Occupations",
    langcode: "sq",
    _dis: null,
  } as const;
  const target = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=or%C3%ABndreq%C3%ABs:ordinal=0",
    entryLocator: "jsonl://word/or%C3%ABndreq%C3%ABs/match/0",
    physicalRecordOrdinal: 11866,
    form: "orëndreqës",
    partOfSpeech: "noun",
    senses: [{
      senseId: "en-orëndreqës-sq-noun-BYDVVPw3",
      glosses: ["clockmaker, watchmaker"],
      categories: [occupationCategory],
    }],
    ipaObservations: [],
    etymologyText: "A compound of orë (“watch”) + ndreqës (“repairer, fixer”).",
    etymologyLinks: [
      { sourceForm: "orë", reference: "orë#Albanian" },
      { sourceForm: "ndreqës", reference: "ndreqës#Albanian" },
    ],
    etymologyTemplates: [{
      name: "af",
      args: { "1": "sq", "2": "orë", "3": "ndreqës", t1: "watch", t2: "repairer, fixer" },
      expansion: "orë (“watch”) + ndreqës (“repairer, fixer”)",
    }],
    ...input.targetOverrides,
  });
  return Object.freeze([target, ...(input.componentRecords ?? [])]);
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

function malorEntityPropertyFixtureFactsV0_1(input: Readonly<{
  base?: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>;
  target?: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>;
  additionalFacts?: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[];
}> = {}): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
  const base = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
    entryLocator: "jsonl://word/mal/match/0",
    form: "mal",
    partOfSpeech: "noun",
    senses: [{ senseId: "mal-mountain-fixture", glosses: ["mountain"] }],
    relatedForms: [{ form: "malor", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/malor" }],
    ...input.base,
  });
  const target = fixtureFact({
    sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
    entryLocator: "jsonl://word/malor/match/0",
    form: "malor",
    partOfSpeech: "adj",
    senses: [{ senseId: "malor-mountainous-fixture", glosses: ["mountainous"] }],
    ipaObservations: [],
    etymologyText: "From mal + -or.",
    etymologyLinks: [
      { sourceForm: "mal", reference: "mal#Albanian" },
      { sourceForm: "-or", reference: "-or#Albanian" },
    ],
    etymologyTemplates: [{
      name: "suffix",
      args: { "1": "sq", "2": "mal", "3": "-or" },
      expansion: "mal + -or",
    }],
    ...input.target,
  });
  return Object.freeze([base, target, ...(input.additionalFacts ?? [])]);
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
    id?: string | null;
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

  it("does not promote non-role noun glosses or adjective targets from derived-form spelling", async () => {
    const facts = [
      fixtureFact({
        sourceRecordId: "synthetic:agent-shape-control-root",
        entryLocator: "jsonl://synthetic/agent-shape-control-root",
        form: "agent-shape-control-root",
        senses: [{ senseId: "agent-shape-control-root-1", glosses: ["control base"] }],
        relatedForms: [
          { form: "gjitar", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://synthetic/gjitar" },
          { form: "kombëtar", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://synthetic/kombëtar" },
        ],
      }),
      fixtureFact({
        sourceRecordId: "synthetic:gjitar",
        entryLocator: "jsonl://synthetic/gjitar/match/0",
        form: "gjitar",
        partOfSpeech: "noun",
        senses: [{ senseId: "synthetic-gjitar-1", glosses: ["mammal"] }],
      }),
      fixtureFact({
        sourceRecordId: "synthetic:kombëtar",
        entryLocator: "jsonl://synthetic/kombëtar/match/0",
        form: "kombëtar",
        partOfSpeech: "adjective",
        senses: [{ senseId: "synthetic-kombëtar-1", glosses: ["national"] }],
      }),
    ];
    const result = await discoveryForFactsV0_1(facts, "agent-shape-control-root");

    expect(result.albanianLexicalReading?.relatedCandidateEvaluations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        relatedForm: "gjitar",
        functionalMeaningBridge: expect.objectContaining({
          status: "NULL",
          functionalHypothesis: expect.objectContaining({ functionalOperation: null }),
        }),
      }),
      expect.objectContaining({
        relatedForm: "kombëtar",
        functionalMeaningBridge: expect.objectContaining({
          status: "NULL",
          functionalHypothesis: expect.objectContaining({ functionalOperation: null }),
        }),
      }),
    ]));
  });

  it("preserves the existing source-category-qualified fuzhnjë → fuzhnjar AGENT", async () => {
    const occupations = {
      name: "Occupations",
      kind: null,
      parents: [],
      source: "w",
      orig: "sq:Occupations",
      langcode: "sq",
      _dis: null,
    } as const;
    const result = await discoveryForFactsV0_1([
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=fuzhnj%C3%AB:ordinal=0",
        entryLocator: "jsonl://word/fuzhnj%C3%AB/match/0",
        form: "fuzhnjë",
        partOfSpeech: "noun",
        senses: [{ senseId: "en-fuzhnjë-sq-noun-W19Jn~~T", glosses: ["kind of fishing spear consisting of a long shaft with many hooked extremities"] }],
        relatedForms: [{ form: "fuzhnjar", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/fuzhnjar" }],
      }),
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=fuzhnjar:ordinal=0",
        entryLocator: "jsonl://word/fuzhnjar/match/0",
        form: "fuzhnjar",
        partOfSpeech: "noun",
        senses: [{
          senseId: "en-fuzhnjar-sq-noun-l0FOuyMg",
          glosses: ["person who uses a harpoon to catch fish"],
          categories: [occupations],
        }],
        etymologyText: "From fuzhnjë + ar.",
        etymologyLinks: [{ sourceForm: "fuzhnjë", reference: "fuzhnjë#Albanian" }],
      }),
    ], "fuzhnjë");

    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "SUPPORTED",
      relatedForm: "fuzhnjar",
      functionalHypothesis: {
        functionalOperation: "AGENT",
        basis: expect.arrayContaining([
          "SOURCE_DERIVED_FORM_LINK",
          "SOURCE_ATTESTED_FINAL_SENSE_CATEGORY",
        ]),
      },
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

  it("supports direct qymyrtar through the target-authored reference gate without inventing a base-side derived link", async () => {
    const facts = targetFirstAgentFixtureFactsV0_1({
      target: "qymyrtar",
      targetGloss: "charcoal maker",
      targetSenseId: "en-qymyrtar-sq-noun-51rw1lY3",
      base: "qymyr",
      baseGloss: "coal",
      templateComponent: "tar",
      sourceOccupationCategory: true,
    });
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts });
    const query = jest.fn(provider.query);
    const discovery = await discoveryForProviderV0_1({ ...provider, query }, "qymyrtar");
    const reading = discovery.albanianLexicalReading;
    const candidate = reading?.relatedCandidateEvaluations.find((item) => item.sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE");

    expect(query.mock.calls.map(([form]) => form)).toEqual(["qymyrtar", "qymyr"]);
    expect(reading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: { form: "qymyrtar", meaningGlosses: ["charcoal maker"] },
      relatedForms: [],
      sourceLinkedComparison: {
        status: "SUPPORTED",
        relation: {
          relation: "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
          primarySourceRecordId: "kaikki-albanian-jsonl:word=qymyr:ordinal=fixture",
          relatedSourceRecordId: "kaikki-albanian-jsonl:word=qymyrtar:ordinal=fixture",
          direction: "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE",
          referencedForm: "qymyr",
          reference: "qymyr#Albanian",
        },
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        relatedForm: "qymyrtar",
        sourceFacts: {
          primary: { form: "qymyr", meaningGlosses: ["coal"] },
          related: { form: "qymyrtar", meaningGlosses: ["charcoal maker"] },
        },
        derivedStructure: null,
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: "AGENT",
          basis: expect.arrayContaining([
            "TARGET_SOURCE_AUTHORED_ETYMOLOGY_REFERENCE",
            "SOURCE_STRUCTURED_ALBANIAN_REFERENCE",
            "SOURCE_ATTESTED_FINAL_SENSE_CATEGORY",
          ]),
          statement: expect.stringContaining("does not create a base-side SOURCE_DERIVED_FORM assertion"),
        },
      },
      interpretation: {
        status: "EXPLORATORY_ZHEJI_READING",
        statement: expect.stringContaining("Integrated source-bounded functional reading"),
        basis: expect.arrayContaining(["STRUCTURAL_EMBRYO_FUNCTION_REMAINS_UNKNOWN_OR_NULL"]),
      },
    });
    expect(candidate?.sourceLinkedComparison.related?.sourceSenses?.[0]).toMatchObject({
      senseId: "en-qymyrtar-sq-noun-51rw1lY3",
      glosses: ["charcoal maker"],
      categories: [expect.objectContaining({ name: "Occupations", orig: "sq:Occupations", langcode: "sq", source: "w" })],
    });
    expect(candidate?.functionalMeaningBridge.functionalHypothesis.basis).not.toContain("SOURCE_DERIVED_FORM_LINK");
    expect(candidate?.functionalMeaningBridge.functionalHypothesis.alternatives).toEqual(expect.arrayContaining([
      expect.stringContaining("not a base-side derived-form edge"),
      expect.stringContaining("remaining component is not independently resolved"),
    ]));
    expect(candidate?.sourceLinkedComparison.related?.pronunciationVariants).toEqual([]);

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind !== "present") throw new Error("Expected target-first reading in the existing UI adapter");
    const fjaloriFetch = jest.spyOn(globalThis, "fetch").mockRejectedValue(
      new Error("external FjaloriShqip access is disabled in this synthetic-source integration test"),
    );
    try {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("qymyrtar");
      expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
      expect(screen.getByTestId("albanian-reading-related-candidate-evaluations")).toHaveTextContent("TARGET_AUTHORED_ETYMOLOGY_REFERENCE");
      expect(screen.getByTestId("albanian-reading-related-candidate-evaluations")).toHaveTextContent("qymyr#Albanian");
      expect(screen.getByTestId("albanian-source-linked-comparison")).toHaveTextContent("qymyr → qymyr#Albanian");
      expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("UNKNOWN_OR_NULL");
      expect(fjaloriFetch).toHaveBeenCalledTimes(1);
      expect(fjaloriFetch).toHaveBeenCalledWith(
        "https://fjalorishqip.org/api/v1/fjala/qymyrtar.json",
        expect.objectContaining({ cache: "force-cache" }),
      );
    } finally {
      cleanup();
      fjaloriFetch.mockRestore();
    }

    const legacyPayload = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const legacyReading = legacyPayload.albanianLexicalReading as Record<string, unknown>;
    const legacyCandidates = legacyReading.relatedCandidateEvaluations as Record<string, unknown>[];
    const legacyTargetFirstCandidate = legacyCandidates.find((item) =>
      item.sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
    );
    if (!legacyTargetFirstCandidate) throw new Error("Expected target-authored candidate for legacy adapter regression");
    delete legacyTargetFirstCandidate.sourceRelationAssertion;
    const legacyCandidateComparison = legacyTargetFirstCandidate.sourceLinkedComparison as Record<string, unknown>;
    delete (legacyCandidateComparison.relation as Record<string, unknown>).sourceRelationAssertion;
    const legacySelectedComparison = legacyReading.sourceLinkedComparison as Record<string, unknown>;
    delete (legacySelectedComparison.relation as Record<string, unknown>).sourceRelationAssertion;
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: legacyPayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "present",
    });

    const forgedLegacyPayload = JSON.parse(JSON.stringify(legacyPayload)) as Record<string, unknown>;
    const forgedLegacyReading = forgedLegacyPayload.albanianLexicalReading as Record<string, unknown>;
    const forgedLegacyCandidate = (forgedLegacyReading.relatedCandidateEvaluations as Record<string, unknown>[])
      .find((item) => item.sourceRelation === "TARGET_AUTHORED_ETYMOLOGY_REFERENCE");
    if (!forgedLegacyCandidate) throw new Error("Expected target-authored candidate for forged ownership regression");
    forgedLegacyCandidate.sourceRelationAssertion = {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: "unrelated-sense",
      sourceSenseOrdinal: 0,
      sourceSenseIdentityStatus: "VERIFIED",
      sourceAssertionOrdinal: 0,
      reasonCodes: [],
    };
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: forgedLegacyPayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it("supports an exact target-role sense while retaining ambiguous and unresolved af components without alignment", async () => {
    const targetFacts = orendreqesAfTargetFixtureFactsV0_1({
      targetOverrides: {
        senses: [
          {
            senseId: "en-orëndreqës-sq-noun-BYDVVPw3",
            glosses: ["clockmaker, watchmaker"],
            categories: [{
              name: "Occupations",
              kind: "other",
              parents: [],
              source: "w",
              orig: "sq:Occupations",
              langcode: "sq",
              _dis: null,
            }],
          },
          { senseId: "orendreqes-other-sense", glosses: ["unrelated sense"] },
        ],
        ipaObservations: [{ soundIndex: 0, ipa: "/oɾəndɾecəs/", tags: [] }],
      },
      componentRecords: [
        fixtureFact({
          sourceRecordId: "kaikki-albanian-jsonl:word=or%C3%AB:ordinal=0",
          entryLocator: "jsonl://word/or%C3%AB/match/0",
          form: "orë",
          senses: [
            { senseId: "ore-hour", glosses: ["hour"] },
            { senseId: "ore-clock", glosses: ["clock", "watch"] },
            { senseId: "ore-time", glosses: ["time"] },
          ],
          ipaObservations: [],
        }),
        fixtureFact({
          sourceRecordId: "kaikki-albanian-jsonl:word=or%C3%AB:ordinal=1",
          entryLocator: "jsonl://word/or%C3%AB/match/1",
          physicalRecordOrdinal: 11867,
          form: "orë",
          senses: [
            { senseId: "ore-mountain-nymph", glosses: ["mountain nymph"] },
            { senseId: "ore-luck", glosses: ["fate, luck"] },
          ],
          ipaObservations: [],
        }),
      ],
    });
    const discovery = await discoveryForFactsV0_1(targetFacts, "orëndreqës");
    const reading = discovery.albanianLexicalReading;

    expect(reading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId: "kaikki-albanian-jsonl:word=or%C3%ABndreq%C3%ABs:ordinal=0",
        partOfSpeech: "noun",
      },
      sourcePronunciation: { status: "SUPPORTED", rawIpa: "/oɾəndɾecəs/" },
      sourceLinkedComponentReading: {
        status: "NULL",
        relation: {
          relation: "SOURCE_AUTHORED_AF_TEMPLATE",
          references: [
            { sourceForm: "orë", reference: "orë#Albanian" },
            { sourceForm: "ndreqës", reference: "ndreqës#Albanian" },
          ],
        },
        componentResolutions: [
          { sourceForm: "orë", status: "AMBIGUOUS", sourceRecordIds: [
            "kaikki-albanian-jsonl:word=or%C3%AB:ordinal=0",
            "kaikki-albanian-jsonl:word=or%C3%AB:ordinal=1",
          ] },
          { sourceForm: "ndreqës", status: "UNRESOLVED", sourceRecordIds: [] },
        ],
        functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        relatedForm: null,
        derivedStructure: null,
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: "AGENT",
          basis: expect.arrayContaining([
            "SOURCE_ATTESTED_TARGET_ROLE_CATEGORY",
            "TARGET_SOURCE_AUTHORED_AF_TEMPLATE",
          ]),
          statement: expect.stringContaining("clockmaker, watchmaker"),
          alternatives: expect.arrayContaining([
            expect.stringContaining("orë has 2 source records"),
            expect.stringContaining("ndreqës remains unresolved"),
          ]),
        },
      },
      interpretation: { status: "EXPLORATORY_ZHEJI_READING" },
    });
    expect(reading?.sourceLinkedComparison?.status).not.toBe("SUPPORTED");
    expect(reading?.functionalMeaningBridge.functionalHypothesis.statement).toContain("do not create a base-side SOURCE_DERIVED_FORM assertion");
    expect(reading?.sourceLinkedComponentReading?.components.flatMap((component) => component.sourceSenses?.map((sense) => sense.senseId) ?? []))
      .toEqual(["ore-hour", "ore-clock", "ore-time", "ore-mountain-nymph", "ore-luck"]);
    expect(reading?.sourceLinkedComponentReading?.components.flatMap((component) => component.pronunciationVariants))
      .toEqual([]);

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1?.kind).toBe("present");
    if (vm.motivationDiscoveryV0_1?.kind !== "present") throw new Error("Expected direct target-role reading in the UI adapter");
    const tamperedDiscovery = {
      ...discovery,
      exactLexicalSourceFacts: discovery.exactLexicalSourceFacts?.map((fact) => fact.form === "orëndreqës"
        ? { ...fact, senses: fact.senses.map((sense) => ({ ...sense, categories: [] })) }
        : fact),
    };
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: tamperedDiscovery }).motivationDiscoveryV0_1)
      .toMatchObject({ kind: "missing", missing: "malformed" });
    const fetchSpy = jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("external source disabled in synthetic test"));
    try {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("clockmaker, watchmaker");
      expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("do not create a base-side SOURCE_DERIVED_FORM assertion or select a component sense");
      expect(screen.getByTestId("albanian-source-linked-component-reading")).toHaveTextContent("orë: ambiguous (2 source records)");
      expect(screen.getByTestId("albanian-source-linked-component-reading")).toHaveTextContent("ndreqës: unresolved (0 source records)");
      expect(screen.getByTestId("albanian-reading-functional-bridge-derived-structure-null")).toHaveTextContent("no Voice or phonological semantic relation is inferred");
    } finally {
      cleanup();
      fetchSpy.mockRestore();
    }
  });

  it("does not require IPA to retain a source-category-qualified direct target-role reading", async () => {
    const discovery = await discoveryForFactsV0_1(orendreqesAfTargetFixtureFactsV0_1(), "orëndreqës");
    expect(discovery.albanianLexicalReading).toMatchObject({
      sourcePronunciation: null,
      functionalMeaningBridge: {
        status: "SUPPORTED",
        relatedForm: null,
        derivedStructure: null,
        functionalHypothesis: { functionalOperation: "AGENT" },
      },
    });
  });

  it.each([
    ["missing target role category", { senses: [{ senseId: "en-orëndreqës-sq-noun-BYDVVPw3", glosses: ["clockmaker, watchmaker"] }] }],
    ["disambiguated-only target category", { senses: [{
      senseId: "en-orëndreqës-sq-noun-BYDVVPw3",
      glosses: ["clockmaker, watchmaker"],
      categories: [{ name: "Occupations", kind: "other", parents: [], source: "w+disamb", orig: "sq:Occupations", langcode: "sq", _dis: null }],
    }] }],
    ["wrong target POS", { partOfSpeech: "verb" }],
    ["foreign component reference", { etymologyLinks: [
      { sourceForm: "orë", reference: "orë#Ottoman_Turkish" },
      { sourceForm: "ndreqës", reference: "ndreqës#Albanian" },
    ] }],
    ["unsupported target-authored explanation", { etymologyText: "Not a compound of orë (“watch”) + ndreqës (“repairer, fixer”)." }],
  ] as const)("keeps direct orëndreqës AGENT Null for %s", async (_label, targetOverrides) => {
    const discovery = await discoveryForFactsV0_1(orendreqesAfTargetFixtureFactsV0_1({
      targetOverrides: targetOverrides as Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>,
    }), "orëndreqës");
    expect(discovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(discovery.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
  });

  it("keeps direct orëndreqës AGENT Null when the exact target record identity is duplicated", async () => {
    const [target, ...components] = orendreqesAfTargetFixtureFactsV0_1();
    if (!target) throw new Error("Expected target fixture");
    const duplicate = {
      ...target,
      sourceRecordId: "kaikki-albanian-jsonl:word=or%C3%ABndreq%C3%ABs:ordinal=1",
      entryLocator: "jsonl://word/or%C3%ABndreq%C3%ABs/match/1",
      physicalRecordOrdinal: target.physicalRecordOrdinal + 1,
    };
    const discovery = await discoveryForFactsV0_1([target, duplicate, ...components], "orëndreqës");
    expect(discovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(discovery.albanianLexicalReading?.functionalMeaningBridge.reasonCodes).toContain("SOURCE_TARGET_RECORD_IDENTITY_AMBIGUOUS");
  });

  it("makes direct pelar reachable through the same target-authored reference gate", async () => {
    const discovery = await discoveryForFactsV0_1(targetFirstAgentFixtureFactsV0_1({
      target: "pelar",
      targetGloss: "stableman, ostler, groom (especially mares)",
      targetSenseId: "en-pelar-sq-noun-RnBYACSN",
      base: "pelë",
      baseGloss: "mare",
      templateComponent: "-ar",
      templateExpansion: "pelë (“mare”) + -ar",
      sourceEtymologyText: "From pelë (“mare”) + -ar.",
    }), "pelar");
    expect(discovery.albanianLexicalReading).toMatchObject({
      relatedForms: [],
      sourceLinkedComparison: {
        status: "SUPPORTED",
        relation: { relation: "TARGET_AUTHORED_ETYMOLOGY_REFERENCE", referencedForm: "pelë", reference: "pelë#Albanian" },
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        functionalHypothesis: { functionalOperation: "AGENT" },
      },
      interpretation: { status: "EXPLORATORY_ZHEJI_READING" },
    });
  });

  it("keeps a non-human tool gloss containing maker without occupational authorization and ambiguous senses Null", async () => {
    const toolMaker = await discoveryForFactsV0_1(targetFirstAgentFixtureFactsV0_1({
      target: "qymyr-mjet",
      targetGloss: "a charcoal maker tool",
      targetSenseId: "tool-maker-sense",
      base: "qymyr",
      baseGloss: "coal",
      templateComponent: "mjet",
    }), "qymyr-mjet");
    expect(toolMaker.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(toolMaker.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
    expect(toolMaker.albanianLexicalReading?.relatedCandidateEvaluations[0]?.sourceRelation).toBe("TARGET_AUTHORED_ETYMOLOGY_REFERENCE");

    const ambiguous = await discoveryForFactsV0_1(targetFirstAgentFixtureFactsV0_1({
      target: "qymyrtar",
      targetGloss: "charcoal maker",
      targetSenseId: "en-qymyrtar-sq-noun-51rw1lY3",
      base: "qymyr",
      baseGloss: "coal",
      templateComponent: "tar",
      sourceOccupationCategory: true,
      otherTargetSense: { senseId: "qymyrtar-abstract-sense", gloss: "the state of being a maker" },
    }), "qymyrtar");
    expect(ambiguous.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(ambiguous.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
  });

  it("supports direct dritare through its exact target-authored Albanian reference without changing the queried word", async () => {
    const discovery = await discoveryForFactsV0_1(dritareTargetFirstFixtureFactsV0_1(), "dritare");
    const reading = discovery.albanianLexicalReading;

    expect(reading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=0",
        form: "dritare",
        meaningGlosses: expect.arrayContaining(["window", "access to the sea", "free time (between work hours or lessons)"]),
      },
      sourcePronunciation: { rawIpa: "/dɾiˈtaɾɛ/", status: "SUPPORTED", voicePath: ["I", "A", "E"] },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        relatedForm: "dritare",
        functionalHypothesis: expect.objectContaining({
          functionalOperation: "ENABLE_PASSAGE",
          statement: expect.stringContaining("models dritë as an enabling input and dritare as a structure"),
          basis: expect.arrayContaining(["SOURCE_AUTHORED_TRANSMISSION_EXPLANATION"]),
        }),
      },
      interpretation: { status: "EXPLORATORY_ZHEJI_READING" },
      composition: { status: "NULL" },
    });
    expect(reading?.relatedCandidateEvaluations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        relatedForm: "dritare",
        sourceRelation: "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
        sourceLinkedComparison: expect.objectContaining({
          status: "SUPPORTED",
          relation: expect.objectContaining({
            relation: "TARGET_AUTHORED_ETYMOLOGY_REFERENCE",
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
      }),
    ]));
    expect(reading?.functionalMeaningBridge.sourceFacts?.primary?.sourceSenses.map(({ senseId }) => senseId)).toEqual([
      "en-dritë-sq-noun-macCYXLU",
      "en-dritë-sq-noun-ssgdmJru",
      "en-dritë-sq-noun-r6wyfnNp",
    ]);
    expect(reading?.functionalMeaningBridge.sourceFacts?.related?.sourceSenses.map(({ senseId }) => senseId)).toEqual([
      "en-dritare-sq-noun-RP97AsgN",
      "en-dritare-sq-noun-~k6zu7Ra",
      "en-dritare-sq-noun-1Zl6eJVE",
      "en-dritare-sq-noun-CIjOT75H",
    ]);

    const vm = adaptAnalysisToTelemetryVM({
      motivationDiscoveryV0_1: { ...discovery, exactLexicalSourceFacts: undefined, sourceIpaSevenVoiceAnalyses: undefined },
    });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-reading-meaning")).toHaveTextContent("window");
      expect(screen.getByTestId("albanian-reading-voice-path")).toHaveTextContent("I → A → E");
      expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: ENABLE_PASSAGE");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("models dritë as an enabling input and dritare as a structure");
      expect(screen.getByTestId("albanian-reading-composition-null")).toHaveTextContent("Null");
      expect(screen.queryByTestId("albanian-source-linked-functional-hypothesis")).not.toBeInTheDocument();
      expect(screen.queryByText(/Component record resolution:/u)).not.toBeInTheDocument();
    }
  });

  it("keeps target-first passage Null for missing or foreign references and borrowed window controls", async () => {
    for (const [form, reference] of [
      ["dritare", null],
      ["dritare", "dritë#French"],
      ["finestër", "dritë#Italian"],
      ["fënjeshtër", "dritë#German"],
    ] as const) {
      const [target, base] = dritareTargetFirstFixtureFactsV0_1();
      const targetLinks = reference === null
        ? []
        : [{ sourceForm: "dritë", reference }];
      const queryTarget = {
        ...target,
        sourceRecordId: `kaikki-albanian-jsonl:word=${encodeURIComponent(form)}:ordinal=fixture`,
        entryLocator: `jsonl://word/${encodeURIComponent(form)}/match/fixture`,
        form,
        etymologyLinks: targetLinks,
      };
      const discovery = await discoveryForFactsV0_1([queryTarget, base], form);
      expect(discovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
        status: "NULL",
        functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
      });
      expect(discovery.albanianLexicalReading?.relatedCandidateEvaluations).toEqual([]);
      expect(discovery.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
    }

    const [target, base] = dritareTargetFirstFixtureFactsV0_1();
    const noExplanation = await discoveryForFactsV0_1([
      { ...target, etymologyText: null },
      base,
    ], "dritare");
    expect(noExplanation.albanianLexicalReading?.relatedCandidateEvaluations).toEqual([]);
    expect(noExplanation.albanianLexicalReading?.functionalMeaningBridge.functionalHypothesis.functionalOperation).toBeNull();
  });

  it("fails closed for negated transmission, conflicting base senses, duplicate source records, or missing IPA structure", async () => {
    const [target, base] = dritareTargetFirstFixtureFactsV0_1();
    const negated = await discoveryForFactsV0_1([{
      ...target,
      etymologyText: "From dritë (“light”) + -are (“-er”), meaning to not let light through.",
    }, base], "dritare");
    expect(negated.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
      reasonCodes: expect.arrayContaining(["SOURCE_LINKED_RELATION_NOT_SUPPORTED"]),
    });
    expect(negated.albanianLexicalReading?.relatedCandidateEvaluations).toEqual([]);

    const conflictingBase = await discoveryForFactsV0_1([target, {
      ...base,
      senses: [
        ...base.senses,
        { senseId: "en-dritë-sq-noun-conflict", glosses: ["clarity"] },
      ],
    }], "dritare");
    expect(conflictingBase.albanianLexicalReading?.functionalMeaningBridge.status).toBe("NULL");
    expect(conflictingBase.albanianLexicalReading?.functionalMeaningBridge.functionalHypothesis.functionalOperation).toBeNull();

    const duplicateBase = await discoveryForFactsV0_1([target, base, {
      ...base,
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=1",
      entryLocator: "jsonl://word/drit%C3%AB/match/1",
    }], "dritare");
    expect(duplicateBase.albanianLexicalReading?.relatedCandidateEvaluations).toEqual([]);
    expect(duplicateBase.albanianLexicalReading?.functionalMeaningBridge.status).toBe("NULL");

    const duplicateTarget = await discoveryForFactsV0_1([target, {
      ...target,
      sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=1",
      entryLocator: "jsonl://word/dritare/match/1",
    }, base], "dritare");
    expect(duplicateTarget.albanianLexicalReading?.relatedCandidateEvaluations).toEqual([]);
    expect(duplicateTarget.albanianLexicalReading?.functionalMeaningBridge.status).toBe("NULL");

    const missingStructure = await discoveryForFactsV0_1([
      { ...target, ipaObservations: [] },
      { ...base, ipaObservations: [] },
    ], "dritare");
    expect(missingStructure.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining(["DERIVED_STRUCTURE_NOT_SUPPORTED_FOR_BOTH_RECORDS"]),
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
  });

  it.each([
    ["gjitar", "noun", "mammal"],
    ["kombëtar", "adjective", "national"],
    ["gjueti", "noun", "hunting"],
  ] as const)("does not infer direct-input AGENT from the lexical shape of %s", async (form, partOfSpeech, gloss) => {
    const result = await discoveryForFactV0_1(fixtureFact({
      sourceRecordId: `kaikki-albanian-jsonl:word=${encodeURIComponent(form)}:ordinal=fixture`,
      entryLocator: `jsonl://word/${encodeURIComponent(form)}/match/fixture`,
      form,
      partOfSpeech,
      senses: [{ senseId: `${form}-sense-0`, glosses: [gloss] }],
      ipaObservations: [],
      relatedForms: [],
      etymologyLinks: [],
      etymologyTemplates: [],
    }), form);

    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      relatedForm: null,
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(result.albanianLexicalReading?.relatedCandidateEvaluations).toEqual([]);
    expect(result.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
  });

  it("keeps direct thëngjilltar Null when only target-side suffix wording is present", async () => {
    const target = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=th%C3%ABngjilltar:ordinal=fixture",
      entryLocator: "jsonl://word/th%C3%ABngjilltar/match/fixture",
      form: "thëngjilltar",
      partOfSpeech: "noun",
      senses: [{ senseId: "en-thëngjilltar-sq-noun-AMp0~85e", glosses: ["coal maker"] }],
      ipaObservations: [],
      relatedForms: [],
      etymologyText: "From thëngjill (“ember, coal”) + -tar (“agent noun suffix”).",
      etymologyLinks: [
        { sourceForm: "thëngjill", reference: "thëngjill#Albanian" },
        { sourceForm: "-tar", reference: "-tar#Albanian" },
      ],
      etymologyTemplates: [{
        name: "suffix",
        args: { "1": "sq", "2": "thëngjill", "3": "tar" },
        expansion: "thëngjill + -tar",
      }],
    });
    const provider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts: [target] });
    const query = jest.fn(provider.query);
    const result = await discoveryForProviderV0_1({ ...provider, query }, "thëngjilltar");

    expect(query.mock.calls.map(([form]) => form)).toEqual(["thëngjilltar"]);
    expect(result.albanianLexicalReading?.relatedForms).toEqual([]);
    expect(result.albanianLexicalReading?.relatedCandidateEvaluations).toEqual([]);
    expect(result.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(result.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
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

  it("preserves record and sense owners, duplicate links, missing IDs, and duplicate IDs", async () => {
    await withSyntheticSourceFileV0_1([
      {
        word: "owner-form",
        lang_code: "sq",
        pos: "noun",
        related: [{ word: "shared-form" }],
        senses: [
          { id: "owner-sense-0", glosses: ["first meaning"], related: [{ word: "shared-form" }], derived: [{ word: "shared-form" }] },
          { id: "owner-sense-1", glosses: ["second meaning"], related: [{ word: "shared-form" }] },
          { id: "duplicate-id", glosses: ["duplicate one"], derived: [{ word: "duplicate-target" }] },
          { id: "duplicate-id", glosses: ["duplicate two"], derived: [{ word: "duplicate-target" }] },
          { id: null, glosses: ["missing ID"], related: [{ word: "missing-target" }] },
        ],
        sounds: [],
      },
    ], async ({ provider }) => {
      const result = await provider.query("owner-form");
      expect(result).toMatchObject({
        status: "MATCHES_FOUND",
        facts: [{
          relatedForms: [
            {
              form: "shared-form",
              relation: "SOURCE_RELATED_FORM",
              sourceRelationAssertion: {
                assertionScope: "SOURCE_RECORD",
                sourceSenseId: null,
                sourceSenseOrdinal: null,
                sourceSenseIdentityStatus: "NOT_APPLICABLE",
                sourceAssertionOrdinal: 0,
                reasonCodes: [],
              },
            },
            {
              form: "shared-form",
              relation: "SOURCE_RELATED_FORM",
              sourceRelationAssertion: {
                assertionScope: "SOURCE_SENSE",
                sourceSenseId: "owner-sense-0",
                sourceSenseOrdinal: 0,
                sourceSenseIdentityStatus: "VERIFIED",
                sourceAssertionOrdinal: 0,
                reasonCodes: [],
              },
            },
            {
              form: "shared-form",
              relation: "SOURCE_RELATED_FORM",
              sourceRelationAssertion: {
                assertionScope: "SOURCE_SENSE",
                sourceSenseId: "owner-sense-1",
                sourceSenseOrdinal: 1,
                sourceSenseIdentityStatus: "VERIFIED",
                sourceAssertionOrdinal: 0,
                reasonCodes: [],
              },
            },
            {
              form: "missing-target",
              relation: "SOURCE_RELATED_FORM",
              sourceRelationAssertion: {
                assertionScope: "SOURCE_SENSE",
                sourceSenseId: null,
                sourceSenseOrdinal: 4,
                sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
                sourceAssertionOrdinal: 0,
                reasonCodes: ["SOURCE_SENSE_ID_MISSING"],
              },
            },
            {
              form: "shared-form",
              relation: "SOURCE_DERIVED_FORM",
              sourceRelationAssertion: {
                assertionScope: "SOURCE_SENSE",
                sourceSenseId: "owner-sense-0",
                sourceSenseOrdinal: 0,
                sourceSenseIdentityStatus: "VERIFIED",
                sourceAssertionOrdinal: 0,
                reasonCodes: [],
              },
            },
            {
              form: "duplicate-target",
              relation: "SOURCE_DERIVED_FORM",
              sourceRelationAssertion: {
                assertionScope: "SOURCE_SENSE",
                sourceSenseId: "duplicate-id",
                sourceSenseOrdinal: 2,
                sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
                sourceAssertionOrdinal: 0,
                reasonCodes: ["SOURCE_SENSE_ID_DUPLICATE"],
              },
            },
            {
              form: "duplicate-target",
              relation: "SOURCE_DERIVED_FORM",
              sourceRelationAssertion: {
                assertionScope: "SOURCE_SENSE",
                sourceSenseId: "duplicate-id",
                sourceSenseOrdinal: 3,
                sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
                sourceAssertionOrdinal: 0,
                reasonCodes: ["SOURCE_SENSE_ID_DUPLICATE"],
              },
            },
          ],
        }],
      });
    });
  });

  it("carries relation ownership through engine, adapter, and the existing source-evidence UI", async () => {
    const sourceSenseAssertion: AlbanianKaikkiSourceRelationAssertionV0_1 = {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: "owner-sense-1",
      sourceSenseOrdinal: 1,
      sourceSenseIdentityStatus: "VERIFIED",
      sourceAssertionOrdinal: 0,
      reasonCodes: [],
    };
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=owner-form:ordinal=0",
      entryLocator: "jsonl://word/owner-form/match/0",
      form: "owner-form",
      senses: [
        { senseId: "owner-sense-0", glosses: ["record sense"] },
        { senseId: "owner-sense-1", glosses: ["owning sense meaning"] },
      ],
      ipaObservations: [],
      relatedForms: [
        {
          form: "shared-form",
          relation: "SOURCE_RELATED_FORM",
          entryLocator: "jsonl://word/shared-form",
          sourceRelationAssertion: {
            assertionScope: "SOURCE_RECORD",
            sourceSenseId: null,
            sourceSenseOrdinal: null,
            sourceSenseIdentityStatus: "NOT_APPLICABLE",
            sourceAssertionOrdinal: 0,
            reasonCodes: [],
          },
        },
        {
          form: "shared-form",
          relation: "SOURCE_RELATED_FORM",
          entryLocator: "jsonl://word/shared-form",
          sourceRelationAssertion: sourceSenseAssertion,
        },
      ],
    });
    const discovery = await discoveryForFactsV0_1([primary], "owner-form");
    const reading = discovery.albanianLexicalReading;
    expect(reading?.relatedForms.map((relation) => relation.sourceRelationAssertion)).toEqual([
      primary.relatedForms?.[0]?.sourceRelationAssertion,
      sourceSenseAssertion,
    ]);
    expect(reading?.relatedCandidateEvaluations.map((candidate) => candidate.sourceRelationAssertion)).toEqual([
      primary.relatedForms?.[0]?.sourceRelationAssertion,
      sourceSenseAssertion,
    ]);
    expect(reading?.relatedCandidateEvaluations[0]).toMatchObject({
      resolution: "UNRESOLVED",
      sourceLinkedComparison: {
        status: "NULL",
        relation: { sourceRelationAssertion: primary.relatedForms?.[0]?.sourceRelationAssertion },
      },
      functionalMeaningBridge: { status: "NULL" },
    });
    expect(reading?.relatedCandidateEvaluations[1]?.sourceLinkedComparison.relation.sourceRelationAssertion).toEqual(sourceSenseAssertion);

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      const ownerLines = screen.getAllByTestId("albanian-source-relation-owner");
      expect(ownerLines[0]).toHaveTextContent("Assertion scope: SOURCE_RECORD");
      expect(ownerLines[0]).toHaveTextContent("no owning source sense is claimed");
      expect(ownerLines[1]).toHaveTextContent("Assertion scope: SOURCE_SENSE");
      expect(ownerLines[1]).toHaveTextContent("owner-sense-1");
      expect(ownerLines[1]).toHaveTextContent("ordinal: 1");
      expect(ownerLines[1]).toHaveTextContent("owning sense meaning");
    }
    cleanup();

    const forgedOwnerPayload = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const forgedReading = forgedOwnerPayload.albanianLexicalReading as Record<string, unknown>;
    const forgedRelated = forgedReading.relatedForms as Record<string, unknown>[];
    const forgedAssertion = forgedRelated[1]?.sourceRelationAssertion as Record<string, unknown>;
    forgedAssertion.sourceSenseOrdinal = 0;
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: forgedOwnerPayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const missingOwnerSensePayload = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const missingOwnerReading = missingOwnerSensePayload.albanianLexicalReading as Record<string, unknown>;
    const missingOwnerCandidates = missingOwnerReading.relatedCandidateEvaluations as Record<string, unknown>[];
    const missingOwnerComparison = missingOwnerCandidates[1]?.sourceLinkedComparison as Record<string, unknown>;
    const missingOwnerPrimary = missingOwnerComparison.primary as Record<string, unknown>;
    delete missingOwnerPrimary.sourceSenses;
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: missingOwnerSensePayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const wrongOwnerRecordPayload = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const wrongOwnerReading = wrongOwnerRecordPayload.albanianLexicalReading as Record<string, unknown>;
    const wrongOwnerCandidates = wrongOwnerReading.relatedCandidateEvaluations as Record<string, unknown>[];
    const wrongOwnerComparison = wrongOwnerCandidates[1]?.sourceLinkedComparison as Record<string, unknown>;
    const wrongOwnerPrimary = wrongOwnerComparison.primary as Record<string, unknown>;
    wrongOwnerPrimary.sourceRecordId = "kaikki-albanian-jsonl:word=other-record:ordinal=0";
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: wrongOwnerRecordPayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const mismatchedRelationPayload = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const mismatchedReading = mismatchedRelationPayload.albanianLexicalReading as Record<string, unknown>;
    const mismatchedCandidates = mismatchedReading.relatedCandidateEvaluations as Record<string, unknown>[];
    const secondCandidate = mismatchedCandidates[1];
    const secondComparison = secondCandidate?.sourceLinkedComparison as Record<string, unknown>;
    const secondRelation = secondComparison.relation as Record<string, unknown>;
    secondRelation.relation = "SOURCE_DERIVED_FORM";
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: mismatchedRelationPayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const reorderedLinksPayload = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const reorderedLinks = (reorderedLinksPayload.exactLexicalSourceFacts as Record<string, unknown>[])[0]?.relatedForms as unknown[];
    reorderedLinks.reverse();
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: reorderedLinksPayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const reorderedSensesPayload = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const reorderedSenses = (reorderedSensesPayload.exactLexicalSourceFacts as Record<string, unknown>[])[0]?.senses as unknown[];
    reorderedSenses.reverse();
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: reorderedSensesPayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });

    const alteredExactRelationPayload = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const alteredExactFacts = alteredExactRelationPayload.exactLexicalSourceFacts as Record<string, unknown>[];
    const alteredExactEdges = alteredExactFacts[0]?.relatedForms as Record<string, unknown>[];
    if (alteredExactEdges[1]) alteredExactEdges[1].relation = "SOURCE_DERIVED_FORM";
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: alteredExactRelationPayload }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it("accepts legacy target-first provenance omissions and duplicate unowned source links", async () => {
    const targetFirstDiscovery = await discoveryForFactsV0_1(
      malorEntityPropertyFixtureFactsV0_1(),
      "malor",
    );
    expect(targetFirstDiscovery.albanianLexicalReading?.relatedCandidateEvaluations).toEqual(
      expect.arrayContaining([expect.objectContaining({ sourceRelation: "SOURCE_DERIVED_FORM" })]),
    );
    expect(adaptAnalysisToTelemetryVM({
      motivationDiscoveryV0_1: legacyPayloadWithoutSenseOwnershipV0_1(targetFirstDiscovery),
    }).motivationDiscoveryV0_1).toMatchObject({ kind: "present" });

    const recordAssertion = (sourceAssertionOrdinal: number): AlbanianKaikkiSourceRelationAssertionV0_1 => ({
      assertionScope: "SOURCE_RECORD",
      sourceSenseId: null,
      sourceSenseOrdinal: null,
      sourceSenseIdentityStatus: "NOT_APPLICABLE",
      sourceAssertionOrdinal,
      reasonCodes: [],
    });
    const duplicateBaseFacts = malorEntityPropertyFixtureFactsV0_1({
      base: {
        relatedForms: [0, 1].map((sourceAssertionOrdinal) => ({
          form: "malor",
          relation: "SOURCE_DERIVED_FORM",
          entryLocator: "jsonl://word/malor",
          sourceRelationAssertion: recordAssertion(sourceAssertionOrdinal),
        })),
      },
    });
    const duplicateBaseDiscovery = await discoveryForFactsV0_1(duplicateBaseFacts, "mal");
    expect(duplicateBaseDiscovery.albanianLexicalReading?.relatedForms).toHaveLength(2);
    expect(duplicateBaseDiscovery.albanianLexicalReading?.sourceLinkedComparison?.relation.relation).toBe("SOURCE_DERIVED_FORM");
    expect(adaptAnalysisToTelemetryVM({
      motivationDiscoveryV0_1: duplicateBaseDiscovery,
    }).motivationDiscoveryV0_1).toMatchObject({ kind: "present" });

    const legacyDuplicateDiscovery = legacyPayloadWithoutSenseOwnershipV0_1(duplicateBaseDiscovery);
    const legacyReading = legacyDuplicateDiscovery.albanianLexicalReading;
    expect(legacyReading?.relatedForms).toHaveLength(2);
    expect(legacyReading?.sourceLinkedComparison?.relation.sourceRelationAssertion).toBeUndefined();
    expect(adaptAnalysisToTelemetryVM({
      motivationDiscoveryV0_1: legacyDuplicateDiscovery,
    }).motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
  });

  it("keeps duplicate and missing source-sense identities explicitly Unknown/Null at the adapter", async () => {
    const duplicateAssertion: AlbanianKaikkiSourceRelationAssertionV0_1 = {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: "duplicate-sense-id",
      sourceSenseOrdinal: 1,
      sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
      sourceAssertionOrdinal: 0,
      reasonCodes: ["SOURCE_SENSE_ID_DUPLICATE"],
    };
    const missingAssertion: AlbanianKaikkiSourceRelationAssertionV0_1 = {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: null,
      sourceSenseOrdinal: 2,
      sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
      sourceAssertionOrdinal: 0,
      reasonCodes: ["SOURCE_SENSE_ID_MISSING"],
    };
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=uncertain-owner:ordinal=0",
      entryLocator: "jsonl://word/uncertain-owner/match/0",
      form: "uncertain-owner",
      senses: [
        { senseId: "duplicate-sense-id", glosses: ["first duplicate"] },
        { senseId: "duplicate-sense-id", glosses: ["second duplicate"] },
        { senseId: null, glosses: ["unidentified sense"] },
      ],
      ipaObservations: [],
      relatedForms: [
        {
          form: "duplicate-target",
          relation: "SOURCE_RELATED_FORM",
          entryLocator: "jsonl://word/duplicate-target",
          sourceRelationAssertion: duplicateAssertion,
        },
        {
          form: "missing-id-target",
          relation: "SOURCE_DERIVED_FORM",
          entryLocator: "jsonl://word/missing-id-target",
          sourceRelationAssertion: missingAssertion,
        },
      ],
    });
    const discovery = await discoveryForFactsV0_1([primary], "uncertain-owner");
    expect(discovery.albanianLexicalReading?.relatedForms.map((relation) => relation.sourceRelationAssertion)).toEqual([
      duplicateAssertion,
      missingAssertion,
    ]);
    expect(discovery.albanianLexicalReading?.relatedCandidateEvaluations.every((candidate) =>
      candidate.functionalMeaningBridge.status === "NULL",
    )).toBe(true);
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery }).motivationDiscoveryV0_1).toMatchObject({
      kind: "present",
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

  it("exposes pelë → pelar as a source-bounded AGENT reading while keeping research authorization Null", async () => {
    const occupations = {
      name: "Occupations",
      kind: "other",
      parents: [],
      source: "w",
      orig: "sq:Occupations",
      langcode: "sq",
      _dis: null,
    };
    const facts = [
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=pel%C3%AB:ordinal=0",
        entryLocator: "jsonl://word/pel%C3%AB/match/0",
        physicalRecordOrdinal: 4275,
        form: "pelë",
        partOfSpeech: "noun",
        senses: [{ senseId: "en-pelë-sq-noun-B0ryv46E", glosses: ["mare"] }],
        ipaObservations: [{ soundIndex: 0, ipa: "[pɛːl]", tags: [] }],
        relatedForms: [{ form: "pelar", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/pelar" }],
      }),
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=pelar:ordinal=0",
        entryLocator: "jsonl://word/pelar/match/0",
        physicalRecordOrdinal: 1596,
        form: "pelar",
        partOfSpeech: "noun",
        senses: [{ senseId: "en-pelar-sq-noun-RnBYACSN", glosses: ["stableman, ostler, groom (especially mares)"] }],
        ipaObservations: [{ soundIndex: 0, ipa: "/peˈlar/", tags: [] }],
        etymologyText: "From pelë (“mare”) + -ar.",
        etymologyLinks: [
          { sourceForm: "pelë", reference: "pelë#Albanian" },
          { sourceForm: "-ar", reference: "-ar#Albanian" },
        ],
      }),
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=th%C3%ABngjill:ordinal=0",
        entryLocator: "jsonl://word/th%C3%ABngjill/match/0",
        physicalRecordOrdinal: 6419,
        form: "thëngjill",
        partOfSpeech: "noun",
        senses: [{ senseId: "en-thëngjill-sq-noun-K~rhJi0l", glosses: ["coal, charcoal"] }],
        ipaObservations: [],
        relatedForms: [{ form: "thëngjilltar", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/th%C3%ABngjilltar" }],
      }),
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=th%C3%ABngjilltar:ordinal=0",
        entryLocator: "jsonl://word/th%C3%ABngjilltar/match/0",
        physicalRecordOrdinal: 12090,
        form: "thëngjilltar",
        partOfSpeech: "noun",
        senses: [{ senseId: "en-thëngjilltar-sq-noun-AMp0~85e", glosses: ["coal maker"] }],
        ipaObservations: [{ soundIndex: 0, ipa: "/θənɟiɫˈtaɾ/", tags: [] }],
        etymologyLinks: [
          { sourceForm: "thëngjill", reference: "thëngjill#Albanian" },
          { sourceForm: "-tar", reference: "-tar#Albanian" },
        ],
      }),
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=blet%C3%AB:ordinal=0",
        entryLocator: "jsonl://word/blet%C3%AB/match/0",
        physicalRecordOrdinal: 2379,
        form: "bletë",
        partOfSpeech: "noun",
        senses: [{ senseId: "en-bletë-sq-noun-fixture", glosses: ["bee"] }],
        ipaObservations: [],
        relatedForms: [{ form: "bletar", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/bletar" }],
      }),
      fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=bletar:ordinal=0",
        entryLocator: "jsonl://word/bletar/match/0",
        physicalRecordOrdinal: 3973,
        form: "bletar",
        partOfSpeech: "noun",
        senses: [{ senseId: "en-bletar-sq-noun-KI12VIJ3", glosses: ["beekeeper"], categories: [occupations] }],
        ipaObservations: [],
        etymologyLinks: [{ sourceForm: "bletë", reference: "bletë#Albanian" }],
      }),
    ];

    const peleDiscovery = await discoveryForFactsV0_1(facts, "pelë");
    const peleReading = peleDiscovery.albanianLexicalReading;
    expect(peleReading?.relatedCandidateEvaluations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        relatedForm: "pelar",
        sourceRelation: "SOURCE_DERIVED_FORM",
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
            status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
            functionalOperation: "AGENT",
            basis: [
              "SOURCE_ATTESTED_PRIMARY_MEANING",
              "SOURCE_ATTESTED_AGENT_MEANING",
              "SOURCE_DERIVED_FORM_LINK",
            ],
            statement: expect.stringContaining("stableman, ostler, groom (especially mares)"),
          }),
        }),
      }),
    ]));
    expect(peleReading).toMatchObject({
      sourcePronunciation: { rawIpa: "[pɛːl]", status: "SUPPORTED", voicePath: ["E"] },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        relatedForm: "pelar",
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
    const pelarCandidate = peleReading?.occupationalRoleResearchCandidates?.candidates.find((candidate) => candidate.sourceRecord.lemma === "pelar");
    expect(pelarCandidate).toMatchObject({
      senseId: "en-pelar-sq-noun-RnBYACSN",
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED",
      researchHypothesis: {
        hypothesisStatus: "PROPOSED_NOT_REVIEWED",
        reviewTrack: "NONE",
        reviewCandidate: null,
        ownerApproval: null,
      },
      ontology: { status: "TYPED_WORKER_PATHS_OBSERVED" },
    });

    const coalDiscovery = await discoveryForFactsV0_1(facts, "thëngjill");
    const coalCandidate = coalDiscovery.albanianLexicalReading?.occupationalRoleResearchCandidates?.candidates.find((candidate) => candidate.sourceRecord.lemma === "thëngjilltar");
    expect(coalCandidate).toMatchObject({
      senseId: "en-thëngjilltar-sq-noun-AMp0~85e",
      ontology: { status: "EXACT_GLOSS_SENSES_NOT_FOUND", senses: [] },
      functionalOperation: null,
      productionAuthorization: "NOT_AUTHORIZED",
      researchHypothesis: { hypothesisStatus: "PROPOSED_NOT_REVIEWED", ownerApproval: null },
    });

    const bletëDiscovery = await discoveryForFactsV0_1(facts, "bletë");
    expect(bletëDiscovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "SUPPORTED",
      relatedForm: "bletar",
      functionalHypothesis: { functionalOperation: "AGENT" },
    });
    expect(bletëDiscovery.albanianLexicalReading?.relatedCandidateEvaluations).toEqual(expect.arrayContaining([
      expect.objectContaining({
        relatedForm: "bletar",
        functionalMeaningBridge: expect.objectContaining({
          status: "SUPPORTED",
          functionalHypothesis: expect.objectContaining({ functionalOperation: "AGENT" }),
        }),
      }),
    ]));
    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: peleDiscovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-reading-related-form")).toHaveTextContent("pelar");
      expect(screen.getByTestId("albanian-reading-voice-path")).toHaveTextContent("E");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("Source-bounded functional operation AGENT");
      expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
      expect(screen.getByTestId("albanian-reading-interpretation")).toHaveTextContent("Integrated source-bounded functional reading");
      expect(screen.getByTestId("albanian-reading-interpretation")).toHaveTextContent("independent functional meaning for any structural embryo remains Unknown / Null");
      const batch = screen.getByTestId("albanian-occupational-role-research-candidates");
      expect(batch).toHaveTextContent("stableman, ostler, groom (especially mares)");
      expect(batch).toHaveTextContent("TYPED_WORKER_PATHS_OBSERVED");
      expect(batch).toHaveTextContent("Functional operation: Null");
      expect(batch).toHaveTextContent("NOT_AUTHORIZED");
      expect(batch).toHaveTextContent("UNKNOWN_OR_NULL");
      expect(batch).toHaveTextContent("CC BY-SA 4.0");
      expect(batch).toHaveTextContent("CC BY 4.0");
    }

    const foreignReferenceDiscovery = JSON.parse(JSON.stringify(peleDiscovery)) as typeof peleDiscovery;
    const foreignReferenceCandidate = foreignReferenceDiscovery.albanianLexicalReading?.occupationalRoleResearchCandidates?.candidates
      .find((candidate) => candidate.sourceRecord.lemma === "pelar");
    if (!foreignReferenceCandidate) throw new Error("Expected pelar candidate fixture");
    (foreignReferenceCandidate.sourceRecord.etymologyLinks as unknown as Array<{
      form: string;
      reference: string;
      direction: "TARGET_RECORD_REFERENCES_SOURCE_FORM";
      resolution: "SOURCE_ROWS_FOUND" | "SOURCE_ROW_NOT_FOUND" | "REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN";
      resolvedSourceRows: unknown[];
    }>).push({
      form: "jaguar",
      reference: "jaguar#Portuguese",
      direction: "TARGET_RECORD_REFERENCES_SOURCE_FORM",
      resolution: "REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN",
      resolvedSourceRows: [],
    });
    const foreignReferenceVm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: foreignReferenceDiscovery });
    expect(foreignReferenceVm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    cleanup();
    if (foreignReferenceVm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: foreignReferenceVm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-occupational-role-research-candidates"))
        .toHaveTextContent("REFERENCE_LANGUAGE_NOT_EXPLICITLY_ALBANIAN");
    }

    const tampered = JSON.parse(JSON.stringify(peleDiscovery)) as {
      albanianLexicalReading: {
        occupationalRoleResearchCandidates: {
          candidates: Array<{ sourceRecord: { lemma: string }; functionalOperation: null | "AGENT" }>;
        };
      };
    };
    const tamperedPelar = tampered.albanianLexicalReading.occupationalRoleResearchCandidates.candidates
      .find((candidate) => candidate.sourceRecord.lemma === "pelar");
    if (tamperedPelar) tamperedPelar.functionalOperation = "AGENT";
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: tampered }).motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
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

  it("supports direct malor through the exact base-attested noun-to-adjective path and preserves the queried target", async () => {
    const discovery = await discoveryForFactsV0_1(malorEntityPropertyFixtureFactsV0_1(), "malor");
    const reading = discovery.albanianLexicalReading;
    expect(reading?.status).toBe("SUPPORTED");
    expect(reading?.primarySourceFact).toMatchObject({
      sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      form: "malor",
      partOfSpeech: "adj",
      meaningGlosses: ["mountainous"],
    });
    expect(reading?.sourcePronunciation).toBeNull();
    expect(reading?.relatedForms).toEqual([]);
    const candidate = reading?.relatedCandidateEvaluations.find((item) => item.relatedForm === "malor");
    expect(candidate?.sourceRelation).toBe("SOURCE_DERIVED_FORM");
    expect(candidate?.resolution).toBe("RESOLVED");
    expect(candidate?.sourceLinkedComparison.status).toBe("SUPPORTED");
    expect(candidate?.sourceLinkedComparison.relation).toMatchObject({
      relation: "SOURCE_DERIVED_FORM",
      primarySourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=0",
      relatedSourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=0",
      direction: "RELATED_FORM_TO_PRIMARY_ETYMLOGY_REFERENCE",
      referencedForm: "mal",
      reference: "mal#Albanian",
    });
    expect(candidate?.functionalMeaningBridge.status).toBe("SUPPORTED");
    expect(candidate?.functionalMeaningBridge.sourceFacts.primary.form).toBe("mal");
    expect(candidate?.functionalMeaningBridge.sourceFacts.related.form).toBe("malor");
    expect(candidate?.functionalMeaningBridge.derivedStructure).toBeNull();
    expect(candidate?.functionalMeaningBridge.functionalHypothesis).toMatchObject({
      functionalOperation: null,
      statement: expect.stringContaining("entity → attributed property"),
      basis: expect.arrayContaining([
        "SOURCE_ATTESTED_PRIMARY_MEANING",
        "SOURCE_ATTESTED_PROPERTY_MEANING",
        "SOURCE_AUTHORED_SUFFIX_EXPLANATION",
        "SOURCE_STRUCTURED_FORM_REFERENCE",
      ]),
    });
    expect(reading?.functionalMeaningBridge.status).toBe("SUPPORTED");
    expect(reading?.functionalMeaningBridge.functionalHypothesis.functionalOperation).toBeNull();
    expect(reading?.interpretation.status).toBe("EXPLORATORY_ZHEJI_READING");
    expect(reading?.composition.status).toBe("NULL");
    expect(reading?.interpretation.statement).toContain("malor");
    expect(reading?.functionalMeaningBridge.functionalHypothesis.statement).toContain("mountainous");

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-lexical-reading")).toHaveTextContent("malor");
      expect(screen.getByTestId("albanian-reading-meaning")).toHaveTextContent("mountainous");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("entity → attributed property");
      expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: none classified");
      expect(screen.getByTestId("albanian-reading-related-candidate")).toHaveTextContent("SOURCE_DERIVED_FORM");
      expect(screen.getByTestId("albanian-reading-functional-bridge-derived-structure-null")).toHaveTextContent("Null");
      expect(screen.getByTestId("albanian-reading-composition-null")).toHaveTextContent("Null");
      expect(screen.getByTestId("albanian-source-linked-comparison")).toHaveTextContent("mal#Albanian");
    }
  });

  it.each([
    ["missing base-authored derived-form edge", { base: { relatedForms: [] } }],
    ["non-derived base relation", {
      base: { relatedForms: [{ form: "malor", relation: "SOURCE_RELATED_FORM" as const, entryLocator: "jsonl://word/malor" }] },
    }],
    ["duplicate base relation", {
      base: { relatedForms: [
        { form: "malor", relation: "SOURCE_DERIVED_FORM" as const, entryLocator: "jsonl://word/malor" },
        { form: "malor", relation: "SOURCE_DERIVED_FORM" as const, entryLocator: "jsonl://word/malor" },
      ] },
    }],
    ["foreign target reference", {
      target: { etymologyLinks: [{ sourceForm: "mal", reference: "mal#French" }, { sourceForm: "-or", reference: "-or#Albanian" }] },
    }],
    ["missing affix reference", {
      target: { etymologyLinks: [{ sourceForm: "mal", reference: "mal#Albanian" }] },
    }],
    ["source explanation conflicts with the template", {
      target: { etymologyText: "Not from mal + -or." },
    }],
    ["base link points to a different target locator", {
      base: { relatedForms: [{ form: "malor", relation: "SOURCE_DERIVED_FORM" as const, entryLocator: "jsonl://word/malësor" }] },
    }],
    ["mismatched suffix template", {
      target: {
        etymologyText: "From mal + -tar.",
        etymologyTemplates: [{ name: "suffix", args: { "1": "sq", "2": "mal", "3": "-tar" }, expansion: "mal + -tar" }],
      },
    }],
    ["incompatible target POS", { target: { partOfSpeech: "noun" } }],
    ["missing target meaning", { target: { senses: [{ senseId: "malor-empty-fixture", glosses: [] }] } }],
    ["missing target sense identity", { target: { senses: [{ senseId: "", glosses: ["mountainous"] }] } }],
    ["ambiguous target senses", {
      target: { senses: [
        { senseId: "malor-mountainous-fixture", glosses: ["mountainous"] },
        { senseId: "malor-other-fixture", glosses: ["unrelated meaning"] },
      ] },
    }],
    ["ambiguous base records", {
      additionalFacts: [fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=mal:ordinal=1",
        entryLocator: "jsonl://word/mal/match/1",
        form: "mal",
        partOfSpeech: "noun",
        senses: [{ senseId: "mal-alt-fixture", glosses: ["forest"] }],
      })],
    }],
    ["ambiguous target record identity", {
      additionalFacts: [fixtureFact({
        sourceRecordId: "kaikki-albanian-jsonl:word=malor:ordinal=1",
        entryLocator: "jsonl://word/malor/match/1",
        form: "malor",
        partOfSpeech: "adj",
        senses: [{ senseId: "malor-alt-fixture", glosses: ["mountain-like"] }],
      })],
    }],
  ] as const)("keeps direct malor Null for %s", async (_label, overrides) => {
    const discovery = await discoveryForFactsV0_1(
      malorEntityPropertyFixtureFactsV0_1(overrides),
      "malor",
    );
    expect(discovery.albanianLexicalReading?.primarySourceFact?.form).toBe("malor");
    expect(discovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(discovery.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
  });

  it("keeps direct malor Null when the source provider fails to resolve mal", async () => {
    const facts = malorEntityPropertyFixtureFactsV0_1();
    const baseProvider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts });
    const provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 = {
      ...baseProvider,
      query: async (query) => query === "mal"
        ? {
            status: "UNAVAILABLE",
            queryForm: "mal",
            facts: [],
            reasonCode: "ALBANIAN_SOURCE_READ_FAILURE",
          }
        : baseProvider.query(query),
    };
    const discovery = await discoveryForProviderV0_1(provider, "malor");
    expect(discovery.albanianLexicalReading?.primarySourceFact?.form).toBe("malor");
    expect(discovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(discovery.albanianLexicalReading?.interpretation.status).toBe("UNKNOWN_OR_NULL");
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

  it("activates a sense-bound target-authored suffix interpretation without relabeling the base relation", async () => {
    const discovery = await discoveryForFactsV0_1(shkenceScientistFixtureFactsV0_1(), "shkencë");
    const reading = discovery.albanianLexicalReading;
    const candidate = reading?.relatedCandidateEvaluations.find((item) => item.relatedForm === "shkencëtar");
    expect(candidate).toMatchObject({
      sourceRelation: "SOURCE_RELATED_FORM",
      resolution: "RESOLVED",
      sourceLinkedComparison: {
        status: "SUPPORTED",
        relation: {
          relation: "SOURCE_RELATED_FORM",
          primarySourceRecordId: "kaikki-albanian-jsonl:word=shkenc%C3%AB:ordinal=fixture",
          relatedSourceRecordId: "kaikki-albanian-jsonl:word=shkenc%C3%ABtar:ordinal=fixture",
          referencedForm: "shkencë",
          reference: "shkencë#Albanian",
        },
        related: {
          sourceSenses: [{ senseId: "shkencetar-scientist-fixture", glosses: ["scientist"] }],
          etymologyTemplates: [{ name: "suffix", args: { "1": "sq", "2": "shkencë", "3": "tar" }, expansion: "shkencë + -tar" }],
        },
      },
      functionalMeaningBridge: {
        status: "SUPPORTED",
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: "AGENT",
          basis: expect.arrayContaining([
            "SOURCE_RELATED_FORM_LINK",
            "TARGET_SOURCE_AUTHORED_SUFFIX_TEMPLATE",
            "SOURCE_STRUCTURED_ALBANIAN_REFERENCE",
            "SOURCE_ATTESTED_FINAL_SENSE_CATEGORY",
          ]),
        },
      },
    });
    expect(candidate?.functionalMeaningBridge.functionalHypothesis.statement).toContain("not as a base-side derived-form link");
    expect(candidate?.sourceLinkedComparison.related?.sourceSenses[0]?.senseId).toBe("shkencetar-scientist-fixture");
    expect(candidate?.functionalMeaningBridge.functionalHypothesis.basis).not.toContain("SOURCE_DERIVED_FORM_LINK");
    expect(candidate?.functionalMeaningBridge.derivedStructure).toBeNull();
    expect(reading?.interpretation).toMatchObject({ status: "EXPLORATORY_ZHEJI_READING" });
    expect(reading?.interpretation.statement).toContain("AGENT");

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind !== "present") throw new Error("Expected the additive API adapter projection");
    render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
    expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("AGENT");
    expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
    expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("SOURCE_RELATED_FORM");
    const sourceSenseEvidenceText = screen.getAllByTestId("albanian-reading-source-sense-evidence").map((node) => node.textContent).join(" ");
    expect(sourceSenseEvidenceText).toContain("shkencetar-scientist-fixture");
    expect(sourceSenseEvidenceText).toContain("Occupations (sq:Occupations; sq; w)");
    const targetTemplateEvidenceText = screen.getAllByTestId("albanian-reading-target-source-template").map((node) => node.textContent).join(" ");
    expect(targetTemplateEvidenceText).toContain("suffix(1=sq, 2=shkencë, 3=tar) → shkencë + -tar");
    expect(targetTemplateEvidenceText).toContain("not independent morphology proof");
    expect(screen.getByTestId("albanian-source-linked-comparison")).toHaveTextContent("Linked source record: shkencëtar");
    expect(screen.getByTestId("albanian-source-linked-comparison")).toHaveTextContent("IPA variants: Null");
    expect(screen.getByTestId("albanian-functional-meaning-bridge")).toHaveTextContent("Null — source IPA is unavailable for one or both records");
    cleanup();
  });

  it.each([
    ["missing target suffix template", { etymologyTemplates: [] }],
    ["template does not identify the queried base", {
      etymologyText: "From scienza + -tar.",
      etymologyTemplates: [{ name: "suffix", args: { "1": "sq", "2": "scienza", "3": "tar" }, expansion: "scienza + -tar" }],
    }],
    ["non-authoritative category", {
      senses: [{ senseId: "shkencetar-scientist-fixture", glosses: ["scientist"], categories: [{
        name: "Occupations", kind: null, parents: [], source: "w+disamb", orig: "sq:Occupations", langcode: "sq", _dis: null,
      }] }],
    }],
    ["multiple final lexical senses", {
      senses: [
        { senseId: "shkencetar-scientist-fixture", glosses: ["scientist"], categories: [{
          name: "Occupations", kind: null, parents: [], source: "w", orig: "sq:Occupations", langcode: "sq", _dis: null,
        }] },
        { senseId: "shkencetar-abstract-fixture", glosses: ["the state of being a scientist"] },
      ],
    }],
    ["foreign-language target reference", {
      etymologyLinks: [{ sourceForm: "shkencë", reference: "shkencë#Ottoman_Turkish" }],
    }],
    ["source explanation conflicts with template", { etymologyText: "Not from shkencë + -tar." }],
  ] as const)("keeps a target-side AGENT Null for %s", async (_label, targetOverrides) => {
    const discovery = await discoveryForFactsV0_1(
      shkenceScientistFixtureFactsV0_1(targetOverrides as Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>),
      "shkencë",
    );
    const candidate = discovery.albanianLexicalReading?.relatedCandidateEvaluations.find((item) => item.relatedForm === "shkencëtar");
    expect(candidate?.sourceRelation).toBe("SOURCE_RELATED_FORM");
    expect(candidate?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null },
    });
    expect(candidate?.functionalMeaningBridge.functionalHypothesis.statement).toBeNull();
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

  it("projects an ordered source-qualified AGENT family through the engine, adapter, and UI without changing the selected bridge or Null", async () => {
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word: "shitës",
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: await analysisFor("shitës"),
      heart: buildHeartInstrumentV1("shitës"),
      albanianLexicalSourceProvider: createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts: sellerFamilyFixtureFactsV0_1() }),
    });
    const reading = result.discovery.albanianLexicalReading;
    expect(reading?.functionalMeaningBridge).toMatchObject({ relatedForm: "luleshitës", status: "SUPPORTED" });
    expect(reading?.relatedCandidateEvaluations.at(-1)).toMatchObject({
      relatedForm: "missing-shitës",
      resolution: "UNRESOLVED",
      functionalMeaningBridge: { status: "NULL", functionalHypothesis: { functionalOperation: null } },
    });
    expect(reading?.functionalFamilyReading).toMatchObject({
      status: "EXPLORATORY_FUNCTIONAL_FAMILY",
      functionalOperation: "AGENT",
      primary: { form: "shitës", senseId: "shites-seller-fixture", meaningGlosses: ["seller, vendor"] },
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    });
    expect(reading?.functionalFamilyReading?.members.map((member) => member.form)).toEqual([
      "luleshitës", "pijeshitës", "rakishitës",
    ]);
    expect(reading?.functionalFamilyReading?.members.map((member) => member.senseId)).toEqual([
      "luleshitës-sense-fixture", "pijeshitës-sense-fixture", "rakishitës-sense-fixture",
    ]);
    expect(reading?.functionalFamilyReading?.members.every((member) =>
      member.sourceRelation === "SOURCE_DERIVED_FORM" &&
      member.sourceComparisonStatus === "SUPPORTED" &&
      member.functionalBridgeStatus === "SUPPORTED" &&
      member.evidenceBasis.includes("SOURCE_DERIVED_FORM_LINK"),
    )).toBe(true);
    expect(reading?.functionalFamilyReading?.statement).toContain("frozen Kaikki");
    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: {
      ...result.discovery,
      exactLexicalSourceFacts: undefined,
      sourceIpaSevenVoiceAnalyses: undefined,
    } });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      const section = screen.getByTestId("albanian-functional-family-reading");
      expect(section).toHaveTextContent("shitës");
      expect(section).toHaveTextContent("flower seller");
      expect(section).toHaveTextContent("drinks seller");
      expect(section).toHaveTextContent("brandy seller");
      expect(section).toHaveTextContent("Same frozen Kaikki source");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("luleshitës");
      expect(screen.getByTestId("albanian-reading-null-candidate")).toHaveTextContent("missing-shitës");
      cleanup();
    }

    const cloneDiscovery = () => JSON.parse(JSON.stringify(result.discovery)) as Record<string, unknown>;
    const familyOf = (discovery: Record<string, unknown>) =>
      (discovery.albanianLexicalReading as Record<string, unknown>).functionalFamilyReading as Record<string, unknown>;
    const candidatesOf = (discovery: Record<string, unknown>) =>
      (discovery.albanianLexicalReading as Record<string, unknown>).relatedCandidateEvaluations as Record<string, unknown>[];
    const familyMembersOf = (discovery: Record<string, unknown>) => familyOf(discovery).members as Record<string, unknown>[];

    const capitalizationVariant = cloneDiscovery();
    candidatesOf(capitalizationVariant).find((candidate) => candidate.relatedForm === "luleshitës")!.relatedForm = "LULESHITËS";
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: capitalizationVariant }).motivationDiscoveryV0_1)
      .toMatchObject({ kind: "present" });

    const unicodeVariant = cloneDiscovery();
    candidatesOf(unicodeVariant).find((candidate) => candidate.relatedForm === "luleshitës")!.relatedForm = "luleshitës".normalize("NFD");
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: unicodeVariant }).motivationDiscoveryV0_1)
      .toMatchObject({ kind: "present" });

    const normalizedDuplicate = cloneDiscovery();
    familyMembersOf(normalizedDuplicate).push({
      ...familyMembersOf(normalizedDuplicate)[0]!,
      form: "LULESHITËS".normalize("NFD"),
    });
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: normalizedDuplicate }).motivationDiscoveryV0_1)
      .toMatchObject({ kind: "missing", missing: "malformed" });
  });

  it.each([
    ["one related form", (facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]) => {
      const [primary, first] = facts;
      return [{ ...primary!, relatedForms: [primary!.relatedForms![0]!] }, first!];
    }],
    ["one supported and one unresolved", (facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]) => {
      const [primary, first] = facts;
      return [{ ...primary!, relatedForms: [primary!.relatedForms![0]!, primary!.relatedForms![3]!] }, first!];
    }],
    ["duplicate target form", (facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]) => {
      const [primary, first] = facts;
      return [{ ...primary!, relatedForms: [primary!.relatedForms![0]!, primary!.relatedForms![0]!] }, first!];
    }],
    ["unanchored source link", (facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]) => {
      const [primary, first, second] = facts;
      return [primary!, first!, { ...second!, etymologyLinks: [] }];
    }],
    ["ambiguous target senses", (facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]) => {
      const [primary, first, second] = facts;
      return [primary!, first!, { ...second!, senses: [...second!.senses, { senseId: "other", glosses: ["other sense"] }] }];
    }],
    ["missing target meaning", (facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]) => {
      const [primary, first, second] = facts;
      return [primary!, first!, { ...second!, senses: [{ senseId: "no-meaning", glosses: [] }] }];
    }],
    ["duplicate primary noun records", (facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[]) => {
      return [...facts, { ...facts[0]!, sourceRecordId: "second-primary-noun", entryLocator: "jsonl://word/shit%C3%ABs/match/second" }];
    }],
  ] as const)("keeps the functional family Null for %s", async (_label, alter) => {
    const reading = (await discoveryForFactsV0_1(alter(sellerFamilyFixtureFactsV0_1()), "shitës")).albanianLexicalReading;
    expect(reading?.functionalFamilyReading).toBeNull();
  });

  it("keeps a mixed-operation derived-form set out of the AGENT family", async () => {
    const [primary, first, second] = sellerFamilyFixtureFactsV0_1();
    const primaryLight = fixtureFact({
      ...primary!, form: "dritë",
      sourceRecordId: "kaikki-albanian-jsonl:word=drit%C3%AB:ordinal=fixture",
      entryLocator: "jsonl://word/drit%C3%AB/match/fixture",
      senses: [{ senseId: "light-sense", glosses: ["light", "daylight"] }],
      ipaObservations: [{ soundIndex: 0, ipa: "/dritə/", tags: [] }],
      relatedForms: [
        { form: "dritare", relation: "SOURCE_DERIVED_FORM", entryLocator: "jsonl://word/dritare" },
        primary!.relatedForms![0]!, primary!.relatedForms![1]!,
      ],
    });
    const relinked = [first!, second!].map((fact) => ({
      ...fact, etymologyLinks: [{ sourceForm: "dritë", reference: "dritë#Albanian" }],
    }));
    const window = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=dritare:ordinal=fixture",
      entryLocator: "jsonl://word/dritare/match/fixture",
      form: "dritare",
      senses: [{ senseId: "window-sense", glosses: ["window, opening"] }],
      etymologyText: "A window lets light through.",
      etymologyLinks: [{ sourceForm: "dritë", reference: "dritë#Albanian" }],
      ipaObservations: [{ soundIndex: 0, ipa: "/dritare/", tags: [] }],
    });
    const reading = (await discoveryForFactsV0_1([primaryLight, window, ...relinked], "dritë")).albanianLexicalReading;
    expect(reading?.relatedCandidateEvaluations[0]?.functionalMeaningBridge.functionalHypothesis.functionalOperation).toBe("ENABLE_PASSAGE");
    expect(reading?.relatedCandidateEvaluations.slice(1).map((item) => item.functionalMeaningBridge.functionalHypothesis.functionalOperation)).toEqual(["AGENT", "AGENT"]);
    expect(reading?.functionalFamilyReading).toBeNull();
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

  it("renders a source-qualified three-component functional hypothesis without selecting senses or classifying an operation", async () => {
    const discovery = await discoveryForFactsV0_1(zjarrfikesThreeComponentFixtureFactsV0_1(), "zjarrfikës");
    const reading = discovery.albanianLexicalReading;

    expect(reading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId: "kaikki-albanian-jsonl:word=zjarrfik%C3%ABs:ordinal=0",
        form: "zjarrfikës",
        partOfSpeech: "noun",
        meaningGlosses: ["firefighter", "fireman"],
      },
      sourcePronunciation: null,
      sourceLinkedComponentReading: {
        status: "SUPPORTED",
        relation: {
          relation: "SOURCE_EXPLICIT_THREE_COMPONENT_COMPOUND",
          primarySourceRecordId: "kaikki-albanian-jsonl:word=zjarrfik%C3%ABs:ordinal=0",
          references: [
            { sourceForm: "zjarr", reference: "zjarr#Albanian" },
            { sourceForm: "fik", reference: "fik#Albanian" },
            { sourceForm: "-ës", reference: "-ës#Albanian" },
          ],
        },
        componentResolutions: [
          { sourceForm: "zjarr", status: "RESOLVED", sourceRecordIds: ["kaikki-albanian-jsonl:word=zjarr:ordinal=0"] },
          {
            sourceForm: "fik",
            status: "AMBIGUOUS",
            sourceRecordIds: ["kaikki-albanian-jsonl:word=fik:ordinal=0", "kaikki-albanian-jsonl:word=fik:ordinal=1"],
          },
          { sourceForm: "-ës", status: "RESOLVED", sourceRecordIds: ["kaikki-albanian-jsonl:word=-%C3%ABs:ordinal=0"] },
        ],
        components: [
          { sourceRecordId: "kaikki-albanian-jsonl:word=zjarr:ordinal=0", partOfSpeech: "noun" },
          { sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=0", partOfSpeech: "noun", sourceSenses: [{ senseId: "en-fik-sq-noun-jDnGNIgm", glosses: ["fig"] }] },
          {
            sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=1",
            partOfSpeech: "verb",
            sourceSenses: [
              { senseId: "en-fik-sq-verb-3UhMn1WK", glosses: ["to extinguish (fire)"] },
              { senseId: "en-fik-sq-verb-j~6gALfc", glosses: ["to switch off, turn off"] },
              { senseId: "en-fik-sq-verb-JbZbl6zi", glosses: ["to bring misfortune, ruin, destroy"] },
            ],
          },
          { sourceRecordId: "kaikki-albanian-jsonl:word=-%C3%ABs:ordinal=0", partOfSpeech: "suffix" },
        ],
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: null,
          basis: expect.arrayContaining([
            "SOURCE_AUTHORED_THREE_COMPONENT_COMPOUND",
            "SOURCE_SUFFIX_SENSE_DESCRIBES_AGENT_NOUN_FORMATION",
            "TARGET_SOURCE_SENSE_HAS_SQ_OCCUPATIONS_CATEGORY",
          ]),
        },
      },
      functionalMeaningBridge: { status: "NULL" },
      composition: { status: "NULL", interpretation: { status: "UNKNOWN_OR_NULL", statement: null } },
      interpretation: { status: "UNKNOWN_OR_NULL", statement: null },
    });

    const hypothesis = reading?.sourceLinkedComponentReading?.functionalHypothesis;
    expect(hypothesis?.statement).toContain("source-grounded object/action/role hypothesis");
    expect(hypothesis?.statement).toContain("no component sense is aligned to a target sense");
    expect(hypothesis?.alternatives).toEqual(expect.arrayContaining([
      expect.stringContaining("en-fik-sq-noun-jDnGNIgm: fig"),
      expect.stringContaining("en-fik-sq-verb-3UhMn1WK: to extinguish (fire)"),
      expect.stringContaining("en-fik-sq-verb-j~6gALfc: to switch off, turn off"),
      expect.stringContaining("en-fik-sq-verb-JbZbl6zi: to bring misfortune, ruin, destroy"),
      expect.stringContaining("en-zjarrfikës-sq-noun-P9hAbGCJ: firefighter"),
      expect.stringContaining("en-zjarrfikës-sq-noun-3IRd5pZ-: fireman"),
    ]));

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      const card = screen.getByTestId("albanian-source-linked-component-reading");
      const hypothesisCard = screen.getByTestId("albanian-source-linked-functional-hypothesis");
      expect(card).toHaveTextContent("zjarr → zjarr#Albanian");
      expect(card).toHaveTextContent("fik → fik#Albanian");
      expect(card).toHaveTextContent("-ës → -ës#Albanian");
      expect(card).toHaveTextContent("fik: ambiguous (2 source records)");
      expect(hypothesisCard).toHaveTextContent("FUNCTIONAL HYPOTHESIS · UNCLASSIFIED");
      expect(hypothesisCard).toHaveTextContent("firefighter");
      expect(hypothesisCard).toHaveTextContent("fireman");
      expect(hypothesisCard).toHaveTextContent("to extinguish (fire)");
      expect(hypothesisCard).toHaveTextContent("to switch off, turn off");
      expect(hypothesisCard).toHaveTextContent("Functional operation: none classified");
      expect(hypothesisCard).toHaveTextContent("embryo function: Null");
      expect(card).toHaveTextContent("IPA variants: Null");
      expect(screen.getByTestId("albanian-reading-composition-null")).toHaveTextContent("Null");
    }
  });

  it("fails closed when a three-component target has multiple Albanian source records", async () => {
    const facts = [...zjarrfikesThreeComponentFixtureFactsV0_1()];
    const target = facts[0]!;
    facts.push({
      ...target,
      sourceRecordId: "kaikki-albanian-jsonl:word=zjarrfik%C3%ABs:ordinal=1",
      entryLocator: "jsonl://word/zjarrfik%C3%ABs/match/1",
      physicalRecordOrdinal: target.physicalRecordOrdinal + 1,
      senses: [
        { senseId: "en-zjarrfikës-sq-noun-second-record", glosses: ["fire service worker"] },
      ],
    });

    const discovery = await discoveryForFactsV0_1(facts, "zjarrfikës");
    const reading = discovery.albanianLexicalReading;

    expect(reading).toMatchObject({
      status: "NULL",
      primarySourceFact: null,
      sourcePronunciation: null,
      sourceLinkedComponentReading: null,
      sourceLinkedComparison: null,
      functionalMeaningBridge: {
        status: "NULL",
        reasonCodes: ["SOURCE_TARGET_RECORD_IDENTITY_AMBIGUOUS"],
      },
      composition: { status: "NULL" },
      interpretation: {
        status: "UNKNOWN_OR_NULL",
        statement: null,
        basis: ["SOURCE_TARGET_RECORD_IDENTITY_AMBIGUOUS"],
      },
    });
    expect(reading?.functionalMeaningBridge.functionalHypothesis.functionalOperation).toBeNull();
    expect(discovery.exactLexicalSourceFacts).toHaveLength(2);
    expect(discovery.exactLexicalSourceFacts.map((fact) => fact.sourceRecordId)).toEqual([
      "kaikki-albanian-jsonl:word=zjarrfik%C3%ABs:ordinal=0",
      "kaikki-albanian-jsonl:word=zjarrfik%C3%ABs:ordinal=1",
    ]);
    expect(discovery.exactLexicalSourceFacts.flatMap((fact) => fact.senses.map((sense) => sense.senseId))).toEqual([
      "en-zjarrfikës-sq-noun-P9hAbGCJ",
      "en-zjarrfikës-sq-noun-3IRd5pZ-",
      "en-zjarrfikës-sq-noun-second-record",
    ]);
  });

  it("fails closed when the unique three-component target has an invalid source record ID", async () => {
    const facts = zjarrfikesThreeComponentFixtureFactsV0_1({
      primary: { sourceRecordId: "unbound-zjarrfikës-record" },
    });
    const discovery = await discoveryForFactsV0_1(facts, "zjarrfikës");

    expect(discovery.albanianLexicalReading).toMatchObject({
      status: "NULL",
      primarySourceFact: null,
      functionalMeaningBridge: {
        status: "NULL",
        reasonCodes: ["SOURCE_TARGET_RECORD_IDENTITY_INVALID"],
      },
      interpretation: {
        status: "UNKNOWN_OR_NULL",
        basis: ["SOURCE_TARGET_RECORD_IDENTITY_INVALID"],
      },
    });
    expect(discovery.exactLexicalSourceFacts[0]?.senses.map((sense) => sense.senseId)).toEqual([
      "en-zjarrfikës-sq-noun-P9hAbGCJ",
      "en-zjarrfikës-sq-noun-3IRd5pZ-",
    ]);
  });

  it.each([
    ["target occupation category absent", { primary: { senses: [{ senseId: "firefighter-only", glosses: ["firefighter"] }] } }],
    ["agent-forming suffix description negated", { suffix: { senses: [{ senseId: "suffix-negative", glosses: ["not used to form agent nouns"] }] } }],
    ["compound explanation mismatches", { primary: { etymologyText: "From zjarr + something + -ës." } }],
    ["template expansion mismatches", { primary: { etymologyTemplates: [{ name: "compound", args: { "1": "sq", "2": "zjarr", "3": "fik", "4": "-ës" }, expansion: "zjarr + other + -ës" }] } }],
    ["foreign component reference", { primary: { etymologyLinks: [
      { sourceForm: "zjarr", reference: "zjarr#Albanian" },
      { sourceForm: "fik", reference: "fik#Turkish" },
      { sourceForm: "-ës", reference: "-ës#Albanian" },
    ] } }],
    ["component reference missing", { primary: { etymologyLinks: [
      { sourceForm: "zjarr", reference: "zjarr#Albanian" },
      { sourceForm: "-ës", reference: "-ës#Albanian" },
    ] } }],
  ])("does not create a three-component hypothesis when %s", async (_label, overrides) => {
    const discovery = await discoveryForFactsV0_1(zjarrfikesThreeComponentFixtureFactsV0_1(overrides), "zjarrfikës");
    const reading = discovery.albanianLexicalReading?.sourceLinkedComponentReading;
    expect(reading?.functionalHypothesis).toMatchObject({
      status: "UNKNOWN_OR_NULL",
      functionalOperation: null,
      statement: null,
    });
    expect(reading?.functionalHypothesis.reasonCodes.length).toBeGreaterThan(0);
  });

  it("retains source component structure but keeps the hypothesis Null without a verb record", async () => {
    const facts = zjarrfikesThreeComponentFixtureFactsV0_1().filter((fact) =>
      !(fact.form === "fik" && fact.partOfSpeech === "verb"),
    );
    const discovery = await discoveryForFactsV0_1(facts, "zjarrfikës");
    expect(discovery.albanianLexicalReading?.sourceLinkedComponentReading).toMatchObject({
      status: "SUPPORTED",
      functionalHypothesis: {
        status: "UNKNOWN_OR_NULL",
        functionalOperation: null,
        statement: null,
        reasonCodes: expect.arrayContaining(["ACTION_COMPONENT_VERB_RECORD_NOT_UNIQUE"]),
      },
    });
  });

  it("fails closed when multiple component rows reuse one source record identity", async () => {
    const facts = zjarrfikesThreeComponentFixtureFactsV0_1({
      actionVerb: {
        sourceRecordId: "kaikki-albanian-jsonl:word=fik:ordinal=0",
      },
    });
    const discovery = await discoveryForFactsV0_1(facts, "zjarrfikës");
    expect(discovery.albanianLexicalReading?.sourceLinkedComponentReading).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining(["SOURCE_COMPONENT_RECORD_IDENTITY_DUPLICATE"]),
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
  });

  it("keeps the three-component reading Null when a component lookup is unavailable", async () => {
    const facts = zjarrfikesThreeComponentFixtureFactsV0_1();
    const baseProvider = createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts });
    const unavailableProvider = createAlbanianKaikkiServerOnlyUnavailableProviderV0_1("ALBANIAN_SOURCE_PATH_NOT_CONFIGURED");
    const provider: AlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1 = Object.freeze({
      ...baseProvider,
      query: async (query: unknown) => query === "zjarrfikës"
        ? baseProvider.query(query)
        : unavailableProvider.query(query),
    });
    const discovery = await discoveryForProviderV0_1(provider, "zjarrfikës");
    expect(discovery.albanianLexicalReading?.sourceLinkedComponentReading).toMatchObject({
      status: "NULL",
      reasonCodes: expect.arrayContaining(["SOURCE_COMPONENT_LOOKUP_UNAVAILABLE"]),
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
    expect(discovery.albanianLexicalReading?.composition.status).toBe("NULL");
  });

  it.each(["kalimtar", "prurës"] as const)(
    "preserves the source-authored af Null payload for the pinned %s arity shape",
    async (form) => {
      const discovery = await discoveryForFactsV0_1(unsupportedAfArityFixtureFactsV0_1(form), form);
      const reading = discovery.albanianLexicalReading?.sourceLinkedComponentReading;
      expect(reading).toMatchObject({
        status: "NULL",
        reasonCodes: expect.arrayContaining(["SOURCE_AF_TEMPLATE_ARGUMENT_SET_INVALID"]),
        relation: { relation: "SOURCE_AUTHORED_AF_TEMPLATE" },
        functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
      });
      expect(reading?.relation.references).toHaveLength(form === "kalimtar" ? 3 : 1);

      const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery }).motivationDiscoveryV0_1;
      expect(vm).toMatchObject({ kind: "present" });
      if (vm?.kind !== "present") throw new Error("Expected source facts with bounded AF Null to remain visible");
      expect(vm.value.albanianLexicalReading?.sourceLinkedComponentReading).toMatchObject({
        status: "NULL",
        relation: { relation: "SOURCE_AUTHORED_AF_TEMPLATE" },
        functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null },
      });
      expect(vm.value.albanianLexicalReading?.functionalMeaningBridge.functionalHypothesis.functionalOperation).toBeNull();
    },
  );

  it.each([
    ["missing AF arity reason", "prurës", (reading: Record<string, unknown>) => {
      const sourceReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
      sourceReading.reasonCodes = (sourceReading.reasonCodes as string[])
        .filter((code) => code !== "SOURCE_AF_TEMPLATE_ARGUMENT_SET_INVALID");
    }],
    ["missing source-reference-set reason", "prurës", (reading: Record<string, unknown>) => {
      const sourceReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
      sourceReading.reasonCodes = (sourceReading.reasonCodes as string[])
        .filter((code) => code !== "SOURCE_COMPONENT_REFERENCE_SET_MISMATCH");
    }],
    ["spurious source-reference-set reason", "kalimtar", (reading: Record<string, unknown>) => {
      const sourceReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
      sourceReading.reasonCodes = [...sourceReading.reasonCodes as string[], "SOURCE_COMPONENT_REFERENCE_SET_MISMATCH"];
    }],
    ["reference and resolution count mismatch", "kalimtar", (reading: Record<string, unknown>) => {
      const sourceReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
      (sourceReading.componentResolutions as unknown[]).pop();
    }],
    ["mismatched component source-record identity", "kalimtar", (reading: Record<string, unknown>) => {
      const sourceReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
      const resolutions = sourceReading.componentResolutions as Array<Record<string, unknown>>;
      resolutions[0]!.sourceRecordIds = ["forged-source-record-id"];
    }],
    ["duplicate component source-record identities", "kalimtar", (reading: Record<string, unknown>) => {
      const sourceReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
      const resolutions = sourceReading.componentResolutions as Array<Record<string, unknown>>;
      const ambiguous = resolutions[1]!;
      const ids = ambiguous.sourceRecordIds as string[];
      ambiguous.sourceRecordIds = [ids[0]!, ids[0]!];
    }],
    ["forged SUPPORTED state for unsupported arity", "prurës", (reading: Record<string, unknown>) => {
      const sourceReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
      sourceReading.status = "SUPPORTED";
      sourceReading.reasonCodes = [];
    }],
    ["template arguments that no longer match source references", "prurës", (reading: Record<string, unknown>) => {
      const sourceReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
      const primary = sourceReading.primary as Record<string, unknown>;
      const templates = primary.etymologyTemplates as Array<Record<string, unknown>>;
      (templates[0]!.args as Record<string, string>)["2"] = "bie";
    }],
  ] as const)("rejects malformed AF Null payloads when %s", async (_label, form, mutate) => {
    const discovery = await discoveryForFactsV0_1(unsupportedAfArityFixtureFactsV0_1(form), form);
    const malformed = JSON.parse(JSON.stringify(discovery)) as Record<string, unknown>;
    const reading = (malformed.albanianLexicalReading as Record<string, unknown>);
    mutate(reading);
    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformed }).motivationDiscoveryV0_1)
      .toMatchObject({ kind: "missing", missing: "malformed" });
  });

  it("fails closed for source-authored compounds with four or more components", async () => {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=quadword:ordinal=0",
      entryLocator: "jsonl://word/quadword/match/0",
      form: "quadword",
      senses: [{ senseId: "quadword-term", glosses: ["four-part term"] }],
      ipaObservations: [],
      etymologyText: "From alpha + beta + gamma + delta.",
      etymologyLinks: [
        { sourceForm: "alpha", reference: "alpha#Albanian" },
        { sourceForm: "beta", reference: "beta#Albanian" },
        { sourceForm: "gamma", reference: "gamma#Albanian" },
        { sourceForm: "delta", reference: "delta#Albanian" },
      ],
      etymologyTemplates: [{
        name: "compound",
        args: { "1": "sq", "2": "alpha", "3": "beta", "4": "gamma", "5": "delta" },
        expansion: "alpha + beta + gamma + delta",
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
      component("delta", "fourth"),
    ], "quadword");
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
          { sourceForm: "delta", reference: "delta#Albanian" },
        ],
      },
      components: [
        { form: "alpha" },
        { form: "beta" },
        { form: "gamma" },
        { form: "delta" },
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
      expect(card).toHaveTextContent("delta → delta#Albanian");
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

  it("exposes the bounded Five Windows comparison with four comparison queries plus one target-reference lookup", async () => {
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

    expect(queries).toEqual(["dritare", "fënjeshtër", "finestër", "penxhere", "derkë", "dritë"]);
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

const pinnedAlbanianSourceTestV0_1 = process.env[ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1]
  ? it
  : it.skip;

describe("pinned Albanian sense-owned source relation provenance v0.3", () => {
  pinnedAlbanianSourceTestV0_1.each([
    {
      form: "mashkull",
      relatedForm: "mashkullor",
      sourceSenseId: "en-mashkull-sq-noun-DSSOgsYs",
    },
    {
      form: "ngjit",
      relatedForm: "ngjicë",
      sourceSenseId: "en-ngjit-sq-verb-~XJQOpnT",
    },
    {
      form: "breshër",
      relatedForm: "breshni",
      sourceSenseId: "en-breshër-sq-noun-H2Y5qKUc",
    },
  ])("retains the exact real-source owner for $form → $relatedForm", async ({ form, relatedForm, sourceSenseId }) => {
    const provider = await createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1(
      process.env[ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1],
    );
    const sourceResult = await provider.query(form);
    expect(sourceResult.status).toBe("MATCHES_FOUND");
    if (sourceResult.status !== "MATCHES_FOUND") return;
    const primary = sourceResult.facts.find((fact) => fact.form === form && fact.partOfSpeech !== "name");
    expect(primary).toBeDefined();
    const ownedEdges = primary?.relatedForms?.filter((edge) => edge.form === relatedForm) ?? [];
    expect(ownedEdges).toHaveLength(1);
    expect(ownedEdges[0]).toMatchObject({
      relation: "SOURCE_DERIVED_FORM",
      sourceRelationAssertion: {
        assertionScope: "SOURCE_SENSE",
        sourceSenseId,
        sourceSenseOrdinal: expect.any(Number),
        sourceSenseIdentityStatus: "VERIFIED",
        sourceAssertionOrdinal: expect.any(Number),
        reasonCodes: [],
      },
    });

    const discovery = await discoveryForProviderV0_1(provider, form);
    const reading = discovery.albanianLexicalReading;
    const relatedCandidates = reading?.relatedCandidateEvaluations.filter((candidate) => candidate.relatedForm === relatedForm) ?? [];
    expect(relatedCandidates).toHaveLength(1);
    expect(relatedCandidates[0]?.sourceRelationAssertion).toEqual(ownedEdges[0]?.sourceRelationAssertion);
    expect(relatedCandidates[0]?.sourceLinkedComparison.relation.sourceRelationAssertion).toEqual(ownedEdges[0]?.sourceRelationAssertion);
    expect(relatedCandidates[0]?.functionalMeaningBridge.status).toBe("NULL");

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      const ownerLine = screen.getAllByTestId("albanian-source-relation-owner").find((line) =>
        line.textContent?.includes(sourceSenseId),
      );
      const ownerSenseOrdinal = ownedEdges[0]?.sourceRelationAssertion.sourceSenseOrdinal;
      const expectedOwnerMeaning = ownerSenseOrdinal === null || ownerSenseOrdinal === undefined
        ? null
        : primary?.senses[ownerSenseOrdinal]?.glosses.join("; ") ?? null;
      expect(ownerLine).toBeDefined();
      expect(ownerLine).toHaveTextContent(`Assertion scope: SOURCE_SENSE`);
      expect(ownerLine).toHaveTextContent(sourceSenseId);
      expect(expectedOwnerMeaning).not.toBeNull();
      expect(ownerLine?.textContent).toContain(`source meaning at that ordinal: ${expectedOwnerMeaning}`);
    }
    cleanup();
  });

  pinnedAlbanianSourceTestV0_1("retains an actual record-scoped Albanian relation without inventing a sense owner", async () => {
    const provider = await createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1(
      process.env[ALBANIAN_KAIKKI_LEXICAL_SOURCE_PATH_ENV_V0_1],
    );
    const result = await provider.query("de");
    expect(result.status).toBe("MATCHES_FOUND");
    if (result.status !== "MATCHES_FOUND") return;
    const record = result.facts.find((fact) => fact.form === "de");
    const edge = record?.relatedForms?.find((relation) => relation.form === "hajde");
    expect(edge).toMatchObject({
      relation: "SOURCE_RELATED_FORM",
      sourceRelationAssertion: {
        assertionScope: "SOURCE_RECORD",
        sourceSenseId: null,
        sourceSenseOrdinal: null,
        sourceSenseIdentityStatus: "NOT_APPLICABLE",
        sourceAssertionOrdinal: expect.any(Number),
        reasonCodes: [],
      },
    });
  });
});

describe("sense-conditioned functional reasoning v0.4", () => {
  const occupationsCategory = {
    name: "Occupations",
    kind: "other",
    parents: [],
    source: "w",
    orig: "sq:Occupations",
    langcode: "sq",
    _dis: null,
  } as const;

  function sourceSenseAgentFixtures(
    assertion: AlbanianKaikkiSourceRelationAssertionV0_1,
    primarySenses: readonly Readonly<{ senseId: string | null; glosses: readonly string[] }>[] = [
      { senseId: "fish-owner", glosses: ["fish"] },
      { senseId: "unrelated-primary", glosses: ["seller"] },
    ],
  ): readonly AlbanianKaikkiExactLexicalSourceFactV0_1[] {
    const primary = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=sense-agent-base:ordinal=0",
      entryLocator: "jsonl://word/sense-agent-base/match/0",
      form: "sense-agent-base",
      partOfSpeech: "noun",
      senses: primarySenses,
      ipaObservations: [],
      relatedForms: [{
        form: "sense-agent-target",
        relation: "SOURCE_DERIVED_FORM",
        entryLocator: "jsonl://word/sense-agent-target/match/0",
        sourceRelationAssertion: assertion,
      }],
    });
    const target = fixtureFact({
      sourceRecordId: "kaikki-albanian-jsonl:word=sense-agent-target:ordinal=0",
      entryLocator: "jsonl://word/sense-agent-target/match/0",
      form: "sense-agent-target",
      partOfSpeech: "noun",
      senses: [{ senseId: "target-agent", glosses: ["fisherman"], categories: [occupationsCategory] }],
      ipaObservations: [],
      etymologyLinks: [{ sourceForm: "sense-agent-base", reference: "sense-agent-base#Albanian" }],
    });
    return Object.freeze([primary, target]);
  }

  it("conditions the real dritë → dritare passage without flattening firefly or free-time senses", async () => {
    const discovery = await discoveryForFactsV0_1(dritareTargetFirstFixtureFactsV0_1(), "dritare");
    const hypothesis = discovery.albanianLexicalReading?.functionalMeaningBridge.functionalHypothesis;
    expect(hypothesis).toMatchObject({
      status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
      functionalOperation: "ENABLE_PASSAGE",
    });
    expect(hypothesis?.statement).toContain("light; light (such as a lamp)");
    expect(hypothesis?.statement).toContain("window; access to the sea; key, opening, access to knowledge");
    expect(hypothesis?.statement).not.toContain("firefly");
    expect(hypothesis?.statement).not.toContain("free time");
    expect(hypothesis?.alternatives).toEqual(expect.arrayContaining([
      expect.stringContaining("firefly"),
      expect.stringContaining("free time"),
    ]));
  });

  it("uses a verified source-sense owner for AGENT and retains the other primary sense as an alternative", async () => {
    const assertion: AlbanianKaikkiSourceRelationAssertionV0_1 = {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: "fish-owner",
      sourceSenseOrdinal: 0,
      sourceSenseIdentityStatus: "VERIFIED",
      sourceAssertionOrdinal: 0,
      reasonCodes: [],
    };
    const discovery = await discoveryForFactsV0_1(sourceSenseAgentFixtures(assertion), "sense-agent-base");
    const bridge = discovery.albanianLexicalReading?.functionalMeaningBridge;
    expect(bridge).toMatchObject({
      status: "SUPPORTED",
      relatedForm: "sense-agent-target",
      functionalHypothesis: { functionalOperation: "AGENT" },
    });
    expect(bridge?.functionalHypothesis.statement).toContain("fish");
    expect(bridge?.functionalHypothesis.statement).toContain("fish-owner");
    expect(bridge?.functionalHypothesis.statement).not.toContain("seller");
    expect(bridge?.functionalHypothesis.alternatives).toEqual(expect.arrayContaining([
      expect.stringContaining("seller"),
    ]));
  });

  it.each([
    ["missing owner", {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: null,
      sourceSenseOrdinal: 0,
      sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
      sourceAssertionOrdinal: 0,
      reasonCodes: ["SOURCE_SENSE_ID_MISSING"],
    }],
    ["duplicate owner", {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: "duplicate-owner",
      sourceSenseOrdinal: 0,
      sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
      sourceAssertionOrdinal: 0,
      reasonCodes: ["SOURCE_SENSE_ID_DUPLICATE"],
    }],
    ["incorrect ordinal", {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: "fish-owner",
      sourceSenseOrdinal: 1,
      sourceSenseIdentityStatus: "VERIFIED",
      sourceAssertionOrdinal: 0,
      reasonCodes: ["SOURCE_SENSE_ORDINAL_MISMATCH"],
    }],
    ["explicit source-sense owner with a legacy marker", {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: null,
      sourceSenseOrdinal: 0,
      sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
      sourceAssertionOrdinal: 0,
      reasonCodes: ["SOURCE_RELATION_PROVENANCE_NOT_PROJECTED"],
    }],
  ] as const)("keeps functional AGENT Null for %s", async (_label, assertion) => {
    const primarySenses = assertion.sourceSenseId === "duplicate-owner"
      ? [
          { senseId: "duplicate-owner", glosses: ["fish"] },
          { senseId: "duplicate-owner", glosses: ["seller"] },
        ] as const
      : undefined;
    const discovery = await discoveryForFactsV0_1(sourceSenseAgentFixtures(assertion, primarySenses), "sense-agent-base");
    expect(discovery.albanianLexicalReading?.functionalMeaningBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
  });

  it("keeps a record-scoped relation supported without inventing an individual source-sense owner", async () => {
    const assertion: AlbanianKaikkiSourceRelationAssertionV0_1 = {
      assertionScope: "SOURCE_RECORD",
      sourceSenseId: null,
      sourceSenseOrdinal: null,
      sourceSenseIdentityStatus: "NOT_APPLICABLE",
      sourceAssertionOrdinal: 0,
      reasonCodes: [],
    };
    const discovery = await discoveryForFactsV0_1(sourceSenseAgentFixtures(assertion), "sense-agent-base");
    const bridge = discovery.albanianLexicalReading?.functionalMeaningBridge;
    expect(bridge?.status).toBe("SUPPORTED");
    expect(bridge?.functionalHypothesis.functionalOperation).toBe("AGENT");
    expect(bridge?.functionalHypothesis.statement).toContain("source-record-scoped");
    expect(bridge?.functionalHypothesis.statement).toContain("no individual primary source sense is selected");
    expect(bridge?.functionalHypothesis.statement).toContain("fish; seller");
  });

  it("fails closed when a verified owner is paired with a different primary source record", async () => {
    const assertion: AlbanianKaikkiSourceRelationAssertionV0_1 = {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: "fish-owner",
      sourceSenseOrdinal: 0,
      sourceSenseIdentityStatus: "VERIFIED",
      sourceAssertionOrdinal: 0,
      reasonCodes: [],
    };
    const discovery = await discoveryForFactsV0_1(sourceSenseAgentFixtures(assertion), "sense-agent-base");
    const candidate = discovery.albanianLexicalReading?.relatedCandidateEvaluations.find((item) =>
      item.relatedForm === "sense-agent-target",
    );
    if (!candidate || !candidate.sourceLinkedComparison.related) {
      throw new Error("Expected a source-linked candidate for the forged owner control");
    }
    const forgedComparison = {
      ...candidate.sourceLinkedComparison,
      relation: {
        ...candidate.sourceLinkedComparison.relation,
        primarySourceRecordId: "kaikki-albanian-jsonl:word=other-record:ordinal=0",
      },
    } as typeof candidate.sourceLinkedComparison;
    const forgedBridge = buildAlbanianFunctionalMeaningBridgeV0_1({
      primary: forgedComparison.primary,
      comparison: forgedComparison,
      related: forgedComparison.related,
      sourceRelationAssertion: candidate.sourceRelationAssertion,
      sourceRelation: "SOURCE_DERIVED_FORM",
    });
    expect(forgedBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
  });

  it("fails closed when a comparison claims another valid sense than the source relation edge", async () => {
    const assertion: AlbanianKaikkiSourceRelationAssertionV0_1 = {
      assertionScope: "SOURCE_SENSE",
      sourceSenseId: "fish-owner",
      sourceSenseOrdinal: 0,
      sourceSenseIdentityStatus: "VERIFIED",
      sourceAssertionOrdinal: 0,
      reasonCodes: [],
    };
    const discovery = await discoveryForFactsV0_1(sourceSenseAgentFixtures(assertion), "sense-agent-base");
    const candidate = discovery.albanianLexicalReading?.relatedCandidateEvaluations.find((item) =>
      item.relatedForm === "sense-agent-target",
    );
    if (!candidate?.sourceLinkedComparison.related) {
      throw new Error("Expected a source-linked candidate for the forged same-record owner control");
    }
    const forgedComparison = {
      ...candidate.sourceLinkedComparison,
      relation: {
        ...candidate.sourceLinkedComparison.relation,
        sourceRelationAssertion: {
          ...assertion,
          sourceSenseId: "unrelated-primary",
          sourceSenseOrdinal: 1,
        },
      },
    } as typeof candidate.sourceLinkedComparison;
    const forgedBridge = buildAlbanianFunctionalMeaningBridgeV0_1({
      primary: forgedComparison.primary,
      comparison: forgedComparison,
      related: forgedComparison.related,
      sourceRelationAssertion: candidate.sourceRelationAssertion,
      sourceRelation: "SOURCE_DERIVED_FORM",
    });
    expect(forgedBridge).toMatchObject({
      status: "NULL",
      functionalHypothesis: { status: "UNKNOWN_OR_NULL", functionalOperation: null, statement: null },
    });
  });

  it("preserves legacy record-level meanings when individual source senses were not projected", async () => {
    const legacyAssertion: AlbanianKaikkiSourceRelationAssertionV0_1 = {
      assertionScope: "UNKNOWN_OR_NULL",
      sourceSenseId: null,
      sourceSenseOrdinal: null,
      sourceSenseIdentityStatus: "UNKNOWN_OR_NULL",
      sourceAssertionOrdinal: null,
      reasonCodes: ["SOURCE_RELATION_PROVENANCE_NOT_PROJECTED"],
    };
    const discovery = await discoveryForFactsV0_1(sourceSenseAgentFixtures(legacyAssertion), "sense-agent-base");
    const candidate = discovery.albanianLexicalReading?.relatedCandidateEvaluations.find((item) =>
      item.relatedForm === "sense-agent-target",
    );
    if (!candidate?.sourceLinkedComparison.related) {
      throw new Error("Expected a source-linked candidate for the legacy projection control");
    }
    const legacyPrimary = { ...candidate.sourceLinkedComparison.primary, sourceSenses: undefined };
    const legacyComparison = { ...candidate.sourceLinkedComparison, primary: legacyPrimary };
    const legacyBridge = buildAlbanianFunctionalMeaningBridgeV0_1({
      primary: legacyPrimary,
      comparison: legacyComparison,
      related: legacyComparison.related,
      sourceRelationAssertion: candidate.sourceRelationAssertion,
      sourceRelation: "SOURCE_DERIVED_FORM",
    });
    expect(legacyBridge).toMatchObject({
      status: "SUPPORTED",
      functionalHypothesis: { functionalOperation: "AGENT" },
    });
    expect(legacyBridge.functionalHypothesis.statement).toContain("fish; seller");
    expect(legacyBridge.functionalHypothesis.statement).not.toContain("fish-owner");
  });
});
