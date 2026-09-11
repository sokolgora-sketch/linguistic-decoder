/** @jest-environment jsdom */

import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";

import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";
import type { TelemetryViewModel } from "@/ui/telemetry/types";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

const missing = {
  kind: "missing" as const,
  missing: "not_emitted" as const,
};

const claimBoundary = {
  historicalOriginClaim: "not_claimed" as const,
  historicalTransmissionClaim: "not_claimed" as const,
  winnerClaim: "not_claimed" as const,
  languageSuperiorityClaim: "not_claimed" as const,
  linguisticOwnershipClaim: "not_claimed" as const,
  candidateTruthClaim: "not_claimed" as const,
  structuralOutputIsCandidateTruth: false as const,
  nullIsValid: true as const,
};

function statusValue(
  status:
    | "reviewed_functional_evidence"
    | "research_functional_hypothesis"
    | "candidate_only"
    | "structural_unreviewed"
    | "null_no_supported_candidate",
) {
  return {
    kind: "present" as const,
    value: {
      schemaVersion: "open-instrument.analysis-status.v0_1" as const,
      status,
      summary:
        status === "null_no_supported_candidate"
          ? "No supported canonical candidate or reviewed functional evidence is available. Null is a valid result."
          : "Status remains bounded to its existing contract.",
      reviewedOperators: [],
      candidateOnlyOperators: [],
      researchHypothesisEmbryos: [],
      structuralTokens: [],
      claimBoundary,
      userDecisionPosture: "user_decides" as const,
    },
  };
}

function unknownCandidate() {
  return {
    index: 0,
    id: "unknown-candidate",
    language: missing,
    form: missing,
    status: { kind: "present" as const, value: "unknown" as const },
    sourceKind: missing,
    functionalStatement: missing,
    vowelPath: missing,
    deepRootHeartGate: missing,
    decomposition: missing,
    ops: missing,
    notes: missing,
    signals: missing,
    raw: {},
  };
}

function vmFixture(
  overrides: Partial<TelemetryViewModel> = {},
): TelemetryViewModel {
  return {
    readout: {
      word: "saved",
      normalizedWord: { kind: "present", value: "saved" },
      mode: { kind: "present", value: "strict" },
      strictInput: { kind: "present", value: true },
      engineVersion: { kind: "present", value: "0.2.0-symbolic" },
      alphabet: { kind: "present", value: "auto" },
      createdAt: missing,
      principlesPath: missing,
      phoneticIpaV0_1: missing,
      voicePath: { kind: "present", value: ["U", "I"] },
      voicePathSurface: { kind: "present", value: ["U", "I"] },
      voicePathFunctional: { kind: "present", value: ["U", "I"] },
      voicePathDelta: "MATCH",
      status: "detected",
      counts: {
        candidates: 0,
        ops: missing,
        notes: missing,
        signals: missing,
        rejections: missing,
      },
    },
    evidence: {
      normalizationSteps: missing,
      ops: missing,
      notes: missing,
      signals: missing,
    },
    candidates: [],
    math: missing,
    rejections: { items: missing },
    originClaimGates: { active: false, flag: "ocg", candidateCount: 0, reasonCounts: {} },
    originClaim: missing,
    rootMap: missing,
    soundRoots: missing,
    resonanceProfileV1: missing,
    raw: null,
    ...overrides,
  };
}

function visibleOverview() {
  return screen.getByRole("tabpanel");
}

describe("Open Instrument canonical Null primary readout v0.1", () => {
  it("shows canonical Null prominently in Overview with its existing boundary copy", () => {
    render(
      <InstrumentPanel
        vm={vmFixture({ analysisStatusV0_1: statusValue("null_no_supported_candidate") })}
      />,
    );

    const overview = visibleOverview();
    expect(
      within(overview).getByRole("heading", { name: "Null — no supported candidate" }),
    ).toBeVisible();
    expect(
      within(overview).getByText(/Null is a valid result/i),
    ).toBeVisible();
    expect(within(overview).getByText(/candidate-truth claim/i)).toBeVisible();
    expect(within(overview).getByText(/User decides/i)).toBeVisible();
  });

  it.each([
    "reviewed_functional_evidence",
    "research_functional_hypothesis",
    "candidate_only",
    "structural_unreviewed",
  ] as const)("does not present %s as analytical Null", (status) => {
    render(<InstrumentPanel vm={vmFixture({ analysisStatusV0_1: statusValue(status) })} />);

    expect(
      within(visibleOverview()).queryByRole("heading", {
        name: "Null — no supported candidate",
      }),
    ).not.toBeInTheDocument();
  });

  it("keeps structural-only status in the hypothesis-only boundary", () => {
    render(
      <InstrumentPanel
        vm={vmFixture({ analysisStatusV0_1: statusValue("structural_unreviewed") })}
      />,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Advanced" }));

    expect(
      screen.getByRole("heading", { name: "Hypothesis — structural, unreviewed" }),
    ).toBeVisible();
    expect(
      within(screen.getByRole("tabpanel")).getByText(
        /Structural output is not candidate truth/i,
      ),
    ).toBeVisible();
  });

  it("exposes candidate-only status in the primary hierarchy without promotion", () => {
    render(
      <InstrumentPanel
        vm={vmFixture({ analysisStatusV0_1: statusValue("candidate_only") })}
      />,
    );

    const overview = visibleOverview();
    expect(
      within(overview).getByRole("heading", { name: "Candidate only" }),
    ).toBeVisible();
    expect(within(overview).getByText(/candidate-truth claim/i)).toBeVisible();
  });

  it.each([
    { kind: "missing" as const, missing: "not_emitted" as const },
    { kind: "missing" as const, missing: "malformed" as const },
  ])("does not convert $missing analysis status into Null", (analysisStatusV0_1) => {
    render(<InstrumentPanel vm={vmFixture({ analysisStatusV0_1 })} />);

    expect(
      within(visibleOverview()).queryByTestId("primary-analysis-status"),
    ).not.toBeInTheDocument();

    expect(
      within(visibleOverview()).queryByRole("heading", {
        name: "Null — no supported candidate",
      }),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Advanced" }));
    expect(screen.getByText("Status not emitted.")).toBeVisible();
  });

  it("does not infer analytical Null from candidate unknown or readout none", () => {
    const vm = vmFixture({
      analysisStatusV0_1: statusValue("candidate_only"),
      candidates: [unknownCandidate()],
    });
    vm.readout.status = "none";

    render(<InstrumentPanel vm={vm} />);

    expect(
      within(visibleOverview()).queryByRole("heading", {
        name: "Null — no supported candidate",
      }),
    ).not.toBeInTheDocument();
  });

  it("returns to Overview when a canonical Null arrives while Advanced is open", () => {
    const initial = vmFixture({ analysisStatusV0_1: statusValue("candidate_only") });
    const { rerender } = render(<InstrumentPanel vm={initial} />);

    fireEvent.click(screen.getByRole("tab", { name: "Advanced" }));
    expect(screen.getByRole("tab", { name: "Advanced" })).toHaveAttribute(
      "aria-selected",
      "true",
    );

    rerender(
      <InstrumentPanel
        vm={vmFixture({ analysisStatusV0_1: statusValue("null_no_supported_candidate") })}
      />,
    );

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(
      within(visibleOverview()).getByRole("heading", {
        name: "Null — no supported candidate",
      }),
    ).toBeVisible();
  });
});
