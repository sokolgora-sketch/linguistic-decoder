/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";
import type { TelemetryViewModel } from "@/ui/telemetry/types";
import { openInstrumentOverviewDetails } from "./helpers/openInstrumentOverviewDetails";

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
  it("shows the VM-backed comparison when Overview details are opened", async () => {
    render(<InstrumentPanel payload={await analyze("study")} />);
    openInstrumentOverviewDetails();

    const overview = screen.getByRole("tabpanel");
    const functionalCard = within(overview).getByTestId("functional-motivation-card");
    const timelineHeading = within(overview).getByText("Voice paths");
    const timeline = timelineHeading.closest("div.rounded-xl");

    expect(timeline).not.toBeNull();

    expect(screen.getByRole("tab", { name: "Overview" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(timelineHeading).toBeVisible();
    expect(within(timeline!).getByText("Detected Voice sequence")).toBeVisible();
    expect(within(timeline!).getByText("Written vowel sequence")).toBeVisible();
    expect(within(timeline!).getByText("Functional or normalized sequence")).toBeVisible();
    expect(within(timeline!).getByText("Paths differ")).toBeVisible();
    expect(within(timeline!).getAllByText("Ë → I").length).toBe(1);
    expect(within(timeline!).getByText("U → Y")).toBeVisible();
    expect(within(timeline!).getByText("U → I")).toBeVisible();
    expect(within(timeline!).queryByText("DIVERGE")).not.toBeInTheDocument();
    expect(functionalCard.compareDocumentPosition(timelineHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(screen.getByTestId("deterministic-details")).not.toHaveAttribute(
      "open",
    );
  });

  it("shows unavailable paths in plain language while retaining VM missing states elsewhere", () => {
    render(<InstrumentPanel vm={vmWithMissingPaths()} />);
    openInstrumentOverviewDetails();

    const overview = screen.getByRole("tabpanel");

    expect(
      within(overview).getByText("Voice paths"),
    ).toBeVisible();
    const timeline = within(overview).getByText("Voice paths").closest("div.rounded-xl");
    expect(timeline).not.toBeNull();
    expect(within(timeline!).getByText("Comparison unavailable")).toBeVisible();
    expect(within(timeline!).getAllByText("Not available")).toHaveLength(3);
    expect(within(timeline!).queryByText("NOT EMITTED")).not.toBeInTheDocument();
    expect(within(timeline!).queryByText("not_emitted")).not.toBeInTheDocument();
  });
});
