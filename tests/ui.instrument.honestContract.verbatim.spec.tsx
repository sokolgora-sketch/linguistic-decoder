import React from "react";
import { render, screen } from "@testing-library/react";
import {
  HonestContractCard,
  OPEN_INSTRUMENT_HONEST_CONTRACT,
} from "@/ui/instrument/sections/HonestContractCard";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

function minimalPayload(): any {
  return {
    word: "study",
    candidates: [
      {
        language: "Latin",
        form: "studium",
        sourceKind: "SEED",
        vowelPath: "U-I",
      },
    ],
    evidence: {
      ops: [],
      notes: [],
      signals: [],
    },
    originClaim: {
      policy: {
        gatesActive: false,
      },
      candidates: [],
    },
  };
}

describe("Open Instrument honest contract", () => {
  it("keeps the full foundation contract available without putting it before the useful result", () => {
    const { container } = render(<HonestContractCard />);

    expect(
      screen.getByText("boundary"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Functional motivation, not historical etymology",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        OPEN_INSTRUMENT_HONEST_CONTRACT,
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText("expand"),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Optional context. The primary result stays focused on functional motivation.",
      ),
    ).toBeInTheDocument();

    expect(
      container.querySelector("details"),
    ).not.toHaveAttribute("open");
  });

  it("keeps the contract visible in the post-analysis instrument shell", () => {
    render(<InstrumentPanel payload={minimalPayload()} />);

    expect(screen.getByTestId("open-instrument-shell")).toBeInTheDocument();
    expect(screen.getByText(OPEN_INSTRUMENT_HONEST_CONTRACT)).toBeInTheDocument();
  });
});
