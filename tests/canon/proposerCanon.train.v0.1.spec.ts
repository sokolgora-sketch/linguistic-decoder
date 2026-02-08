import { proposerCanonTrainV0_1 } from "./proposerCanon.train.v0.1";
import { runCanonCaseV0_1, assertCanonCaseV0_1 } from "./proposerCanon.runner.v0.1";

describe("C2 canon train v0.1", () => {
  for (const c of proposerCanonTrainV0_1) {
    it(c.id, async () => {
      const out = await runCanonCaseV0_1(c);
      assertCanonCaseV0_1(c, out);
    });
  }
});
