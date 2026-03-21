import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals source-engine autofill guard v0.1", () => {
  it("locks runtime-backed analyze-v1 autofill wiring", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");
    const route = readUtf8("app/api/evals/source-engine-provenance/route.ts");

    expect(ui).toContain('const showAnalyzeV1Autofill = mode === "run_bundle";');
    expect(ui).toContain('fetch("/api/evals/source-engine-provenance"');
    expect(ui).toContain('setSourceEngineId(String(data.sourceEngineId ?? "analyze-v1"))');
    expect(ui).toContain('setSourceEngineVersion(String(data.sourceEngineVersion ?? ""))');
    expect(ui).toContain('setSourceEngineBuild(String(data.sourceEngineBuild ?? ""))');
    expect(ui).toContain(
      "Only use this when the JSON being scored was produced by the current /api/analyze-v1 route."
    );

    expect(ui).not.toContain("const autofillSourceEngineBuild = useMemo(");
    expect(ui).not.toContain("process.env.NEXT_PUBLIC_GIT_SHA");

    expect(route).toContain('sourceEngineId: "analyze-v1"');
    expect(route).toContain("sourceEngineVersion: ENGINE_VERSION_V1");
    expect(route).toContain('execSync("git rev-parse --short HEAD"');
  });
});
