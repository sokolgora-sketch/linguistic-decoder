require("./helpers/whatwgGlobals.cjs");
/**
 * Jest env here does not provide WHATWG Web APIs.
 * next/server + undici expect them, so we polyfill BEFORE requiring either.
 */

const util = require("node:util");
const web = require("node:stream/web");
const wt = require("node:worker_threads");

// TextEncoder/TextDecoder for undici + NextRequest internals
globalThis.TextEncoder = util.TextEncoder;
globalThis.TextDecoder = util.TextDecoder;

// Web Streams for undici
globalThis.ReadableStream = web.ReadableStream;
globalThis.WritableStream = web.WritableStream;
globalThis.TransformStream = web.TransformStream;

// MessagePort for undici webidl
globalThis.MessagePort = wt.MessagePort;

// Now we can safely load undici (fetch globals)
const undici = require("undici");
globalThis.Request = undici.Request;
globalThis.Response = undici.Response;
globalThis.Headers = undici.Headers;
globalThis.fetch = undici.fetch;

const { describe, expect, test } = require("@jest/globals");
const { NextRequest } = require("next/server");

// IMPORTANT: app/ is at repo root; @/ maps to src/, so use relative import.
const { GET, POST } = require("../app/api/analyze/route");

/**
 * /api/analyze is a legacy shim to /api/analyze-v1.
 * We test via direct handler invocation (no localhost server).
 */
describe("/api/analyze (legacy shim)", () => {
  test("GET returns JSON and includes sanitized", async () => {
    const req = new NextRequest("http://localhost/api/analyze?word=study&mode=strict");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const ct = res.headers.get("content-type") || "";
    expect(ct).toContain("application/json");

    const json = await res.json();
    expect(json).toHaveProperty("word");
    expect(json).toHaveProperty("sanitized");
  });

  test("POST returns JSON and includes sanitized", async () => {
    const req = new NextRequest("http://localhost/api/analyze", {
      method: "POST",
      body: JSON.stringify({ word: "study", mode: "strict" }),
      headers: { "content-type": "application/json" },
    });

    const res = await POST(req);

    expect(res.status).toBe(200);
    const ct = res.headers.get("content-type") || "";
    expect(ct).toContain("application/json");

    const json = await res.json();
    expect(json).toHaveProperty("word");
    expect(json).toHaveProperty("sanitized");
  });
});
