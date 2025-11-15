
import { solveWord } from "@/functions/sevenVoicesCore";

const opts = {
  beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false,
  opCost:{sub:1,del:3,insClosure:2}, alphabet:"auto" as const, edgeWeight: 0.25
};

test("damage → A→E", () => {
  const { primaryPath } = solveWord("damage", opts);
  expect(primaryPath.voicePath.join("→")).toBe("A→E");
});

test("study (strict) → U→I", () => {
  const { primaryPath } = solveWord("study", opts);
  expect(primaryPath.voicePath.join("→")).toBe("U→I");
});

test("life (strict) stable path exists", () => {
  const { primaryPath } = solveWord("life", opts);
  expect(primaryPath.voicePath.length).toBeGreaterThan(0);
});

test("mind (strict) stable path exists", () => {
  const { primaryPath } = solveWord("mind", opts);
  expect(primaryPath.voicePath.length).toBeGreaterThan(0);
});
