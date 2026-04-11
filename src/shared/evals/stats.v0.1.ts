// EVALS-1 — Deterministic stats helpers v0.1
// Shared by research harnesses + eval scorer. Seeded only. No nondeterminism.

export function mean(xs: number[]): number {
  if (!xs.length) return NaN;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

export function pearson(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length || xs.length < 2) return NaN;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den ? num / den : NaN;
}

export function spearman(xs: number[], ys: number[]): number {
  if (xs.length !== ys.length || xs.length < 2) return NaN;

  function ranks(arr: number[]) {
    const idx = arr
      .map((v, i) => [v, i] as const)
      .sort((a, b) => a[0] - b[0]);
    const out = new Array(arr.length).fill(0);
    for (let i = 0; i < idx.length; i++) out[idx[i][1]] = i + 1;
    return out;
  }

  return pearson(ranks(xs), ranks(ys));
}

// deterministic PRNG
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function shuffleInPlace<T>(xs: T[], rnd: () => number): void {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
}

export type SlopePermutationResultV0_1 = {
  bucketOrder: string[];
  obsMeans: number[];
  pearson_r: number;
  spearman_rho: number;
  p_pearson: number;
  p_spearman: number;
  iters: number;
  seed: number;
};

export type StrictOrderPermutationResultV0_1 = {
  bucketOrder: string[];
  obsMeans: number[];
  observed_order: boolean;
  p_order: number;
  iters: number;
  seed: number;
};

function isStrictlyDescending(xs: number[]): boolean {
  if (!xs.length) return false;
  if (xs.some((x) => !Number.isFinite(x))) return false;
  for (let i = 1; i < xs.length; i++) {
    if (!(xs[i - 1] > xs[i])) return false;
  }
  return true;
}

// Permute bucket labels across items (counts preserved).
// p-values are two-sided on |r| and |rho|.
export function slopePermutationV0_1(params: {
  bucketOrder: string[];
  items: Array<{ bucket: string; score: number }>;
  iters: number;
  seed: number;
}): SlopePermutationResultV0_1 {
  const { bucketOrder, items, iters, seed } = params;

  const xs = bucketOrder.map((_, i) => i + 1);
  const obsMeans = bucketOrder.map((b) => {
    const scores = items.filter((x) => x.bucket === b).map((x) => x.score);
    return mean(scores);
  });

  const obsR = pearson(xs, obsMeans);
  const obsRho = spearman(xs, obsMeans);

  const labels = items.map((x) => x.bucket);
  const rnd = mulberry32(seed);

  let geR = 0;
  let geRho = 0;

  for (let it = 0; it < iters; it++) {
    const tmp = labels.slice();
    shuffleInPlace(tmp, rnd);

    const means = bucketOrder.map((b) => {
      const scores: number[] = [];
      for (let i = 0; i < items.length; i++) {
        if (tmp[i] === b) scores.push(items[i].score);
      }
      return mean(scores);
    });

    const r = pearson(xs, means);
    const rho = spearman(xs, means);

    if (Number.isFinite(obsR) && Number.isFinite(r) && Math.abs(r) >= Math.abs(obsR)) geR++;
    if (Number.isFinite(obsRho) && Number.isFinite(rho) && Math.abs(rho) >= Math.abs(obsRho)) geRho++;
  }

  return {
    bucketOrder,
    obsMeans,
    pearson_r: obsR,
    spearman_rho: obsRho,
    p_pearson: Number.isFinite(obsR) ? geR / iters : 1,
    p_spearman: Number.isFinite(obsRho) ? geRho / iters : 1,
    iters,
    seed,
  };
}

// Permute bucket labels across items (counts preserved) and ask only one question:
// how often does the strict observed order bucket1 > bucket2 > ... > bucketN
// arise under the null?
export function strictOrderPermutationV0_1(params: {
  bucketOrder: string[];
  items: Array<{ bucket: string; score: number }>;
  iters: number;
  seed: number;
}): StrictOrderPermutationResultV0_1 {
  const { bucketOrder, items, iters, seed } = params;

  const obsMeans = bucketOrder.map((b) => {
    const scores = items.filter((x) => x.bucket === b).map((x) => x.score);
    return mean(scores);
  });

  const observed_order = isStrictlyDescending(obsMeans);
  const labels = items.map((x) => x.bucket);
  const rnd = mulberry32(seed);

  if (obsMeans.some((x) => !Number.isFinite(x))) {
    return {
      bucketOrder,
      obsMeans,
      observed_order: false,
      p_order: 1,
      iters,
      seed,
    };
  }

  let successCount = 0;

  for (let it = 0; it < iters; it++) {
    const tmp = labels.slice();
    shuffleInPlace(tmp, rnd);

    const means = bucketOrder.map((b) => {
      const scores: number[] = [];
      for (let i = 0; i < items.length; i++) {
        if (tmp[i] === b) scores.push(items[i].score);
      }
      return mean(scores);
    });

    if (isStrictlyDescending(means)) successCount++;
  }

  return {
    bucketOrder,
    obsMeans,
    observed_order,
    p_order: successCount / iters,
    iters,
    seed,
  };
}

function minAdjacentGapV0_1(means: number[]): number {
  if (means.length < 2) return NaN;
  let out = Number.POSITIVE_INFINITY;
  for (let i = 0; i < means.length - 1; i++) {
    const gap = means[i] - means[i + 1];
    if (!Number.isFinite(gap)) return NaN;
    if (gap < out) out = gap;
  }
  return out;
}

function sampleVarianceV0_1(xs: number[]): number {
  if (xs.length < 2) return NaN;
  const m = mean(xs);
  if (!Number.isFinite(m)) return NaN;
  let acc = 0;
  for (const x of xs) {
    const d = x - m;
    acc += d * d;
  }
  return acc / (xs.length - 1);
}

