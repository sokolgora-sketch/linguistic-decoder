
import { solveWord } from "@/functions/sevenVoicesCore";

const baseOpts = {
  beamWidth: 8,
  maxOps: 1,
  allowDelete: false,
  allowClosure: false,
  opCost: { sub:1, del:3, insClosure:2 },
  alphabet: "auto" as const
};

test("edge bias does not flip hope primary O→E up to 0.5", () => {
  for (const w of [0, 0.15, 0.25, 0.4, 0.5]) {
    const { primaryPath } = solveWord("hope", { ...baseOpts, edgeWeight: w });
    expect(primaryPath.voicePath.join("→")).toBe("O→E");
  }
});
