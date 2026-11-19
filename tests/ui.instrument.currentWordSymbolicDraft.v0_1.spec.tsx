import { fireEvent, render, screen, within } from "@testing-library/react";
import {
  buildCurrentWordSymbolicDraftProjectionV0_1,
  CurrentWordSymbolicDraftV0_1,
} from "@/ui/instrument/sections/CurrentWordSymbolicDraftV0_1";
import { SingleWordMotivationWorkbenchV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";
import type { SingleWordCurrentWordEvidenceContextV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";
import type { RuntimeAlbanianSourceSenseSelectionV0_1 } from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";

const DIVISION = "d:division";
const LIGHT = "d:light";
const INITIATE = "voice-a:initiate-ground";
const EXPAND = "voice-e:expand-outward";
const FOCUS = "voice-i:specify-focus";

function select(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

function makeCurrentWordEvidence(options: Partial<{
  analyzedWord: string;
  sourceForm: string;
  languageCode: string;
  attestationTruth: string;
  sourceLookupStatus: string;
  inputLanguage: string;
  inputProfile: string;
  sourceSenses: string[];
}> = {}): SingleWordCurrentWordEvidenceContextV0_1 {
  const analyzedWord = options.analyzedWord ?? "DALLIM";
  const sourceForm = options.sourceForm ?? "dallim";
  const normalizedSourceForm = sourceForm.normalize("NFC").trim().toLocaleLowerCase("sq-AL");
  return {
    analyzedWord,
    discovery: {
      kind: "present",
      value: {
        schemaVersion: "open-instrument.motivation-engine-discovery.v0_2",
        status: "MATCHES_FOUND",
        inputWord: analyzedWord,
        inputLanguage: options.inputLanguage ?? "sq",
        inputProfile: options.inputProfile ?? "albanian",
        sourceFact: { language: "Albanian", layer: "SOURCE_FACT", profile: "Albanian", representation: "albanian_profile", sourceStatus: "observed_external_snapshot", authorityBoundary: "source fact only" },
        exactLexicalSourceStatus: { status: options.sourceLookupStatus ?? "MATCHES_FOUND" },
        exactLexicalSourceFacts: [{
          sourceRecordId: `fixture:${normalizedSourceForm}`,
          entryLocator: `${normalizedSourceForm}#Albanian`,
          physicalRecordOrdinal: 0,
          language: "Albanian",
          languageCode: options.languageCode ?? "sq",
          form: sourceForm,
          partOfSpeech: "noun",
          attestationTruth: options.attestationTruth ?? "fact",
          sourceStatus: "observed_external_snapshot",
          senses: (options.sourceSenses ?? ["act of distinguishing"]).map((gloss) => ({ glosses: [gloss] })),
          ipaObservations: [],
          pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE",
          sourceSnapshot: {
            sourceFamilyId: "fixture-source-family",
            sourceUrl: "https://example.invalid/fixture.jsonl",
            sha256: "a".repeat(64),
            bytes: 1,
          },
        }],
      },
    },
  } as unknown as SingleWordCurrentWordEvidenceContextV0_1;
}

function renderDraft(overrides: Partial<Parameters<typeof CurrentWordSymbolicDraftV0_1>[0]> = {}) {
  return render(
    <CurrentWordSymbolicDraftV0_1
      analyzedWord="DALLIM"
      draftTargetWord="DALLIM"
      targetLanguage=""
      targetDialect=""
      {...overrides}
    />,
  );
}

function selectDallimVoiceOperations() {
  select("Spectrum association for D at position 0", DIVISION);
  select("Spectrum association for LL at position 2", "ll:clarity");
  select("Voice operator for A@1", INITIATE);
  select("Explicit operand for A@1", "spectrum:spectrum:D@0-1");
  select("Voice operator for I@4", FOCUS);
  select("Explicit operand for I@4", "spectrum:spectrum:LL@2-4");
}

function completeDallimGraphMeaningDraft() {
  select("Spectrum association for M at position 5", "m:result");
  select("Lexical sense for current-word graph meaning", "USER_PROPOSED");
  fireEvent.change(screen.getByLabelText("Proposed lexical sense label"), { target: { value: "Act of distinguishing" } });
  fireEvent.change(screen.getByLabelText("Proposed sense definition"), { target: { value: "The act of distinguishing things." } });
  fireEvent.change(screen.getByLabelText("Proposed functional form or function"), { target: { value: "DALLOJ" } });
  fireEvent.change(screen.getByLabelText("Proposed function description"), { target: { value: "distinguish or recognize one thing from another" } });
  select("Proposed lexical function relationship", "ACTION_OF_VERB_FUNCTION");

  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed graph relationship" }));
  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed graph relationship" }));
  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed graph relationship" }));
  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed graph relationship" }));
  select("Left computed node for relationship 1", "selection:spectrum:D@0-1");
  select("Relationship text 1", "produces");
  select("Right computed node for relationship 1", "voice:voice:A@1");
  select("Left computed node for relationship 2", "voice:voice:A@1");
  select("Relationship text 2", "is paired with");
  select("Right computed node for relationship 2", "selection:spectrum:LL@2-4");
  select("Left computed node for relationship 3", "selection:spectrum:LL@2-4");
  select("Relationship text 3", "is focused as");
  select("Right computed node for relationship 3", "voice:voice:I@4");
  select("Left computed node for relationship 4", "voice:voice:I@4");
  select("Relationship text 4", "yields");
  select("Right computed node for relationship 4", "selection:spectrum:M@5-6");

  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed whole-word bridge" }));
  select("Interpretation role for bridge 1", "PRIMARY");
  fireEvent.change(screen.getByLabelText("Whole-word explanatory bridge 1"), { target: { value: "The selected graph is a user-proposed reading of distinguishing." } });

  fireEvent.click(screen.getByRole("button", { name: "Add proposed role mapping" }));
  fireEvent.click(screen.getByRole("button", { name: "Add proposed role mapping" }));
  select("Bridge for role mapping 1", "bridge-5");
  select("Computed output for role mapping 1", "symbol:voice:voice:A@1");
  fireEvent.change(screen.getByLabelText("Proposed functional role 1"), { target: { value: "an initiated contribution proposed for distinguishing" } });
  select("Bridge for role mapping 2", "bridge-5");
  select("Computed output for role mapping 2", "symbol:voice:voice:I@4");
  fireEvent.change(screen.getByLabelText("Proposed functional role 2"), { target: { value: "a focused clarity contribution proposed for distinguishing" } });
}

function selectNdarjeVoiceOperations() {
  select("Spectrum association for D at position 1", DIVISION);
  select("Voice operator for A@2", INITIATE);
  select("Explicit operand for A@2", "spectrum:spectrum:D@1-2");
  select("Voice operator for E@5", EXPAND);
  select("Explicit operand for E@5", "voice:voice:A@2");
}

function selectedRuntimeNdarjeSense(): RuntimeAlbanianSourceSenseSelectionV0_1 {
  return {
    exactSourceForm: "ndarje",
    apiUrl: "https://fjalorishqip.org/api/v1/fjala/ndarje.json",
    licence: "CC BY-SA 4.0",
    analysisLanguage: "sq",
    analysisVariety: "Standard Albanian",
    recordSources: ["sq-wiktionary", "editor"],
    selectedSense: {
      entryIndex: 1,
      senseIndex: 1,
      partOfSpeech: "noun",
      gloss: "division; separation",
      glossLanguage: "en",
      senseSource: "sq-wiktionary",
      tags: ["noun"],
      entrySources: ["sq-wiktionary", "editor"],
    },
    alternativeSenses: [],
  };
}

function completeNdarjeFunctionalDraft() {
  selectNdarjeVoiceOperations();
  select("Lexical sense for current-word graph meaning", "USER_PROPOSED");
  fireEvent.change(screen.getByLabelText("Proposed lexical sense label"), {
    target: { value: "Action/state of separation or division" },
  });
  fireEvent.change(screen.getByLabelText("Proposed sense definition"), {
    target: { value: "A user-proposed working sense for NDARJE." },
  });
  fireEvent.change(screen.getByLabelText("Proposed functional form or function"), {
    target: { value: "NDAJ / NDAHEM" },
  });
  fireEvent.change(screen.getByLabelText("Proposed function description"), {
    target: { value: "separate or divide a whole into parts" },
  });
  select("Proposed lexical function relationship", "ACTION_OF_VERB_FUNCTION");

  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed graph relationship" }));
  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed graph relationship" }));
  select("Left computed node for relationship 1", "selection:spectrum:D@1-2");
  select("Relationship text 1", "initiates");
  select("Right computed node for relationship 1", "voice:voice:A@2");
  select("Left computed node for relationship 2", "voice:voice:A@2");
  select("Relationship text 2", "is expanded outward as");
  select("Right computed node for relationship 2", "voice:voice:E@5");

  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed whole-word bridge" }));
  select("Interpretation role for bridge 1", "PRIMARY");
  fireEvent.change(screen.getByLabelText("Whole-word explanatory bridge 1"), {
    target: {
      value: "USER_PROPOSED: initiated(division) is expanded outward into distinct parts as a possible reading of separation or division. FJALË NDARJE/NDAJ/NDAHEM and Newmark §3.2 p.125 are entered as external research references, not attached source records here. N, R, J, and a word-specific NDAR + -JE formation remain unresolved.",
    },
  });

  fireEvent.click(screen.getByRole("button", { name: "Add proposed role mapping" }));
  fireEvent.click(screen.getByRole("button", { name: "Add proposed role mapping" }));
  select("Bridge for role mapping 1", "bridge-3");
  select("Computed output for role mapping 1", "symbol:voice:voice:A@2");
  fireEvent.change(screen.getByLabelText("Proposed functional role 1"), {
    target: { value: "an initiated act of dividing" },
  });
  select("Bridge for role mapping 2", "bridge-3");
  select("Computed output for role mapping 2", "symbol:voice:voice:E@5");
  fireEvent.change(screen.getByLabelText("Proposed functional role 2"), {
    target: { value: "the division extended into separate parts" },
  });
  fireEvent.change(screen.getByLabelText("Optional alternative reading"), {
    target: {
      value: "Alternative sense reported in FJALË NDARJE, sense 2: a part or compartment into which something is divided; citation not attached to this analysis.",
    },
  });
}

describe("current-word symbolic draft v0.1", () => {
  it("projects explicit occurrence and Voice bindings into dependent v0.3 evaluator operations", () => {
    const projection = buildCurrentWordSymbolicDraftProjectionV0_1({
      exactSpelling: "DALLIM",
      language: "sq",
      variety: "albanian",
      selections: {
        spectrumCandidateByOccurrenceId: { "spectrum:D@0-1": DIVISION },
        voiceDraftByEventId: {
          "voice:A@1": { operatorCandidateId: INITIATE, operandOccurrenceId: "spectrum:D@0-1" },
        },
      },
    });

    expect(projection.structure.ok).toBe(true);
    expect(projection.operations).toEqual([
      expect.objectContaining({
        kind: "SELECT_SPECTRUM_CANDIDATE",
        occurrenceId: "spectrum:D@0-1",
        associationCandidateId: DIVISION,
        outputSymbolId: "draft-spectrum-0",
      }),
      expect.objectContaining({
        kind: "APPLY_VOICE_OPERATOR",
        voice: "A",
        position: 1,
        voiceEventId: "voice:A@1",
        operatorCandidateId: INITIATE,
        inputSymbolId: "draft-spectrum-0",
        dependsOn: ["draft-select-0"],
      }),
    ]);
    expect(projection.evaluation.ok).toBe(true);
    if (projection.evaluation.ok) {
      expect(projection.evaluation.symbols.find(({ symbolKind }) => symbolKind === "VOICE_TRANSFORM")?.text)
        .toBe("initiated(division)");
      expect(projection.evaluation.sourceAuthorityPromotion).toBe("NONE");
      expect(projection.evaluation.historicalOrigin).toBe("NOT_CLAIMED");
      expect(projection.evaluation.interpretationSelection).toEqual({
        mode: "no_single_winner",
        selectedCandidateId: null,
        userDecisionPosture: "user_decides",
      });
    }
  });

  it("binds a later Voice event to a prior computed Voice result with an explicit producer dependency", () => {
    const projection = buildCurrentWordSymbolicDraftProjectionV0_1({
      exactSpelling: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selections: {
        spectrumCandidateByOccurrenceId: { "spectrum:D@1-2": DIVISION },
        voiceDraftByEventId: {
          "voice:A@2": {
            operatorCandidateId: INITIATE,
            operandOccurrenceId: "spectrum:D@1-2",
          },
          "voice:E@5": {
            operatorCandidateId: EXPAND,
            operandOccurrenceId: "",
            operandVoiceEventId: "voice:A@2",
          },
        },
      },
    });

    expect(projection.structure.ok).toBe(true);
    expect(projection.structure.ok && projection.structure.target.writtenVoices).toEqual([
      { voice: "A", position: 2 },
      { voice: "E", position: 5 },
    ]);
    const chainedOperation = projection.operations.find(
      (operation) => operation.kind === "APPLY_VOICE_OPERATOR" && operation.voice === "E",
    );
    expect(chainedOperation).toMatchObject({
      kind: "APPLY_VOICE_OPERATOR",
      position: 5,
      voiceEventId: "voice:E@5",
      operatorCandidateId: EXPAND,
      inputSymbolId: "draft-voice-output-0",
      dependsOn: ["draft-voice-0"],
    });
    expect(projection.evaluation.ok).toBe(true);
    if (projection.evaluation.ok) {
      expect(projection.evaluation.symbols
        .filter(({ symbolKind }) => symbolKind === "VOICE_TRANSFORM")
        .map(({ text }) => text)).toEqual([
        "initiated(division)",
        "expanded(initiated(division))",
      ]);
      expect(projection.evaluation.symbolicComposition.status).toBe("PARTIAL_NULL");
      expect(projection.evaluation.sourceAuthorityPromotion).toBe("NONE");
      expect(projection.evaluation.historicalOrigin).toBe("NOT_CLAIMED");
    }
  });

  it("keeps an unavailable user-selected spectrum candidate Null", () => {
    const projection = buildCurrentWordSymbolicDraftProjectionV0_1({
      exactSpelling: "DALLIM",
      language: "sq",
      variety: "albanian",
      selections: {
        spectrumCandidateByOccurrenceId: { "spectrum:D@0-1": "not-a-registered-candidate" },
        voiceDraftByEventId: {},
      },
    });

    expect(projection.operations).toEqual([]);
    expect(projection.evaluation.ok).toBe(true);
    if (projection.evaluation.ok) {
      expect(projection.evaluation.spectrumOccurrences[0]?.status).toBe("UNKNOWN_OR_NULL");
      expect(projection.evaluation.symbolicComposition.status).toBe("PARTIAL_NULL");
      expect(projection.evaluation.symbolicComposition.reasonCodes).toContain("SPECTRUM_ASSOCIATION_MISSING:spectrum:D@0-1");
    }
  });

  it("starts with exact current-word structure, no selected symbolic choices, and explicit Null boundaries", () => {
    renderDraft();

    expect(screen.getByTestId("current-word-symbolic-code-points")).toHaveTextContent(
      "D@0 · A@1 · L@2 · L@3 · I@4 · M@5",
    );
    expect(screen.getByTestId("current-word-symbolic-written-voices")).toHaveTextContent("A@1 → I@4");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-symbolic-decision")).toHaveTextContent("No interpretation is selected automatically");
    expect(screen.getByTestId("current-word-symbolic-decision")).toHaveTextContent("user_decides");
    expect(screen.getByTestId("current-word-symbolic-decision")).not.toHaveTextContent(/winner/i);

    for (const label of [
      "Spectrum association for D at position 0",
      "Spectrum association for LL at position 2",
      "Voice operator for A@1",
      "Explicit operand for A@1",
      "Voice operator for I@4",
      "Explicit operand for I@4",
    ]) {
      expect(screen.getByLabelText(label)).toHaveValue("");
    }
    expect(screen.getByLabelText("Lexical sense for current-word graph meaning")).toHaveValue("");
    expect(screen.getByLabelText("Proposed functional form or function")).toHaveValue("");
    expect(screen.getByLabelText("Proposed function description")).toHaveValue("");
    expect(screen.getByTestId("current-word-graph-provenance")).toHaveTextContent(/source-authority promotion: NONE/i);
    expect(screen.getByTestId("current-word-graph-decision")).toHaveTextContent("Interpretation remains with the user");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveTextContent("none is chosen automatically");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveAttribute("data-interpretation-selection-mode", "no_single_winner");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveAttribute("data-selected-candidate-id", "null");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveAttribute("data-user-decision-posture", "user_decides");
    expect(screen.getByTestId("current-word-graph-summary")).not.toHaveTextContent(/winner|rank/i);
    expect(screen.getByTestId("current-word-symbolic-result")).not.toHaveTextContent("initiated(");
    expect(screen.getByTestId("current-word-symbolic-result")).toHaveTextContent("Source-authority promotion: NONE");
  });

  it("renders actual evaluator output from an explicit DALLIM occurrence, Voice event, operator, and operand", () => {
    renderDraft();
    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:spectrum:D@0-1");
    select("Voice operator for I@4", FOCUS);
    select("Spectrum association for LL at position 2", "ll:clarity");
    select("Explicit operand for I@4", "spectrum:spectrum:LL@2-4");

    const outputs = screen.getAllByTestId("current-word-symbolic-computed-output");
    expect(outputs).toHaveLength(2);
    expect(outputs[0]).toHaveTextContent("A@1 · initiated(division)");
    expect(outputs[1]).toHaveTextContent("I@4 · focused(clarity)");
    expect(screen.getByTestId("current-word-symbolic-operation-trace")).toHaveTextContent("APPLY_VOICE_OPERATOR · COMPUTED");
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("PARTIAL_NULL · UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-symbolic-result")).toHaveTextContent("USER_PROPOSED / EXPLORATORY_HYPOTHESIS");
    expect(screen.getByTestId("current-word-symbolic-result")).not.toHaveTextContent("COMPLETE_PROPOSED");
  });

  it("lets NDARJE explicitly expand the computed A@2 output and keeps the whole-word result partial", () => {
    renderDraft({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      targetLanguage: "Albanian",
      targetDialect: "Standard Albanian",
      currentWordEvidence: makeCurrentWordEvidence({
        analyzedWord: "NDARJE",
        sourceLookupStatus: "SOURCE_NOT_FOUND",
        sourceSenses: [],
      }),
    });

    expect(screen.getByTestId("current-word-symbolic-code-points")).toHaveTextContent(
      "N@0 · D@1 · A@2 · R@3 · J@4 · E@5",
    );
    expect(screen.getByTestId("current-word-symbolic-written-voices")).toHaveTextContent("A@2 → E@5");
    expect(screen.getByTestId("current-word-graph-source-sense-unavailable")).toHaveTextContent("No exact-form source sense is available");

    selectNdarjeVoiceOperations();
    expect(screen.getByLabelText("Explicit operand for E@5")).toHaveValue("voice:voice:A@2");
    const outputs = screen.getAllByTestId("current-word-symbolic-computed-output");
    expect(outputs).toHaveLength(2);
    expect(outputs[0]).toHaveTextContent("A@2 · initiated(division)");
    expect(outputs[1]).toHaveTextContent("E@5 · expanded(initiated(division))");
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("PARTIAL_NULL · UNKNOWN_OR_NULL");

    select("Spectrum association for D at position 1", LIGHT);
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[1]).toHaveTextContent("expanded(initiated(light))");
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")
      .map(({ textContent }) => textContent).join(" "))
      .not.toContain("expanded(initiated(division))");
  });

  it("shows a generated conditional reading from the selected Fjalori sense and live computed chain", () => {
    renderDraft({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      targetLanguage: "Albanian",
      targetDialect: "Standard Albanian",
      selectedSourceSense: selectedRuntimeNdarjeSense(),
    });

    expect(screen.getByTestId("current-word-exploratory-selected-sense")).toHaveTextContent(
      "SOURCE_FACT · CITATION_ENTERED_UNVERIFIED · division; separation",
    );
    expect(screen.getByTestId("current-word-exploratory-null")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByText(/DA functional-motivation candidate below uses qualifying exact-form source facts/i)).toBeInTheDocument();
    expect(screen.getByTestId("current-word-source-functional-manual-fallback")).not.toHaveAttribute("open");
    expect(screen.getByTestId("current-word-symbolic-code-points")).toHaveTextContent(
      "N@0 · D@1 · A@2 · R@3 · J@4 · E@5",
    );
    expect(screen.getByTestId("current-word-symbolic-written-voices")).toHaveTextContent("A@2 → E@5");

    selectNdarjeVoiceOperations();

    const explanation = screen.getByTestId("current-word-exploratory-explanation");
    expect(explanation).toHaveTextContent("division; separation");
    expect(explanation).toHaveTextContent("initiated(division)");
    expect(explanation).toHaveTextContent("expanded(initiated(division))");
    expect(screen.getByTestId("current-word-exploratory-computed-contributions")).toHaveTextContent(
      "COMPUTED · A@2 · INITIATE / GROUND(division) → initiated(division)",
    );
    expect(screen.getByTestId("current-word-exploratory-computed-contributions")).toHaveTextContent(
      "COMPUTED · E@5 · EXPAND / OUTWARD(initiated(division)) → expanded(initiated(division))",
    );
    expect(screen.getByTestId("current-word-exploratory-motivation")).toHaveTextContent("WHOLE_WORD_FUNCTION_NOT_ESTABLISHED");
    expect(screen.getByTestId("current-word-exploratory-motivation")).toHaveTextContent("SOURCE_SYMBOLIC_RELATION_NOT_REPORTED");
    expect(screen.getByTestId("current-word-exploratory-decision")).toHaveTextContent("no_single_winner · user_decides");
    expect(screen.getByTestId("current-word-exploratory-motivation")).toHaveTextContent("source-authority promotion NONE");
    expect(screen.getByTestId("current-word-exploratory-motivation")).toHaveTextContent("historical origin NOT_CLAIMED");

    select("Spectrum association for D at position 1", LIGHT);
    expect(screen.getByTestId("current-word-exploratory-explanation")).toHaveTextContent("initiated(light)");
    expect(screen.getByTestId("current-word-exploratory-explanation")).toHaveTextContent("expanded(initiated(light))");
    expect(screen.getByTestId("current-word-exploratory-explanation")).not.toHaveTextContent("initiated(division)");
  });

  it("displays a source-bounded NDARJE contribution chain without promoting its partial graph to a whole-word explanation", () => {
    renderDraft({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      targetLanguage: "Albanian",
      targetDialect: "Standard Albanian",
      currentWordEvidence: makeCurrentWordEvidence({
        analyzedWord: "NDARJE",
        sourceLookupStatus: "SOURCE_NOT_FOUND",
        sourceSenses: [],
      }),
    });

    completeNdarjeFunctionalDraft();

    const summary = screen.getByTestId("current-word-graph-summary");
    expect(summary).toHaveTextContent("Your proposed reading: Action/state of separation or division");
    expect(summary).toHaveTextContent("initiated(division) → an initiated act of dividing");
    expect(summary).toHaveTextContent("expanded(initiated(division)) → the division extended into separate parts");
    expect(summary).toHaveTextContent("Your proposed interaction");
    expect(summary).toHaveTextContent("N, R, J, and a word-specific NDAR + -JE formation remain unresolved.");
    expect(summary).toHaveTextContent("Explanation incomplete");
    expect(summary).toHaveTextContent("Some target structure or operations remain unresolved");
    expect(summary.querySelectorAll('[data-testid="current-word-graph-summary-contribution"]')).toHaveLength(2);
    expect(screen.getByTestId("current-word-graph-summary-proposed-interaction")).toHaveTextContent("USER_PROPOSAL / USER_PROPOSED");

    const details = screen.getByTestId("current-word-graph-details");
    expect(details).not.toHaveAttribute("open");
    fireEvent.click(screen.getByText("View detailed analysis and evidence"));
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-graph-whole-word-null")).toHaveTextContent("unresolved target structure prevents a whole-word explanation");
    expect(screen.queryByTestId("current-word-graph-whole-word-explanation")).not.toBeInTheDocument();
    expect(details).toHaveTextContent("GRAPH_MEANING_TARGET_COMPOSITION_PARTIAL_NULL");
    expect(screen.getByTestId("current-word-graph-selected-sense")).toHaveTextContent("USER_PROPOSAL · USER_PROPOSED · source IDs: none");
    expect(screen.queryByTestId("current-word-graph-source-record")).not.toBeInTheDocument();
    expect(screen.getByTestId("current-word-graph-alternatives")).toHaveTextContent("Alternative sense reported in FJALË NDARJE");
    expect(screen.getByTestId("current-word-graph-provenance")).toHaveTextContent("Source-authority promotion: NONE");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveAttribute("data-interpretation-selection-mode", "no_single_winner");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveAttribute("data-user-decision-posture", "user_decides");
  });

  it("changes computed output when the explicitly selected operand candidate changes", () => {
    renderDraft();
    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:spectrum:D@0-1");
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).toHaveTextContent("initiated(division)");

    select("Spectrum association for D at position 0", LIGHT);
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).toHaveTextContent("initiated(light)");
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).not.toHaveTextContent("initiated(division)");
  });

  it("recognizes LL as one occurrence and leaves an operator without an operand as evaluator Null", () => {
    renderDraft();
    expect(screen.getByLabelText("Spectrum association for LL at position 2")).toHaveValue("");
    expect(screen.queryByLabelText("Spectrum association for L at position 3")).not.toBeInTheDocument();
    select("Spectrum association for LL at position 2", "ll:clarity");
    expect(screen.getByLabelText("Spectrum association for LL at position 2")).toHaveValue("ll:clarity");

    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    expect(screen.queryByTestId("current-word-symbolic-computed-output")).not.toBeInTheDocument();
    expect(screen.getByTestId("current-word-symbolic-operation-trace")).toHaveTextContent("VOICE_OPERATOR_INPUT_SYMBOL_UNAVAILABLE");
    expect(screen.getByTestId("current-word-symbolic-operation-trace")).toHaveTextContent("PARTIAL_NULL");
  });

  it("shows matching source meaning separately without using it as an operator or promoting authority", () => {
    const currentWordEvidence = makeCurrentWordEvidence();
    const { rerender } = renderDraft({ currentWordEvidence });

    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("SOURCE_FACT");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("exact source form dallim");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("fixture:dallim");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("dallim#Albanian");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent(`SHA-256 ${"a".repeat(64)}`);
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("act of distinguishing");
    const senseSelector = screen.getByLabelText("Lexical sense for current-word graph meaning");
    expect(senseSelector).toHaveValue("");
    const sourceSenseOption = "source-sense:kaikki:fixture:dallim:sense:ordinal-1:1";
    expect(screen.getByRole("option", { name: /Source-reported .*act of distinguishing .*Source citation not independently verified/ })).toBeInTheDocument();
    expect(screen.getByTestId("current-word-symbolic-result")).toHaveTextContent("Source-authority promotion: NONE");
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-symbolic-result")).not.toHaveTextContent("act of distinguishing");

    fireEvent.change(senseSelector, { target: { value: sourceSenseOption } });
    expect(screen.getByTestId("current-word-graph-summary-meaning")).toHaveTextContent("Source-reported meaning: act of distinguishing");
    expect(screen.getByTestId("current-word-graph-summary-meaning")).toHaveTextContent("Source citation not independently verified");
    const evidenceDetails = screen.getByTestId("current-word-graph-details");
    expect(evidenceDetails).not.toHaveAttribute("open");
    fireEvent.click(screen.getByText("View detailed analysis and evidence"));
    expect(screen.getByTestId("current-word-graph-selected-sense")).toHaveTextContent("SOURCE_FACT · CITATION_ENTERED_UNVERIFIED");
    expect(screen.getByTestId("current-word-graph-selected-sense")).toHaveTextContent("fixture:dallim");
    expect(screen.getByTestId("current-word-graph-source-record")).toHaveTextContent("dallim#Albanian");
    expect(screen.getByTestId("current-word-graph-source-record")).toHaveTextContent(`fixture-source-family · SHA-256 ${"a".repeat(64)}`);
    expect(screen.getByTestId("current-word-graph-source-record")).toHaveTextContent("licensing: NOT_ASSESSED");
    expect(screen.getByTestId("current-word-graph-source-record")).toHaveTextContent("CITATION_ENTERED_UNVERIFIED");
    expect(screen.getByLabelText("Proposed functional form or function")).toHaveValue("");

    rerender(
      <CurrentWordSymbolicDraftV0_1
        analyzedWord="DALLIM"
        draftTargetWord="DALLIM"
        targetLanguage="English"
        targetDialect=""
        currentWordEvidence={currentWordEvidence}
      />,
    );
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("source evidence withheld");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).not.toHaveTextContent("act of distinguishing");
    expect(screen.getByLabelText("Lexical sense for current-word graph meaning")).toHaveValue("");
    expect(screen.queryByRole("option", { name: /Sense 1 .*act of distinguishing/ })).not.toBeInTheDocument();
    expect(screen.getByTestId("current-word-graph-selected-sense-null")).toHaveTextContent("UNKNOWN_OR_NULL");
  });

  it("keeps an unverified source alternative distinct beside a user-proposed reading", () => {
    renderDraft({ currentWordEvidence: makeCurrentWordEvidence({ sourceSenses: ["act of distinguishing", "difference"] }) });
    select("Lexical sense for current-word graph meaning", "USER_PROPOSED");
    fireEvent.change(screen.getByLabelText("Proposed lexical sense label"), { target: { value: "Act of distinguishing" } });
    fireEvent.change(screen.getByLabelText("Proposed sense definition"), { target: { value: "The act of distinguishing things." } });

    const summary = screen.getByTestId("current-word-graph-summary");
    expect(summary).toHaveTextContent("Your proposed reading: Act of distinguishing");
    expect(summary).toHaveTextContent("Source also records: difference");
    expect(summary).toHaveTextContent("Source citation not independently verified");
    expect(summary).not.toHaveTextContent("SOURCE_FACT");
  });

  it("accepts NFC-equivalent Albanian source spelling without changing its source record", () => {
    const analyzedWord = "GJITHÇKA";
    const currentWordEvidence = makeCurrentWordEvidence({
      analyzedWord,
      sourceForm: "GJITHC\u0327KA",
    });
    render(
      <CurrentWordSymbolicDraftV0_1
        analyzedWord={analyzedWord}
        draftTargetWord={analyzedWord}
        targetLanguage=""
        targetDialect=""
        currentWordEvidence={currentWordEvidence}
      />,
    );

    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("SOURCE_FACT");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("GJITHC\u0327KA");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("act of distinguishing");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("fixture:gjithçka");
  });

  it("withholds unrelated, non-fact, non-Albanian, nonmatching-status, and identity-mismatched source records", () => {
    const { rerender } = renderDraft({ currentWordEvidence: makeCurrentWordEvidence({ sourceForm: "DALLOJ" }) });
    const sourceMeaning = () => screen.getByTestId("current-word-symbolic-source-meaning");
    const sourceSenseOption = () => screen.queryByRole("option", { name: /Sense 1 .*act of distinguishing/ });

    expect(sourceMeaning()).not.toHaveTextContent("SOURCE_FACT");
    expect(sourceSenseOption()).not.toBeInTheDocument();

    rerender(<CurrentWordSymbolicDraftV0_1 analyzedWord="DALLIM" draftTargetWord="DALLIM" targetLanguage="" targetDialect="" currentWordEvidence={makeCurrentWordEvidence({ sourceLookupStatus: "SOURCE_NOT_FOUND" })} />);
    expect(sourceMeaning()).not.toHaveTextContent("SOURCE_FACT");
    expect(sourceSenseOption()).not.toBeInTheDocument();

    rerender(<CurrentWordSymbolicDraftV0_1 analyzedWord="DALLIM" draftTargetWord="DALLIM" targetLanguage="" targetDialect="" currentWordEvidence={makeCurrentWordEvidence({ attestationTruth: "candidate" })} />);
    expect(sourceMeaning()).not.toHaveTextContent("SOURCE_FACT");
    expect(sourceSenseOption()).not.toBeInTheDocument();

    rerender(<CurrentWordSymbolicDraftV0_1 analyzedWord="DALLIM" draftTargetWord="DALLIM" targetLanguage="English" targetDialect="" currentWordEvidence={makeCurrentWordEvidence()} />);
    expect(sourceMeaning()).toHaveTextContent("source evidence withheld");
    expect(sourceSenseOption()).not.toBeInTheDocument();

    rerender(<CurrentWordSymbolicDraftV0_1 analyzedWord="DALLIM" draftTargetWord="DALLIM" targetLanguage="sq" targetDialect="Tosk" currentWordEvidence={makeCurrentWordEvidence()} />);
    expect(sourceMeaning()).toHaveTextContent("source evidence withheld");
    expect(sourceSenseOption()).not.toBeInTheDocument();
  });

  it("shows the generated NDARJE functional candidate from validated exact-form facts without selecting a sense or symbolic operation", () => {
    render(
      <CurrentWordSymbolicDraftV0_1
        analyzedWord="NDARJE"
        draftTargetWord="NDARJE"
        targetLanguage=""
        targetDialect=""
        currentWordEvidence={makeCurrentWordEvidence({
          analyzedWord: "NDARJE",
          sourceForm: "ndarje",
          sourceSenses: ["division; separation", "a part into which something has been divided"],
        })}
      />,
    );

    const generated = screen.getAllByTestId("current-word-da-generated-functional-candidate");
    expect(generated).toHaveLength(2);
    const firstGenerated = within(generated[0]);
    expect(firstGenerated.getByTestId("current-word-da-generated-source-sense")).toHaveTextContent("SOURCE_FACT");
    expect(firstGenerated.getByTestId("current-word-da-generated-source-sense")).toHaveTextContent("fixture:ndarje");
    expect(firstGenerated.getByTestId("current-word-da-generated-structure")).toHaveTextContent("DA span [1,3)");
    expect(firstGenerated.getByTestId("current-word-da-generated-functional-reading")).toHaveTextContent(
      "DA “to split, cut, divide” → a dividing/separating action → the source sense “division; separation”",
    );
    expect(firstGenerated.getByTestId("current-word-da-generated-claim-boundary")).toHaveTextContent("UNSELECTED");
    expect(firstGenerated.getByTestId("current-word-da-generated-claim-boundary")).toHaveTextContent("PARTIAL_NULL");
    expect(firstGenerated.getByTestId("current-word-da-generated-claim-boundary")).toHaveTextContent("no_single_winner / user_decides");
    expect(firstGenerated.getByTestId("current-word-da-generated-unresolved")).toHaveTextContent("N@0 functional association UNKNOWN_OR_NULL");
    expect(firstGenerated.getByTestId("current-word-da-generated-unresolved")).toHaveTextContent("A@2 symbolic role UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-da-candidate-structure")).toHaveTextContent("N@0 · D@1 · A@2 · R@3 · J@4 · E@5");
    expect(screen.getByTestId("current-word-da-candidate-structure")).toHaveTextContent("A@2 → E@5");
    expect(screen.getByLabelText("Spectrum association for D at position 1")).toHaveValue("");
    expect(screen.getByLabelText("Voice operator for A@2")).toHaveValue("");
    expect(screen.getByLabelText("Voice operator for E@5")).toHaveValue("");
    expect(screen.getByLabelText("Propose DA at code-point span 1 to 3")).not.toBeChecked();
    expect(screen.getByLabelText("Propose DA at code-point span 1 to 3")).toBeDisabled();
    expect(screen.queryByTestId("current-word-symbolic-computed-output")).not.toBeInTheDocument();
  });

  it("clears selections when the parent workbench word, language, or dialect identity changes", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="DALLIM" />);
    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:spectrum:D@0-1");
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).toHaveTextContent("initiated(division)");

    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    expect(screen.getByLabelText("Spectrum association for D at position 0")).toHaveValue("");
    expect(screen.queryByTestId("current-word-symbolic-computed-output")).not.toBeInTheDocument();

    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:spectrum:D@0-1");
    fireEvent.change(screen.getByLabelText("Target dialect (optional)"), { target: { value: "Standard Albanian" } });
    expect(screen.getByLabelText("Spectrum association for D at position 0")).toHaveValue("");
    expect(screen.queryByTestId("current-word-symbolic-computed-output")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Exact target word"), { target: { value: "DALLOJ" } });
    expect(screen.getByTestId("current-word-symbolic-identity-mismatch")).toBeInTheDocument();
    expect(screen.queryByTestId("current-word-symbolic-selection-controls")).not.toBeInTheDocument();
    expect(screen.queryByTestId("current-word-symbolic-computed-output")).not.toBeInTheDocument();
  });

  it("does not alter the existing word proposal or select a prepared research example", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="DALLIM" />);

    expect(screen.getByLabelText("Exact target word")).toHaveValue("DALLIM");
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Choose a read-only method example" })).toHaveValue("");
    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:spectrum:D@0-1");

    expect(screen.getByLabelText("Exact target word")).toHaveValue("DALLIM");
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("");
    expect(screen.getByRole("combobox", { name: "Choose a read-only method example" })).toHaveValue("");
  });

  it("builds current-word graph meaning only from explicit computed nodes and typed mappings", () => {
    renderDraft();
    selectDallimVoiceOperations();
    completeDallimGraphMeaningDraft();

    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).toHaveTextContent("initiated(division)");
    const summary = screen.getByTestId("current-word-graph-summary");
    const details = screen.getByTestId("current-word-graph-details");
    expect(details).not.toHaveAttribute("open");
    expect(summary).toHaveTextContent("DALLIM");
    expect(summary).toHaveTextContent("Your proposed reading: Act of distinguishing");
    expect(summary).toHaveTextContent("initiated(division) → an initiated contribution proposed for distinguishing");
    expect(summary).toHaveTextContent("focused(clarity) → a focused clarity contribution proposed for distinguishing");
    expect(summary).toHaveTextContent("Proposal complete — not verified");
    expect(summary).toHaveTextContent("No interpretation is selected automatically");
    expect(summary.querySelectorAll('[data-testid="current-word-graph-summary-contribution"]')).toHaveLength(2);
    expect(summary).not.toHaveTextContent("GENERATED CONTRIBUTION");
    expect(summary).not.toHaveTextContent("whole-word explanatory bridge");

    expect(screen.getAllByTestId("current-word-graph-generated-contribution")).toHaveLength(2);
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("COMPLETE_PROPOSED");
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("COMPLETE_PROPOSED");
    expect(screen.getByTestId("current-word-graph-whole-word-explanation")).toHaveTextContent("composed from the unique generated contributions");
    expect(screen.getByTestId("current-word-graph-selected-sense")).toHaveTextContent("USER_PROPOSAL · USER_PROPOSED");
    expect(screen.getByTestId("current-word-graph-provenance")).toHaveTextContent("Linguistic applicability: NOT_ASSESSED");
    expect(screen.getByTestId("current-word-graph-provenance")).toHaveTextContent("Source-authority promotion: NONE");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveTextContent("Interpretation remains with the user");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveTextContent("none is chosen automatically");

    fireEvent.click(screen.getByText("View detailed analysis and evidence"));
    expect(details).toHaveAttribute("open");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveAttribute("data-interpretation-selection-mode", "no_single_winner");
    expect(screen.getByTestId("current-word-graph-decision")).toHaveAttribute("data-user-decision-posture", "user_decides");
    expect(details).toHaveTextContent("Source-authority promotion: NONE");
    expect(details).toHaveTextContent("The selected graph is a user-proposed reading of distinguishing.");
    expect(details).toHaveTextContent("INITIATE / GROUND(division) → initiated(division)");

    select("Spectrum association for D at position 0", LIGHT);
    expect(screen.getByTestId("current-word-graph-summary")).toHaveTextContent("initiated(light) → an initiated contribution proposed for distinguishing");
    expect(screen.getByTestId("current-word-graph-summary")).not.toHaveTextContent("initiated(division)");
    expect(screen.getByLabelText("Proposed functional role 1")).toHaveValue("an initiated contribution proposed for distinguishing");
    expect(screen.getAllByTestId("current-word-graph-generated-contribution")[0]).toHaveTextContent("initiated(light)");
    expect(screen.getAllByTestId("current-word-graph-generated-contribution").map(({ textContent }) => textContent).join(" "))
      .not.toContain("initiated(division)");
  });

  it("keeps incomplete edge or mapping drafts PARTIAL_NULL and does not treat bridge prose alone as completion", () => {
    renderDraft();
    selectDallimVoiceOperations();
    select("Lexical sense for current-word graph meaning", "USER_PROPOSED");
    fireEvent.change(screen.getByLabelText("Proposed lexical sense label"), { target: { value: "Act of distinguishing" } });
    fireEvent.change(screen.getByLabelText("Proposed sense definition"), { target: { value: "The act of distinguishing things." } });
    fireEvent.change(screen.getByLabelText("Proposed functional form or function"), { target: { value: "DALLOJ" } });
    fireEvent.change(screen.getByLabelText("Proposed function description"), { target: { value: "distinguish or recognize" } });
    select("Proposed lexical function relationship", "ACTION_OF_VERB_FUNCTION");
    fireEvent.click(screen.getByRole("button", { name: "Add user-proposed whole-word bridge" }));
    select("Interpretation role for bridge 1", "PRIMARY");
    fireEvent.change(screen.getByLabelText("Whole-word explanatory bridge 1"), { target: { value: "Free text does not complete the graph." } });

    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-graph-plain-status")).toHaveTextContent("Explanation incomplete");
    expect(screen.getByTestId("current-word-graph-summary-missing")).toHaveTextContent("relationship links");
    expect(screen.getByTestId("current-word-graph-whole-word-null")).toBeInTheDocument();
    expect(screen.getByTestId("current-word-graph-user-bridge-text")).toHaveTextContent("USER_PROPOSED");
    expect(screen.queryByTestId("current-word-graph-whole-word-explanation")).not.toBeInTheDocument();
  });

  it("removing a graph edge invalidates the whole-word explanation", () => {
    renderDraft();
    selectDallimVoiceOperations();
    completeDallimGraphMeaningDraft();
    expect(screen.getAllByTestId("current-word-graph-generated-contribution")).toHaveLength(2);

    fireEvent.click(screen.getByRole("button", { name: "Remove relationship 2" }));
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-graph-plain-status")).toHaveTextContent("Explanation incomplete");
    expect(screen.queryByTestId("current-word-graph-whole-word-explanation")).not.toBeInTheDocument();
  });

  it("removing role mappings removes their generated contribution and leaves an unmapped bridge partial", () => {
    renderDraft();
    selectDallimVoiceOperations();
    completeDallimGraphMeaningDraft();
    fireEvent.click(screen.getByRole("button", { name: "Remove role mapping 1" }));
    expect(screen.getAllByTestId("current-word-graph-generated-contribution")).toHaveLength(1);
    expect(screen.getAllByTestId("current-word-graph-summary-contribution")).toHaveLength(1);
    expect(screen.getAllByTestId("current-word-graph-generated-contribution").map(({ textContent }) => textContent).join(" "))
      .not.toContain("initiated(division)");

    fireEvent.click(screen.getByRole("button", { name: "Remove role mapping 1" }));
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-graph-summary-contribution-null")).toHaveTextContent("Not established — no valid computed contribution is available.");
    expect(screen.getByTestId("current-word-graph-contribution-null")).toHaveTextContent("UNKNOWN_OR_NULL · no valid computed contribution.");
    expect(screen.queryByTestId("current-word-graph-whole-word-explanation")).not.toBeInTheDocument();
  });

  it("withholds stale bridge claims when the current target identity changes", () => {
    const { rerender } = renderDraft();
    select("Lexical sense for current-word graph meaning", "USER_PROPOSED");
    fireEvent.change(screen.getByLabelText("Proposed lexical sense label"), { target: { value: "Act of distinguishing" } });
    fireEvent.change(screen.getByLabelText("Proposed sense definition"), { target: { value: "The act of distinguishing things." } });
    fireEvent.click(screen.getByRole("button", { name: "Add user-proposed whole-word bridge" }));
    select("Interpretation role for bridge 1", "PRIMARY");
    fireEvent.change(screen.getByLabelText("Whole-word explanatory bridge 1"), { target: { value: "A draft identity-bound proposal." } });
    expect(screen.getByTestId("current-word-graph-user-bridge-text")).toHaveTextContent("A draft identity-bound proposal.");

    rerender(<CurrentWordSymbolicDraftV0_1 analyzedWord="DALLIM" draftTargetWord="DALLOJ" targetLanguage="Albanian" targetDialect="Standard Albanian" />);
    expect(screen.getByTestId("current-word-graph-identity-null")).toBeInTheDocument();
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-graph-summary-meaning-null")).toHaveTextContent("Not established");
    expect(screen.getByTestId("current-word-graph-summary-missing")).toHaveTextContent("identity-bound explanation is withheld");
    expect(screen.getByTestId("current-word-graph-summary")).not.toHaveTextContent("Act of distinguishing");
    expect(screen.queryByTestId("current-word-graph-user-bridge-text")).not.toBeInTheDocument();
    expect(screen.queryByTestId("current-word-graph-selected-sense")).not.toBeInTheDocument();
  });
});
