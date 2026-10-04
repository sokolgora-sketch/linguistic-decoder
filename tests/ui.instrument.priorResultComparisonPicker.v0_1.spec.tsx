require("./helpers/whatwgGlobals.cjs");

import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import {
  MAX_RECENT_ANALYSIS_PICKER_RESULTS_V0_1,
  projectRecentAnalysisResultsV0_1,
} from "../src/ui/instrument/recentAnalysisResults.v0_1";
import { WordToWordStructuralAuthorityComparisonCard } from "../src/ui/instrument/sections/WordToWordStructuralAuthorityComparisonCard.v0_1";

async function analyze(word: string): Promise<unknown> {
  const response = await GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
  } as any);
  expect(response.status).toBe(200);
  return response.json();
}

describe("prior result comparison picker v0.1", () => {
  test("projects only successful in-session results in bounded newest-first order", async () => {
    const stone = await analyze("stone");
    const home = await analyze("home");
    const messages = [
      { id: "user-1", role: "user" as const },
      ...Array.from({ length: MAX_RECENT_ANALYSIS_PICKER_RESULTS_V0_1 + 1 }, (_, index) => ({
        id: `assistant-${index}`,
        role: "assistant" as const,
        instrumentPayload: index % 2 === 0 ? stone : home,
        ...(index === 1
          ? { ipa: "stəʊn", targetSenseLabel: "stone (custom sense)" }
          : {}),
      })),
      { id: "failed-assistant", role: "assistant" as const, instrumentPayload: null },
    ];

    const projected = projectRecentAnalysisResultsV0_1(messages, adaptAnalysisToTelemetryVM);

    expect(projected).toHaveLength(MAX_RECENT_ANALYSIS_PICKER_RESULTS_V0_1);
    expect(projected[0]?.id).toBe("assistant-12");
    expect(projected.at(-1)?.id).toBe("assistant-1");
    expect(projected.map((entry) => entry.vm.readout.word)).toEqual(
      expect.arrayContaining(["stone", "home"]),
    );
    expect(new Set(projected.map((entry) => entry.id)).size).toBe(
      MAX_RECENT_ANALYSIS_PICKER_RESULTS_V0_1,
    );
    const retainedCustomRun = projected.find((entry) => entry.id === "assistant-1");
    expect(retainedCustomRun?.ipa).toBe("stəʊn");
    expect(retainedCustomRun?.targetSenseLabel).toBe("stone (custom sense)");
  });

  test("assigns distinct prior results to LEFT and RIGHT without rerunning analysis", async () => {
    const stone = await analyze("stone");
    const home = await analyze("home");
    const recentResults = projectRecentAnalysisResultsV0_1([
      { id: "stone-result", role: "assistant", instrumentPayload: stone },
      { id: "home-result", role: "assistant", instrumentPayload: home },
    ], adaptAnalysisToTelemetryVM);

    render(<WordToWordStructuralAuthorityComparisonCard current={null} recentResults={recentResults} />);
    const card = screen.getByTestId("word-to-word-comparison");
    fireEvent.click(within(card).getByRole("button", { name: /Use stone · recent #2 as LEFT/ }));
    fireEvent.click(within(card).getByRole("button", { name: /Use home · recent #1 as RIGHT/ }));

    expect(within(card).getByTestId("comparison-slot-left")).toHaveTextContent("stone");
    expect(within(card).getByTestId("comparison-slot-right")).toHaveTextContent("home");
    expect(within(card).getByTestId("comparison-row-voicePath")).toHaveTextContent("EQUAL");
  });

  test("keeps a prior pronunciation-not-found result as an explicit Null comparison side", async () => {
    const stone = adaptAnalysisToTelemetryVM(await analyze("stone"));
    const missing = await analyze("zzzzzz-v0-1-missing");
    const recentResults = projectRecentAnalysisResultsV0_1([
      { id: "missing-result", role: "assistant", instrumentPayload: missing },
    ], adaptAnalysisToTelemetryVM);

    render(<WordToWordStructuralAuthorityComparisonCard current={stone} recentResults={recentResults} />);
    const card = screen.getByTestId("word-to-word-comparison");
    fireEvent.click(within(card).getByRole("button", { name: "Use current as LEFT" }));
    fireEvent.click(within(card).getByRole("button", { name: /Use zzzzzz-v0-1-missing · recent #1 as RIGHT/ }));

    expect(within(card).getByTestId("comparison-row-spokenPronunciation")).toHaveTextContent(
      "PRONUNCIATION_NOT_FOUND",
    );
    expect(within(card).getByTestId("comparison-row-voicePath")).toHaveTextContent("MISSING");
  });
});
