import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals source-engine copy clarity guard v0.1", () => {
  it("locks split run metadata vs collapsed upstream provenance wording", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

        expect(ui).toContain("Public beta — bring model outputs, not prompts");
    expect(ui).toContain(
      "Use this page to score model-generated ladder or evalRun JSON against ZË-RO's deterministic eval instrument."
    );
    expect(ui).toContain(
      "Paste either a full evalRun.v0.1 bundle or raw V1..V7 bucket JSON."
    );
    expect(ui).toContain(
      "Do not paste private data, secrets, or anything you would not want copied into exports."
    );
    expect(ui).toContain(
      "ZË-RO does not call models from this page. You generate outputs elsewhere, then score them here."
    );
expect(ui).toContain("Report feedback ↗");
    expect(ui).toContain("Copy page link");
    expect(ui).toContain("Copied page link.");
    expect(ui).toContain("https://github.com/sokolgora-sketch/linguistic-decoder/issues/new");
    expect(ui).toContain("Run metadata");
    expect(ui).toContain("Optional report metadata for this scored run.");

    expect(ui).toContain("Upstream engine provenance");
    expect(ui).toContain(
      "Only fill sourceEngine* when the JSON being scored already came from an upstream ZË-RO engine/export."
    );

    expect(ui).toContain(
      "Leave sourceEngine* blank for hand-pasted buckets, external model outputs, or synthetic examples. The scorer cannot infer upstream engine provenance by itself."
    );

    expect(ui).toContain("Run context");
    expect(ui).toContain("upstreamEngine");
    expect(ui).toContain(': "not provided"}');

    expect(ui).toContain("scorerBuild");
    expect(ui).toContain("exportedAtUtc");
    expect(ui).toContain("report.meta?.sourceEngineVersion?.trim()");

    expect(ui).not.toContain(
      "Optional report metadata. sourceEngine* is only for upstream ZË-RO engine provenance when this input already came from another engine/export."
    );
  });
});
