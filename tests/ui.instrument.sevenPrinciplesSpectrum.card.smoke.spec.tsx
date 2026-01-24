import React from "react";
import { render } from "@testing-library/react";

import { SevenPrinciplesSpectrumCard } from "@/ui/instrument/sections/SevenPrinciplesSpectrumCard";

// Goal: the card must never throw, even if spectrum is missing/partial/malformed.
// This is a guardrail against ".join of undefined" regressions.

describe("UI smoke: SevenPrinciplesSpectrumCard (no-throw)", () => {
  it("renders when spectrum is nullish-ish (defensive)", () => {
    expect(() => {
      render(<SevenPrinciplesSpectrumCard spectrum={null as any} />);
    }).not.toThrow();
  });

  it("renders when spectrum has missing sections", () => {
    const spectrum = {
      delta: { same: false, surface: undefined, functional: undefined },
      surface: { kind: "missing", missing: "not_emitted" },
      functional: { kind: "missing", missing: "not_emitted" },
    } as any;

    expect(() => {
      render(<SevenPrinciplesSpectrumCard spectrum={spectrum} />);
    }).not.toThrow();
  });

  it("renders when present sections exist but arrays are malformed", () => {
    const spectrum = {
      delta: { same: false, surface: "U-Y", functional: "U-I" },
      surface: {
        kind: "present",
        value: {
          vowels: "U-Y", // should be string[] but we intentionally break it
          notes: undefined,
          indices1: null,
          rings: "1 2",
          colors: [],
          crossesCenter: false,
          endsOnE: false,
          drift: "mostly_increasing",
        },
      },
      functional: {
        kind: "present",
        value: {
          vowels: ["U", "I"],
          notes: undefined,
          indices1: undefined,
          rings: undefined,
          colors: undefined,
          crossesCenter: false,
          endsOnE: false,
          drift: "mostly_decreasing",
        },
      },
    } as any;

    expect(() => {
      render(<SevenPrinciplesSpectrumCard spectrum={spectrum} />);
    }).not.toThrow();
  });
});
