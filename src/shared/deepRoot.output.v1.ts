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
 */

import type { DeepRootMinRootsV1 } from "./deepRoot.minRoots.v1";
import type { RootFamilyV1 } from "./rootFamily.v1";
import { buildRootFamiliesV1 } from "./rootFamily.v1";

export interface DeepRootOutputV1 {
  hypotheses: DeepRootMinRootsV1[];

  /**
   * Legacy alias for older UI/tests.
   * Keep during migration; remove in Phase 3.
   */
  candidates?: DeepRootMinRootsV1[];

  rootFamilies?: RootFamilyV1[];
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
  basis: { word: string; normalizedWord: string };
  minRoots: DeepRootMinRootsV1[] | null | undefined;
  legacyCandidates?: boolean;
}): DeepRootOutputV1 | null {
  const { basis, minRoots } = params;

  if (!minRoots || minRoots.length === 0) return null;

  const sanitized = sanitizeMinRoots(minRoots);

  const deepRoot: DeepRootOutputV1 = {
    hypotheses: sanitized,
  };

  // Back-compat alias (default ON)
  if (params.legacyCandidates !== false) {
    deepRoot.candidates = sanitized;
  }

  const families = buildRootFamiliesV1({ basis, deepRoot });
  if (families.length > 0) deepRoot.rootFamilies = families;

  return deepRoot;
}
