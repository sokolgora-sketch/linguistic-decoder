/**
 * WHATWG globals shim for Jest (Node runtime).
 * CRITICAL: use CommonJS so we can require("undici") AFTER setting globals.
 */

const util = require("node:util");
const web = require("node:stream/web");
const wt = require("node:worker_threads");

// TextEncoder/TextDecoder (must exist before undici loads)
if (!globalThis.TextEncoder) globalThis.TextEncoder = util.TextEncoder;
if (!globalThis.TextDecoder) globalThis.TextDecoder = util.TextDecoder;

// Web Streams (undici + Next internals)
if (!globalThis.ReadableStream) globalThis.ReadableStream = web.ReadableStream;
if (!globalThis.WritableStream) globalThis.WritableStream = web.WritableStream;
if (!globalThis.TransformStream) globalThis.TransformStream = web.TransformStream;

// MessagePort / MessageChannel (undici webidl)
if (!globalThis.MessagePort) globalThis.MessagePort = wt.MessagePort;
if (!globalThis.MessageChannel) globalThis.MessageChannel = wt.MessageChannel;

// Now load undici safely (AFTER TextEncoder exists)
const undici = require("undici");

if (!globalThis.fetch) globalThis.fetch = undici.fetch;
if (!globalThis.Headers) globalThis.Headers = undici.Headers;
if (!globalThis.Request) globalThis.Request = undici.Request;
if (!globalThis.Response) globalThis.Response = undici.Response;
