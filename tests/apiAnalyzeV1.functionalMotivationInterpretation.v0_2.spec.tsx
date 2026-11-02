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
      voiceRelationship: "NOT_COMPARABLE_ACROSS_REPRESENTATIONS",
    });
    expect(di.sourceFact).toMatchObject({
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

    expect(da).toBeTruthy();
    expect(interpretation.input.targetSense).toBeNull();
    expect(da.sourceFact).toMatchObject({
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
    expect(da.correspondence).toMatchObject({
      candidateVoicePath: [],
      candidateVoicePathStatus: "NULL_UNAUTHORIZED",
      candidateRepresentationKind: "orthographic_profile_derived",
      voiceRelationship: "UNKNOWN",
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
      claimBoundary:
        "reviewed lexical functional evidence only; this does not establish exact target-sense correspondence or an independently demonstrated embryo function, and it makes no historical-origin claim",
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

    expect(at).toMatchObject({
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
