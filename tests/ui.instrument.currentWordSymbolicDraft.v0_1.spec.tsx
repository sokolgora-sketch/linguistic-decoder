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
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL · NOT_YET_MAPPED");
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
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-symbolic-graph-status")).toHaveTextContent("PARTIAL_NULL · NOT_YET_MAPPED");
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
    const currentWordEvidence = {
      analyzedWord: "DALLIM",
      discovery: {
        kind: "present",
        value: {
          inputWord: "DALLIM",
          inputLanguage: "sq",
          inputProfile: "albanian",
          sourceFact: { language: "Albanian" },
          exactLexicalSourceStatus: { status: "MATCHES_FOUND" },
          exactLexicalSourceFacts: [{
            languageCode: "sq",
            form: "DALLIM",
            attestationTruth: "fact",
            sourceStatus: "observed_external_snapshot",
            sourceRecordId: "fixture:dallim",
            entryLocator: "dallim#Albanian",
            senses: [{ glosses: ["act of distinguishing"] }],
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
    const { rerender } = renderDraft({ currentWordEvidence });

    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("SOURCE_FACT");
    expect(screen.getByTestId("current-word-symbolic-source-meaning")).toHaveTextContent("act of distinguishing");
    expect(screen.getByTestId("current-word-symbolic-result")).toHaveTextContent("Source-authority promotion: NONE");
    expect(screen.getByTestId("current-word-symbolic-whole-word-status")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByTestId("current-word-symbolic-result")).not.toHaveTextContent("act of distinguishing");

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
});
