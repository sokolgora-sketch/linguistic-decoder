import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { POST } from "@/app/api/analyze-v2/route";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import {
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
  ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
} from "@/shared/openInstrument/albanianKaikkiExactLexicalSourceIdentity.v0_1";
import * as sourceDelivery from "@/shared/openInstrument/albanianKaikkiServerOnlySourceDelivery.v0_1";
import * as oewn from "@/shared/openInstrument/oewnAgentFramesServerOnly.v0_1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

jest.mock("@/shared/openInstrument/albanianKaikkiServerOnlySourceDelivery.v0_1", () => ({
  ...jest.requireActual("@/shared/openInstrument/albanianKaikkiServerOnlySourceDelivery.v0_1"),
  createAlbanianKaikkiServerOnlyProductionProviderV0_1: jest.fn(),
}));
jest.mock("@/shared/openInstrument/oewnAgentFramesServerOnly.v0_1", () => ({
  ...jest.requireActual("@/shared/openInstrument/oewnAgentFramesServerOnly.v0_1"),
  lookupOewnCompositionComparisonsServerOnlyV0_1: jest.fn(),
}));

function fact(form: string, partOfSpeech: string, glosses: string[]): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  const encoded = encodeURIComponent(form);
  return {
    form,
    partOfSpeech,
    language: "Albanian",
    languageCode: "sq",
    sourceRecordId: `kaikki-albanian-jsonl:word=${encoded}:ordinal=0`,
    entryLocator: `jsonl://word/${encoded}/match/0`,
    physicalRecordOrdinal: 0,
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: {
      sourceFamilyId: ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
      sourceUrl: ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
      sha256: ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
      bytes: ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
    },
    senses: glosses.map((gloss, ordinal) => ({ senseId: `fixture-${form}-${ordinal}`, glosses: [gloss] })),
    ipaObservations: [],
  };
}

const components = [
  fact("tok", "adv", ["together", "simultaneously"]),
  fact("to", "noun", ["bow, prow"]),
  fact("veprim", "noun", ["action", "acting"]),
  fact("gur", "noun", ["stone"]),
];

async function analyze(word: string) {
  const response = await POST(new Request("http://localhost/api/analyze-v2", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ word, language: "sq", alphabet: "albanian", providerExecution: "disabled" }),
  }));
  expect(response.status).toBe(200);
  return response.json();
}

beforeEach(() => {
  jest.replaceProperty(process, "env", {
    ...process.env,
    OPEN_INSTRUMENT_PUBLIC_BETA_MODE: "deterministic_only",
    [oewn.OEWN_AGENT_ARCHIVE_PATH_ENV_V0_1]: "/fixture/oewn.zip",
  });
  jest.mocked(sourceDelivery.createAlbanianKaikkiServerOnlyProductionProviderV0_1).mockResolvedValue(
    createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
      facts: [...components, fact("tokveprim", "noun", ["interaction", "unrelated sense"]),
        fact("tokgur", "noun", ["interaction"])],
    }),
  );
  jest.mocked(oewn.lookupOewnCompositionComparisonsServerOnlyV0_1).mockResolvedValue([
    { lemma: "interaction", senseId: "interaction%1:04:00::", synsetId: "00039759-n", definition: "a mutual or reciprocal action" },
    { lemma: "interaction", senseId: "interaction%1:19:00::", synsetId: "11536546-n", definition: "transfer of energy between elementary particles" },
  ]);
  jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Unexpected external request"));
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

it("discovers and renders sense alternatives without any authored component relation", async () => {
  const payload = await analyze("TOKVEPRIM");
  const discovery = payload.motivationDiscoveryV0_2;
  const reading = discovery.albanianLexicalReading;
  expect(discovery.exactLexicalSourceFacts[0].etymologyTemplates ?? []).toEqual([]);
  expect(discovery.exactLexicalSourceFacts[0].etymologyLinks ?? []).toEqual([]);
  expect(discovery.exactLexicalSourceFacts[0].senses).toHaveLength(2);
  expect(reading.sourceLinkedComponentReading).toBeNull();
  const result = reading.independentFunctionalComposition;
  expect(result).toMatchObject({
    inputForm: "TOKVEPRIM",
    status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
    smallestEmbryo: null,
    writtenVoices: [
      { voice: "O", position: 1 }, { voice: "E", position: 4 }, { voice: "I", position: 7 },
    ],
    userDecisionPosture: "user_decides",
    interpretationDecisionPolicy: { automaticInterpretationSelection: "DISABLED" },
  });
  expect(result.alternatives).toHaveLength(2);
  for (const [senseOrdinal, candidate] of result.alternatives.entries()) {
    expect(candidate).toMatchObject({
      modifier: { surface: "TOK", start: 0, end: 3, senseOrdinal: 0 },
      activity: { surface: "VEPRIM", start: 3, end: 9, senseOrdinal },
      unresolved: [],
      relation: "RECIPROCAL",
      targetSenseOrdinal: 0,
      comparison: { senseId: "interaction%1:04:00::" },
      smallerProbes: expect.arrayContaining([expect.objectContaining({ form: "TO", function: null })]),
    });
    expect(candidate.explanation).toContain("with each acting on or responding to another");
  }
  const vm = adaptAnalysisToTelemetryVM(payload);
  expect(vm.motivationDiscoveryV0_2?.kind).toBe("present");
  const markup = renderToStaticMarkup(createElement(InstrumentPanel, { vm }));
  expect(markup).toContain("primary-albanian-independent-composition");
  expect(markup).toContain(result.alternatives[0].explanation);
  const repeated = await analyze("TOKVEPRIM");
  expect(repeated.motivationDiscoveryV0_2.albanianLexicalReading.independentFunctionalComposition).toEqual(result);
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

it("withholds functional composition when an exact split has incompatible meanings", async () => {
  const payload = await analyze("TOKGUR");
  expect(payload.motivationDiscoveryV0_2.albanianLexicalReading).toMatchObject({
    status: "SUPPORTED",
    primarySourceFact: { form: "tokgur", meaningGlosses: ["interaction"] },
    sourceLinkedComponentReading: null,
  });
  expect(payload.motivationDiscoveryV0_2.albanianLexicalReading.independentFunctionalComposition).toBeUndefined();
  expect(adaptAnalysisToTelemetryVM(payload).motivationDiscoveryV0_2?.kind).toBe("present");
  expect(globalThis.fetch).not.toHaveBeenCalled();
});

it("rejects an explanation or lexical locator that does not agree with its reconstruction", async () => {
  const payload = await analyze("TOKVEPRIM");
  const reading = payload.motivationDiscoveryV0_2.albanianLexicalReading;
  const tampered = JSON.parse(JSON.stringify(payload));
  tampered.motivationDiscoveryV0_2.albanianLexicalReading.independentFunctionalComposition.alternatives[0].explanation = "Unsupported claim";
  expect(adaptAnalysisToTelemetryVM(tampered).motivationDiscoveryV0_2?.kind).toBe("missing");
  reading.independentFunctionalCompositionInput.lexicalRecords[0].entryLocator = "jsonl://wrong";
  expect(adaptAnalysisToTelemetryVM(payload).motivationDiscoveryV0_2?.kind).toBe("missing");
});
