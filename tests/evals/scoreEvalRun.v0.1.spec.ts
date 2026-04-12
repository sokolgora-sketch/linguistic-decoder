import { describe, it, expect } from "@jest/globals";

import { EVAL_SPEC_V0_1 } from "@/shared/evals/spec.v0.1";
import { scoreEvalRunBundleV0_1 } from "@/shared/evals/scoreEvalRun.v0.1";

function rep(base: string, n: number) {
  const out: string[] = [];
  for (let i = 0; i < n; i++) out.push(base + (i === 0 ? "" : String(i + 1)));
  return out;
}

describe("Evals scorer v0.1 — synthetic ladder + negative control gates", () => {
  it("scores T2 ladder and derives a clean T3/T4 control-health verdict deterministically", () => {
    const t2 = EVAL_SPEC_V0_1.tasks.find((t) => t.taskId.startsWith("T2_") && t.kind === "byo");
    const t3 = EVAL_SPEC_V0_1.tasks.find((t) => t.taskId === "T3_NEGATIVE_CONTROL_SHUFFLE_V0_1");
    const t4 = EVAL_SPEC_V0_1.tasks.find((t) => t.taskId === "T4_NEGATIVE_CONTROL_SHUFFLE_ALT_V0_1");
    if (!t2) throw new Error("Missing T2 task in spec");
    if (!t3) throw new Error("Missing T3 derived task in spec");
    if (!t4) throw new Error("Missing T4 derived task in spec");

    const buckets = {
      V1: rep("a", t2.nPerBucket),
      V2: rep("o", t2.nPerBucket),
      V3: rep("e", t2.nPerBucket),
      V4: rep("ë", t2.nPerBucket),
      V5: rep("u", t2.nPerBucket),
      V6: rep("y", t2.nPerBucket),
      V7: rep("i", t2.nPerBucket),
    } as const;

    const run = {
      evalRunVersion: "evalRun.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: "gold.synthetic.ladder.v0.1",
      meta: { provider: "synthetic", model: "none", label: "calibration" },
      tasks: [
        {
          taskId: t2.taskId,
          inputShape: "bucketed_single_tokens",
          buckets,
        },
      ],
    } as const;

    const report = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run });

    const r2 = report.tasks.find((x) => x.taskId === t2.taskId);
    expect(r2).toBeTruthy();
    expect(r2?.slope_aperturePresenceMean?.spearman_rho).toBe(-1);

    const r3 = report.tasks.find((x) => x.taskId === t3.taskId);
    const r4 = report.tasks.find((x) => x.taskId === t4.taskId);
    expect(r3).toBeTruthy();
    expect(r4).toBeTruthy();

    expect(r3?.slope_aperturePresenceMean?.p_spearman).toBeGreaterThanOrEqual(0.1);
    expect(r3?.slope_aperturePresenceMean?.p_pearson).toBeGreaterThanOrEqual(0.1);

    expect(report.controlHealth.status).toBe("controlClean");
    expect(report.controlHealth.reason).toBe("T3/T4 controls clean");
    expect(report.controlHealth.failingCount).toBe(0);
    expect(report.controlHealth.missingCount).toBe(0);

    expect(report).toMatchSnapshot();
  });

  it("scores T5 intermediate position on presenceMean and rejects a wrong bracket", () => {
    const t5 = EVAL_SPEC_V0_1.tasks.find((t) => t.taskId === "T5_INTERMEDIATE_V0_1");
    if (!t5) throw new Error("Missing T5 task in spec");

    const goodRun = {
      evalRunVersion: "evalRun.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: "gold.synthetic.t5.intermediate.v0.1",
      meta: { provider: "synthetic", model: "none", label: "t5-good" },
      tasks: [
        {
          taskId: t5.taskId,
          inputShape: "intermediate_triple",
          languageHint: "fi",
          vowelUnderTest: "æ",
          anchorLow: "V1",
          anchorHigh: "V3",
          buckets: {
            anchor_low: rep("a", t5.nPerBucket),
            x_vowel: rep("ae", t5.nPerBucket),
            anchor_high: rep("e", t5.nPerBucket),
          },
        },
      ],
    } as const;

    const good = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run: goodRun });
    const goodTask = good.tasks.find((x) => x.taskId === "T5_INTERMEDIATE_V0_1");
    const goodIntermediate = goodTask?.intermediate_aperturePresenceMean;

    expect(goodIntermediate).toBeTruthy();
    expect(goodIntermediate?.mean_anchor_low).toBeCloseTo(1.0, 6);
    expect(goodIntermediate?.mean_x_vowel).toBeCloseTo(0.8, 6);
    expect(goodIntermediate?.mean_anchor_high).toBeCloseTo(0.6, 6);
    expect(goodIntermediate?.gap_low).toBeCloseTo(0.2, 6);
    expect(goodIntermediate?.gap_high).toBeCloseTo(0.2, 6);
    expect(goodIntermediate?.normalizedPosition).toBeCloseTo(0.5, 6);
    expect(goodIntermediate?.verdict).toBe("INTERMEDIATE");
    expect(goodIntermediate?.ordinalPermutation.observed_order).toBe(true);
    expect(goodIntermediate?.ordinalPermutation.p_value).toBeCloseTo(0.12533333333333332, 12);
    expect(goodIntermediate?.diagnosticFlags).toEqual([]);
    expect(goodTask?.slope_aperturePrimary).toBeNull();
    expect(goodTask?.slope_aperturePresenceMean).toBeNull();

    const wrongBracketRun = {
      evalRunVersion: "evalRun.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: "gold.synthetic.t5.wrongbracket.v0.1",
      meta: { provider: "synthetic", model: "none", label: "t5-wrong-bracket" },
      tasks: [
        {
          taskId: t5.taskId,
          inputShape: "intermediate_triple",
          languageHint: "de",
          vowelUnderTest: "æ",
          anchorLow: "V2",
          anchorHigh: "V3",
          buckets: {
            anchor_low: rep("o", t5.nPerBucket),
            x_vowel: rep("ae", t5.nPerBucket),
            anchor_high: rep("e", t5.nPerBucket),
          },
        },
      ],
    } as const;

    const wrong = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run: wrongBracketRun });
    const wrongTask = wrong.tasks.find((x) => x.taskId === "T5_INTERMEDIATE_V0_1");
    const wrongIntermediate = wrongTask?.intermediate_aperturePresenceMean;

    expect(wrongIntermediate).toBeTruthy();
    expect(wrongIntermediate?.mean_anchor_low).toBeCloseTo(0.8, 6);
    expect(wrongIntermediate?.mean_x_vowel).toBeCloseTo(0.8, 6);
    expect(wrongIntermediate?.mean_anchor_high).toBeCloseTo(0.6, 6);
    expect(wrongIntermediate?.diagnosticFlags).toContain("BOUNDARY_UNCERTAIN_LOW");
    expect(wrongIntermediate?.diagnosticFlags).not.toContain("NEAR_COLLAPSE_LOW");
    expect(wrongIntermediate?.verdict).toBe("COLLAPSED_LOW");
  });

  test("flags low boundary uncertainty for near-collapse intermediates", () => {
    const t5 = EVAL_SPEC_V0_1.tasks.find((x) => x.taskId === "T5_INTERMEDIATE_V0_1");
    expect(t5).toBeTruthy();
    if (!t5) return;

    const nearBoundaryRun = {
      evalRunVersion: "evalRun.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: "gold.synthetic.t5.boundary-low.v0.1",
      meta: { provider: "synthetic", model: "none", label: "t5-boundary-low" },
      tasks: [
        {
          taskId: t5.taskId,
          inputShape: "intermediate_triple",
          languageHint: "da",
          vowelUnderTest: "ø",
          anchorLow: "V2",
          anchorHigh: "V5",
          buckets: {
            anchor_low: rep("o", t5.nPerBucket),
            x_vowel: [...rep("o", 18), ...rep("oe", 12)],
            anchor_high: rep("u", t5.nPerBucket),
          },
        },
      ],
    } as const;

    const scored = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run: nearBoundaryRun });
    const task = scored.tasks.find((x) => x.taskId === "T5_INTERMEDIATE_V0_1");
    const inter = task?.intermediate_aperturePresenceMean;

    expect(inter).toBeTruthy();
    expect(inter?.verdict).toBe("INTERMEDIATE");
    expect(inter?.gap_low).toBeGreaterThan(0);
    expect(inter?.gap_low ?? 0).toBeLessThanOrEqual(0.041);
    expect(inter?.diagnosticFlags).toContain("NEAR_COLLAPSE_LOW");
    expect(inter?.diagnosticFlags).toContain("BOUNDARY_UNCERTAIN_LOW");
  });

  test("keeps low boundary uncertainty when verdict exceeds low", () => {
    const t5 = EVAL_SPEC_V0_1.tasks.find((x) => x.taskId === "T5_INTERMEDIATE_V0_1");
    expect(t5).toBeTruthy();
    if (!t5) return;

    const exceedsLowRun = {
      evalRunVersion: "evalRun.v0.1",
      evalSpecVersion: "evalSpec.v0.1",
      specId: "public-grounding-probe.v0.1",
      runId: "gold.synthetic.t5.boundary-cross-low.v0.1",
      meta: { provider: "synthetic", model: "none", label: "t5-boundary-cross-low" },
      tasks: [
        {
          taskId: t5.taskId,
          inputShape: "intermediate_triple",
          languageHint: "da",
          vowelUnderTest: "ø",
          anchorLow: "V2",
          anchorHigh: "V5",
          buckets: {
            anchor_low: [...rep("o", 18), ...rep("oe", 12)],
            x_vowel: rep("o", t5.nPerBucket),
            anchor_high: rep("u", t5.nPerBucket),
          },
        },
      ],
    } as const;

    const scored = scoreEvalRunBundleV0_1({ spec: EVAL_SPEC_V0_1, run: exceedsLowRun });
    const task = scored.tasks.find((x) => x.taskId === "T5_INTERMEDIATE_V0_1");
    const inter = task?.intermediate_aperturePresenceMean;

    expect(inter).toBeTruthy();
    expect(inter?.verdict).toBe("EXCEEDS_LOW");
    expect(inter?.gap_low).toBeLessThanOrEqual(0);
    expect(Math.abs(inter?.gap_low ?? 1)).toBeLessThanOrEqual(0.041);
    expect(inter?.diagnosticFlags).toContain("BOUNDARY_UNCERTAIN_LOW");
    expect(inter?.diagnosticFlags).not.toContain("NEAR_COLLAPSE_LOW");
  });
});
