import { POST } from "@/app/api/analyze-v2/route";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
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
import {
  buildNativeDomainToAgentV0_1,
} from "@/shared/openInstrument/albanianNativeDomainToAgent.v0_1";
import * as oewn from "@/shared/openInstrument/oewnAgentFramesServerOnly.v0_1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

jest.mock("@/shared/openInstrument/albanianKaikkiServerOnlySourceDelivery.v0_1", () => ({
  ...jest.requireActual("@/shared/openInstrument/albanianKaikkiServerOnlySourceDelivery.v0_1"),
  createAlbanianKaikkiServerOnlyProductionProviderV0_1: jest.fn(),
}));
jest.mock("@/shared/openInstrument/oewnAgentFramesServerOnly.v0_1", () => ({
  ...jest.requireActual("@/shared/openInstrument/oewnAgentFramesServerOnly.v0_1"),
  lookupOewnAgentFramesServerOnlyV0_1: jest.fn(),
}));

function fact(
  form: string,
  ordinal: number,
  pos: string,
  senses: AlbanianKaikkiExactLexicalSourceFactV0_1["senses"],
): AlbanianKaikkiExactLexicalSourceFactV0_1 {
  const encoded = encodeURIComponent(form);
  return {
    sourceRecordId: `kaikki-albanian-jsonl:word=${encoded}:ordinal=${ordinal}`,
    entryLocator: `jsonl://word/${encoded}/match/${ordinal}`,
    physicalRecordOrdinal: ordinal,
    form,
    language: "Albanian",
    languageCode: "sq",
    partOfSpeech: pos,
    senses,
    ipaObservations: [],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: {
      sourceFamilyId: ALBANIAN_KAIKKI_LEXICAL_SOURCE_FAMILY_ID_V0_1,
      sourceUrl: ALBANIAN_KAIKKI_LEXICAL_SOURCE_URL_V0_1,
      sha256: ALBANIAN_KAIKKI_LEXICAL_SOURCE_SHA256_V0_1,
      bytes: ALBANIAN_KAIKKI_LEXICAL_SOURCE_BYTES_V0_1,
    },
  };
}

const base = fact("punë", 0, "noun", [
  { senseId: "fixture-work", glosses: ["work; labour; job"] },
  { senseId: "fixture-trouble", glosses: ["trouble"] },
]);
const suffix = fact("-tor", 0, "suffix", [{ senseId: "fixture-suffix", glosses: ["-er"] }]);
const target = {
  ...fact("punëtor", 0, "noun", [{ senseId: "fixture-worker", glosses: ["worker; laborer"] }]),
  etymologyText: "From punë (“work; labour”) + -tor.",
  etymologyLinks: [
    { sourceForm: "punë", reference: "punë#Albanian" },
    { sourceForm: "-tor", reference: "-tor#Albanian" },
  ],
  etymologyTemplates: [{
    name: "suffix",
    args: { "1": "sq", "2": "punë", "3": "tor", gloss1: "work; labour" },
    expansion: "punë (“work; labour”) + -tor",
  }],
};
const adjective = {
  ...target,
  ...fact("punëtor", 1, "adj", [{ senseId: "fixture-hardworking", glosses: ["hardworking"] }]),
};
const fishBase = {
  ...fact("peshk", 2, "noun", [{ senseId: "fixture-fish", glosses: ["fish"] }]),
  relatedForms: [{
    form: "peshkatar",
    relation: "SOURCE_DERIVED_FORM" as const,
    entryLocator: "jsonl://word/peshkatar",
    sourceRelationAssertion: {
      assertionScope: "SOURCE_SENSE" as const,
      sourceSenseId: "fixture-fish",
      sourceSenseOrdinal: 0,
      sourceSenseIdentityStatus: "VERIFIED" as const,
      sourceAssertionOrdinal: 0,
      reasonCodes: [],
    },
  }],
};
const fisherman = fact("peshkatar", 3, "noun", [{ senseId: "fixture-fisherman", glosses: ["fisherman"] }]);
const frames = [{
  lemma: "worker",
  senseId: "worker%1:18:00::",
  synsetId: "09655706-n",
  definition: "a person who works at a specific occupation",
  semanticCategory: "noun.person" as const,
}];
const fishermanFrame = {
  lemma: "fisherman",
  senseId: "fisherman%1:18:00::",
  synsetId: "83380317-n",
  definition: "a man whose occupation is catching fish",
  semanticCategory: "noun.person" as const,
};

