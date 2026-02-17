import React from "react";
import { render, screen } from "@testing-library/react";
import { OracleProposeWithEngineOracleCardV01 } from "../src/ui/instrument/sections/OracleProposeWithEngineOracleCard.v0.1";

describe("OracleProposeWithEngineOracleCard v0.1", () => {
  test("renders (no fetch)", () => {
    render(
      <OracleProposeWithEngineOracleCardV01
        word="study"
        mode="strict"
        onCopy={() => void 0}
      />
    );

    expect(screen.getByText(/Propose with Engine Oracle/i)).toBeTruthy();
    expect(screen.getByRole("button", { name: /Run oracle proposal/i })).toBeTruthy();
  });
});
