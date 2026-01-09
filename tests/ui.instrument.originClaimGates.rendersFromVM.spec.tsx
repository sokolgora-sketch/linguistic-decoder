import React from "react";
import { render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

describe("ui instrument: originClaim gates renders from VM", () => {
  test("shows ON/OFF and counts from VM only", () => {
    const vm: any = {
      originClaimGates: {
        active: true,
        flag: "ocg",
        candidateCount: 3,
        reasonCounts: { KEEP: 2, DROP: 1 },
      },
    };

    render(<InstrumentPanel vm={vm} /> as any);

    expect(screen.getByText(/OriginClaim Gates/i)).toBeInTheDocument();
    expect(screen.getByText(/Status:/i)).toBeInTheDocument();
    expect(screen.getByText("ON")).toBeInTheDocument();
    expect(screen.getByText(/Candidates:/i)).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText(/Reason code counts/i)).toBeInTheDocument();
  });

  test("OFF renders when active=false", () => {
    const vm: any = {
      originClaimGates: {
        active: false,
        flag: "ocg",
        candidateCount: 7,
        reasonCounts: {},
      },
    };

    render(<InstrumentPanel vm={vm} /> as any);
    expect(screen.getByText("OFF")).toBeInTheDocument();
  });
});
