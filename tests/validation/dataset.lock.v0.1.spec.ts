import { readFileSync } from "node:fs";
import path from "node:path";
import { mapVowelsV0_1 } from "../../src/shared/vowels/mapVowels.v0.1";
import { parseIpaVowelsV0_1 } from "../../src/shared/vowels/parseIpaVowels.v0.1";

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

function fnv1a32(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

test("validation dataset lock v0.1 (invariants + snapshot)", () => {
  const ds = readJson<ValidationRecordV01[]>("tests/validation/datasets/validation.dataset.v0.1.json");
  const trainRaw = readJson<unknown>("tests/validation/datasets/validation.train.v0.1.json");
  const holdRaw = readJson<unknown>("tests/validation/datasets/validation.holdout.v0.1.json");

  // sorted ids are the canonical order for hashing + snapshots
  const ids = ds.map((r) => String(r?.id ?? "")).filter(Boolean).slice().sort((a, b) => a.localeCompare(b));
  const trainIds = asIdList(trainRaw).slice().sort((a, b) => a.localeCompare(b));
  const holdIds = asIdList(holdRaw).slice().sort((a, b) => a.localeCompare(b));

  // schema sanity
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
    expect(r.knownEtymology.length).toBeGreaterThan(0);

    // v0.1 expects IPA present (latin-only dataset, but IPA always provided)
    expect(typeof r.ipa).toBe("string");
    expect(String(r.ipa ?? "").trim().length).toBeGreaterThan(0);
  }

  // invariant: ids unique
  expect(new Set(ids).size).toBe(ids.length);

  // invariant: splits disjoint + cover dataset exactly
  const trainSet = new Set(trainIds);
  const holdSet = new Set(holdIds);
  for (const id of trainIds) expect(holdSet.has(id)).toBe(false);
  for (const id of holdIds) expect(trainSet.has(id)).toBe(false);

  const union = new Set([...trainIds, ...holdIds]);
  expect(union.size).toBe(ids.length);
  for (const id of ids) expect(union.has(id)).toBe(true);

  // invariant: split must equal hash-split (80/20) used by scripts/validation.dataset.split.v0.1.mjs
  const expectedTrainIds: string[] = [];
  const expectedHoldIds: string[] = [];
  for (const id of ids) {
    const h = fnv1a32(id);
    (h % 10 < 8 ? expectedTrainIds : expectedHoldIds).push(id);
  }

  expect(trainIds).toEqual(expectedTrainIds);
  expect(holdIds).toEqual(expectedHoldIds);

  // invariant: mapping must be clean for v0.1 (no unmapped vowel-like orthography, no unmapped IPA vowels)
  const badOrtho: Array<{ id: string; word: string; unmapped: string[] }> = [];
  const badIpa: Array<{ id: string; ipa: string; unmapped: string[] }> = [];

  for (const r of ds) {
    const ortho = mapVowelsV0_1({ word: r.word, langHint: r.lang });
    if (ortho.diagnostics.unmapped.length) {
      badOrtho.push({ id: r.id, word: r.word, unmapped: ortho.diagnostics.unmapped });
    }

    const ipa = parseIpaVowelsV0_1(String(r.ipa ?? ""));
    if (ipa.diagnostics.unmapped.length) {
      badIpa.push({ id: r.id, ipa: String(r.ipa ?? ""), unmapped: ipa.diagnostics.unmapped });
    }
  }

  expect(badOrtho).toEqual([]);
  expect(badIpa).toEqual([]);

  // snapshot summary (stable + human-scannable)
  const tagDist = dist(ds.map((r) => r.semanticTag)).map((x) => ({ tag: x.key, count: x.count }));
  const langDist = dist(ds.map((r) => r.lang)).map((x) => ({ lang: x.key, count: x.count }));

  expect({
    counts: { dataset: ds.length, train: trainIds.length, holdout: holdIds.length },
    trainIds,
    holdoutIds: holdIds,
    langs: langDist,
    tags: tagDist,
    idsSorted: ids,
  }).toMatchSnapshot();
});
