export const HIGH_REGION_COLLAPSE_DIAGNOSTIC_LABELS_V0_1 = [
  "BOUNDARY_OVERPRESSURE",
  "TARGET_FUNCTION_MISMATCH_UNLIKELY",
  "HIGH_ANCHOR_CONTAMINATION_SUSPECT",
  "HIGH_ANCHOR_SUCTION",
  "BRACKET_GEOMETRY_SUSPECT",
  "HARD_HIGH_REGION_PRESSURE",
] as const;

export type HighRegionCollapseDiagnosticLabelV0_1 =
  (typeof HIGH_REGION_COLLAPSE_DIAGNOSTIC_LABELS_V0_1)[number];

export type HighRegionCollapseRunSummaryV0_1 = {
  verdict: string;
  gap_high: number | null;
  gap_low?: number | null;
  diagnosticFlags?: readonly string[] | null;
};

export type HighRegionCollapseDiagnosticsInputV0_1 = {
  candidateRuns: readonly HighRegionCollapseRunSummaryV0_1[];
  controlRuns: readonly HighRegionCollapseRunSummaryV0_1[];
  functionMixedArmCollapsedHigh?: boolean;
  functionMatchedArmCollapsedHigh?: boolean;
  repeatedAcrossIndependentPacks?: boolean;
  highAnchorContaminationSuspected?: boolean;
};

export type HighRegionCollapseDiagnosticsResultV0_1 = {
  collapseMode: HighRegionCollapseDiagnosticLabelV0_1 | null;
  secondary: HighRegionCollapseDiagnosticLabelV0_1[];
  diagnosticBasis: string[];
};

/**
 * Pure post-score diagnostic helper.
 *
 * This helper does not score buckets.
 * This helper does not change verdicts.
 * This helper does not change gaps, normalizedPosition, or flags.
 * It only classifies already-computed collapse evidence.
 */
export function diagnoseHighRegionCollapseV0_1(
  input: HighRegionCollapseDiagnosticsInputV0_1,
): HighRegionCollapseDiagnosticsResultV0_1 {
  const allRuns = [...input.candidateRuns, ...input.controlRuns];
  const diagnosticBasis = new Set<string>();
  const secondary = new Set<HighRegionCollapseDiagnosticLabelV0_1>();

  const candidateCollapsedHigh =
    input.candidateRuns.length > 0 &&
    input.candidateRuns.every((run) => run.verdict === "COLLAPSED_HIGH");

  const controlCollapsedHigh =
    input.controlRuns.length > 0 &&
    input.controlRuns.every((run) => run.verdict === "COLLAPSED_HIGH");

  const collapsedRuns = allRuns.filter((run) => run.verdict === "COLLAPSED_HIGH");

  const highSideNegative =
    candidateCollapsedHigh &&
    controlCollapsedHigh &&
    collapsedRuns.length === allRuns.length &&
    collapsedRuns.every(
      (run) =>
        typeof run.gap_high === "number" &&
        Number.isFinite(run.gap_high) &&
        run.gap_high < 0,
    );

  const hasBoundaryFlag = allRuns.some((run) =>
    (run.diagnosticFlags ?? []).some(
      (flag) =>
        flag.includes("BOUNDARY_UNCERTAIN") ||
        flag.includes("NEAR_COLLAPSE"),
    ),
  );

  if (candidateCollapsedHigh) diagnosticBasis.add("candidateCollapsedHigh");
  if (controlCollapsedHigh) diagnosticBasis.add("widerControlCollapsedHigh");
  if (highSideNegative) diagnosticBasis.add("highSideGapNegative");
  if (hasBoundaryFlag) diagnosticBasis.add("boundaryFlagsPresent");
  if (input.functionMixedArmCollapsedHigh) diagnosticBasis.add("functionMixedArmCollapsedHigh");
  if (input.functionMatchedArmCollapsedHigh) diagnosticBasis.add("functionMatchedAuditCollapsedHigh");
  if (input.repeatedAcrossIndependentPacks) diagnosticBasis.add("repeatedAcrossIndependentPacks");
  if (input.highAnchorContaminationSuspected) diagnosticBasis.add("highAnchorContaminationSuspected");

  if (hasBoundaryFlag) {
    return {
      collapseMode: "BOUNDARY_OVERPRESSURE",
      secondary: [],
      diagnosticBasis: orderedBasisV0_1(diagnosticBasis),
    };
  }

  if (input.functionMixedArmCollapsedHigh && input.functionMatchedArmCollapsedHigh) {
    secondary.add("TARGET_FUNCTION_MISMATCH_UNLIKELY");
  }

  if (input.highAnchorContaminationSuspected) {
    secondary.add("HIGH_ANCHOR_CONTAMINATION_SUSPECT");
  }

  if (candidateCollapsedHigh && controlCollapsedHigh) {
    secondary.add("BRACKET_GEOMETRY_SUSPECT");
  }

  let collapseMode: HighRegionCollapseDiagnosticLabelV0_1 | null = null;

  if (
    candidateCollapsedHigh &&
    controlCollapsedHigh &&
    highSideNegative &&
    input.functionMatchedArmCollapsedHigh
  ) {
    collapseMode = "HIGH_ANCHOR_SUCTION";
  }

  if (
    input.repeatedAcrossIndependentPacks &&
    input.functionMatchedArmCollapsedHigh &&
    candidateCollapsedHigh &&
    controlCollapsedHigh
  ) {
    secondary.add("HARD_HIGH_REGION_PRESSURE");
  }

  return {
    collapseMode,
    secondary: orderLabelsV0_1(secondary).filter((label) => label !== collapseMode),
    diagnosticBasis: orderedBasisV0_1(diagnosticBasis),
  };
}

function orderLabelsV0_1(
  labels: ReadonlySet<HighRegionCollapseDiagnosticLabelV0_1>,
): HighRegionCollapseDiagnosticLabelV0_1[] {
  return HIGH_REGION_COLLAPSE_DIAGNOSTIC_LABELS_V0_1.filter((label) => labels.has(label));
}

function orderedBasisV0_1(labels: ReadonlySet<string>): string[] {
  const preferredOrder = [
    "candidateCollapsedHigh",
    "widerControlCollapsedHigh",
    "highSideGapNegative",
    "boundaryFlagsPresent",
    "functionMixedArmCollapsedHigh",
    "functionMatchedAuditCollapsedHigh",
    "repeatedAcrossIndependentPacks",
    "highAnchorContaminationSuspected",
  ];

  return preferredOrder.filter((label) => labels.has(label));
}
