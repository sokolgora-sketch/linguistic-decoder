/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

async function analyze(word: string): Promise<Record<string, any>> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

describe("Open Instrument primary reading orientation card v0.1", () => {
  it.each([
    [
      "study",
      "U → Y",
      "Doctrinal inference: grounded depth with reflective exploration",
      "Reviewed functional evidence is available.",
    ],
    [
      "damage",
      "A → E",
      "the current whole-path Level-3 law applies only to exact two-distinct-Voice paths",
      "Reviewed functional evidence is available.",
    ],
    [
      "sea",
      "E → A",
      "Doctrinal inference: expanding growth with initiating beginning",
      "A structural hypothesis is available",
    ],
    [
      "stone",
      "O → E",
      "Doctrinal inference: balanced mediation with expanding growth",
      "An exploratory candidate is available",
    ],
    [
      "rain",
      "A → Ë",
      "Doctrinal inference: initiating beginning with clear understanding",
      "Lexical source evidence remains available separately",
    ],
    [
      "ea",
      "E → A",
      "Doctrinal inference: expanding growth with initiating beginning",
      "No supported functional candidate is established",
    ],
  ])(
    "summarizes the existing emitted state for %s without recomputing it",
    async (word, structure, doctrine, evidence) => {
      const body = await analyze(word);
      render(<InstrumentPanel payload={body} />);

      const card = screen.getByTestId("primary-reading-orientation-card");
      expect(within(card).getByTestId("orientation-structure")).toHaveTextContent(
        structure,
      );
      expect(within(card).getByTestId("orientation-doctrine")).toHaveTextContent(
        doctrine,
      );
      expect(within(card).getByTestId("orientation-evidence")).toHaveTextContent(
        evidence,
      );
      expect(card).not.toHaveTextContent(
        /reviewed_functional_evidence|research_functional_hypothesis|candidate_only|structural_unreviewed|null_no_supported_candidate/,
      );
    },
  );

  it.each([
    ["mother", "E → E", "O → E"],
    ["rain", "A → Ë", "A → I"],
  ])(
    "labels the engine-selected and Heart-surface paths separately for %s",
    async (word, primaryPath, doctrinePath) => {
      const body = await analyze(word);

      expect(body.primaryPath.voicePath.join(" → ")).toBe(primaryPath);
      expect(body.doctrineReading.analyzedVoicePath.join(" → ")).toBe(doctrinePath);
      expect(body.primaryPath.voicePath).not.toEqual(
        body.doctrineReading.analyzedVoicePath,
      );

      render(<InstrumentPanel payload={body} />);

      const orientation = screen.getByTestId("primary-reading-orientation-card");
      expect(within(orientation).getByText("Engine-selected Voice path:")).toBeVisible();
      expect(within(orientation).getByTestId("orientation-structure")).toHaveTextContent(
        primaryPath,
      );

      const doctrine = screen.getByTestId("doctrine-reading-card");
      expect(within(doctrine).getByTestId("doctrine-reading-path-label")).toHaveTextContent(
        "Heart surface Voice path used for doctrine",
      );
      expect(within(doctrine).getByTestId("doctrine-reading-path")).toHaveTextContent(
        doctrinePath,
      );
    },
  );

  it("keeps structural absence distinct from evidence absence for 123", async () => {
    const body = await analyze("123");
    render(<InstrumentPanel payload={body} />);

    const card = screen.getByTestId("primary-reading-orientation-card");
    expect(within(card).getByText("Engine-selected Voice path:")).toBeVisible();
    expect(within(card).getByTestId("orientation-structure")).toHaveTextContent("O");
    expect(within(card).getByTestId("orientation-doctrine")).toHaveTextContent(
      "No doctrinal reading was emitted.",
    );
    expect(within(card).getByTestId("orientation-evidence")).toHaveTextContent(
      "No supported functional candidate is established; structural and evidence states remain separate.",
    );
  });

  it("preserves malformed doctrine as a contract error instead of ordinary absence", () => {
    render(<InstrumentPanel payload={{ word: "x", doctrineReading: "bad" }} />);

    const card = screen.getByTestId("primary-reading-orientation-card");
    expect(within(card).getByTestId("orientation-doctrine")).toHaveTextContent(
      "The doctrinal reading is malformed; see the detailed contract error below.",
    );
    expect(screen.getByTestId("doctrine-reading-malformed")).toBeVisible();
  });

  it.each(["mountain", "banana"])(
    "explains why %s has no authorized whole-path Level-3 reading without inventing one",
    async (word) => {
      const body = await analyze(word);
      render(<InstrumentPanel payload={body} />);

      const card = screen.getByTestId("primary-reading-orientation-card");
      expect(within(card).getByTestId("orientation-doctrine")).toHaveTextContent(
        "whole-path Level-3 law applies only to exact two-distinct-Voice paths",
      );
      expect(within(card).getByTestId("orientation-doctrine")).not.toHaveTextContent(
        /Doctrinal inference:/,
      );
    },
  );

  it("keeps the detailed doctrine and evidence surfaces below the orientation summary", async () => {
    const body = await analyze("study");
    render(<InstrumentPanel payload={body} />);

    const orientation = screen.getByTestId("primary-reading-orientation-card");
    expect(screen.getByTestId("doctrine-reading-card")).toBeVisible();
    expect(screen.getAllByTestId("functional-motivation-card").length).toBeGreaterThan(0);
    expect(within(orientation).getByTestId("orientation-boundary")).toHaveTextContent(
      /No historical origin.*No single selection is made.*You decide/i,
    );
  });

  it("does not expose internal status or trace labels in the orientation card", async () => {
    const body = await analyze("study");
    render(<InstrumentPanel payload={body} />);

    const card = screen.getByTestId("primary-reading-orientation-card");
    expect(card).not.toHaveTextContent(
      /validationOutcome|rankGroup|sourceKind|evidenceRefs|schemaVersion|analysis-status/i,
    );
  });
});
