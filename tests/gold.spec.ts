import { solveWord } from "@/functions/sevenVoicesCore";
import { getManifest } from "@/engine/manifest";

const base = {
  beamWidth: 8, maxOps: 1, allowDelete: false, allowClosure: false,
  opCost:{sub:1,del:3,ins:2}, alphabet:"auto" as const,
  manifest: getManifest(), edgeWeight: getManifest().edgeWeight
};

function vp(x:{primaryPath:{voicePath:string[]}}){ return x.primaryPath.voicePath.join("→"); }

test("damage (strict) → A→E", () => {
  const r:any = solveWord("damage", base, "auto");
  expect(vp(r)).toBe("A→E");
});

test("study (strict) → U→I", () => {
  const r:any = solveWord("study", base, "auto");
  expect(vp(r)).toBe("U→I");
});

test("hope (strict) → O→E", () => {
  const r:any = solveWord("hope", base, "auto");
  expect(vp(r)).toBe("O→E");
});

// Stable (not asserting exact vowel pair—locks non-empty path)
for (const w of ["life","mind"]) {
  test(`${w} (strict) has stable primary`, () => {
    const r:any = solveWord(w, base, "auto");
    expect(Array.isArray(r.primaryPath.voicePath)).toBe(true);
    expect(r.primaryPath.voicePath.length).toBeGreaterThan(0);
  });
}
