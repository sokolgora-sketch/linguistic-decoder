/**
 * DR1 — Segment Generator v1 (Deterministic)
 *
 * Goal:
 * Generate bounded segmentation candidates for a "basis" string
 * without exploding the search space.
 *
 * Determinism rules:
 * - No randomness.
 * - Stable ordering: fewer segments first, then leftmost cuts first.
 * - Hard caps: maxSegments, maxCandidates.
 *
 * Notes:
 * - This is deliberately "dumb but safe" v1: only contiguous splits.
 * - Higher-level logic (carrier matching, proto-root composition) sits above this.
 */

export type SegmenterOpts = {
  /** Minimum segment length (default 1) */
  minSegLen?: number;
  /** Maximum segment length (default = basis length) */
  maxSegLen?: number;
  /** Segments count must be between 1 and maxSegments (default 5) */
  maxSegments?: number;
  /** Hard cap on returned candidates (default 200) */
  maxCandidates?: number;
  /** If true, basis is normalized to lowercase + trimmed (default true) */
  normalize?: boolean;
};

export type Segmentation = {
  basis: string;
  segments: string[];
  cutPositions: number[]; // indices where a cut happens (between chars)
};

function normBasis(basis: string, normalize: boolean): string {
  const s = String(basis ?? "");
  const t = normalize ? s.trim().toLowerCase() : s;
  return t;
}

function clampInt(n: any, fallback: number, min: number, max: number): number {
  const x = Number.isFinite(Number(n)) ? Number(n) : fallback;
  const xi = Math.floor(x);
  if (xi < min) return min;
  if (xi > max) return max;
  return xi;
}

/**
 * segmentBasis
 * Returns deterministic segmentations of a basis string.
 */
export function segmentBasis(basis: string, opts: SegmenterOpts = {}): Segmentation[] {
  const normalize = opts.normalize !== false;
  const b = normBasis(basis, normalize);

  const L = b.length;
  if (L === 0) return [];

  const maxSegments = clampInt(opts.maxSegments, 5, 1, 12);
  const maxCandidates = clampInt(opts.maxCandidates, 200, 1, 10_000);

  const minSegLen = clampInt(opts.minSegLen, 1, 1, L);
  const maxSegLen = clampInt(opts.maxSegLen, L, minSegLen, L);

  // Pre-validate: if constraints make segmentation impossible, return empty.
  if (minSegLen > L || maxSegLen < 1) return [];

  const out: Segmentation[] = [];

  // Order: k=1..maxSegments (fewer segments first)
  for (let k = 1; k <= maxSegments; k++) {
    if (out.length >= maxCandidates) break;

    // Quick feasibility:
    // k segments => total min length = k*minSegLen must fit, total max length = k*maxSegLen must cover.
    if (k * minSegLen > L) break; // larger k will also fail
    if (k * maxSegLen < L) continue;

    // Choose k-1 cut positions from [1..L-1], increasing.
    const cutsNeeded = k - 1;

    if (cutsNeeded === 0) {
      // Single segment
      if (L >= minSegLen && L <= maxSegLen) {
        out.push({ basis: b, segments: [b], cutPositions: [] });
      }
      continue;
    }

    // Deterministic DFS generating increasing cut positions.
    const stack: { start: number; cuts: number[] }[] = [{ start: 1, cuts: [] }];

    while (stack.length > 0) {
      if (out.length >= maxCandidates) break;

      const cur = stack.pop()!;
      const { start, cuts } = cur;

      if (cuts.length === cutsNeeded) {
        // Evaluate this cut set.
        const cutPositions = cuts.slice().sort((a, b) => a - b);
        const segs: string[] = [];
        let prev = 0;

        let ok = true;
        for (const cpos of cutPositions) {
          const seg = b.slice(prev, cpos);
          if (seg.length < minSegLen || seg.length > maxSegLen) {
            ok = false;
            break;
          }
          segs.push(seg);
          prev = cpos;
        }

        if (ok) {
          const last = b.slice(prev);
          if (last.length < minSegLen || last.length > maxSegLen) ok = false;
          else segs.push(last);
        }

        if (ok && segs.length === k) {
          out.push({ basis: b, segments: segs, cutPositions });
        }
        continue;
      }

      // Remaining cuts to pick
      const remaining = cutsNeeded - cuts.length;

      // We need to pick remaining cut positions in [start..L-1]
      // but also ensure enough room for remaining segments respecting minSegLen.
      //
      // Deterministic order requirement:
      // We want leftmost cuts first. Using stack (LIFO) reverses order,
      // so we push candidates in reverse to pop smallest first.
      const maxCut = L - 1;

      // Bound start/end to ensure feasibility with minSegLen:
      // If we pick a cut at position p, then the current segment length = p - prevCut
      // must be within [minSegLen, maxSegLen]. We don't know prevCut directly here,
      // but we can infer it: prevCut = last cut or 0.
      const prevCut = cuts.length === 0 ? 0 : cuts[cuts.length - 1];

      // The next cut p must satisfy segmentLen constraints for current segment:
      const minP = prevCut + minSegLen;
      const maxP = Math.min(prevCut + maxSegLen, maxCut);

      // Additionally, after choosing p, we must have room for remaining segments:
      // Remaining characters = L - p must be between remaining*minSegLen and remaining*maxSegLen.
      const candidates: number[] = [];
      for (let p = Math.max(start, minP); p <= maxP; p++) {
        const remChars = L - p;
        if (remChars < remaining * minSegLen) continue;
        if (remChars > remaining * maxSegLen) continue;
        candidates.push(p);
      }

      // push in reverse so smallest p is popped first
      for (let i = candidates.length - 1; i >= 0; i--) {
        stack.push({ start: candidates[i] + 1, cuts: [...cuts, candidates[i]] });
      }
    }
  }

  // Hard cap (defensive)
  return out.slice(0, maxCandidates);
}
