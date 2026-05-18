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
  it("renders the foundation contract verbatim", () => {
    const { container } = render(<HonestContractCard />);

    expect(screen.getByText("honest contract")).toBeInTheDocument();
    expect(screen.getByText("What Open Instrument is")).toBeInTheDocument();
    expect(screen.getByText(OPEN_INSTRUMENT_HONEST_CONTRACT)).toBeInTheDocument();
    expect(screen.getByText("collapse")).toBeInTheDocument();
    expect(screen.getByText("Visible by default. Collapse after reading; keep this boundary in mind before using candidates.")).toBeInTheDocument();
    expect(container.querySelector("details")).toHaveAttribute("open");
  });

  it("keeps the contract visible in the post-analysis instrument shell", () => {
    render(<InstrumentPanel payload={minimalPayload()} />);

    expect(screen.getByTestId("open-instrument-shell")).toBeInTheDocument();
    expect(screen.getByText(OPEN_INSTRUMENT_HONEST_CONTRACT)).toBeInTheDocument();
  });
});
