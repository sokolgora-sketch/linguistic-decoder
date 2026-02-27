import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type Tag = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7";
type Dialect = "tr";

type Row = { id: string; word: string; dialect: Dialect; tag: Tag };

type Item = Row & {
  voices: Vowel[]; // in-order unique vowel carriers (orthography)
  primary: Vowel; // first carrier
  aperturePrimary: number;
  aperturePresenceMean: number;
};

const TAGS: Tag[] = ["v1", "v2", "v3", "v4", "v5", "v6", "v7"];

// Open -> closed (fixed meter)
const APERTURE: Record<Vowel, number> = {
  A: 1.0,
  O: 0.8,
  E: 0.6,
  "Ë": 0.5,
  U: 0.4,
  Y: 0.3,
  I: 0.1,
};

function mean(xs: number[]) {
  if (!xs.length) return NaN;
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

function pearson(xs: number[], ys: number[]) {
  if (xs.length !== ys.length || xs.length < 2) return NaN;
  const mx = mean(xs);
  const my = mean(ys);
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < xs.length; i++) {
    const a = xs[i] - mx;
    const b = ys[i] - my;
    num += a * b;
    dx += a * a;
    dy += b * b;
  }
  const den = Math.sqrt(dx * dy);
  return den ? num / den : NaN;
}

function spearman(xs: number[], ys: number[]) {
  if (xs.length !== ys.length || xs.length < 2) return NaN;

  function ranks(arr: number[]) {
    const idx = arr.map((v, i) => [v, i] as const).sort((a, b) => a[0] - b[0]);
    const out = new Array(arr.length).fill(0);
    for (let i = 0; i < idx.length; i++) out[idx[i][1]] = i + 1;
    return out;
  }

  return pearson(ranks(xs), ranks(ys));
}

// deterministic PRNG
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(xs: T[], rnd: () => number) {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
}

function fmt(x: number, d = 3) {
  if (!Number.isFinite(x)) return "NaN";
  return x.toFixed(d);
}

function parseRows(text: string): Row[] {
  const out: Row[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;

    // id word dialect tag
    const m = line.match(/^(\S+)\s+(\S+)\s+(tr)\s+(v[1-7])\s*$/u);
    if (!m) throw new Error(`Bad row format: ${line}`);

    const id = m[1];
    const word = m[2];
    const dialect = m[3] as Dialect;
    const tag = m[4] as Tag;

    if (!TAGS.includes(tag)) throw new Error(`Bad tag '${m[4]}' in row: ${line}`);
    out.push({ id, word, dialect, tag });
  }
  return out;
}

function normVowel(v: unknown): Vowel | null {
  const s = String(v ?? "").trim().toUpperCase();
  if (s === "A" || s === "E" || s === "I" || s === "O" || s === "U" || s === "Y" || s === "Ë") return s as Vowel;
  return null;
}

function uniqInOrder(xs: Vowel[]) {
  const out: Vowel[] = [];
  for (const v of xs) if (!out.includes(v)) out.push(v);
  return out;
}

function slopePvalue(params: { items: Item[]; scoreKey: "aperturePrimary" | "aperturePresenceMean"; iters: number; seed: number }) {
  const { items, scoreKey, iters, seed } = params;
  const rnd = mulberry32(seed);

  // 1..7 fixed x-axis
  const xs = [1, 2, 3, 4, 5, 6, 7];

  const obsMeans = TAGS.map((tag) => {
    const b = items.filter((x) => x.tag === tag);
    return mean(b.map((x) => x[scoreKey]));
  });

  const obsR = pearson(xs, obsMeans);
  const obsRs = spearman(xs, obsMeans);

  let geR = 0;
  let geRs = 0;

  // permute tags across items; recompute bucket means; compare |r|
  const tmp = items.map((x) => x.tag);
  for (let it = 0; it < iters; it++) {
    shuffleInPlace(tmp, rnd);

    const means = TAGS.map((tag) => {
      const scores: number[] = [];
      for (let i = 0; i < items.length; i++) {
        if (tmp[i] === tag) scores.push(items[i][scoreKey]);
      }
      return mean(scores);
    });

    const r = pearson(xs, means);
    const rs = spearman(xs, means);

    if (Number.isFinite(obsR) && Number.isFinite(r) && Math.abs(r) >= Math.abs(obsR)) geR++;
    if (Number.isFinite(obsRs) && Number.isFinite(rs) && Math.abs(rs) >= Math.abs(obsRs)) geRs++;
  }

  const pR = Number.isFinite(obsR) ? geR / iters : 1;
  const pRs = Number.isFinite(obsRs) ? geRs / iters : 1;

  return { obsMeans, obsR, obsRs, pR, pRs };
}

