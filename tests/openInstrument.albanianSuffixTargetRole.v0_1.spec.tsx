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
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";
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

function syntheticDirectOccupationRoleTarget(overrides: Partial<AlbanianKaikkiExactLexicalSourceFactV0_1> = {}) {
  return syntheticSuffixTarget({
    sourceRecordId: "kaikki-albanian-jsonl:word=administronj%C3%ABs:ordinal=0",
    entryLocator: "jsonl://word/administronj%C3%ABs/match/0",
    physicalRecordOrdinal: 545,
    form: "administronjës",
    senses: [{
      senseId: "en-administronjës-sq-noun-aYSRYity",
      glosses: ["manager, administrator"],
      categories: [occupations()],
    }],
    etymologyText: "Compare administroj.",
    etymologyLinks: [{ sourceForm: "administroj", reference: "administroj#Albanian" }],
    etymologyTemplates: [],
    sourceSnapshot: {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    },
    ...overrides,
  });
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

const describeWithRealSource = SOURCE_PATH ? describe : describe.skip;

describeWithRealSource("source-authored suffix direct-target AGENT with the frozen source", () => {
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
      const discovery = await realDiscovery(word);
      const reading = realReading(discovery);
      const bridge = functionalBridge(reading);
      if (["shkencë", "orëndreqës", "pelar"].includes(word)) {
        expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery }).motivationDiscoveryV0_1?.kind)
          .toBe("present");
      }
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
    expect(outputs["bletar"]).toMatchObject({
      status: "SUPPORTED",
      operation: "AGENT",
    });
    for (const word of ["zjarrfikës", "luleshitës", "fuzhnjar", "thëngjilltar", "gjitar", "kombëtar"]) {
      expect(outputs[word]).toMatchObject({ status: "NULL", operation: null });
    }
  });
});

