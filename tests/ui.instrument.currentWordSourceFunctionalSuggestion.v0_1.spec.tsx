import { fireEvent, render, screen } from "@testing-library/react";
import {
  buildCurrentWordSourceFunctionalSuggestionV0_1,
  type CurrentWordSourceFunctionalSuggestionDraftV0_1,
} from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";
import { CurrentWordSourceFunctionalSuggestionV0_1 } from "@/ui/instrument/sections/CurrentWordSourceFunctionalSuggestionV0_1";
import { CurrentWordSymbolicDraftV0_1 } from "@/ui/instrument/sections/CurrentWordSymbolicDraftV0_1";

function validDraft(overrides: Partial<CurrentWordSourceFunctionalSuggestionDraftV0_1> = {}): CurrentWordSourceFunctionalSuggestionDraftV0_1 {
  return {
    analyzedWord: "NDARJE",
    draftTargetWord: "NDARJE",
    language: "Albanian",
    variety: "Standard Albanian",
    sourceTargetForm: "NDARJE",
    targetSenseLabel: "Action/state corresponding to NDAJ or NDAHEM",
    targetSenseDefinition: "Action or state of separating, as described through the related verbs.",
    targetSourceLabel: "FJALË — NDARJE",
    targetSourceUrl: "https://fjale.al/ndarje",
    targetSourceLocator: "sense 1; action/state according to NDAJ and NDAHEM",
    relatedVerbForm: "NDAJ",
    verbFunctionText: "separate things or people that are together; divide a whole into parts",
    verbSourceLabel: "FJALË — NDAJ",
    verbSourceUrl: "https://fjale.al/ndaj",
    verbSourceLocator: "senses 1 and 5",
    sourceReportsActionRelation: true,
    alternativeSenseLabel: "Part or compartment",
    alternativeSenseDefinition: "A part into which something has been divided.",
    ...overrides,
  };
}

function fillNdarjeForm() {
  const values: ReadonlyArray<readonly [string, string]> = [
    ["Exact source target form", "NDARJE"],
    ["Source-reported target sense label", "Action/state corresponding to NDAJ or NDAHEM"],
    ["Source target sense paraphrase", "Action or state of separating according to the related verbs."],
    ["Related source verb form", "NDAJ"],
    ["Source verb function paraphrase", "separate things or people that are together; divide a whole into parts"],
    ["Target source label", "FJALË — NDARJE"],
    ["Target source URL", "https://fjale.al/ndarje"],
    ["Target source locator", "sense 1; action/state according to NDAJ and NDAHEM"],
    ["Verb source label", "FJALË — NDAJ"],
    ["Verb source URL", "https://fjale.al/ndaj"],
    ["Verb source locator", "senses 1 and 5"],
    ["Alternative source sense label", "Part or compartment"],
    ["Alternative source sense paraphrase", "A part into which something has been divided."],
  ];
  for (const [label, value] of values) {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
  }
  fireEvent.click(screen.getByLabelText("Source explicitly relates this action sense to the verb"));
}

