/**
 * Guardrail: InstrumentPanel must call contractAdapter exactly once (v0.1.1+).
 *
 * Strategy:
 * - Mock adaptAnalysisToTelemetryVM to count calls and return a minimal VM.
 * - Render InstrumentPanel with an opaque payload object.
 * - Assert adapter called once with same payload reference (NO deep equality).
 *
 * Note:
 * Do NOT use toHaveBeenCalledWith(payload) because Jest may deep-compare
 * and that becomes brittle for Proxy payloads. We assert by identity.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

// Keep environment stable.
jest.mock("../src/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// Downstream mocks: keep this test about adapter call count, not UI details.
jest.mock("../src/ui/instrument/sections/ReadoutCard", () => ({
  ReadoutCard: ({ readout }: any) => <div data-testid="readout-word">{String(readout.word)}</div>,
}));
jest.mock("../src/ui/ledger/ledgerModel", () => ({
  buildEvidenceLedgerModelFromVM: () => ({ __sentinel: "ledger-from-vm" }),
}));
jest.mock("../src/ui/ledger/EvidenceLedgerCard", () => ({
  EvidenceLedgerCard: ({ model }: any) => <div data-testid="ledger">{model.__sentinel}</div>,
}));
jest.mock("../src/ui/candidates/candidateModel", () => ({
  buildCandidateRowsFromVM: () => [{ id: "row-1", title: "vm-row" }],
}));
jest.mock("../src/ui/candidates/CandidatesAccordion", () => ({
  CandidatesAccordion: ({ rows }: any) => <div data-testid="candidates">{rows[0]?.title}</div>,
}));

const adaptSpy = jest.fn((_raw: unknown) => ({
  readout: {
    word: "study",
    engineVersion: { kind: "present", value: "v0.1.1" },
    mode: { kind: "missing", missing: "not_emitted" },
    strictInput: { kind: "missing", missing: "not_emitted" },
    voicePath: { kind: "missing", missing: "not_emitted" },
    counts: {
      candidates: 1,
      ops: { kind: "missing", missing: "not_emitted" },
      notes: { kind: "missing", missing: "not_emitted" },
      signals: { kind: "missing", missing: "not_emitted" },
    },
  },
  candidates: [],
  ledger: { items: [] },
}));

jest.mock("../src/ui/instrument/contractAdapter", () => ({
  adaptAnalysisToTelemetryVM: (raw: unknown) => adaptSpy(raw),
}));

describe("ui guardrail: InstrumentPanel calls adapter exactly once (v0.1.x)", () => {
  it("calls adapter once and renders from VM", () => {
    const payload = { any: "opaque" };

    render(<InstrumentPanel payload={payload} />);

    expect(screen.getByTestId("readout-word").textContent).toBe("study");
    expect(screen.getByTestId("ledger").textContent).toBe("ledger-from-vm");
    expect(screen.getByTestId("candidates").textContent).toBe("vm-row");

    expect(adaptSpy).toHaveBeenCalledTimes(1);
    const firstArg = adaptSpy.mock.calls[0]?.[0];
    expect(firstArg).toBe(payload);
  });
});