describe("source-authored suffix direct-target AGENT synthetic controls", () => {
  it("keeps the source-bounded AGENT reading visible in the default Overview when the exact source omits its optional template field", async () => {
    const target = syntheticDirectOccupationRoleTarget({
      senses: [
        {
          senseId: "en-administronjës-sq-noun-aYSRYity",
          glosses: ["manager, administrator"],
          categories: [occupations()],
        },
        {
          senseId: "administronjës-alternative-sense",
          glosses: ["an additional source sense"],
          categories: [],
        },
      ],
    });
    delete target.etymologyTemplates;
    const discovery = await syntheticDiscovery([target], "administronjës");
    const exactFacts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
    expect(exactFacts[0]).not.toHaveProperty("etymologyTemplates");
    const reading = discovery.albanianLexicalReading as Record<string, unknown>;
    const roleBatch = reading.occupationalRoleResearchCandidates as Record<string, unknown>;
    const roleCandidates = roleBatch.candidates as Record<string, unknown>[];
    expect((roleCandidates[0]?.sourceRecord as Record<string, unknown>).etymologyTemplates).toEqual([]);

    const sourceSense = exactFacts[0]?.senses as Record<string, unknown>[];
    expect(sourceSense).toHaveLength(2);
    const baseResponse = await GET(new Request(
      "http://localhost/api/analyze-v1?word=administronj%C3%ABs&mode=strict&alphabet=albanian&language=sq&providerExecution=disabled",
    ));
    expect(baseResponse.status).toBe(200);
    const body = await baseResponse.json() as ApiBody;
    body.motivationDiscoveryV0_1 = discovery;

    const vm = adaptAnalysisToTelemetryVM(body);
    expect(vm.motivationDiscoveryV0_1?.kind).toBe("present");
    render(<InstrumentPanel payload={body} />);

    const primary = screen.getByTestId("primary-albanian-reading");
    expect(primary).toHaveTextContent("Albanian word reading");
    expect(primary).toHaveTextContent("Kaikki Albanian · administronjës · noun");
    expect(primary).toHaveTextContent("en-administronjës-sq-noun-aYSRYity");
    expect(primary).toHaveTextContent("Source meaning: manager, administrator");
    expect(primary).toHaveTextContent("sq:Occupations · source w");
    expect(primary).toHaveTextContent("Functional role: AGENT · exploratory");
    expect(primary).toHaveTextContent(
      "Source evidence for this exact reading supports this exploratory classification.",
    );
    expect(primary).not.toHaveTextContent("occupational category supports this exploratory classification");
    expect(primary).toHaveTextContent("Independent embryo meaning or function: UNKNOWN_OR_NULL");
    expect(primary).toHaveTextContent("Historical derivation: not established by these source facts.");
    expect(primary).not.toHaveTextContent("Compare administroj.");
    expect(primary).toHaveTextContent("an additional source sense");
    expect(screen.getByTestId("motivation-discovery-card")).toHaveTextContent(
      "Source-authored etymology (attributed): Compare administroj.",
    );

    const candidateStatus = screen.getByLabelText("Canonical candidate / reviewed evidence status");
    expect(candidateStatus).toHaveTextContent("null_no_supported_candidate");
    expect(candidateStatus).not.toHaveTextContent("Functional / candidate status");
    expect(screen.getAllByText("No canonical candidate is established.").length).toBeGreaterThan(0);
    expect(screen.queryByText("No supported functional candidate yet.")).not.toBeInTheDocument();
    const spoken = screen.getByTestId("spoken-pronunciation-overview");
    expect(primary.compareDocumentPosition(spoken) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    const discoveryCard = screen.getByTestId("motivation-discovery-card");
    expect(primary.compareDocumentPosition(discoveryCard) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("rejects an omitted template field when the pinned candidate projection does not match the exact source record", async () => {
    const target = syntheticDirectOccupationRoleTarget();
    delete target.etymologyTemplates;
    const discovery = JSON.parse(JSON.stringify(
      await syntheticDiscovery([target], "administronjës"),
    )) as Discovery;
    const reading = discovery.albanianLexicalReading as Record<string, unknown>;
    const roleBatch = reading.occupationalRoleResearchCandidates as Record<string, unknown>;
    const roleCandidates = roleBatch.candidates as Record<string, unknown>[];
    const sourceRecord = roleCandidates[0]?.sourceRecord as Record<string, unknown>;
    const links = sourceRecord.etymologyLinks as Record<string, unknown>[];
    links[0]!.reference = "unrelated#Albanian";

    expect(adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery }).motivationDiscoveryV0_1)
      .toMatchObject({ kind: "missing", missing: "malformed" });
  });

  it("supports an exact occupation sense when the source has no validated morphology template", async () => {
    const discovery = await syntheticDiscovery([syntheticDirectOccupationRoleTarget()], "administronjës");
    const reading = realReading(discovery);
    const bridge = functionalBridge(reading);
    expect(reading.primarySourceFact).toMatchObject({
      sourceRecordId: "kaikki-albanian-jsonl:word=administronj%C3%ABs:ordinal=0",
      form: "administronjës",
      meaningGlosses: ["manager, administrator"],
    });
    expect(bridge).toMatchObject({
      status: "SUPPORTED",
      relatedForm: null,
      functionalHypothesis: {
        status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
        functionalOperation: "AGENT",
        basis: expect.arrayContaining([
          "SOURCE_ATTESTED_TARGET_ROLE_CATEGORY",
          "SOURCE_ATTESTED_FINAL_SENSE_CATEGORY",
          "TARGET_SOURCE_ROLE_HAS_NO_VALIDATED_COMPONENT_TEMPLATE",
        ]),
      },
    });
    const hypothesis = bridge.functionalHypothesis as Record<string, unknown>;
    expect(hypothesis.statement).toEqual(expect.stringContaining("manager, administrator"));
    expect(hypothesis.statement).toEqual(expect.stringContaining("does not assert morphology"));
    expect(hypothesis.claimBoundary).toEqual(expect.stringContaining("No source component template or base relation is present"));

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
    if (vm.motivationDiscoveryV0_1?.kind === "present") {
      render(createElement(MotivationDiscoveryCardV0_1, { discovery: vm.motivationDiscoveryV0_1 }));
      expect(screen.getByTestId("albanian-reading-meaning")).toHaveTextContent("manager, administrator");
      expect(screen.getByTestId("albanian-reading-functional-bridge-operation")).toHaveTextContent("Functional operation: AGENT");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("administronjës");
      expect(screen.getByTestId("albanian-reading-functional-bridge")).toHaveTextContent("does not assert morphology");
    }
  });

  it.each(["absent", "explicitly empty"] as const)(
    "renders a direct occupation reading when exact-source etymology links are %s and no batch fallback exists",
    async (linkState) => {
      const target = syntheticDirectOccupationRoleTarget({
        sourceRecordId: "kaikki-albanian-jsonl:word=nd%C3%ABrtues:ordinal=0",
        entryLocator: "jsonl://word/nd%C3%ABrtues/match/0",
        physicalRecordOrdinal: 17896,
        form: "ndërtues",
        senses: [{
          senseId: "en-ndërtues-sq-noun-32sHF2qb",
          glosses: ["builder"],
          categories: [occupations()],
        }],
        etymologyText: null,
        etymologyLinks: linkState === "explicitly empty" ? [] : undefined,
        etymologyTemplates: undefined,
      });
      if (linkState === "absent") delete target.etymologyLinks;
      delete target.etymologyTemplates;

      const discovery = await syntheticDiscovery([target], "ndërtues");
      expect(discovery.status).toBe("NO_MATCHES");
      expect(discovery.exactLexicalSourceStatus).toMatchObject({ status: "MATCHES_FOUND" });
      expect(discovery.exactLexicalSourceFacts).toEqual([
        expect.objectContaining({
          sourceRecordId: "kaikki-albanian-jsonl:word=nd%C3%ABrtues:ordinal=0",
          form: "ndërtues",
          partOfSpeech: "noun",
          etymologyText: null,
          senses: [expect.objectContaining({
            senseId: "en-ndërtues-sq-noun-32sHF2qb",
            glosses: ["builder"],
            categories: [expect.objectContaining({
              name: "Occupations",
              orig: "sq:Occupations",
              source: "w",
            })],
          })],
        }),
      ]);
      expect(functionalBridge(realReading(discovery))).toMatchObject({
        status: "SUPPORTED",
        functionalHypothesis: {
          status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
          functionalOperation: "AGENT",
        },
      });

      const response = await GET(new Request(
        "http://localhost/api/analyze-v1?word=nd%C3%ABrtues&mode=strict&alphabet=albanian&language=sq&providerExecution=disabled",
      ));
      expect(response.status).toBe(200);
      const body = await response.json() as ApiBody;
      body.motivationDiscoveryV0_1 = discovery;

      const vm = adaptAnalysisToTelemetryVM(body);
      expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "present" });
      render(<InstrumentPanel payload={body} />);

      const primary = screen.getByTestId("primary-albanian-reading");
      expect(primary).toHaveTextContent("Kaikki Albanian · ndërtues · noun");
      expect(primary).toHaveTextContent("en-ndërtues-sq-noun-32sHF2qb");
      expect(primary).toHaveTextContent("Source meaning: builder");
      expect(primary).toHaveTextContent("sq:Occupations · source w");
      expect(primary).toHaveTextContent("Functional role: AGENT · exploratory");
      expect(primary).toHaveTextContent(
        "Source evidence for this exact reading supports this exploratory classification.",
      );
      expect(screen.getByTestId("primary-albanian-unknown-null"))
        .toHaveTextContent("Independent embryo meaning or function: UNKNOWN_OR_NULL.");
      expect(screen.getByTestId("primary-albanian-structural-status"))
        .toHaveTextContent("candidate_only");
      expect(screen.getByTestId("primary-albanian-structural-status"))
        .toHaveTextContent("Generic Voice-profile hypothesis available for ndërtues.");
    },
  );

  it("rejects malformed non-array etymology links instead of treating them as absent", async () => {
    const target = syntheticDirectOccupationRoleTarget({
      sourceRecordId: "kaikki-albanian-jsonl:word=nd%C3%ABrtues:ordinal=0",
      entryLocator: "jsonl://word/nd%C3%ABrtues/match/0",
      physicalRecordOrdinal: 17896,
      form: "ndërtues",
      senses: [{
        senseId: "en-ndërtues-sq-noun-32sHF2qb",
        glosses: ["builder"],
        categories: [occupations()],
      }],
      etymologyText: null,
      etymologyLinks: [],
      etymologyTemplates: undefined,
    });
    delete target.etymologyTemplates;

    const discovery = await syntheticDiscovery([target], "ndërtues");
    expect(functionalBridge(realReading(discovery))).toMatchObject({
      status: "SUPPORTED",
      functionalHypothesis: {
        status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
        functionalOperation: "AGENT",
      },
    });

    const exactFacts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
    for (const malformedLinks of [undefined, { malformed: true }]) {
      exactFacts[0]!.etymologyLinks = malformedLinks;
      const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: discovery } as ApiBody);
      expect(vm.motivationDiscoveryV0_1).toMatchObject({ kind: "missing", missing: "malformed" });
    }
  });

  it("keeps duplicate template-free occupation records ambiguous", async () => {
    const first = syntheticDirectOccupationRoleTarget();
    const second = syntheticDirectOccupationRoleTarget({
      sourceRecordId: "kaikki-albanian-jsonl:word=administronj%C3%ABs:ordinal=1",
      entryLocator: "jsonl://word/administronj%C3%ABs/match/1",
      physicalRecordOrdinal: 546,
    });
    const reading = realReading(await syntheticDiscovery([first, second], "administronjës"));
    const bridge = functionalBridge(reading);
    expect(bridge.status).toBe("NULL");
    expect(bridge.reasonCodes).toContain("SOURCE_TARGET_RECORD_IDENTITY_AMBIGUOUS");
    expect((bridge.functionalHypothesis as Record<string, unknown>).functionalOperation).toBeNull();
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
});

