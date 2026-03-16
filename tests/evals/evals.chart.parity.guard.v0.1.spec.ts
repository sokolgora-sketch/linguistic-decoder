import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals chart parity guard v0.1", () => {
  it("locks UI chart to bucket path plus dashed linear trend", () => {
    const ui = readUtf8("src/ui/evals/EvalsPageClient.v0.1.tsx");

    expect(ui).toContain('const pathD = pts.map((p, i) => (i === 0 ? "M " : "L ") + p.x + " " + p.y).join(" ");');
    expect(ui).toContain("Solid path = bucket means · dashed path = linear trend.");
    expect(ui).toContain("d={pathD}");
    expect(ui).toContain('stroke="#f59aa4"');
    expect(ui).toContain('strokeDasharray="5 4"');
  });

  it("locks PDF chart to bucket path plus dashed linear trend", () => {
    const pdf = readUtf8("app/api/evals/pdf/route.ts");

    expect(pdf).toContain("function drawPolyline(params:");
    expect(pdf).toContain("Solid path = bucket means · dashed path = linear trend.");
    expect(pdf).toContain("const n = points.length;");
    expect(pdf).toContain("drawPolyline({");
    expect(pdf).toContain("drawDashedLine({");
    expect(pdf).toContain("const x1 = chartX;");
    expect(pdf).toContain("const x2 = points[points.length - 1]?.x ?? chartX;");
  });
});
