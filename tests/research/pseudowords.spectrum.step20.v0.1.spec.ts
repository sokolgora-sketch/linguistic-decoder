import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type Tag = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7";
type Dialect = "pw";

type Row = { id: string; word: string; dialect: Dialect; tag: Tag };

type Item = Row & {
  voices: Vowel[]; // in-order unique vowel carriers (orthography)
  primary: Vowel; // first carrier
  aperturePrimary: number;
  aperturePresenceMean: number;
};

const TAGS: Tag[] = ["v1", "v2", "v3", "v4", "v5", "v6", "v7"];

// Open -> closed (same readability order used elsewhere)
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
    const m = line.match(/^(\S+)\s+(\S+)\s+(pw)\s+(v[1-7])\s*$/u);
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

function uniqInOrder(vs: Vowel[]) {
  const out: Vowel[] = [];
  for (const v of vs) if (!out.includes(v)) out.push(v);
  return out;
}

function slopePvalue(params: { items: Item[]; scoreKey: "aperturePrimary" | "aperturePresenceMean"; iters: number; seed: number }) {
  const { items, scoreKey, iters, seed } = params;

  const xs = [1, 2, 3, 4, 5, 6, 7];
  const obsMeans = TAGS.map((tag) => {
    const b = items.filter((x) => x.tag === tag);
    return mean(b.map((x) => x[scoreKey]));
  });

  const obsR = pearson(xs, obsMeans);
  const obsRs = spearman(xs, obsMeans);

  const tags = items.map((x) => x.tag);
  const rnd = mulberry32(seed);

  let geR = 0;
  let geRs = 0;

  for (let it = 0; it < iters; it++) {
    const tmp = tags.slice();
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

function absDelta(a: number, b: number) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) return NaN;
  return Math.abs(b) - Math.abs(a);
}

