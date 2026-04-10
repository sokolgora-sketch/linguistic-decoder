// EVALS-4 — Scoring Engine v0.1
// Deterministic. Reuses orthography SSOT. No heuristics, no ML.

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

import {
  slopePermutationV0_1,
  strictOrderPermutationV0_1,
  mean,
  mulberry32,
  shuffleInPlace,
} from "./stats.v0.1";
import type { EvalRunBundleV0_1 } from "./run.v0.1";
import {
  BUCKETS_V0_1,
  INTERMEDIATE_BUCKETS_V0_1,
  type BucketId,
  type EvalBucketKeyV0_1,
  type EvalSpecV0_1,
} from "./spec.v0.1";
import type {
  EvalReportBundleV0_1,
  EvalTaskReportV0_1,
  BucketReportV0_1,
  SlopeReportV0_1,
  IntermediateTaskReportV0_1,
} from "./report.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";

// Open -> closed (same readability order used elsewhere)
const APERTURE: Record<Vowel, number> = {
  A: 1.0,
  O: 0.8,
  E: 0.6,
  "Ë": 0.5,
  U: 0.4,
  Y: 0.3,
  I: 0.1,
};

function uniqInOrder(vs: Vowel[]): Vowel[] {
  const out: Vowel[] = [];
  for (const v of vs) if (!out.includes(v)) out.push(v);
  return out;
}

function normVowel(v: unknown): Vowel | null {
  const s = String(v ?? "").trim().toUpperCase();
  if (
    s === "A" ||
    s === "E" ||
    s === "I" ||
    s === "O" ||
    s === "U" ||
    s === "Y" ||
    s === "Ë"
  )
    return s as Vowel;
  return null;
}

function isBucketId(x: string): x is BucketId {
  return (BUCKETS_V0_1 as string[]).includes(x);
}

function toSlopeReport(params: {
  bucketOrder: BucketId[];
  scoreKey: "aperturePrimary" | "aperturePresenceMean";
  iters: number;
  seed: number;
  items: Array<{ bucket: BucketId; score: number }>;
}): SlopeReportV0_1 {
  const { bucketOrder, iters, seed, items } = params;
  const r = slopePermutationV0_1({
    bucketOrder,
    items: items.map((x) => ({ bucket: x.bucket, score: x.score })),
    iters,
    seed,
  });

  return {
    bucketOrder,
    means: r.obsMeans,
    pearson_r: r.pearson_r,
    spearman_rho: r.spearman_rho,
    p_pearson: r.p_pearson,
    p_spearman: r.p_spearman,
    iters,
    seed,
  };
}

// Deterministic negative control (no randomness):
// Interleave tokens by original bucket index, then assign sequentially to bucketOrder.
// Requires equal counts per bucket to fully "mix".
function deriveShuffleBucketLabelsV0_1(params: {
  baseBuckets: Partial<Record<BucketId, string[]>>;
  bucketOrder: BucketId[];
  seed: number;
}): Partial<Record<BucketId, string[]>> | null {
  const { baseBuckets, bucketOrder, seed } = params;

  // Require equal counts so the derived control preserves label counts exactly.
  const lens = bucketOrder.map((b) => (baseBuckets[b] ?? []).length);
  const min = Math.min(...lens);
  const max = Math.max(...lens);
  if (!Number.isFinite(min) || !Number.isFinite(max) || min <= 0) return null;
  if (min !== max) return null;

  const n = min;

  // Stable token stream: interleave buckets by index (ensures mixing independent of bucketOrder concat).
  const tokens: string[] = [];
  const labels: BucketId[] = [];
  for (let i = 0; i < n; i++) {
    for (const b of bucketOrder) {
      const tok = (baseBuckets[b] ?? [])[i];
      if (typeof tok === "string") {
        tokens.push(tok);
        labels.push(b); // exact counts preserved
      }
    }
  }

  // Deterministic Fisher–Yates shuffle of labels (tokens fixed, label counts preserved).
  const rnd = mulberry32(seed >>> 0);
  shuffleInPlace(labels, rnd);

  const out: Partial<Record<BucketId, string[]>> = {};
  for (const b of bucketOrder) out[b] = [];
  for (let i = 0; i < tokens.length; i++) {
    out[labels[i]]!.push(tokens[i]);
  }

  return out;
}

