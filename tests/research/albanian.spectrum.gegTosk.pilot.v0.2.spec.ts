import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type Tag = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7";
type Dialect = "geg" | "tosk";

type Row = { id: string; word: string; dialect: Dialect; tag: Tag };

type Item = Row & {
  voices: Vowel[]; // in-order unique vowel carriers (orthography)
  primary: Vowel;  // first carrier
  aperturePrimary: number;
  aperturePresenceMean: number;
};

const TAGS: Tag[] = ["v1", "v2", "v3", "v4", "v5", "v6", "v7"];
const DIALECTS: Dialect[] = ["geg", "tosk"];

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
    const m = line.match(/^(\S+)\s+(\S+)\s+(geg|tosk)\s+(v[1-7])\s*$/u);
    if (!m) throw new Error(`Bad row format: ${line}`);

    const id = m[1];
    const word = m[2];
    const dialect = m[3] as Dialect;
    const tag = m[4] as Tag;

    if (!DIALECTS.includes(dialect)) throw new Error(`Bad dialect '${m[3]}' in row: ${line}`);
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

  const tagsUpper = TAGS.map((t) => t.toUpperCase());
  const obsMeans = tagsUpper.map((tag) => {
    const scores: number[] = [];
    for (const it of items) if (it.tag.toUpperCase() === tag) scores.push((it as any)[scoreKey]);
    return mean(scores);
  });

  const obsR = pearson(xs, obsMeans);
  const obsRs = spearman(xs, obsMeans);

  let geR = 0;
  let geRs = 0;

  // permute tags across items; recompute bucket means; compare |r|
  const tmp = items.map((x) => x.tag);
  for (let it = 0; it < iters; it++) {
    shuffleInPlace(tmp, rnd);

    const means = tagsUpper.map((tag) => {
      const scores: number[] = [];
      for (let i = 0; i < items.length; i++) {
        if (String(tmp[i]).toUpperCase() === tag) scores.push((items[i] as any)[scoreKey]);
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

describe("Albanian Spectrum Gegë vs Tosk Pilot v0.2 — orthography slope probe", () => {
  it("writes tests/validation/out + baselines (pilot v0.2)", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/albanian.spectrum.gegTosk.pilot.v0.2.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "albanian.spectrum.gegTosk.pilot.v0.2.md");
    const outJson = path.join(outDir, "albanian.spectrum.gegTosk.pilot.v0.2.json");

    const outBaselineDir = path.join(root, "tests/validation/baselines");
    const baseMd = path.join(outBaselineDir, "albanian.spectrum.gegTosk.pilot.v0.2.md");
    const baseJson = path.join(outBaselineDir, "albanian.spectrum.gegTosk.pilot.v0.2.json");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    if (rows.length !== 14) throw new Error(`Expected exactly 14 rows (7×2), got ${rows.length}`);

    const items: Item[] = rows.map((r) => {
      const v = extractOrthographyVoicesFromWordV0_1({ word: r.word });
      const vv = uniqInOrder((Array.isArray(v.voices) ? v.voices : []).map(normVowel).filter(Boolean) as Vowel[]);
      if (!vv.length) throw new Error(`NO_VOWELS from orthography mapper: id=${r.id} word=${r.word}`);
      const primary = vv[0];
      const aperturePrimary = APERTURE[primary];
      const aperturePresenceMean = mean(vv.map((x) => APERTURE[x]));
      return { ...r, voices: vv, primary, aperturePrimary, aperturePresenceMean };
    });

    fs.mkdirSync(outDir, { recursive: true });
    fs.mkdirSync(outBaselineDir, { recursive: true });

    const ITERS = 12000;
    const SEED = 90924101;

    function summarize(xs: Item[]) {
      return TAGS.map((tag) => {
        const ys = xs.filter((x) => x.tag === tag);
        const n = ys.length;
        return {
          tag,
          n,
          aperturePrimary: mean(ys.map((x) => x.aperturePrimary)),
          aperturePresenceMean: mean(ys.map((x) => x.aperturePresenceMean)),
        };
      });
    }

    const cohortT = items.filter((x) => x.dialect === "tosk");
    const cohortG = items.filter((x) => x.dialect === "geg");

    const sumAll = summarize(items);
    const sumT = summarize(cohortT);
    const sumG = summarize(cohortG);

    const slopeAll = {
      label: "ALL",
      sP: slopePvalue({ items, scoreKey: "aperturePrimary", iters: ITERS, seed: (SEED ^ 0xA11CE) >>> 0 }),
      sM: slopePvalue({ items, scoreKey: "aperturePresenceMean", iters: ITERS, seed: (SEED ^ 0xBADA55) >>> 0 }),
    };
    const slopeT = {
      label: "Tosk",
      sP: slopePvalue({ items: cohortT, scoreKey: "aperturePrimary", iters: ITERS, seed: (SEED ^ 0xA11CE) >>> 0 }),
      sM: slopePvalue({ items: cohortT, scoreKey: "aperturePresenceMean", iters: ITERS, seed: (SEED ^ 0xBADA55) >>> 0 }),
    };
    const slopeG = {
      label: "Gegë",
      sP: slopePvalue({ items: cohortG, scoreKey: "aperturePrimary", iters: ITERS, seed: (SEED ^ 0xA11CE) >>> 0 }),
      sM: slopePvalue({ items: cohortG, scoreKey: "aperturePresenceMean", iters: ITERS, seed: (SEED ^ 0xBADA55) >>> 0 }),
    };

    const drift = TAGS.map((tag, i) => {
      const a = sumG[i];
      const b = sumT[i];
      return {
        tag,
        nT: b?.n ?? 0,
        nG: a?.n ?? 0,
        meanT: b?.aperturePresenceMean ?? NaN,
        meanG: a?.aperturePresenceMean ?? NaN,
        d: (a?.aperturePresenceMean ?? 0) - (b?.aperturePresenceMean ?? 0),
      };
    });

    const widest = [...items]
      .sort((a, b) => (b.aperturePresenceMean - a.aperturePresenceMean) || String(a.id).localeCompare(String(b.id)))
      .slice(0, 10)
      .map((x) => ({
        id: x.id,
        dialect: x.dialect,
        tag: x.tag.toUpperCase(),
        word: x.word,
        primary: x.primary,
        voices: x.voices.join(","),
        a_presence: x.aperturePresenceMean,
      }));

    const md: string[] = [];
    md.push("# Albanian Spectrum Gegë vs Tosk Pilot v0.2 — orthography slope probe");
    md.push("");
    md.push(`- corpus: \`${path.relative(root, inPath)}\` (${items.length})`);
    md.push(`- iters: ${ITERS}`);
    md.push(`- seed(base): ${SEED}`);
    md.push("");
    md.push("## Cohorts");
    md.push("");
    md.push(`- Tosk: ${cohortT.length}`);
    md.push(`- Gegë: ${cohortG.length}`);
    md.push("");

    function emitMeans(title: string, buckets: ReturnType<typeof summarize>) {
      md.push(`## Bucket means — ${title}`);
      md.push("");
      md.push("| Bucket | N | aperture(primary) | aperture(presence mean) |");
      md.push("|--------|--:|------------------:|------------------------:|");
      for (const b of buckets) {
        md.push(`| ${b.tag.toUpperCase()} | ${b.n} | ${fmt(b.aperturePrimary, 3)} | ${fmt(b.aperturePresenceMean, 3)} |`);
      }
      md.push("");
    }

    emitMeans("ALL", sumAll);
    emitMeans("Tosk", sumT);
    emitMeans("Gegë", sumG);

    md.push("## Drift (Gegë − Tosk) — presence mean");
    md.push("");
    md.push("| Bucket | Tosk N | Gegë N | Tosk mean | Gegë mean | Δ |");
    md.push("|--------|-------:|------:|----------:|----------:|--:|");
    for (const d of drift) {
      md.push(`| ${d.tag.toUpperCase()} | ${d.nT} | ${d.nG} | ${fmt(d.meanT, 3)} | ${fmt(d.meanG, 3)} | ${fmt(d.d, 3)} |`);
    }
    md.push("");

    md.push("## Slope test (bucket means vs semantic index 1..7)");
    md.push("");
    md.push("| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |");
    md.push("|--------|-------|----------:|---------:|-----------:|---------:|");

    function emitSlopeRow(cohort: string, score: string, s: { obsR: number; pR: number; obsRs: number; pRs: number }) {
      md.push(`| ${cohort} | ${score} | ${fmt(s.obsR, 3)} | ${fmt(s.pR, 3)} | ${fmt(s.obsRs, 3)} | ${fmt(s.pRs, 3)} |`);
    }

    for (const blk of [slopeAll, slopeT, slopeG]) {
      emitSlopeRow(blk.label, "aperture(primary)", blk.sP);
      emitSlopeRow(blk.label, "aperture(presence mean)", blk.sM);
    }
    md.push("");

    md.push("## Widest items (top 10 by presence mean)");
    md.push("");
    md.push("| id | dialect | bucket | word | primary | voices | a_presence |");
    md.push("|----|---------|--------|------|---------|--------|----------:|");
    for (const w of widest) {
      md.push(`| ${w.id} | ${w.dialect} | ${w.tag} | ${w.word} | ${w.primary} | ${w.voices} | ${fmt(w.a_presence, 3)} |`);
    }
    md.push("");

    md.push("## Notes");
    md.push("");
    md.push("- This is a **pilot probe**, not a published claim.");
    md.push("- Dialect labels are **research labels**; verify word pairs and replace as needed.");
    md.push("- Uses **orthography extraction SSOT** (`extractOrthographyVoicesFromWordV0_1`).");
    md.push("");

    const payload = {
      version: "v0.2",
      corpus: path.relative(root, inPath),
      iters: ITERS,
      seed: SEED,
      cohorts: {
        all: { n: items.length, buckets: sumAll, slope: slopeAll },
        tosk: { n: cohortT.length, buckets: sumT, slope: slopeT },
        geg: { n: cohortG.length, buckets: sumG, slope: slopeG },
      },
      drift_presenceMean: drift,
      widest_top10: widest,
    };

    fs.writeFileSync(outMd, md.join("\n") + "\n", "utf8");
    fs.writeFileSync(baseMd, md.join("\n") + "\n", "utf8");
    fs.writeFileSync(outJson, JSON.stringify(payload, null, 2) + "\n", "utf8");
    fs.writeFileSync(baseJson, JSON.stringify(payload, null, 2) + "\n", "utf8");

    expect(fs.existsSync(outMd)).toBe(true);
    expect(fs.existsSync(baseMd)).toBe(true);
    expect(fs.existsSync(baseJson)).toBe(true);
  });
});
