/**
 * DeepRoot Output v1
 * - Public-facing, JSON-safe.
 * - Deterministic, contract-first.
 *
 * Canonical field:
 * - hypotheses: DeepRootMinRootsV1[]
 *
 * Back-compat alias (temporary):
 * - candidates?: DeepRootMinRootsV1[]
 *
 * v1.1 addition:
 * - rootFamilies?: RootFamilyV1[] (optional, non-breaking)
 *
 * v1.2 addition (this change):
 * - functionalRoots?: FunctionalRootHypothesisV1[] (optional, conservative)
 */

import type { DeepRootMinRootsV1 } from "./deepRoot.minRoots.v1";
import type { RootFamilyV1 } from "./rootFamily.v1";
import { buildRootFamiliesV1 } from "./rootFamily.v1";
import {
  extractFunctionalRootsV1,
  type FunctionalRootHypothesisV1,
} from "./deepRoot.functional.v1";

export interface DeepRootOutputV1 {
  version: "deeproot-output-v1";
  basis: string;
  protoRoots: string[];

  hypotheses: DeepRootMinRootsV1[];
  candidates?: DeepRootMinRootsV1[];
  rootFamilies?: RootFamilyV1[];
  functionalRoots?: FunctionalRootHypothesisV1[];
}

/**
 * Contract safety: DeepRoot output must be JSON-safe.
 * - No undefined anywhere (especially inside arrays).
 * - Ensure carriers[].segment is always a string.
 */
function sanitizeMinRoots(minRoots: DeepRootMinRootsV1[]): DeepRootMinRootsV1[] {
  return (minRoots as any[]).map((cand) => {
    const c: any = { ...cand };

    if (Array.isArray(c.carriers)) {
      c.carriers = c.carriers.map((car: any) => ({
        ...car,
        segment: typeof car?.segment === "string" ? car.segment : "",
        ops: Array.isArray(car?.ops) ? car.ops : [],
      }));
    }

    // Final JSON-safety guard: strips any undefined in nested structures.
    return JSON.parse(JSON.stringify(c));
  }) as any;
}

/**
 * Build DeepRoot output from already-computed minRoots.
 * We dual-write hypotheses + candidates for zero-break migration.
 */
export function buildDeepRootOutputV1(params: {
  basis: { word: string; normalizedWord: string } | string;
  minRoots: DeepRootMinRootsV1[] | null | undefined;
  legacyCandidates?: boolean;
}): DeepRootOutputV1 | null {
  const { basis: rawBasis, minRoots } = params;

  const basis =
    typeof rawBasis === "string"
      ? { word: rawBasis, normalizedWord: rawBasis }
      : rawBasis;

  const safeMinRoots = Array.isArray(minRoots) ? minRoots : [];
  const sanitized = sanitizeMinRoots(safeMinRoots);

  const protoRoots = Array.from(
    new Set(
      sanitized.flatMap((h: any) => (Array.isArray(h?.protoRoots) ? h.protoRoots : [])).filter(Boolean)
    )
  );

  const first = (sanitized as any)?.[0];

  const basisFromMinRoot =
    (typeof first?.basis === "string" && first.basis.trim()) ? first.basis.trim() : "";

  const basisFromId = (() => {
    const id = typeof first?.id === "string" ? first.id : "";
    if (!id) return "";
    if (id.includes(":")) return id.split(":")[0].trim();   // study:SHTU+DA:0
    if (id.includes(".")) return id.split(".")[0].trim();   // legacy fallback
    return "";
  })();

  const basisWord =
    (typeof basis?.word === "string" && basis.word.trim()) ? basis.word.trim()
    : (typeof basis?.normalizedWord === "string" && basis.normalizedWord.trim()) ? basis.normalizedWord.trim()
    : basisFromMinRoot || basisFromId || "";

  // IMPORTANT: use basisWord here (NOT basis.normalizedWord||basis.word)
  const deepRoot: DeepRootOutputV1 = {
    version: "deeproot-output-v1",
    basis: basisWord,
    protoRoots,
    hypotheses: sanitized,
  };


  // Back-compat alias (default ON)
  if (params.legacyCandidates !== false) {
    deepRoot.candidates = sanitized;
  }

  const families = buildRootFamiliesV1({ basis, deepRoot });
  if (families.length > 0) deepRoot.rootFamilies = families;

  // Functional micro-roots (v1: study only)
  const functionalRoots = extractFunctionalRootsV1({ basis });
  if (functionalRoots.length > 0) deepRoot.functionalRoots = functionalRoots;

  return deepRoot;
}
