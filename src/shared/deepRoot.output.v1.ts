/**
 * DR4 — DeepRoot output integration (v1)
 *
 * Turns DR3 hypotheses into a stable, public-facing DeepRoot payload.
 * No scores. Deterministic ordering inherited from DR3.
 */

import { buildMinRootHypotheses } from "./deepRoot.minRoots.v1";
import { PROTO_ROOTS_V1 } from "./protoRoots.v1";
import { selectHighlightedHypotheses } from "./deepRoot.verdict.v1";

export type DeepRootOutputV1 = {
  version: "deeproot-output-v1";
  basis: string;
  mode: string;
  verdict: {
    label: "closest_under_rules";
    highlighted: string[];
    reasons: string[];
  };
  protoRoots: {
    id: string;
    gloss: string;
    roleHint: string;
    carriers: { lang: string; form: string; gloss?: string }[];
  }[];
  hypotheses: {
    id: string;
    protoRoots: string[]; // ids
    segments: string[];
    carriers: {
      protoRootId: string;
      segment: string;
      carrierForm: string;
      lang: string;
      ops: string[];
    }[];
    decomposition: { action?: string; function?: string; unit?: string };
    checks: { opsWithinLimits: boolean; skeletonExplained: boolean };
    opsCount: number;
  }[];
};

export function buildDeepRootOutputV1(args: {
  basis: string;
  mode: string;
  allowSSh?: boolean;
  langAllowList?: string[];
  maxHypotheses?: number;
}): DeepRootOutputV1 | undefined {
  const basis = String(args.basis ?? "").trim().toLowerCase();
  if (!basis) return undefined;

  // Keep v1 bounded and cheap.
  const hypotheses = buildMinRootHypotheses(basis, {
    allowSSh: args.allowSSh ?? true,
    langAllowList: args.langAllowList ?? ["sq"],
    maxHypotheses: args.maxHypotheses ?? 25,
    maxSegments: 5,
  });

  const verdict = selectHighlightedHypotheses(hypotheses);

  if (!hypotheses || hypotheses.length === 0) return undefined;

  // Collect protoRoot ids used
  const used = new Set<string>();
  for (const h of hypotheses) for (const id of h.protoRoots) used.add(id);

  const protoRoots = PROTO_ROOTS_V1.filter((r) => used.has(r.id)).map((r) => ({
    id: r.id,
    gloss: r.gloss,
    roleHint: r.roleHint,
    carriers: r.carriers.map((c) => ({ lang: c.lang, form: c.form, gloss: c.gloss })),
  }));

  return {
    version: "deeproot-output-v1",
    basis,
    mode: args.mode,
    protoRoots,
    hypotheses: hypotheses.map((h) => {
      const segs = Array.isArray(h.segments) ? h.segments.map((s) => String(s ?? "")) : [];

      const carriers = Array.isArray(h.carriers)
        ? h.carriers.map((c, i) => ({
            protoRootId: String(c?.protoRootId ?? ""),
            // IMPORTANT: segment must never be undefined (public contract)
            segment: String(c?.segment ?? segs[i] ?? ""),
            carrierForm: String(c?.carrierForm ?? ""),
            lang: String(c?.lang ?? ""),
            ops: Array.isArray(c?.ops) ? c.ops.map((x) => String(x ?? "")) : [],
          }))
        : [];

      return {
        id: String(h.id ?? ""),
        protoRoots: Array.isArray(h.protoRoots) ? h.protoRoots.map((x) => String(x ?? "")) : [],
        segments: segs,
        carriers,
        decomposition: h.decomposition ?? {},
        checks: {
          opsWithinLimits: Boolean(h?.checks?.opsWithinLimits),
          skeletonExplained: Boolean(h?.checks?.skeletonExplained),
        },
        opsCount: Number.isFinite(h.opsCount) ? h.opsCount : 0,
      };
    }),
  };
}
