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

// Two-sided permutation test on delta in rates.
// Null: within the union set, the boolean labels are exchangeable across items.
// Implementation: shuffle boolean labels and re-split into group sizes.
function permPvalueTwoSided(
  groupA: Item[],
  groupB: Item[],
  label: (it: Item) => boolean,
  iters: number,
  seed: number
) {
  const aN = groupA.length;
  const bN = groupB.length;
  if (!aN || !bN) return { aN, bN, aObs: 0, bObs: 0, delta: 0, p: 1 };

  const aObs = groupA.filter(label).length;
  const bObs = groupB.filter(label).length;
  const deltaObs = aObs / aN - bObs / bN;

  const pooled = groupA.concat(groupB);
  const labels = pooled.map(label);

  const rnd = mulberry32(seed);
  let ge = 0;

  for (let k = 0; k < iters; k++) {
    const tmp = labels.slice();
    shuffleInPlace(tmp, rnd);

    const aHits = tmp.slice(0, aN).filter(Boolean).length;
    const bHits = tmp.slice(aN).filter(Boolean).length;
    const d = aHits / aN - bHits / bN;

    if (Math.abs(d) >= Math.abs(deltaObs)) ge++;
  }

  // +1 smoothing for stability (never returns 0)
  const p = (ge + 1) / (iters + 1);
  return { aN, bN, aObs, bObs, delta: deltaObs, p };
}

// Holm–Bonferroni (step-down). Returns adjusted p-values keyed by vowel.
function holmAdjust(ps: Record<string, number>) {
  const m = Object.keys(ps).length;
  const entries = Object.entries(ps).sort((a, b) => a[1] - b[1]); // asc by p
  const out: Record<string, number> = {};
  let prev = 0;

  for (let i = 0; i < entries.length; i++) {
    const [k, p] = entries[i];
    const adj = Math.min(1, p * (m - i));
    const step = Math.max(prev, adj);
    out[k] = step;
    prev = step;
  }

  // Restore any missing keys (shouldn't happen)
  for (const k of Object.keys(ps)) if (out[k] === undefined) out[k] = 1;
  return out;
}

function fmtRow(v: string, r: { aN: number; bN: number; aObs: number; bObs: number; delta: number; p: number }, aLabel: string, bLabel: string) {
  const aRate = r.aN ? r.aObs / r.aN : 0;
  const bRate = r.bN ? r.bObs / r.bN : 0;
  const d = r.delta;
  const sign = d >= 0 ? "+" : "";
  return `| ${v} | ${pct(aRate)} (${r.aObs}/${r.aN}) | ${pct(bRate)} (${r.bObs}/${r.bN}) | ${sign}${pct(d)} | ${r.p.toFixed(3)} |`;
}

describe("Taiwan Root-Only v0.7 — presence matrix (voices[]) + tag-vs-tag contrast", () => {
  it("writes tests/validation/out/taiwan.positionOrder.rootOnly.v0.7.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.positionOrder.rootOnly.v0.5.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.positionOrder.rootOnly.v0.7.md");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
      const out = extractCarrierVoicesFromZhuyinV0_1(r.zhuyin);
      const voices = Array.isArray((out as any)?.voices) ? ((out as any).voices as Vowel[]) : [];
      const primary = ((out as any)?.primary ?? "NONE") as Primary;
      return { ...r, voices, primary };
    });

    // Hard fail if any NONE primaries (keeps the root-only lens strict)
    const none = items.filter((x) => x.primary === "NONE");
    if (none.length) {
      throw new Error(`Unexpected NONE primaries (implicit/apical?) ids=${none.map((x) => x.id + ":" + x.zhuyin).join(", ")}`);
    }

    const tags = Array.from(new Set(items.map((x) => x.tag))).sort();
    expect(tags).toEqual(expect.arrayContaining(["position_root", "order_root", "control_root"]));

    const ITERS = 12000;
    const SEED = 90924071;

    fs.mkdirSync(outDir, { recursive: true });

    const lines: string[] = [];
    lines.push("# Taiwan Root-Only v0.7 — presence matrix (voices[]) + tag-vs-tag contrast");
    lines.push("");
    lines.push("- Purpose: stop primary-only compression; test vowel *presence* in voices[] and compare tags directly.");
    lines.push(`- corpus: \`${path.relative(root, inPath)}\` (${items.length})`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");

    const buckets: Record<string, Item[]> = {
      position_root: items.filter((x) => x.tag === "position_root"),
      order_root: items.filter((x) => x.tag === "order_root"),
      control_root: items.filter((x) => x.tag === "control_root"),
    };

    lines.push("## Power check");
    lines.push("");
    lines.push("| Tag | N |");
    lines.push("|-----|--:|");
    for (const k of Object.keys(buckets)) lines.push(`| ${k} | ${buckets[k].length} |`);
    lines.push("");

    function runMatrix(title: string, groupAName: string, groupBName: string, labelFn: (v: Vowel) => (it: Item) => boolean) {
      const A = buckets[groupAName];
      const B = buckets[groupBName];
      lines.push(`## ${title}`);
      lines.push("");
      lines.push("| Vowel | " + groupAName + " rate | " + groupBName + " rate | Δ | p (two-sided) | p_holm |");
      lines.push("|------:|----------------:|----------------:|---:|--------------:|-------:|");

      const rawPs: Record<string, number> = {};
      const rowsOut: Record<string, string> = {};

      for (const v of VOX) {
        const r = permPvalueTwoSided(A, B, labelFn(v), ITERS, (SEED ^ (v.charCodeAt(0) * 2654435761)) >>> 0);
        rawPs[v] = r.p;
        rowsOut[v] = fmtRow(v, r, groupAName, groupBName);
      }

      const holm = holmAdjust(rawPs);
      for (const v of VOX) {
        lines.push(rowsOut[v].replace(/\|\s*$/, "") + ` ${holm[v].toFixed(3)} |`);
      }

      lines.push("");
      lines.push("- Interpretation: look for low p_holm; raw p is exploratory.");
      lines.push("");
    }

    // Presence matrix: vowel appears anywhere in voices[]
    runMatrix(
      "Presence matrix: position_root vs control_root",
      "position_root",
      "control_root",
      (v) => (it) => (it.voices || []).includes(v)
    );

    runMatrix(
      "Presence matrix: order_root vs control_root",
      "order_root",
      "control_root",
      (v) => (it) => (it.voices || []).includes(v)
    );

    // Direct contrast (kills “control composition” arguments)
    runMatrix(
      "Presence matrix: position_root vs order_root (direct contrast)",
      "position_root",
      "order_root",
      (v) => (it) => (it.voices || []).includes(v)
    );

    // Optional: primary-only matrix for comparison (kept in same report)
    runMatrix(
      "Primary-only matrix: position_root vs control_root (reference)",
      "position_root",
      "control_root",
      (v) => (it) => it.primary === v
    );

    runMatrix(
      "Primary-only matrix: order_root vs control_root (reference)",
      "order_root",
      "control_root",
      (v) => (it) => it.primary === v
    );

    lines.push("## Notes");
    lines.push("");
    lines.push("- Presence tests reduce loss from primary selection (important for multi-vowel Zhuyin syllables).");
    lines.push("- Direct contrast (position_root vs order_root) avoids control-bucket composition bias.");
    lines.push("- If we still get nothing after presence + contrast, the next lens is tone-aware or apical/implicit-nucleus modeling (separate, versioned).");

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
  });
});
