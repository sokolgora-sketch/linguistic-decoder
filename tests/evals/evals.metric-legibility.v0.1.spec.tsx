import { describe, expect, it } from "@jest/globals";
import fs from "fs";
import path from "path";

describe("Evals metric legibility v0.1", () => {
  it("locks the stronger scored-summary interpretation copy in source", () => {
    const src = fs.readFileSync(
      path.join(process.cwd(), "src/ui/evals/EvalsPageClient.v0.1.tsx"),
      "utf8"
    );

    expect(src).toContain(
      "Read signal strength, rank-order alignment, significance, and valid-token coverage for the active run."
    );
    expect(src).toContain("Expected aperture slope");
    expect(src).toContain(
      "More negative = stronger expected slope · near 0 = weak or flat · positive = reversed order."
    );
    expect(src).toContain("linear fit · aperture primary");
    expect(src).toContain("rank order · aperture primary");
    expect(src).toContain("significance check ·");
    expect(src).toContain("invalid tokens");
  });
});