function quantileSortedV0_1(xs: number[], q: number): number {
  if (!xs.length) return NaN;
  if (xs.length === 1) return xs[0];
  const pos = (xs.length - 1) * q;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return xs[lo];
  const t = pos - lo;
  return xs[lo] * (1 - t) + xs[hi] * t;
}

function ci95FromSamplesV0_1(xs: number[]): [number, number] | null {
  const vals = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b);
  if (!vals.length) return null;
  return [
    quantileSortedV0_1(vals, 0.025),
    quantileSortedV0_1(vals, 0.975),
  ];
}

export function marginPermutationMinGapV0_1(params: {
  bucketOrder: string[];
  items: Array<{ bucket: string; score: number }>;
  iters: number;
  seed: number;
}): {
  bucketOrder: string[];
  obsMeans: number[];
  observed_min_gap: number;
  p_margin: number;
  iters: number;
  seed: number;
} {
  const { bucketOrder, items, iters, seed } = params;

  const obsMeans = bucketOrder.map((b) => {
    const scores = items.filter((x) => x.bucket === b).map((x) => x.score);
    return mean(scores);
  });

  const observed_min_gap = minAdjacentGapV0_1(obsMeans);
  const labels = items.map((x) => x.bucket);
  const rnd = mulberry32(seed);

  if (
    obsMeans.some((x) => !Number.isFinite(x)) ||
    !Number.isFinite(observed_min_gap)
  ) {
    return {
      bucketOrder,
      obsMeans,
      observed_min_gap: NaN,
      p_margin: 1,
      iters,
      seed,
    };
  }

  let successCount = 0;

  for (let it = 0; it < iters; it++) {
    const tmp = labels.slice();
    shuffleInPlace(tmp, rnd);

    const means = bucketOrder.map((b) => {
      const scores: number[] = [];
      for (let i = 0; i < items.length; i++) {
        if (tmp[i] === b) scores.push(items[i].score);
      }
      return mean(scores);
    });

    const minGap = minAdjacentGapV0_1(means);
    if (Number.isFinite(minGap) && minGap >= observed_min_gap) successCount++;
  }

  return {
    bucketOrder,
    obsMeans,
    observed_min_gap,
    p_margin: successCount / iters,
    iters,
    seed,
  };
}

export function hedgesGV0_1(a: number[], b: number[]): number | null {
  if (a.length < 2 || b.length < 2) return null;

  const ma = mean(a);
  const mb = mean(b);
  if (!Number.isFinite(ma) || !Number.isFinite(mb)) return null;

  const va = sampleVarianceV0_1(a);
  const vb = sampleVarianceV0_1(b);
  if (!Number.isFinite(va) || !Number.isFinite(vb)) return null;

  const df = a.length + b.length - 2;
  if (df <= 0) return null;

  const pooled = ((a.length - 1) * va + (b.length - 1) * vb) / df;
  if (pooled < 0) return null;
  if (pooled === 0) return ma == mb ? 0 : null;

  const d = (ma - mb) / Math.sqrt(pooled);
  const correction = df > 1 ? 1 - 3 / (4 * df - 1) : 1;
  return correction * d;
}

export function bootstrapIntermediateCIV0_1(params: {
  bucketOrder: string[];
  items: Array<{ bucket: string; score: number }>;
  iters: number;
  seed: number;
}): {
  ci95_gap_low: [number, number] | null;
  ci95_gap_high: [number, number] | null;
  ci95_normalizedPosition: [number, number] | null;
  iters: number;
  seed: number;
} {
  const { bucketOrder, items, iters, seed } = params;
  if (bucketOrder.length !== 3) {
    return {
      ci95_gap_low: null,
      ci95_gap_high: null,
      ci95_normalizedPosition: null,
      iters,
      seed,
    };
  }

  const grouped = new Map<string, number[]>();
  for (const bucket of bucketOrder) grouped.set(bucket, []);
  for (const item of items) {
    const xs = grouped.get(item.bucket);
    if (xs) xs.push(item.score);
  }

  const low = grouped.get(bucketOrder[0]) ?? [];
  const mid = grouped.get(bucketOrder[1]) ?? [];
  const high = grouped.get(bucketOrder[2]) ?? [];

  if (!low.length || !mid.length || !high.length) {
    return {
      ci95_gap_low: null,
      ci95_gap_high: null,
      ci95_normalizedPosition: null,
      iters,
      seed,
    };
  }

  const rnd = mulberry32(seed);
  const gapLowSamples: number[] = [];
  const gapHighSamples: number[] = [];
  const posSamples: number[] = [];

  function resampleMean(xs: number[]): number {
    let acc = 0;
    for (let i = 0; i < xs.length; i++) {
      acc += xs[Math.floor(rnd() * xs.length)];
    }
    return acc / xs.length;
  }

  for (let it = 0; it < iters; it++) {
    const meanLow = resampleMean(low);
    const meanMid = resampleMean(mid);
    const meanHigh = resampleMean(high);

    const gapLow = meanLow - meanMid;
    const gapHigh = meanMid - meanHigh;
    const denom = meanLow - meanHigh;
    const pos = Number.isFinite(denom) && denom !== 0 ? gapLow / denom : NaN;

    if (Number.isFinite(gapLow)) gapLowSamples.push(gapLow);
    if (Number.isFinite(gapHigh)) gapHighSamples.push(gapHigh);
    if (Number.isFinite(pos)) posSamples.push(pos);
  }

  return {
    ci95_gap_low: ci95FromSamplesV0_1(gapLowSamples),
    ci95_gap_high: ci95FromSamplesV0_1(gapHighSamples),
    ci95_normalizedPosition: ci95FromSamplesV0_1(posSamples),
    iters,
    seed,
  };
}
