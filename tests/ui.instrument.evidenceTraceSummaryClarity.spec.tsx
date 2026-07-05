import React from "react";
import { render, screen } from "@testing-library/react";
import { EvidenceTraceCard } from "@/ui/instrument/sections/EvidenceTraceCard";

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

function candidateRowFixture() {
  return {
    id: "latin-studium",
    language: "la",
    form: "studium",
    sourceKind: "SEED",
    vowelPath: "U-I",
    raw: { id: "latin-studium" },
  } as any;
}

describe("EvidenceTraceCard summary clarity", () => {
  it("uses clearer summary wording without changing pinned evidence-trace anchors", () => {
    render(
      <EvidenceTraceCard
        readout={readoutFixture()}
        ledgerModel={null}
        candidateRows={[candidateRowFixture()]}
        rootMap={{ kind: "missing", missing: "not_emitted" } as any}
      />
    );

    expect(
      screen.getByText("Compact inspection map of emitted VM fields behind this readout.")
    ).toBeInTheDocument();

    expect(screen.getByText("candidate rows emitted")).toBeInTheDocument();
    expect(screen.getByText("candidate vowel paths emitted")).toBeInTheDocument();

    expect(screen.getByText("candidate provenance kinds")).toBeInTheDocument();
    expect(screen.getByText("RootMap hypothesis")).toBeInTheDocument();
    expect(screen.getByText("Ledger sources")).toBeInTheDocument();
  });
});
