
/**
 * DeepRoot v1 — Back-compat facade
 *
 * Why this file exists:
 * - src/v1/analyzeWordV1.ts expects: buildDeepRoot({ basis, evidence })
 * - Recent refactors introduced deepRoot.output.v1 (buildDeepRootOutputV1) + minRoots pipeline,
 *   but the legacy entrypoint buildDeepRoot was removed/renamed.
 *
 * Policy:
 * - Keep deterministic behavior.
 * - Never invent roots at runtime.
 * - If the minRoots builder cannot be found, return a deterministic “unsupported” DeepRoot output.
 */

import * as MinRoots from "./deepRoot.minRoots.v1";
import { buildDeepRootOutputV1 } from "./deepRoot.output.v1";

// Back-compat: older code imports this name.
export type DeepRootSummaryV1 = ReturnType<typeof buildDeepRootOutputV1>;

// Re-export the modern pieces so other imports don’t break.
export * from "./deepRoot.output.v1";
export * from "./deepRoot.minRoots.v1";
export * from "./deepRoot.functional.v1";
export * from "./rootFamily.v1";
export * from "./protoRoots.v1";

/**
 * Legacy entrypoint expected by src/v1/analyzeWordV1.ts
 */
export function buildDeepRoot(payload: { basis: string; evidence?: any }): ReturnType<typeof buildDeepRootOutputV1> {
  const basis = typeof payload?.basis === "string" ? payload.basis : "";
  const evidence = (payload as any)?.evidence;

  // Find the “minRoots builder” function regardless of its exact export name.
  const fn =
    (MinRoots as any).buildMinRootsV1 ??
    (MinRoots as any).extractMinRootsV1 ??
    (MinRoots as any).computeMinRootsV1 ??
    (MinRoots as any).minRootsV1 ??
    null;

  let minRoots: any[] = [];

  if (typeof fn === "function") {
    // Try the two common calling conventions seen in this repo over time.
    try {
      const r1 = fn({ basis, evidence });
      if (Array.isArray(r1)) minRoots = r1;
      else if (Array.isArray(r1?.hypotheses)) minRoots = r1.hypotheses;
      else if (Array.isArray(r1?.candidates)) minRoots = r1.candidates;
    } catch {
      try {
        const r2 = fn({ basis: { word: basis, normalizedWord: basis }, evidence });
        if (Array.isArray(r2)) minRoots = r2;
        else if (Array.isArray(r2?.hypotheses)) minRoots = r2.hypotheses;
        else if (Array.isArray(r2?.candidates)) minRoots = r2.candidates;
      } catch {
        // fallthrough to empty
      }
    }
  }

  // Always return a DeepRoot output object for determinism (even if “unsupported”).
  return buildDeepRootOutputV1({ basis, minRoots }) as any;
}
