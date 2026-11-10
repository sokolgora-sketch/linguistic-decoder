/** @jest-environment jsdom */
import { cleanup, render, screen } from "@testing-library/react";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildMotivationEngineDiscoveryServerOnlyV0_1,
} from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";
import {
  createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1,
} from "@/shared/openInstrument/albanianKaikkiServerOnlyExactLexicalSource.v0_1";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { PrimaryAlbanianReadingCardV0_1 } from "@/ui/instrument/sections/PrimaryAlbanianReadingCard.v0_1";
import type { MotivationDiscoveryV0_1VM, PresentOrMissing } from "@/ui/telemetry/types";
import { buildHeartInstrumentV1 } from "@/v1/heartInstrument.v1";

afterEach(cleanup);

const TARGET = "zjarrfikës";
const TARGET_RECORD_ID = "synthetic-kaikki:word=zjarrfik%C3%ABs:ordinal=0";
const TARGET_ENTRY_LOCATOR = "synthetic://word/zjarrfik%C3%ABs/0";
const TARGET_SENSE_ID = "synthetic-zjarrfikës-sense";
const PINNED_SOURCE_PATH = process.env.OPEN_INSTRUMENT_ALBANIAN_LEXICAL_SOURCE_PATH;

type FixtureOptions = Readonly<{
  inputWord?: string;
  sourceStatus?: string;
  includeComponentReading?: boolean;
  componentStatus?: "SUPPORTED" | "NULL";
  componentHypothesisStatus?: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" | "UNKNOWN_OR_NULL";
  primaryForm?: string;
  primarySourceRecordId?: string;
  relationSourceRecordId?: string;
  relationKind?: string;
  classifiedOperation?: string | null;
}>;

function sourceRecord(sourceForm: string, sourceRecordId: string, entryLocator: string, senseId: string) {
  return {
    sourceRecordId,
    entryLocator,
    physicalRecordOrdinal: 0,
    form: sourceForm,
    partOfSpeech: "noun",
    meaningGlosses: [sourceForm === "zjarr" ? "fire" : sourceForm === "fik" ? "extinguish; fig" : "suffix"],
    sourceSenses: [{ sourceSenseOrdinal: 0, senseId, glosses: [sourceForm], categories: [] }],
    etymologyText: null,
    etymologyLinks: [],
    etymologyTemplates: [],
    pronunciationVariants: [],
  };
}

