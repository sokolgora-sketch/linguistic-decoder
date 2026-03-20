import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals scorer-build freshness guard v0.1", () => {
  it("locks runtime scorerBuild resolution in markdown renderer", () => {
    const md = readUtf8("src/shared/evals/renderEvalReportMd.v0.1.ts");

    expect(md).toContain('execSync("git rev-parse --short HEAD"');
    expect(md).toContain("const scorerBuild = resolveScorerBuildV0_1();");
    expect(md).toContain('process.env.NODE_ENV === "test"');
    expect(md).toContain('process.env.JEST_WORKER_ID');
    expect(md).toContain('execSync("git rev-parse --short HEAD"');
    expect(md).toContain('process.env.VERCEL_GIT_COMMIT_SHA');
    expect(md).toContain('process.env.GIT_SHA');
    expect(md).toContain('process.env.NEXT_PUBLIC_GIT_SHA');
  });

  it("locks UI scorerBuild to markdown front matter, not baked client env", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain('extractMdFrontMatterValueV0_1(md, "scorerBuild")');
    expect(ui).toContain('const devicePlateScorerBuild = useMemo(');
    expect(ui).not.toContain('const devicePlateScorerBuild = process.env.NEXT_PUBLIC_GIT_SHA');
  });
});
