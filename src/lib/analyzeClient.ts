/**
 * Build-safe analyze client used by dev scripts under src/scripts.
 * Keeps Next build green by providing the named export the script imports.
 *
 * This is intentionally minimal: it hits the local API route.
 */

export type AnalyzeClientInput = {
  word: string;
  mode?: "strict" | "open" | "explore" | string;
  alphabet?: string;
};

export async function analyzeClient(input: AnalyzeClientInput): Promise<any> {
  const word = (input.word ?? "").trim();
  const mode = input.mode ?? "strict";

  // If you have a different endpoint, change it here only.
  const url = `http://localhost:3000/api/analyze-v1?word=${encodeURIComponent(
    word
  )}&mode=${encodeURIComponent(String(mode))}`;

  const res = await fetch(url, { method: "GET" });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`analyzeClient failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
