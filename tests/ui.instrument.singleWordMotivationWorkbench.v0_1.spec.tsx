import { fireEvent, render, screen } from "@testing-library/react";
import { SingleWordMotivationWorkbenchV0_1 } from "@/ui/instrument/sections/SingleWordMotivationWorkbenchV0_1";

const originalFetch = global.fetch;

afterEach(() => {
  global.fetch = originalFetch;
});

describe("Single-word motivation workbench v0.1", () => {
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
