import { cleanup, render, screen } from "@testing-library/react";
import { FjaloriCrossSourceEvidenceV0_1 } from "@/ui/instrument/sections/FjaloriCrossSourceEvidence.v0_1";

const forms = ["pelar", "bletar", "luleshitës", "fuzhnjar", "qymyrtar"] as const;
const originalFetch = global.fetch;

function responseFor(word: string, description = `Përshkrim për ${word}`) {
  return {
    ok: true,
    json: async () => ({
      word,
      entries: [{
        pos: "noun",
        sources: ["en-wiktionary", "wikidata"],
        description: { text: description, source: "ai" },
        senses: [{ gloss: "example English gloss", lang: "en", source: "en-wiktionary" }],
      }],
    }),
  };
}

afterEach(() => {
  cleanup();
  global.fetch = originalFetch;
});

describe("FjaloriShqip cross-source evidence v0.1", () => {
  it.each(forms)("shows attributed, lemma-level evidence for %s without promoting it", async (word) => {
    const fetchMock = jest.fn().mockResolvedValue(responseFor(word));
    global.fetch = fetchMock as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word={word} />);

    expect(await screen.findByText(`Përshkrim për ${word}`)).toBeInTheDocument();
    expect(screen.getByText(/author-produced, AI-assisted/)).toBeInTheDocument();
    expect(screen.getByText(/Attribution: Endrit Rushiti \/ FjaloriShqip · CC BY-SA 4.0/)).toBeInTheDocument();
    expect(screen.getByText(/Wiktionary\/Kaikki-derived, not independent corroboration/)).toBeInTheDocument();
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("FORM_MATCH_ONLY");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("sense alignment is UNKNOWN_OR_NULL");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("does not change functional operation, AGENT");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      `https://fjalorishqip.org/api/v1/fjala/${encodeURIComponent(word)}.json`,
      expect.objectContaining({ cache: "force-cache" }),
    );
  });

  it("normalizes a supported direct input and does not request unlisted forms", async () => {
    const fetchMock = jest.fn().mockResolvedValue(responseFor("luleshitës"));
    global.fetch = fetchMock as unknown as typeof fetch;

    const { rerender } = render(<FjaloriCrossSourceEvidenceV0_1 word="LULESHITËS" />);
    expect(await screen.findByText("Përshkrim për luleshitës")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://fjalorishqip.org/api/v1/fjala/luleshit%C3%ABs.json",
      expect.objectContaining({ cache: "force-cache" }),
    );

    rerender(<FjaloriCrossSourceEvidenceV0_1 word="shitës" />);
    expect(screen.queryByTestId("fjalori-cross-source-evidence")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("fails closed on an unverified response or missing author description", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ word: "pelar", entries: [{ pos: "noun", description: { text: "unattributed", source: "unknown" } }] }),
    }) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="pelar" />);

    expect(await screen.findByTestId("fjalori-evidence-null")).toHaveTextContent("UNKNOWN_OR_NULL");
    expect(screen.getByTestId("fjalori-alignment-boundary")).toHaveTextContent("FORM_MATCH_ONLY");
  });

  it("does not choose a winner when the API returns multiple author descriptions", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        word: "pelar",
        entries: [
          { description: { text: "Përshkrimi i parë.", source: "ai" } },
          { description: { text: "Përshkrimi i dytë.", source: "ai" } },
        ],
      }),
    }) as unknown as typeof fetch;

    render(<FjaloriCrossSourceEvidenceV0_1 word="pelar" />);

    expect(await screen.findByText("Përshkrimi i parë.")).toBeInTheDocument();
    expect(screen.getByText("Përshkrimi i dytë.")).toBeInTheDocument();
    expect(screen.getAllByText(/author-produced, AI-assisted/)).toHaveLength(2);
  });
});
