import React from "react";
import { render, screen } from "@testing-library/react";
import { OriginClaimCard } from "@/components/OriginClaimCard";

describe("OriginClaimCard boundary clarity", () => {
  it("frames OriginClaim as an observational inspection summary, not proof", () => {
    render(
      <OriginClaimCard
        originClaim={{
          policy: "no_single_winner",
          gatesActive: false,
          summary: { confidence: "weak", note: "inspection only" },
          candidates: [],
        }}
      />
    );

    expect(screen.getByText("Origin Claim")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Observational claim summary for inspection only\. No historical proof, no forced answer, and the final decision stays with the user\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Decision posture:")).toBeInTheDocument();
    const postureLabel = screen.getByText("Decision posture:");
    expect(postureLabel.parentElement?.textContent ?? "").toMatch(/no forced answer/i);
    expect(screen.getByText("Gate diagnostics active:")).toBeInTheDocument();
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Boundary: observational summary only; no historical proof; no forced answer; user decides\./i
      )
    ).toBeInTheDocument();
  });
});
