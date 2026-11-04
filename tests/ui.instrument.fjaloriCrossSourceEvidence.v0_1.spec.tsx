import { act, cleanup, render, screen } from "@testing-library/react";
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

  it("fails closed when the returned record is for a different spelling", async () => {
    global.fetch = jest.fn().mockResolvedValue(responseFor("pelar")) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="qymyrtar" />);

    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("UNKNOWN_OR_NULL");
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

  it("returns graceful Null when the bounded request times out", async () => {
    jest.useFakeTimers();
    global.fetch = jest.fn((_input, init) => new Promise((_resolve, reject) => {
      const signal = (init as RequestInit).signal as AbortSignal;
      signal.addEventListener("abort", () => reject(new Error("request aborted")), { once: true });
    })) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="fuzhnjar" />);

    await act(async () => {
      jest.advanceTimersByTime(8_000);
    });

    expect(screen.getByTestId("fjalori-evidence-null")).toHaveTextContent("UNKNOWN_OR_NULL");
  });
});
