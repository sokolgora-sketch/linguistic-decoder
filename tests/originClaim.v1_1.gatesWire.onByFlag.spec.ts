import { analyzeWord } from "../src/engine/analyzeWord";

describe("originClaim v1.1 — gates wiring", () => {
  test("ON by flag: gating runs and may reduce candidate count (but stays deterministic)", async () => {
    process.env.ORIGIN_CLAIM_GATES_V1_1 = "1";

    const r1 = await analyzeWord("father", "strict");
    const r2 = await analyzeWord("father", "strict");

    expect(r1.originClaim).toBeTruthy();
    expect(r2.originClaim).toBeTruthy();

    const c1 = r1.originClaim?.candidates ?? [];
    const c2 = r2.originClaim?.candidates ?? [];

    // Determinism: same inputs => same gated list
    expect(c1.map((c: any) => `${c.language}:${c.form}`)).toEqual(
      c2.map((c: any) => `${c.language}:${c.form}`),
    );
  });
});
