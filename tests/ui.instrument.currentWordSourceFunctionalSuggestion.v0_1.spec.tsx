import { fireEvent, render, screen } from "@testing-library/react";
import {
  buildCurrentWordExploratoryMotivationV0_1,
  buildCurrentWordSourceFunctionalSuggestionV0_1,
  type CurrentWordSourceFunctionalSuggestionDraftV0_1,
  type RuntimeAlbanianSourceSenseSelectionV0_1,
} from "@/ui/instrument/sections/currentWordSourceFunctionalSuggestionAdapter.v0_1";
import { CurrentWordSourceFunctionalSuggestionV0_1 } from "@/ui/instrument/sections/CurrentWordSourceFunctionalSuggestionV0_1";
import { CurrentWordSymbolicDraftV0_1, buildCurrentWordSymbolicDraftProjectionV0_1 } from "@/ui/instrument/sections/CurrentWordSymbolicDraftV0_1";
import type { SymbolicFunctionalCompositionResultV0_3 } from "@/shared/openInstrument/symbolicFunctionalComposition.v0_3";

const DIVISION = "d:division";
const LIGHT = "d:light";
const INITIATE = "voice-a:initiate-ground";
const EXPAND = "voice-e:expand-outward";

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
  fireEvent.click(screen.getByText("Optional manual research fallback · enter separate source claims"));
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

function runtimeNdarjeSense(): RuntimeAlbanianSourceSenseSelectionV0_1 {
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
    alternativeSenses: [{
      entryIndex: 1,
      senseIndex: 2,
      partOfSpeech: "noun",
      gloss: "a divided part",
      glossLanguage: "en",
      senseSource: "editor",
      tags: [],
      entrySources: ["sq-wiktionary", "editor"],
    }],
  };
}

