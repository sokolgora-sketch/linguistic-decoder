import {
  diagnoseHighRegionCollapseSeriesV0_1,
  type HighRegionCollapseSeriesDiagnosticsInputV0_1,
  type HighRegionCollapseSeriesDiagnosticsResultV0_1,
  type HighRegionCollapseSeriesRunRoleV0_1,
} from "@/shared/evals/highRegionCollapseSeriesDiagnostics.v0.1";

export const HIGH_REGION_SERIES_DIAGNOSTICS_ARTIFACT_VERSION_V0_1 =
  "highRegionSeriesDiagnosticsArtifact.v0.1" as const;

export const HIGH_REGION_SERIES_DIAGNOSTICS_CLAIM_BOUNDARIES_V0_1 = [
  "Does not change scorer output.",
  "Does not change run verdicts.",
  "Does not claim the high-region issue is solved.",
  "Does not claim bracket support.",
  "Does not claim framework proof.",
] as const;

export type HighRegionSeriesDiagnosticsArtifactSourceTypeV0_1 =
  | "manual_test_fixture"
  | "series_evidence_pack";

export type HighRegionSeriesDiagnosticsArtifactSeriesMetaV0_1 = {
  seriesLabel: string;
  cohort: string;
  phase: string;
  languageHint: string;
  vowelUnderTest: string;
  taskId: string;
  inputShape: string;
};

export type HighRegionSeriesDiagnosticsArtifactRunInputV0_1 = {
  runId: string;
  role: HighRegionCollapseSeriesRunRoleV0_1;
  bracket: string;
  verdict: string;
  gap_low?: number | null;
  gap_high?: number | null;
  normalizedPosition?: number | null;
  diagnosticFlags?: readonly string[] | null;
};

export type HighRegionSeriesDiagnosticsArtifactInputV0_1 = {
  series: HighRegionSeriesDiagnosticsArtifactSeriesMetaV0_1;
  sourceType: HighRegionSeriesDiagnosticsArtifactSourceTypeV0_1;
  sourceEvidencePack?: string | null;
  sourceRunIndex?: string | null;
  notes?: readonly string[];
  runs: readonly HighRegionSeriesDiagnosticsArtifactRunInputV0_1[];
  functionMixedArmCollapsedHigh?: boolean;
  functionMatchedArmCollapsedHigh?: boolean;
  repeatedAcrossIndependentPacks?: boolean;
  highAnchorContaminationSuspected?: boolean;
};

export type HighRegionSeriesDiagnosticsArtifactV0_1 = {
  artifactVersion: typeof HIGH_REGION_SERIES_DIAGNOSTICS_ARTIFACT_VERSION_V0_1;
  generatedBy: {
    helper: "diagnoseHighRegionCollapseV0_1";
    helperVersion: "v0.1";
    seriesHelper: "diagnoseHighRegionCollapseSeriesV0_1";
    seriesHelperVersion: "v0.1";
  };
  series: HighRegionSeriesDiagnosticsArtifactSeriesMetaV0_1;
  source: {
    sourceType: HighRegionSeriesDiagnosticsArtifactSourceTypeV0_1;
    sourceEvidencePack: string | null;
    sourceRunIndex: string | null;
    notes: string[];
  };
  runSets: {
    candidate: {
      brackets: string[];
      runIds: string[];
      count: number;
    };
    control: {
      brackets: string[];
      runIds: string[];
      count: number;
    };
  };
  runSummaries: Array<{
    runId: string;
    role: HighRegionCollapseSeriesRunRoleV0_1;
    bracket: string;
    verdict: string;
    gap_low: number | null;
    gap_high: number | null;
    normalizedPosition: number | null;
    diagnosticFlags: string[];
  }>;
  diagnostics: {
    collapseMode: HighRegionCollapseSeriesDiagnosticsResultV0_1["collapseMode"];
    secondary: HighRegionCollapseSeriesDiagnosticsResultV0_1["secondary"];
    diagnosticBasis: string[];
    seriesBasis: HighRegionCollapseSeriesDiagnosticsResultV0_1["seriesBasis"];
  };
  claimBoundaries: string[];
};

