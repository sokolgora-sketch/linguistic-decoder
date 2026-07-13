import { analyzeWordV1 } from "@/engine/analyzeWordV1";
import { enginePayloadToAnalysisResult } from "@/shared/analysisAdapter";

async function analyze(word: string): Promise<any> {
  const payload = await analyzeWordV1(
    word,
    { mode: "strict" } as any,
  );

  return enginePayloadToAnalysisResult(payload as any) as any;
}

function evidenceForToken(
  out: any,
  token: string,
): string {
  const key = out.rootMap?.keys?.find(
    (candidate: any) => candidate?.token === token,
  );

  return Array.isArray(key?.evidence)
    ? key.evidence.join("\n")
    : "";
}

describe("analyze-v1 reviewed evidence operation wiring v0.1", () => {
  it("surfaces reviewed Gheg DA evidence for an exact DA match", async () => {
    const out = await analyze("da");
    const da = out.rootMap?.keys?.find(
      (key: any) => key?.token === "DA",
    );

    expect(da).toBeTruthy();

    const evidence = evidenceForToken(out, "DA");

    expect(evidence).toContain(
      "reviewed functional free-operator evidence",
    );
    expect(evidence).toContain(
      "Dedvukaj & Ndoci 2023 PLSA",
    );
    expect(evidence).toContain(
      "Example (4), page 3; footnote 1",
    );
    expect(evidence).toContain(
      "10.3765/plsa.v8i1.5501",
    );
    expect(evidence).toContain(
      "historicalOriginClaim=not_claimed",
    );
    expect(evidence).toContain(
      "winnerClaim=not_claimed",
    );
    expect(evidence).toContain(
      "languageSuperiorityClaim=not_claimed",
    );
    expect(evidence).toContain(
      "userDecisionPosture=user_decides",
    );
  });

  it("supersedes the historical mode-positive evidence contract while retaining the DA token", async () => {
    const out = await analyze("mode");
    const da = out.rootMap?.keys?.find(
      (key: any) => key?.token === "DA",
    );

    expect(da).toBeTruthy();

    const evidence = evidenceForToken(out, "DA");

    expect(evidence).toContain("ops: final_swap");
    expect(evidence).not.toContain(
      "reviewed functional free-operator evidence",
    );
    expect(evidence).not.toContain(
      "10.3765/plsa.v8i1.5501",
    );
  });

  it("preserves bounded reviewed DI evidence through explicitly admitted y_to_i", async () => {
    const out = await analyze("study");
    const di = out.rootMap?.keys?.find(
      (key: any) => key?.token === "DI",
    );

    expect(di).toBeTruthy();

    const evidence = evidenceForToken(out, "DI");

    expect(evidence).toContain("ops: y_to_i");
    expect(evidence).toContain(
      "reviewed functional free-operator evidence",
    );
    expect(evidence).toContain(
      "https://en.wiktionary.org/wiki/di#Albanian",
    );
    expect(evidence).toContain(
      "historicalOriginClaim=not_claimed",
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
  });
});
