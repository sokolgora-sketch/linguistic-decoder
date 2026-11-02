import { render, screen } from "@testing-library/react";
import { POST } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { MotivationDiscoveryCardV0_1 } from "@/ui/instrument/sections/MotivationDiscoveryCard.v0_1";

async function analyze(body: Record<string, unknown>) {
  const response = await POST(
    new Request("http://localhost/api/analyze-v1", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
  return response.json();
}

describe("analyze-v1 Functional Motivation Interpretation v0.2 boundary", () => {
  it.each([
    ["damage", "reviewed.external.gheg-da.damage.candidate.v0_1"],
    ["study", "reviewed.external.di.knowledge.candidate.v0_1"],
    ["father", "reviewed.external.albanian-at.father.candidate.v0_1"],
  ])("keeps raw API and UI candidate Voice paths Null for %s", async (word, sourceId) => {
    const payload = await analyze({
      word,
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
    });
    const rawCandidates = payload.motivationDiscoveryV0_1.candidates.filter(
      (candidate: { sourceFact: { sourceId: string } }) =>
        candidate.sourceFact.sourceId === sourceId,
    );

    expect(rawCandidates.length).toBeGreaterThan(0);
    expect(rawCandidates.every((candidate: {
      candidateVoicePath: readonly string[];
      structuralComparison: { candidateVoicePath: readonly string[] };
    }) => candidate.candidateVoicePath.length === 0 &&
      candidate.structuralComparison.candidateVoicePath.length === 0)).toBe(true);

    const visible = adaptAnalysisToTelemetryVM(payload).motivationDiscoveryV0_1;
    expect(visible.kind).toBe("present");
    if (visible.kind !== "present") throw new Error("Expected UI discovery");
    const visibleCandidates = visible.value.candidates.filter(
      (candidate) => candidate.sourceFact.sourceId === sourceId,
    );
    expect(visibleCandidates.length).toBeGreaterThan(0);
    expect(visibleCandidates.every((candidate) =>
      candidate.candidateVoicePath.length === 0 &&
      candidate.structuralComparison.candidateVoicePath.length === 0,
    )).toBe(true);
  });

  it("does not let caller-supplied spoken labels or authority pass through the UI projection", async () => {
    const payload = await analyze({
      word: "study",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
    });
    const sourceCandidate = payload.motivationDiscoveryV0_1.candidates[0];
    const forgedDiscoveryCandidate = {
      ...sourceCandidate,
      candidateVoicePath: ["I"],
      sourceFact: {
        ...sourceCandidate.sourceFact,
        sourceId: "unreviewed.synthetic.candidate.v0_1",
        sourceProvenance: undefined,
      },
      structuralComparison: {
        ...sourceCandidate.structuralComparison,
        candidateRepresentationKind: "production_spoken",
        representationCompatibility: "SAME_REPRESENTATION",
        voiceRelationship: "EXACT_ORDERED_VOICE_MATCH",
        candidateVoicePath: ["I"],
      },
    };
    const sourceInterpretationCandidate =
      payload.functionalMotivationInterpretationV0_2.candidates.find(
        (candidate: { candidateId: string }) =>
          candidate.candidateId === sourceCandidate.candidateId,
      );
    expect(sourceInterpretationCandidate).toBeDefined();
    const forgedInterpretationCandidate = {
      ...sourceInterpretationCandidate,
      sourceFact: {
        ...sourceInterpretationCandidate.sourceFact,
        sourceId: "unreviewed.synthetic.candidate.v0_1",
        sourceProvenance: undefined,
      },
      correspondence: {
        ...sourceInterpretationCandidate.correspondence,
        candidateRepresentationKind: "production_spoken",
        representationCompatibility: "SAME_REPRESENTATION",
        voiceRelationship: "EXACT_ORDERED_VOICE_MATCH",
        candidateVoicePath: ["I"],
        candidateVoicePathStatus: "AUTHORIZED",
      },
    };
    const forgedPayload = {
      ...payload,
      motivationDiscoveryV0_1: {
        ...payload.motivationDiscoveryV0_1,
        candidates: [forgedDiscoveryCandidate],
      },
      functionalMotivationInterpretationV0_2: {
        ...payload.functionalMotivationInterpretationV0_2,
        candidates: [forgedInterpretationCandidate],
      },
    };

    const visible = adaptAnalysisToTelemetryVM(forgedPayload);
    const visibleDiscovery = visible.motivationDiscoveryV0_1;
    expect(visibleDiscovery.kind).toBe("present");
    if (visibleDiscovery.kind !== "present") throw new Error("Expected UI discovery");
    expect(visibleDiscovery.value.candidates[0]).toMatchObject({
      candidateVoicePath: [],
      structuralComparison: {
        candidateRepresentationKind: "orthographic_profile_derived",
        representationCompatibility: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
        voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
        candidateVoicePath: [],
      },
    });

    const visibleInterpretation = visible.functionalMotivationInterpretationV0_2;
    expect(visibleInterpretation.kind).toBe("present");
    if (visibleInterpretation.kind !== "present") {
      throw new Error("Expected UI interpretation");
    }
    expect(visibleInterpretation.value.candidates[0].correspondence).toMatchObject({
      candidateRepresentationKind: "orthographic_profile_derived",
      representationCompatibility: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
      voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
      candidateVoicePath: [],
      candidateVoicePathStatus: "NULL_UNAUTHORIZED",
    });
    expect(visibleInterpretation.value.candidates[0].correspondence.inputVoicePath)
      .toEqual(sourceInterpretationCandidate.correspondence.inputVoicePath);

    render(
      <MotivationDiscoveryCardV0_1
        discovery={visibleDiscovery}
        interpretation={visibleInterpretation}
      />,
    );
    expect(screen.getByText("NULL_UNAUTHORIZED")).toBeInTheDocument();
    expect(screen.queryByText("AUTHORIZED")).not.toBeInTheDocument();
    expect(
      screen.getByText("Candidate representation").nextElementSibling,
    ).toHaveTextContent("orthographic_profile_derived");
    // Input-side spoken authority remains visible and is not erased by the
    // candidate-side fail-closed projection.
    expect(screen.getByText("production_spoken")).toBeInTheDocument();
  });

  it("emits an additive structural record while missing target sense stays Null", async () => {
    const payload = await analyze({
      word: "study",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
    });

    expect(payload.motivationDiscoveryV0_1).toBeDefined();
    expect(payload.functionalMotivationInterpretationV0_2).toMatchObject({
      schemaVersion: "open-instrument.functional-motivation-interpretation.v0_2",
      status: "NO_SUPPORTED_INTERPRETATION",
      input: { targetSense: null },
      noSingleWinner: true,
      userDecisionPosture: "user_decides",
    });
    const di = payload.functionalMotivationInterpretationV0_2.candidates.find(
      (candidate: { candidateEmbryo: string }) => candidate.candidateEmbryo === "DI",
    );
    expect(di.hypothesis.reason).toBe("MISSING_TARGET_SENSE");
    expect(di.correspondence).toMatchObject({
      candidateVoicePath: [],
      candidateVoicePathStatus: "NULL_UNAUTHORIZED",
      candidateRepresentationKind: "orthographic_profile_derived",
    });
    const visibleInterpretation = adaptAnalysisToTelemetryVM(payload)
      .functionalMotivationInterpretationV0_2;
    expect(visibleInterpretation.kind).toBe("present");
    if (visibleInterpretation.kind !== "present") throw new Error("Expected UI interpretation");
    const visibleDi = visibleInterpretation.value.candidates.find(
      (candidate) => candidate.candidateEmbryo === "DI",
    );
    expect(visibleDi?.correspondence).toMatchObject({
      candidateVoicePath: [],
      candidateVoicePathStatus: "NULL_UNAUTHORIZED",
      candidateRepresentationKind: "orthographic_profile_derived",
      voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
    });
    expect(visibleDi?.sourceFact).toMatchObject({
      language: "sq",
      sourceProvenance: {
        languageVariety: null,
        attestedGrammarNote:
          "Albanian standalone verb di; entry lists IPA /di/, aorist dita, participle ditur, and glosses the verb as to know.",
      },
    });
    expect(payload.analysisStatusV0_1).toBeDefined();
  });

  it("keeps a cross-representation candidate Null even with explicit target sense", async () => {
    const payload = await analyze({
      word: "study",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
      targetSenseId: "user_sense_learning",
      targetSenseLabel: "learning",
    });
    const interpretation = payload.functionalMotivationInterpretationV0_2;
    const di = interpretation.candidates.find(
      (candidate: { candidateEmbryo: string }) => candidate.candidateEmbryo === "DI",
    );

    expect(interpretation.status).toBe("NO_SUPPORTED_INTERPRETATION");
    expect(di.hypothesis.status).toBe("UNKNOWN_OR_NULL");
    expect(di.hypothesis.reason).toBe("NO_AUTHORIZED_STRUCTURAL_RELATION");
    expect(di.reviewedFunctionalEvidence.authorityStatus).toBe("REVIEWED_ACCEPTED");
    expect(interpretation.candidates.length).toBeGreaterThan(1);
    expect(interpretation.candidates.every((candidate: { noSingleWinner: boolean }) => candidate.noSingleWinner)).toBe(true);
    expect(interpretation.claimBoundary.languageSuperiorityClaim).toBe("not_claimed");
  });

  it("preserves DA source provenance and keeps its target-sense hypothesis Null", async () => {
    const payload = await analyze({
      word: "damage",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
    });
    const interpretation = payload.functionalMotivationInterpretationV0_2;
    const da = interpretation.candidates.find(
      (candidate: { candidateEmbryo: string }) => candidate.candidateEmbryo === "DA",
    );
    const visibleInterpretation = adaptAnalysisToTelemetryVM(payload)
      .functionalMotivationInterpretationV0_2;
    expect(visibleInterpretation.kind).toBe("present");
    if (visibleInterpretation.kind !== "present") throw new Error("Expected UI interpretation");
    const visibleDa = visibleInterpretation.value.candidates.find(
      (candidate) => candidate.candidateEmbryo === "DA",
    );

    expect(da).toBeTruthy();
    expect(da?.correspondence).toMatchObject({
      candidateVoicePath: [],
      candidateVoicePathStatus: "NULL_UNAUTHORIZED",
      candidateRepresentationKind: "orthographic_profile_derived",
    });
    expect(interpretation.input.targetSense).toBeNull();
    expect(visibleDa?.sourceFact).toMatchObject({
      sourceId: "reviewed.external.gheg-da.damage.candidate.v0_1",
      citationRefs: ["reviewed.external.gheg-da.damage.candidate.citation.v0_1"],
      sourceProvenance: {
        sourceTitle: "Linguistic variation within the Northwestern Gheg Albanian dialect",
        sourceDateOrVersion: "2023; volume 8, issue 1; article 5501",
        sourceUrlOrArchiveRef: "https://doi.org/10.3765/plsa.v8i1.5501",
        entryLocator: "Example (4), page 3; footnote 1",
        sourceHashOrArchiveHash: "doi:10.3765/plsa.v8i1.5501",
        languageVariety: null,
        attestedGrammarNote:
          "Malsia/Northwestern Gheg Albanian verb form; paper lists Malsia da [dɔː] with Shkodër/Lezhë [dɔː], [ndɔː] in example (4)",
      },
    });
    expect(visibleDa?.correspondence).toMatchObject({
      candidateVoicePath: [],
      candidateVoicePathStatus: "NULL_UNAUTHORIZED",
      candidateRepresentationKind: "orthographic_profile_derived",
      voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
    });
    expect(da.hypothesis).toMatchObject({
      status: "UNKNOWN_OR_NULL",
      reason: "MISSING_TARGET_SENSE",
      statement: null,
    });
    const rootMapDa = payload.candidates.find(
      (candidate: { candidateId?: string }) =>
        candidate.candidateId === "albanian-da-dam-damage-functional",
    );
    expect(rootMapDa).toMatchObject({
      status: "experimental",
      validationOutcome: "validated",
      rankGroup: "validatedFunctionalMotivation",
      claimBoundary: "functional motivation evidence only; not historical origin",
    });
  });

  it("keeps the AT source note descriptive and its candidate Voice path Null", async () => {
    const payload = await analyze({
      word: "father",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
    });
    const at = payload.functionalMotivationInterpretationV0_2.candidates.find(
      (candidate: { candidateEmbryo: string }) => candidate.candidateEmbryo === "AT",
    );
    const visibleInterpretation = adaptAnalysisToTelemetryVM(payload)
      .functionalMotivationInterpretationV0_2;
    expect(visibleInterpretation.kind).toBe("present");
    if (visibleInterpretation.kind !== "present") throw new Error("Expected UI interpretation");
    const visibleAt = visibleInterpretation.value.candidates.find(
      (candidate) => candidate.candidateEmbryo === "AT",
    );
    const vm = adaptAnalysisToTelemetryVM(payload);

    expect(at).toBeTruthy();
    expect(at?.correspondence).toMatchObject({
      candidateVoicePath: [],
      candidateVoicePathStatus: "NULL_UNAUTHORIZED",
      candidateRepresentationKind: "orthographic_profile_derived",
    });
    expect(visibleAt).toMatchObject({
      sourceFact: {
        sourceId: "reviewed.external.albanian-at.father.candidate.v0_1",
        sourceProvenance: {
          entryLocator:
            "at [m] (tg) {2} 'father'; Alb. atë [m] (tg) 'father' (AE 83)",
          languageVariety: null,
          attestedGrammarNote:
            "(tg) marks the form as both Tosk and Gheg; the entry also records Albanian atë as father.",
        },
      },
      correspondence: {
        candidateVoicePath: [],
        candidateVoicePathStatus: "NULL_UNAUTHORIZED",
      },
    });

    render(
      <MotivationDiscoveryCardV0_1
        discovery={vm.motivationDiscoveryV0_1}
        interpretation={vm.functionalMotivationInterpretationV0_2}
      />,
    );
    expect(screen.getAllByText(/Candidate Voice path: NULL_UNAUTHORIZED/).length)
      .toBeGreaterThan(0);
  });

  it("keeps STERILE structural hypotheses visible without candidate Voice authorization", async () => {
    const payload = await analyze({
      word: "sterile",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
    });
    const interpretation = payload.functionalMotivationInterpretationV0_2;
    const hypotheses = interpretation.input.derivedStructure.structuralHypotheses;
    expect(hypotheses.map((hypothesis: { embryo: string }) => hypothesis.embryo)).toEqual([
      "ER",
      "ERILE",
    ]);
    expect(interpretation.candidates.every((candidate: {
      correspondence: {
        candidateVoicePath: readonly string[];
        candidateVoicePathStatus: string;
      };
    }) => candidate.correspondence.candidateVoicePath.length === 0 &&
      candidate.correspondence.candidateVoicePathStatus === "NULL_UNAUTHORIZED")).toBe(true);

    const vm = adaptAnalysisToTelemetryVM(payload);
    const visible = vm.functionalMotivationInterpretationV0_2;
    expect(visible.kind).toBe("present");
    if (visible.kind !== "present") throw new Error("Expected UI interpretation");
    expect(visible.value.candidates.every((candidate) =>
      candidate.correspondence.candidateVoicePath.length === 0 &&
      candidate.correspondence.candidateVoicePathStatus === "NULL_UNAUTHORIZED",
    )).toBe(true);

    render(
      <MotivationDiscoveryCardV0_1
        discovery={vm.motivationDiscoveryV0_1}
        interpretation={vm.functionalMotivationInterpretationV0_2}
      />,
    );
    expect(screen.getByTestId("functional-motivation-interpretation")).toBeInTheDocument();
    if (visible.value.candidates.length > 0) {
      expect(screen.getAllByText(/Candidate Voice path: NULL_UNAUTHORIZED/).length)
        .toBeGreaterThan(0);
    }
  });

  it("renders the interpretation layers through the existing Motivation Discovery card", async () => {
    const payload = await analyze({
      word: "study",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
      targetSenseId: "user_sense_learning",
      targetSenseLabel: "learning",
    });
    const vm = adaptAnalysisToTelemetryVM(payload);
    const discovery = vm.motivationDiscoveryV0_1;
    expect(discovery?.kind).toBe("present");
    if (discovery?.kind !== "present") throw new Error("Expected UI discovery");
    const displayedDi = discovery.value.candidates.find(
      (candidate) => candidate.candidateEmbryo === "DI",
    );
    expect(displayedDi?.candidateVoicePath).toEqual([]);
    expect(displayedDi?.structuralComparison.candidateVoicePath).toEqual([]);

    render(
      <MotivationDiscoveryCardV0_1
        discovery={vm.motivationDiscoveryV0_1}
        interpretation={vm.functionalMotivationInterpretationV0_2}
      />,
    );

    expect(screen.getByTestId("functional-motivation-interpretation")).toBeInTheDocument();
    expect(screen.getByText("STRUCTURAL FACTS")).toBeInTheDocument();
    expect(screen.getAllByText("CANDIDATE CORRESPONDENCE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("REVIEWED FUNCTIONAL EVIDENCE").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Candidate Voice authority").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Candidate Voice path: NULL_UNAUTHORIZED/).length).toBeGreaterThan(0);
    expect(screen.getAllByText("NULL_UNAUTHORIZED").length).toBeGreaterThan(0);
    expect(screen.getAllByText("ZË-RO FUNCTIONAL HYPOTHESIS").length).toBeGreaterThan(0);
    expect(screen.getAllByText("This candidate and input do not have an authorized structural relation for this comparison.").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Interpretation reason code: NO_AUTHORIZED_STRUCTURAL_RELATION/).length).toBeGreaterThan(0);
    expect(screen.getByText(/No winner · user decides · historical relation not claimed/)).toBeInTheDocument();
  });

  it("renders the DA source note and explicit Null Voice authority", async () => {
    const payload = await analyze({
      word: "damage",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
    });
    const vm = adaptAnalysisToTelemetryVM(payload);

    render(
      <MotivationDiscoveryCardV0_1
        discovery={vm.motivationDiscoveryV0_1}
        interpretation={vm.functionalMotivationInterpretationV0_2}
      />,
    );
    expect(screen.getAllByText("Candidate Voice authority").length).toBeGreaterThan(0);
    expect(screen.getAllByText("NULL_UNAUTHORIZED").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Source-authored grammar\/dialect\/pronunciation note \(descriptive only; not a structured dialect profile or Voice mapping\): Malsia\/Northwestern Gheg Albanian verb form/).length).toBeGreaterThan(0);
  });

  it("translates a mapped Null reason in the primary layer while retaining the exact code", async () => {
    const payload = await analyze({
      word: "study",
      mode: "strict",
      alphabet: "auto",
      providerExecution: "disabled",
    });
    const vm = adaptAnalysisToTelemetryVM(payload);

    render(
      <MotivationDiscoveryCardV0_1
        discovery={vm.motivationDiscoveryV0_1}
        interpretation={vm.functionalMotivationInterpretationV0_2}
      />,
    );

    expect(screen.getAllByText("A target sense was not supplied, so no functional bridge was authorized.").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Interpretation reason code: MISSING_TARGET_SENSE/).length).toBeGreaterThan(0);
  });

  it("fails closed when the optional interpretation field is present but malformed", () => {
    const vm = adaptAnalysisToTelemetryVM({
      word: "study",
      functionalMotivationInterpretationV0_2: { schemaVersion: "wrong" },
    });

    expect(vm.functionalMotivationInterpretationV0_2).toMatchObject({
      kind: "missing",
      missing: "malformed",
    });
  });
});
