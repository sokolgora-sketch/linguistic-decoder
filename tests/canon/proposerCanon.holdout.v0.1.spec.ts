import { proposerCanonHoldoutV0_1 } from "./proposerCanon.holdout.v0.1";
import { runCanonCaseV0_1, assertCanonCaseV0_1 } from "./proposerCanon.runner.v0.1";

describe("C2 canon holdout v0.1", () => {
  for (const c of proposerCanonHoldoutV0_1) {
    it(c.id, async () => {
      const out = await runCanonCaseV0_1(c);
      assertCanonCaseV0_1(c, out);
    });
  }
});
