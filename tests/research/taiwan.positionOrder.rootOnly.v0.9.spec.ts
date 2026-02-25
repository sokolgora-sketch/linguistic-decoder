import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { extractZhuyinSignalV0_1 } from "@/shared/vowels/extractZhuyinSignal.v0.1";
import { ZhuyinToneV0_1 } from "@/shared/vowels/extractToneFromZhuyin.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type Primary = Vowel | "NONE";

type Row = { id: string; hanzi: string; zhuyin: string; tag: string };
type Item = Row & {
  voices: Vowel[];
  primary: Vowel; // hard-fail if NONE
  tone: ZhuyinToneV0_1; // 1..5 only
  presMask: number; // bitset over 7 vowels
};

const VOX: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];
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
function bitFor(v: Vowel) {
  const i = VOX.indexOf(v);
  return i < 0 ? 0 : (1 << i);
}
function idxTone(t: ZhuyinToneV0_1) {
  return TONES.indexOf(t);
}
function idxVowel(v: Vowel) {
  return VOX.indexOf(v);
}
function pct(x: number) {
  return (x * 100).toFixed(1) + "%";
}
function fmtP(p: number) {
  if (p === 0) return "<0.001";
  if (p >= 0.9995) return "1.000";
  return p.toFixed(3);
}
function holmAdjust(pvals: number[]) {
  const m = pvals.length;
  const pairs = pvals.map((p, i) => ({ p, i })).sort((a, b) => a.p - b.p);
  const adj = new Array<number>(m).fill(1);
  let prev = 0;
  for (let k = 0; k < m; k++) {
    const mult = m - k;
    const raw = Math.min(1, pairs[k].p * mult);
    const a = Math.max(prev, raw);
    prev = a;
    adj[pairs[k].i] = a;
  }
  return adj;
}

type CellStat = {
  tone: ZhuyinToneV0_1;
  vowel: Vowel;
  tagObs: number;
  ctrlObs: number;
  tagN: number;
  ctrlN: number;
  delta: number;
  p: number;
  pHolm: number;
};

function jointStats(opts: {
  items: Item[];
  tag: string;
  ctrl: string;
  mode: "primary" | "presence";
  iters: number;
  seed: number;
}): CellStat[] {
  const { items, tag, ctrl, mode, iters, seed } = opts;

  const bucket = items.filter((x) => x.tag === tag || x.tag === ctrl);
  const tagItems = bucket.filter((x) => x.tag === tag);
  const ctrlItems = bucket.filter((x) => x.tag === ctrl);

  const nT = tagItems.length;
  const nC = ctrlItems.length;
  if (!nT || !nC) throw new Error("Empty buckets for tag=" + tag + " ctrl=" + ctrl);

  const combined = tagItems.concat(ctrlItems);
  const N = combined.length;

  const baseMembership: boolean[] = [];
  for (let i = 0; i < nT; i++) baseMembership.push(true);
  for (let i = 0; i < nC; i++) baseMembership.push(false);

  const K = TONES.length * VOX.length;
  const obsTag = new Array<number>(K).fill(0);
  const obsCtrl = new Array<number>(K).fill(0);

  const cellIndex = (tIdx: number, vIdx: number) => tIdx * VOX.length + vIdx;

  for (let i = 0; i < N; i++) {
    const it = combined[i];
    const tIdx = idxTone(it.tone);
    if (tIdx < 0) continue;

    if (mode === "primary") {
      const vIdx = idxVowel(it.primary);
      if (vIdx < 0) continue;
      const k = cellIndex(tIdx, vIdx);
      if (i < nT) obsTag[k]++; else obsCtrl[k]++;
    } else {
      for (let vIdx = 0; vIdx < VOX.length; vIdx++) {
        if (it.presMask & (1 << vIdx)) {
          const k = cellIndex(tIdx, vIdx);
          if (i < nT) obsTag[k]++; else obsCtrl[k]++;
        }
      }
    }
  }

  const obsDelta = new Array<number>(K).fill(0);
  for (let k = 0; k < K; k++) obsDelta[k] = obsTag[k] / nT - obsCtrl[k] / nC;

  const ge = new Array<number>(K).fill(0);
  const rnd = mulberry32(seed);

  for (let iter = 0; iter < iters; iter++) {
    const mem = baseMembership.slice();
    shuffleInPlace(mem, rnd);

    const permTag = new Array<number>(K).fill(0);
    const permCtrl = new Array<number>(K).fill(0);

    for (let i = 0; i < N; i++) {
      const it = combined[i];
      const tIdx = idxTone(it.tone);
      if (tIdx < 0) continue;

      if (mode === "primary") {
        const vIdx = idxVowel(it.primary);
        if (vIdx < 0) continue;
        const k = cellIndex(tIdx, vIdx);
        if (mem[i]) permTag[k]++; else permCtrl[k]++;
      } else {
        for (let vIdx = 0; vIdx < VOX.length; vIdx++) {
          if (it.presMask & (1 << vIdx)) {
            const k = cellIndex(tIdx, vIdx);
            if (mem[i]) permTag[k]++; else permCtrl[k]++;
          }
        }
      }
    }

    for (let k = 0; k < K; k++) {
      const dt = permTag[k] / nT - permCtrl[k] / nC;
      if (Math.abs(dt) >= Math.abs(obsDelta[k])) ge[k]++;
    }
  }

  const pvals = ge.map((c) => c / iters);
  const pHolm = holmAdjust(pvals);

  const out: CellStat[] = [];
  for (let tIdx = 0; tIdx < TONES.length; tIdx++) {
    for (let vIdx = 0; vIdx < VOX.length; vIdx++) {
      const k = tIdx * VOX.length + vIdx;
      out.push({
        tone: TONES[tIdx],
        vowel: VOX[vIdx],
        tagObs: obsTag[k],
        ctrlObs: obsCtrl[k],
        tagN: nT,
        ctrlN: nC,
        delta: obsDelta[k],
        p: pvals[k],
        pHolm: pHolm[k],
      });
    }
  }
  return out;
}

