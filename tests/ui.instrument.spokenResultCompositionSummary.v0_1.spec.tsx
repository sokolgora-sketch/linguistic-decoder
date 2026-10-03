require("./helpers/whatwgGlobals.cjs");

import React from "react";
import { render, screen, within } from "@testing-library/react";
import { GET } from "../app/api/analyze-v1/route";
import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

async function analyze(word: string): Promise<any> {
  const response = await GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
  } as any);

  expect(response.status).toBe(200);
  return response.json();
}

function summary() {
  return screen.getByTestId("spoken-result-composition-summary");
}

describe("spoken result composition summary v0.1", () => {
  it("composes stone source pronunciation, consonants, and canonical path near the primary result", async () => {
    render(<InstrumentPanel payload={await analyze("stone")} />);

    const compact = summary();
    expect(compact).toBeVisible();
    expect(within(compact).getByText("stone: S T OW1 N")).toBeVisible();
    expect(within(compact).getByText("S → T → N")).toBeVisible();
    expect(within(compact).getByText("canonical spoken Voice path: O → U")).toBeVisible();
    expect(within(compact).getByText("Distribution D: 2 · 1")).toBeVisible();
    expect(within(compact).getByText("Edge asymmetry A: +1")).toBeVisible();
    expect(within(compact).getByText("Recurrence R: None")).toBeVisible();
    expect(within(compact).getByText("Ordered consonant load: prefix → suffix.")).toBeVisible();
    expect(within(compact).getByText("Prefix load − suffix load; structural orientation only.")).toBeVisible();
    expect(within(compact).getByText("Repeated exact source consonant identity.")).toBeVisible();
    expect(within(compact).getByText("ZC summarizes structure; the source consonant sequence preserves exact identity and order.")).toBeVisible();
    expect(within(compact).getByText(/Claim level: ZË-RO structural interpretation/)).toBeVisible();
    const primary = screen.getByTestId("primary-reading-orientation-card");
    expect(primary.compareDocumentPosition(compact) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("keeps home on the same Voice path with distinct source consonants", async () => {
    render(<InstrumentPanel payload={await analyze("home")} />);

    const compact = summary();
    expect(within(compact).getByText("home: HH OW1 M")).toBeVisible();
    expect(within(compact).getByText("HH → M")).toBeVisible();
    expect(within(compact).getByText("canonical spoken Voice path: O → U")).toBeVisible();
    expect(within(compact).getByText("Distribution D: 1 · 1")).toBeVisible();
    expect(within(compact).getByText("Edge asymmetry A: 0")).toBeVisible();
    expect(within(compact).getByText("Ordered consonant load: prefix → suffix.")).toBeVisible();
    expect(within(compact).getByText("Prefix load − suffix load; structural orientation only.")).toBeVisible();
    expect(within(compact).getByText("Repeated exact source consonant identity.")).toBeVisible();
    expect(within(compact).getByText("ZC summarizes structure; the source consonant sequence preserves exact identity and order.")).toBeVisible();
    expect(within(compact).queryByText("S → T → N")).not.toBeInTheDocument();
    expect(within(compact).queryByText("forward force")).not.toBeInTheDocument();
    expect(within(compact).queryByText("semantic meaning")).not.toBeInTheDocument();
    expect(screen.getByText("Functional / candidate status")).toBeVisible();
    expect(screen.getByRole("heading", { name: "Null — no supported candidate" })).toBeVisible();
  });

  it("keeps make and name structurally lossy without collapsing their source consonants", async () => {
    const make = render(<InstrumentPanel payload={await analyze("make")} />);

    const makeSummary = summary();
    expect(within(makeSummary).getByText("make: M EY1 K")).toBeVisible();
    expect(within(makeSummary).getByText("M → K")).toBeVisible();
    expect(within(makeSummary).getByText("canonical spoken Voice path: E → I")).toBeVisible();
    expect(within(makeSummary).getByText("Distribution D: 1 · 1")).toBeVisible();
    expect(within(makeSummary).getByText("Edge asymmetry A: 0")).toBeVisible();
    expect(within(makeSummary).getByText("ZC summarizes structure; the source consonant sequence preserves exact identity and order.")).toBeVisible();

    make.unmount();
    render(<InstrumentPanel payload={await analyze("name")} />);

    const nameSummary = summary();
    expect(within(nameSummary).getByText("name: N EY1 M")).toBeVisible();
    expect(within(nameSummary).getByText("N → M")).toBeVisible();
    expect(within(nameSummary).getByText("canonical spoken Voice path: E → I")).toBeVisible();
    expect(within(nameSummary).getByText("Distribution D: 1 · 1")).toBeVisible();
    expect(within(nameSummary).getByText("Edge asymmetry A: 0")).toBeVisible();
    expect(within(nameSummary).getByText("Ordered consonant load: prefix → suffix.")).toBeVisible();
    expect(within(nameSummary).getByText("ZC summarizes structure; the source consonant sequence preserves exact identity and order.")).toBeVisible();
    expect(within(nameSummary).queryByText("M → K")).not.toBeInTheDocument();
  });

  it("uses the prefix-to-suffix explanation for cat's one-source-nucleus composition", async () => {
    render(<InstrumentPanel payload={await analyze("cat")} />);

    const compact = summary();
    expect(within(compact).getByText("Distribution D: 1 · 1")).toBeVisible();
    expect(within(compact).getByText("Ordered consonant load: prefix → suffix.")).toBeVisible();
    expect(within(compact).queryByText("Ordered consonant load: prefix → between source nuclei → suffix.")).not.toBeInTheDocument();
  });

  it("preserves mother pronunciation-derived DH and the existing detailed provenance card", async () => {
    render(<InstrumentPanel payload={await analyze("mother")} />);

    const compact = summary();
    expect(within(compact).getByText("mother: M AH1 DH ER0")).toBeVisible();
    expect(within(compact).getByText("M → DH")).toBeVisible();
    expect(within(compact).getByText("canonical spoken Voice path: Ë → Ë")).toBeVisible();
    expect(within(compact).getByText("Distribution D: 1 · 1 · 0")).toBeVisible();
    expect(within(compact).getByText("Edge asymmetry A: +1")).toBeVisible();
    expect(within(compact).getByText("Ordered consonant load: prefix → between source nuclei → suffix.")).toBeVisible();
    expect(screen.getByTestId("spoken-pronunciation-overview")).toBeVisible();
  });

  it("keeps the between-source-nuclei explanation for study", async () => {
    render(<InstrumentPanel payload={await analyze("study")} />);

    const compact = summary();
    expect(within(compact).getByText("Distribution D: 2 · 1 · 0")).toBeVisible();
    expect(within(compact).getByText("Ordered consonant load: prefix → between source nuclei → suffix.")).toBeVisible();
  });

  it("renders banana recurrence without assigning semantic meaning", async () => {
    render(<InstrumentPanel payload={await analyze("banana")} />);

    const compact = summary();
    expect(within(compact).getByText("Distribution D: 1 · 1 · 1 · 0")).toBeVisible();
    expect(within(compact).getByText("Edge asymmetry A: +1")).toBeVisible();
    expect(within(compact).getByText("Recurrence R: N ×2")).toBeVisible();
    expect(within(compact).getByText("Ordered consonant load: prefix → between source nuclei → suffix.")).toBeVisible();
    expect(within(compact).getByText("Repeated exact source consonant identity.")).toBeVisible();
    expect(within(compact).getByText(/not linguistic or semantic authority/)).toBeVisible();
  });

  it("keeps pronunciation Null distinct from candidate Null without spelling fallback", async () => {
    render(<InstrumentPanel payload={await analyze("zzzzzzzz")} />);

    const compact = summary();
    expect(within(compact).getByText("Spoken pronunciation unavailable")).toBeVisible();
    expect(within(compact).getByText("canonical spoken Voice path: Null")).toBeVisible();
    expect(within(compact).queryByText("Pronunciation consonant segments")).not.toBeInTheDocument();
    expect(within(compact).queryByTestId("zero-consonantal-structural-composition")).not.toBeInTheDocument();
    expect(within(compact).queryByText("Ordered consonant load: prefix → between source nuclei → suffix.")).not.toBeInTheDocument();
    expect(within(compact).queryByText("Ordered consonant load: prefix → suffix.")).not.toBeInTheDocument();
    expect(within(compact).queryByText("Prefix load − suffix load; structural orientation only.")).not.toBeInTheDocument();
    expect(within(compact).queryByText("Repeated exact source consonant identity.")).not.toBeInTheDocument();
    expect(within(compact).queryByText("ZC summarizes structure; the source consonant sequence preserves exact identity and order.")).not.toBeInTheDocument();
    expect(screen.getByText("Functional / candidate status")).toBeVisible();
    expect(screen.getByTestId("spoken-pronunciation-overview")).toHaveTextContent(
      "reason: PRONUNCIATION_NOT_FOUND",
    );
    expect(
      within(screen.getByTestId("spoken-pronunciation-overview")).queryByTestId(
        "spoken-pronunciation-consonant-segments",
      ),
    ).not.toBeInTheDocument();
  });
});
