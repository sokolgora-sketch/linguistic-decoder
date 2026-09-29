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
      "Ë → I",
      "Doctrinal inference: harmonious resolution with clear understanding",
      "Reviewed functional evidence is available.",
    ],
    [
      "damage",
      "No canonical Voice path was detected",
      "No doctrinal reading was emitted.",
      "Reviewed functional evidence is available.",
    ],
    [
      "sea",
      "I",
      "Per-Voice doctrine is available",
      "A structural hypothesis is available",
    ],
    [
      "stone",
      "O → U",
      "Doctrinal inference: balanced mediation with grounded depth",
      "An exploratory candidate is available",
    ],
    [
      "rain",
      "E → I",
      "Doctrinal inference: expanding growth with clear understanding",
      "Lexical source evidence remains available separately",
    ],
    [
      "ea",
      "No canonical Voice path was detected",
      "No doctrinal reading was emitted.",
      "No structural Voice path was detected",
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
    ["mother", "Ë → Ë"],
    ["rain", "E → I"],
  ])(
    "labels the spoken canonical path separately from orthographic vowels for %s",
    async (word, spokenPath) => {
      const body = await analyze(word);

      expect(body.primaryPath.voicePath.join(" → ")).toBe(spokenPath);
      expect(body.doctrineReading.analyzedVoicePath.join(" → ")).toBe(spokenPath);

      render(<InstrumentPanel payload={body} />);

      const orientation = screen.getByTestId("primary-reading-orientation-card");
      expect(within(orientation).getByText("Spoken / canonical Voice path:")).toBeVisible();
      expect(within(orientation).getByTestId("orientation-structure")).toHaveTextContent(
        spokenPath,
      );

      const doctrine = screen.getByTestId("doctrine-reading-card");
      expect(within(doctrine).getByTestId("doctrine-reading-path-label")).toHaveTextContent(
        "Spoken / canonical Voice path used for doctrine",
      );
      expect(within(doctrine).getByTestId("doctrine-reading-path")).toHaveTextContent(
        spokenPath,
      );
    },
  );

  it.each([
    ["damage", "A → A → E", "Reviewed functional motivation"],
    ["mother", "O → E", "No supported word-specific functional motivation yet."],
    ["stone", "O → E", "No supported word-specific functional motivation yet."],
    ["father", "A → E", "Reviewed functional motivation"],
    ["water", "A → E", "No supported word-specific functional motivation yet."],
  ])(
    "keeps path layers and word-specific authority separate for %s",
    async (word, orthographicPath, functionalDepth) => {
      const body = await analyze(word);
      render(<InstrumentPanel payload={body} />);

      const timeline = screen
        .getAllByText("Voice Path Layers")[0]
        .closest("div.rounded-xl");

      expect(timeline).not.toBeNull();
      expect(within(timeline!).getByText("Spoken / canonical Voice path")).toBeVisible();
      expect(within(timeline!).getByText("Orthographic vowel sequence (non-authoritative)")).toBeVisible();
      expect(within(timeline!).getByText("Functional / normalization path")).toBeVisible();
      expect(within(timeline!).getAllByText(orthographicPath).length).toBeGreaterThan(0);

      const depth = screen.getAllByTestId("word-specific-functional-depth")[0];
      expect(within(depth).getByText(functionalDepth)).toBeVisible();
      expect(screen.getAllByText(/functional \/ normalization paths and candidate \/ structural paths are separate from word-specific functional motivation/i).length).toBeGreaterThan(0);
    },
  );

  it("keeps structural absence distinct from evidence absence for 123", async () => {
    const body = await analyze("123");
    render(<InstrumentPanel payload={body} />);

    const card = screen.getByTestId("primary-reading-orientation-card");
    expect(within(card).getByText("Spoken / canonical Voice path:")).toBeVisible();
    expect(within(card).getByTestId("orientation-structure")).toHaveTextContent("No canonical Voice path was detected");
    expect(within(card).getByTestId("orientation-doctrine")).toHaveTextContent(
      "No doctrinal reading was emitted.",
    );
    expect(within(card).getByTestId("orientation-evidence")).toHaveTextContent(
      "No structural Voice path was detected, so no structural reading is established.",
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
