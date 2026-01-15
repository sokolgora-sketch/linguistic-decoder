import React from "react";
import { render, screen } from "@testing-library/react";

// Force the failure mode: the adapter returns an invalid VM (null).
// InstrumentPanel imports the adapter from "@/ui/instrument/contractAdapter".
jest.mock("@/ui/instrument/contractAdapter", () => {
  const fn = () => null;
  return {
    __esModule: true,
    adaptAnalysisToTelemetryVM: fn,
  };
});

// Import after the mock so InstrumentPanel uses the mocked adapter.
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

describe("InstrumentPanel fail-visible guard", () => {
  it("renders a visible blocked card (never blank) when adapter yields invalid VM", () => {
    // Do NOT pass vm; force the adapter path.
    render(<InstrumentPanel payload={{} as any} />);

    expect(
      screen.getByText(/InstrumentPanel blocked: invalid Telemetry VM/i)
    ).toBeInTheDocument();
  });
});
