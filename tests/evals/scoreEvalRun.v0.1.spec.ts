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
});
