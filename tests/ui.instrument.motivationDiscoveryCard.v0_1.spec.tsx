import { fireEvent, render, screen } from "@testing-library/react";
import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";
import {
  aggregateMotivationDiscoveryCandidatesV0_1,
  measureMotivationDiscoveryAggregationV0_1,
} from "@/ui/instrument/motivationDiscoveryPresentationAggregation.v0_1";
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
  it("offers an explicit action for an alternative Albanian source record with its identity and gloss", () => {
    const sourceSnapshot = {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    };
    const sourceFact = (ordinal: number, gloss: string) => ({
      sourceRecordId: `kaikki-albanian-jsonl:word=krye:ordinal=${ordinal}`,
      entryLocator: `jsonl://word/krye/match/${ordinal}`,
      physicalRecordOrdinal: ordinal,
      language: "Albanian" as const,
      languageCode: "sq" as const,
      form: "krye",
      partOfSpeech: "noun",
      senses: [{ senseId: `krye-${ordinal}`, glosses: [gloss] }],
      ipaObservations: [],
      sourceStatus: "observed_external_snapshot" as const,
      attestationTruth: "fact" as const,
      pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const,
      sourceSnapshot,
    });
    const facts = [sourceFact(0, "head, chief"), sourceFact(1, "beginning, chapter")];
    const onAnalyzeAlbanianSourceRecord = jest.fn();

    render(
      <MotivationDiscoveryCardV0_1
        discovery={{
          kind: "present",
          value: model({
            inputWord: "krye",
            inputLanguage: "sq",
            exactLexicalSourceStatus: { status: "MATCHES_FOUND", queryForm: "krye", reasonCode: null },
            exactLexicalSourceFacts: facts,
          })
        }}
        onAnalyzeAlbanianSourceRecord={onAnalyzeAlbanianSourceRecord}
      />,
    );

    const alternativeId = "kaikki-albanian-jsonl:word=krye:ordinal=1";
    expect(screen.getAllByText("beginning, chapter").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Albanian · noun/)).toHaveLength(2);
    expect(screen.getAllByText((_, element) =>
      element?.textContent?.includes(`Source record: ${alternativeId}`) ?? false,
    ).length).toBeGreaterThan(0);
    expect(screen.getAllByText("SOURCE RECORD SELECTION UNKNOWN")).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", {
      name: `Analyze exact Albanian source record ${alternativeId}`,
    }));
    expect(onAnalyzeAlbanianSourceRecord).toHaveBeenCalledTimes(1);
    expect(onAnalyzeAlbanianSourceRecord).toHaveBeenCalledWith(alternativeId);
  });

  it("does not offer a selector for a duplicated exact source identity", () => {
    const sourceSnapshot = {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    };
    const duplicateFact = {
      sourceRecordId: "kaikki-albanian-jsonl:word=krye:ordinal=1",
      entryLocator: "jsonl://word/krye/match/1",
      physicalRecordOrdinal: 1,
      language: "Albanian" as const,
      languageCode: "sq" as const,
      form: "krye",
      partOfSpeech: "noun",
      senses: [{ senseId: "krye-1", glosses: ["beginning"] }],
      ipaObservations: [],
      sourceStatus: "observed_external_snapshot" as const,
      attestationTruth: "fact" as const,
      pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const,
      sourceSnapshot,
    };

    render(
      <MotivationDiscoveryCardV0_1
        discovery={{
          kind: "present",
          value: model({
            inputWord: "krye",
            inputLanguage: "sq",
            exactLexicalSourceStatus: { status: "MATCHES_FOUND", queryForm: "krye", reasonCode: null },
            exactLexicalSourceFacts: [duplicateFact, { ...duplicateFact }],
          })
        }}
        onAnalyzeAlbanianSourceRecord={() => undefined}
      />,
    );

    expect(screen.queryByTestId("albanian-source-record-select")).toBeNull();
    expect(screen.getAllByTestId("albanian-source-record-unselectable")).toHaveLength(2);
  });

  it("keeps proper-name records visible without offering them for lexical evaluation", () => {
    const sourceSnapshot = {
      sourceFamilyId: "kaikki-albanian-jsonl-v0.1",
      sourceUrl: "https://kaikki.org/dictionary/Albanian/kaikki.org-dictionary-Albanian.jsonl",
      sha256: "7a84eca776ebfac752e7251bb0822edc9cd1701d1d58060d4f8ef4b76a208fcc",
      bytes: 67438537,
    };
    const common = {
      entryLocator: "jsonl://word/krye/match/0",
      physicalRecordOrdinal: 0,
      language: "Albanian" as const,
      languageCode: "sq" as const,
      form: "krye",
      senses: [{ senseId: "krye-sense", glosses: ["head"] }],
      ipaObservations: [],
      sourceStatus: "observed_external_snapshot" as const,
      attestationTruth: "fact" as const,
      pronunciationAuthority: "CURRENT_KAIKKI_RECORD_ONLY_UNBOUND_TO_FROZEN_PROFILE" as const,
      sourceSnapshot,
    };
    const commonNoun = {
      ...common,
      sourceRecordId: "kaikki-albanian-jsonl:word=krye:ordinal=0",
      partOfSpeech: "noun",
    };
    const properName = {
      ...common,
      sourceRecordId: "kaikki-albanian-jsonl:word=krye:ordinal=1",
      partOfSpeech: "name",
    };

    render(
      <MotivationDiscoveryCardV0_1
        discovery={{
          kind: "present",
          value: model({
            inputWord: "krye",
            inputLanguage: "sq",
            exactLexicalSourceStatus: { status: "MATCHES_FOUND", queryForm: "krye", reasonCode: null },
            exactLexicalSourceFacts: [commonNoun, properName],
          })
        }}
        onAnalyzeAlbanianSourceRecord={() => undefined}
      />,
    );

    expect(screen.getByText(/Albanian · name/)).toBeInTheDocument();
    expect(screen.getAllByTestId("albanian-source-record-select")).toHaveLength(1);
    expect(screen.getByTestId("albanian-source-record-unselectable")).toHaveTextContent(
      "not a unique selectable Albanian lexical record",
    );
  });

  it("shows a Latin source candidate with an explicit lexical-only boundary", async () => {
    const response = await GET(
      new Request("http://localhost/api/analyze-v1?word=bamoar&mode=strict&alphabet=auto"),
    );
    const vm = adaptAnalysisToTelemetryVM(await response.json());

    render(<MotivationDiscoveryCardV0_1 discovery={vm.motivationDiscoveryV0_1} />);

    expect(screen.getByText("amo")).toBeInTheDocument();
    expect(screen.getByText("Latin")).toBeInTheDocument();
    expect(screen.getByText("to like, to love")).toBeInTheDocument();
    expect(screen.getAllByText(/Candidate pronunciation and spoken Voice path are Null/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/orthographic_profile_derived/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Functional motivation unknown").length).toBeGreaterThan(0);
    expect(screen.getAllByText("No single winner · You decide").length).toBeGreaterThan(0);
  });

  it("shows fact, derived structure, hypothesis, status, and provenance without a winner", () => {
    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value: model() }} />);

    expect(screen.getByTestId("motivation-discovery-card")).toBeInTheDocument();
    expect(screen.getByText("SOURCE FACT")).toBeInTheDocument();
    expect(screen.getByText(/source: production_spoken · profile: open-instrument\.cmudict-arpabet-en-us\.v0_1/)).toBeInTheDocument();
    expect(screen.getByText(/orthographic\/profile-derived Discovery representation/)).toBeInTheDocument();
    expect(screen.getByText(/lexical source: https:\/\/example\.invalid\/di/)).toBeInTheDocument();
    expect(screen.getByText("Source fact")).toBeInTheDocument();
    expect(screen.getByTestId("motivation-structural-comparison")).toBeInTheDocument();
    expect(screen.getByText("WHY THIS CANDIDATE")).toBeInTheDocument();
    expect(screen.getByText("primary source witness")).toBeInTheDocument();
    expect(screen.getByTestId("multilingual-discovery-role")).toHaveTextContent(
      "does not select a candidate or override the separate word-specific reading",
    );
    expect(screen.getByTestId("discovery-entry-cause")).toHaveTextContent(
      "existing Discovery record says",
    );
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

  it("shows additive AlbaNet synset details without turning them into functional evidence", () => {
    const albaNetCandidate = {
      ...model().candidates[0],
      candidateForm: "di",
      candidateGloss: "knowledge",
      sourceFact: {
        ...model().candidates[0]?.sourceFact,
        sourceFamilyId: "albanet-omw-sq-v0.1",
        sourceId: "albanet-omw-sq-v0.1:00000001-n:lemma=di",
        sourceUrlOrArchiveRef: "https://github.com/omwn/omw-data",
        entryLocator: "wns/als/wn-data-als.tab#synset=00000001-n;lemma=di",
        sourceDetails: {
          synsetId: "00000001-n",
          definitions: ["knowledge"],
          examples: ["Ai di."],
          relationTypes: ["als:def", "als:exe", "als:lemma"],
          license: "CC BY 3.0",
        },
      },
      functionalInterpretation: {
        status: "UNKNOWN_OR_NULL" as const,
        truthClassification: "unknown_or_null" as const,
        statement: null,
        evidenceKind: "none" as const,
        evidenceRefs: [],
        reason: "INSUFFICIENT_FUNCTIONAL_EVIDENCE",
      },
    };

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value: model({ candidates: [albaNetCandidate] }) }} />);

    expect(screen.getByText(/Source family: albanet-omw-sq-v0\.1/)).toBeInTheDocument();
    expect(screen.getByText(/Synset: 00000001-n/)).toBeInTheDocument();
    expect(screen.getByText(/Definitions: knowledge/)).toBeInTheDocument();
    expect(screen.getByText(/Examples: Ai di\./)).toBeInTheDocument();
    expect(screen.getByText(/License: CC BY 3\.0/)).toBeInTheDocument();
    expect(screen.getByText("Functional motivation unknown")).toBeInTheDocument();
  });

  it("labels source-backed identities separately from legacy synsets", () => {
    const candidate = model().candidates[0];
    render(<MotivationDiscoveryCardV0_1 discovery={{
      kind: "present",
      value: model({
        candidates: [{
          ...candidate,
          sourceFact: {
            ...candidate.sourceFact,
            sourceDetails: {
              sourceIdentity: "lexin-swedish-albanian-v0.1:word=20",
              definitions: [],
              examples: [],
              relationTypes: [],
            },
          },
        }],
      }),
    }} />);

    expect(screen.getByText(/Source identity: lexin-swedish-albanian-v0\.1:word=20/)).toBeInTheDocument();
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

    expect(screen.getByText("2 primary Discovery witnesses")).toBeInTheDocument();
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
    expect(screen.getByText("No authorized source witness supports a functional interpretation for this result.")).toBeInTheDocument();
    expect(screen.getByText("Exact Null reason code")).toBeInTheDocument();
    expect(screen.getByText("NO_GENERIC_AUTHORIZED_SOURCE_WITNESS")).toBeInTheDocument();
    expect(screen.queryByTestId("motivation-discovery-candidate")).not.toBeInTheDocument();
  });

  it("keeps an unmapped Null reason visible and conservative while preserving its exact code in details", () => {
    const candidate = model().candidates[0];
    const value = model({
      candidates: [{
        ...candidate,
        functionalInterpretation: {
          ...candidate.functionalInterpretation,
          status: "UNKNOWN_OR_NULL",
          truthClassification: "unknown_or_null",
          statement: null,
          evidenceKind: "none",
          evidenceRefs: [],
          reason: "UNMAPPED_NULL_REASON_EXAMPLE",
        },
      }],
    });

    render(<MotivationDiscoveryCardV0_1 discovery={{ kind: "present", value }} />);

    expect(screen.getByText("Unclassified interpretation state: UNMAPPED_NULL_REASON_EXAMPLE")).toBeInTheDocument();
    expect(screen.getByTestId("motivation-candidate-details")).toHaveTextContent(
      "Functional reason: UNMAPPED_NULL_REASON_EXAMPLE",
    );
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
    expect(screen.getByTestId("motivation-lexical-self-match-summary")).toHaveTextContent(
      "LEXICAL SELF-MATCH / ENTRY CONFIRMATION",
    );
    expect(screen.getByTestId("motivation-lexical-self-match-summary")).toHaveTextContent(
      "not a cross-form functional motivation claim",
    );
    expect(screen.getAllByText(/lexical entry confirmation/i).length).toBeGreaterThan(0);
    expect(screen.getByTestId("motivation-structural-comparison")).toHaveTextContent(
      "not a cross-form structural motivation claim",
    );
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

  it("aggregates same-witness records while retaining every source record", () => {
    const first = model().candidates[0];
    const second = {
      ...first,
      candidateId: "discovery:study:di:sense-2",
      candidateGloss: "understanding",
      sourceFact: {
        ...first.sourceFact,
        sourceFamilyId: "fixture.source.family.v0_1",
        sourceId: "fixture.source.family.v0_1#sense-2",
        evidenceRefs: ["fixture.citation-2"],
      },
    };
    const firstWithFamily = {
      ...first,
      sourceFact: {
        ...first.sourceFact,
        sourceFamilyId: "fixture.source.family.v0_1",
        sourceId: "fixture.source.family.v0_1#sense-1",
        evidenceRefs: ["fixture.citation-1"],
      },
    };

    const primaryWitnesses = aggregateMotivationDiscoveryCandidatesV0_1([
      firstWithFamily,
      second,
    ]);
    const metrics = measureMotivationDiscoveryAggregationV0_1(
      [firstWithFamily, second],
      primaryWitnesses,
    );

    expect(primaryWitnesses).toHaveLength(1);
    expect(primaryWitnesses[0].primaryWitnessId).not.toContain("#sense-1");
    expect(primaryWitnesses[0].primaryWitnessId).not.toContain("#sense-2");
    expect(primaryWitnesses[0].records).toHaveLength(2);
    expect(primaryWitnesses[0].records.map((record) => record.sourceFact.sourceId)).toEqual([
      "fixture.source.family.v0_1#sense-1",
      "fixture.source.family.v0_1#sense-2",
    ]);
    expect(metrics).toMatchObject({
      rawCandidateRecordCount: 2,
      primaryWitnessCount: 1,
      aggregatedRecordCount: 2,
      aggregationReductionRatio: 0.5,
      aggregationReductionPercentage: 50,
      evidenceLedgerRecordCount: 2,
      recordsLost: 0,
    });

    render(
      <MotivationDiscoveryCardV0_1
        discovery={{ kind: "present", value: model({ candidates: [firstWithFamily, second] }) }}
      />,
    );
    expect(screen.getByText("1 primary Discovery witness")).toBeInTheDocument();
    expect(screen.getAllByTestId("motivation-evidence-ledger-record")).toHaveLength(2);
    expect(screen.getByText("fixture.source.family.v0_1#sense-1")).toBeInTheDocument();
    expect(screen.getByText("fixture.source.family.v0_1#sense-2")).toBeInTheDocument();
  });

  it("does not over-merge materially different witnesses", () => {
    const first = model().candidates[0];
    const differentReason = {
      ...first,
      candidateId: "discovery:study:di:different-reason",
      sourceFact: {
        ...first.sourceFact,
        sourceFamilyId: "fixture.source.family.v0_1",
        sourceId: "fixture.source.family.v0_1#different-reason",
      },
      structuralComparison: {
        ...first.structuralComparison,
        matchReason: "A materially different authorized entry reason.",
      },
    };

    const primaryWitnesses = aggregateMotivationDiscoveryCandidatesV0_1([
      first,
      differentReason,
    ]);

    expect(primaryWitnesses).toHaveLength(2);
    expect(primaryWitnesses.every((witness) => witness.records.length === 1)).toBe(true);
  });

  it.each(["study", "studies", "learning", "zemër", "stone"])(
    "preserves the complete evidence ledger for regression input %s",
    async (word) => {
      const response = await GET(
        new Request(`http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict&alphabet=auto`),
      );
      const vm = adaptAnalysisToTelemetryVM(await response.json());
      if (vm.motivationDiscoveryV0_1.kind !== "present") {
        throw new Error(`missing Discovery VM for ${word}`);
      }
      expect(vm.motivationDiscoveryV0_1.value.candidates.every(
        (candidate) => typeof candidate.sourceFact.sourceFamilyId === "string",
      )).toBe(true);

      const primaryWitnesses = aggregateMotivationDiscoveryCandidatesV0_1(
        vm.motivationDiscoveryV0_1.value.candidates,
      );
      const metrics = measureMotivationDiscoveryAggregationV0_1(
        vm.motivationDiscoveryV0_1.value.candidates,
        primaryWitnesses,
      );
      console.info("DISCOVERY_AGGREGATION_REGRESSION", word, metrics);

      expect(metrics.evidenceLedgerRecordCount).toBe(metrics.rawCandidateRecordCount);
      expect(metrics.recordsLost).toBe(0);
      expect(metrics.primaryWitnessCount).toBeLessThanOrEqual(metrics.rawCandidateRecordCount);
    },
  );
});
