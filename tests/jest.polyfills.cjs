// Runs before any test files. Keep this file CommonJS so ordering is real.

const { TextDecoder, TextEncoder } = require("util");

// WHATWG Streams (needed by undici in Jest/jsdom)
try {
  const webStreams = require("stream/web");
  if (!globalThis.ReadableStream && webStreams.ReadableStream) {
    globalThis.ReadableStream = webStreams.ReadableStream;
  }
  if (!globalThis.WritableStream && webStreams.WritableStream) {
    globalThis.WritableStream = webStreams.WritableStream;
  }
  if (!globalThis.TransformStream && webStreams.TransformStream) {
    globalThis.TransformStream = webStreams.TransformStream;
  }
} catch {
  // ignore
}

// MessagePort (needed by undici WebIDL)
// IMPORTANT: do NOT polyfill MessageChannel in Jest.
// If MessageChannel exists, React scheduler may use it and keep ports open.
try {
  const wt = require("worker_threads");
  if (!globalThis.MessagePort && wt.MessagePort) {
    globalThis.MessagePort = wt.MessagePort;
  }
} catch {
  // ignore
}

// Encoding globals MUST exist before undici loads.
if (!globalThis.TextEncoder) globalThis.TextEncoder = TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = TextDecoder;

// Now it's safe to load undici.
const undici = require("undici");

// Provide fetch globals if Node/JSDOM doesn't.
if (!globalThis.fetch) globalThis.fetch = undici.fetch;
if (!globalThis.Request) globalThis.Request = undici.Request;
if (!globalThis.Response) globalThis.Response = undici.Response;
if (!globalThis.Headers) globalThis.Headers = undici.Headers;