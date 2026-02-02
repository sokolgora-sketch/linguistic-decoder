import { buildOriginClaimV1 as shared } from "@/shared/originClaim.builder.v1";
import { buildOriginClaimV1 as engine } from "@/engine/originClaim.builder.v1";

describe("BRAIN-0.3 — OriginClaim builder single-source guard", () => {
  test("engine builder is a direct re-export of shared builder (prevents drift)", () => {
    expect(engine).toBe(shared);
  });
});
