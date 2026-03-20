import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals task-card hierarchy guard v0.1", () => {
  it("locks primary-vs-derived hierarchy wording and styling anchors", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain('const isDerived = t.kind !== "byo";');
    expect(ui).toContain('Primary scored task');
    expect(ui).toContain('Validation control');
    expect(ui).toContain(
      'Direct score report for the user-supplied task.'
    );
    expect(ui).toContain(
      'Derived control used to sanity-check bucket behavior and scorer stability.'
    );
    expect(ui).toContain('Primary scored tasks');
    expect(ui).toContain(
      'Direct reports for the uploaded or wrapped task input.'
    );
    expect(ui).toContain('border-[#274436] bg-[#131914]');
    expect(ui).toContain('border-[#4a3b25] bg-[#171411]');
  });
});
