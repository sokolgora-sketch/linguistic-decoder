/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";
import type { TelemetryViewModel } from "@/ui/telemetry/types";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

const missing = {
  kind: "missing" as const,
  missing: "not_emitted" as const,
};

function present<T>(value: T) {
  return { kind: "present" as const, value };
}

function vmWithMissingPaths(): TelemetryViewModel {
  return {
    readout: {
      word: "study",
      normalizedWord: present("study"),
      mode: present("strict"),
      strictInput: present(true),
      engineVersion: present("0.2.0-symbolic"),
      alphabet: present("auto"),
      createdAt: missing,
      principlesPath: missing,
      phoneticIpaV0_1: missing,
      voicePath: missing,
      voicePathSurface: missing,
      voicePathFunctional: missing,
      voicePathDelta: "NOT_EMITTED",
      status: "none",
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
    originClaimGates: {
      active: false,
      flag: "ocg",
      candidateCount: 0,
      reasonCounts: {},
    },
    originClaim: missing,
    rootMap: missing,
    soundRoots: missing,
    resonanceProfileV1: missing,
    raw: null,
  };
}

async function analyze(word: string): Promise<unknown> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

describe("Open Instrument Overview vowel-path visibility v0.1", () => {
  it("shows the VM-backed comparison in the default Overview for a successful analysis", async () => {
    render(<InstrumentPanel payload={await analyze("study")} />);

    const overview = screen.getByRole("tabpanel");
    const functionalCard = within(overview).getByTestId("functional-motivation-card");
    const timelineHeading = within(overview).getByText(
      "Vowel Path Timeline (Detected vs Interpreted)",
    );
    const timeline = timelineHeading.closest("div.rounded-xl");

    expect(timeline).not.toBeNull();

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(timelineHeading).toBeVisible();
    expect(within(timeline!).getByText("Detected")).toBeVisible();
    expect(within(timeline!).getByText("Surface")).toBeVisible();
    expect(within(timeline!).getByText("Functional")).toBeVisible();
    expect(within(timeline!).getByText("DIVERGE")).toBeVisible();
    expect(within(timeline!).getAllByText("U → Y").length).toBe(3);
    expect(within(timeline!).getByText("U → I")).toBeVisible();
    expect(functionalCard.compareDocumentPosition(timelineHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.getByTestId("deterministic-details")).not.toHaveAttribute(
      "open",
    );
  });

  it("preserves the existing not-emitted behavior for missing VM paths", () => {
    render(<InstrumentPanel vm={vmWithMissingPaths()} />);

    const overview = screen.getByRole("tabpanel");

    expect(
      within(overview).getByText("Vowel Path Timeline (Detected vs Interpreted)"),
    ).toBeVisible();
    expect(within(overview).getByText("NOT EMITTED")).toBeVisible();
    expect(within(overview).getByText("No detected voice path.")).toBeVisible();
    expect(within(overview).getAllByText("not emitted").length).toBeGreaterThanOrEqual(3);
  });
});
