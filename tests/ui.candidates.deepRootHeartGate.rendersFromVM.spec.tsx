import React from "react";
import { render, screen } from "@testing-library/react";
import { CandidatesAccordion } from "@/ui/candidates/CandidatesAccordion";
import { buildCandidateRowsFromVM } from "@/ui/candidates/candidateModel";

describe("CandidatesAccordion: DeepRoot–Heart gate renders from VM (no raw inference)", () => {
  test("shows aligned and misaligned statuses", () => {
    const vm: any = {
      candidates: [
        {
          id: "c1",
          language: { kind: "present", value: "en" },
          form: { kind: "present", value: "study" },
          sourceKind: { kind: "present", value: "SEED" },
          functionalStatement: { kind: "present", value: "add + know" },
          vowelPath: { kind: "present", value: ["U", "I"] },
          deepRootHeartGate: { kind: "present", value: { status: "aligned", reasonCodes: [], evidenceRefs: [] } },
          decomposition: { kind: "missing", missing: "not_emitted" },
          ops: { kind: "missing", missing: "not_emitted" },
          notes: { kind: "missing", missing: "not_emitted" },
          signals: { kind: "missing", missing: "not_emitted" },
          raw: {},
        },
        {
          id: "c2",
          language: { kind: "present", value: "sq" },
          form: { kind: "present", value: "shtu-da" },
          functionalStatement: { kind: "present", value: "add + divide" },
          vowelPath: { kind: "present", value: ["U", "A"] },
          deepRootHeartGate: {
            kind: "present",
            value: { status: "misaligned", reasonCodes: ["TERMINAL_VOWEL_CONFLICT"], evidenceRefs: [] },
          },
          decomposition: { kind: "missing", missing: "not_emitted" },
          ops: { kind: "missing", missing: "not_emitted" },
          notes: { kind: "missing", missing: "not_emitted" },
          signals: { kind: "missing", missing: "not_emitted" },
          raw: {},
        },
      ],
    };

    const rows = buildCandidateRowsFromVM(vm);
    render(<CandidatesAccordion rows={rows} />);

    expect(screen.getAllByText(/Alignment:/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Alignment:\s*aligned/i)).toBeInTheDocument();
    expect(screen.getByText(/Alignment:\s*misaligned/i)).toBeInTheDocument();
    expect(screen.getByText("Provenance: SEED")).toBeInTheDocument();
    expect(screen.getByText(/TERMINAL_VOWEL_CONFLICT/i)).toBeInTheDocument();
  });
});
