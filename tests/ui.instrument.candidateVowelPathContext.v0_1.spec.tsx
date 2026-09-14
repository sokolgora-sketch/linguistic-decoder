/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { CandidatesAccordion } from "../src/ui/candidates/CandidatesAccordion";
import { buildCandidateRowsFromVM } from "../src/ui/candidates/candidateModel";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";

type AnyRecord = Record<string, any>;

async function analyzeStudy(): Promise<AnyRecord> {
  const response = await GET(
    new Request(
      "http://localhost/api/analyze-v1?word=study&mode=strict",
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function candidateRows(body: AnyRecord) {
  return buildCandidateRowsFromVM(adaptAnalysisToTelemetryVM(body));
}

function rowElement(candidateId: string): HTMLElement {
  const button = document.querySelector<HTMLButtonElement>(
    `button[data-candidate-id="${candidateId}"]`,
  );
  expect(button).toBeInTheDocument();
  expect(button?.parentElement).toBeTruthy();
  return button?.parentElement as HTMLElement;
}

describe("Open Instrument candidate vowel path context v0.1", () => {
  it("labels the emitted candidate-owned path without changing its value", async () => {
    const body = await analyzeStudy();
    const rows = candidateRows(body);
    const pathRow = rows.find((row) => row.vowelPath);

    expect(pathRow?.vowelPath).toBeTruthy();
    render(<CandidatesAccordion rows={rows} />);

    expect(
      within(rowElement(pathRow?.id ?? "")).getByText(
        `Candidate vowel path: ${pathRow?.vowelPath}`,
        { exact: true },
      ),
    ).toBeInTheDocument();
  });

  it("preserves candidate ownership and row order for distinct paths", async () => {
    const body = await analyzeStudy();
    const rows = candidateRows(body);

    expect(rows.length).toBeGreaterThanOrEqual(2);
    const ownedRows = [
      { ...rows[0], id: "candidate-path-a", vowelPath: "U-I" },
      { ...rows[1], id: "candidate-path-b", vowelPath: "A-E" },
    ];

    render(<CandidatesAccordion rows={ownedRows} />);

    const first = rowElement("candidate-path-a");
    const second = rowElement("candidate-path-b");
    expect(within(first).getByText("Candidate vowel path: U-I", { exact: true })).toBeInTheDocument();
    expect(within(first).queryByText("Candidate vowel path: A-E", { exact: true })).not.toBeInTheDocument();
    expect(within(second).getByText("Candidate vowel path: A-E", { exact: true })).toBeInTheDocument();
    expect(within(second).queryByText("Candidate vowel path: U-I", { exact: true })).not.toBeInTheDocument();
    expect(document.querySelectorAll('button[data-candidate-id="candidate-path-a"]')[0]).toBeTruthy();
    expect(document.querySelectorAll('button[data-candidate-id="candidate-path-b"]')[0]).toBeTruthy();
  });

  it("renders an explicit missing state without borrowing the run-level path", async () => {
    const body = await analyzeStudy();
    const vm = adaptAnalysisToTelemetryVM(body);
    expect(vm.readout.voicePathFunctional).toEqual({
      kind: "present",
      value: ["U", "I"],
    });

    const rows = buildCandidateRowsFromVM(vm);
    expect(rows[0]).toBeDefined();
    const missingPathRow = { ...rows[0], id: "candidate-path-missing", vowelPath: null };

    render(<CandidatesAccordion rows={[missingPathRow]} />);

    const row = rowElement("candidate-path-missing");
    expect(
      within(row).getByText("Candidate vowel path: not emitted", { exact: true }),
    ).toBeInTheDocument();
    expect(within(row).queryByText("Candidate vowel path: U-I", { exact: true })).not.toBeInTheDocument();
  });

  it("keeps long candidate paths wrapped in the existing chip layout", () => {
    render(
      <CandidatesAccordion
        rows={[
          {
            id: "candidate-path-long",
            language: "test",
            form: "long-path",
            vowelPath: "A-E-I-O-U-Y-Ë-A-E-I-O-U-Y-Ë",
            raw: { id: "candidate-path-long" },
          },
        ]}
      />
    );

    const label = screen.getByText(
      "Candidate vowel path: A-E-I-O-U-Y-Ë-A-E-I-O-U-Y-Ë",
      { exact: true },
    );
    expect(label).toHaveClass("break-all");
  });
});
