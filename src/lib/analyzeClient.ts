/**
 * ZË-RO API client (v1)
 * - Centralizes /api/analyze calls (GET or POST)
 * - Normalizes error handling so UI doesn't get random HTML/404 payloads
 */

export type AnalyzeClientMethod = "GET" | "POST";

export class AnalyzeClientError extends Error {
  kind:
    | "EMPTY_WORD"
    | "HTTP_ERROR"
    | "INVALID_JSON"
    | "API_ERROR"
    | "NETWORK_ERROR";
  status?: number;
  details?: unknown;

  constructor(
    kind: AnalyzeClientError["kind"],
    message: string,
    opts?: { status?: number; details?: unknown }
  ) {
    super(message);
    this.name = "AnalyzeClientError";
    this.kind = kind;
    this.status = opts?.status;
    this.details = opts?.details;
  }
}

async function readResponseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return await res.json();
    } catch (e) {
      throw new AnalyzeClientError("INVALID_JSON", "Response JSON parse failed.", {
        status: res.status,
        details: String(e),
      });
    }
  }
  // Fallback: could be HTML (e.g., Next.js 404 page)
  return await res.text();
}

export async function analyzeWordApiV1(
  word: string,
  opts?: {
    method?: AnalyzeClientMethod;
    baseUrl?: string; // optional absolute origin for server-side usage
    signal?: AbortSignal;
  }
): Promise<unknown> {
  const clean = (word ?? "").trim();
  if (!clean) {
    throw new AnalyzeClientError("EMPTY_WORD", 'Missing "word".');
  }

  const method: AnalyzeClientMethod = opts?.method ?? "POST";
  const base = (opts?.baseUrl ?? "").replace(/\/+$/, "");
  const endpoint =
    method === "GET"
      ? `${base}/api/analyze?word=${encodeURIComponent(clean)}`
      : `${base}/api/analyze`;

  try {
    const res =
      method === "GET"
        ? await fetch(endpoint, { method: "GET", signal: opts?.signal })
        : await fetch(endpoint, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ word: clean }),
            signal: opts?.signal,
          });

    const body = await readResponseBody(res);

    if (!res.ok) {
      // Your route returns { error: string } on 400s; also catch HTML 404s
      const apiError =
        typeof body === "object" && body !== null && "error" in body
          ? (body as any).error
          : undefined;

      throw new AnalyzeClientError(
        "HTTP_ERROR",
        apiError
          ? String(apiError)
          : `Request failed (${res.status}). Unexpected response.`,
        { status: res.status, details: body }
      );
    }

    // If server ever returns { error } with 200 (shouldn't), still guard
    if (typeof body === "object" && body !== null && "error" in body) {
      throw new AnalyzeClientError(
        "API_ERROR",
        String((body as any).error),
        { status: res.status, details: body }
      );
    }

    return body;
  } catch (e: any) {
    if (e instanceof AnalyzeClientError) throw e;
    throw new AnalyzeClientError(
      "NETWORK_ERROR",
      "Network/client error calling /api/analyze.",
      { details: String(e) }
    );
  }
}
