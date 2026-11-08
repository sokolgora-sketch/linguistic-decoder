import { fireEvent, render, screen } from "@testing-library/react";
import {
  SingleWordMotivationWorkbenchV0_1,
  type SingleWordCurrentWordEvidenceContextV0_1,
} from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";
import type { MotivationDiscoveryV0_1VM } from "@/ui/telemetry/types";

function makeCurrentWordEvidence(
  word: string,
  options: {
    status?: "MATCHES_FOUND" | "SOURCE_NOT_FOUND" | "UNAVAILABLE" | "NOT_QUERIED";
    voices?: string[];
    positions?: number[];
    solverVoices?: string[];
    facts?: unknown[];
    factForm?: string;
    structuralHypotheses?: unknown[];
    language?: string;
    profile?: string;
  } = {},
): SingleWordCurrentWordEvidenceContextV0_1 {
  const status = options.status ?? "SOURCE_NOT_FOUND";
  const voices = options.voices ?? ["A", "I"];
  const positions = options.positions ?? [1, 4];
  const sourceCharacters = Array.from(word.normalize("NFC"));
  const events = voices.map((voice, index) => {
    const sourcePosition = positions[index] ?? index;
    return {
      eventId: `fixture-event-${index}`,
      order: index,
      voice,
      basisPosition: index,
      sourceCharacter: sourceCharacters[sourcePosition] ?? voice,
      sourcePosition,
      sourcePositionUnit: "unicode_code_point_in_nfc_input",
      sourceSpan: { start: sourcePosition, end: sourcePosition + 1 },
      provenance: "caller_supplied_orthography",
      mappingSource: "math7.core.extractSevenVowelsFromString",
      representationAuthority: "orthographic",
      pronunciationAuthority: "not_established",
    };
  });
  const fixtureFacts = options.facts ?? (status === "MATCHES_FOUND"
    ? [{
        sourceRecordId: "fixture:source-record-1",
        entryLocator: "fixture-entry-1",
        physicalRecordOrdinal: 0,
        language: "Albanian",
        languageCode: "sq",
        form: options.factForm ?? word,
        partOfSpeech: "noun",
        senses: [
          { senseId: "fixture-sense-1", glosses: ["fixture gloss one"] },
          { senseId: "fixture-sense-2", glosses: ["fixture gloss two"] },
        ],
        ipaObservations: [{ soundIndex: 0, ipa: null, tags: [] }],
        sourceStatus: "observed_external_snapshot",
        attestationTruth: "fact",
        pronunciationAuthority: "fixture_source_record_not_frozen_authority",
        sourceSnapshot: {
          sourceFamilyId: "fixture-source-family",
          sourceUrl: "https://example.invalid/fixture.jsonl",
          sha256: "a".repeat(64),
          bytes: 1,
        },
      }]
    : []);
  const discovery = {
    schemaVersion: "open-instrument.motivation-engine-discovery.v0_1",
    status: "NO_MATCHES",
    inputWord: word,
    inputLanguage: options.language ?? "sq",
    inputProfile: options.profile ?? "albanian",
    sourceFact: {
      layer: "SOURCE_FACT",
      language: options.language === "English" ? "English" : "Albanian",
      profile: options.profile ?? "albanian",
      representation: options.language === "English" ? "unknown" : "albanian_profile",
      sourceStatus: "fixture analysis status",
      authorityBoundary: "fixture only",
    },
    exactLexicalSourceStatus: {
      status,
      queryForm: status === "NOT_QUERIED" ? null : word,
      reasonCode: status === "SOURCE_NOT_FOUND"
        ? "ALBANIAN_EXACT_FORM_NOT_FOUND"
        : status === "UNAVAILABLE"
          ? "ALBANIAN_SOURCE_PATH_NOT_CONFIGURED"
          : null,
    },
    exactLexicalSourceFacts: fixtureFacts,
    sourceIpaSevenVoiceAnalyses: [],
    derivedStructure: {
      layer: "DERIVED_STRUCTURE",
      voicePath: options.solverVoices ?? ["I", "A"],
      voicePathSource: "albanian_profile",
      voicePathProvenance: {
        writtenInput: {
          inputForm: word,
          analysisStatus: "SUPPORTED",
          inputVoiceSequenceStatus: "complete",
          inputVoiceEventCount: voices.length,
          voicePath: voices,
          events,
          representationAuthority: "orthographic",
          pronunciationAuthority: "not_established",
        },
        selectedPath: {
          voicePath: options.solverVoices ?? ["I", "A"],
          selectionKind: "profile_solver_selected",
          legacySource: "albanian_profile",
          relationshipToWritten: "differs_from_written_sequence",
        },
      },
      math7: { basis: null, totalMod7: null, principlesPath: [] },
      gamma: { status: "NULL", orderedUnits: [], reason: "fixture Null" },
      zeroConsonantalStructuralComposition: { status: "NULL", variants: [], reason: "fixture Null" },
      structuralHypotheses: options.structuralHypotheses ?? [],
    },
    candidates: [],
    interpretation: {
      layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS",
      status: "UNKNOWN_OR_NULL",
      note: "fixture Null",
    },
    unknownOrNull: { layer: "UNKNOWN_OR_NULL", reason: "fixture Null" },
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
  } as unknown as MotivationDiscoveryV0_1VM;

  return {
    analyzedWord: word,
    discovery: { kind: "present", value: discovery },
  };
}

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe("Single-word motivation workbench v0.1", () => {
  it("shows source facts as read-only context without selecting a sense or filling the proposal", () => {
    const context = makeCurrentWordEvidence("KANDIL", { status: "MATCHES_FOUND" });
    render(
      <SingleWordMotivationWorkbenchV0_1
        initialTargetWord="KANDIL"
        currentWordEvidence={context}
      />,
    );

    const evidence = screen.getByTestId("single-word-current-evidence");
    expect(evidence).toHaveTextContent("KANDIL");
    expect(evidence).toHaveTextContent("MATCHES_FOUND");
    expect(evidence).toHaveTextContent("fixture:source-record-1");
    expect(evidence).toHaveTextContent("fixture-sense-1: fixture gloss one");
    expect(evidence).toHaveTextContent("fixture-sense-2: fixture gloss two");
    expect(evidence).toHaveTextContent("fixture-source-family");
    expect(evidence).toHaveTextContent("https://example.invalid/fixture.jsonl");
    expect(evidence).toHaveTextContent("none is selected for a component proposal");
    expect(evidence).toHaveTextContent("Written Seven-Voices path");
    expect(evidence).toHaveTextContent("A → I");
    expect(evidence).toHaveTextContent("Solver-selected path");
    expect(evidence).toHaveTextContent("pronunciation: not_established");
    expect(screen.getByLabelText("Target language")).toHaveValue("");
    expect(screen.getByLabelText("Component 1 proposed meaning")).toHaveValue("");
    expect(screen.getByTestId("single-word-proposal-incomplete")).toBeInTheDocument();
    expect(screen.queryByTestId("single-word-component-source-evidence")).not.toBeInTheDocument();
  });

  it("withholds a valid Albanian source record when its form differs from the analyzed word", () => {
    render(
      <SingleWordMotivationWorkbenchV0_1
        initialTargetWord="KANDIL"
        currentWordEvidence={makeCurrentWordEvidence("KANDIL", {
          status: "MATCHES_FOUND",
          factForm: "KA",
        })}
      />,
    );

    const source = screen.getByTestId("single-word-current-source-evidence");
    expect(source).toHaveTextContent("MATCHES_FOUND");
    expect(source).toHaveTextContent(
      "MATCHES_FOUND was emitted without a displayable exact-form source fact in this payload.",
    );
    expect(source).not.toHaveTextContent("fixture:source-record-1");
    expect(source).not.toHaveTextContent("fixture-sense-1");
    expect(source).not.toHaveTextContent("fixture gloss");
    expect(screen.getByTestId("single-word-current-structural-evidence")).toHaveTextContent(
      "UNKNOWN_OR_NULL",
    );
    expect(screen.getByTestId("single-word-current-voice-evidence")).toHaveTextContent(
      "Written Seven-Voices path",
    );
  });

  it("keeps exact-form NOT_FOUND, structural Null, and the KANDIL written path distinct", () => {
    render(
      <SingleWordMotivationWorkbenchV0_1
        initialTargetWord="KANDIL"
        currentWordEvidence={makeCurrentWordEvidence("KANDIL")}
      />,
    );

    const evidence = screen.getByTestId("single-word-current-evidence");
    expect(evidence).toHaveTextContent("SOURCE_NOT_FOUND");
    expect(evidence).toHaveTextContent("ALBANIAN_EXACT_FORM_NOT_FOUND");
    expect(evidence).toHaveTextContent("does not establish lexical absence");
    expect(evidence).toHaveTextContent("A at source position 1 (A)");
    expect(evidence).toHaveTextContent("I at source position 4 (I)");
    expect(evidence).toHaveTextContent("No structural hypotheses emitted");
    expect(evidence).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(evidence).not.toHaveTextContent("fixture gloss");
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("");
  });

  it.each([
    ["UNAVAILABLE", "no lexical conclusion follows"],
    ["NOT_QUERIED", "no lexical conclusion follows"],
  ] as const)("does not turn %s into a lexical conclusion", (status, explanation) => {
    render(
      <SingleWordMotivationWorkbenchV0_1
        initialTargetWord="KANDIL"
        currentWordEvidence={makeCurrentWordEvidence("KANDIL", { status })}
      />,
    );

    const evidence = screen.getByTestId("single-word-current-source-evidence");
    expect(evidence).toHaveTextContent(status);
    expect(evidence).toHaveTextContent(explanation);
    expect(evidence).not.toHaveTextContent("fixture gloss");
  });

  it("conserves all written Voices, repeated events, and positions when candidates are empty", () => {
    const word = "AEIOUYËA";
    const voices = ["A", "E", "I", "O", "U", "Y", "Ë", "A"];
    render(
      <SingleWordMotivationWorkbenchV0_1
        initialTargetWord={word}
        currentWordEvidence={makeCurrentWordEvidence(word, {
          status: "NOT_QUERIED",
          voices,
          positions: [0, 1, 2, 3, 4, 5, 6, 7],
          solverVoices: ["Ë", "Y", "U", "O", "I", "E", "A"],
        })}
      />,
    );

    const written = screen.getByTestId("single-word-current-voice-evidence");
    expect(written).toHaveTextContent("A → E → I → O → U → Y → Ë → A");
    expect(written).toHaveTextContent("A at source position 7 (A)");
    expect(written).toHaveTextContent("Solver-selected path");
    expect(written).toHaveTextContent("Ë → Y → U → O → I → E → A");
    expect(screen.getByTestId("single-word-current-structural-evidence")).toHaveTextContent(
      "No structural hypotheses emitted",
    );
    expect(screen.getByTestId("single-word-current-structural-evidence")).toHaveTextContent(
      "UNKNOWN_OR_NULL",
    );
  });

  it("withholds Albanian source facts from a non-Albanian analysis context", () => {
    render(
      <SingleWordMotivationWorkbenchV0_1
        initialTargetWord="KANDIL"
        currentWordEvidence={makeCurrentWordEvidence("KANDIL", {
          status: "MATCHES_FOUND",
          language: "English",
          profile: "English",
        })}
      />,
    );

    const source = screen.getByTestId("single-word-current-source-evidence");
    expect(source).toHaveTextContent("NOT_APPLICABLE_FOR_LANGUAGE");
    expect(source).toHaveTextContent("no Albanian lexical conclusion is displayed");
    expect(source).not.toHaveTextContent("MATCHES_FOUND");
    expect(source).not.toHaveTextContent("fixture:source-record-1");
    expect(source).not.toHaveTextContent("fixture gloss one");
  });

  it("shows emitted structural candidates only as candidates with their existing reasons", () => {
    render(
      <SingleWordMotivationWorkbenchV0_1
        initialTargetWord="KANDIL"
        currentWordEvidence={makeCurrentWordEvidence("KANDIL", {
          structuralHypotheses: [{
            hypothesisId: "fixture-hypothesis-1",
            embryo: "AN",
            expansionChain: ["AN", "AND", "KANDIL"],
            reasonCodes: ["CONSONANTAL_REDUCTION_SUPPORTED"],
          }],
        })}
      />,
    );

    const structure = screen.getByTestId("single-word-current-structural-evidence");
    expect(structure).toHaveTextContent("fixture-hypothesis-1 · embryo AN");
    expect(structure).toHaveTextContent("AN → AND → KANDIL");
    expect(structure).toHaveTextContent("CONSONANTAL_REDUCTION_SUPPORTED");
    expect(structure).toHaveTextContent("does not assign component meaning");
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("");
    expect(screen.getByLabelText("Component 1 proposed meaning")).toHaveValue("");
  });

  it("withholds a discovery payload whose word differs from the current analysis", () => {
    const wrongDiscovery = makeCurrentWordEvidence("KANDIL", { status: "MATCHES_FOUND" }).discovery;
    render(
      <SingleWordMotivationWorkbenchV0_1
        initialTargetWord="DRITARE"
        currentWordEvidence={{ analyzedWord: "DRITARE", discovery: wrongDiscovery }}
      />,
    );

    const evidence = screen.getByTestId("single-word-current-evidence");
    expect(screen.getByTestId("single-word-discovery-word-mismatch")).toBeInTheDocument();
    expect(evidence).not.toHaveTextContent("fixture:source-record-1");
    expect(evidence).not.toHaveTextContent("fixture gloss one");
  });

  it("keeps the KANDIL source-sense proposal separate from explicit mechanical replay", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    const values = [
      ["Component 1 exact spelling", "KAN"],
      ["Component 1 proposed meaning", "have"],
      ["Component 1 grammatical role", "verb"],
      ["Component 1 language", "Albanian"],
      ["Component 1 dialect", "Gheg"],
      ["Component 2 exact spelling", "DILL"],
      ["Component 2 proposed meaning", "sun"],
      ["Component 2 grammatical role", "noun"],
      ["Component 2 language", "Albanian"],
      ["Component 2 dialect", "Gheg"],
      ["Proposed functional explanation", "Have sun / have light"],
    ] as const;
    for (const [label, value] of values) fireEvent.change(screen.getByLabelText(label), { target: { value } });

    fireEvent.click(screen.getByTestId("single-word-add-mechanical-operation"));
    fireEvent.change(screen.getByLabelText("Mechanical operation 1 position"), { target: { value: "5" } });
    fireEvent.change(screen.getByLabelText("Mechanical operation 1 expected text"), { target: { value: "LL" } });
    fireEvent.change(screen.getByLabelText("Mechanical operation 1 replacement text"), { target: { value: "L" } });
    fireEvent.click(screen.getByTestId("single-word-examine-interpretation"));

    const mechanical = screen.getByTestId("single-word-mechanical-result");
    expect(mechanical).toHaveAttribute("data-status", "EXAMINED");
    expect(mechanical).toHaveTextContent("Raw component concatenation: KANDILL");
    expect(mechanical).toHaveTextContent("Final mechanical spelling: KANDIL");
    expect(mechanical).toHaveTextContent("Exact comparison: MATCH");
    expect(mechanical).toHaveTextContent("USER_DECLARED_UNVERIFIED");
    expect(mechanical).toHaveTextContent("linguistic validity NOT_ASSESSED");
    expect(mechanical).toHaveTextContent("DIGRAPH_REMOVED");

    const proposal = screen.getByTestId("single-word-proposal-result");
    expect(proposal).toHaveTextContent("PROPOSED");
    expect(proposal).toHaveTextContent("Have sun / have light");
    expect(proposal).toHaveTextContent("Strict embryo meaning: Unknown / Null");
    expect(proposal).toHaveTextContent("A → I");
    expect(proposal).toHaveTextContent("historical origin: not claimed");
  });

  it("replays the DRITARE H omission and keeps the HARE spelling unchanged", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="DRITARE" />);
    fireEvent.change(screen.getByLabelText("Component 1 exact spelling"), { target: { value: "DRIT" } });
    fireEvent.change(screen.getByLabelText("Component 2 exact spelling"), { target: { value: "HARE" } });
    fireEvent.click(screen.getByTestId("single-word-add-mechanical-operation"));
    fireEvent.change(screen.getByLabelText("Mechanical operation 1 type"), { target: { value: "OMIT" } });
    fireEvent.change(screen.getByLabelText("Mechanical operation 1 position"), { target: { value: "4" } });
    fireEvent.change(screen.getByLabelText("Mechanical operation 1 expected text"), { target: { value: "H" } });
    fireEvent.click(screen.getByTestId("single-word-examine-interpretation"));

    const mechanical = screen.getByTestId("single-word-mechanical-result");
    expect(mechanical).toHaveTextContent("Raw component concatenation: DRITHARE");
    expect(mechanical).toHaveTextContent("Final mechanical spelling: DRITARE");
    expect(mechanical).toHaveTextContent("DIGRAPH_CROSSES_COMPONENT_BOUNDARY");
    expect(mechanical).toHaveTextContent("DIGRAPH_REMOVED: Operation 1 changes or removes Albanian digraph TH");
    expect(screen.getByLabelText("Component 2 exact spelling")).toHaveValue("HARE");
  });

  it("marks replay stale after proposal changes and clears all local proposal and source state", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    fireEvent.change(screen.getByLabelText("Component 1 exact spelling"), { target: { value: "KAN" } });
    fireEvent.change(screen.getByLabelText("Component 2 exact spelling"), { target: { value: "DIL" } });
    fireEvent.click(screen.getByTestId("single-word-examine-interpretation"));
    expect(screen.getByTestId("single-word-mechanical-result")).toHaveAttribute("data-status", "EXAMINED");

    fireEvent.change(screen.getByLabelText("Component 2 exact spelling"), { target: { value: "DILL" } });
    expect(screen.getByTestId("single-word-mechanical-result-stale")).toHaveTextContent("STALE");
    expect(screen.getByTestId("single-word-mechanical-result")).toHaveAttribute("data-status", "NOT_SUBMITTED");
    expect(screen.queryByText(/Final mechanical spelling:/)).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Proposed functional explanation"), { target: { value: "local-only proposal" } });
    fireEvent.click(screen.getByTestId("single-word-clear-interpretation"));
    expect(screen.getByLabelText("Exact target word")).toHaveValue("KANDIL");
    expect(screen.getByLabelText("Component 1 exact spelling")).toHaveValue("");
    expect(screen.getByTestId("single-word-mechanical-result")).toHaveAttribute("data-status", "NOT_SUBMITTED");
    expect(screen.queryByTestId("single-word-mechanical-result-stale")).not.toBeInTheDocument();
    expect(screen.queryByText("local-only proposal")).not.toBeInTheDocument();
    expect(screen.getByTestId("single-word-proposal-incomplete")).toBeInTheDocument();
  });

  it("lets a user inspect the KANDIL proposal and keeps mismatch, unverified evidence, and embryo Null visible", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    fireEvent.click(screen.getByTestId("single-word-add-component"));

    const values = [
      ["Component 1 exact spelling", "KA"],
      ["Component 1 proposed meaning", "has"],
      ["Component 1 grammatical role", "third-person singular verb"],
      ["Component 1 language", "Albanian"],
      ["Component 1 evidence status", "CITATION_ENTERED_UNVERIFIED"],
      ["Component 1 evidence reference", "FJALË: kam, 3sg ka"],
      ["Component 2 exact spelling", "N"],
      ["Component 2 language", "Albanian"],
      ["Component 3 exact spelling", "DILL"],
      ["Component 3 proposed meaning", "sun"],
      ["Component 3 grammatical role", "noun"],
      ["Component 3 language", "Albanian"],
      ["Component 3 dialect", "Gheg"],
      ["Component 3 evidence status", "CITATION_ENTERED_UNVERIFIED"],
      ["Component 3 evidence reference", "IE-CoR Cognate Set 491"],
      ["Unexplained connecting material", "N role and LL/L correspondence remain unexplained."],
      ["Proposed functional explanation", "Has sun / carries light"],
      ["Transparency description", "METAPHORICAL"],
    ] as const;
    for (const [label, value] of values) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    fireEvent.click(screen.getByLabelText("Component 2 not yet explained"));
    fireEvent.click(screen.getByTestId("single-word-add-transformation"));
    fireEvent.change(screen.getByLabelText("Transformation 1 from"), { target: { value: "LL" } });
    fireEvent.change(screen.getByLabelText("Transformation 1 to"), { target: { value: "L" } });

    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("KANDILL");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("MISMATCH");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("Has sun / carries light");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("metaphorical");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("Strict embryo meaning: Unknown / Null");
    expect(screen.getByText("A → I")).toBeInTheDocument();
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("not independently verified");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("user-declared and unverified; not applied");
  });

  it("supports a fresh arbitrary word and keeps an incomplete proposal from producing a result", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="RRUGË" />);
    expect(screen.getByTestId("single-word-proposal-incomplete")).toBeInTheDocument();
    expect(screen.queryByTestId("single-word-proposal-result")).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Exact target word"), { target: { value: "RRUGË" } });
    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    fireEvent.change(screen.getByLabelText("Component 1 exact spelling"), { target: { value: "RR" } });
    fireEvent.change(screen.getByLabelText("Component 1 proposed meaning"), { target: { value: "user proposal" } });
    fireEvent.change(screen.getByLabelText("Component 1 grammatical role"), { target: { value: "unknown root" } });
    fireEvent.change(screen.getByLabelText("Component 1 language"), { target: { value: "Albanian" } });
    fireEvent.change(screen.getByLabelText("Component 2 exact spelling"), { target: { value: "UGË" } });
    fireEvent.change(screen.getByLabelText("Component 2 proposed meaning"), { target: { value: "user proposal" } });
    fireEvent.change(screen.getByLabelText("Component 2 grammatical role"), { target: { value: "unknown root" } });
    fireEvent.change(screen.getByLabelText("Component 2 language"), { target: { value: "Albanian" } });
    fireEvent.change(screen.getByLabelText("Proposed functional explanation"), { target: { value: "A separately labeled proposal." } });
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("RRUGË");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("U → Ë");
  });

  it("shows field-specific citation and explanation errors with their supported limits", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    expect(screen.getByTestId("single-word-motivation-field-limits")).toHaveTextContent("evidence references and connecting material 500");
    expect(screen.getByTestId("single-word-functional-explanation-count")).toHaveTextContent("0/1,000 characters");

    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    fireEvent.change(screen.getByLabelText("Component 1 evidence status"), { target: { value: "CITATION_ENTERED_UNVERIFIED" } });
    const evidenceReference = screen.getByLabelText("Component 1 evidence reference");
    expect(evidenceReference).toHaveAttribute("maxLength", "500");
    expect(screen.getByTestId("single-word-validation-messages")).toHaveTextContent(
      "Component 1 evidence reference: add a citation locator (up to 500 characters) or change the evidence status.",
    );

    fireEvent.change(evidenceReference, { target: { value: "x".repeat(501) } });
    expect(screen.getByTestId("single-word-validation-messages")).toHaveTextContent(
      "Component 1 evidence reference: use 500 characters or fewer.",
    );

    const explanation = screen.getByLabelText("Proposed functional explanation");
    expect(explanation).toHaveAttribute("maxLength", "1000");
    fireEvent.change(explanation, { target: { value: "x".repeat(1001) } });
    expect(screen.getByTestId("single-word-functional-explanation-count")).toHaveTextContent("1001/1,000 characters");
    expect(screen.getByTestId("single-word-validation-messages")).toHaveTextContent(
      "Proposed functional explanation: enter 1–1,000 characters.",
    );
    expect(screen.queryByTestId("single-word-proposal-result")).not.toBeInTheDocument();
  });

  it("lets users remove incomplete transformations and enforces the eight-item limit", () => {
    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    const addButton = screen.getByTestId("single-word-add-transformation");

    fireEvent.click(addButton);
    expect(screen.getByLabelText("Transformation 1 from")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Remove transformation 1"));
    expect(screen.queryByLabelText("Transformation 1 from")).not.toBeInTheDocument();

    for (let index = 0; index < 8; index += 1) {
      fireEvent.click(addButton);
    }
    expect(addButton).toBeDisabled();
    expect(screen.getByLabelText("Transformation 8 from")).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText("Remove transformation 1"));
    expect(addButton).toBeEnabled();
  });

  it("checks only the selected exact component and keeps source evidence separate from the proposal", async () => {
    const aiAttribution = "Albanian descriptions written with AI help — CC BY-SA 4.0";
    const fetchMock = jest.fn((input: RequestInfo | URL) => {
      if (String(input).endsWith("/dill.json")) {
        return Promise.resolve({ ok: false, json: async () => ({}) });
      }
      if (String(input).endsWith("/n.json")) {
        return Promise.resolve({ ok: false, json: async () => ({}) });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          word: "ka",
          licence: "CC BY-SA 4.0",
          attribution: [aiAttribution],
          sources: ["en-wiktionary", "ai"],
          description: { text: "Source-described Albanian entry for ka", source: "ai" },
          entries: [{ pos: "verb", sources: ["en-wiktionary"], senses: [] }],
        }),
      });
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    fireEvent.click(screen.getByTestId("single-word-add-component"));

    const values = [
      ["Component 1 exact spelling", "KA"],
      ["Component 1 proposed meaning", "has"],
      ["Component 1 grammatical role", "third-person singular verb"],
      ["Component 1 language", "Albanian"],
      ["Component 2 exact spelling", "N"],
      ["Component 2 language", "Albanian"],
      ["Component 3 exact spelling", "DILL"],
      ["Component 3 proposed meaning", "sun"],
      ["Component 3 grammatical role", "noun"],
      ["Component 3 language", "Albanian"],
      ["Component 3 dialect", "Gheg"],
      ["Proposed functional explanation", "Has sun / carries light"],
    ] as const;
    for (const [label, value] of values) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    fireEvent.click(screen.getByLabelText("Component 2 not yet explained"));
    fireEvent.change(screen.getByLabelText("Transparency description"), { target: { value: "METAPHORICAL" } });

    const proposal = screen.getByTestId("single-word-proposal-result");
    const proposalBeforeSourceChecks = proposal.textContent;
    expect(proposal).toHaveTextContent("KA + N + DILL");
    expect(proposal).toHaveTextContent("KANDILL");
    expect(proposal).toHaveTextContent("MISMATCH");
    expect(proposal).toHaveTextContent("Has sun / carries light");
    expect(proposal).toHaveTextContent("PROPOSED");
    expect(proposal).toHaveTextContent("A → I");
    expect(proposal).toHaveTextContent("Strict embryo meaning: Unknown / Null");
    expect(proposal).toHaveTextContent("N — meaning Unknown / Null");
    expect(screen.getAllByTestId("single-word-component-source-check")).toHaveLength(3);
    expect(fetchMock).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Check source for component 2" }));
    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("SOURCE_UNAVAILABLE · UNKNOWN_OR_NULL");
    expect(screen.getByTestId("single-word-component-source-evidence")).toHaveTextContent("User-proposed meaning (as entered): UNKNOWN_OR_NULL");
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Check source for component 1" }));
    expect(await screen.findByText("Source-described Albanian entry for ka")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(String(fetchMock.mock.calls[1][0])).toBe("https://fjalorishqip.org/api/v1/fjala/ka.json");
    expect(screen.getByTestId("single-word-component-source-spelling")).toHaveTextContent("KA");
    expect(screen.getByTestId("single-word-component-source-evidence")).toHaveTextContent("User-proposed meaning (as entered): has");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("FORM_MATCH_ONLY");
    expect(screen.getByText(/not independent scientific corroboration/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Original FjaloriShqip record" })).toHaveAttribute(
      "href",
      "https://fjalorishqip.org/fjala/ka/",
    );
    expect(screen.getByLabelText("Component 1 evidence status")).toHaveValue("USER_PROPOSED");

    fireEvent.click(screen.getByRole("button", { name: "Check source for component 3" }));
    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(fetchMock.mock.calls.map(([url]) => String(url))).toEqual([
      "https://fjalorishqip.org/api/v1/fjala/n.json",
      "https://fjalorishqip.org/api/v1/fjala/ka.json",
      "https://fjalorishqip.org/api/v1/fjala/dill.json",
    ]);
    expect(screen.getAllByTestId("single-word-component-source-evidence")).toHaveLength(1);
    expect(screen.getByTestId("single-word-component-source-spelling")).toHaveTextContent("DILL");
    expect(screen.getByTestId("single-word-component-source-evidence")).toHaveTextContent("User-proposed meaning (as entered): sun");
    expect(screen.getByTestId("single-word-component-source-evidence")).toHaveTextContent("Albanian · Gheg");
    expect(screen.getByTestId("single-word-component-source-evidence")).toHaveTextContent("does not establish that the word is absent");
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Component 3 evidence status")).toHaveValue("USER_PROPOSED");
    expect(screen.getByLabelText("Component 3 proposed meaning")).toHaveValue("sun");
    expect(screen.getByTestId("single-word-proposal-result").textContent).toBe(proposalBeforeSourceChecks);
  });

  it("lets the user inspect a KA source sense without automatic ranking or proposal promotion", async () => {
    const aiAttribution = "Albanian descriptions written with AI help — CC BY-SA 4.0";
    const payload = {
      word: "ka",
      licence: "CC BY-SA 4.0",
      attribution: [aiAttribution],
      sources: ["en-wiktionary", "ai"],
      description: { text: "Source description fixture", source: "ai" },
      entries: [
        {
          pos: "verb",
          sources: ["en-wiktionary"],
          senses: [{ gloss: "has (form of kam); there is", lang: "en", source: "en-wiktionary" }],
        },
        {
          pos: "prep",
          sources: ["sq-wiktionary"],
          senses: [{ gloss: "preposition sense fixture", lang: "en", source: "sq-wiktionary" }],
        },
        {
          pos: "noun",
          sources: ["en-wiktionary"],
          senses: [{ gloss: "ox / steer", lang: "en", source: "en-wiktionary" }],
        },
      ],
    };
    const fetchMock = jest.fn().mockResolvedValue({ ok: true, json: async () => payload });
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    fireEvent.change(screen.getByLabelText("Target language"), { target: { value: "Albanian" } });
    fireEvent.click(screen.getByTestId("single-word-add-component"));
    const values = [
      ["Component 1 exact spelling", "KA"],
      ["Component 1 proposed meaning", "has"],
      ["Component 1 grammatical role", "third-person singular verb"],
      ["Component 1 language", "Albanian"],
      ["Component 2 exact spelling", "N"],
      ["Component 2 language", "Albanian"],
      ["Component 3 exact spelling", "DILL"],
      ["Component 3 proposed meaning", "sun"],
      ["Component 3 grammatical role", "noun"],
      ["Component 3 language", "Albanian"],
      ["Component 3 dialect", "Gheg"],
      ["Proposed functional explanation", "Has sun / carries light"],
    ] as const;
    for (const [label, value] of values) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } });
    }
    fireEvent.click(screen.getByLabelText("Component 2 not yet explained"));
    fireEvent.change(screen.getByLabelText("Transparency description"), { target: { value: "METAPHORICAL" } });

    expect(fetchMock).not.toHaveBeenCalled();
    const proposal = screen.getByTestId("single-word-proposal-result");
    expect(proposal).toHaveTextContent("KANDILL");
    expect(proposal).toHaveTextContent("MISMATCH");
    expect(proposal).toHaveTextContent("Has sun / carries light");
    expect(proposal).toHaveTextContent("PROPOSED");
    expect(proposal).toHaveTextContent("A → I");
    expect(proposal).toHaveTextContent("Strict embryo meaning: Unknown / Null");

    fireEvent.click(screen.getByRole("button", { name: "Check source for component 1" }));
    const glosses = await screen.findAllByTestId("fjalori-source-sense-gloss");
    expect(glosses.map((node) => node.textContent)).toEqual([
      "has (form of kam); there is",
      "preposition sense fixture",
      "ox / steer",
    ]);
    expect(screen.queryByTestId("fjalori-selected-sense")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(String(fetchMock.mock.calls[0][0])).toBe("https://fjalorishqip.org/api/v1/fjala/ka.json");

    const beforeAssessment = proposal.textContent;
    fireEvent.click(screen.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection" }));
    fireEvent.change(screen.getByLabelText("USER_INTERPRETATION assessment for entry 1 sense 1"), {
      target: { value: "POTENTIALLY_SUPPORTS_PROPOSAL" },
    });
    expect(screen.getByTestId("fjalori-selected-sense")).toHaveTextContent("USER_INTERPRETATION");
    expect(screen.getByTestId("fjalori-selected-sense")).toHaveTextContent("POTENTIALLY_SUPPORTS_PROPOSAL");
    const comparison = screen.getByTestId("fjalori-component-meaning-comparison");
    expect(comparison).toHaveTextContent("USER_PROPOSED");
    expect(comparison).toHaveTextContent("Component spelling: KA");
    expect(comparison).toHaveTextContent("Proposed meaning: has");
    expect(comparison).toHaveTextContent("Proposed grammatical role: third-person singular verb");
    expect(comparison).toHaveTextContent("SOURCE_REPORTED");
    expect(comparison).toHaveTextContent("Part of speech: verb");
    expect(comparison).toHaveTextContent("Gloss: has (form of kam); there is");
    expect(comparison).toHaveTextContent("Gloss language: en");
    expect(comparison).toHaveTextContent("Source attribution: en-wiktionary");
    expect(comparison).toHaveTextContent("Response-position locator: Entry 1 · Sense 1");
    expect(screen.getAllByTestId("fjalori-source-sense-gloss")).toHaveLength(3);
    expect(proposal.textContent).toBe(beforeAssessment);
    expect(screen.getByLabelText("Component 1 evidence status")).toHaveValue("USER_PROPOSED");

    fireEvent.change(screen.getByLabelText("Component 1 proposed meaning"), { target: { value: "possesses" } });
    expect(screen.queryByTestId("fjalori-selected-sense")).not.toBeInTheDocument();
    expect(screen.queryByText(/Current assessment:/)).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(screen.getByLabelText("Component 1 proposed meaning")).toHaveValue("possesses");
    expect(screen.getByLabelText("Component 1 evidence status")).toHaveValue("USER_PROPOSED");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("Has sun / carries light");
    expect(screen.getByTestId("single-word-proposal-result")).toHaveTextContent("Strict embryo meaning: Unknown / Null");
  });

  it("clears source-sense inspection when the component spelling changes or is removed", async () => {
    const aiAttribution = "Albanian descriptions written with AI help — CC BY-SA 4.0";
    const fetchMock = jest.fn((input: RequestInfo | URL) => Promise.resolve({
      ok: true,
      json: async () => ({
        word: String(input).split("/").at(-1)?.replace(/\.json$/u, "") ?? "",
        licence: "CC BY-SA 4.0",
        attribution: [aiAttribution],
        sources: ["en-wiktionary", "ai"],
        description: { text: "source description fixture", source: "ai" },
        entries: [{ pos: "noun", sources: ["en-wiktionary"], senses: [{ gloss: "sense fixture", lang: "en", source: "en-wiktionary" }] }],
      }),
    }));
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<SingleWordMotivationWorkbenchV0_1 initialTargetWord="KANDIL" />);
    fireEvent.click(screen.getByTestId("single-word-add-component"));
    fireEvent.change(screen.getByLabelText("Component 1 exact spelling"), { target: { value: "KA" } });
    fireEvent.click(screen.getByRole("button", { name: "Check source for component 1" }));
    expect(await screen.findByTestId("fjalori-source-sense-gloss")).toHaveTextContent("sense fixture");
    fireEvent.click(screen.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection" }));
    expect(screen.getByTestId("fjalori-selected-sense")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Component 1 exact spelling"), { target: { value: "DILL" } });
    expect(screen.queryByTestId("single-word-component-source-evidence")).not.toBeInTheDocument();

    fireEvent.change(screen.getByLabelText("Component 3 exact spelling"), { target: { value: "N" } });
    fireEvent.click(screen.getByRole("button", { name: "Check source for component 3" }));
    expect(await screen.findByTestId("fjalori-source-sense-gloss")).toHaveTextContent("sense fixture");
    fireEvent.click(screen.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection" }));
    fireEvent.click(screen.getByRole("button", { name: "Remove component 3" }));
    expect(screen.queryByTestId("single-word-component-source-evidence")).not.toBeInTheDocument();
    expect(screen.getAllByTestId("single-word-component-source-check")).toHaveLength(2);
  });

});
