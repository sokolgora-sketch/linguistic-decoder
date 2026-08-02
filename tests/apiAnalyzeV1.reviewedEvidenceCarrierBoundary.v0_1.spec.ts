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

describe("analyze-v1 reviewed DI evidence carrier boundary v0.1", () => {
  it.each([
    ["di", "exact"],
    ["study", "y_to_i"],
    ["studim", "exact"],
  ])(
    "%s retains reviewed DI evidence through reviewed carrier di and operation %s",
    async (word, operation) => {
      const out = await analyze(word);
      const di = tokenKey(out, "DI");
      const evidence = evidenceText(di);

      expect(di).toBeTruthy();
      expect(evidence).toContain("sq: di");
      expect(evidence).toContain(`ops: ${operation}`);
      expect(evidence).toContain(
        "reviewed functional free-operator evidence",
      );
      expect(evidence).toContain(
        "https://en.wiktionary.org/wiki/di#Albanian",
      );
      expect(evidence).not.toContain(
        "10.3765/plsa.v8i1.5501",
      );
    },
  );

  it.each([
    ["dij", "candidate_only"],
    ["dije", "candidate_only"],
    ["dit", "carrier_only"],
  ])(
    "%s retains its DI token but withholds reviewed DI evidence",
    async (word, expectedStatus) => {
      const out = await analyze(word);
      const di = tokenKey(out, "DI");
      const evidence = evidenceText(di);

      expect(di).toBeTruthy();
      expect(di?.status).toBe(expectedStatus);
      expect(evidence).toContain(`sq: ${word}`);
      expect(evidence).toContain("ops: exact");
      expect(evidence).not.toContain(
        "reviewed functional free-operator evidence",
      );
      expect(evidence).not.toContain(
        "https://en.wiktionary.org/wiki/di#Albanian",
      );
      expect(evidence).not.toContain(
        "10.3765/plsa.v8i1.5501",
      );
    },
  );

  it("preserves the weak-carrier warning for dit while withholding reviewed evidence", async () => {
    const out = await analyze("dit");
    const di = tokenKey(out, "DI");
    const evidence = evidenceText(di);

    expect(di?.status).toBe("carrier_only");
    expect(evidence).toContain(
      "day (carrier; semantic drift possible)",
    );
    expect(evidence).toContain(
      "include as weak carrier; do not over-claim",
    );
    expect(evidence).not.toContain(
      "reviewed functional free-operator evidence",
    );
  });
});