async function analyze(word = "PUNËTOR", selector?: string) {
  const response = await POST(new Request("http://localhost/api/analyze-v2", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      word,
      language: "sq",
      alphabet: "albanian",
      providerExecution: "disabled",
      albanianSourceRecordId: selector,
    }),
  }));
  expect(response.status).toBe(200);
  return response.json();
}

describe("native domain to agent reading", () => {
  beforeEach(() => {
    jest.replaceProperty(process, "env", {
      ...process.env,
      OPEN_INSTRUMENT_PUBLIC_BETA_MODE: "deterministic_only",
      [oewn.OEWN_AGENT_ARCHIVE_PATH_ENV_V0_1]: "/fixture/verified.zip",
    });
    jest.mocked(sourceDelivery.createAlbanianKaikkiServerOnlyProductionProviderV0_1).mockResolvedValue(
      createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({
        facts: [base, suffix, target, adjective, fishBase, fisherman],
      }),
    );
    jest.mocked(oewn.lookupOewnAgentFramesServerOnlyV0_1).mockImplementation(async (glosses) =>
      glosses.some((gloss) => gloss.toLowerCase() === "fisherman") ? [fishermanFrame] : frames,
    );
    jest.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Unexpected network call"));
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  it("runs through the route, validates the native claim, and renders it in the existing card", async () => {
    const payload = await analyze();
    const reading = payload.motivationDiscoveryV0_2.albanianLexicalReading;
    expect(reading.nativeDomainToAgent).toMatchObject({
      origin: "NATIVE_GENERATED",
      status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
      operation: "DOMAIN_TO_AGENT_ROLE",
      interpretationDecisionPolicy: { automaticInterpretationSelection: "DISABLED" },
      userDecisionPosture: "user_decides",
      writtenVoices: [{ voice: "U", position: 1 }, { voice: "Ë", position: 3 }, { voice: "O", position: 5 }],
      alternatives: [{
        base: { sourceRecordId: base.sourceRecordId, senseId: "fixture-work" },
        target: { sourceRecordId: target.sourceRecordId, senseId: "fixture-worker" },
        frames: [{ matchedTerms: ["work"] }],
      }],
    });
    expect(reading.sourceLinkedComponentReading.components[0].sourceSenses).toHaveLength(2);
    const vm = adaptAnalysisToTelemetryVM(payload);
    expect(vm.motivationDiscoveryV0_2?.kind).toBe("present");
    const markup = renderToStaticMarkup(createElement(InstrumentPanel, { vm }));
    const explanationIndex = markup.indexOf('data-testid="primary-albanian-native-agent-explanation"');
    expect(explanationIndex).toBeGreaterThan(-1);
    expect(explanationIndex).toBeLessThan(markup.indexOf('data-testid="instrument-tab-details-overview"'));
    expect(markup).toContain(reading.nativeDomainToAgent.alternatives[0].explanation);
    expect(markup).toContain("fixture-trouble");
    expect((await analyze()).motivationDiscoveryV0_2.albanianLexicalReading.nativeDomainToAgent)
      .toEqual(reading.nativeDomainToAgent);
    expect(globalThis.fetch).not.toHaveBeenCalled();

    reading.nativeDomainToAgent.alternatives[0].base.senseId = "different-source-sense";
    expect(adaptAnalysisToTelemetryVM(payload).motivationDiscoveryV0_2?.kind).toBe("missing");
  });

  it("keeps the exact adjective record outside the operation", async () => {
    const payload = await analyze("PUNËTOR", adjective.sourceRecordId);
    expect(payload.motivationDiscoveryV0_2.albanianLexicalReading.nativeDomainToAgent).toBeUndefined();
    expect(oewn.lookupOewnAgentFramesServerOnlyV0_1).not.toHaveBeenCalled();
  });

  it("uses an exact base-side derived-form assertion and noun.person membership for PESHKATAR", async () => {
    const payload = await analyze("PESHKATAR");
    const reading = payload.motivationDiscoveryV0_2.albanianLexicalReading;
    expect(reading.nativeDomainToAgentSourceDerivedInput.bases[0].relation).toMatchObject({
      form: "peshkatar",
      relation: "SOURCE_DERIVED_FORM",
      sourceRelationAssertion: {
        assertionScope: "SOURCE_SENSE",
        sourceSenseId: "fixture-fish",
        sourceSenseIdentityStatus: "VERIFIED",
      },
    });
    expect(reading.nativeDomainToAgent.alternatives).toEqual([expect.objectContaining({
      base: expect.objectContaining({ form: "peshk", sourceRecordId: fishBase.sourceRecordId, senseId: "fixture-fish", glosses: ["fish"] }),
      target: expect.objectContaining({ form: "peshkatar", sourceRecordId: fisherman.sourceRecordId, senseId: "fixture-fisherman", glosses: ["fisherman"] }),
      sourceDerivedRelation: expect.objectContaining({ direction: "BASE_SOURCE_RECORD_TO_TARGET_DERIVED_FORM", assertionScope: "SOURCE_SENSE", sourceSenseId: "fixture-fish" }),
      frames: expect.arrayContaining([expect.objectContaining({ semanticCategory: "noun.person", definition: "a man whose occupation is catching fish" })]),
    })]);
    expect(reading.nativeDomainToAgent.alternatives[0].explanation).toContain("suffix function remains unresolved");
    expect(reading.nativeDomainToAgent.writtenVoices).toEqual([
      { voice: "E", position: 1 }, { voice: "A", position: 5 }, { voice: "A", position: 7 },
    ]);
    expect(adaptAnalysisToTelemetryVM(payload).motivationDiscoveryV0_2?.kind).toBe("present");
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it("rejects unrelated source relations and frames outside noun.person", () => {
    const unrelated = {
      target: { ...({ ...fishBase, form: "other" } as never) },
      bases: [{ base: fishBase as never, relation: { ...fishBase.relatedForms[0]!, form: "other" } }],
    };
    expect(buildNativeDomainToAgentV0_1("PESHKATAR", null, [fishermanFrame], unrelated as never)).toBeNull();
    const nonPerson = { ...fishermanFrame, semanticCategory: "noun.artifact" };
    expect(buildNativeDomainToAgentV0_1("PESHKATAR", null, [nonPerson as never], {
      target: fisherman as never,
      bases: [{ base: fishBase as never, relation: fishBase.relatedForms[0]! }],
    } as never)).toBeNull();
  });

  it("withholds the base-side contribution when the source-attested base sense is removed", async () => {
    const payload = await analyze("PESHKATAR");
    const reading = payload.motivationDiscoveryV0_2.albanianLexicalReading;
    const basis = reading.nativeDomainToAgentSourceDerivedInput;
    const frames = reading.nativeDomainToAgent.alternatives.flatMap((alternative: typeof reading.nativeDomainToAgent.alternatives[number]) =>
      alternative.frames.map(({ lemma, senseId, synsetId, definition, semanticCategory }) =>
        ({ lemma, senseId, synsetId, definition, semanticCategory })),
    );
    const removed = {
      ...basis,
      bases: basis.bases.map((candidate: typeof basis.bases[number]) => ({
        ...candidate,
        base: { ...candidate.base, sourceSenses: candidate.base.sourceSenses.map((sense) => ({ ...sense, glosses: [] })) },
        sourceRecord: { ...candidate.sourceRecord, senses: candidate.sourceRecord.senses.map((sense) => ({ ...sense, glosses: [] })) },
      })),
    };
    expect(buildNativeDomainToAgentV0_1("PESHKATAR", null, frames, removed as never)).toBeNull();
  });

  it("withholds the contribution when base semantic support is removed", async () => {
    const payload = await analyze();
    const reading = payload.motivationDiscoveryV0_2.albanianLexicalReading.sourceLinkedComponentReading;
    const ablated = {
      ...reading,
      components: reading.components.map((component: typeof reading.primary) =>
        component.sourceRecordId === base.sourceRecordId
          ? { ...component, sourceSenses: component.sourceSenses.map(
              (sense: { glosses: string[] }) => ({ ...sense, glosses: [] }),
            ) }
          : component),
    };
    expect(buildNativeDomainToAgentV0_1("PUNËTOR", ablated, frames)).toBeNull();
  });

  it("retains the lexical reading when OEWN is unavailable", async () => {
    jest.mocked(oewn.lookupOewnAgentFramesServerOnlyV0_1).mockResolvedValue([]);
    const payload = await analyze();
    expect(payload.motivationDiscoveryV0_2.albanianLexicalReading).toMatchObject({
      status: "SUPPORTED",
      primarySourceFact: { sourceRecordId: target.sourceRecordId },
    });
    expect(payload.motivationDiscoveryV0_2.albanianLexicalReading.nativeDomainToAgent).toBeUndefined();
    expect(adaptAnalysisToTelemetryVM(payload).motivationDiscoveryV0_2?.kind).toBe("present");
  });
});
