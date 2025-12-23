import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

describe("analysisAdapter narrative", () => {
  it("never emits 'undefined' or 'null' when tensionLevel is missing", () => {
    const payload: any = {
      word: "study",
      sanitized: "study",
      engineVersion: "0.2.0-symbolic",
      mode: "strict",
      alphabet: "auto",
      heart: {
        math7: { primary: { cycleState: "open", totalMod7: 2, principlesPath: ["Unity", "Insight"] } },
        principlePath: ["Unity", "Insight"],
      },
      meta: { cache: "miss", source: "live" },
    };

    const out = enginePayloadToAnalysisResult(payload);
    expect(out.heart.narrative.toLowerCase()).not.toContain("undefined");
    expect(out.heart.narrative.toLowerCase()).not.toContain("null");
  });
});
