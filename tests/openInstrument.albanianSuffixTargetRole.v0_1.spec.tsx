/** @jest-environment jsdom */
import { GET } from "@/app/api/analyze-v1/route";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1,
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
  type AlbanianKaikkiExactLexicalSourceFactV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";
import { createElement } from "react";
import { cleanup, render, screen } from "@testing-library/react";

afterEach(cleanup);

const SOURCE_SHA256 = "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc";
const SOURCE_BYTES = 67438537;
const SOURCE_PATH = process.env.OPEN_INSTRUMENT_ALBANIAN_LEXICAL_SOURCE_PATH;

type ApiBody = Record<string, unknown>;
type Discovery = Record<string, unknown>;
type Reading = Record<string, unknown>;

let realProvider: Awaited<ReturnType<typeof createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1>>;
let realShkencetarBody: ApiBody;

async function realDiscovery(word: string): Promise<Discovery> {
  const payload = await runAnalysisDeterministic(word, { mode: "strict", alphabet: "albanian" });
  const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
    word,
    inputLanguage: "sq",
    inputProfile: "albanian",
    analysis: enginePayloadToAnalysisResult(payload),
    heart: buildHeartInstrumentV1(word),
    albanianLexicalSourceProvider: realProvider,
  });
  return result.discovery as unknown as Discovery;
}

function realReading(discovery: Discovery): Reading {
  return discovery.albanianLexicalReading as Reading;
}

const occupations = (source: "w" | "w+disamb" = "w") => ({
  name: "Occupations",
  kind: "other",
  parents: [],
  source,
  orig: "sq:Occupations",
  langcode: "sq",
  _dis: null,
});

function syntheticSuffixTarget(overrides: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1> = {}) {
  return {
    sourceRecordId: "synthetic-test:word=testlexeme:ordinal=0",
    entryLocator: "synthetic://word/testlexeme/0",
    physicalRecordOrdinal: 1,
    language: "Albanian",
    languageCode: "sq",
    form: "testlexeme",
    partOfSpeech: "noun",
    senses: [{ senseId: "synthetic-test-sense", glosses: ["test role"], categories: [occupations()] }],
    ipaObservations: [],
    sourceStatus: "observed_external_snapshot",
    attestationTruth: "fact",
    pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
    sourceSnapshot: {
      sourceFamilyId: "synthetic-albanian-fixture-v0.1",
      sourceUrl: "synthetic://albanian-fixture",
      sha256: "synthetic-fixture-sha256",
      bytes: 1,
    },
    etymologyText: "From testbase + -tar.",
    etymologyLinks: [
      { sourceForm: "testbase", reference: "testbase#Albanian" },
      { sourceForm: "-tar", reference: "-tar#Albanian" },
    ],
    etymologyTemplates: [{
      name: "suffix",
      args: { "1": "sq", "2": "testbase", "3": "tar" },
      expansion: "testbase + -tar",
    }],
    ...overrides,
  } as AlbanianKaikkiExactLexicalSourceFactV0_1;
}

async function syntheticDiscovery(facts: readonly AlbanianKaikkiExactLexicalSourceFactV0_1[], word = "testlexeme") {
  const payload = await runAnalysisDeterministic(word, { mode: "strict", alphabet: "albanian" });
  const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
    word,
    inputLanguage: "sq",
    inputProfile: "albanian",
    analysis: enginePayloadToAnalysisResult(payload),
    heart: buildHeartInstrumentV1(word),
    albanianLexicalSourceProvider: createAlbanianKaikkiServerOnlyExactLexicalSourceProviderForSyntheticFixtureV0_1({ facts }),
  });
  return result.discovery as unknown as Discovery;
}

function functionalBridge(reading: Reading): Record<string, unknown> {
  return reading.functionalMeaningBridge as Record<string, unknown>;
}

