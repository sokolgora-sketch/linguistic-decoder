import { render, screen } from "@testing-library/react";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import type { MotivationDiscoveryV0_1VM } from "@/ui/telemetry/types";

function model(overrides: Partial<MotivationDiscoveryV0_1VM> = {}): MotivationDiscoveryV0_1VM {
  return {
    schemaVersion: "open-instrument.motivation-engine-discovery.v0_1",
    status: "MATCHES_FOUND",
    inputWord: "study",
    inputLanguage: "en",
    inputProfile: "open-instrument.cmudict-arpabet-en-us.v0_1",
    sourceFact: {
      layer: "SOURCE_FACT",
      language: "en",
      profile: "open-instrument.cmudict-arpabet-en-us.v0_1",
      representation: "production_spoken",
      sourceStatus: "production_authoritative_pronunciation",
      authorityBoundary: "existing production source",
    },
    derivedStructure: {
      layer: "DERIVED_STRUCTURE",
      voicePath: ["Ë", "I"],
      voicePathSource: "production_spoken",
      math7: { basis: "ËI", totalMod7: 3, principlesPath: ["EVOLUTION", "INSIGHT"] },
      gamma: { status: "source_pronunciation", orderedUnits: ["S", "T", "D"], reason: null },
      zeroConsonantalStructuralComposition: {
        status: "source_pronunciation",
        variants: [{ p: 2, i: [1], s: 0, d: [2, 1, 0], a: 2 }],
        reason: null,
      },
      structuralHypotheses: [],
    },
    candidates: [{
      candidateId: "discovery:study:di",
      candidateLanguage: "sq",
      candidateForm: "di",
      candidateGloss: "know / knowledge",
      candidateEmbryo: "DI",
      candidateVoicePath: ["I"],
      sourceFact: {
        sourceId: "reviewed.external.di.knowledge.candidate.v0_1",
        sourceStatus: "reviewed_accepted",
        attestationTruth: "fact",
        evidenceRefs: ["reviewed.external.di.knowledge.candidate.citation.v0_1"],
        sourceUrlOrArchiveRef: "https://example.invalid/di",
        entryLocator: "Albanian > di",
      },
      derivedStructure: {
        minRootId: "study:SHTU+DI:1",
        protoRoots: ["SHTU", "DI"],
        carrierForms: ["shtu", "di"],
        operationIds: ["y_to_i"],
      },
      functionalInterpretation: {
        truthClassification: "hypothesis",
        statement: "knowledge can motivate study and learning functionally",
      },
      candidateStatus: "experimental",
      historicalRelation: "not_claimed",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    }],
    interpretation: {
      layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS",
      status: "hypothesis",
      note: "hypothesis",
    },
    unknownOrNull: { layer: "UNKNOWN_OR_NULL", reason: null },
    userDecisionPosture: "user_decides",
    noSingleWinner: true,
    ...overrides,
  };
}

describe("Motivation Discovery Lab presentation v0.1", () => {
  it("shows fact, derived structure, hypothesis, status, and provenance without a winner", () => {
    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value: model() }} />);

    expect(screen.getByTestId("motivation-discovery-card")).toBeInTheDocument();
    expect(screen.getByText("SOURCE FACT")).toBeInTheDocument();
    expect(screen.getByText("DERIVED STRUCTURE · Voice path")).toBeInTheDocument();
    expect(screen.getByText("ZË-RO INTERPRETATION / HYPOTHESIS")).toBeInTheDocument();
    expect(screen.getByText("reviewed.external.di.knowledge.candidate.v0_1 · fact")).toBeInTheDocument();
    expect(screen.getByText("user decides")).toBeInTheDocument();
    expect(screen.getByText(/No single winner/)).toBeInTheDocument();
  });

  it("shows a valid Null instead of inventing a candidate", () => {
    render(
      <MotivationDiscoveryCardV0_1
        discovery={{
          kind: "present",
          value: model({
            status: "NO_MATCHES",
            candidates: [],
            interpretation: {
              layer: "ZË-RO_INTERPRETATION_OR_HYPOTHESIS",
              status: "UNKNOWN_OR_NULL",
              note: "No qualifying generic source witness was found.",
            },
            unknownOrNull: {
              layer: "UNKNOWN_OR_NULL",
              reason: "NO_GENERIC_AUTHORIZED_SOURCE_WITNESS",
            },
          }),
        }}
      />,
    );

    expect(screen.getByText("UNKNOWN / NULL")).toBeInTheDocument();
    expect(screen.getByText("NO_GENERIC_AUTHORIZED_SOURCE_WITNESS")).toBeInTheDocument();
    expect(screen.queryByTestId("motivation-discovery-candidate")).not.toBeInTheDocument();
  });
});
