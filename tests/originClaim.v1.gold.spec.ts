/**
 * originClaim v1 — gold snapshots (serverless)
 *
 * Goal:
 * - No dev server dependency
 * - Imports Next route handler directly
 * - Polyfills minimal Web globals Next/undici expect inside Jest
 */

import { TextEncoder, TextDecoder } from "node:util";
import { ReadableStream, TransformStream, WritableStream } from "node:stream/web";
import { MessageChannel, MessagePort } from "node:worker_threads";
import { buildOriginClaimV1 } from "../src/shared/originClaim.builder.v1";

// ---- polyfills (must exist before importing undici / route module) ----
(globalThis as any).TextEncoder = TextEncoder;
(globalThis as any).TextDecoder = TextDecoder;

(globalThis as any).ReadableStream = ReadableStream;
(globalThis as any).TransformStream = TransformStream;
(globalThis as any).WritableStream = WritableStream;

(globalThis as any).MessageChannel = MessageChannel;
(globalThis as any).MessagePort = MessagePort;

let __undici: any = null;

async function ensureWebGlobals() {
  if (__undici) return;
  __undici = await import("undici");

  if (!(globalThis as any).fetch) (globalThis as any).fetch = __undici.fetch;
  if (!(globalThis as any).Request) (globalThis as any).Request = __undici.Request;
  if (!(globalThis as any).Response) (globalThis as any).Response = __undici.Response;
  if (!(globalThis as any).Headers) (globalThis as any).Headers = __undici.Headers;
}

async function loadAnalyzeV1Route(): Promise<{ GET: (req: Request) => Promise<Response> }> {
  await ensureWebGlobals();

  const tries = ["../src/app/api/analyze-v1/route", "../app/api/analyze-v1/route"];
  let lastErr: any = null;

  for (const p of tries) {
    try {
      const mod: any = await import(p);
      if (mod?.GET) return { GET: mod.GET };
      lastErr = new Error(`Imported ${p} but no GET export found.`);
    } catch (e) {
      lastErr = e;
    }
  }

  throw new Error(
    [
      "Cannot import analyze-v1 route handler.",
      "Tried:",
      ...tries.map((t) => `- ${t}`),
      "",
      "Last error: " + String(lastErr?.stack ?? lastErr),
    ].join("\n")
  );
}

async function getResult(word: string, mode: "strict" | "open" = "strict"): Promise<any> {
  const { GET } = await loadAnalyzeV1Route();

  const url = new URL("http://localhost/api/analyze-v1");
  url.searchParams.set("word", word);
  url.searchParams.set("mode", mode);

  const req = new (globalThis as any).Request(url.toString(), { method: "GET" });
  const res = await GET(req);

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Non-JSON response\n" + text);
  }
}

function normalizeOriginClaimSnapshot(out: any) {
  const oc = out?.originClaim ?? null;
  if (!oc) return null;
  const meta = oc.meta ? { ...oc.meta, generatedAt: "<iso>" } : undefined;
  return { ...oc, meta };
}

describe("originClaim v1 — gold snapshots (originClaim block only)", () => {
  const words = ["study", "father", "damage", "love", "hope"] as const;

  for (const w of words) {
    test(`gold:${w}`, async () => {
      const out = await getResult(w, "strict");

      // Defensive: builder should align with emitted block
      const built = buildOriginClaimV1(out);
      expect(out.originClaim?.policy ?? null).toBe(built?.policy ?? null);

      expect(normalizeOriginClaimSnapshot(out)).toMatchSnapshot();
    });
  }
});
