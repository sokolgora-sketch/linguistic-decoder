import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

// This test is ONLY about Evidence / Ops Ledger rendering.
jest.mock("@/ui/instrument/sections/ReadoutCard", () => ({
  ReadoutCard: () => null,
}));

jest.mock("@/ui/candidates/candidateModel", () => ({
  buildCandidateRowsFromVM: () => [],
}));
jest.mock("@/ui/candidates/CandidatesAccordion", () => ({
  CandidatesAccordion: () => null,
}));

jest.mock("@/ui/instrument/contractAdapter", () => ({
  adaptAnalysisToTelemetryVM: () => ({
    evidence: {
      normalizationSteps: { kind: "present", value: ["S1"] },
      ops: { kind: "present", value: ["OP1"] },

      // Notes present but empty => section should show "None emitted."
      notes: { kind: "present", value: [] },

      // Signals missing, but UI currently combines Signals/Notes; the combined section
      // becomes "none emitted" because notes is present-empty and there are no signal items.
      signals: { kind: "missing", missing: "signals not emitted yet" },
    },
    readout: {
      word: "(missing word)",
      mode: { kind: "missing", missing: "mode" },
      strictInput: { kind: "missing", missing: "strictInput" },
      engineVersion: { kind: "present", value: "v-test" },
      voicePath: { kind: "missing", missing: "voicePath" },
      counts: {
        candidates: 0,
        ops: { kind: "missing", missing: "ops" },
        notes: { kind: "missing", missing: "notes" },
        signals: { kind: "missing", missing: "signals" },
      },
    },
  }),
}));

describe("InstrumentPanel — EvidenceLedgerCard", () => {
  it("renders evidence lists from vm.evidence", () => {
    render(<InstrumentPanel payload={{ any: "thing" }} />);

    // Present lists should render list items.
    expect(screen.getByText("S1")).toBeInTheDocument();
    expect(screen.getByText("OP1")).toBeInTheDocument();

    // Combined Signals/Notes section shows none emitted.
    expect(screen.getByText("Not emitted.")).toBeInTheDocument();

    // Sources are part of the contract.
    expect(screen.getByText(/source:\s*vm\.evidence\.normalizationSteps/i)).toBeInTheDocument();
    expect(screen.getByText(/source:\s*vm\.evidence\.ops/i)).toBeInTheDocument();
    expect(screen.getByText(/source:\s*vm\.evidence\.signals\+notes/i)).toBeInTheDocument();
  });
});
