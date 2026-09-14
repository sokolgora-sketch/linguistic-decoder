/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";
import { VowelPathTimeline } from "@/ui/instrument/VowelPathTimeline";

import studyFixture from "./fixtures/openInstrument/analyze-v1/post-ssot-word-regression-v0.1/study.run1.raw.json";
import damageFixture from "./fixtures/openInstrument/analyze-v1/post-ssot-word-regression-v0.1/damage.run1.raw.json";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

function present<T>(value: T) {
  return { kind: "present" as const, value };
}

function missing() {
  return { kind: "missing" as const, missing: "not_emitted" as const };
}

describe("Open Instrument path delta normalization context v0.1", () => {
  it("shows the emitted study normalization record in Overview without changing paths or delta", () => {
    render(<InstrumentPanel payload={studyFixture} />);

    const overview = screen.getByRole("tabpanel");
    const timeline = within(overview)
      .getByText("Vowel Path Timeline (Detected vs Interpreted)")
      .closest("div.rounded-xl");

    expect(timeline).not.toBeNull();
    expect(within(timeline!).getByText("Surface")).toBeVisible();
    expect(within(timeline!).getAllByText("U → Y").length).toBeGreaterThan(0);
    expect(within(timeline!).getByText("Functional")).toBeVisible();
    expect(within(timeline!).getAllByText("U → I").length).toBeGreaterThan(0);
    expect(within(timeline!).getByText("DIVERGE")).toBeVisible();
    expect(within(timeline!).getByText("Normalization record")).toBeVisible();
    expect(
      within(timeline!).getByText("UY → UI (functional_equivalence)"),
    ).toBeVisible();
  });

  it("shows the emitted damage normalization record exactly", () => {
    render(<InstrumentPanel payload={damageFixture} />);

    const overview = screen.getByRole("tabpanel");
    const timeline = within(overview)
      .getByText("Vowel Path Timeline (Detected vs Interpreted)")
      .closest("div.rounded-xl");

    expect(timeline).not.toBeNull();
    expect(
      within(timeline!).getByText("AAE → AE (functional_equivalence)"),
    ).toBeVisible();
  });

  it("renders emitted records in order and does not recompute them from paths", () => {
    render(
      <VowelPathTimeline
        detected={present(["U", "I"])}
        surface={present(["U", "Y"])}
        functional={present(["U", "I"])}
        delta="DIVERGE"
        normalizationSteps={present(["emitted-first", "emitted-second"])}
      />,
    );

    expect(screen.getByText("emitted-first")).toBeVisible();
    expect(screen.getByText("emitted-second")).toBeVisible();
    expect(screen.queryByText("UY → UI")).not.toBeInTheDocument();
    expect(screen.getByText("U → Y")).toBeVisible();
    expect(screen.getAllByText("U → I").length).toBeGreaterThan(0);
    expect(screen.getByText("DIVERGE")).toBeVisible();

    const first = screen.getByText("emitted-first");
    const second = screen.getByText("emitted-second");
    expect(first.compareDocumentPosition(second)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("omits the normalization block when the record is missing or empty", () => {
    const { rerender } = render(
      <VowelPathTimeline
        detected={missing()}
        surface={missing()}
        functional={missing()}
        delta="NOT_EMITTED"
        normalizationSteps={missing()}
      />,
    );

    expect(screen.queryByText("Normalization record")).not.toBeInTheDocument();

    rerender(
      <VowelPathTimeline
        detected={missing()}
        surface={missing()}
        functional={missing()}
        delta="NOT_EMITTED"
        normalizationSteps={present([])}
      />,
    );

    expect(screen.queryByText("Normalization record")).not.toBeInTheDocument();
    expect(screen.getByText("NOT EMITTED")).toBeVisible();
    expect(screen.getByText("No detected voice path.")).toBeVisible();
  });
});
