import { readFileSync } from "node:fs";
import path from "node:path";

type ValidationRecordV01 = {
  id: string;
  lang: string;
  word: string;
  ipa?: string;
  semanticTag: string;
  knownEtymology: string;
  notes?: string;
};

function loadJson<T>(rel: string): T {
  const p = path.join(process.cwd(), "tests/validation/datasets", rel);
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

test("validation dataset lock v0.1", () => {
  const ds = loadJson<ValidationRecordV01[]>("validation.dataset.v0.1.json");
  const train = loadJson<string[]>("validation.train.v0.1.json");
  const holdout = loadJson<string[]>("validation.holdout.v0.1.json");

  // Phase-0 sanity (we will expand later)
  expect(ds).toHaveLength(10);
  expect(train).toHaveLength(8);
  expect(holdout).toHaveLength(2);

  const ids = ds.map((r) => r.id).slice().sort();
  expect(ids).toMatchSnapshot("sorted-ids");

  const tagCounts = ds.reduce<Record<string, number>>((acc, r) => {
    acc[r.semanticTag] = (acc[r.semanticTag] ?? 0) + 1;
    return acc;
  }, {});
  expect(tagCounts).toMatchSnapshot("tag-counts");

  const langCounts = ds.reduce<Record<string, number>>((acc, r) => {
    acc[r.lang] = (acc[r.lang] ?? 0) + 1;
    return acc;
  }, {});
  expect(langCounts).toMatchSnapshot("lang-counts");

  // Split integrity: every split id must exist; splits must be disjoint.
  const set = new Set(ids);
  for (const id of train) expect(set.has(id)).toBe(true);
  for (const id of holdout) expect(set.has(id)).toBe(true);

  const overlap = train.filter((id) => new Set(holdout).has(id));
  expect(overlap).toEqual([]);
});
