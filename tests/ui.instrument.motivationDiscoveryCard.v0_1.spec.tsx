import { render, screen } from "@testing-library/react";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
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
      structuralComparison: {
        matchClassification: "STRUCTURAL_MOTIVATION_CANDIDATE",
        presentationClassification: "STRUCTURAL_MOTIVATION",
        matchedQuery: "DI",
        inputRepresentationKind: "production_spoken",
        candidateRepresentationKind: "orthographic_profile_derived",
        representationCompatibility: "CROSS_REPRESENTATION",
        inputVoicePath: ["Ë", "I"],
        candidateVoicePath: ["I"],
        voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
        inputConsonantalStructure: {
          gamma: ["S", "T", "D"],
          zeroConsonantalStructuralComposition: [{ p: 2 }],
          minRootId: "study:SHTU+DI:1",
          protoRoots: ["SHTU", "DI"],
          carrierForms: ["shtu", "di"],
          operationIds: ["y_to_i"],
        },
        candidateConsonantalStructure: null,
        consonantalCarrierRelationship: "INPUT_CARRIER_CONTEXT_ONLY",
        expansionOrCompositionChain: [],
        authorizedOperationIds: ["y_to_i"],
        reasonCodes: [],
        unresolvedFields: [
          "CANDIDATE_CONSONANTAL_STRUCTURE_NOT_AUTHORIZED",
          "CANDIDATE_ZERO_CONSONANTAL_STRUCTURE_NOT_AUTHORIZED",
        ],
        matchReason: "Input structural analysis produced the DI embryo; the Albanian lexical substrate contains the source-attested di record.",
      },
      functionalInterpretation: {
        status: "REVIEWED_HYPOTHESIS",
        truthClassification: "hypothesis",
        statement: "knowledge can motivate study and learning functionally",
        evidenceKind: "reviewed_functional_evidence",
        evidenceRefs: ["reviewed.external.di.knowledge.candidate.citation.v0_1"],
        reason: null,
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
    expect(screen.getByText(/orthographic\/profile-derived Discovery representation/)).toBeInTheDocument();
    expect(screen.getByText(/lexical source: https:\/\/example\.invalid\/di/)).toBeInTheDocument();
    expect(screen.getByText("Source fact")).toBeInTheDocument();
    expect(screen.getByTestId("motivation-structural-comparison")).toBeInTheDocument();
    expect(screen.getByText("WHY THIS CANDIDATE")).toBeInTheDocument();
    expect(screen.getByText(/structural motivation candidate/i)).toBeInTheDocument();
    expect(screen.getByText("CROSS_REPRESENTATION")).toBeInTheDocument();
    expect(screen.getByText("NOT_COMPARABLE_ACROSS_REPRESENTATIONS")).toBeInTheDocument();
    expect(screen.getByText(/no target-word mapping/)).toBeInTheDocument();
    expect(screen.getByText("FUNCTIONAL MOTIVATION")).toBeInTheDocument();
    expect(screen.getByText("Reviewed functional hypothesis")).toBeInTheDocument();
    expect(screen.getByText("reviewed.external.di.knowledge.candidate.v0_1")).toBeInTheDocument();
    expect(screen.getByText("No single winner · You decide")).toBeInTheDocument();
    expect(screen.getByTestId("motivation-candidate-details")).toBeInTheDocument();
    expect(screen.getByText(/No single winner/)).toBeInTheDocument();
  });

  it("keeps candidate summaries human-readable while preserving technical details", () => {
    const di = model().candidates[0];
    const da = {
      ...di,
      candidateId: "discovery:study:da",
      candidateForm: "da",
      candidateGloss: "to split, cut, divide",
      candidateEmbryo: "DA",
      functionalInterpretation: {
        status: "UNKNOWN_OR_NULL" as const,
        truthClassification: "unknown_or_null" as const,
        statement: null,
        evidenceKind: "none" as const,
        evidenceRefs: [],
        reason: "INSUFFICIENT_FUNCTIONAL_EVIDENCE",
      },
    };

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value: model({ candidates: [di, da] }) }} />);

    expect(screen.getByText("2 candidates")).toBeInTheDocument();
    expect(screen.getByText("da")).toBeInTheDocument();
    expect(screen.getByText("to split, cut, divide")).toBeInTheDocument();
    expect(screen.getAllByText("WHY THIS CANDIDATE")).toHaveLength(2);
    expect(screen.getAllByText("Functional motivation unknown")).toHaveLength(1);
    expect(screen.getByText("No reviewed functional evidence currently supports this bridge.")).toBeInTheDocument();
    expect(screen.getByText("No single winner · You decide")).toBeInTheDocument();

    const structural = screen.getAllByText("WHY THIS CANDIDATE")[0];
    const functional = screen.getAllByText("FUNCTIONAL MOTIVATION")[0];
    expect(structural.compareDocumentPosition(functional) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
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

    expect(screen.getByText("NO SUPPORTED MOTIVATION CANDIDATE YET")).toBeInTheDocument();
    expect(screen.getByText("NO_GENERIC_AUTHORIZED_SOURCE_WITNESS")).toBeInTheDocument();
    expect(screen.queryByTestId("motivation-discovery-candidate")).not.toBeInTheDocument();
  });

  it("separates an exact lexical self-match from a structural motivation candidate", () => {
    const value = model({
      inputWord: "zemër",
      inputLanguage: "sq",
      inputProfile: "albanian",
      sourceFact: {
        layer: "SOURCE_FACT",
        language: "sq",
        profile: "albanian",
        representation: "albanian_profile",
        sourceStatus: "explicit_profile_binding_without_spoken_authority",
        authorityBoundary: "Albanian Discovery profile only",
      },
      candidates: [{
        ...model().candidates[0],
        candidateForm: "zemër",
        candidateLanguage: "sq",
        candidateEmbryo: "ZEMËR",
        structuralComparison: {
          ...model().candidates[0].structuralComparison,
          matchClassification: "EXACT_LEXICAL_SELF_MATCH",
          presentationClassification: "LEXICAL_ENTRY_CONFIRMATION",
          matchedQuery: "ZEMËR",
          inputRepresentationKind: "albanian_profile",
          inputVoicePath: ["E", "Ë"],
          voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
          matchReason: "Input lexical form matches a source-attested lexical record; this is lexical entry confirmation, not a cross-form structural motivation claim.",
        },
        functionalInterpretation: {
          status: "NOT_APPLICABLE_SELF_MATCH",
          truthClassification: "unknown_or_null",
          statement: null,
          evidenceKind: "none",
          evidenceRefs: [],
          reason: "LEXICAL_SELF_MATCH_NOT_FUNCTIONAL_MOTIVATION",
        },
      }],
    });

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value }} />);
    expect(screen.getAllByText(/lexical entry confirmation/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/not a cross-form structural motivation claim/)).toBeInTheDocument();
    expect(screen.getByText("Not applicable to an exact lexical self-match")).toBeInTheDocument();
  });

  it("fails closed when a nested Math7 field is incomplete", () => {
    const malformed = model() as unknown as Record<string, unknown>;
    const derived = malformed.derivedStructure as Record<string, unknown>;
    const math7 = derived.math7 as Record<string, unknown>;
    delete math7.principlesPath;

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformed });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });

  it("fails closed when candidate consonantal structure is malformed", () => {
    const malformed = model() as unknown as Record<string, unknown>;
    const candidate = (malformed.candidates as Array<Record<string, unknown>>)[0];
    const comparison = candidate.structuralComparison as Record<string, unknown>;
    comparison.candidateConsonantalStructure = "malformed";

    const vm = adaptAnalysisToTelemetryVM({ motivationDiscoveryV0_1: malformed });
    expect(vm.motivationDiscoveryV0_1).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });
});
