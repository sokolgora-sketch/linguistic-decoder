import React from "react";
import { render, screen, within } from "@testing-library/react";

import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { EmbryoExpansionContextCardV0_1 } from "@/ui/instrument/sections/EmbryoExpansionContextCard.v0_1";
import { GET } from "@/app/api/analyze-v1/route";

async function analyze(word: string) {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet: "auto",
  });
  return enginePayloadToAnalysisResult(payload);
}

describe("word-specific functional depth runtime v0.1", () => {
  it("projects reviewed Study depth without replacing the existing candidate surface", async () => {
    const result = await analyze("study");

    expect(result.analysisStatusV0_1?.status).toBe("reviewed_functional_evidence");
    expect(result.candidates?.[0]?.candidateId).toBe("albanian-di-know-functional");
    expect(result.wordSpecificFunctionalDepth?.status).toBe("reviewed_functional_evidence");
    expect(result.wordSpecificFunctionalDepth?.results.map((item) => item.form)).toEqual(["di"]);
    expect(result.wordSpecificFunctionalDepth?.noSingleWinner).toBe(true);

    const response = await GET(
      new Request("http://localhost/api/analyze-v1?word=study&mode=strict&alphabet=auto"),
    );
    expect(response.status).toBe(200);
    const apiBody = await response.json();
    expect(apiBody.wordSpecificFunctionalDepth?.status).toBe("reviewed_functional_evidence");
    expect(apiBody.wordSpecificFunctionalDepth?.results).toHaveLength(1);

    const vm = adaptAnalysisToTelemetryVM(result);
    expect(vm.wordSpecificFunctionalDepth.kind).toBe("present");
    if (vm.wordSpecificFunctionalDepth.kind === "present") {
      expect(vm.wordSpecificFunctionalDepth.value.authorityClass).toBe("reviewed_functional");
    }

    render(
      <EmbryoExpansionContextCardV0_1
        vm={vm}
        showPrimaryEvidence
      />,
    );

    expect(screen.getByTestId("word-specific-functional-depth")).toBeVisible();
    expect(screen.getByText("Reviewed functional motivation")).toBeVisible();
    expect(within(screen.getByTestId("word-specific-functional-depth")).getByText("di")).toBeVisible();
    expect(screen.getByText(/No single candidate is selected\. User decides\./)).toBeVisible();
  });

  it("aligns the explicitly authorized reviewed lexical father row with word-specific depth", async () => {
    const result = await analyze("father");

    expect(result.analysisStatusV0_1?.status).toBe("reviewed_functional_evidence");
    expect(result.candidates?.find((candidate) => candidate.form === "at")?.sourceKind).toBe(
      "reviewed_lexical_source",
    );
    expect(result.wordSpecificFunctionalDepth).toMatchObject({
      status: "reviewed_functional_evidence",
      authorityClass: "reviewed_functional",
      evidenceRefs: ["reviewed.external.albanian-at.father.citation.v0_1"],
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });

    const vm = adaptAnalysisToTelemetryVM(result);
    render(
      <EmbryoExpansionContextCardV0_1
        vm={vm}
        showPrimaryEvidence
      />,
    );

    expect(screen.getByTestId("word-specific-functional-depth")).toBeVisible();
    expect(screen.getByText("Reviewed functional motivation")).toBeVisible();
    expect(
      within(screen.getByTestId("word-specific-functional-depth")).getByText("at"),
    ).toBeVisible();
    expect(screen.queryByText("No supported word-specific functional motivation yet.")).toBeNull();
    expect(screen.getByText(/No single candidate is selected\. User decides\./)).toBeVisible();
  });

  it("emits a truthful Null depth for a structural Null without suppressing the existing analysis state", async () => {
    const result = await analyze("head");

    expect(result.analysisStatusV0_1?.status).toBe("null_no_supported_candidate");
    expect(result.wordSpecificFunctionalDepth).toMatchObject({
      status: null,
      authorityClass: null,
      results: [],
      nullReason: "no_supported_word_specific_functional_motivation",
    });

    const vm = adaptAnalysisToTelemetryVM(result);
    expect(vm.wordSpecificFunctionalDepth.kind).toBe("present");
    if (vm.wordSpecificFunctionalDepth.kind === "present") {
      expect(vm.wordSpecificFunctionalDepth.value.status).toBeNull();
    }
    render(<EmbryoExpansionContextCardV0_1 vm={vm} />);

    expect(screen.getByTestId("word-specific-functional-depth")).toBeVisible();
    expect(screen.getByText("No supported word-specific functional motivation yet.")).toBeVisible();
    expect(screen.getByText("No supported functional candidate yet.")).toBeVisible();
  });

  it("keeps same-path controls and long paths structural when no word-specific depth is authorized", async () => {
    const apiAnalyze = async (word: string) => {
      const response = await GET(
        new Request(`http://localhost/api/analyze-v1?word=${word}&mode=strict&alphabet=auto`),
      );
      expect(response.status).toBe(200);
      return response.json();
    };

    const [head, sea, water, candle, mountain] = await Promise.all(
      ["head", "sea", "water", "candle", "mountain"].map(apiAnalyze),
    );

    expect(head.doctrineReading.analyzedVoicePath).toEqual(["E", "A"]);
    expect(sea.doctrineReading.analyzedVoicePath).toEqual(["E", "A"]);
    expect(water.doctrineReading.analyzedVoicePath).toEqual(["A", "E"]);
    expect(candle.doctrineReading.analyzedVoicePath).toEqual(["A", "E"]);
    expect(mountain.doctrineReading.analyzedVoicePath).toEqual(["O", "U", "A", "I"]);

    for (const body of [head, sea, water, candle, mountain]) {
      expect(body.wordSpecificFunctionalDepth).toMatchObject({
        status: null,
        results: [],
        nullReason: "no_supported_word_specific_functional_motivation",
      });
    }

    expect(sea.candidates.some((candidate: { expansionChain?: string[] }) =>
      candidate.expansionChain?.join(" → ") === "EA → SEA")).toBe(true);
    expect(water.candidates.some((candidate: { expansionChain?: string[] }) =>
      candidate.expansionChain?.join(" → ") === "AT → WAT → WATER")).toBe(true);
    expect(candle.candidates.some((candidate: { expansionChain?: string[] }) =>
      candidate.expansionChain?.join(" → ") === "AN → CAN → CANDLE")).toBe(true);
    expect(mountain.candidates.some((candidate: { expansionChain?: string[] }) =>
      candidate.expansionChain?.join(" → ") === "OUNT → MOUNT → MOUNTAIN")).toBe(true);
  });
});
