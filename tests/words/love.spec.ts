// tests/words/love.spec.ts
import { runAnalysis } from "@/lib/runAnalysis";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";
import type { Alphabet } from "@/lib/runAnalysis";
import type { SolveOptions } from "@/functions/sevenVoicesCore";
import { getManifest } from "@/engine/manifest";

describe("word: love", () => {
  const alphabet = "auto" as Alphabet;
  const manifest = getManifest();
  const opts: SolveOptions = {
    beamWidth: 8,
    maxOps: 1,
    allowDelete: false,
    allowClosure: false,
    opCost: { sub: 1, del: 3, ins: 2 },
    alphabet,
    manifest,
    edgeWeight: manifest.edgeWeight,
  };

  test("primary path and rings", () => {
    const rawResult = runAnalysis("love", opts, alphabet);
    const { primaryPath } = rawResult;

    expect(primaryPath.voicePath).toEqual(["O", "E"]);
    expect(primaryPath.ringPath).toEqual([0, 2]);
  });

  test("canonical families and symbolic layer exist", () => {
    const rawResult = runAnalysis("love", opts, alphabet);
    const r = enginePayloadToAnalysisResult(rawResult);

    expect(r.candidates && r.candidates.length).toBeGreaterThan(0);

    const latin = r.candidates.find((c: any) => c.language === "latin");
    const sq = r.candidates.find((c: any) => c.language === "albanian");

    expect(latin?.consonantProfileOk).toBe(true);
    expect(latin?.morphologyMatrix?.pivot).toBe("am");

    expect(sq?.consonantProfileOk).toBe(true);
    expect(sq?.morphologyMatrix?.pivot).toBe("dash");

    // Zheji layer present
    const sym = r.symbolic;
    expect(sym).toBeDefined();
    expect((sym?.notes || []).length).toBeGreaterThan(0);
  });
});
