import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { extractZhuyinSignalV0_1 } from "@/shared/vowels/extractZhuyinSignal.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type Tone = 1 | 2 | 3 | 4 | 5;
type Tag = "v1" | "v2" | "v3" | "v4" | "v5" | "v6" | "v7";

type Row = { id: string; hanzi: string; zhuyin: string; tag: Tag };
type Item = Row & {
  tone: Tone;
  primary: Vowel;
  voices: Vowel[];
  presMask: number; // 7-bit mask over VOX
  aperturePrimary: number;
  aperturePresenceMean: number;
};

const TAGS: Tag[] = ["v1", "v2", "v3", "v4", "v5", "v6", "v7"];
const VOX: Vowel[] = ["A", "O", "E", "Ë", "U", "Y", "I"]; // ordered open -> closed (for readability)

const APERTURE: Record<Vowel, number> = {
  A: 1.0,
  O: 0.8,
  E: 0.6,
  "Ë": 0.5,
  U: 0.4,
  Y: 0.3,
  I: 0.1,
};

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

function parseRows(text: string): Row[] {
  const out: Row[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(\S+)\s+(\S+)\s+(\S+)\s+(\S+)\s*$/u);
    if (!m) continue;
    const tag = m[4] as Tag;
    if (!TAGS.includes(tag)) throw new Error(`Bad tag '${m[4]}' in row: ${line}`);
    out.push({ id: m[1], hanzi: m[2], zhuyin: m[3], tag });
  }
  return out;
}

function bitFor(v: Vowel) {
  const i = VOX.indexOf(v);
  return i < 0 ? 0 : (1 << i);
}

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
  if (dx === 0 || dy === 0) return NaN;
  return num / Math.sqrt(dx * dy);
}

function rank(xs: number[]) {
  const pairs = xs.map((x, i) => ({ x, i })).sort((a, b) => a.x - b.x);
  const r = new Array<number>(xs.length).fill(0);
  // simple average ranks for ties
  let k = 0;
  while (k < pairs.length) {
    let j = k + 1;
    while (j < pairs.length && pairs[j].x === pairs[k].x) j++;
    const avg = (k + 1 + j) / 2; // ranks are 1-based
    for (let t = k; t < j; t++) r[pairs[t].i] = avg;
    k = j;
  }
  return r;
}

function spearman(xs: number[], ys: number[]) {
  return pearson(rank(xs), rank(ys));
}

function fmt(x: number, digits = 3) {
  if (!Number.isFinite(x)) return "NA";
  const s = x.toFixed(digits);
  // avoid "-0.000"
  return s === "-0.000" ? "0.000" : s;
}

function fmtPct(n: number, d: number) {
  if (!d) return `0.0% (0/0)`;
  return `${(100 * (n / d)).toFixed(1)}% (${n}/${d})`;
}

