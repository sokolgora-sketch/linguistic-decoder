// tests/oEdgePolarity.v1.spec.ts
import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("O-Edge Polarity v1 — o_edge_polarity tag (strict)", () => {
  // Keep this small + canonical.
  const words = ["po", "jo", "you", "meiyou"];

  for (const word of words) {
    it(`o_edge_polarity snapshot: ${word}`, () => {
      // analyzeWordV1 expects (word: string, mode?: EngineMode)
      const out = analyzeWordV1(word, "strict");
      expect(out.o_edge_polarity).toMatchSnapshot();
    });
  }
});
