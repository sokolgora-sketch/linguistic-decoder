/**
 * Guardrail: InstrumentPanel Evidence Package ("Copy Summary") must be VM-driven (v0.1.1).
 *
 * What this test guarantees:
 * - InstrumentPanel must not touch raw payload fields when building the summary.
 * - Copy Summary must copy text derived from Telemetry VM readout (contract adapter output).
 *
 * Strategy:
 * - Use a Proxy payload that throws on ANY property access (poison pill).
 * - Mock adaptAnalysisToTelemetryVM to return a minimal VM with sentinel readout values.
 * - Mock ReadoutCard / ledger / candidates to keep this test strictly about Evidence Package block.
 * - Mock navigator.clipboard.writeText and click "Copy Summary".
 * - Assert clipboard received the sentinel summary lines.
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { InstrumentPanel } from "../src/ui/instrument/InstrumentPanel";

// --- 1) Mock toast (avoid DOM/env dependency)
const toastSpy = jest.fn();
jest.mock("../src/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastSpy }),
}));

// --- 2) Mock ReadoutCard (we don't want its internal requirements here)
jest.mock("../src/ui/instrument/sections/ReadoutCard", () => ({
  ReadoutCard: (props: any) => (
    <div data-testid="readout-card-mock">
      <button type="button" onClick={props.onCopySummary}>
        Copy Summary
      </button>
      {props.onCopyFullJson ? (
        <button type="button" onClick={props.onCopyFullJson}>
          Copy Full JSON
        </button>
      ) : null}
    </div>
  ),
}));

// --- 3) Mock ledger + candidates: keep this test focused
jest.mock("../src/ui/ledger/ledgerModel", () => ({
  buildEvidenceLedgerModelFromVM: () => ({ __sentinel: "ledger-from-vm" }),
}));
jest.mock("../src/ui/ledger/EvidenceLedgerCard", () => ({
  EvidenceLedgerCard: () => <div data-testid="ledger-card-mock" />,
}));
jest.mock("../src/ui/candidates/candidateModel", () => ({
  buildCandidateRowsFromVM: () => [{ id: "row_1", label: "cand", lines: ["x"] }],
}));
jest.mock("../src/ui/candidates/CandidatesAccordion", () => ({
  CandidatesAccordion: () => <div data-testid="candidates-accordion-mock" />,
}));

// --- 4) Mock the contract adapter to return a minimal VM with sentinel readout values
jest.mock("../src/ui/instrument/contractAdapter", () => ({
  adaptAnalysisToTelemetryVM: () => ({
    readout: {
      word: "SENTINEL_WORD",
      mode: { kind: "present", value: "strict" },
      strictInput: { kind: "present", value: true },
      engineVersion: { kind: "present", value: "SENTINEL_ENGINE" },
      voicePath: { kind: "present", value: ["A", "E", "I"] },
      counts: {
        candidates: 7,
        ops: { kind: "present", value: 3 },
        notes: { kind: "present", value: 2 },
        signals: { kind: "present", value: 5 },
      },
    },
    // extra fields not needed by this test can be omitted; mocks handle the rest
  }),
}));

describe("ui guardrail: InstrumentPanel Evidence Package summary is VM-only (v0.1.1)", () => {
  test("does not touch raw payload; Copy Summary copies VM-derived summary lines", async () => {
    // Poison pill payload: any access throws. If InstrumentPanel touches it, test explodes.
    const poisonedPayload = new Proxy(
      {},
      {
        get() {
          throw new Error("REGRESSION: InstrumentPanel touched raw payload during Evidence Package render/copy.");
        },
        ownKeys() {
          throw new Error("REGRESSION: InstrumentPanel enumerated raw payload.");
        },
        getOwnPropertyDescriptor() {
          throw new Error("REGRESSION: InstrumentPanel inspected raw payload.");
        },
      }
    );

    // Mock clipboard
    const writeText = jest.fn().mockResolvedValue(undefined);
    (globalThis as any).navigator = (globalThis as any).navigator || {};
    (globalThis as any).navigator.clipboard = { writeText };

    render(<InstrumentPanel payload={poisonedPayload} />);

    // Click the Evidence Package "Copy Summary" button
    const btn = screen.getByRole("button", { name: /copy summary/i });
    fireEvent.click(btn);

    // Assert clipboard gets VM-derived text (exact lines matter; this is the contract)
    expect(writeText).toHaveBeenCalledTimes(1);
    const copied = String(writeText.mock.calls[0][0]);

    expect(copied).toContain("ZË-RO Instrument Summary");
    expect(copied).toContain("word=SENTINEL_WORD");
    expect(copied).toContain("mode=strict");
    expect(copied).toContain("strictInput=true");
    expect(copied).toContain("engine=SENTINEL_ENGINE");
    expect(copied).toContain("voicePath=A-E-I");
    expect(copied).toContain("candidates=7");
    expect(copied).toContain("ops=3");
    expect(copied).toContain("notes=2");
    expect(copied).toContain("signals=5");
  });
});
