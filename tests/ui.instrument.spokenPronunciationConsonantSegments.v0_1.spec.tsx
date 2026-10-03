require("./helpers/whatwgGlobals.cjs");

import React from "react";
import { render, screen, within } from "@testing-library/react";
import { GET } from "../app/api/analyze-v1/route";
import { adaptAnalysisToTelemetryVM } from "../src/ui/instrument/contractAdapter";
import { SpokenPronunciationOverviewCardV0_1 } from "../src/ui/instrument/sections/SpokenPronunciationOverviewCard.v0_1";
import { SpokenResultCompositionSummaryV0_1 } from "../src/ui/instrument/sections/SpokenResultCompositionSummary.v0_1";

async function analyze(word: string): Promise<any> {
  const response = await GET({
    url: `http://localhost/api/analyze-v1?word=${encodeURIComponent(word)}&mode=strict`,
  } as any);
  expect(response.status).toBe(200);
  return response.json();
}

function consonants(vm: ReturnType<typeof adaptAnalysisToTelemetryVM>): string[] {
  const pronunciation = vm.readout.spokenPronunciation;
  if (pronunciation.kind !== "present" || pronunciation.value.status !== "defined") return [];
  return pronunciation.value.variants[0]?.segments.map((segment) => segment.sourceUnits.join(" ")) ?? [];
}

describe("pronunciation-derived consonant segments v0.1", () => {
  test.each([
    ["mother", ["M", "DH"], ["Ë", "Ë"]],
    ["stone", ["S", "T", "N"], ["O", "U"]],
    ["study", ["S", "T", "D"], ["Ë", "I"]],
    ["water", ["W", "T"], ["O", "Ë"]],
    ["make", ["M", "K"], ["E", "I"]],
    ["time", ["T", "M"], ["A", "I"]],
    ["home", ["HH", "M"], ["O", "U"]],
    ["name", ["N", "M"], ["E", "I"]],
    ["cat", ["K", "T"], ["A"]],
  ])("%s keeps pronunciation order and canonical path", async (word, expectedConsonants, expectedPath) => {
    const vm = adaptAnalysisToTelemetryVM(await analyze(word));
    expect(consonants(vm)).toEqual(expectedConsonants);
    expect(vm.readout.voicePath).toMatchObject({ kind: "present", value: expectedPath });
  });

  test("filters only consonant segments, preserves source order, and keeps duplicates", () => {
    const vm = adaptAnalysisToTelemetryVM({
      word: "synthetic",
      mode: "strict",
      heartInstrumentV1: {
        spokenPronunciation: {
          status: "defined",
          reasonCode: null,
          normalizedWord: "synthetic",
          sourceProfileId: "open-instrument.cmudict-arpabet-en-us.v0_1",
          sourceNotation: "ARPABET",
          sourceRevision: "test",
          variants: [
            {
              variant: {
                sourceForm: "synthetic",
                sourcePronunciation: "T AH1 T",
                variantId: "synthetic:1",
                variantOrder: 0,
              },
              normalizedSegments: [
                { segmentIndex: 1, kind: "monophthong_nucleus", sourceUnits: ["AH1"] },
                { segmentIndex: 2, kind: "consonant", sourceUnits: ["T"] },
                { segmentIndex: 0, kind: "consonant", sourceUnits: ["T"] },
              ],
              canonicalVoicePath: ["A"],
              reasonCode: null,
            },
          ],
          canonicalSpokenVoicePath: ["A"],
        },
      },
    });

    expect(consonants(vm)).toEqual(["T", "T"]);
  });

  test("renders source-faithful segments with the authorized label", async () => {
    const vm = adaptAnalysisToTelemetryVM(await analyze("mother"));
    render(<SpokenResultCompositionSummaryV0_1 readout={vm.readout} />);

    const summary = screen.getByTestId("spoken-result-composition-summary");
    expect(within(summary).getByText("Source consonant structure Γ")).toBeVisible();
    expect(within(summary).getByText("M → DH")).toBeVisible();
    expect(summary).not.toHaveTextContent(/shade|meaning|function/i);
  });

  test("keeps pronunciation-not-found Null without spelling fallback", async () => {
    const vm = adaptAnalysisToTelemetryVM(await analyze("zzzzzz-v0-1-missing"));
    render(<SpokenPronunciationOverviewCardV0_1 readout={vm.readout} />);

    const overview = screen.getByTestId("spoken-pronunciation-overview");
    expect(within(overview).getByText("Spoken pronunciation unavailable.")).toBeVisible();
    expect(within(overview).queryByTestId("spoken-pronunciation-consonant-segments")).toBeNull();

    render(<SpokenResultCompositionSummaryV0_1 readout={vm.readout} />);
    const summary = screen.getByTestId("spoken-result-composition-summary");
    expect(within(summary).getByText("canonical spoken Voice path: Null")).toBeVisible();
    expect(within(summary).getByText("reason: PRONUNCIATION_NOT_FOUND")).toBeVisible();
  });
});
