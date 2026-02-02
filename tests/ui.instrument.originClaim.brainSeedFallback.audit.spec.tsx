import React from "react";
import { render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

function makePayload(overrides: any = {}) {
  const base = {
    word: "hope",
    sanitized: "hope",
    engineVersion: "0.2.0-symbolic",
    mode: "strict",
    alphabet: "auto",
    meta: {
      version: "0.2.0-symbolic",
      created: "2026-02-02T00:00:00.000Z",
      inputs: {},
    },
    heart: {
      word: "hope",
      engineVersion: "0.2.0-symbolic",
      mode: "strict",
      alphabet: "auto",
      math7: {
        primary: {
          cycleState: "open",
          totalMod7: 4,
          principlesPath: ["BALANCE", "EXPANSION"],
          basis: "OE",
          vowels: ["O", "E"],
          indices0to6: [3, 1],
          sum0to6: 4,
          values1to7: [4, 2],
          rawSum1to7: 6,
          total1to7: 5,
          indices: [3, 1],
          sum: 4,
        },
      },
      principlePath: ["BALANCE", "EXPANSION"],
      narrative: "Word hope follows stable balance.",
    },
    originClaim: {
      version: "v1",
      policy: "no_single_winner",
      support: { claimId: "oc:hope", refs: ["ref:heart.math7.primary"] },
      candidates: [],
      summary: {
        confidence: "insufficient_evidence",
        note: "No passing candidates with sufficient computed support in the current result layers.",
      },
      meta: {
        engineVersion: "0.2.0-symbolic",
        generatedAt: "2026-02-02T00:00:00.000Z",
        inputs: {
          word: "hope",
          mode: "strict",
          alphabet: "auto",
        },
      },
    },
  };

  return {
    ...base,
    ...overrides,
  };
}

describe("ui: OriginClaimCard brain seed fallback audit", () => {
  it("renders Brain seed fallback line when enabled and brainCandidates present", () => {
    const payload = makePayload({
      meta: {
        version: "0.2.0-symbolic",
        created: "2026-02-02T00:00:00.000Z",
        inputs: { brainCandidatesSeedFallback: true },
      },
      originClaim: {
        version: "v1",
        policy: "no_single_winner",
        support: { claimId: "oc:hope", refs: ["ref:heart.math7.primary"] },
        candidates: [],
        summary: {
          confidence: "insufficient_evidence",
          note: "No passing candidates with sufficient computed support in the current result layers.",
        },
        meta: {
          engineVersion: "0.2.0-symbolic",
          generatedAt: "2026-02-02T00:00:00.000Z",
          inputs: {
            word: "hope",
            mode: "strict",
            alphabet: "auto",
            brainCandidatesSeedFallback: true,
            brainCandidates: [{ v: "brain.candidateRecord.v0.1", source: { kind: "SEED" } }],
          },
        },
      },
    });

    render(<InstrumentPanel payload={payload as any} />);

    expect(screen.getByText("Brain seed fallback:")).toBeTruthy();
    expect(screen.getByText("ON")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
  });

  it("does not render Brain seed fallback line when disabled/absent", () => {
    const payload = makePayload();
    render(<InstrumentPanel payload={payload as any} />);

    expect(screen.queryByText("Brain seed fallback:")).toBeNull();
  });
});
