import { NextRequest } from "next/server";
import { GET } from "@/app/api/analyze-v1/route";
import { toAnalyzeWordResultV1Contract } from "@/shared/analyzeWordResult.v1.contract";

// Keep this small + representative. Expand later once stable.
const CORPUS = [
  "study",
  "father",
  "damage",
  "love",
  "sterile",
  "philosophy",
  "mathematics",
  "diet",
  "language",
  "internet",
  "gjak",
  "O'Neill",
  "co-operate",
  "naïve",
  "résumé",
  "123",
  "ë",
  "y",
] as const;

// Remove fields that are commonly non-deterministic if they ever appear.
const DROP_KEYS = new Set([
  "elapsedMs",
  "durationMs",
  "timingMs",
  "timeMs",
  "ts",
  "timestamp",
  "created",
  "generatedAt",
  "createdAt",
  "updatedAt",
  "requestId",
  "traceId",
  "runId",
]);

function normalizeForSnapshot(x: any): any {
  const seen = new WeakSet<object>();

  const walk = (v: any): any => {
    if (v === null || v === undefined) return v;

    if (Array.isArray(v)) return v.map(walk);

    if (typeof v === "object") {
      if (seen.has(v)) return "[[CYCLE]]";
      seen.add(v);

      const out: Record<string, any> = {};
      for (const k of Object.keys(v)) {
        if (DROP_KEYS.has(k)) continue;
        out[k] = walk(v[k]);
      }
      return out;
    }

    return v;
  };

  // Deep-normalize through JSON boundary to drop undefined reliably
  return JSON.parse(JSON.stringify(walk(x)));
}

describe("apiAnalyzeV1 — corpus gold (contract projection)", () => {
  jest.setTimeout(180_000);

  it("strict corpus matches snapshot", async () => {
    const out: Record<string, any> = {};

    for (const word of CORPUS) {
      const url =
        "http://localhost/api/analyze-v1" +
        `?word=${encodeURIComponent(word)}` +
        `&mode=strict`;

      const res = await GET(new NextRequest(url));
      expect(res.status).toBe(200);

      const json = await res.json();
      const contract = toAnalyzeWordResultV1Contract(json);

      out[word] = normalizeForSnapshot(contract);
    }

    expect(out).toMatchSnapshot();
  });
});
