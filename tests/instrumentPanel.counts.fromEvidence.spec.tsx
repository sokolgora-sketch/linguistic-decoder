import React from "react";
import { render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

test("InstrumentPanel derives ops/notes/signals counts from emitted evidence arrays", () => {
  const payload: unknown = {
    word: "study",
    sanitized: "study",
    engineVersion: "0.2.0-symbolic",
    mode: "strict",
    candidates: [],
    evidence: {
      ops: [{}, {}, {}],
      notes: [{}, {}],
      signals: [{}, {}, {}, {}],
      normalizationSteps: [{}],
    },
    heart: { mode: "strict", alphabet: "Latin" },
    primaryPath: { voicePath: ["U", "I"] },
  };

  render(<InstrumentPanel payload={payload} />);

  const text = screen.getByText(/ZË-RO Instrument Summary/).textContent ?? "";
  expect(text).toContain("ops=3");
  expect(text).toContain("notes=2");
  expect(text).toContain("signals=4");
});
