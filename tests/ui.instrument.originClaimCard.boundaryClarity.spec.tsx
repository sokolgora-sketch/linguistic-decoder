import React from "react";
import { render, screen } from "@testing-library/react";
import { OriginClaimCard } from "@/components/OriginClaimCard";
import { INTERPRETATION_DECISION_POLICY_V0_1 } from "@/shared/openInstrument/interpretationDecisionPolicy.v0_1";

describe("OriginClaimCard boundary clarity", () => {
  it("frames OriginClaim as an observational inspection summary, not proof", () => {
    render(
      <OriginClaimCard
        originClaim={{
          schemaVersion: "open-instrument.origin-claim.v0_2",
          interpretationDecisionPolicy: INTERPRETATION_DECISION_POLICY_V0_1,
          userDecisionPosture: "user_decides",
          gatesActive: false,
          summary: { confidence: "weak", note: "inspection only" },
          candidates: [],
          meta: {},
        }}
      />
    );

    expect(screen.getByText("Origin Claim")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Observational claim summary for inspection only\. Multiple interpretations may coexist; no interpretation is selected automatically, and the user decides\. No historical proof is claimed\./i
      )
    ).toBeInTheDocument();
    expect(screen.getByText("Decision posture:")).toBeInTheDocument();
    const postureLabel = screen.getByText("Decision posture:");
    expect(postureLabel.parentElement?.textContent ?? "").toMatch(/multiple interpretations may coexist/i);
    expect(postureLabel.parentElement?.textContent ?? "").not.toMatch(/winner|no_single_winner/i);
    expect(screen.getByText("Gate diagnostics active:")).toBeInTheDocument();
    expect(screen.getByText("false")).toBeInTheDocument();
    expect(
      screen.getByText(
        /Boundary: observational summary only; no historical proof; no interpretation is selected automatically; the user decides\./i
      )
    ).toBeInTheDocument();
  });
});
