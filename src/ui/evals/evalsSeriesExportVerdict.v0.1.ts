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
  missingOrdinals: number[];
  outOfRangeOrdinals: number[];
  isComplete: boolean;
  hasScoredData: boolean;
  hasHardWarnings: boolean;
  hasOrdinalRangeIssue: boolean;
  duplicateOrdinals: number[];
  duplicateRunIds: string[];
  controlWarnCount: number;
  controlFailCount: number;
  exportMode: EvalsSeriesExportModeV0_1;
  reason: string;
};

function formatOrdinal(n: number): string {
  return `r${String(n).padStart(2, "0")}`;
}

function formatOrdinalList(items: number[]): string {
  return items.map(formatOrdinal).join(", ");
}

export function getSeriesExportVerdictV0_1(
  series: EvalsRunSeriesV0_1,
  rows: EvalsSavedRunRecordV0_1[],
): EvalsSeriesExportVerdictV0_1 {
  const savedCount = rows.length;
  const scoredRows = rows.filter((row) => Boolean(row.workbench.report));
  const scoredCount = scoredRows.length;
  const unscoredCount = Math.max(savedCount - scoredCount, 0);

  const validOrdinals = rows
    .map((row) => row.ordinal)
    .filter((n): n is number => typeof n === "number" && Number.isFinite(n));

  const presentOrdinals = new Set(validOrdinals);
  const missingOrdinals = Array.from({ length: series.targetCount }, (_, i) => i + 1).filter(
    (n) => !presentOrdinals.has(n),
  );
  const outOfRangeOrdinals = Array.from(
    new Set(validOrdinals.filter((n) => n < 1 || n > series.targetCount)),
  ).sort((a, b) => a - b);

  const missingCount = missingOrdinals.length;
  const isComplete =
    savedCount >= series.targetCount &&
    missingOrdinals.length === 0 &&
    outOfRangeOrdinals.length === 0;

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

  const controlWarnCount = scoredRows.filter(
    (row) => row.workbench.report?.controlHealth?.status === "controlWarn",
  ).length;

  const controlFailCount = scoredRows.filter(
    (row) => row.workbench.report?.controlHealth?.status === "controlFail",
  ).length;

  const hasOrdinalRangeIssue =
    outOfRangeOrdinals.length > 0 ||
    (savedCount >= series.targetCount && missingOrdinals.length > 0);

  const hasHardWarnings =
    duplicateOrdinals.length > 0 ||
    duplicateRunIds.length > 0 ||
    hasOrdinalRangeIssue;

  const hasControlIssues = controlWarnCount > 0 || controlFailCount > 0;

  const exportMode: EvalsSeriesExportModeV0_1 =
    hasHardWarnings || !hasScoredData
      ? "blocked"
      : isComplete && scoredCount === series.targetCount && unscoredCount === 0 && !hasControlIssues
        ? "ready"
        : "warn";

  const reason = duplicateOrdinals.length > 0 || duplicateRunIds.length > 0
    ? "duplicates detected"
    : hasOrdinalRangeIssue
      ? `ordinal sequence invalid${missingOrdinals.length ? `; missing ${formatOrdinalList(missingOrdinals)}` : ""}${outOfRangeOrdinals.length ? `; out of range ${formatOrdinalList(outOfRangeOrdinals)}` : ""}`
      : !hasScoredData
        ? "no scored runs yet"
        : !isComplete
          ? `series incomplete (${savedCount}/${series.targetCount})`
          : unscoredCount > 0
            ? `${unscoredCount} unscored saved run${unscoredCount === 1 ? "" : "s"}`
            : controlFailCount > 0
              ? `control health fail in ${controlFailCount} scored run${controlFailCount === 1 ? "" : "s"}`
              : controlWarnCount > 0
                ? `control health warn in ${controlWarnCount} scored run${controlWarnCount === 1 ? "" : "s"}`
                : "clean";

  return {
    savedCount,
    scoredCount,
    unscoredCount,
    missingCount,
    missingOrdinals,
    outOfRangeOrdinals,
    isComplete,
    hasScoredData,
    hasHardWarnings,
    hasOrdinalRangeIssue,
    duplicateOrdinals,
    duplicateRunIds,
    controlWarnCount,
    controlFailCount,
    exportMode,
    reason,
  };
}
