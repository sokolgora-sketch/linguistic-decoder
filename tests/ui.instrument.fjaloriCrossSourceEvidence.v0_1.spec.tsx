import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FjaloriCrossSourceEvidenceV0_1 } from "@/ui/instrument/sections/FjaloriCrossSourceEvidence.v0_1";

const testedWords = ["dritare", "dritë", "bletar", "pelar", "qymyrtar", "gjitar", "thëngjilltar"] as const;
const originalFetch = global.fetch;
const aiAttribution = "Përshkrime shqip me ndihmë të AI-së / Albanian descriptions written with AI help — CC BY-SA 4.0";

function responseFor(
  word: string,
  options: Readonly<{
    description?: string | null;
    entrySources?: readonly (readonly string[])[];
    recordSources?: readonly string[];
  }> = {},
) {
  const entrySources = options.entrySources ?? [["en-wiktionary", "wikidata"]];
  return {
    ok: true,
    status: 200,
    json: async () => ({
      word,
      licence: "CC BY-SA 4.0",
      attribution: [aiAttribution],
      sources: options.recordSources ?? ["en-wiktionary", "wikidata", "ai"],
      description: options.description === null
        ? undefined
        : { text: options.description ?? `Përshkrim prove për ${word}`, source: "ai" },
      entries: entrySources.map((sources) => ({
        pos: "noun",
        sources: [...sources],
        senses: [{ gloss: "test-only English gloss", lang: "en", source: "en-wiktionary" }],
      })),
    }),
  };
}

afterEach(() => {
  cleanup();
  global.fetch = originalFetch;
  jest.useRealTimers();
});

