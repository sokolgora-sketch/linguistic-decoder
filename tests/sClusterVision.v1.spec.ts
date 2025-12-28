// tests/sClusterVision.v1.spec.ts
import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("S-Cluster Vision v1 — s_cluster_vision tag (strict)", () => {
  const words = ["shkel", "strukturë", "shpërndaj", "zhurmë", "sistem"];

  for (const word of words) {
    it(`s_cluster_vision snapshot: ${word}`, () => {
      const out = analyzeWordV1(word, "strict");
      expect(out.s_cluster_vision).toMatchSnapshot();
    });
  }
});