function makeDiscovery(options: FixtureOptions = {}): PresentOrMissing<MotivationDiscoveryV0_1VM> {
  const inputWord = options.inputWord ?? TARGET;
  const targetRecordId = options.primarySourceRecordId ?? TARGET_RECORD_ID;
  const targetEntryLocator = TARGET_ENTRY_LOCATOR;
  const componentRecords = [
    sourceRecord("zjarr", "synthetic-kaikki:word=zjarr:ordinal=0", "synthetic://word/zjarr/0", "synthetic-zjarr-sense"),
    sourceRecord("fik", "synthetic-kaikki:word=fik:ordinal=0", "synthetic://word/fik/0", "synthetic-fik-noun-sense"),
    sourceRecord("fik", "synthetic-kaikki:word=fik:ordinal=1", "synthetic://word/fik/1", "synthetic-fik-verb-sense"),
    sourceRecord("-ës", "synthetic-kaikki:word=-%C3%ABs:ordinal=0", "synthetic://word/-%C3%ABs/0", "synthetic-agent-suffix-sense"),
  ];
  const references = [
    { sourceForm: "zjarr", reference: "zjarr#Albanian" },
    { sourceForm: "fik", reference: "fik#Albanian" },
    { sourceForm: "-ës", reference: "-ës#Albanian" },
  ];
  const hypothesisStatus = options.componentHypothesisStatus ?? "EXPLORATORY_FUNCTIONAL_HYPOTHESIS";
  const componentStatus = options.componentStatus ?? "SUPPORTED";
  const componentReading = options.includeComponentReading === false ? null : {
    status: componentStatus,
    reasonCodes: componentStatus === "SUPPORTED" ? [] : ["SYNTHETIC_NULL_CONTROL"],
    relation: {
      relation: options.relationKind ?? "SOURCE_EXPLICIT_THREE_COMPONENT_COMPOUND",
      primarySourceRecordId: options.relationSourceRecordId ?? targetRecordId,
      primaryEntryLocator: targetEntryLocator,
      sourceAuthoredExplanation: "From zjarr + fik + -ës.",
      references,
    },
    primary: sourceRecord(options.primaryForm ?? TARGET, targetRecordId, targetEntryLocator, TARGET_SENSE_ID),
    components: componentRecords,
    componentResolutions: [
      { sourceForm: "zjarr", reference: "zjarr#Albanian", status: "RESOLVED", sourceRecordIds: [componentRecords[0]!.sourceRecordId], reasonCodes: [] },
      { sourceForm: "fik", reference: "fik#Albanian", status: "AMBIGUOUS", sourceRecordIds: [componentRecords[1]!.sourceRecordId, componentRecords[2]!.sourceRecordId], reasonCodes: ["SOURCE_COMPONENT_RECORD_AMBIGUOUS"] },
      { sourceForm: "-ës", reference: "-ës#Albanian", status: "RESOLVED", sourceRecordIds: [componentRecords[3]!.sourceRecordId], reasonCodes: [] },
    ],
    exploratoryRelationship: {
      status: "EXPLORATORY_SOURCE_COMPONENT_RELATION",
      statement: "Source-attributed component relationship retained as an exploratory reading.",
      alternatives: ["Source senses remain alternatives."],
      claimBoundary: "No exact component-to-target sense crosswalk is established.",
    },
    functionalHypothesis: {
      status: hypothesisStatus,
      functionalOperation: null,
      statement: hypothesisStatus === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS"
        ? "If the source-reported component readings apply to this attributed formation, they are consistent with the recorded firefighter meaning."
        : null,
      basis: hypothesisStatus === "EXPLORATORY_FUNCTIONAL_HYPOTHESIS" ? ["SYNTHETIC_SOURCE_LINKED_COMPONENT_FIXTURE"] : [],
      alternatives: ["The component source senses are alternatives; no canonical crosswalk is selected."],
      evidenceRefs: [
        { sourceRecordId: targetRecordId, entryLocator: targetEntryLocator, senseIds: [TARGET_SENSE_ID] },
        ...componentRecords.map((record) => ({ sourceRecordId: record.sourceRecordId, entryLocator: record.entryLocator, senseIds: record.sourceSenses.map((sense) => sense.senseId ?? "") })),
      ],
      reasonCodes: [],
      claimBoundary: "Conditional functional motivation only; no grammatical-role proof, canonical sense selection, operation, derivation, or embryo meaning.",
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    },
    claimBoundary: "Source-attributed components do not establish independent morphology or a target-sense crosswalk.",
  };
  const classifiedOperation = options.classifiedOperation;
  const discovery = {
    schemaVersion: "open-instrument.motivation-engine-discovery.v0_1",
    status: "NO_MATCHES",
    inputWord,
    inputLanguage: "sq",
    inputProfile: "albanian",
    sourceFact: {
      layer: "SOURCE_FACT",
      language: "Albanian",
      profile: "albanian",
      representation: "albanian_profile",
      sourceStatus: options.sourceStatus ?? "MATCHES_FOUND",
      authorityBoundary: "Synthetic UI fixture only.",
    },
    exactLexicalSourceStatus: { status: options.sourceStatus ?? "MATCHES_FOUND" },
    exactLexicalSourceFacts: options.sourceStatus === "UNAVAILABLE" || options.sourceStatus === "SOURCE_NOT_FOUND"
      ? []
      : [{
          sourceRecordId: TARGET_RECORD_ID,
          entryLocator: TARGET_ENTRY_LOCATOR,
          form: TARGET,
          languageCode: "sq",
          partOfSpeech: "noun",
          senses: [{ senseId: TARGET_SENSE_ID, glosses: ["firefighter"], categories: [] }],
        }],
    albanianLexicalReading: {
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId: TARGET_RECORD_ID,
        entryLocator: TARGET_ENTRY_LOCATOR,
        form: TARGET,
        partOfSpeech: "noun",
        meaningGlosses: ["firefighter"],
        etymologyText: "From zjarr + fik + -ës.",
      },
      sourcePronunciation: null,
      relatedForms: [],
      relatedCandidateEvaluations: [],
      functionalFamilyReading: null,
      sourceLinkedComponentReading: componentReading,
      functionalMeaningBridge: classifiedOperation
        ? {
            status: "SUPPORTED",
            functionalHypothesis: {
              status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
              functionalOperation: classifiedOperation,
              statement: "A separate classified functional bridge remains available.",
            },
          }
        : {
            status: "NULL",
            functionalHypothesis: {
              status: "UNKNOWN_OR_NULL",
              functionalOperation: null,
              statement: null,
            },
          },
      composition: { status: "NULL" },
      interpretation: { status: "UNKNOWN_OR_NULL", statement: null, alternatives: [], basis: [], claimBoundary: "Null." },
    },
    derivedStructure: {
      layer: "DERIVED_STRUCTURE",
      voicePath: ["A", "I", "Ë"],
      voicePathSource: "albanian_profile",
      math7: { basis: null, totalMod7: null, principlesPath: [] },
      gamma: { status: "NULL", orderedUnits: [], reason: "Synthetic UI fixture." },
      zeroConsonantalStructuralComposition: { status: "NULL", variants: [], reason: "Synthetic UI fixture." },
      structuralHypotheses: [],
    },
    candidates: [],
    interpretation: { layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS", status: "UNKNOWN_OR_NULL", note: "Synthetic UI fixture." },
    unknownOrNull: { layer: "UNKNOWN_OR_NULL", reason: "Synthetic UI fixture." },
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  } as unknown as MotivationDiscoveryV0_1VM;

  return { kind: "present", value: discovery };
}

