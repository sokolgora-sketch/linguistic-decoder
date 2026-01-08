import { buildOriginClaimV1 } from "./originClaim.builder.v1";

/**
 * Attach computed originClaim to an already-adapted AnalyzeWordResultV1.
 * Pure (except generatedAt inside originClaim.meta).
 */
export function attachOriginClaimV1(result: any): any {
  return {
    ...result,
    originClaim: buildOriginClaimV1(result),
  };
}
