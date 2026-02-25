import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { extractZhuyinSignalV0_1 } from "@/shared/vowels/extractZhuyinSignal.v0.1";
import { ZhuyinToneV0_1 } from "@/shared/vowels/extractToneFromZhuyin.v0.1";

type Row = { id: string; hanzi: string; zhuyin: string; tag: string };
type Item = Row & { tone: ZhuyinToneV0_1 };

const TONES: ZhuyinToneV0_1[] = [1, 2, 3, 4, 5];

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
  if (p === 1) return "1.000";
  return p.toFixed(3);
}

// Two-sided permutation test on delta(rate) for a specific tone value
function toneDeltaPvalue(tagTones: ZhuyinToneV0_1[], ctrlTones: ZhuyinToneV0_1[], tone: ZhuyinToneV0_1, iters: number, seed: number) {
  const nt = tagTones.length;
  const nc = ctrlTones.length;
  if (!nt || !nc) return { nt, nc, tObs: 0, cObs: 0, p: 1 };

  const tObs = tagTones.filter((x) => x === tone).length;
  const cObs = ctrlTones.filter((x) => x === tone).length;
  const dObs = tObs / nt - cObs / nc;

  const pool = tagTones.concat(ctrlTones);
  const rnd = mulberry32(seed);
  let ge = 0;

  for (let k = 0; k < iters; k++) {
    const tmp = pool.slice();
    shuffleInPlace(tmp, rnd);
    const t2 = tmp.slice(0, nt);
    const c2 = tmp.slice(nt);
    const t2Obs = t2.filter((x) => x === tone).length;
    const c2Obs = c2.filter((x) => x === tone).length;
    const d2 = t2Obs / nt - c2Obs / nc;
    if (Math.abs(d2) >= Math.abs(dObs)) ge++;
  }

  return { nt, nc, tObs, cObs, p: ge / iters };
}

function holm(pvals: number[]) {
  const m = pvals.length;
  const pairs = pvals.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  const adj: number[] = Array(m).fill(1);
  let prev = 0;
  for (let k = 0; k < m; k++) {
    const raw = (m - k) * pairs[k].p;
    const a = Math.min(1, Math.max(prev, raw));
    adj[pairs[k].i] = a;
    prev = a;
  }
  return adj;
}

describe("Taiwan Root-Only v0.8 — tone enrichment matrix vs control_root (Zhuyin)", () => {
  it("writes tests/validation/out/taiwan.positionOrder.rootOnly.v0.8.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.positionOrder.rootOnly.v0.5.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.positionOrder.rootOnly.v0.8.md");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
        const sig = extractZhuyinSignalV0_1(r.zhuyin);
        if (sig.tone === 0) throw new Error(`Unexpected tone=0 id=${r.id} zhuyin=${r.zhuyin}`);
        return { ...r, tone: sig.tone };
      });

    const ctrl = items.filter((x) => x.tag === "control_root").map((x) => x.tone);

    const lines: string[] = [];
    lines.push("# Taiwan Root-Only v0.8 — tone enrichment matrix vs control_root");
    lines.push("");
    lines.push("- Purpose: test whether tones (1–5) differentiate semantic tags after vowel-only probes went flat.");
    lines.push(`- corpus: \`${path.relative(root, inPath)}\` (${items.length})`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");

    lines.push("## Power check");
    lines.push("");
    lines.push("| Tag | N |");
    lines.push("|-----|--:|");
    for (const tag of tags) lines.push(`| ${tag} | ${items.filter((x) => x.tag === tag).length} |`);
    lines.push("");

    function section(tag: "position_root" | "order_root", salt: number) {
      const bucket = items.filter((x) => x.tag === tag).map((x) => x.tone);

      const pRaw: number[] = [];
      const rowsOut: Array<{ tone: ZhuyinToneV0_1; nt: number; nc: number; tObs: number; cObs: number; p: number }> = [];

      for (const tone of TONES) {
        const r = toneDeltaPvalue(bucket, ctrl, tone, ITERS, (SEED ^ salt ^ tone) >>> 0);
        pRaw.push(r.p);
        rowsOut.push({ tone, nt: r.nt, nc: r.nc, tObs: r.tObs, cObs: r.cObs, p: r.p });
      }
      const pH = holm(pRaw);

      lines.push(`## ${tag} vs control_root`);
      lines.push("");
      lines.push("| Tone | Tag rate | Control rate | Δ | p (two-sided) | p_holm |");
      lines.push("|----:|---------:|-------------:|---:|--------------:|-------:|");

      for (let i = 0; i < rowsOut.length; i++) {
        const r = rowsOut[i];
        const tr = r.tObs / r.nt;
        const cr = r.cObs / r.nc;
        const d = tr - cr;
        lines.push(`| ${r.tone} | ${pct(tr)} (${r.tObs}/${r.nt}) | ${pct(cr)} (${r.cObs}/${r.nc}) | ${(d >= 0 ? "+" : "") + pct(d)} | ${fmtP(r.p)} | ${fmtP(pH[i])} |`);
      }
      lines.push("");
      lines.push("- Interpretation: prefer low p_holm; raw p is exploratory.");
      lines.push("");
    }

    section("position_root", 0xA11CE);
    section("order_root", 0x0D3D3);

    fs.writeFileSync(outMd, lines.join("\n"), "utf8");
  });
});
