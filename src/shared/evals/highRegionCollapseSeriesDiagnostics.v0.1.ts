import {
  diagnoseHighRegionCollapseV0_1,
  type HighRegionCollapseDiagnosticLabelV0_1,
  type HighRegionCollapseDiagnosticsResultV0_1,
  type HighRegionCollapseRunSummaryV0_1,
} from "@/shared/evals/highRegionCollapseDiagnostics.v0.1";

export type HighRegionCollapseSeriesRunRoleV0_1 =
  | "candidate"
  | "control";

export type HighRegionCollapseSeriesRunSummaryV0_1 =
  HighRegionCollapseRunSummaryV0_1 & {
    runId: string;
    role: HighRegionCollapseSeriesRunRoleV0_1;
    bracket: string;
  };

export type HighRegionCollapseSeriesDiagnosticsInputV0_1 = {
  seriesLabel: string;
  runs: readonly HighRegionCollapseSeriesRunSummaryV0_1[];
  functionMixedArmCollapsedHigh?: boolean;
  functionMatchedArmCollapsedHigh?: boolean;
  repeatedAcrossIndependentPacks?: boolean;
  highAnchorContaminationSuspected?: boolean;
};

export type HighRegionCollapseSeriesBasisV0_1 = {
  seriesLabel: string;
  runCount: number;
  candidateRunCount: number;
  controlRunCount: number;
  candidateRunIds: string[];
  controlRunIds: string[];
  candidateBrackets: string[];
  controlBrackets: string[];
};

export type HighRegionCollapseSeriesDiagnosticsResultV0_1 = {
  seriesLabel: string;
  collapseMode: HighRegionCollapseDiagnosticLabelV0_1 | null;
  secondary: HighRegionCollapseDiagnosticLabelV0_1[];
  diagnosticBasis: string[];
  seriesBasis: HighRegionCollapseSeriesBasisV0_1;
};

/**
 * Pure series-level high-region diagnostic helper.
 *
 * This helper consumes already-scored run summaries.
 * It does not score buckets.
 * It does not change verdicts.
 * It does not change gaps, normalizedPosition, diagnosticFlags, API output,
 * report rendering, evidence-pack export, or UI rendering.
 */
export function diagnoseHighRegionCollapseSeriesV0_1(
  input: HighRegionCollapseSeriesDiagnosticsInputV0_1,
): HighRegionCollapseSeriesDiagnosticsResultV0_1 {
  const candidateRuns = input.runs.filter((run) => run.role === "candidate");
  const controlRuns = input.runs.filter((run) => run.role === "control");

  const diagnostics: HighRegionCollapseDiagnosticsResultV0_1 =
    diagnoseHighRegionCollapseV0_1({
      candidateRuns,
      controlRuns,
      functionMixedArmCollapsedHigh: input.functionMixedArmCollapsedHigh,
      functionMatchedArmCollapsedHigh: input.functionMatchedArmCollapsedHigh,
      repeatedAcrossIndependentPacks: input.repeatedAcrossIndependentPacks,
      highAnchorContaminationSuspected: input.highAnchorContaminationSuspected,
    });

  return {
    seriesLabel: input.seriesLabel,
    collapseMode: diagnostics.collapseMode,
    secondary: diagnostics.secondary,
    diagnosticBasis: diagnostics.diagnosticBasis,
    seriesBasis: {
      seriesLabel: input.seriesLabel,
      runCount: input.runs.length,
      candidateRunCount: candidateRuns.length,
      controlRunCount: controlRuns.length,
      candidateRunIds: candidateRuns.map((run) => run.runId),
      controlRunIds: controlRuns.map((run) => run.runId),
      candidateBrackets: uniqueStringsV0_1(candidateRuns.map((run) => run.bracket)),
      controlBrackets: uniqueStringsV0_1(controlRuns.map((run) => run.bracket)),
    },
  };
}

function uniqueStringsV0_1(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
