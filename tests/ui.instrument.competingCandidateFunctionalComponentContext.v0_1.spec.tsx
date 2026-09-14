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

function candidateRow(rows: ReturnType<typeof buildCandidateRowsFromVM>, id: string) {
  const row = rows.find((candidate) => candidate.id === id);
  expect(row).toBeDefined();
  return row as NonNullable<typeof row>;
}

function renderCandidateRows(rows: ReturnType<typeof buildCandidateRowsFromVM>) {
  render(<CandidatesAccordion rows={rows} />);
}

describe("Open Instrument competing candidate functional component context v0.1", () => {
  it("projects and renders the exact emitted study components in order", async () => {
    const body = await analyze("study");
    const composition = compositionCandidate(body);
    const components = composition.segmentation.components;

    expect(components.map((component: AnyRecord) => component.embryo)).toEqual([
      "SHTU",
      "DI",
    ]);
    expect(components.map((component: AnyRecord) => component.plainMeaning)).toEqual([
      "add / increase / put-on",
      "know / knowledge",
    ]);
    expect(components.map((component: AnyRecord) => component.evidenceState)).toEqual([
      "structural",
      "reviewed",
    ]);

    const vm = adaptAnalysisToTelemetryVM(body);
    const vmRow = candidateRow(vm.candidates, composition.candidateId);
    expect(vmRow.functionalComponents).toEqual({
      kind: "present",
      value: [
        {
          embryo: "SHTU",
          language: { kind: "present", value: "sq" },
          plainMeaning: {
            kind: "present",
            value: "add / increase / put-on",
          },
          evidenceState: { kind: "present", value: "structural" },
        },
        {
          embryo: "DI",
          language: { kind: "present", value: "sq" },
          plainMeaning: { kind: "present", value: "know / knowledge" },
          evidenceState: { kind: "present", value: "reviewed" },
        },
      ],
    });

    const rows = buildCandidateRowsFromVM(vm);
    const uiRow = candidateRow(rows, composition.candidateId);
    expect(uiRow.functionalComponents?.map((component) => component.embryo)).toEqual([
      "SHTU",
      "DI",
    ]);

    renderCandidateRows(rows);

    const compositionButton = document.querySelector<HTMLButtonElement>(
      `button[data-candidate-id="${composition.candidateId}"]`,
    );
    expect(compositionButton).toBeInTheDocument();
    const compositionRow = compositionButton?.parentElement;
    expect(compositionRow).toBeTruthy();

    const row = within(compositionRow as HTMLElement);
    expect(row.getByText("Functional components")).toBeInTheDocument();
    expect(row.getByText("SHTU", { exact: true })).toBeInTheDocument();
    expect(row.getByText("DI", { exact: true })).toBeInTheDocument();
    expect(row.getByText("add / increase / put-on")).toBeInTheDocument();
    expect(row.getByText("know / knowledge")).toBeInTheDocument();
    expect(row.getAllByText("Language: sq", { exact: true })).toHaveLength(2);
    expect(row.getByText("State: structural", { exact: true })).toBeInTheDocument();
    expect(row.getByText("State: reviewed", { exact: true })).toBeInTheDocument();
    expect(
      row.getByText("Expansion chain: SHTU → DI → STUDY"),
    ).toBeInTheDocument();
    expect(
      row.getByText(
        "Adding or increasing knowledge; making knowledge yours through learning.",
      ),
    ).toBeInTheDocument();
  });

  it("keeps component ownership and candidate order separate", async () => {
    const body = await analyze("study");
    const composition = compositionCandidate(body);
    const candidates = [
      {
        ...composition,
        id: "test-composition",
        candidateId: "test-composition",
        displayForm: "SHTU + DI",
      },
      {
        ...composition,
        id: "test-alternative",
        candidateId: "test-alternative",
        displayForm: "ALT",
        segmentation: {
          kind: "functionalComposition",
          components: [
            {
              embryo: "ALT",
              language: "sq",
              plainMeaning: "alternative contribution",
              evidenceState: "research",
            },
          ],
        },
      },
    ];

    const rows = buildCandidateRowsFromVM(
      adaptAnalysisToTelemetryVM({ ...body, candidates }),
    );
    expect(rows.map((row) => row.id)).toEqual([
      "test-composition",
      "test-alternative",
    ]);

    renderCandidateRows(rows);

    const firstRow = document.querySelector<HTMLButtonElement>(
      'button[data-candidate-id="test-composition"]',
    )?.parentElement;
    const secondRow = document.querySelector<HTMLButtonElement>(
      'button[data-candidate-id="test-alternative"]',
    )?.parentElement;

    expect(firstRow).toBeTruthy();
    expect(secondRow).toBeTruthy();
    expect(within(firstRow as HTMLElement).getByText("SHTU", { exact: true })).toBeInTheDocument();
    expect(within(firstRow as HTMLElement).getByText("DI", { exact: true })).toBeInTheDocument();
    expect(within(firstRow as HTMLElement).queryByText("ALT", { exact: true })).not.toBeInTheDocument();
    expect(within(secondRow as HTMLElement).getByText("ALT", { exact: true })).toBeInTheDocument();
    expect(within(secondRow as HTMLElement).queryByText("SHTU", { exact: true })).not.toBeInTheDocument();
    expect(
      within(secondRow as HTMLElement).getByText(
        "alternative contribution",
        { exact: true },
      ),
    ).toBeInTheDocument();
  });

  it("does not fabricate a component block when the field is absent", async () => {
    const body = await analyze("study");
    const composition = compositionCandidate(body);
    const rows = buildCandidateRowsFromVM(
      adaptAnalysisToTelemetryVM({
        ...body,
        candidates: [{ ...composition, segmentation: undefined }],
      }),
    );

    expect(rows[0]?.functionalComponents).toBeNull();
    renderCandidateRows(rows);

    expect(screen.queryByText("Functional components")).not.toBeInTheDocument();
    expect(screen.getByText("SHTU + DI")).toBeInTheDocument();
    expect(screen.getByText("Expansion chain: SHTU → DI → STUDY")).toBeInTheDocument();
  });

  it("keeps long component context wrapped in the existing stacked row", async () => {
    const body = await analyze("study");
    const composition = compositionCandidate(body);
    const longEmbryo = "VERY_LONG_COMPONENT_FORM";
    const longMeaning = "A very long component meaning that must wrap safely";
    const rows = buildCandidateRowsFromVM(
      adaptAnalysisToTelemetryVM({
        ...body,
        candidates: [
          {
            ...composition,
            segmentation: {
              kind: "functionalComposition",
              components: [
                {
                  embryo: longEmbryo,
                  language: "sq",
                  plainMeaning: longMeaning,
                  evidenceState: "structural",
                },
              ],
            },
          },
        ],
      }),
    );

    renderCandidateRows(rows);

    expect(screen.getByText(longEmbryo, { exact: true })).toHaveClass("break-all");
    expect(screen.getByText(longMeaning, { exact: true })).toHaveClass("break-words");
    expect(screen.getByText(longMeaning, { exact: true }).closest(".overflow-hidden")).toHaveClass(
      "overflow-hidden",
    );
  });

  it("renders no component context for an empty candidate result", () => {
    renderCandidateRows([]);

    expect(screen.getByText("None emitted.")).toBeInTheDocument();
    expect(screen.queryByText("Functional components")).not.toBeInTheDocument();
  });
});
