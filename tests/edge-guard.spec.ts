
import { solveWord } from "@/functions/sevenVoicesCore";
import { getManifest } from "@/engine/manifest";

const baseOpts = {
  beamWidth: 8,
  maxOps: 1,
  allowDelete: false,
  allowClosure: false,
  opCost: { sub:1, del:3, insClosure:2 },
  alphabet: "latin" as const,
  manifest: getManifest()
};

test("edge bias does not flip hope primary O→E up to 0.5", () => {
  for (const w of [0, 0.15, 0.25, 0.4, 0.5]) {
    const { primaryPath } = solveWord("hope", { ...baseOpts, edgeWeight: w }, 'latin') as any;
    expect(primaryPath.voicePath.join("→")).toBe("O→E");
  }
});
