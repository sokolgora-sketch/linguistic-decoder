import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

async function analyze(word: string): Promise<any> {
  const payload = await analyzeWordV1(
    word,
    { mode: "strict" } as any,
  );

  return enginePayloadToAnalysisResult(payload as any) as any;
}

function tokenKey(out: any, token: string): any {
  return out.rootMap?.keys?.find(
    (key: any) => key?.token === token,
  );
}

function evidenceText(key: any): string {
  return Array.isArray(key?.evidence)
    ? key.evidence.join("\n")
    : "";
}

describe("analyze-v1 reviewed evidence operation boundary v0.1", () => {
  it.each(["da", "dam", "damage"])(
    "%s retains reviewed DA evidence through an exact or explicitly exact-equivalent path",
    async (word) => {
      const out = await analyze(word);
      const da = tokenKey(out, "DA");
      const evidence = evidenceText(da);

      expect(da).toBeTruthy();
      expect(evidence).toContain(
        "reviewed functional free-operator evidence",
      );
      expect(evidence).toContain(
        "10.3765/plsa.v8i1.5501",
      );
    },
  );

  it.each([
    ["mode", "final_swap"],
    ["made", "final_swap"],
    ["dome", "vowel_swap"],
  ])(
    "%s retains the DA token but withholds reviewed DA evidence for %s",
    async (word, operation) => {
      const out = await analyze(word);
      const da = tokenKey(out, "DA");
      const evidence = evidenceText(da);

      expect(da).toBeTruthy();
      expect(evidence).toContain(`ops: ${operation}`);
      expect(evidence).not.toContain(
        "reviewed functional free-operator evidence",
      );
      expect(evidence).not.toContain(
        "10.3765/plsa.v8i1.5501",
      );
    },
  );

  it("preserves reviewed DI evidence for study through y_to_i", async () => {
    const out = await analyze("study");
    const di = tokenKey(out, "DI");
    const evidence = evidenceText(di);

    expect(di).toBeTruthy();
    expect(evidence).toContain("ops: y_to_i");
    expect(evidence).toContain(
      "reviewed functional free-operator evidence",
    );
    expect(evidence).toContain(
      "https://en.wiktionary.org/wiki/di#Albanian",
    );
  });

  it("does not expose reviewed canonical evidence for xyz", async () => {
    const out = await analyze("xyz");
    const rootMap = JSON.stringify(out.rootMap ?? {});

    expect(rootMap).not.toContain(
      "reviewed functional free-operator evidence",
    );
  });
});
