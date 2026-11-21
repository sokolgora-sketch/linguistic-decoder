import { render, screen } from "@testing-library/react";
import { EvidenceTraceCard } from "@/ui/instrument/sections/EvidenceTraceCard";
import type { EvidenceLedgerModel } from "@/ui/ledger/ledgerModel";
import type { TelemetryReadout } from "@/ui/telemetry/types";

describe("EvidenceTraceCard mobile wrapping", () => {
  it("preserves long evidence identifiers and allows trace values to wrap", () => {
    const readout = {
      word: "NDARJE",
      normalizedWord: { kind: "present", value: "ndarje" },
      voicePath: { kind: "missing", missing: "not_emitted" },
      voicePathSurface: { kind: "present", value: ["A", "E"] },
      voicePathFunctional: { kind: "missing", missing: "not_emitted" },
      voicePathDelta: "NOT_EMITTED",
    } as unknown as TelemetryReadout;
    const ledgerModel = {
      sections: [{ source: "SOURCE_AUTHORED_SUFFIX_TEMPLATE", state: "reason_code_unavailable" }],
    } as unknown as EvidenceLedgerModel;

    render(<EvidenceTraceCard readout={readout} ledgerModel={ledgerModel} candidateRows={null} rootMap={undefined} />);

    const traceRow = screen.getByText("norm=ndarje").parentElement;
    expect(traceRow).toHaveClass("flex-wrap", "min-w-0");
    expect(screen.getByText("norm=ndarje")).toHaveClass("min-w-0", "[overflow-wrap:anywhere]");
    const ledgerRecord = screen.getByText("SOURCE_AUTHORED_SUFFIX_TEMPLATE: reason_code_unavailable");
    expect(ledgerRecord).toHaveClass("[overflow-wrap:anywhere]");
    expect(ledgerRecord).toHaveTextContent("SOURCE_AUTHORED_SUFFIX_TEMPLATE: reason_code_unavailable");
  });
});
