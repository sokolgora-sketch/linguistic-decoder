/* eslint-disable @typescript-eslint/no-var-requires */

// Polyfill FIRST (must happen before requiring undici/next/server)
const util = require("node:util");
const crypto = require("node:crypto");
const wt = require("node:worker_threads");

if (!(globalThis).TextEncoder) (globalThis).TextEncoder = util.TextEncoder;
if (!(globalThis).TextDecoder) (globalThis).TextDecoder = util.TextDecoder;

if (!(globalThis).crypto) (globalThis).crypto = crypto.webcrypto;

// undici expects these Web APIs:
if (!(globalThis).MessageChannel) (globalThis).MessageChannel = wt.MessageChannel;
if (!(globalThis).MessagePort) (globalThis).MessagePort = wt.MessagePort;

// Some environments also miss Web Streams (safe to polyfill)
try {
  const webStreams = require("node:stream/web");
  if (!(globalThis).ReadableStream) (globalThis).ReadableStream = webStreams.ReadableStream;
  if (!(globalThis).WritableStream) (globalThis).WritableStream = webStreams.WritableStream;
  if (!(globalThis).TransformStream) (globalThis).TransformStream = webStreams.TransformStream;
} catch {
  // ignore
}

// Now load undici AFTER polyfills
const undici = require("undici");
if (!(globalThis).Request) (globalThis).Request = undici.Request;
if (!(globalThis).Response) (globalThis).Response = undici.Response;
if (!(globalThis).Headers) (globalThis).Headers = undici.Headers;
if (!(globalThis).fetch) (globalThis).fetch = undici.fetch;

type PostFn = (req: Request) => Promise<Response>;
let POST: PostFn;

beforeAll(async () => {
  // Import route handler AFTER globals exist
  const mod = await import("../app/api/analyze/route");
  POST = mod.POST as PostFn;
});

async function postAnalyze(word?: string) {
  const body = word ? { word } : {};
  const req = new Request("http://localhost/api/analyze", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const res = await POST(req);
  const json = await res.json();

  // Strip unstable fields if present
  if (json && typeof json === "object") {
    delete (json as any).engine_meta;
    delete (json as any).engineMeta;
    delete (json as any).timestamp;
    delete (json as any).requestId;
  }

  return { status: res.status, json };
}

describe("POST /api/analyze — gold snapshots", () => {
  it("study", async () => {
    const out = await postAnalyze("study");
    expect(out.status).toBe(200);
    expect(out.json).toMatchSnapshot();
  });

  it("damage", async () => {
    const out = await postAnalyze("damage");
    expect(out.status).toBe(200);
    expect(out.json).toMatchSnapshot();
  });

  it("missing word -> 400", async () => {
    const out = await postAnalyze(undefined);
    expect(out.status).toBe(400);
    expect(out.json).toMatchSnapshot();
  });
});