describe("primary Albanian conditional component reading", () => {
  it("shows the ordered source-linked exploratory hypothesis without promoting operation or sense identity", () => {
    render(<PrimaryAlbanianReadingCardV0_1 discovery={makeDiscovery()} analysisStatus={undefined} />);

    const primary = screen.getByTestId("primary-albanian-reading");
    const componentHypothesis = screen.getByTestId("primary-albanian-source-component-hypothesis");
    expect(componentHypothesis).toHaveTextContent("EXPLORATORY_FUNCTIONAL_HYPOTHESIS");
    expect(componentHypothesis).toHaveTextContent("Source-attributed component forms (source order): zjarr + fik + -ës");
    expect(componentHypothesis).toHaveTextContent("If the source-reported component readings apply to this attributed formation");
    expect(componentHypothesis).toHaveTextContent("synthetic-kaikki:word=zjarrfik%C3%ABs:ordinal=0");
    expect(componentHypothesis).toHaveTextContent("synthetic-zjarrfikës-sense");
    expect(componentHypothesis).toHaveTextContent("Functional operation: Null — none is classified by this hypothesis.");
    expect(componentHypothesis).toHaveTextContent("Canonical component-sense selection: UNKNOWN_OR_NULL");
    expect(componentHypothesis).toHaveTextContent("Grammatical role: unclassified");
    expect(componentHypothesis).toHaveTextContent("do not establish independent morphology");
    const functionalReading = screen.getByTestId("primary-albanian-functional-reading");
    expect(functionalReading).toHaveTextContent("No functional operation is classified for this source reading.");
    expect(functionalReading).toHaveTextContent("A separate source-linked conditional component hypothesis is shown below");
    expect(functionalReading).toHaveTextContent("canonical component-sense selection and independent embryo meaning remain UNKNOWN_OR_NULL.");
    expect(functionalReading).not.toHaveTextContent("no supported functional interpretation is emitted");
    expect(primary).toHaveTextContent("Independent embryo meaning or function: UNKNOWN_OR_NULL.");
    expect(primary).not.toHaveTextContent("Functional role: AGENT");
  });

  it("keeps a separately supported classified bridge visible alongside the conditional component reading", () => {
    render(<PrimaryAlbanianReadingCardV0_1 discovery={makeDiscovery({ classifiedOperation: "AGENT" })} analysisStatus={undefined} />);

    expect(screen.getByTestId("primary-albanian-reading")).toHaveTextContent("Functional role: AGENT · exploratory");
    expect(screen.getByTestId("primary-albanian-source-component-hypothesis")).toHaveTextContent("EXPLORATORY_FUNCTIONAL_HYPOTHESIS");
    expect(screen.getByTestId("primary-albanian-unknown-null")).toHaveTextContent("Independent embryo meaning or function: UNKNOWN_OR_NULL.");
  });

  it.each([
    ["no source-linked relation", { includeComponentReading: false }],
    ["unavailable exact source", { sourceStatus: "UNAVAILABLE" }],
    ["source record not found", { sourceStatus: "SOURCE_NOT_FOUND" }],
    ["Null component hypothesis", { componentHypothesisStatus: "UNKNOWN_OR_NULL" }],
    ["Null component relation", { componentStatus: "NULL" }],
    ["unsupported component relation", { relationKind: "SOURCE_COMPOUND_ARITY_UNSUPPORTED" }],
  ] as const)("keeps %s at Unknown/Null", (_label, options) => {
    render(<PrimaryAlbanianReadingCardV0_1 discovery={makeDiscovery(options)} analysisStatus={undefined} />);
    expect(screen.queryByTestId("primary-albanian-source-component-hypothesis")).not.toBeInTheDocument();
    expect(screen.getByTestId("primary-albanian-functional-reading")).toHaveTextContent(
      "UNKNOWN_OR_NULL · no supported functional interpretation is emitted for this exact source reading.",
    );
  });

  it.each([
    ["a source-record mismatch", { primarySourceRecordId: "synthetic-kaikki:word=other:ordinal=0" }],
    ["a query/form mismatch", { primaryForm: "another-word" }],
    ["a relation-to-primary mismatch", { relationSourceRecordId: "unbound-source-record" }],
  ] as const)("withholds the component hypothesis for %s", (_label, options) => {
    render(<PrimaryAlbanianReadingCardV0_1 discovery={makeDiscovery(options)} analysisStatus={undefined} />);
    expect(screen.queryByTestId("primary-albanian-source-component-hypothesis")).not.toBeInTheDocument();
  });

  it("preserves other classified functional readings when no component hypothesis is available", () => {
    render(<PrimaryAlbanianReadingCardV0_1 discovery={makeDiscovery({
      includeComponentReading: false,
      classifiedOperation: "ENABLE_PASSAGE",
    })} analysisStatus={undefined} />);

    expect(screen.getByTestId("primary-albanian-reading")).toHaveTextContent("Functional role: ENABLE_PASSAGE · exploratory");
    expect(screen.queryByTestId("primary-albanian-source-component-hypothesis")).not.toBeInTheDocument();
  });

  (PINNED_SOURCE_PATH ? it : it.skip)("renders the existing conditional hypothesis from the pinned zjarrfikës source record", async () => {
    if (!PINNED_SOURCE_PATH) throw new Error("Pinned Albanian Kaikki source path was not supplied.");
    const word = "zjarrfikës";
    const provider = await createAlbanianKaikkiServerOnlyExactLexicalSourceProviderV0_1(PINNED_SOURCE_PATH);
    const analysis = await runAnalysisDeterministic(word, { mode: "strict", alphabet: "albanian" });
    const result = await buildMotivationEngineDiscoveryServerOnlyV0_1({
      word,
      inputLanguage: "sq",
      inputProfile: "albanian",
      analysis: enginePayloadToAnalysisResult(analysis),
      heart: buildHeartInstrumentV1(word),
      albanianLexicalSourceProvider: provider,
    });
    const sourceComponentReading = result.discovery.albanianLexicalReading.sourceLinkedComponentReading;
    expect(sourceComponentReading).toMatchObject({
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
      functionalHypothesis: {
        status: "EXPLORATORY_FUNCTIONAL_HYPOTHESIS",
        functionalOperation: null,
      },
    });

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: result.discovery });
    expect(vm.motivationDiscoveryV0_1?.kind).toBe("present");
    if (vm.motivationDiscoveryV0_1?.kind !== "present") throw new Error("Pinned-source discovery did not adapt to the UI model.");
    render(<PrimaryAlbanianReadingCardV0_1 discovery={vm.motivationDiscoveryV0_1} analysisStatus={undefined} />);

    const componentHypothesis = screen.getByTestId("primary-albanian-source-component-hypothesis");
    expect(componentHypothesis).toHaveTextContent("Source-attributed component forms (source order): zjarr + fik + -ës");
    expect(componentHypothesis).toHaveTextContent("EXPLORATORY_FUNCTIONAL_HYPOTHESIS");
    expect(componentHypothesis).toHaveTextContent("Research-level functional hypothesis only.");
    expect(componentHypothesis).toHaveTextContent("Evidence references:");
    expect(componentHypothesis).toHaveTextContent("en-fik-sq-verb-3UhMn1WK");
    expect(componentHypothesis).toHaveTextContent("Canonical component-sense selection: UNKNOWN_OR_NULL");
    expect(componentHypothesis).toHaveTextContent("functionalOperation, composition, embryo function, and independent historical claims remain Null.");
    expect(componentHypothesis).toHaveTextContent("Functional operation: Null — none is classified by this hypothesis.");
    expect(screen.getByTestId("primary-albanian-unknown-null")).toHaveTextContent("Independent embryo meaning or function: UNKNOWN_OR_NULL.");
  });
});
