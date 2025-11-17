
import { runAnalysis } from "@/lib/runAnalysis";
import { getManifest } from "@/engine/manifest";
import type { Alphabet } from "@/lib/runAnalysis";
import type { SolveOptions } from "@/functions/sevenVoicesCore";

const manifest = getManifest();
const opts: SolveOptions = {
  beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false,
  opCost:{sub:1,del:3,ins:2},
  manifest: manifest,
  edgeWeight: manifest.edgeWeight,
  alphabet: "auto",
};

test("damage → A→E", () => {
  const { primaryPath } = runAnalysis("damage", opts, "auto");
  expect(primaryPath.voicePath.join("→")).toBe("A→E");
});

test("study (strict) → U→I", () => {
  const { primaryPath } = runAnalysis("study", opts, "auto");
  expect(primaryPath.voicePath.join("→")).toBe("U→I");
});

test("life (strict) stable path exists", () => {
  const { primaryPath } = runAnalysis("life", opts, "auto");
  expect(primaryPath.voicePath.length).toBeGreaterThan(0);
});

test("mind (strict) stable path exists", () => {
  const { primaryPath } = runAnalysis("mind", opts, "auto");
  expect(primaryPath.voicePath.length).toBeGreaterThan(0);
});
