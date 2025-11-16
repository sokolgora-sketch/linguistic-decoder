
import { solveWord } from "@/functions/sevenVoicesCore";
import { getManifest } from "@/engine/manifest";

const opts = {
  beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false,
  opCost:{sub:1,del:3,ins:2}, alphabet:"auto" as const, edgeWeight: 0.25,
  manifest: getManifest()
};

test("damage → A→E", () => {
  const { primaryPath } = solveWord("damage", opts, "auto");
  expect(primaryPath.voicePath.join("→")).toBe("A→E");
});

test("study (strict) → U→I", () => {
  const { primaryPath } = solveWord("study", opts, "auto");
  expect(primaryPath.voicePath.join("→")).toBe("U→I");
});

test("life (strict) stable path exists", () => {
  const { primaryPath } = solveWord("life", opts, "auto");
  expect(primaryPath.voicePath.length).toBeGreaterThan(0);
});

test("mind (strict) stable path exists", () => {
  const { primaryPath } = solveWord("mind", opts, "auto");
  expect(primaryPath.voicePath.length).toBeGreaterThan(0);
});

    
