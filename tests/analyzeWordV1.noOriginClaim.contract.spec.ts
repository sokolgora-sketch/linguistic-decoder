import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("analyzeWordV1 contract", () => {
  test("does not wire originClaim (explicit)", async () => {
    process.env.ORIGIN_CLAIM_GATES_V1_1 = "1";
    const r = await analyzeWordV1("father", "strict");
    expect((r as any).originClaim).toBeUndefined();
  });
});
