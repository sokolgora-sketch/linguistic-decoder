import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import { HumanReadingSummaryCardV0_1 } from "@/ui/instrument/sections/HumanReadingSummaryCardV0_1";
import { buildHumanReadingSummaryV0_1 } from "@/ui/instrument/sections/humanReadingSummaryAdapter.v0_1";
import {
  buildCurrentWordFunctionalReasoningV0_1,
  type RuntimeFjaloriFamilyFormResponseV0_1,
  type RuntimeFjaloriSourceResponseV0_1,
} from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";
import {
  aggregateMotivationDiscoveryCandidatesV0_1,
  measureMotivationDiscoveryAggregationV0_1,
} from "@/ui/instrument/motivationDiscoveryPresentationAggregation.v0_1";
import { analyzeStructuralInputV0_2 } from "@/shared/structuralHypothesisDiscovery.v0_2";
import type { MotivationDiscoveryV0_1VM } from "@/ui/telemetry/types";
import type { AlbanianLexicalReadingV0_1 } from "@/shared/openInstrument/motivationEngineDiscoveryServerOnly.v0_1";

function model(overrides: Partial<MotivationDiscoveryV0_1VM> = {}): MotivationDiscoveryV0_1VM {
  const inputWord = overrides.inputWord ?? "study";
  const writtenAnalysis = analyzeStructuralInputV0_2(inputWord);
  return {
    schemaVersion: "open-instrument.motivation-engine-discovery.v0_1",
    status: "MATCHES_FOUND",
    inputWord,
    inputLanguage: "en",
    inputProfile: "open-instrument.cmudict-arpabet-en-us.v0_1",
    sourceFact: {
      layer: "SOURCE_FACT",
      language: "en",
      profile: "open-instrument.cmudict-arpabet-en-us.v0_1",
      representation: "production_spoken",
      sourceStatus: "production_authoritative_pronunciation",
      authorityBoundary: "existing production source",
    },
    derivedStructure: {
      layer: "DERIVED_STRUCTURE",
      voicePath: ["Ë", "I"],
      voicePathSource: "production_spoken",
      voicePathProvenance: {
        writtenInput: {
          inputForm: writtenAnalysis.inputForm,
          analysisStatus: writtenAnalysis.analysisStatus,
          inputVoiceSequenceStatus: writtenAnalysis.inputVoiceSequenceStatus,
          inputVoiceEventCount: writtenAnalysis.inputVoiceEventCount,
          voicePath: writtenAnalysis.inputVoiceEvents.map((event) => event.voice),
          events: writtenAnalysis.inputVoiceEvents,
          representationAuthority: "orthographic",
          pronunciationAuthority: "not_established",
        },
        selectedPath: {
          voicePath: ["Ë", "I"],
          selectionKind: "production_spoken",
          legacySource: "production_spoken",
          relationshipToWritten: "not_comparable",
        },
      },
      math7: { basis: "ËI", totalMod7: 3, principlesPath: ["EVOLUTION", "INSIGHT"] },
      gamma: { status: "source_pronunciation", orderedUnits: ["S", "T", "D"], reason: null },
      zeroConsonantalStructuralComposition: {
        status: "source_pronunciation",
        variants: [{ p: 2, i: [1], s: 0, d: [2, 1, 0], a: 2 }],
        reason: null,
      },
      structuralHypotheses: [],
    },
    candidates: [{
      candidateId: "discovery:study:di",
      candidateLanguage: "sq",
      candidateForm: "di",
      candidateGloss: "know / knowledge",
      candidateEmbryo: "DI",
      candidateVoicePath: ["I"],
      sourceFact: {
        sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
        sourceStatus: "reviewed_accepted",
        attestationTruth: "fact",
        evidenceRefs: ["reviewed.external.di.knowledge.candidate.citation.v0_1"],
        sourceUrlOrArchiveRef: "https://example.invalid/di",
        entryLocator: "Albanian > di",
      },
      derivedStructure: {
        minRootId: "study:SHTU+DI:1",
        protoRoots: ["SHTU", "DI"],
        carrierForms: ["shtu", "di"],
        operationIds: ["y_to_i"],
      },
      structuralComparison: {
        matchClassification: "STRUCTURAL_MOTIVATION_CANDIDATE",
        presentationClassification: "STRUCTURAL_MOTIVATION",
        matchedQuery: "DI",
        inputRepresentationKind: "production_spoken",
        candidateRepresentationKind: "orthographic_profile_derived",
        representationCompatibility: "CROSS_REPRESENTATION",
        inputVoicePath: ["Ë", "I"],
        candidateVoicePath: ["I"],
        voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
        inputConsonantalStructure: {
          gamma: ["S", "T", "D"],
          zeroConsonantalStructuralComposition: [{ p: 2 }],
          minRootId: "study:SHTU+DI:1",
          protoRoots: ["SHTU", "DI"],
          carrierForms: ["shtu", "di"],
          operationIds: ["y_to_i"],
        },
        candidateConsonantalStructure: null,
        consonantalCarrierRelationship: "INPUT_CARRIER_CONTEXT_ONLY",
        expansionOrCompositionChain: [],
        authorizedOperationIds: ["y_to_i"],
        reasonCodes: [],
        unresolvedFields: [
          "CANDIDATE_CONSONANTAL_STRUCTURE_NOT_AUTHORIZED",
          "CANDIDATE_ZERO_CONSONANTAL_STRUCTURE_NOT_AUTHORIZED",
        ],
        matchReason: "Input structural analysis produced the DI embryo; the Albanian lexical substrate contains the source-attested di record.",
      },
      functionalInterpretation: {
        status: "REVIEWED_HYPOTHESIS",
        truthClassification: "hypothesis",
        statement: "knowledge can motivate study and learning functionally",
        evidenceKind: "reviewed_functional_evidence",
        evidenceRefs: ["reviewed.external.di.knowledge.candidate.citation.v0_1"],
        reason: null,
      },
      candidateStatus: "experimental",
      historicalRelation: "not_claimed",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    }],
    interpretation: {
      layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS",
      status: "hypothesis",
      note: "hypothesis",
    },
    unknownOrNull: { layer: "UNKNOWN_OR_NULL", reason: null },
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
    ...overrides,
  };
}

const originalFetch = global.fetch;
afterEach(() => {
  global.fetch = originalFetch;
});

