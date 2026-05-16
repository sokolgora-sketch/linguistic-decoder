/**
 * UI guardrail: Telemetry must behave like a scientific instrument.
 *
 * This test is intentionally NOT a feature test.
 * It blocks narrative behavior:
 * - no winner language
 * - no ranking language
 * - no beautification / certainty claims
 *
 * Update ONLY:
 * 1) The component import
 * 2) The VM fixture shape (keep it minimal)
 */

import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

/**
 * TODO(you): point this import at the telemetry UI component that renders
 * from the VM (NOT from raw payload).
 *
 * Examples might be:
 * - InstrumentPanel
 * - TelemetryPanel
 * - AnalyzeReadout
 */
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

/**
 * TODO(you): replace this type/import with your actual VM type if you have one.
 * Keep the fixture VM-only and minimal.
 */
// type InstrumentVM = any;

function makeMinimalPayload(): any {
  return {
    // Minimal, VM-only fixture. Keep fields that your panel requires to render.
    // If your component requires more fields, add them here, but do NOT include raw payload.
    word: "test",
    candidates: [],
    originClaim: {
        policy: {
            gatesActive: false,
        },
        candidates: [],
    },
    evidence: {
        "ops": [],
        "notes": [],
        "signals": [],
    }
  };
}

describe("ui guardrail: InstrumentPanel is a scientific instrument (v0.1)", () => {
  it("never emits winner/ranking/beautification language", () => {
    const payload = makeMinimalPayload();

    render(<InstrumentPanel payload={payload} />);

    // Collect all visible text. This is a blunt safety belt.
    const text = (document.body.textContent || "").toLowerCase();

    // Hard blocks: "winner" / ranking / certainty language.
    const banned = [
      "winner",
      "best",
      "top 1",
      "top1",
      "rank",
      "ranking",
      "most likely",
      "definitely",
      "certainly",
      "this is the origin",
      "true origin",
      "the origin is",
      "resolved",
      "confirmed",
    ];

    for (const term of banned) {
      expect(text).not.toContain(term);
    }

    // Soft block: UI must not fabricate confidence math if absent.
    // (If you later add explicit VM confidence fields, update this test with an allow-list.)
    expect(text).not.toMatch(/confidence\s*:\s*\d/);

    // A minimal positive assertion: panel exists and renders something.
    // Update the selector to something stable if you have a heading/testid.
    expect(document.body.textContent).toBeTruthy();

    expect(screen.getByText("Tool boundaries")).toBeInTheDocument();
    expect(screen.getByText("What this tool does")).toBeInTheDocument();
    expect(screen.getByText("What this tool does not do")).toBeInTheDocument();
    expect(screen.getByText("Shows deterministic engine output for one word.")).toBeInTheDocument();
    expect(screen.getByText("Prove a historical origin.")).toBeInTheDocument();
    expect(screen.getAllByText("Evidence trace").length).toBeGreaterThan(0);
    expect(screen.getAllByText("candidate source kinds").length).toBeGreaterThan(0);
    expect(screen.getAllByText("RootMap hypothesis").length).toBeGreaterThan(0);
    expect(screen.getByTestId("open-instrument-shell")).toBeInTheDocument();
    expect(screen.getByText("ZË-RO Open Instrument")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("active surface")).toBeInTheDocument();
    expect(screen.getByText("Readout, evidence trace, and hypothesis summary in one inspection surface.")).toBeInTheDocument();
    expect(screen.getByText("section=overview")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Candidates" }));
    expect(screen.getByRole("tab", { name: "Candidates" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Candidate rows remain inspection records, not a forced answer.")).toBeInTheDocument();
    expect(screen.getByText("section=candidates")).toBeInTheDocument();

    const lightModeButton = screen.getByRole("button", { name: /light mode/i });
    expect(lightModeButton).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(lightModeButton);
    expect(screen.getByRole("button", { name: /dark mode/i })).toHaveAttribute("aria-pressed", "false");

    const evidenceTraceIndex = text.indexOf("evidence trace");
    const toolBoundariesIndex = text.indexOf("tool boundaries");
    const evidencePackageIndex = text.indexOf("evidence package");
    const maskCarrierIndex = text.indexOf("mask vs carrier");

    expect(evidenceTraceIndex).toBeGreaterThanOrEqual(0);
    expect(toolBoundariesIndex).toBeGreaterThan(evidenceTraceIndex);
    expect(evidencePackageIndex).toBeGreaterThan(toolBoundariesIndex);
    expect(maskCarrierIndex).toBeGreaterThan(evidencePackageIndex);
  });
});
