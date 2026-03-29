import type {
  EvalsRunSeriesV0_1,
  EvalsSavedRunRecordV0_1,
} from "@/ui/evals/evalsRunStore.v0.1";

export type EvalsSeriesExportModeV0_1 = "blocked" | "warn" | "ready";

export type EvalsSeriesExportVerdictV0_1 = {
  savedCount: number;
  scoredCount: number;
  unscoredCount: number;
  missingCount: number;
  isComplete: boolean;
  hasScoredData: boolean;
  hasHardWarnings: boolean;
  duplicateOrdinals: number[];
  duplicateRunIds: string[];
  exportMode: EvalsSeriesExportModeV0_1;
  reason: string;
};

export function getSeriesExportVerdictV0_1(
  series: EvalsRunSeriesV0_1,
  rows: EvalsSavedRunRecordV0_1[],
): EvalsSeriesExportVerdictV0_1 {
  const savedCount = rows.length;
  const scoredCount = rows.filter((row) => Boolean(row.workbench.report)).length;
  const unscoredCount = Math.max(savedCount - scoredCount, 0);
  const missingCount = Math.max(series.targetCount - savedCount, 0);
  const isComplete = missingCount === 0 && savedCount >= series.targetCount;
  const hasScoredData = scoredCount > 0;

  const ordinalCounts = new Map<number, number>();
  const runIdCounts = new Map<string, number>();

  for (const row of rows) {
    if (typeof row.ordinal === "number" && Number.isFinite(row.ordinal)) {
      ordinalCounts.set(row.ordinal, (ordinalCounts.get(row.ordinal) ?? 0) + 1);
    }

    const rid = String(row.workbench.report?.runId ?? row.workbench.runId ?? "").trim();
    if (rid) {
      runIdCounts.set(rid, (runIdCounts.get(rid) ?? 0) + 1);
    }
  }

  const duplicateOrdinals = Array.from(ordinalCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([ordinal]) => ordinal)
    .sort((a, b) => a - b);

  const duplicateRunIds = Array.from(runIdCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([runId]) => runId)
    .sort();

  const hasHardWarnings =
    duplicateOrdinals.length > 0 || duplicateRunIds.length > 0;

  const exportMode: EvalsSeriesExportModeV0_1 =
    hasHardWarnings || !hasScoredData
      ? "blocked"
      : isComplete && unscoredCount === 0
        ? "ready"
        : "warn";

  const reason = hasHardWarnings
    ? "duplicates detected"
    : !hasScoredData
      ? "no scored runs yet"
      : !isComplete
        ? `series incomplete (${savedCount}/${series.targetCount})`
        : unscoredCount > 0
          ? `${unscoredCount} unscored saved run${unscoredCount === 1 ? "" : "s"}`
          : "clean";

  return {
    savedCount,
    scoredCount,
    unscoredCount,
    missingCount,
    isComplete,
    hasScoredData,
    hasHardWarnings,
    duplicateOrdinals,
    duplicateRunIds,
    exportMode,
    reason,
  };
}
