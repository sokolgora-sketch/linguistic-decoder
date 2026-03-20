import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals source-engine autofill guard v0.1", () => {
  it("locks analyze-v1 autofill provenance wiring", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain('import { ENGINE_VERSION_V1 } from "@/v1/versions.v1";');
    expect(ui).toContain("const autofillSourceEngineBuild = useMemo(");
    expect(ui).toContain('process.env.NEXT_PUBLIC_GIT_SHA');
    expect(ui).toContain("function autofillAnalyzeV1SourceEngine() {");
    expect(ui).toContain('setSourceEngineId("analyze-v1");');
    expect(ui).toContain("setSourceEngineVersion(ENGINE_VERSION_V1);");
    expect(ui).toContain("setSourceEngineBuild(autofillSourceEngineBuild);");
    expect(ui).toContain('Filled sourceEngine* from current /api/analyze-v1 provenance.');
    expect(ui).toContain("Autofill analyze-v1");
    expect(ui).toContain("disabled={busy}");
  });
});
