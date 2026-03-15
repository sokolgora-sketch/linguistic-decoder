import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { POST } from "../../app/api/evals/score/route";

function readJson(rel: string): any {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf8"));
}

describe("Evals score API contract v0.1", () => {
  it("returns stable success shape with markdown taskId and blank-meta normalization", async () => {
    const raw = readJson(
      "tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json"
    );

    raw.runId = "api.contract.blank-meta.v0.1";
    raw.meta = {
      provider: "   ",
      model: "",
      label: "   ",
    };

    const req = new Request("http://localhost/api/evals/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(raw),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");

    expect(data.ok).toBe(true);
    expect(typeof data.md).toBe("string");
    expect(data.report).toBeTruthy();

    expect(data.report.specId).toBe("public-grounding-probe.v0.1");
    expect(data.report.runId).toBe("api.contract.blank-meta.v0.1");
    expect(Array.isArray(data.report.tasks)).toBe(true);
    expect(data.report.tasks.length).toBeGreaterThan(0);
    expect(data.report.tasks[0].taskId).toBe("T1_BUCKET_V1_V0_1");

    expect(data.md).toContain("# ZË-RO Evals Report v0.1");
    expect(data.md).toContain("- taskId: T1_BUCKET_V1_V0_1");
    expect(data.md).toContain("- provider: not set");
    expect(data.md).toContain("- model: not set");
    expect(data.md).toContain("- label: not set");
  });

  it("returns BAD_JSON for malformed JSON", async () => {
    const req = new Request("http://localhost/api/evals/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: "{",
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(data).toEqual({
      ok: false,
      code: "BAD_JSON",
      message: "Body must be valid JSON.",
    });
  });

  it("returns INVALID_RUN for valid JSON with wrong shape", async () => {
    const req = new Request("http://localhost/api/evals/score", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        version: "not-an-eval-run",
        allowedTags: [],
        tags: {},
      }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(data.ok).toBe(false);
    expect(data.code).toBe("INVALID_RUN");
    expect(typeof data.message).toBe("string");
    expect(data.message).toContain("evalRun.v0.1");
  });

  it("returns PAYLOAD_TOO_LARGE before JSON parsing", async () => {
    const oversized = " ".repeat(300_001);

    const req = new Request("http://localhost/api/evals/score", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: oversized,
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(413);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(data.ok).toBe(false);
    expect(data.code).toBe("PAYLOAD_TOO_LARGE");
    expect(typeof data.message).toBe("string");
    expect(data.message).toContain("Payload too large");
  });
});
