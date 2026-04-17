import { describe, expect, it } from "@jest/globals";

import { getSeriesExportVerdictV0_1 } from "@/ui/evals/evalsSeriesExportVerdict.v0.1";
import type {
  EvalsRunSeriesV0_1,
  EvalsSavedRunRecordV0_1,
  EvalsWorkbenchStateV0_1,
} from "@/ui/evals/evalsRunStore.v0.1";

function makeWorkbench(runId: string): EvalsWorkbenchStateV0_1 {
  return {
    mode: "run_bundle",
    taskId: "T5_INTERMEDIATE_V0_1",
    runId,
    provider: "manual",
    model: "hand-curated",
    label: runId,
    sourceEngineId: "manual-curation",
    sourceEngineVersion: "test",
    sourceEngineBuild: "test",
    inputText: "{}",
    pickedFileName: "",
    report: {
      runId,
      tasks: [],
      controlHealth: { status: "controlClean" },
    } as any,
    md: "# report\n",
  };
}

function makeRow(ordinal: number, runId: string): EvalsSavedRunRecordV0_1 {
  return {
    id: `row-${ordinal}`,
    title: runId,
    createdAt: 1710000000000 + ordinal,
    updatedAt: 1710000000000 + ordinal,
    seriesId: "series-1",
    ordinal,
    workbench: makeWorkbench(runId),
  };
}

describe("getSeriesExportVerdictV0_1 exact ordinal guard", () => {
  const series: EvalsRunSeriesV0_1 = {
    id: "series-1",
    label: "t5-battery",
    targetCount: 6,
    nextOrdinal: 7,
    runIdTemplate: "battery.{NN}",
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
  };

  it("blocks a numerically complete series when ordinal 6 is missing and ordinal 7 is present", () => {
    const out = getSeriesExportVerdictV0_1(series, [
      makeRow(1, "battery.r01"),
      makeRow(2, "battery.r02"),
      makeRow(3, "battery.r03"),
      makeRow(4, "battery.r04"),
      makeRow(5, "battery.r05"),
      makeRow(7, "battery.r07"),
    ]);

    expect(out.savedCount).toBe(6);
    expect(out.scoredCount).toBe(6);
    expect(out.missingOrdinals).toEqual([6]);
    expect(out.outOfRangeOrdinals).toEqual([7]);
    expect(out.missingCount).toBe(1);
    expect(out.isComplete).toBe(false);
    expect(out.hasOrdinalRangeIssue).toBe(true);
    expect(out.hasHardWarnings).toBe(true);
    expect(out.exportMode).toBe("blocked");
    expect(out.reason).toContain("ordinal sequence invalid");
    expect(out.reason).toContain("missing r06");
    expect(out.reason).toContain("out of range r07");
  });
});
