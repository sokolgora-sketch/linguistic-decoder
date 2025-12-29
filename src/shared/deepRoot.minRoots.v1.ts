/**
 * DR3 — DeepRoot Minimal Roots Engine v1
 *
 * Build hypotheses from:
 * - DR1 segmenter
 * - DR2 carrier matcher
 * - DR0 proto-roots
 *
 * No scoring. No ML. Deterministic only.
 */

import { segmentBasis } from "./segmenter.v1";
import { matchSegmentToProtoRoots } from "./carrierMatcher.v1";
import type { ProtoRoot } from "./protoRoots.v1";

export type MinRootHypothesis = {
  id: string;
  basis: string;
  segments: string[];
  protoRoots: string[]; // protoRoot ids, in order
  carriers: {
    protoRootId: string;
    segment: string;
    carrierForm: string;
    lang: string;
    ops: string[];
  }[];
  decomposition: {
    action?: string;
    function?: string;
    unit?: string;
  };
  checks: {
    opsWithinLimits: boolean;
    skeletonExplained: boolean;
  };
  opsCount: number;
};

export type BuildMinRootOpts = {
  maxSegments?: number;
  maxHypotheses?: number;
  allowSSh?: boolean;
  langAllowList?: string[];
};

export function buildMinRootHypotheses(
  basis: string,
  opts: BuildMinRootOpts = {}
): MinRootHypothesis[] {
  const maxSegments = opts.maxSegments ?? 5;
  const maxHypotheses = opts.maxHypotheses ?? 50;

  const segmentations = segmentBasis(basis, {
    maxSegments,
    maxCandidates: 200,
  });

  const out: MinRootHypothesis[] = [];

  for (const seg of segmentations) {
    if (out.length >= maxHypotheses) break;

    const matchesPerSegment = seg.segments.map((s) =>
      matchSegmentToProtoRoots(s, {
        allowSSh: opts.allowSSh,
        langAllowList: opts.langAllowList,
      })
    );

    // If any segment has zero matches → cannot form hypothesis
    if (matchesPerSegment.some((m) => m.length === 0)) continue;

    // Cartesian product (bounded, deterministic)
    const stack: {
      idx: number;
      carriers: any[];
    }[] = [{ idx: 0, carriers: [] }];

    while (stack.length > 0 && out.length < maxHypotheses) {
      const cur = stack.pop()!;
      const { idx, carriers } = cur;

      if (idx === matchesPerSegment.length) {
        const protoRoots = carriers.map((c) => c.protoRootId);
        const opsCount = carriers.reduce((n, c) => n + c.ops.length, 0);

        const hypothesis: MinRootHypothesis = {
          id: `${basis}:${protoRoots.join("+")}:${out.length}`,
          basis,
          segments: seg.segments,
          protoRoots,
          carriers: carriers.map((c) => ({
            protoRootId: c.protoRootId,
            segment: c.segment,
            carrierForm: c.carrier.form,
            lang: c.carrier.lang,
            ops: c.ops,
          })),
          decomposition: deriveDecomposition(carriers),
          checks: {
            opsWithinLimits: opsCount <= 5,
            skeletonExplained: true, // v1: always true if matched
          },
          opsCount,
        };

        out.push(hypothesis);
        continue;
      }

      const candidates = matchesPerSegment[idx];

      // push in reverse to preserve stable order
      for (let i = candidates.length - 1; i >= 0; i--) {
        stack.push({
          idx: idx + 1,
          carriers: [...carriers, candidates[i]],
        });
      }
    }
  }

  return out.slice(0, maxHypotheses);
}

function deriveDecomposition(carriers: any[]) {
  const roles = carriers.map((c) => c.roleHint);

  const out: any = {};
  for (const c of carriers) {
    if (c.roleHint === "Action" && !out.action) out.action = c.protoRootId;
    else if (
      (c.roleHint === "Function" || c.roleHint === "Instrument") &&
      !out.function
    )
      out.function = c.protoRootId;
    else if (
      (c.roleHint === "Unit" || c.roleHint === "Result") &&
      !out.unit
    )
      out.unit = c.protoRootId;
  }
  return out;
}
