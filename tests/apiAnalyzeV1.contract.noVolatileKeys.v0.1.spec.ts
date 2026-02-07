import { NextRequest } from "next/server";
import { GET } from "@/app/api/analyze-v1/route";
import { toAnalyzeWordResultV1Contract } from "@/shared/analyzeWordResult.v1.contract";
import { normalizeForSnapshotV0_1 } from "./_helpers/snapshotNormalize.v0.1";

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

// These keys must NEVER appear in contract projection.
// If they appear, they cause drift + destroy determinism.
const BANNED_KEYS = [
  "elapsedMs",
  "durationMs",
  "timingMs",
  "timeMs",
  "ts",
  "timestamp",
  "createdAt",
  "updatedAt",
  "requestId",
  "traceId",
  "runId",
] as const;

const BANNED = new Set<string>(BANNED_KEYS as unknown as string[]);

function isPlainObject(x: unknown): x is Record<string, unknown> {
  return !!x && typeof x === "object" && !Array.isArray(x);
}

function findBannedKeyPaths(root: unknown): string[] {
  const hits: string[] = [];
  const seen = new WeakSet<object>();

  const walk = (node: unknown, path: (string | number)[]) => {
    if (node === null || node === undefined) return;

    if (Array.isArray(node)) {
      for (let i = 0; i < node.length; i++) walk(node[i], [...path, i]);
      return;
    }

    if (!isPlainObject(node)) return;

    if (seen.has(node)) return;
    seen.add(node);

    for (const [k, v] of Object.entries(node)) {
      if (BANNED.has(k)) hits.push([...path, k].join("."));
      walk(v, [...path, k]);
    }
  };

  walk(root, []);
  return hits;
}

describe("apiAnalyzeV1 — contract projection has no volatile keys (v0.1)", () => {
  jest.setTimeout(180_000);

  it("strict corpus contains zero banned volatile keys", async () => {
    const failures: string[] = [];

    for (const word of CORPUS) {
      const url =
        "http://localhost/api/analyze-v1" +
        `?word=${encodeURIComponent(word)}` +
        `&mode=strict`;

      const res = await GET(new NextRequest(url));
      expect(res.status).toBe(200);

      const json = await res.json();
      const contract = toAnalyzeWordResultV1Contract(json);

      // Apply doctrine: removes ONLY meta.created/meta.generatedAt.
      const stable = normalizeForSnapshotV0_1(contract);

      const hits = findBannedKeyPaths(stable);
      if (hits.length) {
        failures.push(`${word}: ${hits.join(", ")}`);
      }
    }

    expect(failures).toEqual([]);
  });
});
