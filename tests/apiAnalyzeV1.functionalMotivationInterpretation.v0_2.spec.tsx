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
    expect(screen.getAllByText("ZË-RO FUNCTIONAL HYPOTHESIS").length).toBeGreaterThan(0);
    expect(screen.getByText(/No winner · user decides · historical relation not claimed/)).toBeInTheDocument();
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