describe("FjaloriShqip Albanian meaning evidence v0.1", () => {
  it.each(testedWords)("looks up the exact normalized word %s beyond the former allowlist", async (word) => {
    const fetchMock = jest.fn().mockResolvedValue(responseFor(word));
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word={word} />);

    expect(await screen.findByTestId("fjalori-source-description")).toHaveTextContent(`Përshkrim prove për ${word}`);
    expect(screen.getByTestId("fjalori-source-description-label")).toHaveTextContent("author-produced with AI assistance");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("FORM_MATCH_ONLY");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("exact cross-source sense alignment is UNKNOWN_OR_NULL");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("does not change functional operation, AGENT");
    expect(screen.getByText(/not independent scientific corroboration/)).toBeInTheDocument();
    expect(screen.getByText(/en-wiktionary\/Kaikki lineage/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Original FjaloriShqip record" })).toHaveAttribute(
      "href",
      `https://fjalorishqip.org/fjala/${encodeURIComponent(word)}/`,
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://fjalorishqip.org/api/v1/fjala/${encodeURIComponent(word)}.json`,
      expect.objectContaining({ cache: "force-cache", signal: expect.any(AbortSignal) }),
    );
  });

  it("normalizes uppercase Albanian spelling while retaining the exact source form", async () => {
    const fetchMock = jest.fn().mockResolvedValue(responseFor("dritë"));
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="DRITË" />);

    expect(await screen.findByText("Përshkrim prove për dritë")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://fjalorishqip.org/api/v1/fjala/drit%C3%AB.json",
      expect.objectContaining({ cache: "force-cache" }),
    );
  });

  it("preserves the KAN proposal spelling while requesting the established canonical form", async () => {
    const fetchMock = jest.fn().mockResolvedValue(responseFor("kan"));
    global.fetch = fetchMock as unknown as typeof fetch;
    const componentProposal = {
      componentId: "0",
      exactSpelling: "KAN",
      proposedMeaning: "user proposed meaning",
      proposedGrammaticalRole: "UNKNOWN_OR_NULL",
      language: "Albanian",
      dialect: "",
      unresolved: false,
    };

    render(
      <FjaloriCrossSourceEvidenceV0_1
        word="KAN"
        context="component"
        componentProposal={componentProposal}
      />,
    );

    expect(await screen.findByText("Përshkrim prove për kan")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://fjalorishqip.org/api/v1/fjala/kan.json",
      expect.objectContaining({ cache: "force-cache" }),
    );
    expect(screen.queryByTestId("fjalori-selected-sense")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection" }));
    expect(screen.getByTestId("fjalori-component-meaning-comparison")).toHaveTextContent("Component spelling: KAN");
    expect(screen.getByTestId("fjalori-component-meaning-comparison")).toHaveTextContent("Proposed meaning: user proposed meaning");
  });

  it("keeps dritare source description, existing instrument reading, and unverified structure/history distinct", async () => {
    global.fetch = jest.fn().mockResolvedValue(responseFor("dritare", {
      description: "Përshkrim i burimit për dritare",
      recordSources: ["en-wiktionary", "wikidata", "ai", "tatoeba"],
    })) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="dritare" />);

    expect(await screen.findByText("Përshkrim i burimit për dritare")).toBeInTheDocument();
    expect(screen.getByTestId("fjalori-dritare-separation")).toHaveTextContent("the exact FjaloriShqip Albanian description is shown above");
    expect(screen.getByTestId("fjalori-dritare-separation")).toHaveTextContent("displayed in this Albanian Word Reading panel");
    expect(screen.getByTestId("fjalori-dritare-separation")).toHaveTextContent("not independently verified");
    expect(screen.getByTestId("fjalori-dritare-separation")).toHaveTextContent("Embryo-level function is UNKNOWN_OR_NULL");
    expect(screen.getByTestId("fjalori-dritare-separation")).not.toHaveTextContent("lets light and air enter");
  });

  it("omits the word-reading-specific dritare note in component lookup context", async () => {
    global.fetch = jest.fn().mockResolvedValue(responseFor("dritare")) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="dritare" context="component" />);

    expect(await screen.findByTestId("fjalori-source-description")).toBeInTheDocument();
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("FORM_MATCH_ONLY");
    expect(screen.queryByTestId("fjalori-dritare-separation")).not.toBeInTheDocument();
  });

  it("preserves source POS entries, individual senses, source order, and local-only sense assessment", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        word: "ka",
        licence: "CC BY-SA 4.0",
        attribution: [aiAttribution],
        sources: ["en-wiktionary", "ai"],
        description: { text: "Author description fixture", source: "ai" },
        entries: [
          {
            pos: "verb",
            sources: ["en-wiktionary"],
            senses: [
              { gloss: "has (form of kam); there is", lang: "en", source: "en-wiktionary", tags: ["fixture-tag"] },
            ],
          },
          {
            pos: "prep",
            sources: ["sq-wiktionary"],
            senses: [
              { gloss: "preposition sense fixture", lang: "en", source: "sq-wiktionary" },
              { gloss: "second preposition sense fixture", lang: "sq", source: "sq-wiktionary" },
            ],
          },
          {
            pos: "noun",
            sources: ["en-wiktionary"],
            senses: [{ gloss: "ox / steer", lang: "en", source: "en-wiktionary" }],
          },
          {
            pos: "verb",
            sources: ["sq-wiktionary"],
            senses: [{ gloss: "duplicate entry fixture", lang: "sq", source: "sq-wiktionary" }],
          },
        ],
      }),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    const componentProposal = {
      componentId: "0",
      exactSpelling: "KA",
      proposedMeaning: "has",
      proposedGrammaticalRole: "third-person singular verb",
      language: "Albanian",
      dialect: "",
      unresolved: false,
    };
    const view = render(
      <FjaloriCrossSourceEvidenceV0_1
        word="ka"
        context="component"
        proposalMeaning="has"
        componentProposal={componentProposal}
      />,
    );

    expect(fetchMock).toHaveBeenCalledWith(
      "https://fjalorishqip.org/api/v1/fjala/ka.json",
      expect.objectContaining({ cache: "force-cache" }),
    );

    const entries = await screen.findAllByTestId("fjalori-source-entry");
    expect(entries).toHaveLength(4);
    expect(entries.map((entry) => entry.textContent?.match(/Source-reported part of speech: (.*?) · Entry/)?.[1])).toEqual([
      "verb", "prep", "noun", "verb",
    ]);
    expect(screen.getAllByTestId("fjalori-source-sense")).toHaveLength(5);
    expect(screen.getAllByTestId("fjalori-source-sense-gloss").map((node) => node.textContent)).toEqual([
      "has (form of kam); there is",
      "preposition sense fixture",
      "second preposition sense fixture",
      "ox / steer",
      "duplicate entry fixture",
    ]);
    expect(screen.getAllByText(/gloss language en/).length).toBeGreaterThan(0);
    expect(screen.getByText(/Sense source attribution: en-wiktionary · source tags: fixture-tag/)).toBeInTheDocument();
    expect(screen.getAllByTestId("fjalori-source-sense")[0]).toHaveTextContent("Response locator: Entry 1 · Sense 1 · gloss language en");
    expect(screen.getByText(/not source-issued IDs/)).toBeInTheDocument();
    expect(screen.getByTestId("fjalori-lineage-boundary")).toHaveTextContent("not independent corroboration");
    expect(screen.queryByTestId("fjalori-selected-sense")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection" }));
    expect(screen.getByTestId("fjalori-selected-sense")).toHaveTextContent("USER_INTERPRETATION");
    expect(screen.getAllByTestId("fjalori-source-sense")).toHaveLength(5);
    const comparison = screen.getByTestId("fjalori-component-meaning-comparison");
    expect(comparison).toHaveTextContent("USER_PROPOSED");
    expect(comparison).toHaveTextContent("Component spelling: KA");
    expect(comparison).toHaveTextContent("Proposed meaning: has");
    expect(comparison).toHaveTextContent("Proposed grammatical role: third-person singular verb");
    expect(comparison).toHaveTextContent("Language / dialect: Albanian · UNKNOWN_OR_NULL");
    expect(comparison).toHaveTextContent("SOURCE_REPORTED");
    expect(comparison).toHaveTextContent("Part of speech: verb");
    expect(comparison).toHaveTextContent("Gloss: has (form of kam); there is");
    expect(comparison).toHaveTextContent("Gloss language: en");
    expect(comparison).toHaveTextContent("Source attribution: en-wiktionary");
    expect(comparison).toHaveTextContent("Entry source identity: en-wiktionary");
    expect(comparison).toHaveTextContent("Response-position locator: Entry 1 · Sense 1");
    expect(comparison).toHaveTextContent("cross-source sense alignment");
    expect(screen.getByRole("option", { name: "POTENTIALLY_SUPPORTS_PROPOSAL" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "DOES_NOT_SUPPORT_PROPOSAL" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "UNDECIDED" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("USER_INTERPRETATION assessment for entry 1 sense 1"), {
      target: { value: "POTENTIALLY_SUPPORTS_PROPOSAL" },
    });
    expect(screen.getByTestId("fjalori-selected-sense")).toHaveTextContent("Current assessment: POTENTIALLY_SUPPORTS_PROPOSAL");
    expect(screen.getByTestId("fjalori-component-senses")).toHaveTextContent("No source sense is selected or aligned automatically with the proposed meaning");

    let currentProposal = componentProposal;
    const proposalChanges = [
      { componentId: "1" },
      { proposedMeaning: "possesses" },
      { proposedGrammaticalRole: "finite verb" },
      { language: "Albanian Gheg" },
      { dialect: "Gheg" },
    ] as const;
    for (const change of proposalChanges) {
      currentProposal = { ...currentProposal, ...change };
      view.rerender(
        <FjaloriCrossSourceEvidenceV0_1
          word="ka"
          context="component"
          proposalMeaning={currentProposal.proposedMeaning}
          componentProposal={currentProposal}
        />,
      );
      expect(screen.queryByTestId("fjalori-selected-sense")).not.toBeInTheDocument();
      expect(screen.queryByText(/Current assessment:/)).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection" }));
      expect(screen.getByLabelText("USER_INTERPRETATION assessment for entry 1 sense 1")).toHaveValue("");
      fireEvent.change(screen.getByLabelText("USER_INTERPRETATION assessment for entry 1 sense 1"), {
        target: { value: "DOES_NOT_SUPPORT_PROPOSAL" },
      });
    }
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("reports an HTML 404 as endpoint evidence without parsing it as JSON", async () => {
    const json = jest.fn();
    const fetchMock = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      headers: { get: () => "text/html; charset=utf-8" },
      text: async () => "<html>Not Found</html>",
      json,
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="KAN" context="component" />);

    const result = await screen.findByTestId("fjalori-evidence-null");
    expect(result).toHaveTextContent("SOURCE_HTTP_NOT_FOUND · HTTP 404 · UNKNOWN_OR_NULL");
    expect(result).toHaveTextContent("exact FjaloriShqip endpoint request returned HTTP 404");
    expect(result).toHaveTextContent("does not establish that the word is absent");
    expect(result).not.toHaveTextContent("SOURCE_REPORTED");
    expect(json).not.toHaveBeenCalled();
    expect(screen.queryByTestId("fjalori-source-description")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Select source sense/ })).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://fjalorishqip.org/api/v1/fjala/kan.json",
      expect.objectContaining({ cache: "force-cache" }),
    );
  });

  it.each([403, 429, 500, 503])("reports HTTP %i distinctly from source unavailability", async (status) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status,
      json: async () => ({ message: "HTTP error fixture" }),
    }) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="ka" context="component" />);

    const result = await screen.findByTestId("fjalori-evidence-null");
    expect(result).toHaveTextContent(`SOURCE_HTTP_ERROR · HTTP ${status} · UNKNOWN_OR_NULL`);
    expect(result).toHaveTextContent("does not establish that the word is absent");
    expect(screen.queryByTestId("fjalori-source-description")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Select source sense/ })).not.toBeInTheDocument();
  });

  it("keeps a non-success response with no numeric status in UNKNOWN_OR_NULL", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "incomplete response fixture" }),
    }) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="ka" context="component" />);

    const result = await screen.findByTestId("fjalori-evidence-null");
    expect(result).toHaveTextContent("SOURCE_UNAVAILABLE · UNKNOWN_OR_NULL");
    expect(result).toHaveTextContent("did not expose a usable HTTP status");
    expect(result).not.toHaveTextContent("SOURCE_HTTP_ERROR · HTTP undefined");
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
  });

  it("treats status zero as unavailable status information, not an HTTP error", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 0,
      json: async () => ({ message: "opaque response fixture" }),
    }) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="ka" context="component" />);

    const result = await screen.findByTestId("fjalori-evidence-null");
    expect(result).toHaveTextContent("SOURCE_UNAVAILABLE · UNKNOWN_OR_NULL");
    expect(result).toHaveTextContent("does not establish that the word is absent");
    expect(result).not.toHaveTextContent("HTTP 0");
    expect(result).not.toHaveTextContent("SOURCE_HTTP_ERROR");
    expect(screen.queryByTestId("fjalori-source-description")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fjalori-source-sense")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Select source sense/ })).not.toBeInTheDocument();
  });

  it.each([Number.NaN, 99, 600])("rejects invalid HTTP status value %s", async (status) => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status,
      json: async () => ({ message: "invalid status fixture" }),
    }) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="ka" context="component" />);

    const result = await screen.findByTestId("fjalori-evidence-null");
    expect(result).toHaveTextContent("SOURCE_UNAVAILABLE · UNKNOWN_OR_NULL");
    expect(result).not.toHaveTextContent("SOURCE_HTTP_ERROR");
    expect(screen.queryByTestId("fjalori-source-description")).not.toBeInTheDocument();
  });

  it("classifies a rejected fetch as a network failure without source meaning", async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError("Failed to fetch")) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="ka" context="component" />);

    const result = await screen.findByTestId("fjalori-evidence-null");
    expect(result).toHaveTextContent("SOURCE_UNAVAILABLE · NETWORK_FAILURE · UNKNOWN_OR_NULL");
    expect(result).toHaveTextContent("does not establish that the word is absent");
    expect(screen.queryByTestId("fjalori-source-description")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Select source sense/ })).not.toBeInTheDocument();
  });

  it("distinguishes invalid JSON and contract responses from valid records without usable senses", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => { throw new SyntaxError("invalid JSON fixture"); },
    }) as unknown as typeof fetch;
    const invalidJson = render(<FjaloriCrossSourceEvidenceV0_1 word="ka" context="component" />);
    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("INVALID_SOURCE_RESPONSE · UNKNOWN_OR_NULL");
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
    invalidJson.unmount();

    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        word: "ka",
        licence: "CC BY-SA 4.0",
        attribution: [],
        sources: [],
        entries: [{ pos: "verb", sources: [], senses: [] }],
      }),
    }) as unknown as typeof fetch;
    render(<FjaloriCrossSourceEvidenceV0_1 word="ka" context="component" />);
    expect(await screen.findByTestId("fjalori-no-usable-senses")).toHaveTextContent("NO_USABLE_SENSES · UNKNOWN_OR_NULL");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("FORM_MATCH_ONLY");
    expect(screen.queryByTestId("fjalori-component-meaning-comparison")).not.toBeInTheDocument();
  });

  it("does not show a dritare source-meaning claim when its description is unavailable", async () => {
    global.fetch = jest.fn().mockResolvedValue(responseFor("dritare", { description: null })) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="dritare" />);

    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("no attributable Albanian author description");
    expect(screen.queryByTestId("fjalori-dritare-separation")).not.toBeInTheDocument();
  });

  it("preserves separate entry lineages for duplicate records such as gjitar", async () => {
    global.fetch = jest.fn().mockResolvedValue(responseFor("gjitar", {
      entrySources: [["en-wiktionary", "wikidata", "sq-wiktionary"], ["en-wiktionary"]],
      recordSources: ["en-wiktionary", "wikidata", "sq-wiktionary", "ai"],
    })) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="gjitar" />);

    expect(await screen.findByTestId("fjalori-entry-lineages")).toHaveTextContent(
      "Entry 1 lineage: en-wiktionary · wikidata · sq-wiktionary",
    );
    expect(screen.getByTestId("fjalori-entry-lineages")).toHaveTextContent("Entry 2 lineage: en-wiktionary");
    expect(screen.getByTestId("fjalori-entry-lineages").children).toHaveLength(2);
  });

  it("classifies a mismatched successful record as invalid source response", async () => {
    global.fetch = jest.fn().mockResolvedValue(responseFor("pelar")) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="qymyrtar" />);

    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("INVALID_SOURCE_RESPONSE · UNKNOWN_OR_NULL");
    expect(screen.queryByTestId("fjalori-source-description")).not.toBeInTheDocument();
  });

  it("shows a valid Null when the record has no attributable AI description", async () => {
    global.fetch = jest.fn().mockResolvedValue(responseFor("pelar", { description: null })) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="pelar" />);

    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("no attributable Albanian author description");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("FORM_MATCH_ONLY");
  });

  it("suppresses GPL-only unverified Hunspell records", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        word: "fuzhnjar",
        unverified: true,
        licence: "GPL-2.0-or-later",
        sources: ["hunspell-sq"],
        attribution: [aiAttribution],
        description: { text: "must not be displayed", source: "ai" },
        entries: [],
      }),
    }) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="fuzhnjar" />);

    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.queryByText("must not be displayed")).not.toBeInTheDocument();
  });

  it("rejects non-single-word and overlong input without making a request", () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;

    for (const word of ["dritare e", "dritare-ditare", "dritare/", "dritare'", "a".repeat(65)]) {
      const { unmount } = render(<FjaloriCrossSourceEvidenceV0_1 word={word} />);
      expect(screen.queryByTestId("fjalori-cross-source-evidence")).not.toBeInTheDocument();
      unmount();
    }

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("settles the timeout when abort does not settle the fetch", async () => {
    jest.useFakeTimers();
    let signal: AbortSignal | undefined;
    global.fetch = jest.fn((_input, init) => {
      signal = (init as RequestInit).signal as AbortSignal;
      return new Promise(() => undefined);
    }) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="fuzhnjar" />);

    await act(async () => {
      jest.advanceTimersByTime(8_000);
    });

    expect(signal?.aborted).toBe(true);
    expect(screen.getByTestId("fjalori-evidence-null")).toHaveTextContent("SOURCE_UNAVAILABLE · TIMEOUT · UNKNOWN_OR_NULL");
    await act(async () => {
      jest.advanceTimersByTime(16_000);
    });
    expect(screen.getByTestId("fjalori-evidence-null")).toHaveTextContent("SOURCE_UNAVAILABLE · TIMEOUT · UNKNOWN_OR_NULL");
  });

  it("does not let a response arriving after timeout replace the terminal timeout state", async () => {
    jest.useFakeTimers();
    let resolveFetch!: (response: ReturnType<typeof responseFor>) => void;
    const pending = new Promise<ReturnType<typeof responseFor>>((resolve) => {
      resolveFetch = resolve;
    });
    global.fetch = jest.fn(() => pending) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="ka" />);
    await act(async () => {
      jest.advanceTimersByTime(8_000);
    });
    expect(screen.getByTestId("fjalori-evidence-null")).toHaveTextContent("SOURCE_UNAVAILABLE · TIMEOUT · UNKNOWN_OR_NULL");

    await act(async () => {
      resolveFetch(responseFor("ka"));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByTestId("fjalori-evidence-null")).toHaveTextContent("SOURCE_UNAVAILABLE · TIMEOUT · UNKNOWN_OR_NULL");
    expect(screen.queryByTestId("fjalori-source-description")).not.toBeInTheDocument();
  });

  it("clears a successful request timeout instead of showing stale timeout state", async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn().mockResolvedValue(responseFor("ka")) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="ka" />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByTestId("fjalori-source-description")).toHaveTextContent("Përshkrim prove për ka");

    await act(async () => {
      jest.advanceTimersByTime(8_000);
    });
    expect(screen.getByTestId("fjalori-source-description")).toHaveTextContent("Përshkrim prove për ka");
    expect(screen.queryByText(/SOURCE_UNAVAILABLE · TIMEOUT/)).not.toBeInTheDocument();
  });

  it("ignores an old word response after switching to another exact spelling", async () => {
    let resolveKan!: (response: ReturnType<typeof responseFor>) => void;
    const pendingKan = new Promise<ReturnType<typeof responseFor>>((resolve) => {
      resolveKan = resolve;
    });
    const fetchMock = jest.fn((input: RequestInfo | URL) => {
      return String(input).endsWith("/kan.json") ? pendingKan : Promise.resolve(responseFor("ka"));
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const kanProposal = {
      componentId: "0", exactSpelling: "KAN", proposedMeaning: "KAN draft",
      proposedGrammaticalRole: "", language: "Albanian", dialect: "", unresolved: false,
    };
    const kaProposal = { ...kanProposal, exactSpelling: "KA", proposedMeaning: "KA draft" };
    const view = render(
      <FjaloriCrossSourceEvidenceV0_1 word="KAN" context="component" componentProposal={kanProposal} />,
    );

    view.rerender(
      <FjaloriCrossSourceEvidenceV0_1 word="KA" context="component" componentProposal={kaProposal} />,
    );
    expect(await screen.findByText("Përshkrim prove për ka")).toBeInTheDocument();
    await act(async () => {
      resolveKan(responseFor("kan"));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    expect(screen.getByTestId("fjalori-source-description")).toHaveTextContent("Përshkrim prove për ka");
    expect(screen.queryByText("Përshkrim prove për kan")).not.toBeInTheDocument();
    expect(screen.queryByTestId("fjalori-selected-sense")).not.toBeInTheDocument();
  });

  it("resets a manually selected sense assessment when the analyzed word changes", async () => {
    const fetchMock = jest.fn()
      .mockResolvedValueOnce(responseFor("kan"))
      .mockResolvedValueOnce(responseFor("ka"));
    global.fetch = fetchMock as unknown as typeof fetch;
    const kanProposal = {
      componentId: "0", exactSpelling: "KAN", proposedMeaning: "KAN draft",
      proposedGrammaticalRole: "", language: "Albanian", dialect: "", unresolved: false,
    };
    const kaProposal = { ...kanProposal, exactSpelling: "KA", proposedMeaning: "KA draft" };
    const view = render(
      <FjaloriCrossSourceEvidenceV0_1 word="KAN" context="component" componentProposal={kanProposal} />,
    );
    expect(await screen.findByText("Përshkrim prove për kan")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection" }));
    fireEvent.change(screen.getByLabelText("USER_INTERPRETATION assessment for entry 1 sense 1"), {
      target: { value: "POTENTIALLY_SUPPORTS_PROPOSAL" },
    });

    view.rerender(
      <FjaloriCrossSourceEvidenceV0_1 word="KA" context="component" componentProposal={kaProposal} />,
    );
    expect(await screen.findByText("Përshkrim prove për ka")).toBeInTheDocument();
    expect(screen.queryByTestId("fjalori-selected-sense")).not.toBeInTheDocument();
    expect(screen.queryByText(/Current assessment:/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Select source sense entry 1 sense 1 for inspection" }));
    expect(screen.getByTestId("fjalori-component-meaning-comparison")).toHaveTextContent("Component spelling: KA");
    expect(screen.getByTestId("fjalori-component-meaning-comparison")).toHaveTextContent("Proposed meaning: KA draft");
    expect(screen.getByLabelText("USER_INTERPRETATION assessment for entry 1 sense 1")).toHaveValue("");
  });

  it("aborts and ignores a pending source response after unmount", async () => {
    let resolveFetch!: (response: ReturnType<typeof responseFor>) => void;
    let signal: AbortSignal | undefined;
    const pending = new Promise<ReturnType<typeof responseFor>>((resolve) => {
      resolveFetch = resolve;
    });
    global.fetch = jest.fn((_input, init) => {
      signal = (init as RequestInit).signal as AbortSignal;
      return pending;
    }) as unknown as typeof fetch;
    const view = render(<FjaloriCrossSourceEvidenceV0_1 word="ka" />);

    view.unmount();
    expect(signal?.aborted).toBe(true);
    await act(async () => {
      resolveFetch(responseFor("ka"));
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  });
});