describe("source-authored suffix direct-target AGENT", () => {
  beforeAll(async () => {
    if (!SOURCE_PATH) throw new Error("Pinned real Kaikki source path is required for this test.");
    realProvider = await createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1(SOURCE_PATH);
    const response = await GET(new Request(
      "http://localhost/api/analyze-v1?word=shkenc%C3%ABtar&mode=strict&alphabet=albanian&language=sq&providerExecution=disabled",
    ));
    if (response.status !== 200) throw new Error(`Real-source analyze-v1 returned ${response.status}.`);
    realShkencetarBody = await response.json() as ApiBody;
  });

  it("supports direct shkencëtar through the real source, API, adapter, and existing UI", () => {
    const discovery = realShkencetarBody.motivationDiscoveryV0_1 as Discovery;
    const reading = realReading(discovery);
    const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
    const targetFacts = facts.filter((fact) => fact.form === "shkencëtar" && fact.partOfSpeech !== "name");
    expect(targetFacts).toHaveLength(1);
    const target = targetFacts[0]!;
    expect(target).toMatchObject({
      sourceRecordId: "kaikki-albanian-jsonl:word=shkenc%C3%ABtar:ordinal=0",
      entryLocator: "jsonl://word/shkenc%C3%ABtar/match/0",
      language: "Albanian",
      languageCode: "sq",
      partOfSpeech: "noun",
      etymologyText: "From shkencë + -tar.",
    });
    expect(target.sourceSnapshot).toMatchObject({ sha256: SOURCE_SHA256, bytes: SOURCE_BYTES });
    const senses = target.senses as Record<string, unknown>[];
    expect(senses).toHaveLength(1);
    expect(senses[0]).toMatchObject({
      senseId: "en-shkencëtar-sq-noun-wtonALhR",
      glosses: ["scientist"],
    });
    expect(senses[0]?.categories).toContainEqual(occupations());
    expect(target.etymologyTemplates).toEqual([{
      name: "suffix",
      args: { "1": "sq", "2": "shkencë", "3": "tar" },
      expansion: "shkencë + -tar",
    }]);
    expect(target.etymologyLinks).toEqual([
      { sourceForm: "shkencë", reference: "shkencë#Albanian" },
      { sourceForm: "-tar", reference: "-tar#Albanian" },
    ]);

    const componentReading = reading.sourceLinkedComponentReading as Record<string, unknown>;
    expect(componentReading).toMatchObject({
      status: "SUPPORTED",
      relation: {
        relation: "SOURCE_AUTHORED_SUFFIX_TEMPLATE",
        primarySourceRecordId: target.sourceRecordId,
        primaryEntryLocator: target.entryLocator,
        sourceAuthoredExplanation: "From shkencë + -tar.",
        references: [
          { sourceForm: "shkencë", reference: "shkencë#Albanian" },
          { sourceForm: "-tar", reference: "-tar#Albanian" },
        ],
      },
      functionalHypothesis: {
        status: "UNKNOWN_OR_NULL",
        functionalOperation: null,
        noSingleWinner: true,
        userDecisionPosture: "user_decides",
      },
    });
    const bridge = functionalBridge(reading);
    expect(bridge.status).toBe("SUPPORTED");
    expect(bridge.relatedForm).toBeNull();
    expect(bridge.derivedStructure).toBeNull();
    const hypothesis = bridge.functionalHypothesis as Record<string, unknown>;
    expect(hypothesis).toMatchObject({
      status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
      functionalOperation: "AGENT",
      basis: expect.arrayContaining([
        "SOURCE_ATTESTED_TARGET_ROLE_CATEGORY",
        "TARGET_SOURCE_AUTHORED_SUFFIX_TEMPLATE",
        "SOURCE_STRUCTURED_ALBANIAN_REFERENCES",
      ]),
    });
    expect(hypothesis.statement).toContain("source sense en-shkencëtar-sq-noun-wtonALhR (“scientist”)");
    expect(hypothesis.statement).toContain("category source: w");
    expect(hypothesis.statement).toContain("-tar → -tar#Albanian");
    expect(hypothesis.statement).toContain("do not create a base-side SOURCE_DERIVED_FORM assertion");
    expect(hypothesis.claimBoundary).toContain("No target-to-base sense alignment");
    expect(hypothesis.claimBoundary).toContain("suffix semantics");

    const vm = adaptAnalysisToTelemetryVM(realShkencetarBody);
    expect(vm.motivationDiscoveryV0_1?.kind).toBe("present");
    if (vm.motivationDiscoveryV0_1?.kind !== "present") throw new Error("Real Discovery did not project to the UI model.");
    render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
    expect(screen.getByTestId("albanian-reading-meaning")).toHaveTextContent("scientist");
    expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
    expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("shkencëtar");
    expect(screen.getByTestId("albanian-reading-functional-bridge-derived-structure-null")).toHaveTextContent("Null");
    expect(screen.getByTestId("albanian-source-linked-component-relation")).toHaveTextContent("no suffix function is inferred");
    expect(screen.getByTestId("albanian-reading-voice-path").textContent).toBeTruthy();
  });

  it("preserves real-source base, AF, AGENT, compound, and Null controls", async () => {
    const outputs: Record<string, { status: unknown; operation: unknown; relation: unknown }> = {};
    for (const word of ["shkencë", "orëndreqës", "zjarrfikës", "pelar", "bletar", "luleshitës", "fuzhnjar", "thëngjilltar", "gjitar", "kombëtar"]) {
      const reading = realReading(await realDiscovery(word));
      const bridge = functionalBridge(reading);
      outputs[word] = {
        status: bridge.status,
        operation: (bridge.functionalHypothesis as Record<string, unknown>).functionalOperation,
        relation: (reading.sourceLinkedComparison as Record<string, unknown> | null)?.relation
          ? ((reading.sourceLinkedComparison as Record<string, unknown>).relation as Record<string, unknown>).relation
          : (reading.sourceLinkedComponentReading as Record<string, unknown> | null)?.relation
            ? (((reading.sourceLinkedComponentReading as Record<string, unknown>).relation as Record<string, unknown>).relation)
            : null,
      };
    }
    expect(outputs["shkencë"]).toMatchObject({ status: "SUPPORTED", operation: "AGENT", relation: "SOURCE_RELATED_FORM" });
    expect(outputs["orëndreqës"]).toMatchObject({ status: "SUPPORTED", operation: "AGENT", relation: "SOURCE_AUTHORED_AF_TEMPLATE" });
    expect(outputs["pelar"]).toMatchObject({ status: "SUPPORTED", operation: "AGENT" });
    for (const word of ["zjarrfikës", "bletar", "luleshitës", "fuzhnjar", "thëngjilltar", "gjitar", "kombëtar"]) {
      expect(outputs[word]).toMatchObject({ status: "NULL", operation: null });
    }
  });

  it.each([
    ["foreign references", { etymologyLinks: [
      { sourceForm: "testbase", reference: "testbase#French" },
      { sourceForm: "-tar", reference: "-tar#Albanian" },
    ] }],
    ["missing suffix reference", { etymologyLinks: [{ sourceForm: "testbase", reference: "testbase#Albanian" }] }],
    ["duplicate references", { etymologyLinks: [
      { sourceForm: "testbase", reference: "testbase#Albanian" },
      { sourceForm: "testbase", reference: "testbase#Albanian" },
    ] }],
    ["misleading expansion", { etymologyTemplates: [{
      name: "suffix", args: { "1": "sq", "2": "testbase", "3": "tar" }, expansion: "testbase + -er",
    }] }],
    ["extra template arguments", { etymologyTemplates: [{
      name: "suffix", args: { "1": "sq", "2": "testbase", "3": "tar", t1: "person" }, expansion: "testbase + -tar",
    }] }],
    ["source-authored explanation mismatch", { etymologyText: "Not from testbase + -tar." }],
    ["wrong target POS", { partOfSpeech: "adj" }],
    ["disambiguated rather than exact w category", { senses: [{
      senseId: "synthetic-test-sense", glosses: ["test role"], categories: [occupations("w+disamb")],
    }] }],
    ["missing role category", { senses: [{ senseId: "synthetic-test-sense", glosses: ["test role"] }] }],
    ["ambiguous qualifying senses", { senses: [
      { senseId: "synthetic-test-sense", glosses: ["test role"], categories: [occupations()] },
      { senseId: "synthetic-second-sense", glosses: ["another role"], categories: [occupations()] },
    ] }],
  ])("fails closed for %s", async (_case, overrides) => {
    const discovery = await syntheticDiscovery([syntheticSuffixTarget(overrides as Partial<AlbanianKaikkiExactLexicalSourceFactV0_1>)]);
    const reading = realReading(discovery);
    const bridge = functionalBridge(reading);
    expect(bridge.status).not.toBe("SUPPORTED");
    expect((bridge.functionalHypothesis as Record<string, unknown>).functionalOperation).toBeNull();
  });

  it("rejects duplicate target records without choosing a source winner", async () => {
    const first = syntheticSuffixTarget();
    const second = syntheticSuffixTarget({
      sourceRecordId: "synthetic-test:word=testlexeme:ordinal=1",
      entryLocator: "synthetic://word/testlexeme/1",
      physicalRecordOrdinal: 2,
    });
    const reading = realReading(await syntheticDiscovery([first, second]));
    const bridge = functionalBridge(reading);
    expect(bridge.status).toBe("NULL");
    expect(bridge.reasonCodes).toContain("SOURCE_TARGET_RECORD_IDENTITY_AMBIGUOUS");
    expect((bridge.functionalHypothesis as Record<string, unknown>).functionalOperation).toBeNull();
  });

  it("rejects tampered suffix relation, reference, and role-category payloads in the adapter", () => {
    const cases: readonly [string, (body: ApiBody) => void][] = [
      ["relation", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const component = reading.sourceLinkedComponentReading as Record<string, unknown>;
        (component.relation as Record<string, unknown>).relation = "SOURCE_AUTHORED_AF_TEMPLATE";
      }],
      ["reference", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        const links = target.etymologyLinks as Record<string, unknown>[];
        links[1]!.reference = "-tar#French";
      }],
      ["category", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        const senses = target.senses as Record<string, unknown>[];
        const categories = senses[0]!.categories as Record<string, unknown>[];
        const occupation = categories.find((category) => category.orig === "sq:Occupations")!;
        occupation.source = "w+disamb";
      }],
    ];
    for (const [_label, mutate] of cases) {
      const tampered = JSON.parse(JSON.stringify(realShkencetarBody)) as ApiBody;
      mutate(tampered);
      expect(adaptAnalysisToTelemetryVM(tampered).motivationDiscoveryV0_1?.kind).not.toBe("present");
    }
  });
});
