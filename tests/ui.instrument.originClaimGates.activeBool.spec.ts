import { adaptAnalysisToTelemetryVM } from "@/ui/telemetry/contractAdapter";

describe("originClaimGates VM — active is boolean", () => {
  it("coerces active to boolean (never null/undefined)", () => {
    const out = adaptAnalysisToTelemetryVM({
      word: "study",
      mode: "strict",
      alphabet: "auto",
      engineVersion: "test",
      primaryPath: { voicePath: ["U", "I"], levelPath: "", ringPath: [1, 1] },
      originClaimGates: { flag: "ocg", active: null },
      originClaim: {
        version: "v1",
        policy: "no_single_winner",
        support: { claimId: "oc:test", refs: [] },
        candidates: [],
        summary: { confidence: "weak", note: "x" },
        meta: {
          engineVersion: "x",
          generatedAt: "x",
          inputs: { word: "x", mode: "strict", alphabet: "auto" },
        },
      },
    } as any);

    expect(typeof out.originClaimGates.active).toBe("boolean");
    // no_single_winner => gates are not active
    expect(out.originClaimGates.active).toBe(false);
  });
});
