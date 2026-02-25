import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { extractCarrierVoicesFromZhuyinV0_1 } from "@/shared/vowels/extractCarrierVoicesFromZhuyin.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type Primary = Vowel | "NONE";

type Row = { id: string; hanzi: string; zhuyin: string; tag: string };
type Item = Row & { voices: Vowel[]; primary: Primary };

const VOX: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];

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
    out.push({ id: m[1], hanzi: m[2], zhuyin: m[3], tag: m[4] });
  }
  return out;
}

function pct(x: number) {
  return (x * 100).toFixed(1) + "%";
}

function fmtP(p: number) {
  if (p === 0) return "<0.001";
  return p.toFixed(3);
}

// Two-sided permutation test on Δ = rate(tag,v) - rate(ctrl,v)
// Null: labels (tag vs control) exchangeable across combined set (non-NONE only).
function enrichPvalue(tagItems: Item[], ctrlItems: Item[], v: Vowel, iters: number, seed: number) {
  const tag = tagItems.filter((x) => x.primary !== "NONE");
  const ctl = ctrlItems.filter((x) => x.primary !== "NONE");
  const nt = tag.length;
  const nc = ctl.length;
  if (!nt || !nc) return { nt, nc, tObs: 0, cObs: 0, delta: 0, p: 1 };

  const tObs = tag.filter((x) => x.primary === v).length;
  const cObs = ctl.filter((x) => x.primary === v).length;
  const dObs = tObs / nt - cObs / nc;

  const pool = tag.concat(ctl);
  const labels: number[] = [];
  for (let i = 0; i < pool.length; i++) labels.push(i < nt ? 1 : 0); // 1=tag,0=control

  const rnd = mulberry32(seed);
  let ge = 0;

  for (let k = 0; k < iters; k++) {
    const tmp = labels.slice();
    shuffleInPlace(tmp, rnd);

    let t = 0, c = 0, tt = 0, cc = 0;
    for (let i = 0; i < pool.length; i++) {
      const isTag = tmp[i] === 1;
      const isHit = pool[i].primary === v;
      if (isTag) { tt++; if (isHit) t++; }
      else { cc++; if (isHit) c++; }
    }

    const d = tt ? (t / tt) : 0;
    const e = cc ? (c / cc) : 0;
    const dd = d - e;

    if (Math.abs(dd) >= Math.abs(dObs)) ge++;
  }

  return { nt, nc, tObs, cObs, delta: dObs, p: ge / iters };
}

// Holm–Bonferroni correction (per tag)
function holmAdjust(ps: number[]) {
  const m = ps.length;
  const idx = ps.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  const adj = new Array(m).fill(1);

  let prev = 0;
  for (let k = 0; k < m; k++) {
    const raw = Math.min(1, (m - k) * idx[k].p);
    const val = Math.max(prev, raw); // enforce monotonicity
    adj[idx[k].i] = val;
    prev = val;
  }
  return adj;
}

describe("Taiwan Root-Only v0.6 — full vowel enrichment matrix vs control", () => {
  it("writes tests/validation/out/taiwan.positionOrder.rootOnly.v0.6.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.positionOrder.rootOnly.v0.5.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.positionOrder.rootOnly.v0.6.md");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
      const out = extractCarrierVoicesFromZhuyinV0_1(r.zhuyin);
      const voices = Array.isArray((out as any)?.voices) ? ((out as any).voices as Vowel[]) : [];
      const primary = ((out as any)?.primary ?? "NONE") as Primary;
      return { ...r, voices, primary };
    });

    // strict: root-only dataset should not contain NONE primaries
    const none = items.filter((x) => x.primary === "NONE");
    if (none.length) {
      throw new Error(
        `Unexpected NONE primaries ids=${none.map((x) => x.id + ":" + x.zhuyin).join(", ")}`
      );
    }

    const TAGS = ["position_root", "order_root"] as const;
    const CTRL = "control_root";

    const ITERS = 12000;
    const SEED = 90924061;

    fs.mkdirSync(outDir, { recursive: true });

    const lines: string[] = [];
    lines.push("# Taiwan Root-Only v0.6 — vowel enrichment matrix vs control_root");
    lines.push("");
    lines.push("- Purpose: stop single-anchor chasing; measure which primaries separate each tag from control (two-sided).");
    lines.push(`- corpus: \`${path.relative(root, inPath)}\` (${rows.length})`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");
    lines.push("## Power check");
    lines.push("");
    lines.push("| Tag | N |");
    lines.push("|-----|--:|");
    for (const t of [...TAGS, CTRL]) {
      lines.push(`| ${t} | ${items.filter((x) => x.tag === t).length} |`);
    }
    lines.push("");

    for (const tag of TAGS) {
      const tagItems = items.filter((x) => x.tag === tag);
      const ctrlItems = items.filter((x) => x.tag === CTRL);

      const results = VOX.map((v, i) => {
        const r = enrichPvalue(tagItems, ctrlItems, v, ITERS, (SEED ^ ((i + 1) * 0x9e3779b1)) >>> 0);
        const tagRate = r.nt ? r.tObs / r.nt : 0;
        const ctrlRate = r.nc ? r.cObs / r.nc : 0;
        return { v, ...r, tagRate, ctrlRate };
      });

      const adj = holmAdjust(results.map((r) => r.p));
      results.forEach((r, i) => ((r as any).pHolm = adj[i]));

      lines.push(`## ${tag} vs ${CTRL}`);
      lines.push("");
      lines.push("| Vowel | Tag rate | Control rate | Δ | p (two-sided) | p_holm |");
      lines.push("|------:|---------:|-------------:|---:|--------------:|-------:|");

      for (const r of results) {
        const delta = r.tagRate - r.ctrlRate;
        const d = (delta >= 0 ? "+" : "") + pct(delta);
        lines.push(
          `| ${r.v} | ${pct(r.tagRate)} (${r.tObs}/${r.nt}) | ${pct(r.ctrlRate)} (${r.cObs}/${r.nc}) | ${d} | ${fmtP(r.p)} | ${fmtP((r as any).pHolm)} |`
        );
      }

      lines.push("");
      lines.push("- Interpretation: prefer small p_holm for “real” separation; raw p is exploratory.");
      lines.push("");
    }

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
  });
});
