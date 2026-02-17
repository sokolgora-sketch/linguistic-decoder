import { verifyClaimPacketV0_1 } from "../../src/shared/verifier/verifyClaimPacket.v0.1";
import { CLAIM_PACKETS_GOLD_V0_1 } from "../corpus/claimPackets.gold.v0.1";

describe("verifyClaimPacket v0.1 — gold corpus", () => {
  for (const tc of CLAIM_PACKETS_GOLD_V0_1) {
    test(`gold: ${tc.name}`, () => {
      const out = verifyClaimPacketV0_1(tc.packet);
      expect(out.passed).toBe(tc.expectPassed);
      expect(out).toMatchSnapshot();
    });
  }
});
