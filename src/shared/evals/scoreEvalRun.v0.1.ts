// EVALS-4 — Scoring Engine v0.1
// Deterministic. Reuses orthography SSOT. No heuristics, no ML.

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

import { slopePermutationV0_1, mean, mulberry32, shuffleInPlace } from "./stats.v0.1";
import type { EvalRunBundleV0_1 } from "./run.v0.1";
import { BUCKETS_V0_1, type BucketId, type EvalSpecV0_1 } from "./spec.v0.1";
import type { EvalReportBundleV0_1, EvalTaskReportV0_1, BucketReportV0_1, SlopeReportV0_1 } from "./report.v0.1";

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
  if (s === "A" || s === "E" || s === "I" || s === "O" || s === "U" || s === "Y" || s === "Ë") return s as Vowel;
  return null;
}

function toSlopeReport(params: { bucketOrder: BucketId[]; scoreKey: "aperturePrimary" | "aperturePresenceMean"; iters: number; seed: number; items: Array<{ bucket: BucketId; score: number }> }): SlopeReportV0_1 {
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

function flattenRunBuckets(buckets: Partial<Record<BucketId, string[]>>, order: BucketId[]): Array<{ bucket: BucketId; token: string }> {
  const out: Array<{ bucket: BucketId; token: string }> = [];
  for (const b of order) {
    const xs = buckets[b] ?? [];
    for (const t of xs) out.push({ bucket: b, token: t });
  }
  return out;
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

export function scoreEvalRunBundleV0_1(params: { spec: EvalSpecV0_1; run: EvalRunBundleV0_1 }): EvalReportBundleV0_1 {
  const { spec, run } = params;

  const runByTaskId = new Map<string, EvalRunBundleV0_1["tasks"][number]>();
  for (const t of run.tasks) runByTaskId.set(t.taskId, t);

  const reports: EvalTaskReportV0_1[] = [];

  for (const task of spec.tasks) {
    const targetBuckets = task.targetBuckets;
    const bucketOrder = targetBuckets.length === 7 ? BUCKETS_V0_1 : targetBuckets; // ladder uses canonical order

    const missingBuckets: BucketId[] = [];
    const extraBuckets: BucketId[] = [];

    let payloadBuckets: Partial<Record<BucketId, string[]>> | null = null;

    if (task.kind === "byo") {
      const payload = runByTaskId.get(task.taskId);
      if (!payload) continue; // only score tasks present in run
      payloadBuckets = payload.buckets ?? {};
    } else {
      // derived
      const baseId = task.derivedFromTaskId;
      if (!baseId) continue;
      const basePayload = runByTaskId.get(baseId);
      if (!basePayload) continue;
      payloadBuckets = deriveShuffleBucketLabelsV0_1({
        baseBuckets: basePayload.buckets ?? {},
        bucketOrder: BUCKETS_V0_1,
        seed: (spec.scoring.permutation.seed ^ 0xC0FFEE) >>> 0,
      });
      if (!payloadBuckets) {
        // can’t derive safely; emit a report with diagnostics anyway
        payloadBuckets = {};
      }
    }

    // detect missing/extra buckets
    const present = new Set(Object.keys(payloadBuckets ?? {}));
    for (const b of targetBuckets) if (!present.has(b)) missingBuckets.push(b);
    for (const k of present) if (!(targetBuckets as string[]).includes(k)) extraBuckets.push(k as BucketId);

    // token scoring
    let emptyTokenCount = 0;
    let whitespaceTokenCount = 0;
    let noVowelTokenCount = 0;

    const perBucket: BucketReportV0_1[] = [];
    const slopeItemsPrimary: Array<{ bucket: BucketId; score: number }> = [];
    const slopeItemsMean: Array<{ bucket: BucketId; score: number }> = [];

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

      let validP: number[] = [];
      let validM: number[] = [];
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

        const out = extractOrthographyVoicesFromWordV0_1({ word: tok0, langHint: task.languageHint }).voices;
        const vs0 = (Array.isArray(out) ? out : []).map(normVowel).filter(Boolean) as Vowel[];
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

    const canSlope = bucketOrder.length >= 2;

    const slopeP: SlopeReportV0_1 | null = canSlope
      ? toSlopeReport({
          bucketOrder,
          scoreKey: "aperturePrimary",
          iters,
          seed: (baseSeed ^ 0xA11CE) >>> 0,
          items: slopeItemsPrimary,
        })
      : null;

    const slopeM: SlopeReportV0_1 | null = canSlope
      ? toSlopeReport({
          bucketOrder,
          scoreKey: "aperturePresenceMean",
          iters,
          seed: (baseSeed ^ 0xBADA55) >>> 0,
          items: slopeItemsMean,
        })
      : null;

    reports.push({
      taskId: task.taskId,
      kind: task.kind,
      title: task.title,
      languageHint: task.languageHint,
      targetBuckets,
      nPerBucket: task.nPerBucket,
      buckets: perBucket,
      slope_aperturePrimary: slopeP,
      slope_aperturePresenceMean: slopeM,
      diagnostics: {
        missingBuckets,
        extraBuckets,
        emptyTokenCount,
        whitespaceTokenCount,
        noVowelTokenCount,
        totalInvalidTokenCount: emptyTokenCount + whitespaceTokenCount + noVowelTokenCount,
        notes:
          task.kind === "derived" && Object.keys(payloadBuckets ?? {}).length === 0
            ? ["Derived control could not be computed (requires equal counts per bucket in base run)."]
            : [],
      },
    });
  }

  return {
    evalReportVersion: "evalReport.v0.1",
    evalSpecVersion: "evalSpec.v0.1",
    specId: "public-grounding-probe.v0.1",
    runId: run.runId,
    meta: run.meta,
    tasks: reports,
  };
}