describe("Turkish Spectrum Pilot v0.1 — orthography slope probe (langHint=tr)", () => {
  it("writes tests/validation/out + baselines (pilot v0.1)", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/turkish.spectrum.pilot.v0.1.txt");

    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "turkish.spectrum.pilot.v0.1.md");
    const outJson = path.join(outDir, "turkish.spectrum.pilot.v0.1.json");

    const baseDir = path.join(root, "tests/validation/baselines");
    const baseMd = path.join(baseDir, "turkish.spectrum.pilot.v0.1.md");
    const baseJson = path.join(baseDir, "turkish.spectrum.pilot.v0.1.json");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    if (rows.length !== 7) throw new Error(`Expected exactly 7 rows (1 per bucket), got ${rows.length}`);

    // assert each tag exists exactly once
    for (const tag of TAGS) {
      const n = rows.filter((r) => r.tag === tag).length;
      if (n !== 1) throw new Error(`Expected exactly 1 row for ${tag}, got ${n}`);
    }

    const items: Item[] = rows.map((r) => {
      const v = extractOrthographyVoicesFromWordV0_1({ word: r.word, langHint: "tr" });

      if (Array.isArray(v.diagnostics?.unmapped) && v.diagnostics.unmapped.length) {
        throw new Error(`UNMAPPED_VOWEL_LIKE chars=${v.diagnostics.unmapped.join(",")} id=${r.id} word=${r.word}`);
      }

      const vv = uniqInOrder((Array.isArray(v.voices) ? v.voices : []).map(normVowel).filter(Boolean) as Vowel[]);
      if (!vv.length) throw new Error(`NO_VOWELS from mapper: id=${r.id} word=${r.word}`);

      // critical guard: Turkish 'y' must not become vowel voice Y when langHint=tr
      if (r.word === "yol" && vv.includes("Y")) {
        throw new Error(`TR_Y_CONSONANT violated: word=yol voices=${vv.join("→")}`);
      }

      const primary = vv[0];
      const aperturePrimary = APERTURE[primary];
      const aperturePresenceMean = mean(vv.map((x) => APERTURE[x]));
      return { ...r, voices: vv, primary, aperturePrimary, aperturePresenceMean };
    });

    fs.mkdirSync(outDir, { recursive: true });
    fs.mkdirSync(baseDir, { recursive: true });

    const ITERS = 12000;
    const SEED = 90924101;

    const buckets = TAGS.map((tag) => {
      const ys = items.filter((x) => x.tag === tag);
      return {
        tag,
        n: ys.length,
        aperturePrimary: mean(ys.map((x) => x.aperturePrimary)),
        aperturePresenceMean: mean(ys.map((x) => x.aperturePresenceMean)),
      };
    });

    const slopePrimary = slopePvalue({ items, scoreKey: "aperturePrimary", iters: ITERS, seed: (SEED ^ 0xA11CE) >>> 0 });
    const slopeMean = slopePvalue({ items, scoreKey: "aperturePresenceMean", iters: ITERS, seed: (SEED ^ 0xBADA55) >>> 0 });

    const md: string[] = [];
    md.push("# Turkish Spectrum Pilot v0.1 — orthography (langHint=tr)");
    md.push("");
    md.push("- corpus: `tests/research/turkish.spectrum.pilot.v0.1.txt`");
    md.push("- permutation iters: " + ITERS);
    md.push("- seed(base): " + SEED);
    md.push("");
    md.push("## Bucket means — ALL");
    md.push("");
    md.push("| Bucket | N | aperture(primary) | aperture(presence mean) |");
    md.push("|--------|--:|------------------:|------------------------:|");
    for (const b of buckets) {
      md.push(`| ${String(b.tag).toUpperCase()} | ${b.n} | ${fmt(b.aperturePrimary)} | ${fmt(b.aperturePresenceMean)} |`);
    }
    md.push("");
    md.push("## Slope test (bucket means vs semantic index 1..7)");
    md.push("");
    md.push("| Score | Pearson r | p (perm) | Spearman ρ | p (perm) |");
    md.push("|-------|----------:|---------:|-----------:|---------:|");
    md.push(`| aperture(primary) | ${fmt(slopePrimary.obsR)} | ${fmt(slopePrimary.pR)} | ${fmt(slopePrimary.obsRs)} | ${fmt(slopePrimary.pRs)} |`);
    md.push(`| aperture(presence mean) | ${fmt(slopeMean.obsR)} | ${fmt(slopeMean.pR)} | ${fmt(slopeMean.obsRs)} | ${fmt(slopeMean.pRs)} |`);
    md.push("");

    const json = {
      meta: {
        version: "turkish.spectrum.pilot.v0.1",
        langHint: "tr",
        corpus: "tests/research/turkish.spectrum.pilot.v0.1.txt",
        iters: ITERS,
        seedBase: SEED,
        seedPrimary: (SEED ^ 0xA11CE) >>> 0,
        seedPresence: (SEED ^ 0xBADA55) >>> 0,
      },
      buckets,
      slope: {
        primary: { r: slopePrimary.obsR, p: slopePrimary.pR, rho: slopePrimary.obsRs, pRho: slopePrimary.pRs, means: slopePrimary.obsMeans },
        presenceMean: { r: slopeMean.obsR, p: slopeMean.pR, rho: slopeMean.obsRs, pRho: slopeMean.pRs, means: slopeMean.obsMeans },
      },
      items: items.map((x) => ({
        id: x.id,
        word: x.word,
        tag: x.tag,
        voices: x.voices,
        primary: x.primary,
        aperturePrimary: x.aperturePrimary,
        aperturePresenceMean: x.aperturePresenceMean,
      })),
    };

    fs.writeFileSync(outMd, md.join("\n"), "utf8");
    fs.writeFileSync(outJson, JSON.stringify(json, null, 2) + "\n", "utf8");

    fs.writeFileSync(baseMd, md.join("\n"), "utf8");
    fs.writeFileSync(baseJson, JSON.stringify(json, null, 2) + "\n", "utf8");

    // sanity: must always be 7 buckets
    expect(buckets.length).toBe(7);
  });
});
