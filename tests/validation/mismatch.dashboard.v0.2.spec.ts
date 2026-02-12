import { readFileSync } from "node:fs";
import path from "node:path";
import { computeValidationResultsV0_2 } from "@/shared/validation/metrics.v0.2";

function readJson<T>(rel: string): T {
  const p = path.join(process.cwd(), rel);
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

type ValidationRecord = {
  id: string;
  lang: string;
  word: string;
  ipa?: string;
  semanticTag: string;
  knownEtymology: string;
  notes?: string;
};

function stablePickTopMismatches(full: any, n: number) {
  const xs = Array.isArray(full?.topMismatches) ? full.topMismatches : [];
  return xs.slice(0, n).map((x: any) => ({
    id: String(x?.id ?? ""),
    lang: String(x?.lang ?? ""),
    word: String(x?.word ?? ""),
    ortho: Array.isArray(x?.orthographyVoices) ? x.orthographyVoices.join("") : "",
    ipa: Array.isArray(x?.phoneticVoices) ? x.phoneticVoices.join("") : "",
    dist: Number(x?.distance ?? 0),
  }));
}

test("validation v0.2 dashboard snapshot (mask vs carrier)", () => {
  const all = readJson<ValidationRecord[]>("tests/validation/datasets/validation.dataset.v0.2.json");
  const out = computeValidationResultsV0_2(all) as any;

  const view = {
    dataset: {
      count: all.length,
      langs: Array.from(new Set(all.map((r) => r.lang))).sort(),
      tags: Array.from(new Set(all.map((r) => r.semanticTag))).sort(),
    },
    mismatch: out?.full?.mismatch ?? null,
    topMismatches: stablePickTopMismatches(out?.full ?? {}, 20),
    diagnostics: out?.full?.diagnostics ?? null,
  };

  expect(view).toMatchSnapshot();
});
