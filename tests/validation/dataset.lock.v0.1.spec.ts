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

function readJson<T>(rel: string): T {
  const p = path.join(process.cwd(), rel);
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

function asIdList(raw: unknown): string[] {
  // split can be ["id1","id2"] or full records
  if (Array.isArray(raw) && raw.length && typeof raw[0] === "string") return raw as string[];
  if (Array.isArray(raw) && raw.length && typeof (raw as any)[0] === "object") {
    return (raw as Array<{ id?: unknown }>).map((r) => String(r.id ?? "")).filter(Boolean);
  }
  return [];
}

function dist(items: string[]): Array<{ key: string; count: number }> {
  const m: Record<string, number> = {};
  for (const k of items) m[k] = (m[k] || 0) + 1;
  return Object.entries(m)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => (b.count - a.count) || (a.key < b.key ? -1 : a.key > b.key ? 1 : 0));
}

test("validation dataset lock v0.1 (invariants + snapshot)", () => {
  const ds = readJson<ValidationRecordV01[]>("tests/validation/datasets/validation.dataset.v0.1.json");
  const trainRaw = readJson<unknown>("tests/validation/datasets/validation.train.v0.1.json");
  const holdRaw = readJson<unknown>("tests/validation/datasets/validation.holdout.v0.1.json");

  // basic schema sanity
  expect(Array.isArray(ds)).toBe(true);
  expect(ds.length).toBeGreaterThanOrEqual(5);

  for (const r of ds) {
    expect(typeof r.id).toBe("string");
    expect(r.id.length).toBeGreaterThan(3);
    expect(typeof r.lang).toBe("string");
    expect(r.lang.length).toBeGreaterThanOrEqual(2);
    expect(typeof r.word).toBe("string");
    expect(r.word.length).toBeGreaterThan(0);
    expect(typeof r.semanticTag).toBe("string");
    expect(r.semanticTag.length).toBeGreaterThan(0);
    expect(typeof r.knownEtymology).toBe("string");
  }

  // ids must be unique + stable sorted snapshot
  const ids = ds.map((r) => r.id).slice().sort((a, b) => a.localeCompare(b));
  expect(new Set(ids).size).toBe(ids.length);

  const trainIds = asIdList(trainRaw).slice().sort((a, b) => a.localeCompare(b));
  const holdIds = asIdList(holdRaw).slice().sort((a, b) => a.localeCompare(b));

  // splits must be disjoint and cover dataset exactly
  const trainSet = new Set(trainIds);
  const holdSet = new Set(holdIds);
  for (const id of trainIds) expect(holdSet.has(id)).toBe(false);
  for (const id of holdIds) expect(trainSet.has(id)).toBe(false);

  const union = new Set([...trainIds, ...holdIds]);
  expect(union.size).toBe(ids.length);
  for (const id of ids) expect(union.has(id)).toBe(true);

  // distributions snapshot (stable + falsifiable)
  const tagDist = dist(ds.map((r) => r.semanticTag));
  const langDist = dist(ds.map((r) => r.lang));

  expect({
    counts: { dataset: ds.length, train: trainIds.length, holdout: holdIds.length },
    ids,
    trainIds,
    holdIds,
    tagDist,
    langDist,
  }).toMatchSnapshot();
});
