// Polyfill missing WHATWG globals for Jest/Node runtimes.
// Must execute BEFORE importing next/server (or any route importing next/server).

import { TextDecoder, TextEncoder } from "node:util";
import { MessageChannel, MessagePort } from "node:worker_threads";
import { ReadableStream, WritableStream, TransformStream } from "node:stream/web";
import { fetch, Headers, Request, Response } from "undici";

// TextEncoder/TextDecoder
if (!(globalThis as any).TextEncoder) (globalThis as any).TextEncoder = TextEncoder as any;
if (!(globalThis as any).TextDecoder) (globalThis as any).TextDecoder = TextDecoder as any;

// Web Streams (undici + Next internals)
if (!(globalThis as any).ReadableStream) (globalThis as any).ReadableStream = ReadableStream as any;
if (!(globalThis as any).WritableStream) (globalThis as any).WritableStream = WritableStream as any;
if (!(globalThis as any).TransformStream) (globalThis as any).TransformStream = TransformStream as any;

// MessagePort / MessageChannel (undici webidl)
if (!(globalThis as any).MessagePort) (globalThis as any).MessagePort = MessagePort as any;
if (!(globalThis as any).MessageChannel) (globalThis as any).MessageChannel = MessageChannel as any;

// fetch + Request/Response/Headers (WHATWG)
if (!(globalThis as any).fetch) (globalThis as any).fetch = fetch as any;
if (!(globalThis as any).Headers) (globalThis as any).Headers = Headers as any;
if (!(globalThis as any).Request) (globalThis as any).Request = Request as any;
if (!(globalThis as any).Response) (globalThis as any).Response = Response as any;
