import React from "react";
import { render, screen } from "@testing-library/react";
import { OracleProposeWithEngineOracleCardV01 } from "@/ui/instrument/sections/OracleProposeWithEngineOracleCard.v0.1";
import { RawJsonCard } from "@/ui/instrument/sections/RawJsonCard";

describe("Open Instrument Advanced audit card clarity", () => {
  it("labels the oracle proposer as an optional diagnostic with safe defaults", () => {
    render(
      <OracleProposeWithEngineOracleCardV01
        word="study"
        mode="strict"
        onCopy={() => void 0}
      />
    );

    expect(screen.getByText(/advanced audit action/i)).toBeInTheDocument();
    expect(screen.getByText("Propose with Engine Oracle")).toBeInTheDocument();
    expect(screen.getByText(/Optional proposer diagnostic/i)).toBeInTheDocument();
    expect(screen.getByText(/provider=mock/i)).toBeInTheDocument();
    expect(screen.getByText("mock-safe")).toBeInTheDocument();
    expect(screen.getByText(/Boundary: optional diagnostic only/i)).toBeInTheDocument();
    expect(screen.getByText(/does not change this readout/i)).toBeInTheDocument();
    expect(screen.getByText(/no automatic origin proof/i)).toBeInTheDocument();
    expect(screen.getByText(/no forced answer/i)).toBeInTheDocument();
  });

  it("labels raw JSON as collapsed audit payload, not the primary reading surface", () => {
    render(
      <RawJsonCard
        pretty={'{\n  "word": "study"\n}'}
        engineVersion="0.2.0-symbolic"
        onCopyFullJson={() => void 0}
      />
    );

    expect(screen.getByText("audit payload")).toBeInTheDocument();
    expect(screen.getByText("Raw Engine JSON")).toBeInTheDocument();
    expect(screen.getByText(/Use the readable cards first/i)).toBeInTheDocument();
    expect(screen.getByText("engine=0.2.0-symbolic")).toBeInTheDocument();
    expect(screen.getByText("collapsed")).toBeInTheDocument();
    expect(screen.getByText("Open JSON inspector")).toBeInTheDocument();
    expect(screen.getByText(/Boundary: raw audit payload only/i)).toBeInTheDocument();
    expect(screen.getByText(/readable cards remain the primary surface/i)).toBeInTheDocument();
    expect(screen.getByText(/no forced answer/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy Full JSON/i })).toBeInTheDocument();
  });
});
