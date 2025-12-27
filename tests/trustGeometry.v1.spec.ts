// tests/trustGeometry.v1.spec.ts
import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("Trust Geometry v1 — trust_geometry tag (strict)", () => {
  const words = ["premtoj", "mbaj", "shkel", "thyej", "shëroj", "falje"];

  for (const word of words) {
    it(`trust_geometry snapshot: ${word}`, () => {
      // analyzeWordV1 expects (word: string, mode?: EngineMode)
      const out = analyzeWordV1(word, "strict");
      expect(out.trust_geometry).toMatchSnapshot();
    });
  }
});
