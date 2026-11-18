/** @jest-environment jsdom */

import React from "react";
import { render, screen, within } from "@testing-library/react";

import { GET } from "@/app/api/analyze-v1/route";
import { runAnalysisDeterministic } from "@/lib/runAnalysisDeterministic";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import {
  buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1,
} from "@/shared/deepRoot.rootMap.builder.v1";
import type { RootMapV1 } from "@/shared/deepRoot.rootMap.v1";
import {
  buildWordSpecificFunctionalDepthV0_1,
} from "@/shared/openInstrument/wordSpecificFunctionalDepth.v0_1";
import {
  toWordSpecificFunctionalDepthV0_2,
} from "@/shared/openInstrument/wordSpecificFunctionalDepth.v0_2";
import { adaptAnalysisToTelemetryVM } from "@/ui/instrument/contractAdapter";
import { EmbryoExpansionContextCardV0_1 } from "@/ui/instrument/sections/EmbryoExpansionContextCard.v0_1";

async function analyze(word: string) {
  const payload = await runAnalysisDeterministic(word, {
    mode: "strict",
    alphabet: "auto",
  });
  return enginePayloadToAnalysisResult(payload);
}

describe("word-specific functional depth Overview v0.1", () => {
  it("shows target-authorized STUDIM component evidence without presenting a whole-word derivation", async () => {
    const result = await analyze("STUDIM");
    const depth = result.wordSpecificFunctionalDepth;

    expect(depth?.status).toBe("reviewed_functional_evidence");
    expect(depth?.authorityClass).toBe("reviewed_functional");
    expect(depth?.results).toHaveLength(1);

    const di = depth?.results[0];
    expect(di).toMatchObject({
      candidateId: "albanian-di-know-functional",
      form: "di",
      sourceKind: "reviewed_dictionary_source",
      sourceStatus: "reviewed_accepted",
      authorityClass: "reviewed_functional",
      embryo: "DI",
      semanticBridge:
        "knowledge can motivate study and learning functionally without making a historical-origin claim",
      evidenceRefs: [
        "reviewed.external.di.knowledge.candidate.citation.v0_1",
      ],
      claimBoundary:
        "functional motivation evidence only; not historical origin",
      userDecisionPosture: "user_decides",
      noSingleWinner: true,
    });

    const rootMap = (result as unknown as { rootMap?: RootMapV1 }).rootMap;
    expect(rootMap).toBeDefined();
    const sameTarget = buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1({
      targetWord: "STUDIM",
      rootMap,
    });
    expect(sameTarget.map((candidate) => candidate.candidateId)).toContain(
      "albanian-di-know-functional",
    );
    const mismatchedCandidates =
      buildReviewedFunctionalCandidateProjectionsFromRootMapV0_1({
        targetWord: "DALLIM",
        rootMap,
      });
    expect(mismatchedCandidates).toEqual([]);
    expect(
      buildWordSpecificFunctionalDepthV0_1({
        word: "DALLIM",
        analysisStatus: result.analysisStatusV0_1,
        candidates: mismatchedCandidates,
      }),
    ).toMatchObject({
      status: null,
      results: [],
      nullReason: "no_supported_word_specific_functional_motivation",
    });

    const response = await GET(
      new Request(
        "http://localhost/api/analyze-v1?word=STUDIM&mode=strict&alphabet=auto",
      ),
    );
    expect(response.status).toBe(200);
    const apiResult = await response.json();
    expect(apiResult.word).toBe("STUDIM");
    expect(apiResult.functionalMotivationInterpretationV0_3.status).toBe(
      "NO_SUPPORTED_INTERPRETATION",
    );
    expect(
      apiResult.functionalMotivationInterpretationV0_3.unresolved,
    ).toContainEqual({
      layer: "UNKNOWN_OR_NULL",
      reason: "MISSING_TARGET_SENSE",
    });
    expect(
      apiResult.functionalMotivationInterpretationV0_3.candidates.every(
        (candidate: { hypothesis: { status: string } }) =>
          candidate.hypothesis.status === "UNKNOWN_OR_NULL",
      ),
    ).toBe(true);

    const vm = adaptAnalysisToTelemetryVM(apiResult);
    const { rerender } = render(
      <EmbryoExpansionContextCardV0_1 vm={vm} showPrimaryEvidence />,
    );

    const section = screen.getByTestId("word-specific-functional-depth");
    const contribution = screen.getByTestId(
      "word-specific-functional-depth-result-albanian-di-know-functional",
    );

    expect(section).toBeVisible();
    expect(within(contribution).getByText("di", { exact: true })).toBeVisible();
    expect(within(contribution).getByText("DI", { exact: true })).toBeVisible();
    expect(
      within(contribution).getByText(
        "knowledge can motivate study and learning functionally without making a historical-origin claim",
      ),
    ).toBeVisible();
    expect(
      within(contribution).getByText(
        "reviewed.external.di.knowledge.candidate.citation.v0_1",
      ),
    ).toBeVisible();
    expect(
      within(contribution).getByText(
        "functional motivation evidence only; not historical origin",
      ),
    ).toBeVisible();

    expect(
      screen.getByTestId("word-specific-functional-depth-whole-word-boundary"),
    ).toHaveTextContent(
      "does not, by itself, establish a verified derivation or complete functional interpretation of STUDIM",
    );
    expect(
      screen.getByTestId("word-specific-functional-depth-decision-posture"),
    ).toHaveTextContent("separate and unranked");
    expect(
      screen.getByTestId("word-specific-functional-depth-decision-posture"),
    ).toHaveTextContent("No interpretation is selected automatically");
    expect(within(section).queryByRole("combobox")).toBeNull();
    expect(within(section).queryByRole("button")).toBeNull();

    expect(
      screen.getByTestId(
        "word-specific-functional-depth-interpretation",
      ),
    ).toHaveTextContent("NO_SUPPORTED_INTERPRETATION");
    expect(
      screen.getByTestId(
        "word-specific-functional-depth-missing-target-sense",
      ),
    ).toHaveTextContent("MISSING_TARGET_SENSE");

    const interpretationField = vm.functionalMotivationInterpretationV0_3;
    expect(interpretationField?.kind).toBe("present");
    if (interpretationField?.kind === "present") {
      rerender(
        <EmbryoExpansionContextCardV0_1
          vm={{
            ...vm,
            functionalMotivationInterpretationV0_3: {
              kind: "present",
              value: {
                ...interpretationField.value,
                unresolved: interpretationField.value.unresolved.filter(
                  (item) => item.reason !== "MISSING_TARGET_SENSE",
                ),
              },
            },
          }}
          showPrimaryEvidence
        />,
      );
      expect(
        screen.queryByTestId(
          "word-specific-functional-depth-missing-target-sense",
        ),
      ).toBeNull();
    }
  });

  it.each(["DALLIM", "NDRIÇIM", "GJITHÇKA", "KANDIL"])(
    "preserves truthful functional-depth Null for %s",
    async (word) => {
      const result = await analyze(word);
      expect(result.wordSpecificFunctionalDepth).toMatchObject({
        status: null,
        authorityClass: null,
        results: [],
        nullReason: "no_supported_word_specific_functional_motivation",
      });

      const vm = adaptAnalysisToTelemetryVM(result);
      const { unmount } = render(
        <EmbryoExpansionContextCardV0_1 vm={vm} showPrimaryEvidence />,
      );
      const section = screen.getByTestId("word-specific-functional-depth");
      expect(section).toHaveTextContent(
        "No supported word-specific functional motivation yet.",
      );
      expect(section).toHaveTextContent(
        "no_supported_word_specific_functional_motivation",
      );
      expect(section).not.toHaveTextContent(
        "knowledge can motivate study and learning",
      );
      unmount();
    },
  );

  it("keeps result records distinct and labels research separately from reviewed evidence", async () => {
    const result = await analyze("study");
    const vm = adaptAnalysisToTelemetryVM(result);
    const reviewedDepth =
      vm.wordSpecificFunctionalDepth?.kind === "present"
        ? vm.wordSpecificFunctionalDepth.value
        : null;

    expect(reviewedDepth?.authorityClass).toBe("reviewed_functional");
    expect(reviewedDepth?.results[0]).toBeDefined();

    const first = reviewedDepth!.results[0];
    const second = {
      ...first,
      candidateId: "test-only-second-result",
      form: "test-only-second-form",
      evidenceRefs: ["test.only.word-specific-depth.presentation"],
    };
    const multipleDepth = toWordSpecificFunctionalDepthV0_2({
      ...reviewedDepth!,
      results: [first, second],
      evidenceRefs: [
        ...reviewedDepth!.evidenceRefs,
        "test.only.word-specific-depth.presentation",
      ],
    });
    expect(multipleDepth).not.toBeNull();
    if (!multipleDepth) throw new Error("presentation test depth should validate");

    const multiVm = {
      ...vm,
      wordSpecificFunctionalDepth: {
        kind: "present" as const,
        value: multipleDepth,
      },
    };
    const { unmount } = render(
      <EmbryoExpansionContextCardV0_1 vm={multiVm} />,
    );
    const list = screen.getByTestId(
      "word-specific-functional-depth-results",
    );
    expect(
      within(list).getByTestId(
        "word-specific-functional-depth-result-" + first.candidateId,
      ),
    ).toBeVisible();
    expect(
      within(list).getByTestId(
        "word-specific-functional-depth-result-test-only-second-result",
      ),
    ).toBeVisible();
    expect(
      screen.getByTestId("word-specific-functional-depth-decision-posture"),
    ).toHaveTextContent("unranked");
    unmount();

    const researchDepth = buildWordSpecificFunctionalDepthV0_1({
      word: "study",
      analysisStatus: {
        ...result.analysisStatusV0_1!,
        status: "research_functional_hypothesis",
      },
      candidates: [
        {
          id: "test-only-research-candidate",
          form: "test-only research form",
          sourceKind: "multi_source_research_witness",
          sourceStatus: "research_candidate",
          claimType: "functionalMotivation",
          evidenceBasis: "functional_correspondence",
          attestationTruth: "fact",
          functionalBridgeTruth: "hypothesis",
          targetWord: "study",
          semanticBridge: "TEST_ONLY research bridge display",
          evidenceRefs: ["test.only.research-functional-depth"],
          claimBoundary: "research_functional_hypothesis_only",
          userDecisionPosture: "user_decides",
        },
      ],
    });
    const researchDepthV0_2 =
      toWordSpecificFunctionalDepthV0_2(researchDepth);
    expect(researchDepthV0_2?.authorityClass).toBe("research_functional");
    if (!researchDepthV0_2) {
      throw new Error("research presentation test depth should validate");
    }

    const researchVm = {
      ...vm,
      wordSpecificFunctionalDepth: {
        kind: "present" as const,
        value: researchDepthV0_2,
      },
    };
    render(<EmbryoExpansionContextCardV0_1 vm={researchVm} />);
    const researchCard = screen.getByTestId(
      "word-specific-functional-depth-result-test-only-research-candidate",
    );
    expect(within(researchCard).getByText("Research functional hypothesis")).toBeVisible();
    expect(within(researchCard).getByText("research_functional")).toBeVisible();
    expect(within(researchCard).getByText("TEST_ONLY research bridge display")).toBeVisible();
  });
});