describe("Pseudowords Spectrum — STEP20 v0.1 (orthography slope probe; negative control)", () => {
  it("writes STEP20 out reports; writes baselines only when STEP20 is complete; writes compare when complete", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/pseudowords.spectrum.step20.v0.1.txt");

    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "pseudowords.spectrum.step20.v0.1.md");
    const outJson = path.join(outDir, "pseudowords.spectrum.step20.v0.1.json");

    const baseDir = path.join(root, "tests/validation/baselines");
    const baseMd = path.join(baseDir, "pseudowords.spectrum.step20.v0.1.md");
    const baseJson = path.join(baseDir, "pseudowords.spectrum.step20.v0.1.json");

    const cmpOutMd = path.join(outDir, "pseudowords.spectrum.step20.v0.1.compare.v0.1.md");
    const cmpOutJson = path.join(outDir, "pseudowords.spectrum.step20.v0.1.compare.v0.1.json");
    const cmpBaseMd = path.join(baseDir, "pseudowords.spectrum.step20.v0.1.compare.v0.1.md");
    const cmpBaseJson = path.join(baseDir, "pseudowords.spectrum.step20.v0.1.compare.v0.1.json");

    const step10BaseJson = path.join(baseDir, "pseudowords.spectrum.step10.v0.1.json");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const TARGET = 20;
    const ITERS = 12000;
    const SEED = 90924101;

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
      const raw = extractOrthographyVoicesFromWordV0_1({ word: r.word }).voices;
      const vs0 = (Array.isArray(raw) ? raw : []).map(normVowel).filter(Boolean) as Vowel[];
      const vs = uniqInOrder(vs0);

      if (!vs.length) throw new Error(`NO_VOWELS (orthography; pseudowords) id=${r.id} word=${r.word}`);

      const primary = vs[0];
      const aperturePrimary = APERTURE[primary];
      const aperturePresenceMean = mean(vs.map((v) => APERTURE[v]));

      return { ...r, voices: vs, primary, aperturePrimary, aperturePresenceMean };
    });

    // counts per bucket
    const counts = TAGS.map((tag) => ({
      tag,
      n: items.filter((x) => x.tag === tag).length,
    }));

    const baselineReady = counts.every((c) => c.n >= TARGET);

    function summarize(xs: Item[]) {
      return TAGS.map((tag) => {
        const ys = xs.filter((x) => x.tag === tag);
        return {
          tag,
          n: ys.length,
          aperturePrimary: mean(ys.map((x) => x.aperturePrimary)),
          aperturePresenceMean: mean(ys.map((x) => x.aperturePresenceMean)),
        };
      });
    }

    const sumAll = summarize(items);

    const slopeAll = {
      label: "ALL",
      sP: slopePvalue({ items, scoreKey: "aperturePrimary", iters: ITERS, seed: (SEED ^ 0xA11CE) >>> 0 }),
      sM: slopePvalue({ items, scoreKey: "aperturePresenceMean", iters: ITERS, seed: (SEED ^ 0xBADA55) >>> 0 }),
    };

    // MD report
    fs.mkdirSync(outDir, { recursive: true });
    fs.mkdirSync(baseDir, { recursive: true });

    const md: string[] = [];
    md.push(`# Pseudowords Spectrum — STEP20 v0.1`);
    md.push("");
    md.push(`- purpose: negative control (no semantic intent; bucket assignment independent of aperture)`);
    md.push(`- corpus: \`tests/research/pseudowords.spectrum.step20.v0.1.txt\``);
    md.push(`- permutation iters: ${ITERS}`);
    md.push(`- seed(base): ${SEED}`);
    md.push(`- baseline write: ${baselineReady ? "ENABLED (TARGET reached)" : "DISABLED (scaffold incomplete)"}`);
    md.push("");

    md.push("## Bucket counts (TARGET=20 per bucket)");
    md.push("");
    md.push("| Bucket | N | Missing to target |");
    md.push("|--------|--:|------------------:|");
    for (const c of counts) {
      const tagU = c.tag.toUpperCase();
      md.push(`| ${tagU} | ${c.n} | ${Math.max(0, TARGET - c.n)} |`);
    }
    md.push("");

    md.push("## Bucket means — ALL");
    md.push("");
    md.push("| Bucket | N | aperture(primary) | aperture(presence mean) |");
    md.push("|--------|--:|------------------:|------------------------:|");
    for (const b of sumAll) {
      md.push(`| ${b.tag.toUpperCase()} | ${b.n} | ${fmt(b.aperturePrimary, 3)} | ${fmt(b.aperturePresenceMean, 3)} |`);
    }
    md.push("");

    md.push("## Slope test (bucket means vs semantic index 1..7)");
    md.push("");
    md.push("| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |");
    md.push("|--------|-------|----------:|---------:|-----------:|---------:|");
    md.push(
      `| ${slopeAll.label} | aperture(primary) | ${fmt(slopeAll.sP.obsR, 3)} | ${fmt(slopeAll.sP.pR, 3)} | ${fmt(
        slopeAll.sP.obsRs,
        3
      )} | ${fmt(slopeAll.sP.pRs, 3)} |`
    );
    md.push(
      `| ${slopeAll.label} | aperture(presence mean) | ${fmt(slopeAll.sM.obsR, 3)} | ${fmt(slopeAll.sM.pR, 3)} | ${fmt(
        slopeAll.sM.obsRs,
        3
      )} | ${fmt(slopeAll.sM.pRs, 3)} |`
    );
    md.push("");

    fs.writeFileSync(outMd, md.join("\n"), "utf8");

    // JSON report
    const j = {
      version: "pseudowords.spectrum.step20.v0.1",
      corpus: "tests/research/pseudowords.spectrum.step20.v0.1.txt",
      iters: ITERS,
      seed: SEED,
      baselineReady,
      cohorts: {
        all: {
          buckets: sumAll.map((b) => ({
            tag: b.tag,
            n: b.n,
            aperturePrimary: b.aperturePrimary,
            aperturePresenceMean: b.aperturePresenceMean,
          })),
          slope: {
            sP: slopeAll.sP,
            sM: slopeAll.sM,
          },
        },
      },
    };
    fs.writeFileSync(outJson, JSON.stringify(j, null, 2) + "\n", "utf8");

    // Baselines only when complete
    if (baselineReady) {
      fs.writeFileSync(baseMd, md.join("\n"), "utf8");
      fs.writeFileSync(baseJson, JSON.stringify(j, null, 2) + "\n", "utf8");
    }

    // Compare (STEP10 baseline -> STEP20 current) only when STEP20 complete and STEP10 baseline exists
    if (baselineReady && fs.existsSync(step10BaseJson)) {
      const base10 = JSON.parse(fs.readFileSync(step10BaseJson, "utf8"));

      const s10P = base10?.cohorts?.all?.slope?.sP ?? null;
      const s10M = base10?.cohorts?.all?.slope?.sM ?? null;

      const s20P = j?.cohorts?.all?.slope?.sP ?? null;
      const s20M = j?.cohorts?.all?.slope?.sM ?? null;

      const cmpMd: string[] = [];
      cmpMd.push(`# Pseudowords Spectrum — STEP10→STEP20 compare v0.1`);
      cmpMd.push("");
      cmpMd.push(`- step10 baseline: \`tests/validation/baselines/pseudowords.spectrum.step10.v0.1.json\``);
      cmpMd.push(`- step20 corpus: \`tests/research/pseudowords.spectrum.step20.v0.1.txt\``);
      cmpMd.push("");

      cmpMd.push("## Slope test (bucket means vs semantic index 1..7)");
      cmpMd.push("");
      cmpMd.push("| Score | STEP10 r | p | STEP20 r | p | STEP10 ρ | p | STEP20 ρ | p |");
      cmpMd.push("|-------|---------:|--:|---------:|--:|---------:|--:|---------:|--:|");

      function row(label: string, s10: any, s20: any) {
        const r10 = Number(s10?.obsR);
        const p10 = Number(s10?.pR);
        const r20 = Number(s20?.obsR);
        const p20 = Number(s20?.pR);
        const rho10 = Number(s10?.obsRs);
        const prho10 = Number(s10?.pRs);
        const rho20 = Number(s20?.obsRs);
        const prho20 = Number(s20?.pRs);
        cmpMd.push(
          `| ${label} | ${fmt(r10, 3)} | ${fmt(p10, 3)} | ${fmt(r20, 3)} | ${fmt(p20, 3)} | ${fmt(rho10, 3)} | ${fmt(
            prho10,
            3
          )} | ${fmt(rho20, 3)} | ${fmt(prho20, 3)} |`
        );
      }

      row("aperture(primary)", s10P, s20P);
      row("aperture(presence mean)", s10M, s20M);
      cmpMd.push("");

      cmpMd.push("## Absolute strength (|r|, |ρ|) and deltas");
      cmpMd.push("");
      cmpMd.push("| Score | |r| STEP10 | |r| STEP20 | Δ|r| | |ρ| STEP10 | |ρ| STEP20 | Δ|ρ| |");
      cmpMd.push("|-------|----------:|----------:|----:|-----------:|----------:|----:|");

      function rowAbs(label: string, s10: any, s20: any) {
        const r10 = Number(s10?.obsR);
        const r20 = Number(s20?.obsR);
        const rho10 = Number(s10?.obsRs);
        const rho20 = Number(s20?.obsRs);
        cmpMd.push(
          `| ${label} | ${fmt(Math.abs(r10), 3)} | ${fmt(Math.abs(r20), 3)} | ${fmt(absDelta(r10, r20), 3)} | ${fmt(
            Math.abs(rho10),
            3
          )} | ${fmt(Math.abs(rho20), 3)} | ${fmt(absDelta(rho10, rho20), 3)} |`
        );
      }

      rowAbs("aperture(primary)", s10P, s20P);
      rowAbs("aperture(presence mean)", s10M, s20M);
      cmpMd.push("");

      const cmp = {
        version: "pseudowords.spectrum.step20.v0.1.compare.v0.1",
        step10: { baselineJson: "tests/validation/baselines/pseudowords.spectrum.step10.v0.1.json" },
        step20: { corpus: "tests/research/pseudowords.spectrum.step20.v0.1.txt", baselineReady: true },
        slopes: {
          step10: { sP: s10P, sM: s10M },
          step20: { sP: s20P, sM: s20M },
        },
      };

      fs.writeFileSync(cmpOutMd, cmpMd.join("\n"), "utf8");
      fs.writeFileSync(cmpOutJson, JSON.stringify(cmp, null, 2) + "\n", "utf8");

      // lock compare baseline
      fs.writeFileSync(cmpBaseMd, cmpMd.join("\n"), "utf8");
      fs.writeFileSync(cmpBaseJson, JSON.stringify(cmp, null, 2) + "\n", "utf8");
    }
  });
});
