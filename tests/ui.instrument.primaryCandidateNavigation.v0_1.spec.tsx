import React from "react";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { webcrypto } from "node:crypto";

import {
  GET,
} from "../app/api/analyze-v1/route";
import ZroChatPage from "../src/components/ZroChatPage";
import {
  adaptAnalysisToTelemetryVM,
} from "../src/ui/instrument/contractAdapter";
import {
  buildReproducibleRunBundleV0_1,
  serializeReproducibleRunBundleV0_1,
} from "../src/shared/openInstrument/reproducibleRunBundle.v0_1";
import {
  InstrumentPanel,
} from "../src/ui/instrument/InstrumentPanel";

type AnyRecord = Record<string, any>;

function presentValue<T>(value: { kind: "present"; value: T } | unknown): T | null {
  return value && typeof value === "object" && (value as { kind?: string }).kind === "present"
    ? (value as { kind: "present"; value: T }).value
    : null;
}

async function analyze(word: string): Promise<AnyRecord> {
  const response = await GET(
    new Request(
      `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
    ),
  );

  expect(response.status).toBe(200);
  return response.json();
}

function candidateButtonIds(panel: HTMLElement): string[] {
  return Array.from(
    panel.querySelectorAll<HTMLButtonElement>("button[data-candidate-id]"),
  ).map((button) => button.dataset.candidateId ?? "");
}

function getCandidateButton(panel: HTMLElement, candidateId: string): HTMLButtonElement {
  const button = Array.from(
    panel.querySelectorAll<HTMLButtonElement>("button[data-candidate-id]"),
  ).find((candidateButton) => candidateButton.dataset.candidateId === candidateId);

  expect(button).toBeDefined();
  return button as HTMLButtonElement;
}

function makePrimarySelectionFixture(body: AnyRecord): { payload: AnyRecord; selectedId: string } {
  const selected = body.candidates.find(
    (candidate: AnyRecord) => candidate?.candidateId === "albanian-di-know-functional",
  );
  const other = body.candidates.find((candidate: AnyRecord) => candidate !== selected);

  expect(selected).toBeTruthy();
  expect(other).toBeTruthy();

  return {
    payload: {
      ...body,
      candidates: [
        {
          ...other,
          id: "emitted-first-candidate",
          candidateId: "emitted-first-candidate",
          claimType: "functionalMotivation",
          validationOutcome: "partial",
        },
        {
          ...selected,
          id: "selected-functional-candidate",
          candidateId: "selected-functional-candidate",
        },
      ],
    },
    selectedId: "selected-functional-candidate",
  };
}

function researchFixture(body: AnyRecord): AnyRecord {
  const source = body.candidates[0];
  return {
    ...body,
    rootMap: undefined,
    candidates: [
      {
        ...source,
        id: "research-functional-candidate",
        candidateId: "research-functional-candidate",
        form: "AK",
        displayForm: "AK",
        embryo: "AK",
        claimType: "functionalMotivation",
        validationOutcome: "not_evaluated",
        sourceKind: "multi_source_research_witness",
        sourceStatus: "research_candidate",
        sourceId: "research-source-ak",
        claimBoundary: "research_functional_hypothesis_only",
        candidateTruthClaim: "not_claimed",
        historicalOriginClaim: "not_claimed",
        userDecisionPosture: "user_decides",
        functionalStatement: "A bounded research hypothesis.",
        evidenceRefs: ["research-source-ak:citation-1"],
      },
    ],
  };
}

function structuralFixture(body: AnyRecord): AnyRecord {
  const source = body.candidates[0];
  return {
    ...body,
    candidates: [
      {
        ...source,
        id: "structural-only-candidate",
        candidateId: "structural-only-candidate",
        form: "STUDY",
        claimType: "structuralHypothesis",
        discoveryStatus: "structural_hypothesis",
        validationOutcome: "not_evaluated",
        sourceKind: "logic_derived_structural_hypothesis",
      },
    ],
  };
}

function fileFrom(text: string): File {
  return {
    name: "saved-analysis.json",
    text: async () => text,
  } as unknown as File;
}

beforeAll(() => {
  Object.defineProperty(globalThis, "crypto", {
    configurable: true,
    value: webcrypto,
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Open Instrument primary candidate navigation affordance v0.1", () => {
  it("targets the exact selected candidate, opens the disclosure, preserves order, and stays Overview-only", async () => {
    const body = makePrimarySelectionFixture(await analyze("study"));
    const vm = adaptAnalysisToTelemetryVM(body.payload);
    render(<InstrumentPanel payload={body.payload} />);

    const overviewPanel = screen.getByRole("tabpanel");
    expect(within(overviewPanel).getByRole("button", { name: "View candidate record" })).toBeVisible();
    expect(within(overviewPanel).queryByRole("link")).not.toBeInTheDocument();

    fireEvent.click(
      within(overviewPanel).getByRole("button", { name: "View candidate record" }),
    );

    const candidatesPanel = await screen.findByRole("tabpanel");
    expect(screen.getByRole("tab", { name: "Candidates" })).toHaveAttribute("aria-selected", "true");
    expect(within(candidatesPanel).queryByRole("button", { name: "View candidate record" })).not.toBeInTheDocument();

    const summary = within(candidatesPanel).getByText("All candidate records");
    expect(summary.closest("details")).toHaveAttribute("open");

    await waitFor(() => expect(getCandidateButton(candidatesPanel, body.selectedId)).toHaveFocus());
    expect(candidateButtonIds(candidatesPanel)).toEqual(vm.candidates.map((candidate) => candidate.id));
    expect(vm.candidates[0]?.id).not.toBe(body.selectedId);
  });

  it("does not expose navigation for a canonical Null result", async () => {
    const payload = await analyze("study");
    payload.candidates = [];
    payload.analysisStatusV0_1 = {
      ...payload.analysisStatusV0_1,
      status: "null_no_supported_candidate",
      summary: "No supported candidate.",
      candidateOnlyOperators: [],
    };

    render(<InstrumentPanel payload={payload} />);

    expect(screen.getAllByText("No supported functional candidate yet.").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button", { name: "View candidate record" })).not.toBeInTheDocument();
  });

  it("does not expose navigation for structural-only or invalid-id candidates", async () => {
    const source = await analyze("study");

    const { unmount } = render(<InstrumentPanel payload={structuralFixture(source)} />);
    expect(screen.queryByRole("button", { name: "View candidate record" })).not.toBeInTheDocument();
    unmount();

    const invalidId = makePrimarySelectionFixture(await analyze("study"));
    const invalidPayload = {
      ...invalidId.payload,
      candidates: invalidId.payload.candidates.map((candidate: AnyRecord) =>
        candidate.id === invalidId.selectedId ? { ...candidate, id: "" } : candidate,
      ),
    };
    render(<InstrumentPanel payload={invalidPayload} />);

    expect(screen.queryByRole("button", { name: "View candidate record" })).not.toBeInTheDocument();
  });

  it("navigates research functional hypotheses without changing their truth labels", async () => {
    const payload = researchFixture(await analyze("study"));
    render(<InstrumentPanel payload={payload} />);

    fireEvent.click(screen.getByRole("button", { name: "View candidate record" }));
    const candidatesPanel = await screen.findByRole("tabpanel");

    expect(within(candidatesPanel).getByText("Research hypothesis")).toBeVisible();
    expect(within(candidatesPanel).getByText("Candidate truth: not claimed")).toBeVisible();
    expect(within(candidatesPanel).getByText("Decision: user decides")).toBeVisible();
    await waitFor(() => expect(getCandidateButton(candidatesPanel, "research-functional-candidate")).toHaveFocus());
  });

  it("keeps imported-run navigation aligned with fresh navigation and performs no reanalysis", async () => {
    const payload = makePrimarySelectionFixture(await analyze("study")).payload;
    const bundle = await buildReproducibleRunBundleV0_1({ result: payload });
    const serialized = serializeReproducibleRunBundleV0_1(bundle);
    const fetchMock = jest.fn();
    global.fetch = fetchMock;

    render(<ZroChatPage />);
    fireEvent.change(screen.getByLabelText("Open saved analysis"), {
      target: { files: [fileFrom(serialized)] },
    });

    await screen.findByTestId("open-instrument-shell");
    fireEvent.click(screen.getByRole("button", { name: "View candidate record" }));
    const candidatesPanel = await screen.findByRole("tabpanel");

    await waitFor(() => expect(getCandidateButton(candidatesPanel, "selected-functional-candidate")).toHaveFocus());
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears stale targeted navigation when a new result replaces the VM", async () => {
    const first = makePrimarySelectionFixture(await analyze("study"));
    const { rerender } = render(<InstrumentPanel payload={first.payload} />);

    fireEvent.click(screen.getByRole("button", { name: "View candidate record" }));
    const firstCandidatesPanel = await screen.findByRole("tabpanel");
    await waitFor(() => expect(getCandidateButton(firstCandidatesPanel, first.selectedId)).toHaveFocus());

    const replacement = await analyze("study");
    replacement.candidates = [];
    rerender(<InstrumentPanel payload={replacement} />);

    await waitFor(() => {
      const candidatesPanel = screen.getByRole("tabpanel");
      expect(within(candidatesPanel).getByText("All candidate records").closest("details"))
        .not.toHaveAttribute("open");
    });

    expect(screen.queryByRole("button", { name: "View candidate record" })).not.toBeInTheDocument();
  });
});