function buildIntermediateReportV0_1(params: {
  perBucket: BucketReportV0_1[];
  items: Array<{ bucket: EvalBucketKeyV0_1; score: number }>;
  vowelUnderTest: string;
  anchorLow: BucketId;
  anchorHigh: BucketId;
  iters: number;
  seed: number;
}): IntermediateTaskReportV0_1 | null {
  const { perBucket, items, vowelUnderTest, anchorLow, anchorHigh, iters, seed } = params;

  const bucketMap = new Map(
    perBucket.map((b) => [b.bucket, b.mean_aperturePresenceMean] as const),
  );

  const mean_anchor_low = bucketMap.get("anchor_low");
  const mean_x_vowel = bucketMap.get("x_vowel");
  const mean_anchor_high = bucketMap.get("anchor_high");

  if (
    typeof mean_anchor_low !== "number" ||
    typeof mean_x_vowel !== "number" ||
    typeof mean_anchor_high !== "number" ||
    !Number.isFinite(mean_anchor_low) ||
    !Number.isFinite(mean_x_vowel) ||
    !Number.isFinite(mean_anchor_high)
  ) {
    return null;
  }

  const gap_low = mean_anchor_low - mean_x_vowel;
  const gap_high = mean_x_vowel - mean_anchor_high;
  const denom = mean_anchor_low - mean_anchor_high;
  const normalizedPosition =
    Number.isFinite(denom) && denom !== 0 ? gap_low / denom : NaN;

  let verdict: IntermediateTaskReportV0_1["verdict"];
  if (mean_x_vowel > mean_anchor_low) {
    verdict = "EXCEEDS_LOW";
  } else if (mean_x_vowel >= mean_anchor_low) {
    verdict = "COLLAPSED_LOW";
  } else if (mean_x_vowel <= mean_anchor_high) {
    verdict = "COLLAPSED_HIGH";
  } else {
    verdict = "INTERMEDIATE";
  }

  const ord = strictOrderPermutationV0_1({
    bucketOrder: INTERMEDIATE_BUCKETS_V0_1,
    items: items.map((x) => ({ bucket: x.bucket, score: x.score })),
    iters,
    seed,
  });

  return {
    scoreKey: "aperturePresenceMean",
    vowelUnderTest,
    anchorLow,
    anchorHigh,
    mean_anchor_low,
    mean_x_vowel,
    mean_anchor_high,
    gap_low,
    gap_high,
    normalizedPosition,
    verdict,
    ordinalPermutation: {
      observed_order: ord.observed_order,
      p_value: ord.p_order,
      iters: ord.iters,
      seed: ord.seed,
    },
  };
}

const CONTROL_HEALTH_THRESHOLD_P_V0_1 = 0.1;

function buildControlHealthV0_1(
  reports: EvalTaskReportV0_1[],
): EvalReportBundleV0_1["controlHealth"] {
  const hasLadder = reports.some((t) => t.taskId === "T2_LADDER_V0_1");
  if (!hasLadder) {
    return {
      status: "controlClean",
      reason: "no ladder controls applicable",
      threshold: CONTROL_HEALTH_THRESHOLD_P_V0_1,
      failingCount: 0,
      missingCount: 0,
      tasks: [],
    };
  }

  const tasks: EvalReportBundleV0_1["controlHealth"]["tasks"] = [
    "T3_NEGATIVE_CONTROL_SHUFFLE_V0_1",
    "T4_NEGATIVE_CONTROL_SHUFFLE_ALT_V0_1",
  ].map((taskId) => {
    const task = reports.find((t) => t.taskId === taskId);
    const slope = task?.slope_aperturePresenceMean;
    if (!slope) {
      return {
        taskId,
        status: "missing",
        p_spearman: null,
        p_pearson: null,
        threshold: CONTROL_HEALTH_THRESHOLD_P_V0_1,
      };
    }

    const isClean =
      slope.p_spearman >= CONTROL_HEALTH_THRESHOLD_P_V0_1 &&
      slope.p_pearson >= CONTROL_HEALTH_THRESHOLD_P_V0_1;

    return {
      taskId,
      status: isClean ? "clean" : "fail",
      p_spearman: slope.p_spearman,
      p_pearson: slope.p_pearson,
      threshold: CONTROL_HEALTH_THRESHOLD_P_V0_1,
    };
  });

  const failingCount = tasks.filter((t) => t.status === "fail").length;
  const missingCount = tasks.filter((t) => t.status === "missing").length;

  let status: EvalReportBundleV0_1["controlHealth"]["status"] = "controlClean";
  let reason = "T3/T4 controls clean";

  if (failingCount === 0 && missingCount === 0) {
    status = "controlClean";
    reason = "T3/T4 controls clean";
  } else if (failingCount === 0 && missingCount > 0) {
    status = "controlWarn";
    reason = `${missingCount} control missing`;
  } else if (failingCount === 1 && missingCount === 0) {
    status = "controlWarn";
    reason = "1 control suspicious";
  } else if (failingCount === 1 && missingCount === 1) {
    status = "controlFail";
    reason = "1 control suspicious and 1 missing";
  } else if (failingCount >= 2) {
    status = "controlFail";
    reason = `${failingCount} controls suspicious`;
  } else {
    status = "controlFail";
    reason = "controls missing";
  }

  return {
    status,
    reason,
    threshold: CONTROL_HEALTH_THRESHOLD_P_V0_1,
    failingCount,
    missingCount,
    tasks,
  };
}

