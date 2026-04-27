import type { IntermediateTaskReportV0_1 } from "@/shared/evals/report.v0.1";

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
