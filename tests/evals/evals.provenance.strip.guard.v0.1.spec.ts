import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals provenance strip guard v0.1", () => {
  it("locks compact run-context strip above scored summary", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain("Run context");
    expect(ui).toContain("sourceEngineVersion");
    expect(ui).toContain("report.meta?.sourceEngineVersion?.trim()");
    expect(ui).toContain("taskId");
    expect(ui).toContain('{devicePlateTaskId ?? "—"}');
    expect(ui).toContain("scorerBuild");
    expect(ui).toContain("{devicePlateScorerBuild}");
    expect(ui).toContain("exportedAtUtc");
    expect(ui).toContain('{devicePlateExportedAtUtc || "—"}');
    expect(ui).toContain("Scored summary");
  });
});
