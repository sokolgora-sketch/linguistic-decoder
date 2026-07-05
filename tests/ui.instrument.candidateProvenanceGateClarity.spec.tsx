import React from "react";
import { render, screen } from "@testing-library/react";
import { CandidatesAccordion } from "@/ui/candidates/CandidatesAccordion";
import { EvidenceTraceCard } from "@/ui/instrument/sections/EvidenceTraceCard";

function candidateRowFixture() {
  return {
    id: "latin-studium",
    language: "la",
    form: "studium",
    sourceKind: "SEED",
    status: null,
    functionalStatement: "entered as a candidate inspection row",
    vowelPath: "U-I",
    deepRootHeartGateStatus: "misaligned",
    deepRootHeartGateReasons: ["PATH_MISMATCH"],
    deepRootHeartGateEvidenceRefs: ["candidates[latin_studium].vowelPath"],
    raw: { id: "latin-studium" },
  } as any;
}

function readoutFixture() {
  return {
    word: "study",
    normalizedWord: { kind: "present", value: "study" },
    voicePath: { kind: "present", value: ["U", "I"] },
    voicePathSurface: { kind: "present", value: ["U", "Y"] },
    voicePathFunctional: { kind: "present", value: ["U", "I"] },
    voicePathDelta: "SHIFT",
  } as any;
}

describe("Open Instrument candidate provenance / gate clarity", () => {
  it("makes provenance and alignment labels explicit in CandidatesAccordion", () => {
    render(<CandidatesAccordion rows={[candidateRowFixture()]} />);

    expect(
      screen.getByText(
        /Inspection rows only\. Provenance shows how a row entered the engine; alignment shows DeepRoot–Heart status\./i
      )
    ).toBeInTheDocument();

    expect(screen.getByText("Provenance: SEED")).toBeInTheDocument();
    expect(screen.getByText("Alignment: misaligned")).toBeInTheDocument();
    expect(screen.getByText(/Gate evidence:/i)).toBeInTheDocument();
  });

  it("uses provenance language in EvidenceTraceCard summary", () => {
    render(
      <EvidenceTraceCard
        readout={readoutFixture()}
        ledgerModel={null}
        candidateRows={[candidateRowFixture()]}
        rootMap={{ kind: "missing", missing: "not_emitted" } as any}
      />
    );

    expect(screen.getByText(/candidate provenance kinds/i)).toBeInTheDocument();
    expect(screen.getByText(/provenance=SEED x1/i)).toBeInTheDocument();
  });
});
