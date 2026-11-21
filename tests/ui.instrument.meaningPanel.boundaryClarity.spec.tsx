import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import MeaningPanel from "@/ui/instrument/MeaningPanel";

describe("MeaningPanel boundary clarity", () => {
  it("shows a plain structural boundary first and keeps technical inspection details accessible", () => {
    render(
      <MeaningPanel
        vm={{
          readout: {
            principlesPath: { kind: "present", value: ["Unity", "Insight"] },
            counts: { candidates: 2 },
            voicePathDelta: "SHIFT",
            voicePathFunctional: { kind: "present", value: ["U", "I"] },
          },
          detection: {},
          evidence: {
            normalizationSteps: { kind: "present", value: ["lowercase", "trim"] },
            ops: { kind: "present", value: ["y_to_i"] },
            signals: { kind: "missing", missing: "not_emitted" },
            notes: { kind: "present", value: ["surface path differs from functional path"] },
          },
        }}
      />
    );

    expect(screen.getByText(/reports spelling and Voice structure from the analysis/i)).toBeVisible();
    expect(screen.getByText(/does not by itself establish a word meaning or origin/i)).toBeVisible();
    expect(screen.getByText("Analysis path: U → I.")).toBeVisible();
    expect(screen.queryByText(/Candidate \/ structural path: U → I/)).not.toBeInTheDocument();
    const details = screen.getByTestId("meaning-technical-details");
    expect(details).not.toHaveAttribute("open");
    expect(screen.getByTestId("meaning-technical-summary")).not.toBeVisible();
    fireEvent.click(screen.getByText("Technical structure and evidence"));
    expect(details).toHaveAttribute("open");
    expect(screen.getByTestId("meaning-technical-summary")).toBeVisible();
  });
});
