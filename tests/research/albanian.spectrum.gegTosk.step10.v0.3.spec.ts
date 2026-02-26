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
const DIALECTS: Dialect[] = ["tosk", "geg"];

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

function uniqInOrder(vs: Vowel[]) {
  const out: Vowel[] = [];
  for (const v of vs) if (!out.includes(v)) out.push(v);
  return out;
}

function slopePvalue(params: {
  items: Item[];
  scoreKey: "aperturePrimary" | "aperturePresenceMean";
  iters: number;
  seed: number;
}) {
  const { items, scoreKey, iters, seed } = params;

  // bucket means
  const xs = [1, 2, 3, 4, 5, 6, 7];
  const obsMeans = TAGS.map((tag) => {
    const b = items.filter((x) => x.tag === tag);
    return mean(b.map((x) => x[scoreKey]));
  });

  const obsR = pearson(xs, obsMeans);
  const obsRs = spearman(xs, obsMeans);

  // permutation: shuffle tag labels across fixed score values
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

function pairKey(id: string) {
  // canonicalize T/G marker if present in id
  return id.replace(/\.([TG])\./u, ".X.");
}

describe("Albanian Spectrum Gegë vs Tosk — STEP10 v0.3 (orthography slope probe)", () => {
  it("writes STEP10 out reports; writes baselines only when STEP10 is complete", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/albanian.spectrum.gegTosk.step10.v0.3.txt");

    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "albanian.spectrum.gegTosk.step10.v0.3.md");
    const outJson = path.join(outDir, "albanian.spectrum.gegTosk.step10.v0.3.json");

    const outCompareMd = path.join(outDir, "albanian.spectrum.gegTosk.step10.v0.3.compare.md");
    const outCompareJson = path.join(outDir, "albanian.spectrum.gegTosk.step10.v0.3.compare.json");

    const outAuditMd = path.join(outDir, "albanian.spectrum.gegTosk.step10.v0.3.audit.md");
    const outAuditJson = path.join(outDir, "albanian.spectrum.gegTosk.step10.v0.3.audit.json");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const TARGET = 10;
    const ITERS = 12000;
    const SEED = 90924101;

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
      const raw = extractOrthographyVoicesFromWordV0_1({ word: r.word }).voices;
      const vs0 = (Array.isArray(raw) ? raw : []).map(normVowel).filter(Boolean) as Vowel[];
      const vs = uniqInOrder(vs0);

      if (!vs.length) throw new Error(`NO_VOWELS (orthography) id=${r.id} word=${r.word}`);

      const primary = vs[0];
      const aperturePrimary = APERTURE[primary];
      const aperturePresenceMean = mean(vs.map((v) => APERTURE[v]));

      return { ...r, voices: vs, primary, aperturePrimary, aperturePresenceMean };
    });

    // cohorts
    const cohortN7 = items.filter((x) => x.id.startsWith("agts7."));
    const cohortAll = items;

    const cohortT = items.filter((x) => x.dialect === "tosk");
    const cohortG = items.filter((x) => x.dialect === "geg");

    function bucketCounts(xs: Item[]) {
      const by: Record<string, number> = {};
      for (const tag of TAGS) {
        for (const d of DIALECTS) by[`${tag}:${d}`] = xs.filter((x) => x.tag === tag && x.dialect === d).length;
      }
      return by;
    }

    const countsAll = bucketCounts(items);

    const baselineReady = TAGS.every((tag) =>
      DIALECTS.every((d) => (countsAll[`${tag}:${d}`] ?? 0) >= TARGET)
    );

    // pairing audit
    const pairMap = new Map<string, { tosk: number; geg: number; ids: string[] }>();
    for (const it of items) {
      const k = pairKey(it.id);
      const rec = pairMap.get(k) ?? { tosk: 0, geg: 0, ids: [] };
      rec[it.dialect] += 1;
      rec.ids.push(it.id);
      pairMap.set(k, rec);
    }
    const unpaired = [...pairMap.entries()]
      .filter(([, v]) => v.tosk === 0 || v.geg === 0)
      .map(([k, v]) => ({ pairKey: k, tosk: v.tosk, geg: v.geg, ids: v.ids.slice().sort() }))
      .sort((a, b) => a.pairKey.localeCompare(b.pairKey));

    function summarize(xs: Item[]) {
      const buckets = TAGS.map((tag) => {
        const ys = xs.filter((x) => x.tag === tag);
        return {
          tag,
          n: ys.length,
          aperturePrimary: mean(ys.map((x) => x.aperturePrimary)),
          aperturePresenceMean: mean(ys.map((x) => x.aperturePresenceMean)),
        };
      });

      const sP = slopePvalue({ items: xs, scoreKey: "aperturePrimary", iters: ITERS, seed: (SEED ^ 0xA11CE) >>> 0 });
      const sM = slopePvalue({ items: xs, scoreKey: "aperturePresenceMean", iters: ITERS, seed: (SEED ^ 0xBADA55) >>> 0 });

      return { buckets, sP, sM };
    }

    const sumAll = summarize(cohortAll);
    const sumN7 = summarize(cohortN7.length ? cohortN7 : cohortAll);
    const sumT = summarize(cohortT);
    const sumG = summarize(cohortG);

    // MAIN REPORT
    const md: string[] = [];
    md.push("# Albanian Spectrum Gegë vs Tosk — STEP10 v0.3 (orthography slope probe)");
    md.push("");
    md.push(`- corpus: \`${path.relative(root, inPath)}\` (${items.length})`);
    md.push(`- target per bucket per dialect: ${TARGET}`);
    md.push(`- permutation iters: ${ITERS}`);
    md.push(`- seed(base): ${SEED}`);
    md.push(`- baseline write: ${baselineReady ? "ENABLED (TARGET reached)" : "DISABLED (scaffold incomplete)"}`);
    md.push("");
    md.push("## Power check (non-failing)");
    md.push("");
    md.push("| Bucket | Tosk N | Missing | Gegë N | Missing |");
    md.push("|--------|-------:|--------:|------:|--------:|");
    for (const tag of TAGS) {
      const nT = countsAll[`${tag}:tosk`] ?? 0;
      const nG = countsAll[`${tag}:geg`] ?? 0;
      md.push(`| ${tag.toUpperCase()} | ${nT} | ${Math.max(0, TARGET - nT)} | ${nG} | ${Math.max(0, TARGET - nG)} |`);
    }
    md.push("");

    md.push("## Pairing audit (id-derived)");
    md.push("");
    md.push(`- pairKeys: ${pairMap.size}`);
    md.push(`- unpaired pairKeys: ${unpaired.length}`);
    md.push("");

    function emitMeans(title: string, buckets: ReturnType<typeof summarize>["buckets"]) {
      md.push(`## Bucket means — ${title}`);
      md.push("");
      md.push("| Bucket | N | aperture(primary) | aperture(presence mean) |");
      md.push("|--------|--:|------------------:|------------------------:|");
      for (const b of buckets) {
        md.push(`| ${b.tag.toUpperCase()} | ${b.n} | ${fmt(b.aperturePrimary, 3)} | ${fmt(b.aperturePresenceMean, 3)} |`);
      }
      md.push("");
    }

    emitMeans("ALL", sumAll.buckets);
    emitMeans("N=7 cohort (agts7.*)", sumN7.buckets);
    emitMeans("Tosk", sumT.buckets);
    emitMeans("Gegë", sumG.buckets);

    md.push("## Slope test (bucket means vs semantic index 1..7)");
    md.push("");
    md.push("| Cohort | Score | Pearson r | p (perm) | Spearman ρ | p (perm) |");
    md.push("|--------|-------|----------:|---------:|-----------:|---------:|");

    function emitSlopeRow(cohort: string, score: string, s: { obsR: number; pR: number; obsRs: number; pRs: number }) {
      md.push(`| ${cohort} | ${score} | ${fmt(s.obsR, 3)} | ${fmt(s.pR, 3)} | ${fmt(s.obsRs, 3)} | ${fmt(s.pRs, 3)} |`);
    }

    emitSlopeRow("ALL", "aperture(primary)", sumAll.sP);
    emitSlopeRow("ALL", "aperture(presence mean)", sumAll.sM);
    emitSlopeRow("N=7", "aperture(primary)", sumN7.sP);
    emitSlopeRow("N=7", "aperture(presence mean)", sumN7.sM);
    emitSlopeRow("Tosk", "aperture(primary)", sumT.sP);
    emitSlopeRow("Tosk", "aperture(presence mean)", sumT.sM);
    emitSlopeRow("Gegë", "aperture(primary)", sumG.sP);
    emitSlopeRow("Gegë", "aperture(presence mean)", sumG.sM);
    md.push("");

    // WIDEST
    const widest = items
      .map((x) => ({ id: x.id, dialect: x.dialect, tag: x.tag.toUpperCase(), word: x.word, primary: x.primary, voices: x.voices.join(","), a_presence: x.aperturePresenceMean }))
      .sort((a, b) => b.a_presence - a.a_presence || a.id.localeCompare(b.id))
      .slice(0, 12);

    md.push("## Widest items (top 12 by presence mean)");
    md.push("");
    md.push("| id | dialect | bucket | word | primary | voices | a_presence |");
    md.push("|----|---------|--------|------|---------|--------|----------:|");
    for (const w of widest) md.push(`| ${w.id} | ${w.dialect} | ${w.tag} | ${w.word} | ${w.primary} | ${w.voices} | ${fmt(w.a_presence, 3)} |`);
    md.push("");

    md.push("## Notes");
    md.push("");
    md.push("- This harness is a **calibration probe**, not a published claim.");
    md.push("- Uses **orthography extraction SSOT** (`extractOrthographyVoicesFromWordV0_1`).");
    md.push("- Baselines are only written once STEP10 reaches target N per bucket per dialect (to avoid churn).");
    md.push("");

    // MAIN JSON
    const payload = {
      version: "v0.3",
      corpus: path.relative(root, inPath),
      iters: ITERS,
      seed: SEED,
      targetPerBucketPerDialect: TARGET,
      baselineReady,
      counts: countsAll,
      cohorts: {
        all: { n: cohortAll.length, buckets: sumAll.buckets, slope: { primary: sumAll.sP, presenceMean: sumAll.sM } },
        n7: { n: cohortN7.length, buckets: sumN7.buckets, slope: { primary: sumN7.sP, presenceMean: sumN7.sM } },
        tosk: { n: cohortT.length, buckets: sumT.buckets, slope: { primary: sumT.sP, presenceMean: sumT.sM } },
        geg: { n: cohortG.length, buckets: sumG.buckets, slope: { primary: sumG.sP, presenceMean: sumG.sM } },
      },
      pairing: { pairKeys: pairMap.size, unpairedCount: unpaired.length },
      widest_top12: widest,
    };

    // COMPARE REPORT (N=7 vs ALL)
    const cmp: string[] = [];
    cmp.push("# Albanian Spectrum Gegë vs Tosk — STEP10 compare v0.3 (N=7 vs ALL)");
    cmp.push("");
    cmp.push(`- corpus: \`${path.relative(root, inPath)}\``);
    cmp.push(`- iters: ${ITERS}`);
    cmp.push(`- seed(base): ${SEED}`);
    cmp.push(`- cohort rule: N=7 = id starts with "agts7." ; ALL = all active rows`);
    cmp.push("");

    function emitCompare(label: string, sum: ReturnType<typeof summarize>) {
      cmp.push(`## ${label}`);
      cmp.push("");
      cmp.push("| Bucket | N | aperture(primary) | aperture(presence mean) |");
      cmp.push("|--------|--:|------------------:|------------------------:|");
      for (const b of sum.buckets) {
        cmp.push(`| ${b.tag.toUpperCase()} | ${b.n} | ${fmt(b.aperturePrimary, 3)} | ${fmt(b.aperturePresenceMean, 3)} |`);
      }
      cmp.push("");
      cmp.push("| Score | Pearson r | p (perm) | Spearman ρ | p (perm) |");
      cmp.push("|-------|----------:|---------:|-----------:|---------:|");
      cmp.push(`| aperture(primary) | ${fmt(sum.sP.obsR, 3)} | ${fmt(sum.sP.pR, 3)} | ${fmt(sum.sP.obsRs, 3)} | ${fmt(sum.sP.pRs, 3)} |`);
      cmp.push(`| aperture(presence mean) | ${fmt(sum.sM.obsR, 3)} | ${fmt(sum.sM.pR, 3)} | ${fmt(sum.sM.obsRs, 3)} | ${fmt(sum.sM.pRs, 3)} |`);
      cmp.push("");
    }

    emitCompare("N=7", sumN7);
    emitCompare("ALL", sumAll);

    cmp.push("## Delta (ALL − N=7)");
    cmp.push("");
    cmp.push("| Score | Δ Pearson r | Δ p | Δ Spearman ρ | Δ p |");
    cmp.push("|-------|------------:|----:|-------------:|----:|");
    cmp.push(`| aperture(primary) | ${fmt(sumAll.sP.obsR - sumN7.sP.obsR, 3)} | ${fmt(sumAll.sP.pR - sumN7.sP.pR, 3)} | ${fmt(sumAll.sP.obsRs - sumN7.sP.obsRs, 3)} | ${fmt(sumAll.sP.pRs - sumN7.sP.pRs, 3)} |`);
    cmp.push(`| aperture(presence mean) | ${fmt(sumAll.sM.obsR - sumN7.sM.obsR, 3)} | ${fmt(sumAll.sM.pR - sumN7.sM.pR, 3)} | ${fmt(sumAll.sM.obsRs - sumN7.sM.obsRs, 3)} | ${fmt(sumAll.sM.pRs - sumN7.sM.pRs, 3)} |`);
    cmp.push("");

    const cmpPayload = {
      version: "v0.3",
      corpus: path.relative(root, inPath),
      iters: ITERS,
      seed: SEED,
      cohorts: {
        n7: { n: cohortN7.length, buckets: sumN7.buckets, slope: { primary: sumN7.sP, presenceMean: sumN7.sM } },
        all: { n: cohortAll.length, buckets: sumAll.buckets, slope: { primary: sumAll.sP, presenceMean: sumAll.sM } },
      },
    };

    // AUDIT REPORT
    const aud: string[] = [];
    aud.push("# Albanian Spectrum Gegë vs Tosk — STEP10 audit v0.3");
    aud.push("");
    aud.push(`- corpus: \`${path.relative(root, inPath)}\` (${items.length})`);
    aud.push(`- unpaired pairKeys: ${unpaired.length}`);
    aud.push("");
    aud.push("## Unpaired pairKeys (first 25)");
    aud.push("");
    aud.push("| pairKey | tosk | geg | ids |");
    aud.push("|--------|-----:|---:|-----|");
    for (const u of unpaired.slice(0, 25)) {
      aud.push(`| ${u.pairKey} | ${u.tosk} | ${u.geg} | ${u.ids.join(", ")} |`);
    }
    aud.push("");

    aud.push("## Widest overall (top 20 by presence mean)");
    aud.push("");
    aud.push("| id | dialect | bucket | word | primary | voices | a_presence |");
    aud.push("|----|---------|--------|------|---------|--------|----------:|");
    for (const w of items
      .map((x) => ({ id: x.id, dialect: x.dialect, tag: x.tag.toUpperCase(), word: x.word, primary: x.primary, voices: x.voices.join(","), a_presence: x.aperturePresenceMean }))
      .sort((a, b) => b.a_presence - a.a_presence || a.id.localeCompare(b.id))
      .slice(0, 20)) {
      aud.push(`| ${w.id} | ${w.dialect} | ${w.tag} | ${w.word} | ${w.primary} | ${w.voices} | ${fmt(w.a_presence, 3)} |`);
    }
    aud.push("");

    const audPayload = {
      version: "v0.3",
      corpus: path.relative(root, inPath),
      unpaired,
      widest_top20: items
        .map((x) => ({ id: x.id, dialect: x.dialect, tag: x.tag, word: x.word, primary: x.primary, voices: x.voices, a_presence: x.aperturePresenceMean }))
        .sort((a, b) => b.a_presence - a.a_presence || String(a.id).localeCompare(String(b.id)))
        .slice(0, 20),
    };

    // write OUT files always
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, md.join("\n") + "\n", "utf8");
    fs.writeFileSync(outJson, JSON.stringify(payload, null, 2) + "\n", "utf8");
    fs.writeFileSync(outCompareMd, cmp.join("\n") + "\n", "utf8");
    fs.writeFileSync(outCompareJson, JSON.stringify(cmpPayload, null, 2) + "\n", "utf8");
    fs.writeFileSync(outAuditMd, aud.join("\n") + "\n", "utf8");
    fs.writeFileSync(outAuditJson, JSON.stringify(audPayload, null, 2) + "\n", "utf8");

    expect(fs.existsSync(outMd)).toBe(true);

    // write BASELINES only when STEP10 complete (avoid churn)
    if (baselineReady) {
      const baseDir = path.join(root, "tests/validation/baselines");
      fs.mkdirSync(baseDir, { recursive: true });

      const baseMd = path.join(baseDir, "albanian.spectrum.gegTosk.step10.v0.3.md");
      const baseJson = path.join(baseDir, "albanian.spectrum.gegTosk.step10.v0.3.json");

      const baseCompareMd = path.join(baseDir, "albanian.spectrum.gegTosk.step10.v0.3.compare.v0.1.md");
      const baseCompareJson = path.join(baseDir, "albanian.spectrum.gegTosk.step10.v0.3.compare.v0.1.json");

      const baseAuditMd = path.join(baseDir, "albanian.spectrum.gegTosk.step10.v0.3.audit.v0.1.md");
      const baseAuditJson = path.join(baseDir, "albanian.spectrum.gegTosk.step10.v0.3.audit.v0.1.json");

      fs.writeFileSync(baseMd, md.join("\n") + "\n", "utf8");
      fs.writeFileSync(baseJson, JSON.stringify(payload, null, 2) + "\n", "utf8");
      fs.writeFileSync(baseCompareMd, cmp.join("\n") + "\n", "utf8");
      fs.writeFileSync(baseCompareJson, JSON.stringify(cmpPayload, null, 2) + "\n", "utf8");
      fs.writeFileSync(baseAuditMd, aud.join("\n") + "\n", "utf8");
      fs.writeFileSync(baseAuditJson, JSON.stringify(audPayload, null, 2) + "\n", "utf8");

      expect(fs.existsSync(baseMd)).toBe(true);
      expect(fs.existsSync(baseCompareMd)).toBe(true);
      expect(fs.existsSync(baseAuditMd)).toBe(true);
    }
  });
});
