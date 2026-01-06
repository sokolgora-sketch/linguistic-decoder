/**
 * Guardrail: InstrumentPanel candidates must be VM-driven (v0.1.1).
 *
 * Guarantees:
 * - Must not touch payload.candidates
 * - Must not call legacy buildCandidateRows(payload)
 * - Must render candidate rows from VM (buildCandidateRowsFromVM(vm))
 *
 * We mock Readout + Ledger because this test is ONLY about candidate wiring.
 */

import React from "react";
import { render, screen } from "@testing-library/react";

// 1) InstrumentPanel uses path aliases; mock the alias import, not a relative path.
jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// 2) ReadoutCard expects a huge VM shape; not relevant to this test.
jest.mock("../src/ui/instrument/sections/ReadoutCard", () => ({
  ReadoutCard: () => <div data-testid="readout-card-mocked" />,
}));

// 3) Ledger path not relevant; keep it inert.
jest.mock("../src/ui/ledger/ledgerModel", () => ({
  buildEvidenceLedgerModelFromVM: () => ({ rows: [], totals: {} }),
}));
jest.mock("../src/ui/ledger/EvidenceLedgerCard", () => ({
  EvidenceLedgerCard: () => <div data-testid="ledger-card-mocked" />,
}));

// 4) Candidate guardrail: legacy MUST explode if called; VM builder passes through.
jest.mock("../src/ui/candidates/candidateModel", () => ({
  buildCandidateRows: () => {
    throw new Error(
      "REGRESSION: buildCandidateRows(payload) called. InstrumentPanel must be VM-driven for candidates."
    );
  },
  buildCandidateRowsFromVM: (vm: any) =>
    (vm?.candidates ?? []).map((c: any) => ({
      id: c.id ?? "cand_0",
      language: c?.language?.kind === "present" ? c.language.value : "Unknown",
      form: c?.form?.kind === "present" ? c.form.value : "—",
      status: null,
      vowelPath:
        c?.vowelPath?.kind === "present" && Array.isArray(c.vowelPath.value)
          ? c.vowelPath.value.join("-")
          : null,
      functionalStatement:
        c?.functionalStatement?.kind === "present"
          ? c.functionalStatement.value
          : null,
      raw: c?.raw ?? c,
    })),
}));

// 5) THIS is the critical one: InstrumentPanel imports './contractAdapter'.
// We mock the resolved module path to that file.
jest.mock("../src/ui/instrument/contractAdapter", () => ({
  adaptAnalysisToTelemetryVM: () => ({
    readout: {
      word: "study",
      mode: { kind: "present", value: "strict" },
      strictInput: { kind: "present", value: "strict" },
      engineVersion: { kind: "present", value: "v0.1.1" },
      voicePath: { kind: "missing", missing: "not_emitted" },
      counts: {
        candidates: 1,
        ops: { kind: "missing", missing: "not_emitted" },
        notes: { kind: "missing", missing: "not_emitted" },
        signals: { kind: "missing", missing: "not_emitted" },
      },
    },
    candidates: [
      {
        id: "cand_test_0",
        language: { kind: "present", value: "en" },
        form: { kind: "present", value: "study" },
        vowelPath: { kind: "present", value: ["U", "I"] },
        functionalStatement: { kind: "present", value: "test functional statement" },
        raw: { id: "cand_test_0" },
      },
    ],
  }),
}));

describe("ui guardrail: InstrumentPanel candidates are VM-only (v0.1.1)", () => {
  it("does not touch payload.candidates; renders candidates from VM", async () => {
    // Import AFTER mocks so InstrumentPanel sees the mocked modules.
    const { InstrumentPanel } = await import("../src/ui/instrument/InstrumentPanel");

    // Poison candidates so any payload access is a hard crash.
    const poisonedPayload: any = {};
    Object.defineProperty(poisonedPayload, "candidates", {
      get() {
        throw new Error("REGRESSION: InstrumentPanel touched payload.candidates");
      },
    });

    render(<InstrumentPanel payload={poisonedPayload} />);

    // Candidate content proves VM-driven path is used.
    expect(screen.getByText("study")).toBeInTheDocument();
    expect(screen.getByText(/test functional statement/i)).toBeInTheDocument();
  });
});
