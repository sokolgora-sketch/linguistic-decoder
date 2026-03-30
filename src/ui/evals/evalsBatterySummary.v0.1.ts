import type {
  EvalsRunSeriesV0_1,
  EvalsSavedRunRecordV0_1,
} from "@/ui/evals/evalsRunStore.v0.1";

export type EvalsBatterySummaryV0_1 = {
  seriesId: string;
  seriesLabel: string;
  savedCount: number;
  scoredCount: number;
  unscoredCount: number;
  mainTaskId: string | null;
  meanSpearmanRho: number | null;
  medianSpearmanRho: number | null;
  minSpearmanRho: number | null;
  maxSpearmanRho: number | null;
  meanPearsonR: number | null;
  medianPearsonR: number | null;
  minPearsonR: number | null;
  maxPearsonR: number | null;
  minPPerm: number | null;
  maxPPerm: number | null;
  strongestRunId: string | null;
  weakestRunId: string | null;
  controlCleanCount: number;
  controlWarnCount: number;
  controlFailCount: number;
};

type BatteryPointV0_1 = {
  rowId: string;
  runId: string;
  ordinal: number | null;
  taskId: string | null;
  spearmanRho: number | null;
  pearsonR: number | null;
  pPerm: number | null;
};

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function mean(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function median(values: number[]): number | null {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 1
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

function min(values: number[]): number | null {
  return values.length ? Math.min(...values) : null;
}

function max(values: number[]): number | null {
  return values.length ? Math.max(...values) : null;
}

function sortRows(rows: EvalsSavedRunRecordV0_1[]): EvalsSavedRunRecordV0_1[] {
  return [...rows].sort((a, b) => {
    const ao = a.ordinal ?? Number.MAX_SAFE_INTEGER;
    const bo = b.ordinal ?? Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return a.createdAt - b.createdAt;
  });
}

function extractMainTaskPoint(row: EvalsSavedRunRecordV0_1): BatteryPointV0_1 | null {
  const report = row.workbench.report as any;
  const tasks = Array.isArray(report?.tasks) ? report.tasks : [];
  const task =
    tasks.find((t: any) => t?.kind === "byo") ??
    tasks.find((t: any) => String(t?.taskId ?? "").includes("LADDER")) ??
    tasks[0] ??
    null;

  if (!task) return null;

  const slope = task?.slope_aperturePresenceMean ?? null;

  return {
    rowId: row.id,
    runId: String(report?.runId ?? row.workbench.runId ?? "").trim(),
    ordinal: typeof row.ordinal === "number" ? row.ordinal : null,
    taskId: String(task?.taskId ?? "").trim() || null,
    spearmanRho: asNumber(slope?.spearman_rho ?? slope?.spearman?.rho ?? slope?.spearman?.r),
    pearsonR: asNumber(slope?.pearson_r ?? slope?.pearson?.r),
    pPerm: asNumber(slope?.p_spearman ?? slope?.p_perm_spearman),
  };
}

export function summarizeEvalsBatterySeriesV0_1(
  series: EvalsRunSeriesV0_1,
  rows: EvalsSavedRunRecordV0_1[],
): EvalsBatterySummaryV0_1 {
  const sortedRows = sortRows(rows);
  const scoredRows = sortedRows.filter((row) => Boolean(row.workbench.report));
  const points = scoredRows
    .map(extractMainTaskPoint)
    .filter((point): point is BatteryPointV0_1 => point !== null);

  const spearmanValues = points
    .map((point) => point.spearmanRho)
    .filter((value): value is number => value !== null);

  const pearsonValues = points
    .map((point) => point.pearsonR)
    .filter((value): value is number => value !== null);

  const pPermValues = points
    .map((point) => point.pPerm)
    .filter((value): value is number => value !== null);

  const orderedByStrength = [...points]
    .filter((point) => point.spearmanRho !== null)
    .sort((a, b) => {
      if (a.spearmanRho !== b.spearmanRho) {
        return (a.spearmanRho as number) - (b.spearmanRho as number);
      }
      const ap = a.pPerm ?? Number.POSITIVE_INFINITY;
      const bp = b.pPerm ?? Number.POSITIVE_INFINITY;
      if (ap !== bp) return ap - bp;
      const ao = a.ordinal ?? Number.MAX_SAFE_INTEGER;
      const bo = b.ordinal ?? Number.MAX_SAFE_INTEGER;
      return ao - bo;
    });

  const controlCleanCount = scoredRows.filter(
    (row) => (row.workbench.report as any)?.controlHealth?.status === "controlClean",
  ).length;
  const controlWarnCount = scoredRows.filter(
    (row) => (row.workbench.report as any)?.controlHealth?.status === "controlWarn",
  ).length;
  const controlFailCount = scoredRows.filter(
    (row) => (row.workbench.report as any)?.controlHealth?.status === "controlFail",
  ).length;

  return {
    seriesId: series.id,
    seriesLabel: series.label,
    savedCount: sortedRows.length,
    scoredCount: scoredRows.length,
    unscoredCount: Math.max(sortedRows.length - scoredRows.length, 0),
    mainTaskId: points[0]?.taskId ?? null,
    meanSpearmanRho: mean(spearmanValues),
    medianSpearmanRho: median(spearmanValues),
    minSpearmanRho: min(spearmanValues),
    maxSpearmanRho: max(spearmanValues),
    meanPearsonR: mean(pearsonValues),
    medianPearsonR: median(pearsonValues),
    minPearsonR: min(pearsonValues),
    maxPearsonR: max(pearsonValues),
    minPPerm: min(pPermValues),
    maxPPerm: max(pPermValues),
    strongestRunId: orderedByStrength[0]?.runId ?? null,
    weakestRunId: orderedByStrength[orderedByStrength.length - 1]?.runId ?? null,
    controlCleanCount,
    controlWarnCount,
    controlFailCount,
  };
}
