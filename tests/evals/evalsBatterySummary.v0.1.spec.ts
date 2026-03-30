import { describe, expect, it } from "@jest/globals";

import { summarizeEvalsBatterySeriesV0_1 } from "@/ui/evals/evalsBatterySummary.v0.1";
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
  rho?: number;
  pearson?: number;
  pPerm?: number;
  controlStatus?: "controlClean" | "controlWarn" | "controlFail";
}): EvalsSavedRunRecordV0_1 {
  const now = 1710000000000 + (args.ordinal ?? 0);
  const report = args.scored
    ? ({
        runId: args.runId,
        controlHealth: {
          status: args.controlStatus ?? "controlClean",
        },
        tasks: [
          {
            taskId: "T2_LADDER_V0_1",
            kind: "byo",
            slope_aperturePresenceMean: {
              spearman_rho: args.rho,
              pearson_r: args.pearson,
              p_spearman: args.pPerm,
            },
          },
        ],
      } as any)
    : null;

  return {
    id: args.id,
    title: args.id,
    createdAt: now,
    updatedAt: now,
    seriesId: "series-1",
    ordinal: args.ordinal,
    workbench: makeWorkbench({
      runId: args.runId,
      report,
    }),
  };
}

describe("summarizeEvalsBatterySeriesV0_1", () => {
  const series: EvalsRunSeriesV0_1 = {
    id: "series-1",
    label: "fresh-chat",
    targetCount: 4,
    nextOrdinal: 5,
    runIdTemplate: "battery.{NN}",
    createdAt: 1710000000000,
    updatedAt: 1710000000000,
  };

  it("aggregates the main task and control-health counts for a series", () => {
    const rows = [
      makeRow({
        id: "r1",
        ordinal: 1,
        runId: "battery.r01",
        scored: true,
        rho: -0.9,
        pearson: -0.8,
        pPerm: 0.01,
        controlStatus: "controlClean",
      }),
      makeRow({
        id: "r2",
        ordinal: 2,
        runId: "battery.r02",
        scored: true,
        rho: -0.8,
        pearson: -0.7,
        pPerm: 0.02,
        controlStatus: "controlWarn",
      }),
      makeRow({
        id: "r3",
        ordinal: 3,
        runId: "battery.r03",
        scored: true,
        rho: -0.7,
        pearson: -0.6,
        pPerm: 0.03,
        controlStatus: "controlFail",
      }),
      makeRow({
        id: "r4",
        ordinal: 4,
        runId: "battery.r04",
        scored: false,
      }),
    ];

    const out = summarizeEvalsBatterySeriesV0_1(series, rows);

    expect(out.savedCount).toBe(4);
    expect(out.scoredCount).toBe(3);
    expect(out.unscoredCount).toBe(1);

    expect(out.mainTaskId).toBe("T2_LADDER_V0_1");

    expect(out.meanSpearmanRho).toBeCloseTo(-0.8, 10);
    expect(out.medianSpearmanRho).toBeCloseTo(-0.8, 10);
    expect(out.minSpearmanRho).toBeCloseTo(-0.9, 10);
    expect(out.maxSpearmanRho).toBeCloseTo(-0.7, 10);

    expect(out.meanPearsonR).toBeCloseTo(-0.7, 10);
    expect(out.medianPearsonR).toBeCloseTo(-0.7, 10);
    expect(out.minPearsonR).toBeCloseTo(-0.8, 10);
    expect(out.maxPearsonR).toBeCloseTo(-0.6, 10);

    expect(out.minPPerm).toBeCloseTo(0.01, 10);
    expect(out.maxPPerm).toBeCloseTo(0.03, 10);

    expect(out.strongestRunId).toBe("battery.r01");
    expect(out.weakestRunId).toBe("battery.r03");

    expect(out.controlCleanCount).toBe(1);
    expect(out.controlWarnCount).toBe(1);
    expect(out.controlFailCount).toBe(1);
  });
});
