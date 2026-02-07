import { analyzeWordV1 } from "../src/engine/analyzeWordV1";
import { normalizeForSnapshotV0_1 } from "./_helpers/snapshotNormalize.v0.1";

/**
 * Snapshot must not include time-varying fields.
 */
function normalizeOriginClaimForSnapshot(originClaim: any) {
  if (!originClaim) return originClaim;

  return {
    ...originClaim,
    meta: originClaim.meta
      ? {
          ...originClaim.meta,
          generatedAt: "<iso>",
        }
      : originClaim.meta,
  };
}

describe("originClaim.v1 — default behavior", () => {
  test("defaults to insufficient_evidence", async () => {
    const result = await analyzeWordV1("study", "strict");
    expect(normalizeOriginClaimForSnapshot(result.originClaim)).toMatchSnapshot();
  });
});
