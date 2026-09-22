/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

type AnalyzeBody = Record<string, any>;

async function analyze(word: string): Promise<AnalyzeBody> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

describe("Open Instrument Seven-Voices doctrine reading UI v0.1", () => {
  it("transports the public doctrineReading object without recomputing it", async () => {
    const body = await analyze("study");
    const vm = adaptAnalysisToTelemetryVM(body);

    expect(vm.doctrineReading.kind).toBe("present");
    if (vm.doctrineReading.kind !== "present" || vm.doctrineReading.value === null) return;

    expect(vm.doctrineReading.value.analyzedVoicePath).toEqual(
      body.doctrineReading.analyzedVoicePath,
    );
    expect(vm.doctrineReading.value.entries.map((entry) => entry.voice)).toEqual(["U", "Y"]);
    expect(vm.doctrineReading.value.entries.map((entry) => entry.pathIndex)).toEqual([0, 1]);
  });

  it("keeps absent, malformed, and structural Null doctrine states distinct", () => {
    expect(adaptAnalysisToTelemetryVM({ word: "x" }).doctrineReading).toEqual({
      kind: "missing",
      missing: "not_emitted",
      note: "doctrineReading",
    });
    expect(adaptAnalysisToTelemetryVM({ word: "x", doctrineReading: "bad" }).doctrineReading).toEqual({
      kind: "missing",
      missing: "malformed",
      note: "doctrineReading expected the public V1 shape",
    });
    expect(adaptAnalysisToTelemetryVM({ word: "123", doctrineReading: null }).doctrineReading).toEqual({
      kind: "present",
      value: null,
    });
  });

  it("renders malformed doctrine output as a visible contract error", () => {
    render(<InstrumentPanel payload={{ word: "x", doctrineReading: "bad" }} />);

    expect(screen.getByTestId("doctrine-reading-malformed")).toBeVisible();
    expect(screen.getByText("Seven-Voices doctrinal reading unavailable")).toBeVisible();
    expect(screen.queryByTestId("doctrine-reading-card")).not.toBeInTheDocument();
  });

  it("rejects unknown doctrine property identifiers", async () => {
    const body = await analyze("study");
    const malformed = JSON.parse(JSON.stringify(body)) as AnalyzeBody;
    malformed.doctrineReading.entries[0].functionalProperties[0].id = "invented_property";

    expect(adaptAnalysisToTelemetryVM(malformed).doctrineReading).toEqual({
      kind: "missing",
      missing: "malformed",
      note: "doctrineReading expected the public V1 shape",
    });
  });

  it("renders doctrine reading for wind independently of Evidence Null", async () => {
    const body = await analyze("wind");
    expect(body.analysisStatusV0_1.status).toBe("null_no_supported_candidate");
    expect(body.candidates).toEqual([]);
    expect(body.doctrineReading).not.toBeNull();

    render(<InstrumentPanel payload={body} />);

    expect(screen.getByTestId("doctrine-reading-card")).toBeVisible();
    expect(screen.getByText("Seven-Voices doctrinal reading")).toBeVisible();
    expect(screen.getAllByText("No supported functional candidate yet.")).toHaveLength(2);
  });

  it("preserves three repeated A entries for banana", async () => {
    const body = await analyze("banana");
    expect(body.doctrineReading.analyzedVoicePath).toEqual(["A", "A", "A"]);

    render(<InstrumentPanel payload={body} />);

    const card = screen.getByTestId("doctrine-reading-card");
    expect(within(card).getByTestId("doctrine-reading-path")).toHaveTextContent("A → A → A");
    const entries = within(card).getAllByTestId("doctrine-reading-entry");
    expect(entries).toHaveLength(3);
    expect(entries.map((entry) => entry.getAttribute("data-path-index"))).toEqual(["0", "1", "2"]);
    expect(entries.map((entry) => entry.getAttribute("data-voice"))).toEqual(["A", "A", "A"]);
  });

  it("preserves multi-Voice input order, Y, boundaries, and existing candidate evidence", async () => {
    const body = await analyze("study");
    expect(body.doctrineReading.analyzedVoicePath).toEqual(["U", "Y"]);

    render(<InstrumentPanel payload={body} />);

    const card = screen.getByTestId("doctrine-reading-card");
    const entries = within(card).getAllByTestId("doctrine-reading-entry");
    expect(entries.map((entry) => entry.getAttribute("data-voice"))).toEqual(["U", "Y"]);
    expect(within(card).getByText("Containment/Depth")).toBeInTheDocument();
    expect(within(card).getByText("Reflection/Mirror")).toBeInTheDocument();
    expect(within(card).getByText(/not a lexical definition, historical origin claim, candidate proof, or winner selection/i)).toBeInTheDocument();
    expect(within(card).getByText(/User decides the final interpretation/i)).toBeInTheDocument();
    expect(screen.getAllByText("Evidence: Reviewed")).toHaveLength(2);
  });

  it("does not fabricate a doctrine card for the structural Null case 123", async () => {
    const body = await analyze("123");
    expect(body.doctrineReading).toBeNull();

    render(<InstrumentPanel payload={body} />);

    expect(screen.queryByTestId("doctrine-reading-card")).not.toBeInTheDocument();
  });
});