/**
 * Pure artifact builder for the future `series-diagnostics.json`.
 *
 * This builder does not score buckets.
 * This builder does not change verdicts.
 * This builder does not write files.
 * This builder does not wire evidence-pack export.
 * This builder does not touch API, reports, exports, UI, or saved runs.
 */
export function buildHighRegionSeriesDiagnosticsArtifactV0_1(
  input: HighRegionSeriesDiagnosticsArtifactInputV0_1,
): HighRegionSeriesDiagnosticsArtifactV0_1 {
  const seriesRuns: HighRegionCollapseSeriesDiagnosticsInputV0_1["runs"] =
    input.runs.map((run) => ({
      runId: run.runId,
      role: run.role,
      bracket: run.bracket,
      verdict: run.verdict,
      gap_low: normalizeNumberOrNullV0_1(run.gap_low),
      gap_high: normalizeNumberOrNullV0_1(run.gap_high),
      diagnosticFlags: [...(run.diagnosticFlags ?? [])],
    }));

  const diagnostics = diagnoseHighRegionCollapseSeriesV0_1({
    seriesLabel: input.series.seriesLabel,
    runs: seriesRuns,
    functionMixedArmCollapsedHigh: input.functionMixedArmCollapsedHigh,
    functionMatchedArmCollapsedHigh: input.functionMatchedArmCollapsedHigh,
    repeatedAcrossIndependentPacks: input.repeatedAcrossIndependentPacks,
    highAnchorContaminationSuspected: input.highAnchorContaminationSuspected,
  });

  const candidateRuns = input.runs.filter((run) => run.role === "candidate");
  const controlRuns = input.runs.filter((run) => run.role === "control");

  return {
    artifactVersion: HIGH_REGION_SERIES_DIAGNOSTICS_ARTIFACT_VERSION_V0_1,
    generatedBy: {
      helper: "diagnoseHighRegionCollapseV0_1",
      helperVersion: "v0.1",
      seriesHelper: "diagnoseHighRegionCollapseSeriesV0_1",
      seriesHelperVersion: "v0.1",
    },
    series: {
      seriesLabel: input.series.seriesLabel,
      cohort: input.series.cohort,
      phase: input.series.phase,
      languageHint: input.series.languageHint,
      vowelUnderTest: input.series.vowelUnderTest,
      taskId: input.series.taskId,
      inputShape: input.series.inputShape,
    },
    source: {
      sourceType: input.sourceType,
      sourceEvidencePack: input.sourceEvidencePack ?? null,
      sourceRunIndex: input.sourceRunIndex ?? null,
      notes: [...(input.notes ?? [])],
    },
    runSets: {
      candidate: {
        brackets: uniqueStringsV0_1(candidateRuns.map((run) => run.bracket)),
        runIds: candidateRuns.map((run) => run.runId),
        count: candidateRuns.length,
      },
      control: {
        brackets: uniqueStringsV0_1(controlRuns.map((run) => run.bracket)),
        runIds: controlRuns.map((run) => run.runId),
        count: controlRuns.length,
      },
    },
    runSummaries: input.runs.map((run) => ({
      runId: run.runId,
      role: run.role,
      bracket: run.bracket,
      verdict: run.verdict,
      gap_low: normalizeNumberOrNullV0_1(run.gap_low),
      gap_high: normalizeNumberOrNullV0_1(run.gap_high),
      normalizedPosition: normalizeNumberOrNullV0_1(run.normalizedPosition),
      diagnosticFlags: [...(run.diagnosticFlags ?? [])],
    })),
    diagnostics: {
      collapseMode: diagnostics.collapseMode,
      secondary: diagnostics.secondary,
      diagnosticBasis: diagnostics.diagnosticBasis,
      seriesBasis: diagnostics.seriesBasis,
    },
    claimBoundaries: [...HIGH_REGION_SERIES_DIAGNOSTICS_CLAIM_BOUNDARIES_V0_1],
  };
}

function normalizeNumberOrNullV0_1(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function uniqueStringsV0_1(values: readonly string[]): string[] {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}