describeWithRealSource("source-authored suffix direct-target AGENT adapter tampering with the frozen source", () => {
  it("rejects altered source identity, sense meaning, statement, basis, and template evidence in the adapter", () => {
    const cases: readonly [string, (body: ApiBody) => void][] = [
      ["source SHA-256", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        (target.sourceSnapshot as Record<string, unknown>).sha256 = "0".repeat(64);
      }],
      ["source URL", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        (target.sourceSnapshot as Record<string, unknown>).sourceUrl = "https://example.invalid/dictionary.jsonl";
      }],
      ["source family", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        (target.sourceSnapshot as Record<string, unknown>).sourceFamilyId = "other-source-v1";
      }],
      ["source byte count", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        (target.sourceSnapshot as Record<string, unknown>).bytes = SOURCE_BYTES + 1;
      }],
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
      ["projected role-sense gloss", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const bridge = reading.functionalMeaningBridge as Record<string, unknown>;
        const sourceFacts = bridge.sourceFacts as Record<string, unknown>;
        const primary = sourceFacts.primary as Record<string, unknown>;
        const senses = primary.sourceSenses as Record<string, unknown>[];
        (senses[0]!.glosses as string[])[0] = "an unsupported meaning";
      }],
      ["raw role-sense gloss", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        const senses = target.senses as Record<string, unknown>[];
        (senses[0]!.glosses as string[])[0] = "an unsupported meaning";
      }],
      ["component source-sense projection", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const component = reading.sourceLinkedComponentReading as Record<string, unknown>;
        const primary = component.primary as Record<string, unknown>;
        const senses = primary.sourceSenses as Record<string, unknown>[];
        (senses[0]!.glosses as string[])[0] = "an unsupported meaning";
      }],
      ["bridge meaning gloss", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const bridge = reading.functionalMeaningBridge as Record<string, unknown>;
        const sourceFacts = bridge.sourceFacts as Record<string, unknown>;
        (sourceFacts.primary as Record<string, unknown>).meaningGlosses = ["an unsupported meaning"];
      }],
      ["displayed statement", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const bridge = reading.functionalMeaningBridge as Record<string, unknown>;
        (bridge.functionalHypothesis as Record<string, unknown>).statement =
          "This unsupported text replaces the source-bounded explanation.";
      }],
      ["substituted projected source sense", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const bridge = reading.functionalMeaningBridge as Record<string, unknown>;
        const sourceFacts = bridge.sourceFacts as Record<string, unknown>;
        const senses = (sourceFacts.primary as Record<string, unknown>).sourceSenses as Record<string, unknown>[];
        senses[0]!.senseId = "unattested-target-sense";
      }],
      ["missing raw target sense", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        target.senses = [];
      }],
      ["removed direct-target basis marker", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const bridge = reading.functionalMeaningBridge as Record<string, unknown>;
        const hypothesis = bridge.functionalHypothesis as Record<string, unknown>;
        hypothesis.basis = (hypothesis.basis as string[]).filter((item) =>
          item !== "SOURCE_ATTESTED_TARGET_ROLE_CATEGORY",
        );
      }],
      ["missing suffix evidence basis", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const bridge = reading.functionalMeaningBridge as Record<string, unknown>;
        const hypothesis = bridge.functionalHypothesis as Record<string, unknown>;
        hypothesis.basis = (hypothesis.basis as string[]).filter((item) =>
          item !== "TARGET_SOURCE_AUTHORED_SUFFIX_TEMPLATE",
        );
      }],
      ["manipulated direct-target basis marker", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const bridge = reading.functionalMeaningBridge as Record<string, unknown>;
        const hypothesis = bridge.functionalHypothesis as Record<string, unknown>;
        hypothesis.basis = (hypothesis.basis as string[]).map((item) =>
          item === "SOURCE_ATTESTED_TARGET_ROLE_CATEGORY" ? "UNREVIEWED_TARGET_ROLE" : item,
        );
      }],
      ["forged template base", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const facts = discovery.exactLexicalSourceFacts as Record<string, unknown>[];
        const target = facts.find((fact) => fact.form === "shkencëtar")!;
        const templates = target.etymologyTemplates as Record<string, unknown>[];
        (templates[0]!.args as Record<string, unknown>)["2"] = "unattested-base";
      }],
      ["mismatched direct-target record identity", (body) => {
        const discovery = body.motivationDiscoveryV0_1 as Record<string, unknown>;
        const reading = discovery.albanianLexicalReading as Record<string, unknown>;
        const component = reading.sourceLinkedComponentReading as Record<string, unknown>;
        (component.relation as Record<string, unknown>).primarySourceRecordId = "forged-record-id";
      }],
    ];
    for (const [_label, mutate] of cases) {
      const tampered = JSON.parse(JSON.stringify(realShkencetarBody)) as ApiBody;
      mutate(tampered);
      expect(adaptAnalysisToTelemetryVM(tampered).motivationDiscoveryV0_1?.kind).not.toBe("present");
    }
  });
});
