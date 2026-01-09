import "@testing-library/jest-dom";

// Jest global polyfills for Next/undici in Node/CI.
// MUST run before importing anything that depends on fetch/Request/TextDecoder.

import { TextDecoder, TextEncoder } from "util";

// Ensure encoding globals exist BEFORE undici loads.
if (!globalThis.TextEncoder) {
  (globalThis as any).TextEncoder = TextEncoder;
}
if (!globalThis.TextDecoder) {
  (globalThis as any).TextDecoder = TextDecoder;
}

// Now safely import undici and attach fetch globals if missing.
import { fetch, Request, Response, Headers } from "undici";

if (!globalThis.fetch) {
  (globalThis as any).fetch = fetch;
}
if (!globalThis.Request) {
  (globalThis as any).Request = Request;
}
if (!globalThis.Response) {
  (globalThis as any).Response = Response;
}
if (!globalThis.Headers) {
  (globalThis as any).Headers = Headers;
}