function renderTable(lines: string[], title: string, stats: CellStat[]) {
  lines.push("## " + title);
  lines.push("");
  lines.push("| Tone | Vowel | Tag rate | Control rate | Δ | p (two-sided) | p_holm |");
  lines.push("|----:|------:|---------:|-------------:|---:|--------------:|-------:|");
  for (const r of stats) {
    const tagRate = r.tagObs / r.tagN;
    const ctrlRate = r.ctrlObs / r.ctrlN;
    const d = tagRate - ctrlRate;
    lines.push(
      `| ${r.tone} | ${r.vowel} | ${pct(tagRate)} (${r.tagObs}/${r.tagN}) | ${pct(ctrlRate)} (${r.ctrlObs}/${r.ctrlN}) | ${(d >= 0 ? "+" : "") + pct(d)} | ${fmtP(r.p)} | ${fmtP(r.pHolm)} |`
    );
  }

  const top = stats.slice().sort((a, b) => a.pHolm - b.pHolm).slice(0, 8);
  lines.push("");
  lines.push("Top cells (by p_holm):");
  for (const r of top) {
    lines.push(`- Tone ${r.tone} × ${r.vowel}  Δ=${(r.delta >= 0 ? "+" : "") + pct(r.delta)}  p_holm=${fmtP(r.pHolm)}`);
  }
  lines.push("");
}

describe("Taiwan Root-Only v0.9 — joint (Tone × Vowel) matrix vs control_root", () => {
  it("writes tests/validation/out/taiwan.positionOrder.rootOnly.v0.9.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.positionOrder.rootOnly.v0.5.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.positionOrder.rootOnly.v0.9.md");

    if (!fs.existsSync(inPath)) throw new Error("Missing: " + inPath);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
        const sig = extractZhuyinSignalV0_1(r.zhuyin);

        if (![1, 2, 3, 4, 5].includes(sig.tone)) {
          throw new Error(`Unexpected tone: ${r.id} ${r.zhuyin} => ${sig.tone}`);
        }

        const primary = sig.primary;
        if (primary === "NONE") {
          throw new Error(`Unexpected primary=NONE (implicit/apical?) id=${r.id} zhuyin=${r.zhuyin}`);
        }

        const voices = Array.isArray(sig.voices) ? sig.voices : [];
        const presMask = voices.reduce((m, v) => m | bitFor(v), 0);

        return { ...r, voices, primary, tone: sig.tone, presMask };
      });

    const ITERS = 12000;
    const SEED = 90924091;

    const lines: string[] = [];
    lines.push("# Taiwan Root-Only v0.9 — joint (Tone × Vowel) matrix vs control_root");
    lines.push("");
    lines.push("- Purpose: test composite encoding; evaluate Tone×Vowel cells (primary + presence).");
    lines.push(`- corpus: \`${path.relative(root, inPath)}\` (${rows.length})`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");

    lines.push("## Power check");
    lines.push("");
    lines.push("| Tag | N |");
    lines.push("|-----|--:|");
    const want = ["position_root", "order_root", "control_root"] as const;

    for (const t of want) lines.push(`| ${t} | ${items.filter((x) => x.tag === t).length} |`);
    lines.push("");

    const SALT_POS_P = 0x90517100;
    const SALT_ORD_P = 0x0D3D3100;
    const SALT_POS_S = 0x90517111;
    const SALT_ORD_S = 0x0D3D3111;

    const pPos = jointStats({ items, tag: "position_root", ctrl: "control_root", mode: "primary", iters: ITERS, seed: (SEED ^ SALT_POS_P) >>> 0 });
    const pOrd = jointStats({ items, tag: "order_root", ctrl: "control_root", mode: "primary", iters: ITERS, seed: (SEED ^ SALT_ORD_P) >>> 0 });

    renderTable(lines, "Primary joint: position_root vs control_root (tone × primary)", pPos);
    renderTable(lines, "Primary joint: order_root vs control_root (tone × primary)", pOrd);

    const sPos = jointStats({ items, tag: "position_root", ctrl: "control_root", mode: "presence", iters: ITERS, seed: (SEED ^ SALT_POS_S) >>> 0 });
    const sOrd = jointStats({ items, tag: "order_root", ctrl: "control_root", mode: "presence", iters: ITERS, seed: (SEED ^ SALT_ORD_S) >>> 0 });

    renderTable(lines, "Presence joint: position_root vs control_root (tone × vowel presence)", sPos);
    renderTable(lines, "Presence joint: order_root vs control_root (tone × vowel presence)", sOrd);

    lines.push("## Notes");
    lines.push("");
    lines.push("- Cell-level probe: 35 tests per table; Holm correction is required.");
    lines.push("- If tone effects concentrate into Tone4×{A/I/U} etc, this will show it.");
    lines.push("");

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
  });
});
