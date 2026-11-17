import { fireEvent, render, screen } from "@testing-library/react";
import {
  buildCurrentWordSymbolicDraftProjectionV0_1,
  CurrentWordSymbolicDraftV0_1,
} from "@/ui/instrument/sections/CurrentWordSymbolicDraftV0_1";
import { SingleWordMotivationWorkbenchV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";
import type { SingleWordCurrentWordEvidenceContextV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";

const DIVISION = "d:division";
const LIGHT = "d:light";
const INITIATE = "voice-a:initiate-ground";
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
        inputWord: analyzedWord,
        inputLanguage: options.inputLanguage ?? "sq",
        inputProfile: options.inputProfile ?? "albanian",
        sourceFact: { language: "Albanian" },
        exactLexicalSourceStatus: { status: options.sourceLookupStatus ?? "MATCHES_FOUND" },
        exactLexicalSourceFacts: [{
          languageCode: options.languageCode ?? "sq",
          form: sourceForm,
          attestationTruth: options.attestationTruth ?? "fact",
          sourceStatus: "observed_external_snapshot",
          sourceRecordId: `fixture:${normalizedSourceForm}`,
          entryLocator: `${normalizedSourceForm}#Albanian`,
          senses: (options.sourceSenses ?? ["act of distinguishing"]).map((gloss) => ({ glosses: [gloss] })),
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
  select("Voice operator for A@1", INITIATE);
  select("Explicit operand for A@1", "spectrum:D@0-1");
  select("Spectrum association for L at position 3", "l:linear-flow");
  select("Voice operator for I@4", FOCUS);
  select("Explicit operand for I@4", "spectrum:L@3-4");
}

function completeDallimGraphMeaningDraft() {
  select("Spectrum association for L at position 2", "l:spreading");
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
  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed graph relationship" }));
  select("Left computed node for relationship 1", "selection:spectrum:D@0-1");
  select("Relationship text 1", "produces");
  select("Right computed node for relationship 1", "voice:voice:A@1");
  select("Left computed node for relationship 2", "voice:voice:A@1");
  select("Relationship text 2", "continues through");
  select("Right computed node for relationship 2", "selection:spectrum:L@2-3");
  select("Left computed node for relationship 3", "selection:spectrum:L@2-3");
  select("Relationship text 3", "is traced across");
  select("Right computed node for relationship 3", "selection:spectrum:L@3-4");
  select("Left computed node for relationship 4", "selection:spectrum:L@3-4");
  select("Relationship text 4", "is focused as");
  select("Right computed node for relationship 4", "voice:voice:I@4");
  select("Left computed node for relationship 5", "voice:voice:I@4");
  select("Relationship text 5", "yields");
  select("Right computed node for relationship 5", "selection:spectrum:M@5-6");

  fireEvent.click(screen.getByRole("button", { name: "Add user-proposed whole-word bridge" }));
  select("Interpretation role for bridge 1", "PRIMARY");
  fireEvent.change(screen.getByLabelText("Whole-word explanatory bridge 1"), { target: { value: "The selected graph is a user-proposed reading of distinguishing." } });

  fireEvent.click(screen.getByRole("button", { name: "Add proposed role mapping" }));
  fireEvent.click(screen.getByRole("button", { name: "Add proposed role mapping" }));
  select("Bridge for role mapping 1", "bridge-6");
  select("Computed output for role mapping 1", "symbol:voice:voice:A@1");
  fireEvent.change(screen.getByLabelText("Proposed functional role 1"), { target: { value: "an initiated distinction" } });
  select("Bridge for role mapping 2", "bridge-6");
  select("Computed output for role mapping 2", "symbol:voice:voice:I@4");
  fireEvent.change(screen.getByLabelText("Proposed functional role 2"), { target: { value: "a focused distinction" } });
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
      "Spectrum association for L at position 2",
      "Spectrum association for L at position 3",
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
    expect(screen.getByTestId("current-word-graph-summary")).not.toHaveTextContent(/winner|rank/i);
    expect(screen.getByTestId("current-word-symbolic-result")).not.toHaveTextContent("initiated(");
    expect(screen.getByTestId("current-word-symbolic-result")).toHaveTextContent("Source-authority promotion: NONE");
  });

  it("renders actual evaluator output from an explicit DALLIM occurrence, Voice event, operator, and operand", () => {
    renderDraft();
    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:D@0-1");
    select("Voice operator for I@4", FOCUS);
    select("Spectrum association for L at position 3", "l:linear-flow");
    select("Explicit operand for I@4", "spectrum:L@3-4");

    const outputs = screen.getAllByTestId("current-word-symbolic-computed-output");
    expect(outputs).toHaveLength(2);
    expect(outputs[0]).toHaveTextContent("A@1 · initiated(division)");
    expect(outputs[1]).toHaveTextContent("I@4 · focused(linear flow)");
    expect(screen.getByTestId("current-word-symbolic-operation-trace")).toHaveTextContent("APPLY_VOICE_OPERATOR · COMPUTED");
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("PARTIAL_NULL · UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.getByTestId("current-word-symbolic-result")).toHaveTextContent("USER_PROPOSED / EXPLORATORY_HYPOTHESIS");
    expect(screen.getByTestId("current-word-symbolic-result")).not.toHaveTextContent("COMPLETE_PROPOSED");
  });

  it("changes computed output when the explicitly selected operand candidate changes", () => {
    renderDraft();
    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:D@0-1");
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).toHaveTextContent("initiated(division)");

    select("Spectrum association for D at position 0", LIGHT);
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).toHaveTextContent("initiated(light)");
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).not.toHaveTextContent("initiated(division)");
  });

  it("keeps repeated occurrences independent and leaves an operator without an operand as evaluator Null", () => {
    renderDraft();
    select("Spectrum association for L at position 2", "l:spreading");
    select("Spectrum association for L at position 3", "l:linear-flow");
    expect(screen.getByLabelText("Spectrum association for L at position 2")).toHaveValue("l:spreading");
    expect(screen.getByLabelText("Spectrum association for L at position 3")).toHaveValue("l:linear-flow");

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

  it("clears selections when the parent workbench word, language, or dialect identity changes", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="DALLIM" />);
    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:D@0-1");
    expect(screen.getAllByTestId("current-word-symbolic-computed-output")[0]).toHaveTextContent("initiated(division)");

    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    expect(screen.getByLabelText("Spectrum association for D at position 0")).toHaveValue("");
    expect(screen.queryByTestId("current-word-symbolic-computed-output")).not.toBeInTheDocument();

    select("Spectrum association for D at position 0", DIVISION);
    select("Voice operator for A@1", INITIATE);
    select("Explicit operand for A@1", "spectrum:D@0-1");
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
    select("Explicit operand for A@1", "spectrum:D@0-1");

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
    expect(summary).toHaveTextContent("initiated(division) → an initiated distinction");
    expect(summary).toHaveTextContent("focused(linear flow) → a focused distinction");
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
    expect(details).toHaveTextContent("no_single_winner");
    expect(details).toHaveTextContent("user_decides");
    expect(details).toHaveTextContent("Source-authority promotion: NONE");
    expect(details).toHaveTextContent("The selected graph is a user-proposed reading of distinguishing.");
    expect(details).toHaveTextContent("INITIATE / GROUND(division) → initiated(division)");

    select("Spectrum association for D at position 0", LIGHT);
    expect(screen.getByTestId("current-word-graph-summary")).toHaveTextContent("initiated(light) → an initiated distinction");
    expect(screen.getByTestId("current-word-graph-summary")).not.toHaveTextContent("initiated(division)");
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
