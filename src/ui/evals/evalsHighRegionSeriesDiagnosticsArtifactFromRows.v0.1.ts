import type { EvalReportBundleV0_1 } from "@/shared/evals/report.v0.1";
import {
  buildHighRegionSeriesDiagnosticsArtifactV0_1,
  type HighRegionSeriesDiagnosticsArtifactV0_1,
} from "@/shared/evals/highRegionSeriesDiagnosticsArtifact.v0.1";

type HighRegionSeriesExportRowV0_1 = {
  ordinal?: number | null;
  title?: string | null;
  runId: string;
  report: EvalReportBundleV0_1;
};

type HighRegionSeriesExportInputV0_1 = {
  seriesId?: string | null;
  seriesLabel: string;
  rows: readonly HighRegionSeriesExportRowV0_1[];
};

/**
 * Conservative UI adapter for optional `series-diagnostics.json` export.
 *
 * Returns null unless the selected saved-run series looks like a high-region
 * T5 intermediate series with both candidate and control rows.
 *
 * This adapter does not score buckets.
 * This adapter does not change reports.
 * This adapter does not touch `/api/evals/score`.
 */
export function maybeBuildHighRegionSeriesDiagnosticsArtifactFromRowsV0_1(
  input: HighRegionSeriesExportInputV0_1,
): HighRegionSeriesDiagnosticsArtifactV0_1 | null {
  const rows = [...input.rows].sort((a, b) => {
    const ao = typeof a.ordinal === "number" ? a.ordinal : Number.MAX_SAFE_INTEGER;
    const bo = typeof b.ordinal === "number" ? b.ordinal : Number.MAX_SAFE_INTEGER;
    if (ao !== bo) return ao - bo;
    return a.runId.localeCompare(b.runId);
  });

  const runInputs = rows
    .map((row) => {
      const task = findIntermediateTaskV0_1(row.report);
      const inter = task?.intermediate_aperturePresenceMean ?? null;
      if (!task || !inter) return null;

      const anchorLow = textOrNullV0_1(inter.anchorLow);
      const anchorHigh = textOrNullV0_1(inter.anchorHigh);
      const verdict = textOrNullV0_1(inter.verdict);
      const vowelUnderTest = textOrNullV0_1(inter.vowelUnderTest ?? task.vowelUnderTest);
      const languageHint = textOrNullV0_1(task.languageHint);

      if (
        task.taskId !== "T5_INTERMEDIATE_V0_1" ||
        !anchorLow ||
        !anchorHigh ||
        !verdict ||
        !vowelUnderTest ||
        !languageHint
      ) {
        return null;
      }

      const role = inferRoleV0_1(row);
      const bracket = `${anchorLow}-${anchorHigh}`;

      return {
        runId: row.runId,
        role,
        bracket,
        verdict,
        gap_low: numberOrNullV0_1(inter.gap_low),
        gap_high: numberOrNullV0_1(inter.gap_high),
        normalizedPosition: numberOrNullV0_1(inter.normalizedPosition),
        diagnosticFlags: Array.isArray(inter.diagnosticFlags)
          ? inter.diagnosticFlags.map(String)
          : [],
        taskId: task.taskId,
        languageHint,
        vowelUnderTest,
      };
    });

  if (runInputs.some((run) => run === null)) return null;

  const completeRuns = runInputs.filter((run): run is NonNullable<typeof run> => run !== null);

  if (completeRuns.length < 2) return null;
  if (!completeRuns.some((run) => run.role === "candidate")) return null;
  if (!completeRuns.some((run) => run.role === "control")) return null;
  if (!completeRuns.some((run) => run.bracket.endsWith("-V7"))) return null;

  const languageHint = sameOrNullV0_1(completeRuns.map((run) => run.languageHint));
  const vowelUnderTest = sameOrNullV0_1(completeRuns.map((run) => run.vowelUnderTest));
  const taskId = sameOrNullV0_1(completeRuns.map((run) => run.taskId));

  if (!languageHint || !vowelUnderTest || taskId !== "T5_INTERMEDIATE_V0_1") {
    return null;
  }

  return buildHighRegionSeriesDiagnosticsArtifactV0_1({
    series: {
      seriesLabel: input.seriesLabel,
      cohort: inferCohortV0_1(input.seriesLabel),
      phase: inferPhaseV0_1(input.seriesLabel),
      languageHint,
      vowelUnderTest,
      taskId,
      inputShape: "intermediate_triple",
    },
    sourceType: "series_evidence_pack",
    sourceEvidencePack: null,
    sourceRunIndex: "01_RUN_INDEX.md",
    notes: [
      "Built during UI series evidence-pack export from active saved-run series.",
      "Cross-series audit flags are not inferred by this adapter.",
    ],
    runs: completeRuns.map((run) => ({
      runId: run.runId,
      role: run.role,
      bracket: run.bracket,
      verdict: run.verdict,
      gap_low: run.gap_low,
      gap_high: run.gap_high,
      normalizedPosition: run.normalizedPosition,
      diagnosticFlags: run.diagnosticFlags,
    })),
  });
}

type IntermediateTaskV0_1 = NonNullable<EvalReportBundleV0_1["tasks"][number]> & {
  intermediate_aperturePresenceMean?: {
    vowelUnderTest?: unknown;
    anchorLow?: unknown;
    anchorHigh?: unknown;
    verdict?: unknown;
    gap_low?: unknown;
    gap_high?: unknown;
    normalizedPosition?: unknown;
    diagnosticFlags?: unknown;
  } | null;
  vowelUnderTest?: unknown;
};

function findIntermediateTaskV0_1(report: EvalReportBundleV0_1): IntermediateTaskV0_1 | null {
  const task =
    report.tasks.find((item) => item.taskId === "T5_INTERMEDIATE_V0_1") ??
    report.tasks.find((item) => Boolean((item as IntermediateTaskV0_1).intermediate_aperturePresenceMean));

  return task ? (task as IntermediateTaskV0_1) : null;
}

function inferRoleV0_1(row: HighRegionSeriesExportRowV0_1): "candidate" | "control" {
  const text = `${row.runId} ${row.title ?? ""}`.toLowerCase();

  if (/(^|[._\-\s])control([._\-\s]|$)/.test(text)) {
    return "control";
  }

  return "candidate";
}

function textOrNullV0_1(value: unknown): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text || null;
}

function numberOrNullV0_1(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function sameOrNullV0_1(values: readonly string[]): string | null {
  const unique = [...new Set(values.map((value) => value.trim()).filter(Boolean))];
  return unique.length === 1 ? unique[0] : null;
}

function inferCohortV0_1(seriesLabel: string): string {
  const text = seriesLabel.toLowerCase();
  const match = text.match(/cohort[-_\s]?0?(\d+)/) ?? text.match(/c0?(\d+)/);
  if (!match) return "unknown";
  return `cohort${String(match[1]).padStart(2, "0")}`;
}

function inferPhaseV0_1(seriesLabel: string): string {
  const text = seriesLabel.toLowerCase();
  if (text.includes("high-region")) return "high-region";
  if (text.includes("audit")) return "audit";
  if (text.includes("indo-iranian")) return "indo-iranian";
  if (text.includes("semitic")) return "semitic";
  return "series-evidence-pack";
}
