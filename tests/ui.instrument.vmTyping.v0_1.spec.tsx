import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { InstrumentPanel } from "@/ui/instrument/InstrumentPanel";
import type { TelemetryViewModel } from "@/ui/telemetry/types";

jest.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: jest.fn() }),
}));

function vmFixture(): TelemetryViewModel {
  return {
    readout: {
      word: "study",
      normalizedWord: { kind: "present", value: "study" },
      mode: { kind: "present", value: "strict" },
      strictInput: { kind: "present", value: true },
      engineVersion: { kind: "present", value: "0.2.0-symbolic" },
      alphabet: { kind: "present", value: "auto" },
      createdAt: { kind: "missing", missing: "not_emitted", note: "meta.created" },
      principlesPath: { kind: "missing", missing: "not_emitted" },
      phoneticIpaV0_1: { kind: "missing", missing: "not_emitted", note: "phoneticIpaV0_1" },
      voicePath: { kind: "present", value: ["U", "I"] },
      voicePathSurface: { kind: "present", value: ["U", "Y"] },
      voicePathFunctional: { kind: "present", value: ["U", "I"] },
      voicePathDelta: "SHIFT",
      status: "detected",
      counts: {
        candidates: 0,
        ops: { kind: "missing", missing: "not_emitted" },
        notes: { kind: "missing", missing: "not_emitted" },
        signals: { kind: "present", value: 0 },
        rejections: { kind: "missing", missing: "not_emitted" },
      },
    },
    evidence: {
      normalizationSteps: { kind: "missing", missing: "not_emitted" },
      ops: { kind: "missing", missing: "not_emitted" },
      notes: { kind: "missing", missing: "not_emitted" },
      signals: { kind: "missing", missing: "not_emitted" },
    },
    candidates: [],
    math: { kind: "missing", missing: "not_emitted" },
    rejections: { items: { kind: "missing", missing: "not_emitted" } },
    originClaimGates: { active: false, flag: "ocg", candidateCount: 0, reasonCounts: {} },
    originClaim: { kind: "missing", missing: "not_emitted", note: "originClaim" },
    rootMap: { kind: "missing", missing: "not_emitted", note: "rootMap" },
    soundRoots: { kind: "missing", missing: "not_emitted", note: "soundRoots" },
    resonanceProfileV1: { kind: "missing", missing: "not_emitted", note: "resonanceProfileV1" },
    raw: null,
  };
}

describe("InstrumentPanel VM typing v0.1", () => {
  it("normalizes resonance missing=none to the panel-safe missing state", () => {
    const vm = vmFixture();
    vm.resonanceProfileV1 = { kind: "missing", missing: "none", note: "resonanceProfileV1" };

    render(<InstrumentPanel vm={vm} />);
    expect(screen.getByText("Resonance")).toBeInTheDocument();
    expect(screen.getByText(/Missing:\s*not_emitted\s*—\s*resonanceProfileV1/)).toBeInTheDocument();
  });

  it("normalizes soundRoots missing=none to the panel-safe missing state", () => {
    const vm = vmFixture();
    vm.soundRoots = { kind: "missing", missing: "none", note: "soundRoots" };

    render(<InstrumentPanel vm={vm} />);
    expect(screen.getByText("SoundRoots")).toBeInTheDocument();
    expect(screen.getAllByText(/\(not_emitted\)/).length).toBeGreaterThan(0);
  });

  it("normalizes rootMap missing=none to the panel-safe missing state", () => {
    const vm = vmFixture();
    vm.rootMap = { kind: "missing", missing: "none", note: "rootMap" };

    render(<InstrumentPanel vm={vm} />);
    fireEvent.click(screen.getByRole("tab", { name: "Roots / Meaning" }));
    expect(screen.getByText("Root Map")).toBeInTheDocument();
    expect(screen.getAllByText(/\(not_emitted\)/).length).toBeGreaterThan(0);
  });
});
