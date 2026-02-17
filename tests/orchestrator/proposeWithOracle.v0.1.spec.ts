import { proposeWithOracleV0_1 } from "../../src/shared/orchestrator/proposeWithOracle.v0.1";

describe("proposeWithOracle.v0.1 (SSOT oracle)", () => {
  test("smoke: builds ClaimPacket + runs truth-check verifier (mock proposer)", async () => {
    const prev = process.env.PROPOSER_PROVIDER;
    process.env.PROPOSER_PROVIDER = "mock";

    try {
      const out = await proposeWithOracleV0_1({ word: "study", mode: "strict" });

      expect(out.ok).toBe(true);
      expect(out.claimVerification?.verifierVersion).toBe("v0.1");
      expect(out).toMatchSnapshot();
    } finally {
      process.env.PROPOSER_PROVIDER = prev;
    }
  });
});
