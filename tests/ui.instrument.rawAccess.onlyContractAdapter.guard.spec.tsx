/**
 * Guardrail: Raw payload access is allowed ONLY inside contractAdapter (v0.1.1).
 *
 * What this test guarantees:
 * - InstrumentPanel and all child wiring must treat payload as opaque.
 * - The ONLY place that is allowed to "touch" raw payload is contractAdapter.
 *
 * Strategy:
 * - Poison payload with a Proxy that throws on ANY property access.
 * - Mock adaptAnalysisToTelemetryVM to return a minimal VM WITHOUT reading raw payload.
 * - Mock all downstream components to keep this test about "who touches payload".
 * - Assert render succeeds and adapter is called exactly once with the same payload object.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

// --- 1) Mock toast (avoid DOM/env dependency)
jest.mock("../src/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// --- 2) Mock ReadoutCard to surface VM-only sentinel
jest.mock("../src/ui/instrument/sections/ReadoutCard", () => ({
  ReadoutCard: ({ readout }: any) => (
    <div>
      <div data-testid="readout-word">{String(readout.word)}</div>
      <div data-testid="readout-engine">
        {readout.engineVersion?.kind === "present" ? String(readout.engineVersion.value) : "missing"}
      </div>
    </div>
  ),
}));

// --- 3) Mock ledger/candidates to avoid unrelated reads/failures
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

// --- 4) IMPORTANT: mock the adapter itself (the only allowed raw reader)
const adaptSpy = jest.fn((_raw: unknown) => ({
  readout: {
    word: "study",
    engineVersion: { kind: "present", value: "v0.1.1" },
    mode: { kind: "missing", missing: "not_emitted" },
    strictInput: { kind: "missing", missing: "not_emitted" },
    voicePath: { kind: "missing", missing: "not_emitted" },
    counts: { candidates: 1, ops: { kind: "missing", missing: "not_emitted" }, notes: { kind: "missing", missing: "not_emitted" }, signals: { kind: "missing", missing: "not_emitted" } },
  },
  candidates: [],
  ledger: { items: [] },
}));

jest.mock("../src/ui/instrument/contractAdapter", () => ({
  adaptAnalysisToTelemetryVM: (raw: unknown) => adaptSpy(raw),
}));

describe("ui guardrail: raw payload access is contractAdapter-only (v0.1.1)", () => {
  it("renders without touching payload anywhere except via contractAdapter", () => {
    // Poison pill: any attempt to read payload properties will throw.
    const poisonedPayload = new Proxy(
      {},
      {
        get(_t, prop) {
          throw new Error(
            `REGRESSION: raw payload property accessed outside contractAdapter: ${String(prop)}`
          );
        },
        has() {
          throw new Error("REGRESSION: raw payload 'in' check outside contractAdapter.");
        },
        ownKeys() {
          throw new Error("REGRESSION: raw payload enumerated outside contractAdapter.");
        },
        getOwnPropertyDescriptor() {
          throw new Error("REGRESSION: raw payload property descriptor accessed outside contractAdapter.");
        },
      }
    );

    render(<InstrumentPanel payload={poisonedPayload} />);

    // Prove VM-driven render succeeded.
    expect(screen.getByTestId("readout-word").textContent).toBe("study");
    expect(screen.getByTestId("readout-engine").textContent).toBe("v0.1.1");
    expect(screen.getByTestId("ledger").textContent).toBe("ledger-from-vm");
    expect(screen.getByTestId("candidates").textContent).toBe("vm-row");

    // Prove adapter is the only handshake point.
    expect(adaptSpy).toHaveBeenCalledTimes(1);
    // NOTE: do NOT use toHaveBeenCalledWith(poisonedPayload) because Jest will
    // attempt deep equality and touch Proxy properties (intentionally fatal).
    const firstArg = adaptSpy.mock.calls[0]?.[0];
    expect(firstArg).toBe(poisonedPayload);
  });
});
