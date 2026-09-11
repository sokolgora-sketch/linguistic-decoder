/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

async function analyze(word: string): Promise<unknown> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function visibleOverview() {
  return screen.getByRole("tabpanel");
}

describe("Open Instrument primary truth status v0.1", () => {
  it.each([
    ["study", "Reviewed functional evidence"],
    ["damage", "Reviewed functional evidence"],
    ["mode", "Hypothesis — structural, unreviewed"],
    ["sterile", "Research functional hypothesis"],
    ["xyz", "Null — no supported candidate"],
  ] as const)(
    "exposes the canonical %s status in the primary Overview",
    async (word, heading) => {
      render(<InstrumentPanel vm={adaptAnalysisToTelemetryVM(await analyze(word))} />);

      const overview = visibleOverview();
      expect(
        within(overview).getByRole("heading", { name: heading }),
      ).toBeVisible();
    },
  );

  it("keeps the structural primary readout bounded", async () => {
    render(
      <InstrumentPanel
        vm={adaptAnalysisToTelemetryVM(await analyze("mode"))}
      />,
    );

    const overview = visibleOverview();
    expect(
      within(overview).getByText(/Structural output is not candidate truth/i),
    ).toBeVisible();
    expect(
      within(overview).getByText(/No historical-origin.*winner/i),
    ).toBeVisible();
  });

  it("keeps research visibly separate from reviewed evidence", async () => {
    render(
      <InstrumentPanel
        vm={adaptAnalysisToTelemetryVM(await analyze("sterile"))}
      />,
    );

    expect(
      within(visibleOverview()).getByText(/not reviewed functional evidence/i),
    ).toBeVisible();
  });

  it("keeps canonical Null as the dedicated primary result", async () => {
    render(
      <InstrumentPanel
        vm={adaptAnalysisToTelemetryVM(await analyze("xyz"))}
      />,
    );

    const overview = visibleOverview();
    expect(within(overview).getByText(/Null is a valid result/i)).toBeVisible();
    expect(within(overview).queryByText("Status not emitted.")).not.toBeInTheDocument();
  });
});
