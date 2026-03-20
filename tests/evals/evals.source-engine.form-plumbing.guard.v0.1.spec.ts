import fs from "fs";
import path from "path";

const ROOT = path.resolve(__dirname, "../..");

function readUtf8(rel: string) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

describe("Evals source-engine form plumbing guard v0.1", () => {
  it("locks source-engine state and trimmed plumbing through both wrap paths", () => {
    const uiSrc = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(uiSrc).toContain(
      'const [sourceEngineId, setSourceEngineId] = useState<string>("");',
    );
    expect(uiSrc).toContain(
      'const [sourceEngineVersion, setSourceEngineVersion] = useState<string>("");',
    );
    expect(uiSrc).toContain(
      'const [sourceEngineBuild, setSourceEngineBuild] = useState<string>("");',
    );

    expect(uiSrc).toContain("const providerValue = provider.trim();");
    expect(uiSrc).toContain("const modelValue = model.trim();");
    expect(uiSrc).toContain("const labelValue = label.trim();");
    expect(uiSrc).toContain(
      "const sourceEngineIdValue = sourceEngineId.trim();",
    );
    expect(uiSrc).toContain(
      "const sourceEngineVersionValue = sourceEngineVersion.trim();",
    );
    expect(uiSrc).toContain(
      "const sourceEngineBuildValue = sourceEngineBuild.trim();",
    );

    expect(uiSrc).toContain(
      "...(sourceEngineIdValue ? { sourceEngineId: sourceEngineIdValue } : {}),",
    );
    expect(uiSrc).toContain("...(sourceEngineVersionValue");
    expect(uiSrc).toContain("...(sourceEngineBuildValue");

    expect(uiSrc).toContain("dfSplitCsvSafe(sourceEngineVersion.trim())");
    expect(uiSrc).toContain('sourceEngineId=${sourceEngineId.trim() || ""}');
    expect(uiSrc).toContain(
      'sourceEngineBuild=${sourceEngineBuild.trim() || ""}',
    );
  });
});
