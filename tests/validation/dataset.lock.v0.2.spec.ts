import { readFileSync } from "node:fs";
import path from "node:path";
import { extractOrthographyVoicesFromWordV0_1 } from "../../src/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "../../src/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

type ValidationRecord = {
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
  if (Array.isArray(raw) && raw.length && typeof raw[0] === "string") return raw as string[];
  if (Array.isArray(raw) && raw.length && typeof raw[0] === "object") {
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

test("validation dataset lock v0.2 (Greek+Latin orthography + IPA tokens)", () => {
  const ds = readJson<ValidationRecord[]>("tests/validation/datasets/validation.dataset.v0.2.json");
  const trainRaw = readJson<unknown>("tests/validation/datasets/validation.train.v0.2.json");
  const holdRaw = readJson<unknown>("tests/validation/datasets/validation.holdout.v0.2.json");

  const trainIds = asIdList(trainRaw);
  const holdIds = asIdList(holdRaw);

  // invariant: ids are unique + non-empty
  const ids = ds.map((r) => r.id);
  expect(ids.length).toBe(new Set(ids).size);
  expect(ids.every(Boolean)).toBe(true);

  // invariant: splits cover all ids (no overlap)
  const splitAll = new Set([...trainIds, ...holdIds]);
  expect(splitAll.size).toBe(trainIds.length + holdIds.length);
  expect(splitAll.size).toBe(ds.length);

  // invariant: mapping must be clean for v0.2 (no unmapped vowel-like orthography, no unmapped IPA vowels)
  const badOrtho: Array<{ id: string; word: string; unmapped: string[] }> = [];
  const badIpa: Array<{ id: string; ipa: string; unmapped: string[] }> = [];

  for (const r of ds) {
    const ortho = extractOrthographyVoicesFromWordV0_1({ word: r.word, langHint: r.lang });
    if (ortho.diagnostics.unmapped.length) {
      badOrtho.push({ id: r.id, word: r.word, unmapped: ortho.diagnostics.unmapped });
    }

    if (typeof r.ipa === "string" && r.ipa.trim()) {
            const ipa = extractCarrierVoicesFromIpaV0_1(r.ipa);
      if (ipa.diagnostics.unmapped.length) {
        badIpa.push({ id: r.id, ipa: r.ipa, unmapped: ipa.diagnostics.unmapped });
      }
    }
  }

  expect(badOrtho).toEqual([]);
  expect(badIpa).toEqual([]);

  // snapshot summary (stable, human-scannable)
  const tagDist = dist(ds.map((r) => r.semanticTag)).map((x) => ({ tag: x.key, count: x.count }));
  const langDist = dist(ds.map((r) => r.lang)).map((x) => ({ lang: x.key, count: x.count }));

  expect({
    counts: { dataset: ds.length, train: trainIds.length, holdout: holdIds.length },
    langs: langDist,
    tags: tagDist,
    idsSorted: [...ids].sort(),
  }).toMatchSnapshot();
});
