import { proposeWithEngineOracleV0_2 } from "../../src/shared/orchestrator/proposeWithEngineOracle.v0.2";

describe("proposeWithEngineOracle.v0.2 (engine v1 snapshot oracle)", () => {
  test("smoke: builds ClaimPacket (engine snapshot) + runs truth-check verifier (mock proposer)", async () => {
    const out = await proposeWithEngineOracleV0_2({
      word: "study",
      mode: "strict",
      provider: "mock" as any,
    });

    expect(out.ok).toBe(true);
    expect(out.claimPacket?.oracle?.engineV1?.source).toBe("v1/analyzeWordV1");
    expect(out).toMatchSnapshot();
  });
});
