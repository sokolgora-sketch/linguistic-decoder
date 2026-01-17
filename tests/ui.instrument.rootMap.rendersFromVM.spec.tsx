import React from "react";
import { render, screen } from "@testing-library/react";

import { RootMapCard } from "@/ui/instrument/RootMapCard";
import type { PresentOrMissing } from "@/ui/telemetry/types";

describe("ui instrument: RootMapCard coordinate integrity (v0.1.1)", () => {
  it("STATE=MISSING when rootMap missing", () => {
    const vmMissing: PresentOrMissing<unknown> = {
      kind: "missing",
      missing: "not_emitted",
      note: "rootMap",
    };

    render(<RootMapCard rootMap={vmMissing as any} word="study" normalizedWord="study" />);

    expect(screen.getByText("STATE: MISSING")).toBeTruthy();
    expect(screen.getByText(/not_emitted/i)).toBeTruthy();
  });

  it("STATE=NONE when present but has no spans (no guessing)", () => {
    const vmPresentNoSpans: PresentOrMissing<unknown> = {
      kind: "present",
      value: {
        tokens: [{ token: "DA" }],
        keys: [],
        composedMeaning: "",
        notes: ["no spans in fixture"],
      },
    };

    render(<RootMapCard rootMap={vmPresentNoSpans as any} word="study" normalizedWord="study" />);

    expect(screen.getByText("STATE: NONE")).toBeTruthy();
    expect(screen.getByText(/no spans were provided/i)).toBeTruthy();
  });

  it("STATE=MALFORMED if any span is out of bounds (highlights disabled)", () => {
    const vmMalformed: PresentOrMissing<unknown> = {
      kind: "present",
      value: {
        spans: [{ start: 0, end: 99, token: "DA" }], // out of bounds for "study"
        tokens: [{ token: "DA" }],
        keys: [],
        composedMeaning: "",
      },
    };

    render(<RootMapCard rootMap={vmMalformed as any} word="study" normalizedWord="study" />);

    expect(screen.getByText("STATE: MALFORMED")).toBeTruthy();
    expect(screen.getByText(/failed bounds validation/i)).toBeTruthy();
  });

  it("STATE=PRESENT when spans valid; highlights over normalizedWord only", () => {
    const vmPresent: PresentOrMissing<unknown> = {
      kind: "present",
      value: {
        spans: [{ start: 0, end: 2, token: "ST" }],
        tokens: [{ token: "ST" }],
        keys: [{ token: "ST", language: "sq", gloss: "test", status: "speculative", evidence: [] }],
        composedMeaning: "test",
      },
    };

    render(<RootMapCard rootMap={vmPresent as any} word="study" normalizedWord="study" />);

    expect(screen.getByText("STATE: PRESENT")).toBeTruthy();
    // unique: highlight span has title "ST [0,2)"
    expect(screen.getByTitle("ST [0,2)")).toBeTruthy();
  });
});
