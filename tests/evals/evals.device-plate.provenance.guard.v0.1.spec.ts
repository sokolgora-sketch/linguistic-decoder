import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals device plate provenance guard v0.1", () => {
  it("locks taskVersion and promptHash plumbing in the evals UI", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain('async function sha256HexV0_1(text: string): Promise<string>');
    expect(ui).toContain("function taskVersionFromTaskIdV0_1(taskId: string | null | undefined): string");
    expect(ui).toContain('const [devicePlatePromptHash, setDevicePlatePromptHash] = useState("—");');
    expect(ui).toContain('const devicePlateTaskVersion = taskVersionFromTaskIdV0_1(devicePlateTaskId);');
    expect(ui).toContain('EVAL_SPEC_V0_1.tasks.find((t) => t.taskId === devicePlateTaskId)?.prompt ?? "";');
    expect(ui).toContain("taskVersion:");
    expect(ui).toContain("{devicePlateTaskVersion}");
    expect(ui).toContain("promptHash:");
    expect(ui).toContain("{devicePlatePromptHash}");
  });
});
