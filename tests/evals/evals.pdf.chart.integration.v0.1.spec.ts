import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { PDFDocument } from "pdf-lib";

import { POST } from "../../app/api/evals/pdf/route";

function readJson(rel: string): any {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf8"));
}

function readUtf8(rel: string): string {
  return fs.readFileSync(path.join(process.cwd(), rel), "utf8");
}

describe("Evals PDF chart integration v0.1", () => {
  it("keeps PDF export healthy and appends a chart-aware page path", async () => {
    const raw = readJson(
      "tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json"
    );

    raw.runId = "pdf chart/integration v0.1";

    const req = new Request("http://localhost/api/evals/pdf", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(raw),
    });

    const res = await POST(req as any);

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/pdf");
    expect(res.headers.get("content-disposition")).toBe(
      'attachment; filename="evals.pdf_chart_integration_v0.1.v0.1.pdf"'
    );

    const bytes = new Uint8Array(await res.arrayBuffer());
    expect(bytes.byteLength).toBeGreaterThan(5000);

    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBeGreaterThanOrEqual(2);
  });

  it("locks chart-page source anchors in the PDF route", () => {
    const src = readUtf8("app/api/evals/pdf/route.ts");

    expect(src).toContain("extractT2TrendFromMarkdown");
    expect(src).toContain("Aperture trend by bucket");
    expect(src).toContain("Mean aperture score from V1 to V7.");
    expect(src).toContain("appendTrendChartPage(pdfBytes, md)");
  });
});
