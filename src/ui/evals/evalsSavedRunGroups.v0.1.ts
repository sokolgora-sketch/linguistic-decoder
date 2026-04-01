import type {
  EvalsRunSeriesV0_1,
  EvalsSavedRunRecordV0_1,
} from "@/ui/evals/evalsRunStore.v0.1";

export type EvalsSavedRunSeriesGroupV0_1 = {
  id: string;
  seriesId: string | null;
  label: string;
  createdAt: number;
  updatedAt: number;
  runCount: number;
  rows: EvalsSavedRunRecordV0_1[];
};

function safeLabel(value: unknown): string {
  const text = String(value ?? "").trim();
  return text || "unassigned";
}

function rowSort(a: EvalsSavedRunRecordV0_1, b: EvalsSavedRunRecordV0_1) {
  const ao = typeof a.ordinal === "number" && Number.isFinite(a.ordinal) ? a.ordinal : Number.POSITIVE_INFINITY;
  const bo = typeof b.ordinal === "number" && Number.isFinite(b.ordinal) ? b.ordinal : Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  if (a.createdAt !== b.createdAt) return a.createdAt - b.createdAt;
  if (a.updatedAt !== b.updatedAt) return a.updatedAt - b.updatedAt;
  return a.id.localeCompare(b.id);
}

export function buildSavedRunSeriesGroupsV0_1(
  savedRuns: EvalsSavedRunRecordV0_1[],
  runSeries: EvalsRunSeriesV0_1[],
): EvalsSavedRunSeriesGroupV0_1[] {
  const seriesById = new Map(runSeries.map((series) => [series.id, series]));
  const groups = new Map<string, EvalsSavedRunSeriesGroupV0_1>();

  for (const row of savedRuns) {
    const series = row.seriesId ? seriesById.get(row.seriesId) ?? null : null;
    const label = series ? safeLabel(series.label) : safeLabel(row.workbench.label || row.title);
    const groupId = row.seriesId ? `series:${row.seriesId}` : `unassigned:${label.toLowerCase()}`;

    const existing = groups.get(groupId);
    if (!existing) {
      groups.set(groupId, {
        id: groupId,
        seriesId: row.seriesId,
        label,
        createdAt: series?.createdAt ?? row.createdAt,
        updatedAt: Math.max(series?.updatedAt ?? row.updatedAt, row.updatedAt),
        runCount: 1,
        rows: [row],
      });
      continue;
    }

    existing.rows.push(row);
    existing.runCount += 1;
    existing.createdAt = Math.min(existing.createdAt, row.createdAt, series?.createdAt ?? row.createdAt);
    existing.updatedAt = Math.max(existing.updatedAt, row.updatedAt, series?.updatedAt ?? row.updatedAt);
  }

  return Array.from(groups.values())
    .map((group) => ({
      ...group,
      rows: [...group.rows].sort(rowSort),
      runCount: group.rows.length,
    }))
    .sort((a, b) => {
      if (a.updatedAt !== b.updatedAt) return b.updatedAt - a.updatedAt;
      if (a.createdAt !== b.createdAt) return b.createdAt - a.createdAt;
      return a.label.localeCompare(b.label);
    });
}
