import type {
  EvalReportBundleV0_1,
  EvalTaskReportV0_1,
  IntermediateTaskReportV0_1,
} from "@/shared/evals/report.v0.1";

export type BatteryBracketStatsSourceV0_1 = "evidence-pack";

export type BatteryBracketStatsV0_1 = {
  source: BatteryBracketStatsSourceV0_1;
  seriesLabel: string;
  evidenceZipFilename: string;

  marginPermutation: {
    observedMinGap: number | null;
    pValue: number | null;
    iters: number | null;
    seed: number | null;
  };

  effectSizes: {
    hedgesGLowX: number | null;
    hedgesGXHigh: number | null;
  };

  bootstrap: {
    ci95GapLow: [number, number] | null;
    ci95GapHigh: [number, number] | null;
    ci95NormalizedPosition: [number, number] | null;
    iters: number | null;
    seed: number | null;
  };

  notes?: string;
};

export type BuildBatteryBracketStatsInputV0_1 = {
  seriesLabel: string;
  evidenceZipFilename: string;
  intermediate: IntermediateTaskReportV0_1 | null | undefined;
  notes?: string;
};

export type BuildBatteryBracketStatsFromReportInputV0_1 = {
  seriesLabel: string;
  evidenceZipFilename: string;
  report: EvalReportBundleV0_1 | null | undefined;
  notes?: string;
};

function finiteOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function finiteTupleOrNull(value: unknown): [number, number] | null {
  if (!Array.isArray(value) || value.length !== 2) return null;

  const a = finiteOrNull(value[0]);
  const b = finiteOrNull(value[1]);

  return a === null || b === null ? null : [a, b];
}

export function buildBatteryBracketStatsFromIntermediateV0_1(
  input: BuildBatteryBracketStatsInputV0_1,
): BatteryBracketStatsV0_1 {
  const intermediate = input.intermediate ?? null;

  return {
    source: "evidence-pack",
    seriesLabel: input.seriesLabel,
    evidenceZipFilename: input.evidenceZipFilename,

    marginPermutation: {
      observedMinGap: finiteOrNull(intermediate?.marginPermutation?.observed_min_gap),
      pValue: finiteOrNull(intermediate?.marginPermutation?.p_value),
      iters: finiteOrNull(intermediate?.marginPermutation?.iters),
      seed: finiteOrNull(intermediate?.marginPermutation?.seed),
    },

    effectSizes: {
      hedgesGLowX: finiteOrNull(intermediate?.effectSizes?.hedges_g_low_x),
      hedgesGXHigh: finiteOrNull(intermediate?.effectSizes?.hedges_g_x_high),
    },

    bootstrap: {
      ci95GapLow: finiteTupleOrNull(intermediate?.bootstrap?.ci95_gap_low),
      ci95GapHigh: finiteTupleOrNull(intermediate?.bootstrap?.ci95_gap_high),
      ci95NormalizedPosition: finiteTupleOrNull(
        intermediate?.bootstrap?.ci95_normalizedPosition,
      ),
      iters: finiteOrNull(intermediate?.bootstrap?.iters),
      seed: finiteOrNull(intermediate?.bootstrap?.seed),
    },

    ...(input.notes ? { notes: input.notes } : {}),
  };
}

export function hasImportedBatteryBracketStatsV0_1(
  stats: BatteryBracketStatsV0_1,
): boolean {
  return (
    stats.marginPermutation.pValue !== null ||
    stats.effectSizes.hedgesGLowX !== null ||
    stats.effectSizes.hedgesGXHigh !== null ||
    stats.bootstrap.ci95GapLow !== null ||
    stats.bootstrap.ci95GapHigh !== null ||
    stats.bootstrap.ci95NormalizedPosition !== null
  );
}


function hasIntermediateStatsV0_1(
  task: EvalTaskReportV0_1 | null | undefined,
): boolean {
  return !!task?.intermediate_aperturePresenceMean;
}

export function getPrimaryIntermediateTaskReportV0_1(
  report: EvalReportBundleV0_1 | null | undefined,
): IntermediateTaskReportV0_1 | null {
  const tasks = Array.isArray(report?.tasks) ? report.tasks : [];

  const selected =
    tasks.find(
      (task) =>
        task.taskId === "T5_INTERMEDIATE_V0_1" &&
        task.kind === "byo" &&
        hasIntermediateStatsV0_1(task),
    ) ??
    tasks.find(
      (task) =>
        task.taskId === "T5_INTERMEDIATE_V0_1" &&
        hasIntermediateStatsV0_1(task),
    ) ??
    tasks.find(
      (task) => task.kind === "byo" && hasIntermediateStatsV0_1(task),
    ) ??
    tasks.find((task) => hasIntermediateStatsV0_1(task)) ??
    null;

  return selected?.intermediate_aperturePresenceMean ?? null;
}

export function buildBatteryBracketStatsFromReportV0_1(
  input: BuildBatteryBracketStatsFromReportInputV0_1,
): BatteryBracketStatsV0_1 {
  return buildBatteryBracketStatsFromIntermediateV0_1({
    seriesLabel: input.seriesLabel,
    evidenceZipFilename: input.evidenceZipFilename,
    intermediate: getPrimaryIntermediateTaskReportV0_1(input.report),
    notes: input.notes,
  });
}
