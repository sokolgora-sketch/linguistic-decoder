import React from "react";
import { render, screen } from "@testing-library/react";

import { RootMapCard } from "@/ui/instrument/RootMapCard";
import type { PresentOrMissing } from "@/ui/telemetry/types";

describe("ui instrument: RootMapCard coordinate integrity (v0.1.1)", () => {
  it("keeps long technical identifiers complete and wrap-capable", () => {
    const token = "SOURCE_REASON_IDENTIFIER_".repeat(8);
    const vm: PresentOrMissing<unknown> = {
      kind: "present",
      value: {
        tokens: [{ token }],
        keys: [],
        carriers: [],
        spans: [],
        composedMeaning: "",
      },
    };

    render(<RootMapCard rootMap={vm as any} word="study" normalizedWord="study" />);

    const tokenValue = screen.getByText(token);
    expect(tokenValue).toHaveClass("break-words", "[overflow-wrap:anywhere]");
    expect(tokenValue).not.toHaveClass("truncate");
  });

  it("shows a plain-language unavailable state when rootMap is missing and keeps the exact status in details", () => {
    const vmMissing: PresentOrMissing<unknown> = {
      kind: "missing",
      missing: "not_emitted",
      note: "rootMap",
    };

    render(<RootMapCard rootMap={vmMissing as any} word="study" normalizedWord="study" />);

    expect(screen.getByText("Map status: not available")).toBeTruthy();
    const statusDetails = screen.getByText("Technical status").closest("details");
    expect(statusDetails).not.toHaveAttribute("open");
    expect(statusDetails).toHaveTextContent("MISSING");
    expect(screen.getByText(/not_emitted/i)).toBeTruthy();
  });

  it("shows a plain-language needs-review state when no spans are present", () => {
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

    expect(screen.getByText("Map status: needs review")).toBeTruthy();
    const statusDetails = screen.getByText("Technical status").closest("details");
    expect(statusDetails).not.toHaveAttribute("open");
    expect(statusDetails).toHaveTextContent("NONE");
    expect(screen.getByText(/no spans were provided/i)).toBeTruthy();
  });

  it("shows a plain-language needs-review state for malformed spans", () => {
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

    expect(screen.getByText("Map status: needs review")).toBeTruthy();
    const statusDetails = screen.getByText("Technical status").closest("details");
    expect(statusDetails).not.toHaveAttribute("open");
    expect(statusDetails).toHaveTextContent("MALFORMED");
    expect(screen.getByText(/failed bounds validation/i)).toBeTruthy();
  });

  it("shows a readable available state when spans are valid and highlights over normalizedWord only", () => {
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

    expect(screen.getByText("Map status: available")).toBeTruthy();
    // unique: highlight span has title "ST [0,2)"
    expect(screen.getByTitle("ST [0,2)")).toBeTruthy();
  });
});
