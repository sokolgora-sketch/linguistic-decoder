/**
 * Build-safe analyze client used by dev scripts under src/scripts.
 * Keeps Next build green by providing the named export the script imports.
 *
 * This remains intentionally local/dev-oriented, but the base URL is now
 * explicit and configurable instead of silently hardcoded.
 */

export type AnalyzeClientInput = {
  word: string;
  mode?: "strict" | "open" | "explore" | string;
  alphabet?: string;
};

export type AnalyzeClientLegacyOptions = {
  useAi?: boolean;
  [key: string]: unknown;
};

export const DEFAULT_ANALYZE_CLIENT_BASE_URL = "http://127.0.0.1:3000";

export function resolveAnalyzeClientBaseUrl(
  env: NodeJS.ProcessEnv = process.env
): string {
  const raw = String(env.OPEN_INSTRUMENT_ANALYZE_BASE_URL ?? "").trim();
  const base = raw || DEFAULT_ANALYZE_CLIENT_BASE_URL;
  return base.replace(/\/+$/, "");
}

export function buildAnalyzeClientUrl(
  input: AnalyzeClientInput,
  baseUrl = resolveAnalyzeClientBaseUrl()
): string {
  const word = (input.word ?? "").trim();
  const mode = input.mode ?? "strict";
  const alphabet = typeof input.alphabet === "string" ? input.alphabet.trim() : "";

  const url = new URL("/api/analyze-v1", `${baseUrl}/`);
  url.searchParams.set("word", word);
  url.searchParams.set("mode", String(mode));

  if (alphabet) {
    url.searchParams.set("alphabet", alphabet);
  }

  return url.toString();
}

function toAnalyzeClientInput(
  inputOrWord: AnalyzeClientInput | string,
  mode?: AnalyzeClientInput["mode"],
  alphabet?: string,
  _legacyOptions?: AnalyzeClientLegacyOptions
): AnalyzeClientInput {
  if (typeof inputOrWord === "string") {
    return {
      word: inputOrWord,
      ...(mode != null ? { mode } : {}),
      ...(alphabet != null ? { alphabet } : {}),
    };
  }
  return inputOrWord;
}

export function analyzeClient(input: AnalyzeClientInput): Promise<any>;
export function analyzeClient(
  word: string,
  mode?: AnalyzeClientInput["mode"],
  alphabet?: string,
  legacyOptions?: AnalyzeClientLegacyOptions
): Promise<any>;
export async function analyzeClient(
  inputOrWord: AnalyzeClientInput | string,
  mode?: AnalyzeClientInput["mode"],
  alphabet?: string,
  legacyOptions?: AnalyzeClientLegacyOptions
): Promise<any> {
  const input = toAnalyzeClientInput(inputOrWord, mode, alphabet, legacyOptions);
  const url = buildAnalyzeClientUrl(input);

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `analyzeClient failed: ${res.status} ${res.statusText} ${text}`
    );
  }
  return res.json();
}
