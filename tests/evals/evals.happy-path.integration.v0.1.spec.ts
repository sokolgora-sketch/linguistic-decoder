import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { POST as postScore } from "../../app/api/evals/score/route";
import { POST as postPdf } from "../../app/api/evals/pdf/route";

const FIXTURE_REL =
  "tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json";

function readJson(rel: string): any {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf8"));
}

function clone<T>(x: T): T {
  return JSON.parse(JSON.stringify(x));
}

describe("Evals happy-path integration v0.1", () => {
  it("round-trips a known run through score then pdf with stable md + headers", async () => {
    const raw = clone(readJson(FIXTURE_REL));

    raw.runId = "happy path/run v0.1";
    raw.meta = {
      provider: "   ",
      model: "",
      label: "   ",
    };

    const body = JSON.stringify(raw);

    const scoreReq = new Request("http://localhost/api/evals/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });

    const scoreRes = await postScore(scoreReq as any);
    const scoreData: any = await scoreRes.json();

    expect(scoreRes.status).toBe(200);
    expect(scoreRes.headers.get("cache-control")).toBe("no-store");
    expect(scoreRes.headers.get("content-type")).toContain("application/json");

    expect(scoreData.ok).toBe(true);
    expect(scoreData.report.runId).toBe("happy path/run v0.1");
    expect(scoreData.report.specId).toBe("public-grounding-probe.v0.1");
    expect(Array.isArray(scoreData.report.tasks)).toBe(true);
    expect(scoreData.report.tasks[0]?.taskId).toBe("T1_BUCKET_V1_V0_1");
    expect(
      scoreData.report.tasks.some((t: any) => t.taskId === "T2_LADDER_V0_1")
    ).toBe(true);
    expect(
      scoreData.report.tasks.some(
        (t: any) => t.taskId === "T3_NEGATIVE_CONTROL_SHUFFLE_V0_1"
      )
    ).toBe(true);

    expect(typeof scoreData.md).toBe("string");
    expect(scoreData.md).toContain("# ZË-RO Evals Report v0.1");
    expect(scoreData.md).toContain("- taskId: T1_BUCKET_V1_V0_1");
    expect(scoreData.md).toContain("- provider: not set");
    expect(scoreData.md).toContain("- model: not set");
    expect(scoreData.md).toContain("- label: not set");

    const pdfReq = new Request("http://localhost/api/evals/pdf", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });

    const pdfRes = await postPdf(pdfReq as any);
    const pdfBytes = new Uint8Array(await pdfRes.arrayBuffer());

    expect(pdfRes.status).toBe(200);
    expect(pdfRes.headers.get("cache-control")).toBe("no-store");
    expect(pdfRes.headers.get("content-type")).toContain("application/pdf");
    expect(pdfRes.headers.get("content-disposition")).toBe(
      'attachment; filename="evals.happy_path_run_v0.1.v0.1.pdf"'
    );

    expect(pdfBytes.byteLength).toBeGreaterThan(1000);
    expect(Buffer.from(pdfBytes.slice(0, 4)).toString("utf8")).toBe("%PDF");
  });

  it("preserves calibration meta on the committed gold fixture", async () => {
    const raw = clone(readJson(FIXTURE_REL));

    const scoreReq = new Request("http://localhost/api/evals/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(raw),
    });

    const scoreRes = await postScore(scoreReq as any);
    const scoreData: any = await scoreRes.json();

    expect(scoreRes.status).toBe(200);
    expect(scoreData.ok).toBe(true);
    expect(scoreData.report.runId).toBe("gold.synthetic.full");

    expect(scoreData.md).toContain("- provider: synthetic");
    expect(scoreData.md).toContain("- model: none");
    expect(scoreData.md).toContain("- label: calibration");
    expect(scoreData.md).toContain("- taskId: T1_BUCKET_V1_V0_1");
  });
});
