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
import { render, screen } from "@testing-library/react";

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
  });
});
