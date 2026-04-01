import { buildSavedRunSeriesGroupsV0_1 } from "@/ui/evals/evalsSavedRunGroups.v0.1";
import type {
  EvalsRunSeriesV0_1,
  EvalsSavedRunRecordV0_1,
} from "@/ui/evals/evalsRunStore.v0.1";

function makeSeries(id: string, label: string, createdAt: number, updatedAt: number): EvalsRunSeriesV0_1 {
  return {
    id,
    label,
    targetCount: 10,
    nextOrdinal: 3,
    runIdTemplate: `${label}.{NN}`,
    createdAt,
    updatedAt,
  };
}

function makeRun(params: {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  seriesId: string | null;
  ordinal: number | null;
}): EvalsSavedRunRecordV0_1 {
  return {
    id: params.id,
    title: params.title,
    createdAt: params.createdAt,
    updatedAt: params.updatedAt,
    seriesId: params.seriesId,
    ordinal: params.ordinal,
    workbench: {
      mode: "task_buckets",
      taskId: "T2_LADDER_V0_1",
      runId: params.title,
      provider: "openai",
      model: "chatgpt52thinking",
      label: params.title,
      sourceEngineId: "",
      sourceEngineVersion: "",
      sourceEngineBuild: "",
      inputText: "",
      pickedFileName: "",
      report: null,
      md: "",
    },
  };
}

describe("evals saved run groups v0.1", () => {
  it("groups saved runs by series and sorts rows by ordinal", () => {
    const runSeries: EvalsRunSeriesV0_1[] = [
      makeSeries("series-a", "guided-prompt-pilot", 1000, 5000),
      makeSeries("series-b", "fresh-chat", 2000, 4000),
    ];

    const savedRuns: EvalsSavedRunRecordV0_1[] = [
      makeRun({ id: "b2", title: "fresh-chat.r02", createdAt: 3200, updatedAt: 4200, seriesId: "series-b", ordinal: 2 }),
      makeRun({ id: "a2", title: "guided-prompt-pilot.r02", createdAt: 1300, updatedAt: 5300, seriesId: "series-a", ordinal: 2 }),
      makeRun({ id: "a1", title: "guided-prompt-pilot.r01", createdAt: 1200, updatedAt: 5200, seriesId: "series-a", ordinal: 1 }),
    ];

    const out = buildSavedRunSeriesGroupsV0_1(savedRuns, runSeries);

    expect(out).toHaveLength(2);
    expect(out[0].label).toBe("guided-prompt-pilot");
    expect(out[0].runCount).toBe(2);
    expect(out[0].rows.map((row) => row.title)).toEqual([
      "guided-prompt-pilot.r01",
      "guided-prompt-pilot.r02",
    ]);

    expect(out[1].label).toBe("fresh-chat");
    expect(out[1].rows.map((row) => row.title)).toEqual(["fresh-chat.r02"]);
  });

  it("falls back to unassigned groups when seriesId is missing", () => {
    const out = buildSavedRunSeriesGroupsV0_1(
      [
        makeRun({
          id: "u1",
          title: "orphan-run",
          createdAt: 100,
          updatedAt: 200,
          seriesId: null,
          ordinal: null,
        }),
      ],
      [],
    );

    expect(out).toHaveLength(1);
    expect(out[0].seriesId).toBeNull();
    expect(out[0].label).toBe("orphan-run");
    expect(out[0].runCount).toBe(1);
  });
});
