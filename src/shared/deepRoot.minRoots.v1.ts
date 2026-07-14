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
import { discoverCanonicalOperatorCandidatesV0_1 } from "./canonicalOperatorDiscovery.v0_1";

export type MinRootHypothesis = {
  id: string;
  basis: string;
  segments: string[];
  protoRoots: string[]; // protoRoot ids, in order
  carriers: {
    protoRootId: string;
    segment: string; // MUST be the actual matched basis segment
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

/**
 * Public contract alias — keep stable.
 */
export type DeepRootMinRootsV1 = MinRootHypothesis;

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

  const normalizedBasis = String(basis || "")
    .trim()
    .toLowerCase();

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

    if (matchesPerSegment.some((m) => m.length === 0)) continue;

    /**
     * Cartesian product (bounded, deterministic).
     * IMPORTANT: we stamp the actual basis segment onto each chosen carrier
     * at selection time to avoid any reliance on matcher internals.
     */
    const stack: { idx: number; carriers: any[] }[] = [{ idx: 0, carriers: [] }];

    while (stack.length > 0 && out.length < maxHypotheses) {
      const cur = stack.pop()!;
      const { idx, carriers } = cur;

      if (idx === matchesPerSegment.length) {
        const protoRoots = carriers.map((c) => c.protoRootId);
        const opsCount = carriers.reduce((n, c) => n + (c.ops?.length ?? 0), 0);

        const hypothesis: MinRootHypothesis = {
          id: `${basis}:${protoRoots.join("+")}:${out.length}`,
          basis,
          segments: seg.segments,
          protoRoots,
          carriers: carriers.map((c) => ({
            protoRootId: c.protoRootId,
            segment: typeof c.segment === "string" ? c.segment : "",
            carrierForm: c.carrier.form,
            lang: c.carrier.lang,
            ops: Array.isArray(c.ops) ? c.ops : [],
          })),
          decomposition: deriveDecomposition(carriers),
          checks: {
            opsWithinLimits: opsCount <= 5,
            skeletonExplained: true,
          },
          opsCount,
        };

        out.push(hypothesis);
        continue;
      }

      const basisSegment = seg.segments[idx];
      const candidates = matchesPerSegment[idx];

      // push in reverse to preserve stable order
      for (let i = candidates.length - 1; i >= 0; i--) {
        const chosen = candidates[i];

        // Stamp the segment explicitly (truth source: segmentation, not matcher).
        stack.push({
          idx: idx + 1,
          carriers: [
            ...carriers,
            {
              ...chosen,
              segment: basisSegment,
            },
          ],
        });
      }
    }
  }

  const canonicalDiscoveries =
    discoverCanonicalOperatorCandidatesV0_1(
      normalizedBasis,
    ).filter(
      (candidate) =>
        candidate.reviewedEvidenceEligible,
    );

  const existingCanonicalMatches = new Set(
    out.flatMap((hypothesis) =>
      hypothesis.carriers.map((carrier) =>
        [
          carrier.protoRootId,
          carrier.segment,
          carrier.carrierForm,
          [...carrier.ops].sort().join(","),
        ].join("\u0000"),
      ),
    ),
  );

  const canonicalFallbacks: MinRootHypothesis[] = [];

  for (const discovery of canonicalDiscoveries) {
    const discoveryKey = [
      discovery.operatorId,
      discovery.segment,
      discovery.carrierForm,
      [...discovery.operations].sort().join(","),
    ].join("\u0000");

    if (existingCanonicalMatches.has(discoveryKey)) {
      continue;
    }

    const protoRoot =
      discovery.operatorId;

    const emittedOps =
      discovery.operations.length === 1 &&
      discovery.operations[0] === "exact"
        ? []
        : [...discovery.operations];

    canonicalFallbacks.push({
      id:
        `${normalizedBasis}:${protoRoot}:` +
        `${canonicalFallbacks.length}`,
      basis: normalizedBasis,
      segments: [discovery.segment],
      protoRoots: [protoRoot],
      carriers: [
        {
          protoRootId: protoRoot,
          segment: discovery.segment,
          carrierForm: discovery.carrierForm,
          lang: discovery.language,
          ops: emittedOps,
        },
      ],
      decomposition:
        protoRoot === "DA"
          ? { action: protoRoot }
          : { function: protoRoot },
      checks: {
        opsWithinLimits:
          emittedOps.length <= 5,
        skeletonExplained: true,
      },
      opsCount: emittedOps.length,
    });
  }

  return [
    ...canonicalFallbacks,
    ...out,
  ].slice(0, maxHypotheses);
}

function deriveDecomposition(carriers: any[]) {
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

// --- Compatibility exports (DeepRoot v1 facade + Next static export analysis) ---
// Next.js treats `import * as MinRoots` + `MinRoots.buildMinRootsV1` as a required export,
// even if it is guarded by ?? / optional chaining. Provide deterministic wrappers.
//
// Also: src/shared/deepRoot.v1.ts calls the chosen function with legacy payload shapes like:
//   fn({ basis, evidence })
//   fn({ basis: { word, normalizedWord }, evidence })
// This wrapper accepts both payload shapes and forwards to buildMinRootHypotheses(basis, opts).

type LegacyMinRootsPayloadV1 = {
  basis?: unknown;
  evidence?: unknown;
  opts?: BuildMinRootOpts;
};

function basisFromLegacyPayloadV1(x: unknown): string {
  if (typeof x === "string") return x;

  const o = x as any;
  const b = o?.basis;

  if (typeof b === "string") return b;

  // historical shapes seen in the repo:
  if (typeof b?.word === "string") return b.word;
  if (typeof b?.normalizedWord === "string") return b.normalizedWord;

  return "";
}

function optsFromLegacyPayloadV1(x: unknown, fallback: BuildMinRootOpts): BuildMinRootOpts {
  const o = x as any;
  const maybe = o?.opts;
  return (maybe && typeof maybe === "object" ? maybe : fallback) ?? {};
}

/**
 * Back-compat export expected by src/shared/deepRoot.v1.ts
 * Accepts either:
 * - (basis: string, opts?)
 * - ({ basis, evidence, opts })
 */
export function buildMinRootsV1(
  basisOrPayload: string | LegacyMinRootsPayloadV1,
  opts: BuildMinRootOpts = {}
): MinRootHypothesis[] {
  const basis = basisFromLegacyPayloadV1(basisOrPayload);
  const o = optsFromLegacyPayloadV1(basisOrPayload, opts);
  return buildMinRootHypotheses(basis, o);
}

// Legacy aliases (same behavior, different historical names)
export const extractMinRootsV1 = buildMinRootsV1;
export const computeMinRootsV1 = buildMinRootsV1;
export const minRootsV1 = buildMinRootsV1;

