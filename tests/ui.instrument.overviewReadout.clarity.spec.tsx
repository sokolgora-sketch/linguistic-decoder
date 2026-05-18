import React from "react";
import { render, screen } from "@testing-library/react";
import { CountsRatiosCard } from "@/ui/instrument/sections/CountsRatiosCard";
import { EvidenceTraceCard } from "@/ui/instrument/sections/EvidenceTraceCard";
import { ReadoutCard } from "@/ui/instrument/sections/ReadoutCard";

const present = <T,>(value: T) => ({ kind: "present" as const, value });
const missing = (missingValue = "not_emitted") => ({ kind: "missing" as const, missing: missingValue });

function readoutFixture(): any {
  return {
    word: "study",
    status: "detected",
    normalizedWord: present("study"),
    mode: present("strict"),
    strictInput: present(true),
    alphabet: present("auto"),
    engineVersion: present("0.2.0-symbolic"),
    createdAt: present("2026-05-18T00:00:00.000Z"),
    voicePath: present(["U", "Y"]),
    voicePathSurface: present(["U", "Y"]),
    voicePathFunctional: missing(),
    voicePathDelta: "none",
    principlesPath: present(["P5", "P7"]),
    phoneticIpaV0_1: missing("not_provided"),
    counts: {
      candidates: 2,
      ops: present(0),
      notes: present(0),
      signals: present(7),
    },
  };
}

describe("Open Instrument Overview readout clarity", () => {
  it("presents the readout as VM-backed overview with boundary copy", () => {
    render(
      <ReadoutCard
        readout={readoutFixture()}
        onCopySummary={() => void 0}
        onCopyFullJson={() => void 0}
      />
    );

    expect(screen.getByText(/overview readout/i)).toBeInTheDocument();
    expect(screen.getByText("Readout")).toBeInTheDocument();
    expect(screen.getByText(/VM-backed readout for the current word/i)).toBeInTheDocument();
    expect(screen.getByText("status=detected")).toBeInTheDocument();
    expect(screen.getByText("mode=strict")).toBeInTheDocument();
    expect(screen.getByText("engine=0.2.0-symbolic")).toBeInTheDocument();
    expect(screen.getByText("Run context")).toBeInTheDocument();
    expect(screen.getByText("Detection")).toBeInTheDocument();
    expect(screen.getByText(/Boundary: deterministic readout only/i)).toBeInTheDocument();
    expect(screen.getByText(/no origin proof/i)).toBeInTheDocument();
    expect(screen.getByText(/no forced answer/i)).toBeInTheDocument();
  });

  it("presents counts and ratios as humanized overview metrics", () => {
    render(<CountsRatiosCard readout={readoutFixture()} engineVersion="0.2.0-symbolic" />);

    expect(screen.getByText(/overview totals/i)).toBeInTheDocument();
    expect(screen.getByText("Counts / Ratios")).toBeInTheDocument();
    expect(screen.getByText(/Humanized VM counts and ratios/i)).toBeInTheDocument();
    expect(screen.getByText("engine=0.2.0-symbolic")).toBeInTheDocument();
    expect(screen.getByText("Counts")).toBeInTheDocument();
    expect(screen.getByText("Ratios")).toBeInTheDocument();
    expect(screen.getByText(/Boundary: overview metrics only/i)).toBeInTheDocument();
    expect(screen.getByText(/no score order/i)).toBeInTheDocument();
    expect(screen.getByText(/no forced answer/i)).toBeInTheDocument();
  });

  it("presents evidence trace as a VM field trace, not a proof chain", () => {
    render(
      <EvidenceTraceCard
        readout={readoutFixture()}
        ledgerModel={{ sections: [{ key: "readout", source: "vm.readout", state: "present" }] } as any}
        candidateRows={[]}
        rootMap={missing() as any}
      />
    );

    expect(screen.getByText(/overview field trace/i)).toBeInTheDocument();
    expect(screen.getByText("Evidence trace")).toBeInTheDocument();
    expect(screen.getByText(/Compact map of emitted VM fields/i)).toBeInTheDocument();
    expect(screen.getByText("Ledger sources")).toBeInTheDocument();
    expect(screen.getByText("vm.readout: present")).toBeInTheDocument();
    expect(screen.getByText(/Boundary: VM field trace only/i)).toBeInTheDocument();
    expect(screen.getByText(/not a proof chain/i)).toBeInTheDocument();
    expect(screen.getByText(/no forced answer/i)).toBeInTheDocument();
  });
});
