import { proposerCanonTrainV0_1 } from "./proposerCanon.train.v0.1";
import { proposerCanonHoldoutV0_1 } from "./proposerCanon.holdout.v0.1";
import { runCanonCaseV0_1, simplifyLoopResultV0_1 } from "./proposerCanon.runner.v0.1";

describe("C2 canon diff report v0.1 (snapshot)", () => {
  it("train + holdout report", async () => {
    const all = [...proposerCanonTrainV0_1, ...proposerCanonHoldoutV0_1];
    const rows: any[] = [];

    for (const c of all) {
      const out = await runCanonCaseV0_1(c);
      rows.push({ id: c.id, result: simplifyLoopResultV0_1(out) });
    }

    rows.sort((a, b) => String(a.id).localeCompare(String(b.id)));
    expect(rows).toMatchSnapshot();
  });
});
