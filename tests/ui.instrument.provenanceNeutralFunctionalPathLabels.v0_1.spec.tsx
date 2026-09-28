/** @jest-environment jsdom */

import React from "react";
import { render, screen } from "@testing-library/react";

import MeaningPanel from "@/ui/instrument/MeaningPanel";
import { VoicePathCompare } from "@/ui/instrument/VoicePathCompare";
import { VowelPathTimeline } from "@/ui/instrument/VowelPathTimeline";
import { EvidenceTraceCard } from "@/ui/instrument/sections/EvidenceTraceCard";
import type { Vowel } from "@/ui/telemetry/types";

const present = <T,>(value: T) => ({ kind: "present" as const, value });

const path: Vowel[] = ["A", "Ë"];

function readoutFixture() {
  return {
    word: "damage",
    normalizedWord: present("damage"),
    voicePath: present(["A", "E"]),
    voicePathSurface: present(["A", "A", "E"]),
    voicePathFunctional: present(path),
    voicePathDelta: "DIVERGE",
  } as any;
}

describe("provenance-neutral functional path labels v0.1", () => {
  it.each([
    ["MeaningPanel", () => (
      <MeaningPanel
        vm={{
          readout: {
            voicePathFunctional: present(path),
            voicePathDelta: "DIVERGE",
          },
          detection: {},
          evidence: {},
        }}
      />
    )],
    ["VoicePathCompare", () => (
      <VoicePathCompare surface={present(["A", "E"])} functional={present(path)} />
    )],
    ["VowelPathTimeline", () => (
      <VowelPathTimeline
        detected={present(["A", "E"])}
        surface={present(["A", "A", "E"])}
        functional={present(path)}
        delta="DIVERGE"
      />
    )],
    ["EvidenceTraceCard", () => (
      <EvidenceTraceCard
        readout={readoutFixture()}
        ledgerModel={null}
        candidateRows={[]}
        rootMap={{ kind: "missing", missing: "not_emitted" } as any}
      />
    )],
  ])("uses neutral wording for %s", (surface, renderSurface) => {
    render(renderSurface());

    const expectedLabel =
      surface === "MeaningPanel"
        ? "Functional / normalization path: A → Ë."
        : surface === "VoicePathCompare"
          ? "Functional / normalization path:"
          : "Functional / normalization path";
    expect(screen.getByText(expectedLabel, { exact: true })).toBeVisible();
    expect(screen.queryByText(/Candidate \/ structural path(?::)? A → Ë/)).not.toBeInTheDocument();
  });
});
