/**
 * Guardrail: InstrumentPanel must be VM-driven for Readout (v0.1.1).
 *
 * What this test guarantees:
 * - InstrumentPanel must not touch raw payload fields during render.
 * - ReadoutCard receives the readout from Telemetry VM (contract adapter output).
 *
 * Strategy:
 * - Use a Proxy payload that throws on ANY property access (poison pill).
 * - Mock adaptAnalysisToTelemetryVM to return a minimal VM with sentinel readout values.
 * - Mock ledger/candidates model builders + cards to keep the test strictly about readout wiring.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

// --- 1) Mock toast (avoid DOM/env dependency)
jest.mock("../src/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// --- 2) Mock ReadoutCard to surface the readout prop
jest.mock("../src/ui/instrument/sections/ReadoutCard", () => ({
  ReadoutCard: ({ readout }: any) => (
    <div data-testid="readout">
      <div>WORD:{String(readout?.word)}</div>
      <div>
        ENGINE:
        {readout?.engineVersion?.kind === "present"
          ? String(readout.engineVersion.value)
          : "missing"}
      </div>
      <div>
        CANDS:{String(readout?.counts?.candidates)}
      </div>
    </div>
  ),
}));

// --- 3) Keep this test focused: stub ledger + candidates
jest.mock("../src/ui/ledger/ledgerModel", () => ({
  buildEvidenceLedgerModelFromVM: () => ({ sentinel: "ledger-from-vm" }),
}));
jest.mock("../src/ui/ledger/EvidenceLedgerCard", () => ({
  EvidenceLedgerCard: () => <div data-testid="ledger-card" />,
}));

jest.mock("../src/ui/candidates/candidateModel", () => ({
  buildCandidateRowsFromVM: () => [{ id: "row1" }],
}));
jest.mock("../src/ui/candidates/CandidatesAccordion", () => ({
  CandidatesAccordion: () => <div data-testid="candidates-accordion" />,
}));

// --- 4) Mock the contract adapter: return a minimal VM with readout populated
jest.mock("../src/ui/instrument/contractAdapter", () => ({
  adaptAnalysisToTelemetryVM: () => ({
    readout: {
      word: "study",
      mode: { kind: "present", value: "strict" },
      strictInput: { kind: "present", value: true },
      engineVersion: { kind: "present", value: "0.1.1" },
      voicePath: { kind: "present", value: ["U", "I"] },
      counts: {
        candidates: 1,
        ops: { kind: "present", value: 0 },
        notes: { kind: "present", value: 0 },
        signals: { kind: "present", value: 0 },
      },
    },
    // include minimal fields some downstream code might touch
    candidates: [],
    ledger: [],
  }),
}));

describe("ui guardrail: InstrumentPanel readout is VM-only (v0.1.1)", () => {
  it("does not touch raw payload; renders readout from VM", () => {
    const poisonedPayload = new Proxy(
      {},
      {
        get() {
          throw new Error("REGRESSION: InstrumentPanel touched raw payload during render.");
        },
        has() {
          throw new Error("REGRESSION: InstrumentPanel checked raw payload during render.");
        },
        ownKeys() {
          throw new Error("REGRESSION: InstrumentPanel enumerated raw payload during render.");
        },
      }
    ) as unknown;

    render(<InstrumentPanel payload={poisonedPayload} />);

    expect(screen.getByTestId("readout")).toBeInTheDocument();
    expect(screen.getByText("WORD:study")).toBeInTheDocument();
    expect(screen.getByText("ENGINE:0.1.1")).toBeInTheDocument();
    expect(screen.getByText("CANDS:1")).toBeInTheDocument();
  });
});
