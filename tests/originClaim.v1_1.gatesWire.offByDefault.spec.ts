import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("originClaim v1.1 — gates wiring", () => {
  test("OFF by default: originClaim candidates remain stable", async () => {
    delete process.env.ORIGIN_CLAIM_GATES_V1_1;

    const r1 = await analyzeWordV1("father", "strict");
    const r2 = await analyzeWordV1("father", "strict");

    const c1 = (r1.originClaim?.candidates ?? []).map((c: any) => `${c.language}:${c.form}`);
    const c2 = (r2.originClaim?.candidates ?? []).map((c: any) => `${c.language}:${c.form}`);

    expect(c1).toEqual(c2);
  });
});