describe("current-word source functional suggestion v0.1", () => {
  it("computes a repeatable conditional function from an explicitly entered exact target relation", () => {
    const first = buildCurrentWordSourceFunctionalSuggestionV0_1(validDraft());
    const second = buildCurrentWordSourceFunctionalSuggestionV0_1(validDraft());
    expect(first).toEqual(second);
    expect(first.status).toBe("CONDITIONAL_SUGGESTION");
    expect(first.result?.ok).toBe(true);
    if (!first.result?.ok) return;

    const { content } = first.result;
    expect(content.target.codePoints).toEqual(Array.from("NDARJE").map((character, position) => ({ character, position })));
    expect(content.target.writtenVoices).toEqual([{ voice: "A", position: 2 }, { voice: "E", position: 5 }]);
    expect(content.target.pronunciationAuthority).toBe("NOT_ESTABLISHED");
    expect(content.compositions).toHaveLength(1);
    expect(content.compositions[0]).toMatchObject({
      resultText: "Action/process corresponding to the verb function: separate things or people that are together; divide a whole into parts",
      claimLayer: "LOGICAL_INFERENCE",
      status: "COMPOSED_FROM_SOURCE_RELATION",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      linguisticApplicability: "NOT_ASSESSED",
      provenance: {
        relation: { claimLayer: "SOURCE_FACT", evidenceStatus: "CITATION_ENTERED_UNVERIFIED", sourceIds: ["entered-target-source-citation"] },
        function: { claimLayer: "SOURCE_FACT", evidenceStatus: "CITATION_ENTERED_UNVERIFIED", sourceIds: ["entered-verb-source-citation"] },
      },
    });
    expect(content.target.alternativeSenses).toEqual([expect.objectContaining({
      label: "Part or compartment",
      functionalFrame: "OTHER",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
    })]);
    expect(content.segmentations).toEqual([]);
    expect(content.consonantStructures.filter(({ character }) => ["N", "R", "J"].includes(character)).every(({ status }) => status === "UNKNOWN_OR_NULL")).toBe(true);
    expect(content.voiceEvents.map(({ voice, position, roleStatus }) => ({ voice, position, roleStatus }))).toEqual([
      { voice: "A", position: 2, roleStatus: "UNKNOWN_OR_NULL" },
      { voice: "E", position: 5, roleStatus: "UNKNOWN_OR_NULL" },
    ]);
    expect(content.selection).toEqual({ mode: "no_single_winner", selectedCandidateId: null, userDecisionPosture: "user_decides" });
    expect(content.sourceAuthorityPromotion).toBe("NONE");
    expect(content.historicalOrigin).toBe("NOT_CLAIMED");

    const normalizedSourceForm = buildCurrentWordSourceFunctionalSuggestionV0_1(validDraft({ sourceTargetForm: " ndarje " }));
    expect(normalizedSourceForm.status).toBe("CONDITIONAL_SUGGESTION");
  });

  it.each([
    ["rejects a different target source form", { sourceTargetForm: "NDAJ" }, "SOURCE_TARGET_FORM_MISMATCH"],
    ["rejects a changed draft identity", { draftTargetWord: "NDAJ" }, "CURRENT_WORD_IDENTITY_MISMATCH"],
    ["rejects a non-Albanian target context", { language: "English" }, "TARGET_LANGUAGE_NOT_ALBANIAN"],
    ["rejects a language label that merely contains Albanian", { language: "not Albanian" }, "TARGET_LANGUAGE_NOT_ALBANIAN"],
    ["requires an explicit source-reported relation", { sourceReportsActionRelation: false }, "SOURCE_ACTION_RELATION_NOT_ENTERED"],
    ["rejects a partial alternative sense", { alternativeSenseDefinition: "" }, "ALTERNATIVE_SENSE_INCOMPLETE"],
  ])("%s", (_label, overrides, reasonCode) => {
    const result = buildCurrentWordSourceFunctionalSuggestionV0_1(validDraft(overrides));
    expect(result.status).toBe("PARTIAL_NULL");
    expect(result.result).toBeNull();
    expect(result.reasonCodes).toContain(reasonCode);
  });

  it("keeps source-not-found as Null until the user enters and classifies separate citations", () => {
    render(
      <CurrentWordSourceFunctionalSuggestionV0_1
        analyzedWord="NDARJE"
        draftTargetWord="NDARJE"
        language="Albanian"
        variety="Standard Albanian"
        identityMatches
        runtimeSourceStatus={{ status: "SOURCE_NOT_FOUND", reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND" }}
      />,
    );
    expect(screen.getByTestId("current-word-source-suggestion-runtime-status")).toHaveTextContent("SOURCE_NOT_FOUND");
    expect(screen.getByTestId("current-word-source-functional-null")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.queryByTestId("current-word-source-functional-suggestion-text")).not.toBeInTheDocument();

    fillNdarjeForm();
    expect(screen.getByTestId("current-word-source-functional-suggestion-text")).toHaveTextContent("NDARJE: Action/process corresponding to the verb function");
    expect(screen.getByTestId("current-word-source-functional-suggestion-text")).toHaveTextContent("separate things or people that are together; divide a whole into parts");
    expect(screen.getByTestId("current-word-source-functional-suggestion-text").parentElement).toHaveTextContent("LOGICAL_INFERENCE");
    expect(screen.getByTestId("current-word-source-functional-suggestion-text").parentElement).toHaveTextContent("CITATION_ENTERED_UNVERIFIED");
    expect(screen.getByTestId("current-word-source-functional-suggestion-text").parentElement).toHaveTextContent("NOT_ASSESSED");
    expect(screen.getByTestId("current-word-source-functional-alternative")).toHaveTextContent("Part or compartment");
    expect(screen.getByTestId("current-word-source-functional-relation")).toHaveTextContent("Why suggested");
    expect(screen.getByTestId("current-word-source-functional-details")).not.toHaveAttribute("open");
    fireEvent.click(screen.getByText("View source and structural accounting"));
    expect(screen.getByTestId("current-word-source-functional-code-points")).toHaveTextContent("N@0 · D@1 · A@2 · R@3 · J@4 · E@5");
    expect(screen.getByText(/source authority promotion: NONE/)).toBeInTheDocument();
    expect(screen.getByText(/Unassigned target Voice roles: A@2, E@5 · UNKNOWN_OR_NULL/)).toBeInTheDocument();
    expect(screen.getByText(/Unassigned consonant associations: N@0, D@1, R@3, J@4 · UNKNOWN_OR_NULL/)).toBeInTheDocument();
  });

  it("withholds entered source relationships when the current draft target differs", () => {
    render(
      <CurrentWordSourceFunctionalSuggestionV0_1
        analyzedWord="NDARJE"
        draftTargetWord="NDAJ"
        language="Albanian"
        variety="Standard Albanian"
        identityMatches={false}
      />,
    );
    expect(screen.getByTestId("current-word-source-suggestion-identity-null")).toHaveTextContent("PARTIAL_NULL");
    expect(screen.queryByLabelText("Exact source target form")).not.toBeInTheDocument();
    expect(screen.queryByTestId("current-word-source-functional-suggestion-text")).not.toBeInTheDocument();
  });

  it("keeps the conditional source suggestion separate from the unselected symbolic graph", () => {
    render(
      <CurrentWordSymbolicDraftV0_1
        analyzedWord="NDARJE"
        draftTargetWord="NDARJE"
        targetLanguage="Albanian"
        targetDialect="Standard Albanian"
        currentWordEvidence={{
          analyzedWord: "NDARJE",
          discovery: { kind: "present", value: {
            inputWord: "NDARJE",
            inputLanguage: "sq",
            inputProfile: "Standard Albanian",
            sourceFact: { language: "Albanian" },
            exactLexicalSourceStatus: { status: "SOURCE_NOT_FOUND", reasonCode: "ALBANIAN_EXACT_FORM_NOT_FOUND" },
            exactLexicalSourceFacts: [],
          } },
        } as never}
      />,
    );
    expect(screen.getByTestId("current-word-source-functional-null")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByLabelText("Spectrum association for D at position 1")).toHaveValue("");
    expect(screen.getByLabelText("Voice operator for A@2")).toHaveValue("");
    expect(screen.getByTestId("current-word-symbolic-result")).toHaveTextContent("UNKNOWN_OR_NULL");

    fireEvent.change(screen.getByLabelText("Spectrum association for D at position 1"), { target: { value: "d:division" } });
    fireEvent.change(screen.getByLabelText("Voice operator for A@2"), { target: { value: "voice-a:initiate-ground" } });
    fireEvent.change(screen.getByLabelText("Explicit operand for A@2"), { target: { value: "spectrum:spectrum:D@1-2" } });
    fireEvent.change(screen.getByLabelText("Voice operator for E@5"), { target: { value: "voice-e:expand-outward" } });
    fireEvent.change(screen.getByLabelText("Explicit operand for E@5"), { target: { value: "voice:voice:A@2" } });
    expect(screen.getAllByTestId("current-word-symbolic-computed-output").map((node) => node.textContent)).toEqual([
      expect.stringContaining("initiated(division)"),
      expect.stringContaining("expanded(initiated(division))"),
    ]);
    expect(screen.getAllByTestId("current-word-symbolic-computed-output").every((node) => node.textContent?.includes("USER_PROPOSED / EXPLORATORY_HYPOTHESIS"))).toBe(true);
  });
});
