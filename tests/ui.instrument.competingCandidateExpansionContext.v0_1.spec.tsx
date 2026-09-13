/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "../app/api/analyze-v1/route";
import { CandidatesAccordion } from "../src/ui/candidates/CandidatesAccordion";
import { buildCandidateRowsFromVM } from "../src/ui/candidates/candidateModel";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";

type AnyRecord = Record<string, any>;

async function analyze(word: string): Promise<AnyRecord> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function compositionCandidate(body: AnyRecord): AnyRecord {
  return body.candidates.find(
    (candidate: AnyRecord) =>
      candidate?.candidateId === "rootmap-composition:sq:shtu+di",
  );
}

describe("Open Instrument competing candidate expansion context v0.1", () => {
  it("projects and renders the emitted study expansion chain in order", async () => {
    const body = await analyze("study");
    const composition = compositionCandidate(body);

    expect(composition?.expansionChain).toEqual([
      "SHTU",
      "DI",
      "STUDY",
    ]);

    const vm = adaptAnalysisToTelemetryVM(body);
    const vmRow = vm.candidates.find(
      (candidate) => candidate.id === composition.candidateId,
    );

    expect(vmRow?.expansionChain).toEqual({
      kind: "present",
      value: ["SHTU", "DI", "STUDY"],
    });

    const rows = buildCandidateRowsFromVM(vm);
    const uiRow = rows.find((candidate) => candidate.id === composition.candidateId);

    expect(uiRow?.expansionChain).toEqual([
      "SHTU",
      "DI",
      "STUDY",
    ]);

    render(<CandidatesAccordion rows={rows} />);

    const compositionButton = document.querySelector<HTMLButtonElement>(
      `button[data-candidate-id="${composition.candidateId}"]`,
    );
    expect(compositionButton).toBeInTheDocument();

    const compositionRow = compositionButton?.parentElement;
    expect(compositionRow).toBeTruthy();
    expect(
      within(compositionRow as HTMLElement).getByText(
        "Expansion chain: SHTU → DI → STUDY",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Adding or increasing knowledge; making knowledge yours through learning.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps each candidate's emitted chain attached to its own row", async () => {
    const body = await analyze("study");
    const candidates = body.candidates.slice(0, 2).map(
      (candidate: AnyRecord, index: number) => ({
        ...candidate,
        expansionChain:
          index === 0
            ? ["FIRST_EMBRYO", "FIRST_WORD"]
            : ["SECOND_EMBRYO", "SECOND_WORD"],
      }),
    );

    const rows = buildCandidateRowsFromVM(
      adaptAnalysisToTelemetryVM({ ...body, candidates }),
    );

    expect(rows.map((row) => row.expansionChain)).toEqual([
      ["FIRST_EMBRYO", "FIRST_WORD"],
      ["SECOND_EMBRYO", "SECOND_WORD"],
    ]);

    render(<CandidatesAccordion rows={rows} />);

    expect(
      screen.getByText("Expansion chain: FIRST_EMBRYO → FIRST_WORD"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Expansion chain: SECOND_EMBRYO → SECOND_WORD"),
    ).toBeInTheDocument();
  });

  it("does not fabricate expansion context when the field is absent", async () => {
    const body = await analyze("study");
    const composition = compositionCandidate(body);
    const payload = {
      ...body,
      candidates: [
        {
          ...composition,
          expansionChain: undefined,
        },
      ],
    };

    const rows = buildCandidateRowsFromVM(
      adaptAnalysisToTelemetryVM(payload),
    );

    expect(rows[0]?.expansionChain).toBeNull();

    render(<CandidatesAccordion rows={rows} />);

    expect(screen.queryByText(/Expansion chain:/)).not.toBeInTheDocument();
    expect(screen.getByText("SHTU + DI")).toBeInTheDocument();
  });

  it("does not render expansion context for an empty candidate list", () => {
    render(<CandidatesAccordion rows={[]} />);

    expect(screen.getByText("None emitted.")).toBeInTheDocument();
    expect(screen.queryByText(/Expansion chain:/)).not.toBeInTheDocument();
  });

  it("keeps long expansion context wrapped within the candidate row", async () => {
    const body = await analyze("study");
    const composition = compositionCandidate(body);
    const rows = buildCandidateRowsFromVM(
      adaptAnalysisToTelemetryVM({
        ...body,
        candidates: [
          {
            ...composition,
            expansionChain: [
              "VERY_LONG_EMBRYO_FORM",
              "VERY_LONG_INTERMEDIATE_FORM",
              "VERY_LONG_ANALYZED_WORD",
            ],
          },
        ],
      }),
    );

    render(<CandidatesAccordion rows={rows} />);

    const chain = screen.getByText(
      "Expansion chain: VERY_LONG_EMBRYO_FORM → VERY_LONG_INTERMEDIATE_FORM → VERY_LONG_ANALYZED_WORD",
    );
    expect(chain.parentElement).toHaveClass("break-words");
    expect(chain.closest(".overflow-hidden")).toHaveClass("overflow-hidden");
  });
});
