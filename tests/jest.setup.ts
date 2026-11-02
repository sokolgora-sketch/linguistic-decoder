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

// Keep the newly integrated per-word FjaloriShqip UI request offline in Jest.
// Tests for that panel replace fetch explicitly with an API-shaped fixture.
const unguardedFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = ((input: RequestInfo | URL, init?: RequestInit) => {
  const requestUrl = typeof input === "string"
    ? input
    : input instanceof URL
      ? input.href
      : input.url;
  if (!requestUrl.startsWith("https://fjalorishqip.org/api/v1/fjala/")) {
    return unguardedFetch(input, init);
  }

  return new Promise<Response>((_resolve, reject) => {
    const signal = init?.signal ?? (input instanceof Request ? input.signal : undefined);
    const abort = () => reject(new Error("FjaloriShqip network access is disabled in Jest"));
    if (!signal || signal.aborted) {
      abort();
      return;
    }
    signal.addEventListener("abort", abort, { once: true });
  });
}) as typeof fetch;
