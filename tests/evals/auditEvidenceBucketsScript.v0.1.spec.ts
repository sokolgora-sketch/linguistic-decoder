import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import JSZip from "jszip";

async function writeZip(zipPath: string) {
  const zip = new JSZip();

  zip.file(
    "runs/example-run/input.json",
    JSON.stringify(
      {
        runId: "example-run",
        tasks: [
          {
            taskId: "T5_INTERMEDIATE_V0_1",
            inputShape: "intermediate_triple",
            languageHint: "hi",
            vowelUnderTest: "i",
            buckets: {
              anchor_low: ["raah", "safar"],
              x_vowel: ["nadi", "sabit"],
              anchor_high: ["rekha", "seema"],
            },
          },
        ],
      },
      null,
      2
    )
  );

  const buffer = await zip.generateAsync({ type: "nodebuffer" });
  writeFileSync(zipPath, buffer);
}

describe("auditEvidenceBuckets script", () => {
  it("prints bucket geometry from an evidence-pack zip", async () => {
    const dir = mkdtempSync(join(tmpdir(), "audit-evidence-buckets-"));
    mkdirSync(dir, { recursive: true });
    const zipPath = join(dir, "fixture.zip");
    await writeZip(zipPath);

    const output = execFileSync("node", ["scripts/evals/auditEvidenceBuckets.mjs", zipPath], {
      encoding: "utf8",
    });

    expect(output).toContain("Input JSON files: 1");
    expect(output).toContain("RUN example-run");
    expect(output).toContain("targetVowel=i");
    expect(output).toContain("anchor_low: count=2");
    expect(output).toContain("x_vowel: count=2");
    expect(output).toContain("anchor_high: count=2");
    expect(output).toContain("nadi | open_final");
    expect(output).toContain("sabit | closed_final");
    expect(output).toContain("WARN count=2, expected 10");
  });
});
