import React from "react";
import { render, screen } from "@testing-library/react";
import { DeepRootHeartGateSummaryCard } from "@/ui/instrument/DeepRootHeartGateSummaryCard";

describe("Instrument UI: Gate Summary Card", () => {
  it("renders counts and top reasons", () => {
    const rows: any[] = [
      { deepRootHeartGateStatus: "aligned", deepRootHeartGateReasons: [] },
      { deepRootHeartGateStatus: "misaligned", deepRootHeartGateReasons: ["TERMINAL_VOWEL_CONFLICT"] },
      { deepRootHeartGateStatus: "misaligned", deepRootHeartGateReasons: ["TERMINAL_VOWEL_CONFLICT", "RING_MISMATCH"] },
      { deepRootHeartGateStatus: "insufficient", deepRootHeartGateReasons: [] },
      { deepRootHeartGateStatus: null, deepRootHeartGateReasons: null },
    ];

    render(<DeepRootHeartGateSummaryCard rows={rows} />);

    expect(screen.getByText("Gate Summary")).toBeInTheDocument();
    expect(screen.getByText("Aligned: 1")).toBeInTheDocument();
    expect(screen.getByText("Misaligned: 2")).toBeInTheDocument();
    expect(screen.getByText("Insufficient: 1")).toBeInTheDocument();
    expect(screen.getByText("Missing: 1")).toBeInTheDocument();

    expect(screen.getByText(/TERMINAL_VOWEL_CONFLICT — 2/)).toBeInTheDocument();
    expect(screen.getByText(/RING_MISMATCH — 1/)).toBeInTheDocument();

    expect(screen.queryByText(/\[object Object\]/i)).toBeNull();
  });

  it("renders empty safely", () => {
    render(<DeepRootHeartGateSummaryCard rows={[]} />);
    expect(screen.getByText("Gate Summary")).toBeInTheDocument();
    expect(screen.getByText("Aligned: 0")).toBeInTheDocument();
    expect(screen.getByText("Misaligned: 0")).toBeInTheDocument();
    expect(screen.getByText("Insufficient: 0")).toBeInTheDocument();
    expect(screen.getByText("Missing: 0")).toBeInTheDocument();
  });
});
