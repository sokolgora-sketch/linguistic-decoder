import {
  EVALS_GUIDED_BASELINE_PROMPT_V0_1,
  getGuidedPromptV0_1,
} from "@/ui/evals/evalsGuidedPrompt.v0.1";
import type { EvalReportBundleV0_1 } from "@/shared/evals/report.v0.1";

function makeReport(params: {
  primaryMeans: number[];
  presenceMeans: number[];
  spearmanPrimary?: number;
  spearmanPresence?: number;
  controlHealthStatus?: "controlClean" | "controlWarn" | "controlFail";
  t3PSpearman?: number;
  t4PSpearman?: number;
}): EvalReportBundleV0_1 {
  const {
    primaryMeans,
    presenceMeans,
    spearmanPrimary = -0.5,
    spearmanPresence = -0.5,
    controlHealthStatus = "controlClean",
    t3PSpearman = 0.5,
    t4PSpearman = 0.5,
  } = params;

  return {
    evalReportVersion: "evalReport.v0.1",
    evalSpecVersion: "evalSpec.v0.1",
    specId: "public-grounding-probe.v0.1",
    runId: "battery.v0.1.test.r01",
    meta: {
      provider: "openai",
      model: "chatgpt52thinking",
      label: "test",
    },
    tasks: [
      {
        taskId: "T2_LADDER_V0_1",
        kind: "byo",
        title: "Full Ladder — V1..V7",
        languageHint: "en",
        targetBuckets: ["V1", "V2", "V3", "V4", "V5", "V6", "V7"],
        nPerBucket: 10,
        buckets: ["V1", "V2", "V3", "V4", "V5", "V6", "V7"].map((bucket, index) => ({
          bucket,
          expectedN: 10,
          providedN: 10,
          validN: 10,
          invalidN: 0,
          duplicateN: 0,
          mean_aperturePrimary: primaryMeans[index],
          mean_aperturePresenceMean: presenceMeans[index],
        })),
        slope_aperturePrimary: {
          bucketOrder: ["V1", "V2", "V3", "V4", "V5", "V6", "V7"],
          means: primaryMeans,
          pearson_r: -0.5,
          spearman_rho: spearmanPrimary,
          p_pearson: 0.1,
          p_spearman: 0.1,
          iters: 12000,
          seed: 1,
        },
        slope_aperturePresenceMean: {
          bucketOrder: ["V1", "V2", "V3", "V4", "V5", "V6", "V7"],
          means: presenceMeans,
          pearson_r: -0.5,
          spearman_rho: spearmanPresence,
          p_pearson: 0.1,
          p_spearman: 0.1,
          iters: 12000,
          seed: 2,
        },
        diagnostics: {
          missingBuckets: [],
          extraBuckets: [],
          emptyTokenCount: 0,
          whitespaceTokenCount: 0,
          noVowelTokenCount: 0,
          totalInvalidTokenCount: 0,
          notes: [],
        },
      },
    ],
    controlHealth: {
      status: controlHealthStatus,
      reason: controlHealthStatus,
      threshold: 0.1,
      failingCount: controlHealthStatus === "controlFail" ? 1 : 0,
      missingCount: 0,
      tasks: [
        {
          taskId: "T3_NEGATIVE_CONTROL_SHUFFLE_V0_1",
          status: controlHealthStatus === "controlFail" ? "fail" : controlHealthStatus === "controlWarn" ? "warn" : "clean",
          p_spearman: t3PSpearman,
          p_pearson: 0.5,
          threshold: 0.1,
        },
        {
          taskId: "T4_NEGATIVE_CONTROL_SHUFFLE_ALT_V0_1",
          status: controlHealthStatus === "controlFail" ? "fail" : controlHealthStatus === "controlWarn" ? "warn" : "clean",
          p_spearman: t4PSpearman,
          p_pearson: 0.5,
          threshold: 0.1,
        },
      ],
    },
  };
}

describe("evals guided prompt v0.1", () => {
  it("keeps the baseline prompt stable", () => {
    expect(EVALS_GUIDED_BASELINE_PROMPT_V0_1).toContain("Return STRICT JSON only. No prose.");
    expect(EVALS_GUIDED_BASELINE_PROMPT_V0_1).toContain('"V7": ["..."]');
  });

  it("builds a heavy correction prompt for a noisy run", () => {
    const report = makeReport({
      primaryMeans: [0.75, 0.77, 0.82, 0.6, 0.55, 0.63, 0.58],
      presenceMeans: [0.672, 0.687, 0.725, 0.633, 0.51, 0.653, 0.518],
      spearmanPresence: -0.679,
      controlHealthStatus: "controlClean",
      t3PSpearman: 0.656,
      t4PSpearman: 0.5973333333333334,
    });

    const out = getGuidedPromptV0_1(report);
    expect(out).toBeTruthy();
    expect(out?.level).toBe("heavy");
    expect(out?.issues).toEqual(
      expect.arrayContaining([
        "V3 is too open relative to V2",
        "V6 is too open relative to V5 and V7 in presence-mean",
      ]),
    );
    expect(out?.correctionPrompt).toContain("V3 is too open relative to V2");
    expect(out?.correctionPrompt).toContain("T3 p_spearman: 0.656");
    expect(out?.correctionPrompt).toContain("T4 p_spearman: 0.597");
  });

  it("builds a minimal correction prompt for a near-converged run", () => {
    const report = makeReport({
      primaryMeans: [0.75, 0.71, 0.54, 0.53, 0.62, 0.34, 0.36],
      presenceMeans: [0.695, 0.617, 0.595, 0.542, 0.535, 0.487, 0.343],
      spearmanPrimary: -0.857,
      spearmanPresence: -1,
      controlHealthStatus: "controlClean",
      t3PSpearman: 0.5560833333333334,
      t4PSpearman: 0.7095833333333333,
    });

    const out = getGuidedPromptV0_1(report);
    expect(out).toBeTruthy();
    expect(out?.level).toBe("minimal");
    expect(out?.issues).toEqual(
      expect.arrayContaining([
        "V5 is too open relative to V4",
        "V7 should remain the tightest / least open endpoint",
      ]),
    );
    expect(out?.correctionPrompt).toContain("revise only as much as needed");
    expect(out?.correctionPrompt).toContain("V5 is too open relative to V4");
  });

  it("skips correction for a converged clean run", () => {
    const report = makeReport({
      primaryMeans: [0.75, 0.71, 0.54, 0.53, 0.52, 0.34, 0.31],
      presenceMeans: [0.695, 0.617, 0.595, 0.542, 0.515, 0.487, 0.32],
      spearmanPrimary: -1,
      spearmanPresence: -1,
      controlHealthStatus: "controlClean",
      t3PSpearman: 0.6625,
      t4PSpearman: 0.66275,
    });

    const out = getGuidedPromptV0_1(report);
    expect(out).toBeTruthy();
    expect(out?.level).toBe("skip");
    expect(out?.correctionPrompt).toBeNull();
    expect(out?.baselinePrompt).toBe(EVALS_GUIDED_BASELINE_PROMPT_V0_1);
  });
});
