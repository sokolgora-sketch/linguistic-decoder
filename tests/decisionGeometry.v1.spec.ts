// tests/decisionGeometry.v1.spec.ts
import { analyzeWordV1 } from "../src/engine/analyzeWordV1";

describe("Decision Geometry v1 — decision_geometry tag (strict)", () => {
  const words = [
    "ndëshkim",
    "falje",
    "pranoj",
    "refuzoj",
    "shëroj",
    "thyej",
    "ftoj",
    "përjashtoj",
  ];

  for (const w of words) {
    it(`decision_geometry snapshot: ${w}`, () => {
      const out = analyzeWordV1(w, "strict");
      expect(out.decision_geometry).toMatchSnapshot();
    });
  }
});
