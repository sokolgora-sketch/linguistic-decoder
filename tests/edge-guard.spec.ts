
import { solveWord } from "@/functions/sevenVoicesCore";
import type { SolveOptions } from "@/functions/sevenVoicesCore";

test("edge bias never flips 'hope' away from O→E up to 0.5", () => {
  for (const w of [0, 0.15, 0.25, 0.4, 0.5]) {
    const opts: SolveOptions = {
        beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false,
        opCost:{sub:1,del:3,insClosure:2}, edgeWeight: w
    };
    const { primaryPath } = solveWord("hope", opts, "auto");
    expect(primaryPath.voicePath.join("→")).toBe("O→E");
  }
});
