import React from "react";
import { render, screen } from "@testing-library/react";
import MeaningPanel from "@/ui/instrument/MeaningPanel";

describe("MeaningPanel boundary clarity", () => {
  it("uses deterministic-reading and inspection-evidence labels while keeping the boundary explicit", () => {
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

    expect(screen.getByText("Meaning")).toBeInTheDocument();
    expect(screen.getByText("Deterministic reading")).toBeInTheDocument();
    expect(screen.getByText("Inspection evidence posture")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Human-readable deterministic reading for the current word\. It frames the readout as inspection output, not origin proof\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Functional / normalization path: U → I.")).toBeInTheDocument();
    expect(screen.queryByText(/Candidate \/ structural path: U → I/)).not.toBeInTheDocument();
    expect(screen.getByText(/Boundary: deterministic reading; functional \/ normalization paths and candidate \/ structural paths are separate from word-specific functional motivation; no forced answer; not a historical-chain claim\./i)).toBeInTheDocument();
  });
});
