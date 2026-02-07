import { readFileSync } from "node:fs";

describe("Verifier guard: no engine imports (v0.1.1)", () => {
  it("verifyProposal.v0.1 does not import engine entrypoints (analyzeWordV1 / deepRoot)", () => {
    const p = "src/shared/verifier/verifyProposal.v0.1.ts";
    const t = readFileSync(p, "utf8");

    // Ban static imports from engine entrypoints
    const bannedImportFrom = [
      /from\s+["'][^"']*analyzeWordV1["']/,
      /from\s+["'][^"']*deepRoot[^"']*["']/,
      /from\s+["'][^"']*deepRoot\.minRoots[^"']*["']/,
    ];

    // Ban dynamic import / require of engine entrypoints
    const bannedDynamic = [
      /import\(\s*["'][^"']*analyzeWordV1["']\s*\)/,
      /import\(\s*["'][^"']*deepRoot[^"']*["']\s*\)/,
      /require\(\s*["'][^"']*analyzeWordV1["']\s*\)/,
      /require\(\s*["'][^"']*deepRoot[^"']*["']\s*\)/,
    ];

    for (const re of [...bannedImportFrom, ...bannedDynamic]) {
      expect(t).not.toMatch(re);
    }
  });
});
