import fs from "fs";

function read(p: string) {
  return fs.readFileSync(p, "utf8");
}

describe("Orchestrator v0.3: no engine internals imported (guard)", () => {
  const files = [
    "src/shared/orchestrator/proposeLoop.v0.3.ts",
    "src/shared/orchestrator/proposalParse.v0.2.ts",
    "src/shared/orchestrator/proposeOnce.v0.2.ts",
    "src/shared/llm/providers/proposerProvider.v0.2.ts",
    "src/shared/llm/prompts/rootProposer.v0.2.ts",
    "app/api/propose-loop/route.ts",
  ];

  // We only guard against DIRECT imports/mentions in the orchestrator layer.
  // (Verifier may use engine math7 SSOT internally; that's allowed and guarded elsewhere.)
  const banned = [
    'from "@/engine',
    'from "@/v1',
    "analyzeWordV1",
    "deepRoot",
    "minRoots",
    "wordMatrix",
    "OriginClaim",
  ];

  it("does not reference engine internals directly", () => {
    for (const f of files) {
      const t = read(f);
      for (const b of banned) {
        expect(t).not.toContain(b);
      }
    }
  });
});
