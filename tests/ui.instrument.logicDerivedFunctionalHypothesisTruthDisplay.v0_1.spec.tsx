/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import { buildCandidateRowsFromVM } from "../src/ui/candidates/candidateModel";
import { CandidatesAccordion } from "../src/ui/candidates/CandidatesAccordion";

describe("logic-derived functional hypothesis UI boundary v0.1", () => {
  it("labels the row as a hypothesis and shows the explicit target sense", async () => {
    const response = await GET(
      new Request(
        "http://localhost/api/analyze-v1?word=sterile&mode=strict&targetSenseId=bounded_functional_sense&targetSenseLabel=bounded%20functional%20sense",
      ),
    );

    const vm = adaptAnalysisToTelemetryVM(await response.json());
    const rows = buildCandidateRowsFromVM(vm);

    render(<CandidatesAccordion rows={rows} />);

    expect(
      screen.getAllByText("Logic-derived functional hypothesis"),
    ).toHaveLength(2);
    expect(
      screen.getAllByText("Target sense: bounded functional sense"),
    ).toHaveLength(2);
    expect(
      screen.getAllByText(
        "Functional bridge: Hypothesis only; no source-backed evidence",
      ),
    ).toHaveLength(2);
  });
});
