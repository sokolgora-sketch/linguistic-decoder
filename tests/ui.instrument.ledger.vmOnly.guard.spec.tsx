/**
 * Guardrail: InstrumentPanel must be VM-driven for Evidence Ledger (v0.1.1).
 *
 * What this test guarantees:
 * - InstrumentPanel must not touch raw payload evidence fields.
 * - EvidenceLedgerCard must receive a model built from VM via buildEvidenceLedgerModelFromVM(vm).
 *
 * Notes:
 * - We mock ReadoutCard + CandidatesAccordion to keep this test strictly about ledger wiring.
 * - We mock EvidenceLedgerCard to surface the model prop so we can assert the sentinel.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

// --- 1) Mock toast (avoid DOM/env dependency)
jest.mock("../src/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// --- 2) Mock ReadoutCard (it expects a large PresentOrMissing shape; not our concern here)
jest.mock("../src/ui/instrument/sections/ReadoutCard", () => ({
  ReadoutCard: () => <div data-testid="readout-mock">readout-mock</div>,
}));

// --- 3) Mock CandidatesAccordion (not our concern here)
jest.mock("../src/ui/candidates/CandidatesAccordion", () => ({
  CandidatesAccordion: () => <div data-testid="candidates-mock">candidates-mock</div>,
}));

// --- 4) Mock EvidenceLedgerCard so we can assert the model prop was built from VM
jest.mock("../src/ui/ledger/EvidenceLedgerCard", () => ({
  EvidenceLedgerCard: ({ model }: any) => (
    <div data-testid="ledger-mock">{String(model?.__sentinel ?? "no-sentinel")}</div>
  ),
}));

// --- 5) Create a stable VM object reference we can assert against
const VM: any = {
  readout: {
    word: "study",
    mode: { kind: "present", value: "strict" },
    strictInput: { kind: "present", value: "strict" },
    engineVersion: { kind: "present", value: "0.1.1" },
    voicePath: { kind: "missing", missing: "not_emitted" },
    counts: {
      candidates: 1,
      ops: { kind: "missing", missing: "not_emitted" },
      notes: { kind: "missing", missing: "not_emitted" },
      signals: { kind: "missing", missing: "not_emitted" },
    },
  },
  candidates: [],
  evidence: {
    normalizationSteps: { kind: "missing", missing: "not_emitted" },
    ops: { kind: "missing", missing: "not_emitted" },
    notes: { kind: "missing", missing: "not_emitted" },
    signals: { kind: "missing", missing: "not_emitted" },
  },
};

// --- 6) Mock contract adapter to return our VM (so payload is never trusted)
jest.mock("../src/ui/instrument/contractAdapter", () => ({
  adaptAnalysisToTelemetryVM: () => VM,
}));

// --- 7) Mock ledger model builder and enforce it is called with VM
const buildEvidenceLedgerModelFromVM = jest.fn((_vm: any) => ({
  __sentinel: "ledger-from-vm",
}));

jest.mock("../src/ui/ledger/ledgerModel", () => ({
  buildEvidenceLedgerModelFromVM: (vm: any) => buildEvidenceLedgerModelFromVM(vm),
}));

describe("ui guardrail: InstrumentPanel ledger is VM-only (v0.1.1)", () => {
  it("does not touch raw payload evidence; builds ledger model from VM", () => {
    // Poison payload evidence so any legacy/raw access explodes immediately.
    const poisonedPayload: any = {};
    Object.defineProperty(poisonedPayload, "evidence", {
      get() {
        throw new Error("REGRESSION: touched payload.evidence (must be VM-only).");
      },
    });
    Object.defineProperty(poisonedPayload, "raw", {
      get() {
        throw new Error("REGRESSION: touched payload.raw (must be VM-only).");
      },
    });

    render(<InstrumentPanel payload={poisonedPayload} />);

    // Prove ledger model builder was called from VM path.
    expect(buildEvidenceLedgerModelFromVM).toHaveBeenCalledTimes(1);
    expect(buildEvidenceLedgerModelFromVM).toHaveBeenCalledWith(VM);

    // Prove EvidenceLedgerCard saw the sentinel model (built from VM).
    expect(screen.getByTestId("ledger-mock")).toHaveTextContent("ledger-from-vm");
  });
});