describe("Motivation Discovery Lab presentation v0.1", () => {
  it("shows an unselected source-to-function proposal before its collapsed reasoning trace", () => {
    // Synthetic adapter-shaped source response; this proves UI projection only, not live DIJE evidence.
    const response: RuntimeFjaloriSourceResponseV0_1 = {
      requestKey: "DIJE\u0000dije",
      queryForm: "DIJE",
      status: "available",
      exactSourceForm: "dije",
      apiUrl: "https://fjalorishqip.org/api/v1/fjala/dije.json",
      licence: "CC BY-SA 4.0",
      analysisLanguage: "sq",
      analysisVariety: "albanian",
      recordSources: ["sq-wiktionary", "editor"],
      senses: [{
        entryIndex: 1,
        senseIndex: 1,
        partOfSpeech: "noun",
        gloss: "knowledge",
        glossLanguage: "en",
        senseSource: "sq-wiktionary",
        tags: ["noun"],
        entrySources: ["sq-wiktionary", "editor"],
      }, {
        entryIndex: 1,
        senseIndex: 2,
        partOfSpeech: "noun",
        gloss: "news, information",
        glossLanguage: "en",
        senseSource: "sq-wiktionary",
        tags: ["feminine", "regional"],
        entrySources: ["sq-wiktionary", "editor"],
      }],
    };
    const projection = buildCurrentWordFunctionalReasoningV0_1({
      analyzedWord: "DIJE",
      draftTargetWord: "DIJE",
      identityMatches: true,
      language: "sq",
      variety: "albanian",
      exactSourceFacts: [],
      fjaloriSourceResponse: response,
      candidateOnlyOperators: ["DI"],
    });
    const discovery = adaptAnalysisToTelemetryVM({
      motivationDiscoveryV0_1: model({
        inputWord: "DIJE",
        inputLanguage: "sq",
        inputProfile: "albanian",
        exactLexicalSourceFacts: [],
      }),
    }).motivationDiscoveryV0_2;

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ word: "dije", licence: "CC BY-SA 4.0", sources: [], entries: [] }),
    }) as unknown as typeof fetch;
    const summary = buildHumanReadingSummaryV0_1({
      word: "DIJE",
      discovery,
      functionalReasoning: projection,
      runtimeSourceResponse: response,
    });
    render(<>
      <MotivationDiscoveryCardV0_1 discovery={discovery} functionalReasoning={projection} />
      <HumanReadingSummaryCardV0_1 summary={summary} />
    </>);

    expect(screen.queryByTestId("automatic-functional-reasoning")).not.toBeInTheDocument();
    const humanSummary = screen.getByTestId("human-reading-summary");
    const result = within(humanSummary).getByTestId("human-reading-functional-results");
    expect(result).toHaveTextContent("possible knowing-to-knowledge connection");
    expect(result).toHaveTextContent("DIJE");
    expect(result).not.toHaveTextContent("action-level");
    expect(result).not.toHaveTextContent("candidate_only");
    expect(result).not.toHaveTextContent("PARTIAL_NULL");
    expect(within(humanSummary).getByTestId("human-reading-functional-result")).toHaveTextContent("possible knowing-to-knowledge connection");
    expect(within(humanSummary).getByTestId("human-reading-meaning")).toHaveTextContent("knowledge");
    expect(within(humanSummary).getByTestId("human-reading-meaning")).toHaveTextContent("news, information");
    expect(within(humanSummary).getByTestId("human-reading-written-voices")).toHaveTextContent("I@1 → E@3");
    expect(within(humanSummary).getByTestId("human-reading-sources-and-alternatives")).not.toHaveAttribute("open");
    expect(within(humanSummary).getByTestId("human-reading-technical-evidence")).not.toHaveAttribute("open");

    fireEvent.click(within(humanSummary).getByText("Technical evidence"));
    const technical = within(humanSummary).getByTestId("human-reading-technical-evidence");
    expect(technical).toHaveTextContent("candidate_only");
    expect(technical).toHaveTextContent("PARTIAL_NULL");
    expect(technical).toHaveTextContent("no_single_winner");
    expect(technical).toHaveTextContent("user_decides");
    fireEvent.click(within(humanSummary).getByText("Sources and other meanings"));
    expect(within(humanSummary).getByTestId("human-reading-sources-and-alternatives")).toHaveTextContent("news, information");
  });

  it("renders the computed DA-family transition network and its source/Null boundaries in Overview", async () => {
    const familyResponse = (
      form: string,
      senses: Extract<RuntimeFjaloriFamilyFormResponseV0_1, { status: "available" }>["senses"],
      description: string,
    ): RuntimeFjaloriFamilyFormResponseV0_1 => {
      const canonical = form.toLocaleLowerCase("sq-AL");
      return {
        requestKey: `${canonical}\u0000${canonical}`,
        queryForm: canonical,
        status: "available",
        exactSourceForm: canonical,
        apiUrl: `https://fjalorishqip.org/api/v1/fjala/${canonical}.json`,
        licence: "CC BY-SA 4.0",
        analysisLanguage: "sq",
        analysisVariety: "albanian",
        recordSources: ["en-wiktionary", "editor", "ai"],
        description: { text: description, source: "ai", attribution: "AI-assisted source attribution · CC BY-SA 4.0" },
        senses,
      };
    };
    const verbSense = (gloss: string, senseIndex = 1) => ({
      entryIndex: 1,
      senseIndex,
      partOfSpeech: "verb",
      gloss,
      glossLanguage: "en" as const,
      senseSource: "en-wiktionary",
      tags: [],
      entrySources: ["en-wiktionary", "editor"],
    });
    // Synthetic source-response fixture: exercises eight repeated candidate paths, not live lexical evidence.
    const response: RuntimeFjaloriSourceResponseV0_1 = {
      requestKey: "NDARJE\u0000ndarje",
      queryForm: "NDARJE",
      status: "available",
      exactSourceForm: "ndarje",
      apiUrl: "https://fjalorishqip.org/api/v1/fjala/ndarje.json",
      licence: "CC BY-SA 4.0",
      analysisLanguage: "sq",
      analysisVariety: "albanian",
      recordSources: ["sq-wiktionary", "editor", "ai"],
      description: { text: "Ndarja e diçkaje në pjesë.", source: "ai", attribution: "AI-assisted source attribution · CC BY-SA 4.0" },
      senses: [{
        entryIndex: 1,
        senseIndex: 1,
        partOfSpeech: "noun",
        gloss: "division; separation",
        glossLanguage: "en",
        senseSource: "sq-wiktionary",
        tags: ["noun"],
        entrySources: ["sq-wiktionary", "editor"],
      }],
      familyFormResponses: [
        familyResponse("DAJ", [verbSense("to divide", 1), verbSense("to split", 2), verbSense("to separate", 3), verbSense("to cut into parts", 4), {
          entryIndex: 2,
          senseIndex: 1,
          partOfSpeech: "noun",
          gloss: "maternal uncle",
          glossLanguage: "en",
          senseSource: "editor",
          tags: [],
          entrySources: ["editor"],
        }], "Formë gege e foljes «ndaj»; also a separate kinship sense."),
        familyResponse("NDAJ", [
          verbSense("to divide a whole into several parts", 1),
          verbSense("to separate things that are together", 2),
          verbSense("to split something into parts", 3),
          verbSense("to cut a whole into pieces", 4),
        ], "Bëj që diçka e tërë të bëhet në disa pjesë."),
        {
          requestKey: "ndarë\u0000ndarë",
          queryForm: "ndarë",
          status: "http-not-found",
          httpStatus: 404,
          exactSourceForm: null,
          apiUrl: "https://fjalorishqip.org/api/v1/fjala/ndar%C3%AB.json",
          licence: null,
          analysisLanguage: "sq",
          analysisVariety: "albanian",
          recordSources: [],
          senses: [],
        },
        {
          requestKey: "ndare\u0000ndare",
          queryForm: "ndare",
          status: "http-not-found",
          httpStatus: 404,
          exactSourceForm: null,
          apiUrl: "https://fjalorishqip.org/api/v1/fjala/ndare.json",
          licence: null,
          analysisLanguage: "sq",
          analysisVariety: "albanian",
          recordSources: [],
          senses: [],
        },
      ],
    };
    const projection = buildCurrentWordFunctionalReasoningV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      identityMatches: true,
      language: "sq",
      variety: "albanian",
      exactSourceFacts: [],
      fjaloriSourceResponse: response,
      candidateOnlyOperators: [],
    });
    const discovery = adaptAnalysisToTelemetryVM({
      motivationDiscoveryV0_1: model({ inputWord: "NDARJE", inputLanguage: "sq", inputProfile: "albanian" }),
    }).motivationDiscoveryV0_2;
    const sourceFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ word: "ndarje", licence: "CC BY-SA 4.0", attribution: ["AI help — CC BY-SA 4.0"], sources: ["ai"], entries: [] }),
    });
    global.fetch = sourceFetch as unknown as typeof fetch;
    const onRuntimeSourceResponse = jest.fn();

    const summary = buildHumanReadingSummaryV0_1({
      word: "NDARJE",
      discovery,
      functionalReasoning: projection,
      runtimeSourceResponse: response,
    });
    render(<>
      <MotivationDiscoveryCardV0_1
        discovery={discovery}
        functionalReasoning={projection}
        onRuntimeSourceResponse={onRuntimeSourceResponse}
      />
      <HumanReadingSummaryCardV0_1 summary={summary} />
    </>);

    await waitFor(() => expect(sourceFetch).toHaveBeenCalledTimes(5));
    expect(sourceFetch.mock.calls.map(([url]) => String(url))).toEqual(expect.arrayContaining([
      "https://fjalorishqip.org/api/v1/fjala/ndarje.json",
      "https://fjalorishqip.org/api/v1/fjala/daj.json",
      "https://fjalorishqip.org/api/v1/fjala/ndaj.json",
      "https://fjalorishqip.org/api/v1/fjala/ndar%C3%AB.json",
      "https://fjalorishqip.org/api/v1/fjala/ndare.json",
    ]));

    expect(screen.queryByTestId("automatic-functional-reasoning")).not.toBeInTheDocument();
    const humanSummary = screen.getByTestId("human-reading-summary");
    expect(within(humanSummary).getAllByTestId("human-reading-functional-result")).toHaveLength(1);
    expect(summary.functionalReadings[0].candidates.flatMap(({ familyNetwork }) => familyNetwork.transitionNetworks)).toHaveLength(8);
    const concise = within(humanSummary).getByTestId("human-reading-functional-results");
    expect(concise).toHaveTextContent("DA is recorded with the function");
    expect(concise).toHaveTextContent("Separate DAJ and NDAJ entries also describe dividing or separating");
    expect(concise).toHaveTextContent("possible action-to-event connection for NDARJE");
    expect(concise).toHaveTextContent("do not establish how the word was formed");
    expect((concise.textContent?.match(/[.!?](?:\s|$)/g) ?? []).length).toBeLessThanOrEqual(3);
    expect(concise).not.toHaveTextContent("division; separation");
    expect(concise).not.toHaveTextContent("UNKNOWN_OR_NULL");
    expect(concise).not.toHaveTextContent("PARTIAL_NULL");
    expect(concise).not.toHaveTextContent("CITATION_ENTERED_UNVERIFIED");
    const sourcesDetails = within(humanSummary).getByTestId("human-reading-sources-and-alternatives");
    expect(sourcesDetails).not.toHaveAttribute("open");
    expect(within(humanSummary).getByTestId("human-reading-source-labels")).toHaveTextContent("Source: FjaloriShqip");
    expect(within(humanSummary).getByTestId("human-reading-source-labels")).not.toHaveTextContent("citation not independently verified");
    fireEvent.click(within(humanSummary).getByText("Sources and other meanings"));
    expect(sourcesDetails).toHaveTextContent("maternal");
    expect(sourcesDetails).toHaveTextContent(/ndaj/i);
    expect(sourcesDetails).toHaveTextContent(/daj/i);
    const sourceSenseSection = within(sourcesDetails).getByRole("region", { name: "Available source senses" });
    const sourceSenseRows = within(sourceSenseSection).getAllByRole("listitem");
    expect(sourceSenseRows).toHaveLength(1);
    expect(sourceSenseRows[0]).toHaveTextContent("division; separation");
    expect(sourceSenseRows[0]).toHaveTextContent("FjaloriShqip · Wiktionary (Albanian edition) · citation not independently verified");
    expect(sourceSenseRows[0]).not.toHaveTextContent("FjaloriShqip · FjaloriShqip");
    expect(sourcesDetails).not.toHaveTextContent("FJALORISHQIP");
    expect(sourcesDetails).toHaveTextContent("Each entry reports its own meaning. The entries do not report a relationship between these forms.");
    expect(sourcesDetails).toHaveTextContent("citation not independently verified");
    expect(sourcesDetails).not.toHaveTextContent("CITATION_ENTERED_UNVERIFIED");
    expect(sourcesDetails).not.toHaveTextContent("DIRECT_FREE_OPERATOR_FORM");
    expect(sourcesDetails).not.toHaveTextContent("http-not-found");
    fireEvent.click(within(sourcesDetails).getByText("View all 5 recorded senses"));
    expect(sourcesDetails).toHaveTextContent("maternal uncle");
    const technical = within(humanSummary).getByTestId("human-reading-technical-evidence");
    expect(technical).toHaveTextContent("PARTIAL_NULL");
    expect(technical).toHaveTextContent("CITATION_ENTERED_UNVERIFIED");
    expect(technical).toHaveTextContent("FJALORISHQIP");
    expect(technical).toHaveTextContent("DIRECT_FREE_OPERATOR_FORM");
    expect(technical).toHaveTextContent("INTERMEDIATE_STATE_UNKNOWN");
  });

  it("does not fetch DA-family records for DALLIM without a qualifying functional proposal", async () => {
    const onRuntimeSourceResponse = jest.fn();
    const sourceFetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        word: "dallim",
        licence: "CC BY-SA 4.0",
        sources: ["en-wiktionary"],
        entries: [{
          pos: "noun",
          sources: ["en-wiktionary"],
          senses: [{ gloss: "difference", lang: "en", source: "en-wiktionary", tags: ["noun"] }],
        }],
      }),
    });
    global.fetch = sourceFetch as unknown as typeof fetch;
    const discovery = adaptAnalysisToTelemetryVM({
      motivationDiscoveryV0_1: model({ inputWord: "DALLIM", inputLanguage: "sq", inputProfile: "albanian" }),
    }).motivationDiscoveryV0_2;

    render(
      <MotivationDiscoveryCardV0_1
        discovery={discovery}
        functionalReasoning={null}
        onRuntimeSourceResponse={onRuntimeSourceResponse}
      />,
    );

    await waitFor(() => expect(onRuntimeSourceResponse).toHaveBeenCalledWith(expect.objectContaining({
      queryForm: "DALLIM",
      status: "available",
      exactSourceForm: "dallim",
    })));
    expect(sourceFetch.mock.calls.map(([url]) => String(url))).toEqual([
      "https://fjalorishqip.org/api/v1/fjala/dallim.json",
    ]);
  });

  it("relays the existing exact-word Fjalori response to the current-word consumer", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        word: "ndarje",
        licence: "CC BY-SA 4.0",
        attribution: ["Albanian descriptions written with AI help — CC BY-SA 4.0"],
        sources: ["sq-wiktionary", "editor"],
        entries: [{
          pos: "noun",
          sources: ["sq-wiktionary", "editor"],
          senses: [
            { gloss: "division; separation", lang: "en", source: "sq-wiktionary", tags: ["noun"] },
          ],
        }],
      }),
    }) as unknown as typeof fetch;
    const ndarjeModel = model({
      inputWord: "NDARJE",
      inputLanguage: "sq",
      inputProfile: "albanian",
      sourceFact: {
        layer: "SOURCE_FACT",
        language: "Albanian",
        profile: "Albanian",
        representation: "albanian_profile",
        sourceStatus: "observed_external_snapshot",
        authorityBoundary: "source fact only",
      },
      exactLexicalSourceStatus: { status: "SOURCE_NOT_FOUND", queryForm: "NDARJE", reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND" },
      exactLexicalSourceFacts: [],
    });
    const discovery = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: ndarjeModel }).motivationDiscoveryV0_2;
    if (discovery.kind !== "present") throw new Error("Expected the fixture discovery to adapt as present");
    const onRuntimeSourceResponse = jest.fn();

    render(<MotivationDiscoveryCardV0_1 discovery={discovery} onRuntimeSourceResponse={onRuntimeSourceResponse} />);

    await waitFor(() => expect(onRuntimeSourceResponse).toHaveBeenLastCalledWith(expect.objectContaining({
      queryForm: "NDARJE",
      status: "available",
      exactSourceForm: "ndarje",
      senses: [expect.objectContaining({
        entryIndex: 1,
        senseIndex: 1,
        gloss: "division; separation",
        senseSource: "sq-wiktionary",
      })],
    })));
  });

  it("wraps Overview Null bridge reasons while preserving source evidence and Null posture", () => {
    const sourceRecordId = "kaikki-albanian-jsonl:word=zjarrfikës:ordinal=0";
    const sourceSnapshot = {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    };
    const exactSourceFact = {
      sourceRecordId,
      entryLocator: "jsonl://word/zjarrfikës/match/0",
      physicalRecordOrdinal: 0,
      language: "Albanian" as const,
      languageCode: "sq" as const,
      form: "zjarrfikës",
      partOfSpeech: "noun",
      senses: [{ senseId: "zjarrfikës-test-sense", glosses: ["firefighter"] }],
      ipaObservations: [],
      sourceStatus: "observed_external_snapshot" as const,
      attestationTruth: "fact" as const,
      pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const,
      sourceSnapshot,
    };
    const claimBoundary =
      "Source facts and derived structure remain separate from functional meaning; no morphology, etymology, causation, or Voice semantics is asserted.";
    const reading: AlbanianLexicalReadingV0_1 = {
      status: "SUPPORTED",
      primarySourceFact: {
        sourceRecordId,
        entryLocator: exactSourceFact.entryLocator,
        form: exactSourceFact.form,
        partOfSpeech: exactSourceFact.partOfSpeech,
        meaningGlosses: ["firefighter"],
        etymologyText: null,
      },
      sourcePronunciation: null,
      relatedForms: [],
      relatedCandidateEvaluations: [],
      functionalFamilyReading: null,
      sourceLinkedComponentReading: null,
      sourceLinkedComparison: null,
      functionalMeaningBridge: {
        status: "NULL",
        truthLayers: ["UNKNOWN_OR_NULL"],
        relatedForm: null,
        sourceFacts: null,
        derivedStructure: null,
        functionalHypothesis: {
          status: "UNKNOWN_OR_NULL",
          functionalOperation: null,
          statement: null,
          alternatives: [],
          basis: [],
          claimBoundary,
        },
        reasonCodes: [
          "SOURCE_LINKED_RELATION_NOT_SUPPORTED",
          "DERIVED_STRUCTURE_NOT_SUPPORTED_FOR_BOTH_RECORDS",
        ],
        claimBoundary,
      },
      composition: {
        status: "NULL",
        relatedForm: null,
        sourceRelation: {
          status: "SOURCE_RELATION_NOT_VERIFIED",
          sourceRecordId: null,
          entryLocator: null,
          evidenceText: null,
        },
        primaryStructure: null,
        relatedStructure: null,
        interpretation: {
          status: "UNKNOWN_OR_NULL",
          statement: null,
          alternatives: [],
          basis: [],
          claimBoundary,
        },
      },
      interpretation: {
        status: "UNKNOWN_OR_NULL",
        statement: null,
        alternatives: [],
        basis: [],
        claimBoundary,
      },
    };
    const value = model({
      inputWord: "zjarrfikës",
      inputLanguage: "sq",
      inputProfile: "albanian",
      exactLexicalSourceStatus: {
        status: "MATCHES_FOUND",
        queryForm: "zjarrfikës",
        reasonCode: null,
      },
      exactLexicalSourceFacts: [exactSourceFact],
      albanianLexicalReading: reading,
    });

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value }} />);

    const discoveryCard = screen.getByTestId("motivation-discovery-card");
    expect(discoveryCard).toHaveClass("min-w-0", "[overflow-wrap:anywhere]");
    const candidateCard = screen.getAllByTestId("motivation-discovery-candidate")[0];
    expect(candidateCard).toHaveClass("min-w-0", "[overflow-wrap:anywhere]");
    expect(candidateCard.querySelector("dl")).toHaveClass("min-w-0", "grid-cols-1");
    expect(
      discoveryCard.querySelector('[data-testid="motivation-derived-structure-details"] > .mt-2.grid'),
    ).toHaveClass("min-w-0", "grid-cols-1");

    const bridge = screen.getByTestId("albanian-functional-meaning-bridge-null");
    expect(bridge.textContent).toBe(
      "UNKNOWN_OR_NULL — no classified functional bridge was established. Reasons: SOURCE_LINKED_RELATION_NOT_SUPPORTED, DERIVED_STRUCTURE_NOT_SUPPORTED_FOR_BOTH_RECORDS.",
    );
    expect(bridge).toHaveClass("min-w-0", "[overflow-wrap:anywhere]");
    expect(bridge).not.toHaveClass("truncate", "overflow-hidden");
    expect(screen.getByTestId("albanian-reading-meaning")).toHaveTextContent("firefighter");
    expect(screen.getByText("SELECTED PRIMARY SOURCE RECORD")).toBeVisible();
    expect(screen.getByText("Source record: " + sourceRecordId + " · " + exactSourceFact.entryLocator)).toBeVisible();
    expect(reading.functionalMeaningBridge.status).toBe("NULL");
    expect(reading.interpretation.status).toBe("UNKNOWN_OR_NULL");
    expect(screen.queryByTestId("albanian-reading-functional-bridge")).not.toBeInTheDocument();
  });

  it("keeps conditional functional-interpretation layouts shrinkable", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/analyze-v1?word=study&mode=strict&alphabet=auto&targetSenseId=user_sense_learning&targetSenseLabel=learning",
      ),
    );
    const vm = adaptAnalysisToTelemetryVM(await response.json());
    const discovery = vm.motivationDiscoveryV0_2;
    const interpretation = vm.functionalMotivationInterpretationV0_3;

    expect(discovery?.kind).toBe("present");
    if (!discovery || discovery.kind !== "present") {
      throw new Error("Expected the API response to include Motivation Discovery");
    }
    expect(interpretation?.kind).toBe("present");
    if (!interpretation || interpretation.kind !== "present") {
      throw new Error("Expected the API response to include functional interpretation v0.3");
    }
    expect(
      interpretation.value.candidates.some((candidate) =>
        discovery.value.candidates.some((witness) => witness.candidateId === candidate.candidateId),
      ),
    ).toBe(true);

    render(
      <MotivationDiscoveryCardV0_1
        discovery={discovery}
        interpretation={interpretation}
      />,
    );

    const interpretationLayers = screen.getAllByTestId("functional-motivation-interpretation-layers");
    expect(interpretationLayers.length).toBeGreaterThan(0);
    expect(interpretationLayers[0]).toBeInTheDocument();
    expect(interpretationLayers[0]).toHaveClass("min-w-0", "grid-cols-1");

    const interpretationCard = screen.getByTestId("functional-motivation-interpretation");
    expect(interpretationCard).toBeInTheDocument();
    expect(interpretationCard).toHaveClass("min-w-0", "[overflow-wrap:anywhere]");

    const nestedGrid = interpretationCard.querySelector(":scope > .mt-3.grid");
    expect(nestedGrid).not.toBeNull();
    if (!(nestedGrid instanceof HTMLElement)) {
      throw new Error("Expected the nested functional interpretation grid to render");
    }
    expect(nestedGrid).toHaveClass("min-w-0", "grid-cols-1");
  });

  it("offers an explicit action for an alternative Albanian source record with its identity and gloss", () => {
    const sourceSnapshot = {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    };
    const sourceFact = (ordinal: number, gloss: string) => ({
      sourceRecordId: `kaikki-albanian-jsonl:word=krye:ordinal=${ordinal}`,
      entryLocator: `jsonl://word/krye/match/${ordinal}`,
      physicalRecordOrdinal: ordinal,
      language: "Albanian" as const,
      languageCode: "sq" as const,
      form: "krye",
      partOfSpeech: "noun",
      senses: [{ senseId: `krye-${ordinal}`, glosses: [gloss] }],
      ipaObservations: [],
      sourceStatus: "observed_external_snapshot" as const,
      attestationTruth: "fact" as const,
      pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const,
      sourceSnapshot,
    });
    const facts = [sourceFact(0, "head, chief"), sourceFact(1, "beginning, chapter")];
    const onAnalyzeAlbanianSourceRecord = jest.fn();

    render(
      <MotivationDiscoveryCardV0_1
        discovery={{
          kind: "present",
          value: model({
            inputWord: "krye",
            inputLanguage: "sq",
            exactLexicalSourceStatus: { status: "MATCHES_FOUND", queryForm: "krye", reasonCode: null },
            exactLexicalSourceFacts: facts,
          })
        }}
        onAnalyzeAlbanianSourceRecord={onAnalyzeAlbanianSourceRecord}
      />,
    );

    const alternativeId = "kaikki-albanian-jsonl:word=krye:ordinal=1";
    expect(screen.getAllByText("beginning, chapter").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Albanian · noun/)).toHaveLength(2);
    expect(screen.getAllByText((_, element) =>
      element?.textContent?.includes(`Source record: ${alternativeId}`) ?? false,
    ).length).toBeGreaterThan(0);
    expect(screen.getAllByText("SOURCE RECORD SELECTION UNKNOWN")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", {
      name: `Analyze exact Albanian source record ${alternativeId}`,
    }));
    expect(onAnalyzeAlbanianSourceRecord).toHaveBeenCalledTimes(1);
    expect(onAnalyzeAlbanianSourceRecord).toHaveBeenCalledWith(alternativeId);
  });

  it("does not offer a selector for a duplicated exact source identity", () => {
    const sourceSnapshot = {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    };
    const duplicateFact = {
      sourceRecordId: "kaikki-albanian-jsonl:word=krye:ordinal=1",
      entryLocator: "jsonl://word/krye/match/1",
      physicalRecordOrdinal: 1,
      language: "Albanian" as const,
      languageCode: "sq" as const,
      form: "krye",
      partOfSpeech: "noun",
      senses: [{ senseId: "krye-1", glosses: ["beginning"] }],
      ipaObservations: [],
      sourceStatus: "observed_external_snapshot" as const,
      attestationTruth: "fact" as const,
      pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const,
      sourceSnapshot,
    };

    render(
      <MotivationDiscoveryCardV0_1
        discovery={{
          kind: "present",
          value: model({
            inputWord: "krye",
            inputLanguage: "sq",
            exactLexicalSourceStatus: { status: "MATCHES_FOUND", queryForm: "krye", reasonCode: null },
            exactLexicalSourceFacts: [duplicateFact, { ...duplicateFact }],
          })
        }}
        onAnalyzeAlbanianSourceRecord={() => undefined}
      />,
    );

    expect(screen.queryByTestId("albanian-source-record-select")).toBeNull();
    expect(screen.getAllByTestId("albanian-source-record-unselectable")).toHaveLength(2);
  });

  it("keeps proper-name records visible without offering them for lexical evaluation", () => {
    const sourceSnapshot = {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    };
    const common = {
      entryLocator: "jsonl://word/krye/match/0",
      physicalRecordOrdinal: 0,
      language: "Albanian" as const,
      languageCode: "sq" as const,
      form: "krye",
      senses: [{ senseId: "krye-sense", glosses: ["head"] }],
      ipaObservations: [],
      sourceStatus: "observed_external_snapshot" as const,
      attestationTruth: "fact" as const,
      pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const,
      sourceSnapshot,
    };
    const commonNoun = {
      ...common,
      sourceRecordId: "kaikki-albanian-jsonl:word=krye:ordinal=0",
      partOfSpeech: "noun",
    };
    const properName = {
      ...common,
      sourceRecordId: "kaikki-albanian-jsonl:word=krye:ordinal=1",
      partOfSpeech: "name",
    };

    render(
      <MotivationDiscoveryCardV0_1
        discovery={{
          kind: "present",
          value: model({
            inputWord: "krye",
            inputLanguage: "sq",
            exactLexicalSourceStatus: { status: "MATCHES_FOUND", queryForm: "krye", reasonCode: null },
            exactLexicalSourceFacts: [commonNoun, properName],
          })
        }}
        onAnalyzeAlbanianSourceRecord={() => undefined}
      />,
    );

    expect(screen.getByText(/Albanian · name/)).toBeInTheDocument();
    expect(screen.getAllByTestId("albanian-source-record-select")).toHaveLength(1);
    expect(screen.getByTestId("albanian-source-record-unselectable")).toHaveTextContent(
      "not a unique selectable Albanian lexical record",
    );
  });

  it("shows a Latin source candidate with an explicit lexical-only boundary", async () => {
    const response = await GET(
      new Request("http://localhost/api/analyze-v1?word=bamoar&mode=strict&alphabet=auto"),
    );
    const vm = adaptAnalysisToTelemetryVM(await response.json());

    render(<MotivationDiscoveryCardV0_1 discovery={vm.motivationDiscoveryV0_2} />);

    expect(screen.getByText("amo")).toBeInTheDocument();
    expect(screen.getByText("Latin")).toBeInTheDocument();
    expect(screen.getByText("to like, to love")).toBeInTheDocument();
    expect(screen.getAllByText(/Candidate pronunciation and spoken Voice path are Null/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/orthographic_profile_derived/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Functional motivation unknown").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Multiple interpretations may coexist · You decide").length).toBeGreaterThan(0);
  });

  it("shows fact, derived structure, hypothesis, status, and provenance without a winner", () => {
    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value: model() }} />);

    expect(screen.getByTestId("motivation-discovery-card")).toBeInTheDocument();
    expect(screen.getByText("SOURCE FACT")).toBeInTheDocument();
    expect(screen.getByTestId("motivation-written-voice-path")).toHaveTextContent(
      "WRITTEN VOICE PATH (ORTHOGRAPHIC)",
    );
    expect(screen.getByTestId("motivation-written-voice-path")).toHaveTextContent("U → Y");
    expect(screen.getByTestId("motivation-written-voice-path")).toHaveTextContent(
      "pronunciation not established",
    );
    expect(screen.getByTestId("motivation-selected-voice-path")).toHaveTextContent(
      "PRODUCTION SPOKEN PATH",
    );
    expect(screen.getByTestId("motivation-selected-voice-path")).toHaveTextContent(
      "This selected path is not comparable with written orthography.",
    );
    expect(screen.getByTestId("motivation-selected-voice-path")).toHaveTextContent(
      "source: production_spoken · profile: open-instrument.cmudict-arpabet-en-us.v0_1",
    );
    expect(screen.getByText(/orthographic\/profile-derived Discovery representation/)).toBeInTheDocument();
    expect(screen.getByText(/lexical source: https:\/\/example\.invalid\/di/)).toBeInTheDocument();
    expect(screen.getByText("Source fact")).toBeInTheDocument();
    expect(screen.getByTestId("motivation-structural-comparison")).toBeInTheDocument();
    expect(screen.getByText("WHY THIS CANDIDATE")).toBeInTheDocument();
    expect(screen.getByText("primary source witness")).toBeInTheDocument();
    expect(screen.getByTestId("multilingual-discovery-role")).toHaveTextContent(
      "does not select a candidate or override the separate word-specific reading",
    );
    expect(screen.getByTestId("discovery-entry-cause")).toHaveTextContent(
      "existing Discovery record says",
    );
    expect(screen.getByText("CROSS_REPRESENTATION")).toBeInTheDocument();
    expect(screen.getByText("NOT_COMPARABLE_ACROSS_REPRESENTATIONS")).toBeInTheDocument();
    expect(screen.getByText(/no target-word mapping/)).toBeInTheDocument();
    expect(screen.getByText("FUNCTIONAL MOTIVATION")).toBeInTheDocument();
    expect(screen.getByText("Reviewed functional hypothesis")).toBeInTheDocument();
    expect(screen.getByText("reviewed.external.di.knowledge.candidate.v0_1")).toBeInTheDocument();
    expect(screen.getByText("Multiple interpretations may coexist · You decide")).toBeInTheDocument();
    expect(screen.getByTestId("motivation-candidate-details")).toBeInTheDocument();
    expect(screen.getByText(/does not select a candidate/)).toBeInTheDocument();
    expect(screen.getByTestId("motivation-discovery-card")).not.toHaveTextContent(/\b(?:winner|winning|ranking|ranked)\b/i);
  });

  it("shows additive AlbaNet synset details without turning them into functional evidence", () => {
    const albaNetCandidate = {
      ...model().candidates[0],
      candidateForm: "di",
      candidateGloss: "knowledge",
      sourceFact: {
        ...model().candidates[0]?.sourceFact,
        sourceFamilyId: "albanet-omw-sq-v0.1",
        sourceId: "albanet-omw-sq-v0.1:00000001-n:lemma=di",
        sourceUrlOrArchiveRef: "https://github.com/omwn/omw-data",
        entryLocator: "wns/als/wn-data-als.tab#synset=00000001-n;lemma=di",
        sourceDetails: {
          synsetId: "00000001-n",
          definitions: ["knowledge"],
          examples: ["Ai di."],
          relationTypes: ["als:def", "als:exe", "als:lemma"],
          license: "CC BY 3.0",
        },
      },
      functionalInterpretation: {
        status: "UNKNOWN_OR_NULL" as const,
        truthClassification: "unknown_or_null" as const,
        statement: null,
        evidenceKind: "none" as const,
        evidenceRefs: [],
        reason: "INSUFFICIENT_FUNCTIONAL_EVIDENCE",
      },
    };

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value: model({ candidates: [albaNetCandidate] }) }} />);

    expect(screen.getByText(/Source family: albanet-omw-sq-v0\.1/)).toBeInTheDocument();
    expect(screen.getByText(/Synset: 00000001-n/)).toBeInTheDocument();
    expect(screen.getByText(/Definitions: knowledge/)).toBeInTheDocument();
    expect(screen.getByText(/Examples: Ai di\./)).toBeInTheDocument();
    expect(screen.getByText(/License: CC BY 3\.0/)).toBeInTheDocument();
    expect(screen.getByText("Functional motivation unknown")).toBeInTheDocument();
  });

  it("labels source-backed identities separately from legacy synsets", () => {
    const candidate = model().candidates[0];
    render(<MotivationDiscoveryCardV0_1 discovery={{
      kind: "present",
      value: model({
        candidates: [{
          ...candidate,
          sourceFact: {
            ...candidate.sourceFact,
            sourceDetails: {
              sourceIdentity: "lexin-swedish-albanian-v0.1:word=20",
              definitions: [],
              examples: [],
              relationTypes: [],
            },
          },
        }],
      }),
    }} />);

    expect(screen.getByText(/Source identity: lexin-swedish-albanian-v0\.1:word=20/)).toBeInTheDocument();
  });

  it("keeps candidate summaries human-readable while preserving technical details", () => {
    const di = model().candidates[0];
    const da = {
      ...di,
      candidateId: "discovery:study:da",
      candidateForm: "da",
      candidateGloss: "to split, cut, divide",
      candidateEmbryo: "DA",
      functionalInterpretation: {
        status: "UNKNOWN_OR_NULL" as const,
        truthClassification: "unknown_or_null" as const,
        statement: null,
        evidenceKind: "none" as const,
        evidenceRefs: [],
        reason: "INSUFFICIENT_FUNCTIONAL_EVIDENCE",
      },
    };

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value: model({ candidates: [di, da] }) }} />);

    expect(screen.getByText("2 primary Discovery witnesses")).toBeInTheDocument();
    expect(screen.getByText("da")).toBeInTheDocument();
    expect(screen.getByText("to split, cut, divide")).toBeInTheDocument();
    expect(screen.getAllByText("WHY THIS CANDIDATE")).toHaveLength(2);
    expect(screen.getAllByText("Functional motivation unknown")).toHaveLength(1);
    expect(screen.getByText("No reviewed functional evidence currently supports this bridge.")).toBeInTheDocument();
    expect(screen.getByText("Multiple interpretations may coexist · You decide")).toBeInTheDocument();

    const structural = screen.getAllByText("WHY THIS CANDIDATE")[0];
    const functional = screen.getAllByText("FUNCTIONAL MOTIVATION")[0];
    expect(structural.compareDocumentPosition(functional) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows a valid Null instead of inventing a candidate", () => {
    render(
      <MotivationDiscoveryCardV0_1
        discovery={{
          kind: "present",
          value: model({
            status: "NO_MATCHES",
            candidates: [],
            interpretation: {
              layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS",
              status: "UNKNOWN_OR_NULL",
              note: "No qualifying generic source witness was found.",
            },
            unknownOrNull: {
              layer: "UNKNOWN_OR_NULL",
              reason: "NO_GENERIC_AUTHORIZED_SOURCE_WITNESS",
            },
          }),
        }}
      />,
    );

    expect(screen.getByText("NO SUPPORTED MOTIVATION CANDIDATE YET")).toBeInTheDocument();
    expect(screen.getByText("No authorized source witness supports a functional interpretation for this result.")).toBeInTheDocument();
    expect(screen.getByText("Exact Null reason code")).toBeInTheDocument();
    expect(screen.getByText("NO_GENERIC_AUTHORIZED_SOURCE_WITNESS")).toBeInTheDocument();
    expect(screen.queryByTestId("motivation-discovery-candidate")).not.toBeInTheDocument();
  });

  it("keeps an unmapped Null reason visible and conservative while preserving its exact code in details", () => {
    const candidate = model().candidates[0];
    const value = model({
      candidates: [{
        ...candidate,
        functionalInterpretation: {
          ...candidate.functionalInterpretation,
          status: "UNKNOWN_OR_NULL",
          truthClassification: "unknown_or_null",
          statement: null,
          evidenceKind: "none",
          evidenceRefs: [],
          reason: "UNMAPPED_NULL_REASON_EXAMPLE",
        },
      }],
    });

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value }} />);

    expect(screen.getByText("Unclassified interpretation state: UNMAPPED_NULL_REASON_EXAMPLE")).toBeInTheDocument();
    expect(screen.getByTestId("motivation-candidate-details")).toHaveTextContent(
      "Functional reason: UNMAPPED_NULL_REASON_EXAMPLE",
    );
  });

  it("separates an exact lexical self-match from a structural motivation candidate", () => {
    const value = model({
      inputWord: "zemër",
      inputLanguage: "sq",
      inputProfile: "albanian",
      sourceFact: {
        layer: "SOURCE_FACT",
        language: "sq",
        profile: "albanian",
        representation: "albanian_profile",
        sourceStatus: "explicit_profile_binding_without_spoken_authority",
        authorityBoundary: "Albanian Discovery profile only",
      },
      candidates: [{
        ...model().candidates[0],
        candidateForm: "zemër",
        candidateLanguage: "sq",
        candidateEmbryo: "ZEMËR",
        structuralComparison: {
          ...model().candidates[0].structuralComparison,
          matchClassification: "EXACT_LEXICAL_SELF_MATCH",
          presentationClassification: "LEXICAL_ENTRY_CONFIRMATION",
          matchedQuery: "ZEMËR",
          inputRepresentationKind: "albanian_profile",
          inputVoicePath: ["E", "Ë"],
          voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
          matchReason: "Input lexical form matches a source-attested lexical record; this is lexical entry confirmation, not a cross-form structural motivation claim.",
        },
        functionalInterpretation: {
          status: "NOT_APPLICABLE_SELF_MATCH",
          truthClassification: "unknown_or_null",
          statement: null,
          evidenceKind: "none",
          evidenceRefs: [],
          reason: "LEXICAL_SELF_MATCH_NOT_FUNCTIONAL_MOTIVATION",
        },
      }],
    });

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value }} />);
    expect(screen.getByTestId("motivation-lexical-self-match-summary")).toHaveTextContent(
      "LEXICAL SELF-MATCH / ENTRY CONFIRMATION",
    );
    expect(screen.getByTestId("motivation-lexical-self-match-summary")).toHaveTextContent(
      "not a cross-form functional motivation claim",
    );
    expect(screen.getAllByText(/lexical entry confirmation/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("motivation-structural-comparison")).toHaveTextContent(
      "not a cross-form structural motivation claim",
    );
    expect(screen.getByText("Not applicable to an exact lexical self-match")).toBeInTheDocument();
  });

  it("fails closed when a nested Math7 field is incomplete", () => {
    const malformed = model() as unknown as Record<string, unknown>;
    const derived = malformed.derivedStructure as Record<string, unknown>;
    const math7 = derived.math7 as Record<string, unknown>;
    delete math7.principlesPath;

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformed });
    expect(vm.motivationDiscoveryV0_2).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it("fails closed when candidate consonantal structure is malformed", () => {
    const malformed = model() as unknown as Record<string, unknown>;
    const candidate = (malformed.candidates as Array<Record<string, unknown>>)[0];
    const comparison = candidate.structuralComparison as Record<string, unknown>;
    comparison.candidateConsonantalStructure = "malformed";

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformed });
    expect(vm.motivationDiscoveryV0_2).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it("fails closed when written Voice provenance does not match conserved input events", () => {
    const malformed = JSON.parse(JSON.stringify(model())) as Record<string, unknown>;
    const derived = malformed.derivedStructure as Record<string, unknown>;
    const provenance = derived.voicePathProvenance as Record<string, unknown>;
    const written = provenance.writtenInput as Record<string, unknown>;
    const events = written.events as Array<Record<string, unknown>>;
    events[0]!.sourcePosition = 99;

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformed });
    expect(vm.motivationDiscoveryV0_2).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it("keeps legacy payloads readable without treating the selected path as written orthography", () => {
    const legacy = JSON.parse(JSON.stringify(model())) as Record<string, unknown>;
    const derived = legacy.derivedStructure as Record<string, unknown>;
    delete derived.voicePathProvenance;
    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: legacy });

    expect(vm.motivationDiscoveryV0_2.kind).toBe("present");
    render(<MotivationDiscoveryCardV0_1 discovery={vm.motivationDiscoveryV0_2} />);
    expect(screen.getByTestId("motivation-written-voice-path")).toHaveTextContent(
      "Written sequence unavailable in this payload.",
    );
    expect(screen.getByTestId("motivation-selected-voice-path")).toHaveTextContent(
      "Written-path provenance is unavailable in this payload.",
    );
  });

  it("aggregates same-witness records while retaining every source record", () => {
    const first = model().candidates[0];
    const second = {
      ...first,
      candidateId: "discovery:study:di:sense-2",
      candidateGloss: "understanding",
      sourceFact: {
        ...first.sourceFact,
        sourceFamilyId: "fixture.source.family.v0_1",
        sourceId: "fixture.source.family.v0_1#sense-2",
        evidenceRefs: ["fixture.citation-2"],
      },
    };
    const firstWithFamily = {
      ...first,
      sourceFact: {
        ...first.sourceFact,
        sourceFamilyId: "fixture.source.family.v0_1",
        sourceId: "fixture.source.family.v0_1#sense-1",
        evidenceRefs: ["fixture.citation-1"],
      },
    };

    const primaryWitnesses = aggregateMotivationDiscoveryCandidatesV0_1([
      firstWithFamily,
      second,
    ]);
    const metrics = measureMotivationDiscoveryAggregationV0_1(
      [firstWithFamily, second],
      primaryWitnesses,
    );

    expect(primaryWitnesses).toHaveLength(1);
    expect(primaryWitnesses[0].primaryWitnessId).not.toContain("#sense-1");
    expect(primaryWitnesses[0].primaryWitnessId).not.toContain("#sense-2");
    expect(primaryWitnesses[0].records).toHaveLength(2);
    expect(primaryWitnesses[0].records.map((record) => record.sourceFact.sourceId)).toEqual([
      "fixture.source.family.v0_1#sense-1",
      "fixture.source.family.v0_1#sense-2",
    ]);
    expect(metrics).toMatchObject({
      rawCandidateRecordCount: 2,
      primaryWitnessCount: 1,
      aggregatedRecordCount: 2,
      aggregationReductionRatio: 0.5,
      aggregationReductionPercentage: 50,
      evidenceLedgerRecordCount: 2,
      recordsLost: 0,
    });

    render(
      <MotivationDiscoveryCardV0_1
        discovery={{ kind: "present", value: model({ candidates: [firstWithFamily, second] }) }}
      />,
    );
    expect(screen.getByText("1 primary Discovery witness")).toBeInTheDocument();
    expect(screen.getAllByTestId("motivation-evidence-ledger-record")).toHaveLength(2);
    expect(screen.getByText("fixture.source.family.v0_1#sense-1")).toBeInTheDocument();
    expect(screen.getByText("fixture.source.family.v0_1#sense-2")).toBeInTheDocument();
  });

  it("does not over-merge materially different witnesses", () => {
    const first = model().candidates[0];
    const differentReason = {
      ...first,
      candidateId: "discovery:study:di:different-reason",
      sourceFact: {
        ...first.sourceFact,
        sourceFamilyId: "fixture.source.family.v0_1",
        sourceId: "fixture.source.family.v0_1#different-reason",
      },
      structuralComparison: {
        ...first.structuralComparison,
        matchReason: "A materially different authorized entry reason.",
      },
    };

    const primaryWitnesses = aggregateMotivationDiscoveryCandidatesV0_1([
      first,
      differentReason,
    ]);

    expect(primaryWitnesses).toHaveLength(2);
    expect(primaryWitnesses.every((witness) => witness.records.length === 1)).toBe(true);
  });

  it.each(["study", "studies", "learning", "zemër", "stone"])(
    "preserves the complete evidence ledger for regression input %s",
    async (word) => {
      const response = await GET(
        new Request(`http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`),
      );
      const vm = adaptAnalysisToTelemetryVM(await response.json());
      if (vm.motivationDiscoveryV0_2.kind !== "present") {
        throw new Error(`missing Discovery VM for ${word}`);
      }
      expect(vm.motivationDiscoveryV0_2.value.candidates.every(
        (candidate) => typeof candidate.sourceFact.sourceFamilyId === "string",
      )).toBe(true);

      const primaryWitnesses = aggregateMotivationDiscoveryCandidatesV0_1(
        vm.motivationDiscoveryV0_2.value.candidates,
      );
      const metrics = measureMotivationDiscoveryAggregationV0_1(
        vm.motivationDiscoveryV0_2.value.candidates,
        primaryWitnesses,
      );
      console.info("DISCOVERY_AGGREGATION_REGRESSION", word, metrics);

      expect(metrics.evidenceLedgerRecordCount).toBe(metrics.rawCandidateRecordCount);
      expect(metrics.recordsLost).toBe(0);
      expect(metrics.primaryWitnessCount).toBeLessThanOrEqual(metrics.rawCandidateRecordCount);
    },
  );
});
