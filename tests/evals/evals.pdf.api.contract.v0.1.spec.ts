import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { POST } from "../../app/api/evals/pdf/route";

function readJson(rel: string): any {
  return JSON.parse(fs.readFileSync(path.join(process.cwd(), rel), "utf8"));
}

describe("Evals PDF API contract v0.1", () => {
  it("returns a stable PDF response with attachment headers and safe filename", async () => {
    const raw = readJson(
      "tests/evals/runs/evalRun.public-grounding-probe.v0.1.gold.synthetic.full.v0.1.json"
    );

    raw.runId = "weird run/id";

    const req = new Request("http://localhost/api/evals/pdf", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(raw),
    });

    const res = await POST(req as any);

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("content-type")).toContain("application/pdf");
    expect(res.headers.get("content-disposition")).toBe(
      'attachment; filename="evals.weird_run_id.v0.1.pdf"'
    );

    const ab = await res.arrayBuffer();
    const bytes = new Uint8Array(ab);

    expect(bytes.byteLength).toBeGreaterThan(1000);

    const sig = Buffer.from(bytes.slice(0, 4)).toString("ascii");
    expect(sig).toBe("%PDF");
  });

  it("returns BAD_JSON for malformed JSON", async () => {
    const req = new Request("http://localhost/api/evals/pdf", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: '{"broken": ',
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data).toEqual({
      ok: false,
      code: "BAD_JSON",
      message: "Body must be valid JSON.",
    });
    expect(res.headers.get("cache-control")).toBe("no-store");
    expect(res.headers.get("content-type")).toContain("application/json");
  });

  it("returns INVALID_RUN for valid JSON with wrong shape", async () => {
    const req = new Request("http://localhost/api/evals/pdf", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        hello: "world",
      }),
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.ok).toBe(false);
    expect(data.code).toBe("INVALID_RUN");
    expect(String(data.message)).toContain('evalRun.v0.1');
    expect(String(data.message)).toContain('evalSpec.v0.1');
  });

  it("returns PAYLOAD_TOO_LARGE before JSON parsing", async () => {
    const huge = "x".repeat(300_001);

    const req = new Request("http://localhost/api/evals/pdf", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: huge,
    });

    const res = await POST(req as any);
    const data = await res.json();

    expect(res.status).toBe(413);
    expect(data.ok).toBe(false);
    expect(data.code).toBe("PAYLOAD_TOO_LARGE");
    expect(String(data.message)).toContain("Payload too large");
  });
});