export function scoreEvalRunBundleV0_1(params: {
  spec: EvalSpecV0_1;
  run: EvalRunBundleV0_1;
}): EvalReportBundleV0_1 {
  const { spec, run } = params;

  const runByTaskId = new Map<string, EvalRunBundleV0_1["tasks"][number]>();
  for (const t of run.tasks) runByTaskId.set(t.taskId, t);

  const reports: EvalTaskReportV0_1[] = [];

  for (const task of spec.tasks) {
    const targetBuckets = task.targetBuckets;
    const bucketOrder: EvalBucketKeyV0_1[] =
      task.inputShape === "bucketed_single_tokens" &&
      targetBuckets.length === 7 &&
      targetBuckets.every((b): b is BucketId => isBucketId(String(b)))
        ? BUCKETS_V0_1
        : targetBuckets;

    const missingBuckets: EvalTaskReportV0_1["diagnostics"]["missingBuckets"] = [];
    const extraBuckets: EvalTaskReportV0_1["diagnostics"]["extraBuckets"] = [];
    const diagnosticNotes: string[] = [];

    let payload = runByTaskId.get(task.taskId);
    let payloadBuckets: Partial<Record<EvalBucketKeyV0_1, string[]>> | null = null;

    if (task.kind === "byo") {
      if (!payload) continue; // only score tasks present in run
      payloadBuckets = payload.buckets ?? {};
    } else {
      // derived
      const baseId = task.derivedFromTaskId;
      if (!baseId) continue;
      const basePayload = runByTaskId.get(baseId);
      if (!basePayload) continue;

      const derivedSeed =
        task.derivedOp === "shuffle_bucket_labels_alt_seed"
          ? (spec.scoring.permutation.seed ^ 0x06b85e3) >>> 0
          : (spec.scoring.permutation.seed ^ 0x00c0ffee) >>> 0;

      payloadBuckets = deriveShuffleBucketLabelsV0_1({
        baseBuckets: (basePayload.buckets ?? {}) as Partial<Record<BucketId, string[]>>,
        bucketOrder: BUCKETS_V0_1,
        seed: derivedSeed,
      });
      if (!payloadBuckets) {
        // can’t derive safely; emit a report with diagnostics anyway
        payloadBuckets = {};
      }
    }

    const effectiveLanguageHint =
      typeof payload?.languageHint === "string" && payload.languageHint.trim()
        ? payload.languageHint.trim()
        : task.languageHint;

    // detect missing/extra buckets
    const present = new Set(Object.keys(payloadBuckets ?? {}));
    for (const b of targetBuckets) if (!present.has(b)) missingBuckets.push(b);
    for (const k of present)
      if (!(targetBuckets as string[]).includes(k))
        extraBuckets.push(k as EvalBucketKeyV0_1);

    // token scoring
    let emptyTokenCount = 0;
    let whitespaceTokenCount = 0;
    let noVowelTokenCount = 0;

    const perBucket: BucketReportV0_1[] = [];
    const slopeItemsPrimary: Array<{ bucket: EvalBucketKeyV0_1; score: number }> = [];
    const slopeItemsMean: Array<{ bucket: EvalBucketKeyV0_1; score: number }> = [];

    for (const b of bucketOrder) {
      const raw = (payloadBuckets?.[b] ?? []).map((x) => String(x ?? ""));
      const trimmed = raw.map((s) => s.trim());

      // duplicates (trimmed)
      const seen = new Set<string>();
      let dup = 0;
      for (const t of trimmed) {
        if (!t) continue;
        if (seen.has(t)) dup++;
        else seen.add(t);
      }

      const validP: number[] = [];
      const validM: number[] = [];
      let invalidN = 0;

      for (const tok0 of trimmed) {
        if (!tok0) {
          emptyTokenCount++;
          invalidN++;
          continue;
        }
        if (/\s/u.test(tok0)) {
          whitespaceTokenCount++;
          invalidN++;
          continue;
        }

        const out = extractOrthographyVoicesFromWordV0_1({
          word: tok0,
          langHint: effectiveLanguageHint,
        }).voices;
        const vs0 = (Array.isArray(out) ? out : [])
          .map(normVowel)
          .filter(Boolean) as Vowel[];
        const vs = uniqInOrder(vs0);

        if (!vs.length) {
          noVowelTokenCount++;
          invalidN++;
          continue;
        }

        const primary = vs[0];
        const ap = APERTURE[primary];
        const am = mean(vs.map((v) => APERTURE[v]));
        validP.push(ap);
        validM.push(am);

        slopeItemsPrimary.push({ bucket: b, score: ap });
        slopeItemsMean.push({ bucket: b, score: am });
      }

      const rep: BucketReportV0_1 = {
        bucket: b,
        expectedN: task.nPerBucket,
        providedN: trimmed.length,
        validN: validP.length,
        invalidN,
        duplicateN: dup,
        mean_aperturePrimary: mean(validP),
        mean_aperturePresenceMean: mean(validM),
      };
      perBucket.push(rep);
    }

    const iters = spec.scoring.permutation.iters;
    const baseSeed = spec.scoring.permutation.seed;

    const canSlope =
      task.inputShape === "bucketed_single_tokens" &&
      bucketOrder.length >= 2 &&
      bucketOrder.every((b): b is BucketId => isBucketId(String(b)));

    const slopeP: SlopeReportV0_1 | null = canSlope
      ? toSlopeReport({
          bucketOrder,
          scoreKey: "aperturePrimary",
          iters,
          seed: (baseSeed ^ 0x0a11ce) >>> 0,
          items: slopeItemsPrimary as Array<{ bucket: BucketId; score: number }>,
        })
      : null;

    const slopeM: SlopeReportV0_1 | null = canSlope
      ? toSlopeReport({
          bucketOrder,
          scoreKey: "aperturePresenceMean",
          iters,
          seed: (baseSeed ^ 0x0bada55) >>> 0,
          items: slopeItemsMean as Array<{ bucket: BucketId; score: number }>,
        })
      : null;

    let intermediateReport: IntermediateTaskReportV0_1 | null = null;

    if (task.inputShape === "intermediate_triple") {
      const missingMeta: string[] = [];
      if (!(typeof payload?.vowelUnderTest === "string" && payload.vowelUnderTest.trim())) {
        missingMeta.push("vowelUnderTest");
      }
      if (!payload?.anchorLow) missingMeta.push("anchorLow");
      if (!payload?.anchorHigh) missingMeta.push("anchorHigh");

      if (missingMeta.length) {
        diagnosticNotes.push(
          `Intermediate report not computed (missing ${missingMeta.join(", ")}).`,
        );
      } else {
        intermediateReport = buildIntermediateReportV0_1({
          perBucket,
          items: slopeItemsMean,
          vowelUnderTest: String(payload?.vowelUnderTest ?? "").trim(),
          anchorLow: payload!.anchorLow!,
          anchorHigh: payload!.anchorHigh!,
          iters,
          seed: (baseSeed ^ 0x00715eed) >>> 0,
        });

        if (!intermediateReport) {
          diagnosticNotes.push(
            "Intermediate report not computed (requires finite mean_aperturePresenceMean for anchor_low, x_vowel, anchor_high).",
          );
        }
      }
    }

    if (
      task.kind === "derived" &&
      Object.keys(payloadBuckets ?? {}).length === 0
    ) {
      diagnosticNotes.push(
        "Derived control could not be computed (requires equal counts per bucket in base run).",
      );
    }

    reports.push({
      taskId: task.taskId,
      kind: task.kind,
      title: task.title,
      languageHint: effectiveLanguageHint,
      targetBuckets,
      nPerBucket: task.nPerBucket,
      buckets: perBucket,
      slope_aperturePrimary: slopeP,
      slope_aperturePresenceMean: slopeM,
      ...(task.inputShape === "intermediate_triple"
        ? { intermediate_aperturePresenceMean: intermediateReport }
        : {}),
      diagnostics: {
        missingBuckets,
        extraBuckets,
        emptyTokenCount,
        whitespaceTokenCount,
        noVowelTokenCount,
        totalInvalidTokenCount:
          emptyTokenCount + whitespaceTokenCount + noVowelTokenCount,
        notes: diagnosticNotes,
      },
    });
  }

  const controlHealth = buildControlHealthV0_1(reports);

  return {
    evalReportVersion: "evalReport.v0.1",
    evalSpecVersion: "evalSpec.v0.1",
    specId: "public-grounding-probe.v0.1",
    runId: run.runId,
    meta: run.meta,
    tasks: reports,
    controlHealth,
  };
}