// permutation p-value for correlation across bucket means
function slopePvalue(opts: {
  items: Item[];
  scoreKey: "aperturePrimary" | "aperturePresenceMean";
  iters: number;
  seed: number;
}) {
  const { items, scoreKey, iters, seed } = opts;

  // observed means per bucket in fixed TAGS order
  const obsMeans = TAGS.map((tag) => mean(items.filter((x) => x.tag === tag).map((x) => x[scoreKey])));
  const xs = TAGS.map((_, i) => i + 1); // semantic axis 1..7
  const obsR = pearson(xs, obsMeans);
  const obsRs = spearman(xs, obsMeans);

  // permute tags across items (preserve bucket sizes)
  const labels = items.map((x) => x.tag);
  const rnd = mulberry32(seed);
  let geR = 0;
  let geRs = 0;

  for (let k = 0; k < iters; k++) {
    const tmp = labels.slice();
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

describe("Taiwan Spectrum Root-Only v1.0 — slope + tone diagnostics (Zhuyin)", () => {
  it("writes tests/validation/out/taiwan.spectrum.rootOnly.v1.0.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.spectrum.rootOnly.v1.0.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.spectrum.rootOnly.v1.0.md");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
      // single-character guard (hard fail)
      if ([...r.hanzi].length !== 1) throw new Error(`Non-atomic hanzi (must be 1 char): id=${r.id} hanzi=${r.hanzi}`);

      const sig = extractZhuyinSignalV0_1(r.zhuyin);

      if (![1, 2, 3, 4, 5].includes(sig.tone as any)) throw new Error(`Unexpected tone: id=${r.id} zhuyin=${r.zhuyin} tone=${sig.tone}`);
      if (sig.primary === "NONE") throw new Error(`Unexpected primary=NONE (implicit/apical?) id=${r.id} zhuyin=${r.zhuyin}`);

      const tone = sig.tone as Tone;
      const primary = sig.primary as Vowel;
      const voices = (sig.voices ?? []) as Vowel[];

      let presMask = 0;
      const uniq: Vowel[] = [];
      for (const v of voices) {
        if (!APERTURE[v]) continue;
        if (!uniq.includes(v)) uniq.push(v);
        presMask |= bitFor(v);
      }

      const aperturePrimary = APERTURE[primary];
      const aperturePresenceMean = uniq.length ? mean(uniq.map((v) => APERTURE[v])) : aperturePrimary;

      return { ...r, tone, primary, voices: uniq, presMask, aperturePrimary, aperturePresenceMean };
    });

    fs.mkdirSync(outDir, { recursive: true });

    const TARGET = 20;
    const ITERS = 12000;
    const SEED = 90924101;

    const lines: string[] = [];
    lines.push("# Taiwan Spectrum Root-Only v1.0 — slope + tone diagnostics (Zhuyin)");
    lines.push("");
    lines.push("- Purpose: measure *directionality* across 7 semantic buckets (V1→V7) using aperture + tone, not single anchors.");
    lines.push(`- corpus: \`${path.relative(root, inPath)}\` (${items.length})`);
    lines.push(`- target per bucket: ${TARGET} (power table is informational)`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");
    lines.push("## Power check (non-failing)");
    lines.push("");
    lines.push("| Bucket | N | Missing to target |");
    lines.push("|--------|--:|------------------:|");
    for (const tag of TAGS) {
      const n = items.filter((x) => x.tag === tag).length;
      lines.push(`| ${tag.toUpperCase()} | ${n} | ${Math.max(0, TARGET - n)} |`);
    }
    lines.push("");

    lines.push("## Bucket means (aperture + tone)");
    lines.push("");
    lines.push("| Bucket | N | aperture(primary) | aperture(presence mean) | tone4 | tone3 |");
    lines.push("|--------|--:|------------------:|------------------------:|------:|------:|");
    for (const tag of TAGS) {
      const b = items.filter((x) => x.tag === tag);
      const n = b.length;
      const aP = mean(b.map((x) => x.aperturePrimary));
      const aM = mean(b.map((x) => x.aperturePresenceMean));
      const t4 = b.filter((x) => x.tone === 4).length;
      const t3 = b.filter((x) => x.tone === 3).length;
      lines.push(`| ${tag.toUpperCase()} | ${n} | ${fmt(aP, 3)} | ${fmt(aM, 3)} | ${fmtPct(t4, n)} | ${fmtPct(t3, n)} |`);
    }
    lines.push("");

    const slopePrimary = slopePvalue({ items, scoreKey: "aperturePrimary", iters: ITERS, seed: (SEED ^ 0xA11CE) >>> 0 });
    const slopePresence = slopePvalue({ items, scoreKey: "aperturePresenceMean", iters: ITERS, seed: (SEED ^ 0xBADA55) >>> 0 });

    lines.push("## Slope test (bucket means vs semantic index 1..7)");
    lines.push("");
    lines.push("| Score | Pearson r | p (perm, two-sided) | Spearman ρ | p (perm, two-sided) |");
    lines.push("|-------|----------:|-------------------:|-----------:|---------------------:|");
    lines.push(`| aperture(primary) | ${fmt(slopePrimary.obsR, 3)} | ${fmt(slopePrimary.pR, 3)} | ${fmt(slopePrimary.obsRs, 3)} | ${fmt(slopePrimary.pRs, 3)} |`);
    lines.push(`| aperture(presence mean) | ${fmt(slopePresence.obsR, 3)} | ${fmt(slopePresence.pR, 3)} | ${fmt(slopePresence.obsRs, 3)} | ${fmt(slopePresence.pRs, 3)} |`);
    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push("- This harness is a **calibration probe**, not a published claim: it measures slope directionality under strict parsing.");
    lines.push("- Hard-fails on: multi-character hanzi, tone=0, primary=NONE, or unknown tag.");
    lines.push("- If Gemini/LLM provides candidates, use this harness to reject/replace failing rows until the dataset is clean.");
    lines.push("");

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");


      // ------------------------------------------------------------
      // Compare report: N=10 (base + STEP10) vs N=20 (base + STEP10 + STEP20)
      // Cohort rule: N=10 includes ids starting with "v" or "tv10." ; N=20 includes all rows.
      // ------------------------------------------------------------
      const cohortN10 = items.filter((x) => x.id.startsWith("v") || x.id.startsWith("tv10."));
      const cohortN20 = items;

      function summarize(xs: Item[]) {
        const buckets = TAGS.map((tag) => {
          const ys = xs.filter((x) => x.tag === tag);
          const n = ys.length;
          const t4 = ys.filter((x) => x.tone === 4).length;
          const t3 = ys.filter((x) => x.tone === 3).length;
          const aP = mean(ys.map((x) => x.aperturePrimary));
          const aM = mean(ys.map((x) => x.aperturePresenceMean));
          return {
            tag,
            n,
            aperturePrimary: aP,
            aperturePresenceMean: aM,
            tone4: t4,
            tone3: t3,
          };
        });

        const slopePrimary = slopePvalue({ items: xs, scoreKey: "aperturePrimary", iters: ITERS, seed: (SEED ^ 0xA11CE) >>> 0 });
const slopePresence = slopePvalue({ items: xs, scoreKey: "aperturePresenceMean", iters: ITERS, seed: (SEED ^ 0xBADA55) >>> 0 });
return { buckets, slopePrimary, slopePresence };
      }

      const s10 = summarize(cohortN10);
      const s20 = summarize(cohortN20);

      const outCompareMd = path.join(outDir, "taiwan.spectrum.rootOnly.v1.0.compare.md");
      const outCompareJson = path.join(outDir, "taiwan.spectrum.rootOnly.v1.0.compare.json");


        const outBaselineDir = path.join(root, "tests/validation/baselines");
        const baseCompareMd = path.join(outBaselineDir, "taiwan.spectrum.rootOnly.v1.0.compare.v0.1.md");
        const baseCompareJson = path.join(outBaselineDir, "taiwan.spectrum.rootOnly.v1.0.compare.v0.1.json");
      const cmp: string[] = [];
      cmp.push("# Taiwan Spectrum Root-Only v1.0 — compare N=10 vs N=20 (Zhuyin)");
      cmp.push("");
      cmp.push("- corpus: `" + path.relative(root, inPath) + "`");
      cmp.push("- permutation iters: " + ITERS);
      cmp.push("- seed(base): " + SEED);
        cmp.push("- seed_primary: " + (((SEED ^ 0xA11CE) >>> 0)));
        cmp.push("- seed_presence: " + (((SEED ^ 0xBADA55) >>> 0)));
      cmp.push('- cohort rule: N=10 = ids starting with "v" or "tv10."; N=20 = all rows.');
      cmp.push("");

      function emit(label: string, target: number, sum: ReturnType<typeof summarize>) {
        cmp.push("## " + label);
        cmp.push("");
        cmp.push("| Bucket | N | Missing to target |");
        cmp.push("|--------|--:|------------------:|");
        for (const b of sum.buckets) {
          cmp.push("| " + b.tag.toUpperCase() + " | " + b.n + " | " + Math.max(0, target - b.n) + " |");
        }
        cmp.push("");
        cmp.push("| Bucket | N | aperture(primary) | aperture(presence mean) | tone4 | tone3 |");
        cmp.push("|--------|--:|------------------:|------------------------:|------:|------:|");
        for (const b of sum.buckets) {
          cmp.push(
            "| " +
              b.tag.toUpperCase() +
              " | " +
              b.n +
              " | " +
              fmt(b.aperturePrimary, 3) +
              " | " +
              fmt(b.aperturePresenceMean, 3) +
              " | " +
              fmtPct(b.tone4, b.n) +
              " | " +
              fmtPct(b.tone3, b.n) +
              " |"
          );
        }
        cmp.push("");
        cmp.push("| Score | Pearson r | p (perm, two-sided) | Spearman ρ | p (perm, two-sided) |");
        cmp.push("|-------|----------:|-------------------:|-----------:|---------------------:|");
        cmp.push(
          "| aperture(primary) | " +
            fmt(sum.slopePrimary.obsR, 3) +
            " | " +
            fmt(sum.slopePrimary.pR, 3) +
            " | " +
            fmt(sum.slopePrimary.obsRs, 3) +
            " | " +
            fmt(sum.slopePrimary.pRs, 3) +
            " |"
        );
        cmp.push(
          "| aperture(presence mean) | " +
            fmt(sum.slopePresence.obsR, 3) +
            " | " +
            fmt(sum.slopePresence.pR, 3) +
            " | " +
            fmt(sum.slopePresence.obsRs, 3) +
            " | " +
            fmt(sum.slopePresence.pRs, 3) +
            " |"
        );
        cmp.push("");
      }

      emit("N=10 (base + STEP10)", 10, s10);
      emit("N=20 (base + STEP10 + STEP20)", 20, s20);

      cmp.push("## Delta (N20 − N10)");
      cmp.push("");
      cmp.push("| Score | Δ Pearson r | Δ p | Δ Spearman ρ | Δ p |");
      cmp.push("|-------|------------:|----:|-------------:|----:|");
      cmp.push(
        "| aperture(primary) | " +
          fmt(s20.slopePrimary.obsR - s10.slopePrimary.obsR, 3) +
          " | " +
          fmt(s20.slopePrimary.pR - s10.slopePrimary.pR, 3) +
          " | " +
          fmt(s20.slopePrimary.obsRs - s10.slopePrimary.obsRs, 3) +
          " | " +
          fmt(s20.slopePrimary.pRs - s10.slopePrimary.pRs, 3) +
          " |"
      );
      cmp.push(
        "| aperture(presence mean) | " +
          fmt(s20.slopePresence.obsR - s10.slopePresence.obsR, 3) +
          " | " +
          fmt(s20.slopePresence.pR - s10.slopePresence.pR, 3) +
          " | " +
          fmt(s20.slopePresence.obsRs - s10.slopePresence.obsRs, 3) +
          " | " +
          fmt(s20.slopePresence.pRs - s10.slopePresence.pRs, 3) +
          " |"
      );
      cmp.push("");

      fs.mkdirSync(outBaselineDir, { recursive: true });
        fs.writeFileSync(outCompareMd, cmp.join("\n"), "utf8");
        fs.writeFileSync(baseCompareMd, cmp.join("\n"), "utf8");
      function deltaBuckets(b20: any[], b10: any[]) {
        return TAGS.map((tag, i) => {
          const a = b20[i];
          const b = b10[i];
          return {
            tag,
            n10: b?.n ?? 0,
            n20: a?.n ?? 0,
            d_aperturePrimary: (a?.aperturePrimary ?? 0) - (b?.aperturePrimary ?? 0),
            d_aperturePresenceMean: (a?.aperturePresenceMean ?? 0) - (b?.aperturePresenceMean ?? 0),
            d_tone4: (a?.tone4 ?? 0) - (b?.tone4 ?? 0),
            d_tone3: (a?.tone3 ?? 0) - (b?.tone3 ?? 0),
          };
        });
      }

      const payload = {
        version: "v1.0",
        corpus: path.relative(root, inPath),
        iters: ITERS,
        seed: SEED,
          seed_primary: (SEED ^ 0xA11CE) >>> 0,
          seed_presence: (SEED ^ 0xBADA55) >>> 0,
        cohorts: {
          n10: {
            n: cohortN10.length,
            buckets: s10.buckets,
            slope: {
              primary: { pearson_r: s10.slopePrimary.obsR, p_perm: s10.slopePrimary.pR, spearman_rho: s10.slopePrimary.obsRs, p_perm_s: s10.slopePrimary.pRs },
              presenceMean: { pearson_r: s10.slopePresence.obsR, p_perm: s10.slopePresence.pR, spearman_rho: s10.slopePresence.obsRs, p_perm_s: s10.slopePresence.pRs },
            },
          },
          n20: {
            n: cohortN20.length,
            buckets: s20.buckets,
            slope: {
              primary: { pearson_r: s20.slopePrimary.obsR, p_perm: s20.slopePrimary.pR, spearman_rho: s20.slopePrimary.obsRs, p_perm_s: s20.slopePrimary.pRs },
              presenceMean: { pearson_r: s20.slopePresence.obsR, p_perm: s20.slopePresence.pR, spearman_rho: s20.slopePresence.obsRs, p_perm_s: s20.slopePresence.pRs },
            },
          },
          delta: {
            buckets: deltaBuckets(s20.buckets, s10.buckets),
            slope: {
              primary: {
                d_pearson_r: s20.slopePrimary.obsR - s10.slopePrimary.obsR,
                d_p_perm: s20.slopePrimary.pR - s10.slopePrimary.pR,
                d_spearman_rho: s20.slopePrimary.obsRs - s10.slopePrimary.obsRs,
                d_p_perm_s: s20.slopePrimary.pRs - s10.slopePrimary.pRs,
              },
              presenceMean: {
                d_pearson_r: s20.slopePresence.obsR - s10.slopePresence.obsR,
                d_p_perm: s20.slopePresence.pR - s10.slopePresence.pR,
                d_spearman_rho: s20.slopePresence.obsRs - s10.slopePresence.obsRs,
                d_p_perm_s: s20.slopePresence.pRs - s10.slopePresence.pRs,
              },
            },
          },
        },
      };

      fs.writeFileSync(outCompareJson, JSON.stringify(payload, null, 2) + "\n", "utf8");
        fs.writeFileSync(baseCompareJson, JSON.stringify(payload, null, 2) + "\n", "utf8");

      // ------------------------------------------------------------
      // Outlier audit baseline (v0.1)
      // Purpose: expose which exact rows (esp tv20.*) raise/lower bucket means.
      // Tracked outputs: tests/validation/baselines/*.audit.v0.1.(md|json)
      // ------------------------------------------------------------
      const outAuditMd = path.join(outDir, "taiwan.spectrum.rootOnly.v1.0.audit.md");
      const outAuditJson = path.join(outDir, "taiwan.spectrum.rootOnly.v1.0.audit.json");
      const baseAuditMd = path.join(outBaselineDir, "taiwan.spectrum.rootOnly.v1.0.audit.v0.1.md");
      const baseAuditJson = path.join(outBaselineDir, "taiwan.spectrum.rootOnly.v1.0.audit.v0.1.json");

      type Cohort = "n10" | "step20" | "other";
      function cohortFor(id: string): Cohort {
        if (id.startsWith("tv20.")) return "step20";
        if (id.startsWith("tv10.") || id.startsWith("v")) return "n10";
        return "other";
      }

      const auditItems = items.map((x) => ({
        id: x.id,
        cohort: cohortFor(x.id),
        tag: x.tag,
        hanzi: x.hanzi,
        zhuyin: x.zhuyin,
        tone: x.tone,
        primary: x.primary,
        voices: x.voices,
        aperturePrimary: x.aperturePrimary,
        aperturePresenceMean: x.aperturePresenceMean,
      }));

      const n10Items = auditItems.filter((x) => x.cohort === "n10");
      const step20Items = auditItems.filter((x) => x.cohort === "step20");

      function meanPresence(xs: any[]) {
        return mean(xs.map((x) => x.aperturePresenceMean));
      }

      function sortByPresenceDesc(xs: any[]) {
        return xs
          .slice()
          .sort((a, b) => (b.aperturePresenceMean - a.aperturePresenceMean) || String(a.id).localeCompare(String(b.id)));
      }

      const bucketDrift = TAGS.map((tag) => {
        const n10 = n10Items.filter((x) => x.tag === tag);
        const s20 = step20Items.filter((x) => x.tag === tag);
        const all = auditItems.filter((x) => x.tag === tag);
        const n10m = meanPresence(n10);
        const s20m = meanPresence(s20);
        const allm = meanPresence(all);
        return {
          tag,
          n10_n: n10.length,
          step20_n: s20.length,
          all_n: all.length,
          n10_presenceMean: n10m,
          step20_presenceMean: s20m,
          all_presenceMean: allm,
          d_step20_minus_n10: s20m - n10m,
          d_all_minus_n10: allm - n10m,
        };
      });

      const outliers = {
        step20_global_widest: sortByPresenceDesc(step20Items).slice(0, 12),
        step20_by_bucket_widest: Object.fromEntries(
          TAGS.map((tag) => [tag, sortByPresenceDesc(step20Items.filter((x) => x.tag === tag)).slice(0, 8)])
        ),
      };

      const auditPayload = {
        version: "v1.0",
        corpus: path.relative(root, inPath),
        n_total: auditItems.length,
        n10: { n: n10Items.length },
        step20: { n: step20Items.length },
        bucketDrift,
        outliers,
      };

      const md: string[] = [];
      md.push("# Taiwan Spectrum Root-Only v1.0 — outlier audit v0.1 (Zhuyin)");
      md.push("");
      md.push(`- corpus: \`${path.relative(root, inPath)}\``);
      md.push(`- N10 cohort: ${n10Items.length} (ids starting with "v" or "tv10.")`);
      md.push(`- STEP20 cohort: ${step20Items.length} (ids starting with "tv20.")`);
      md.push("");

      md.push("## Bucket drift (presence mean)");
      md.push("");
      md.push("| Bucket | N10 mean | STEP20 mean | ALL mean | Δ(STEP20−N10) |");
      md.push("|--------|---------:|------------:|---------:|--------------:|");
      for (const b of bucketDrift) {
        md.push(`| ${String(b.tag).toUpperCase()} | ${fmt(b.n10_presenceMean, 3)} | ${fmt(b.step20_presenceMean, 3)} | ${fmt(b.all_presenceMean, 3)} | ${fmt(b.d_step20_minus_n10, 3)} |`);
      }
      md.push("");

      md.push("## STEP20 widest global (top 12 by aperturePresenceMean)");
      md.push("");
      md.push("| id | bucket | hanzi | zhuyin | tone | primary | voices | a_presence |");
      md.push("|----|--------|-------|--------|-----:|--------|--------|----------:|");
      for (const x of outliers.step20_global_widest) {
        md.push(`| ${x.id} | ${String(x.tag).toUpperCase()} | ${x.hanzi} | ${x.zhuyin} | ${x.tone} | ${x.primary} | ${(x.voices ?? []).join(",")} | ${fmt(x.aperturePresenceMean, 3)} |`);
      }
      md.push("");

      for (const tag of TAGS) {
        md.push(`## STEP20 widest — bucket ${tag.toUpperCase()} (top 8)`);
        md.push("");
        md.push("| id | hanzi | zhuyin | tone | primary | voices | a_presence |");
        md.push("|----|-------|--------|-----:|--------|--------|----------:|");
        for (const x of outliers.step20_by_bucket_widest[tag]) {
          md.push(`| ${x.id} | ${x.hanzi} | ${x.zhuyin} | ${x.tone} | ${x.primary} | ${(x.voices ?? []).join(",")} | ${fmt(x.aperturePresenceMean, 3)} |`);
        }
        md.push("");
      }

      fs.mkdirSync(outBaselineDir, { recursive: true });
      fs.writeFileSync(outAuditMd, md.join("\n") + "\n", "utf8");
      fs.writeFileSync(baseAuditMd, md.join("\n") + "\n", "utf8");
      fs.writeFileSync(outAuditJson, JSON.stringify(auditPayload, null, 2) + "\n", "utf8");
      fs.writeFileSync(baseAuditJson, JSON.stringify(auditPayload, null, 2) + "\n", "utf8");
  });
});
