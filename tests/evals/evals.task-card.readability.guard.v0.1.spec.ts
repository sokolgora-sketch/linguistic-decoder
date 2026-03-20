import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals task-card readability guard v0.1", () => {
  it("locks clearer task-card labels and section headings", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain("taskType");
    expect(ui).toContain("language");
    expect(ui).toContain("targetBuckets");
    expect(ui).toContain("Bucket ledger");
    expect(ui).toContain(
      "Expected versus provided tokens, validity counts, and mean aperture values."
    );
    expect(ui).toContain("Slope diagnostics");
    expect(ui).toContain(
      "Correlation strength and permutation details for both aperture views."
    );
  });
});
