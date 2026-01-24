import React from "react";
import { render, screen } from "@testing-library/react";
import { SevenPrinciplesSpectrumCard } from "@/ui/instrument/sections/SevenPrinciplesSpectrumCard";

describe("SevenPrinciplesSpectrumCard renders from VM", () => {
  it("renders surface + functional when present", () => {
    render(
      <SevenPrinciplesSpectrumCard
        spectrum={{
          surface: {
            kind: "present",
            value: {
              vowels: ["U", "Y"],
              indices1: [5, 6],
              rings: [1, 2],
              colors: ["blue", "indigo"],
              notes: ["G", "A"],
              crossesCenter: false,
              endsOnË: false,
              ringFlow: [1, 2],
              drift: "increasing",
            },
          },
          functional: {
            kind: "present",
            value: {
              vowels: ["U", "I"],
              indices1: [5, 3],
              rings: [1, 1],
              colors: ["blue", "yellow"],
              notes: ["G", "E"],
              crossesCenter: false,
              endsOnË: false,
              ringFlow: [1, 1],
              drift: "mixed",
            },
          },
        }}
      />
    );

    expect(screen.getByText("Seven Principles Spectrum")).toBeTruthy();
    expect(screen.getByText("surface")).toBeTruthy();
    expect(screen.getByText("functional")).toBeTruthy();
  });
});
