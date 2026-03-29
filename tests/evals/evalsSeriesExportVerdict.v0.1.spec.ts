import { describe, expect, it } from "@jest/globals";

import { getSeriesExportVerdictV0_1 } from "@/ui/evals/evalsSeriesExportVerdict.v0.1";
import type {
  EvalsRunSeriesV0_1,
  EvalsSavedRunRecordV0_1,
  EvalsWorkbenchStateV0_1,
} from "@/ui/evals/evalsRunStore.v0.1";

function makeWorkbench(overrides?: Partial<EvalsWorkbenchStateV0_1>): EvalsWorkbenchStateV0_1 {
  return {
    mode: "run_bundle",
    taskId: "T2_LADDER_V0_1",
    runId: "battery.r01",
    provider: "openai",
    model: "chatgpt52thinking",
    label: "fresh-chat",
    sourceEngineId: "",
    sourceEngineVersion: "",
    sourceEngineBuild: "",
    inputText: "{}",
    pickedFileName: "",
    report: null,
    md: "",
    ...overrides,
  };
}

function makeRow(args: {
  id: string;
  ordinal: number | null;
  runId: string;
  scored: boolean;
}): EvalsSavedRunRecordV0_1 {
  const now = 1710000000000;
  return {
    id: args.id,
    title: args.id,
    createdAt: now,
    updatedAt: now,
    seriesId: "series-1",
    ordinal: args.ordinal,
    workbench: makeWorkbench({
      runId: args.runId,
      report: args.scored ? ({} as any) : null,
    }),
  };
}

describe("getSeriesExportVerdictV0_1", () => {
  const series: EvalsRunSeriesV0_1 = {
    id: "series-1",
    label: "fresh-chat",
    targetCount: 3,
    nextOrdinal: 4,
    runIdTemplate: "battery.{NN}",
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
  };

  it("returns ready for a complete, fully scored, duplicate-free series", () => {
    const rows = [
      makeRow({ id: "r1", ordinal: 1, runId: "battery.r01", scored: true }),
      makeRow({ id: "r2", ordinal: 2, runId: "battery.r02", scored: true }),
      makeRow({ id: "r3", ordinal: 3, runId: "battery.r03", scored: true }),
    ];

    const out = getSeriesExportVerdictV0_1(series, rows);

    expect(out).toEqual({
      savedCount: 3,
      scoredCount: 3,
      unscoredCount: 0,
      missingCount: 0,
      isComplete: true,
      hasScoredData: true,
      hasHardWarnings: false,
      duplicateOrdinals: [],
      duplicateRunIds: [],
      exportMode: "ready",
      reason: "clean",
    });
  });

  it("returns warn for an incomplete but otherwise clean series", () => {
    const rows = [
      makeRow({ id: "r1", ordinal: 1, runId: "battery.r01", scored: true }),
      makeRow({ id: "r2", ordinal: 2, runId: "battery.r02", scored: true }),
    ];

    const out = getSeriesExportVerdictV0_1(series, rows);

    expect(out.exportMode).toBe("warn");
    expect(out.reason).toBe("series incomplete (2/3)");
    expect(out.missingCount).toBe(1);
    expect(out.hasHardWarnings).toBe(false);
  });

  it("returns warn for a complete series that still has unscored runs", () => {
    const rows = [
      makeRow({ id: "r1", ordinal: 1, runId: "battery.r01", scored: true }),
      makeRow({ id: "r2", ordinal: 2, runId: "battery.r02", scored: true }),
      makeRow({ id: "r3", ordinal: 3, runId: "battery.r03", scored: false }),
    ];

    const out = getSeriesExportVerdictV0_1(series, rows);

    expect(out.exportMode).toBe("warn");
    expect(out.reason).toBe("1 unscored saved run");
    expect(out.unscoredCount).toBe(1);
    expect(out.isComplete).toBe(true);
  });

  it("returns blocked when there are duplicate ordinals", () => {
    const rows = [
      makeRow({ id: "r1", ordinal: 1, runId: "battery.r01", scored: true }),
      makeRow({ id: "r2", ordinal: 1, runId: "battery.r02", scored: true }),
      makeRow({ id: "r3", ordinal: 2, runId: "battery.r03", scored: true }),
    ];

    const out = getSeriesExportVerdictV0_1(series, rows);

    expect(out.exportMode).toBe("blocked");
    expect(out.reason).toBe("duplicates detected");
    expect(out.duplicateOrdinals).toEqual([1]);
    expect(out.hasHardWarnings).toBe(true);
  });

  it("returns blocked when there are duplicate runIds", () => {
    const rows = [
      makeRow({ id: "r1", ordinal: 1, runId: "battery.r01", scored: true }),
      makeRow({ id: "r2", ordinal: 2, runId: "battery.r01", scored: true }),
      makeRow({ id: "r3", ordinal: 3, runId: "battery.r03", scored: true }),
    ];

    const out = getSeriesExportVerdictV0_1(series, rows);

    expect(out.exportMode).toBe("blocked");
    expect(out.reason).toBe("duplicates detected");
    expect(out.duplicateRunIds).toEqual(["battery.r01"]);
    expect(out.hasHardWarnings).toBe(true);
  });

  it("returns blocked when there are no scored runs yet", () => {
    const rows = [
      makeRow({ id: "r1", ordinal: 1, runId: "battery.r01", scored: false }),
      makeRow({ id: "r2", ordinal: 2, runId: "battery.r02", scored: false }),
    ];

    const out = getSeriesExportVerdictV0_1(series, rows);

    expect(out.exportMode).toBe("blocked");
    expect(out.reason).toBe("no scored runs yet");
    expect(out.hasScoredData).toBe(false);
  });
});