function evaluatedNdarje(associationCandidateId = DIVISION, includeExpand = true): SymbolicFunctionalCompositionResultV0_3 {
  const empty = buildCurrentWordSymbolicDraftProjectionV0_1({
    exactSpelling: "NDARJE",
    language: "sq",
    variety: "Standard Albanian",
    selections: { spectrumCandidateByOccurrenceId: {}, voiceDraftByEventId: {} },
  });
  if (!empty.structure.ok) throw new Error("NDARJE structure did not compile in test fixture");
  const occurrence = empty.structure.spectrumOccurrences.find(({ unit }) => unit === "D");
  const aEvent = empty.structure.voiceEvents.find(({ voice, position }) => voice === "A" && position === 2);
  const eEvent = empty.structure.voiceEvents.find(({ voice, position }) => voice === "E" && position === 5);
  if (!occurrence || !aEvent || !eEvent) throw new Error("NDARJE D/A/E test occurrences were not found");
  return buildCurrentWordSymbolicDraftProjectionV0_1({
    exactSpelling: "NDARJE",
    language: "sq",
    variety: "Standard Albanian",
    selections: {
      spectrumCandidateByOccurrenceId: { [occurrence.occurrenceId]: associationCandidateId },
      voiceDraftByEventId: {
        [aEvent.eventId]: { operatorCandidateId: INITIATE, operandOccurrenceId: occurrence.occurrenceId },
        ...(includeExpand ? { [eEvent.eventId]: { operatorCandidateId: EXPAND, operandVoiceEventId: aEvent.eventId, operandOccurrenceId: "" } } : {}),
      },
    },
  }).evaluation;
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
    expect(screen.getByTestId("current-word-exploratory-null")).toHaveTextContent("SOURCE_SENSE_NOT_SELECTED");
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

  it("generates a conditional reading from the selected runtime sense and verified evaluator outputs", () => {
    const selection = runtimeNdarjeSense();
    const evaluation = evaluatedNdarje();
    if (!evaluation.ok) throw new Error("expected successful symbolic evaluation");
    const projection = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: selection,
      evaluation,
    });

    expect(projection.status).toBe("CONDITIONAL_SUGGESTION");
    expect(projection.sourceContent?.ok).toBe(true);
    if (!projection.sourceContent?.ok) return;
    expect(projection.sourceContent.content.target.codePoints).toEqual(
      Array.from("NDARJE").map((character, position) => ({ character, position })),
    );
    expect(projection.sourceContent.content.target.writtenVoices).toEqual([
      { voice: "A", position: 2 },
      { voice: "E", position: 5 },
    ]);
    expect(projection.sourceContent.content.target.selectedSense).toMatchObject({
      label: "division; separation",
      claimLayer: "SOURCE_FACT",
      evidenceStatus: "CITATION_ENTERED_UNVERIFIED",
      functionalFrame: "UNKNOWN_OR_NULL",
    });
    expect(projection.computedContributions.map(({ contribution }) => contribution)).toEqual([
      "INITIATE / GROUND(division) → initiated(division)",
      "EXPAND / OUTWARD(initiated(division)) → expanded(initiated(division))",
    ]);
    expect(projection.conditionalExplanation).toContain("could be proposed as a conditional functional framing");
    expect(projection.reasonCodes).toContain("SOURCE_SYMBOLIC_RELATION_NOT_REPORTED");
    expect(projection.wholeWordStatus).toBe("PARTIAL_NULL");
    expect(projection.sourceAuthorityPromotion).toBe("NONE");
    expect(projection.historicalOrigin).toBe("NOT_CLAIMED");
    expect(projection.noSingleWinner).toBe(true);
    expect(projection.userDecisionPosture).toBe("user_decides");

    const changed = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: selection,
      evaluation: evaluatedNdarje(LIGHT),
    });
    expect(changed.computedContributions[0]?.outputText).toBe("initiated(light)");
    expect(changed.conditionalExplanation).toContain("initiated(light)");
    expect(changed.conditionalExplanation).not.toContain("initiated(division)");
  });

  it("keeps unresolved structure and broken Voice dependencies partial", () => {
    const evaluation = evaluatedNdarje();
    if (!evaluation.ok) throw new Error("expected evaluator success result");
    const brokenEvaluation = {
      ...evaluation,
      operationTrace: evaluation.operationTrace.map((trace) => trace.kind === "APPLY_VOICE_OPERATOR" && trace.targetVoiceEventId === "voice:E@5"
        ? { ...trace, dependsOn: [] }
        : trace),
    } as SymbolicFunctionalCompositionResultV0_3;
    const projection = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation: brokenEvaluation,
    });
    expect(projection.status).toBe("PARTIAL_NULL");
    expect(projection.wholeWordStatus).toBe("PARTIAL_NULL");
    expect(projection.computedContributions).toHaveLength(1);
    expect(projection.unresolved).toContain("VOICE_OPERATION_NOT_VERIFIABLY_COMPUTED:draft-voice-1");
    expect(projection.conditionalExplanation).toContain("initiated(division)");

    const mismatched = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDAJ",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation,
    });
    expect(mismatched.status).toBe("PARTIAL_NULL");
    expect(mismatched.sourceContent).toBeNull();
    expect(mismatched.reasonCodes).toContain("CURRENT_WORD_IDENTITY_MISMATCH");
    expect(mismatched.conditionalExplanation).toBeNull();
  });

  it("withholds a direct Voice result when its spectrum-selection dependency is absent", () => {
    const evaluation = evaluatedNdarje();
    if (!evaluation.ok) throw new Error("expected successful symbolic evaluation");
    const brokenEvaluation = {
      ...evaluation,
      operationTrace: evaluation.operationTrace.map((trace) =>
        trace.kind === "APPLY_VOICE_OPERATOR" && trace.targetVoiceEventId === "voice:A@2"
          ? { ...trace, dependsOn: [] }
          : trace,
      ),
    } as SymbolicFunctionalCompositionResultV0_3;

    const projection = buildCurrentWordExploratoryMotivationV0_1({
      analyzedWord: "NDARJE",
      draftTargetWord: "NDARJE",
      language: "Albanian",
      variety: "Standard Albanian",
      selectedSourceSense: runtimeNdarjeSense(),
      evaluation: brokenEvaluation,
    });

    expect(projection.status).toBe("PARTIAL_NULL");
    expect(projection.computedContributions).toHaveLength(0);
    expect(projection.unresolved).toContain("VOICE_OPERATION_NOT_VERIFIABLY_COMPUTED:draft-voice-0");
    expect(projection.conditionalExplanation).toBeNull();
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
