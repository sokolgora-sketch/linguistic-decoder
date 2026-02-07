import { NextRequest } from "next/server";
import { normalizeForSnapshotV0_1 } from "./_helpers/snapshotNormalize.v0.1";
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

// Doctrine v0.1: normalize ONLY meta.created / meta.generatedAt via normalizeForSnapshotV0_1.
// Any other volatile fields must be removed/fixed at the source (contract projection), not normalized away.

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

      out[word] = normalizeForSnapshotV0_1(contract);
}

    expect(out).toMatchSnapshot();
});
});
