import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

describe("Evals header actions layout v0.1", () => {
  it("locks utility actions into StickyNav and removes hero utility actions", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "src/ui/evals/EvalsPageClient.v0.1.tsx"),
      "utf8"
    );

    expect(src).toContain("function StickyNav({");
    expect(src).toContain("onCopyPageLink: () => void | Promise<void>;");
    expect(src).toContain("<StickyNav onCopyPageLink={onCopyPageLink} />");
    expect(src).toContain('href="/evals/help"');
    expect(src).toContain('href="/evals/reference"');
    expect(src).toContain("Report feedback ↗");
    expect(src).toContain("Copy page link");
    expect(src).toContain("← home");

    expect(src).not.toContain(
`<div className="flex flex-wrap items-center gap-2">
                        <Link
                          href="/evals/help"`
    );
  });
});
