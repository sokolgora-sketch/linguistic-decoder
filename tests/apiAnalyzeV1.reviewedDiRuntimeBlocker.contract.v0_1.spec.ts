import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

async function analyze(word: string): Promise<any> {
  const payload = await analyzeWordV1(
    word,
    { mode: "strict" } as any,
  );

  return enginePayloadToAnalysisResult(payload as any) as any;
}

function reviewedDiEvidence(out: any): string {
  const di = out?.rootMap?.keys?.find(
    (key: any) => key?.token === "DI",
  );

  return Array.isArray(di?.evidence)
    ? di.evidence.join("\n")
    : "";
}

function rootMapText(out: any): string {
  return JSON.stringify(out?.rootMap ?? {});
}

describe("analyze-v1 bounded reviewed DI runtime contract v0.1", () => {
  it("surfaces bounded reviewed DI evidence when study emits a live DI RootMap key", async () => {
    const out = await analyze("study");

    const di = out.rootMap?.keys?.find(
      (key: any) => key?.token === "DI",
    );

    const evidence = reviewedDiEvidence(out);

    expect(di).toBeTruthy();
    expect(di?.language).toBe("sq");
    expect(di?.gloss).toContain("know");

    expect(evidence).toContain("sq: di");
    expect(evidence).toContain("gloss: I know");
    expect(evidence).toContain(
      "reviewed functional free-operator evidence",
    );
    expect(evidence).toContain(
      "Albanian > Etymology 1 > Verb > di: to know",
    );
    expect(evidence).toContain("di = know / knowledge");
    expect(evidence).toContain(
      "https://en.wiktionary.org/wiki/di#Albanian",
    );
    expect(evidence).toContain(
      "historicalOriginClaim=not_claimed",
    );
    expect(evidence).toContain("winnerClaim=not_claimed");
    expect(evidence).toContain(
      "languageSuperiorityClaim=not_claimed",
    );
    expect(evidence).toContain(
      "userDecisionPosture=user_decides",
    );

    expect(evidence).not.toContain(
      "10.3765/plsa.v8i1.5501",
    );
    expect(evidence).not.toContain(
      "Direct DPEWA/FGJSH locator",
    );
    expect(evidence).not.toContain(
      "historicalOriginClaim=" + "true",
    );
    expect(evidence).not.toContain(
      "candidateTruthClaim=" + "true",
    );
  });

  it.each(["da", "dam", "damage", "mode", "xyz"])(
    "does not attach reviewed DI evidence to unrelated input %s",
    async (word) => {
      const out = await analyze(word);
      const evidence = rootMapText(out);

      expect(evidence).not.toContain(
        "https://en.wiktionary.org/wiki/di#Albanian",
      );
      expect(evidence).not.toContain(
        "Albanian > Etymology 1 > Verb > di: to know",
      );
      expect(evidence).not.toContain(
        "di = know / knowledge",
      );
    },
  );
});
