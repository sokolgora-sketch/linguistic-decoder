import { describe, it, expect } from "@jest/globals";
import fs from "fs";
import path from "path";
import { extractCarrierVoicesFromZhuyinV0_1 } from "@/shared/vowels/extractCarrierVoicesFromZhuyin.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type Primary = Vowel | "NONE";

type Row = { id: string; hanzi: string; zhuyin: string; tag: string };
type Item = Row & { voices: Vowel[]; primary: Primary };

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

function distPrimaries(items: Item[]) {
  const keys: (Vowel)[] = ["A", "E", "I", "O", "U", "Y", "Ë"];
  const map = new Map<string, number>();
  for (const k of keys) map.set(k, 0);
  map.set("NONE", 0);
  for (const it of items) map.set(it.primary, (map.get(it.primary) ?? 0) + 1);
  const parts: string[] = [];
  for (const k of keys) {
    const n = map.get(k) ?? 0;
    if (n) parts.push(`${k}:${n}`);
  }
  const none = map.get("NONE") ?? 0;
  if (none) parts.push(`NONE:${none}`);
  return parts.join(", ") || "NONE:0";
}

// p(count>=obs) under null where primaries are exchangeable across items (within this set).
// We shuffle primaries across all non-NONE items, then count anchor hits inside the tag bucket.
function anchorPvalue(allItems: Item[], tag: string, anchor: Vowel, iters: number, seed: number) {
  const bucketIdx: number[] = [];
  const permIdx: number[] = [];
  for (let i = 0; i < allItems.length; i++) {
    if (allItems[i].tag === tag) bucketIdx.push(i);
    if (allItems[i].primary !== "NONE") permIdx.push(i);
  }

  const obs = bucketIdx.filter((i) => allItems[i].primary === anchor).length;
  const n = bucketIdx.filter((i) => allItems[i].primary !== "NONE").length;
  if (!n) return { n: 0, obs: 0, p: 1 };

  const primaries = permIdx.map((i) => allItems[i].primary as Vowel);

  const rnd = mulberry32(seed);
  let ge = 0;

  for (let k = 0; k < iters; k++) {
    const tmp = primaries.slice();
    shuffleInPlace(tmp, rnd);

    // apply shuffled primaries back to permIdx positions
    let hits = 0;
    let ptr = 0;
    for (const i of bucketIdx) {
      const orig = allItems[i].primary;
      if (orig === "NONE") continue;
      const posInPerm = permIdx.indexOf(i);
      // O(N^2) worst-case, but tiny dataset; keep simple and deterministic.
      const v = posInPerm >= 0 ? (tmp[posInPerm] as Vowel) : (orig as Vowel);
      if (v === anchor) hits++;
      ptr++;
    }

    if (hits >= obs) ge++;
  }

  return { n, obs, p: ge / iters };
}

function rateAnchor(items: Item[], tag: string, anchor: Vowel) {
  const bucket = items.filter((x) => x.tag === tag && x.primary !== "NONE");
  const hits = bucket.filter((x) => x.primary === anchor).length;
  const n = bucket.length;
  return { n, hits, rate: n ? hits / n : 0 };
}

// Enrichment vs control: delta = rate(tag,anchor) - rate(control,anchor)
// Null: tag labels are exchangeable across items (primaries fixed). We shuffle tag labels (counts preserved).
function enrichmentPvalue(items: Item[], tag: string, anchor: Vowel, controlTag: string, iters: number, seed: number) {
  const obsT = rateAnchor(items, tag, anchor);
  const obsC = rateAnchor(items, controlTag, anchor);
  const obsDelta = obsT.rate - obsC.rate;

  const tags = items.map((x) => x.tag);
  const rnd = mulberry32(seed);

  let ge = 0;
  for (let k = 0; k < iters; k++) {
    const tmpTags = tags.slice();
    shuffleInPlace(tmpTags, rnd);

    // compute delta under shuffled tag labels
    let tN = 0, tHits = 0;
    let cN = 0, cHits = 0;

    for (let i = 0; i < items.length; i++) {
      const pseudoTag = tmpTags[i];
      const p = items[i].primary;
      if (p === "NONE") continue;

      if (pseudoTag === tag) {
        tN++;
        if (p === anchor) tHits++;
      } else if (pseudoTag === controlTag) {
        cN++;
        if (p === anchor) cHits++;
      }
    }

    const tRate = tN ? tHits / tN : 0;
    const cRate = cN ? cHits / cN : 0;
    const delta = tRate - cRate;

    if (delta >= obsDelta) ge++;
  }

  return { obsDelta, obsT, obsC, p: ge / iters };
}

describe("Taiwan Position/Order Pilot v0.3 — enrichment vs control (Zhuyin)", () => {
  it("writes tests/validation/out/taiwan.positionOrder.pilot.v0.3.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.positionOrder.pilot.v0.2.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.positionOrder.pilot.v0.3.md");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
      const out = extractCarrierVoicesFromZhuyinV0_1(r.zhuyin);
      const voices = Array.isArray((out as any)?.voices) ? ((out as any).voices as Vowel[]) : [];
      const primary = ((out as any)?.primary ?? "NONE") as Primary;
      return { ...r, voices, primary };
    });

    const tags = Array.from(new Set(items.map((x) => x.tag))).sort();

    const TARGET = 50;
    const ITERS = 8000;
    const SEED = 90924031;
    const CONTROL = "control_color";

    fs.mkdirSync(outDir, { recursive: true });

    const fmt = (x: { obs: number; p: number }) => `${x.obs}/${x.p === 0 ? "<0.001" : x.p.toFixed(3)}`;
    const fmtP = (p: number) => (p === 0 ? "<0.001" : p.toFixed(3));
    const pct = (x: number) => (x * 100).toFixed(1) + "%";
    const dPct = (x: number) => ((x >= 0 ? "+" : "") + (x * 100).toFixed(1) + "%");

    const lines: string[] = [];
    lines.push("# Taiwan Position/Order Pilot v0.3 — Zhuyin enrichment vs control");
    lines.push("");
    lines.push("- Purpose: move from pooled-null to *discriminative* test (enrichment vs negative control).");
    lines.push(`- corpus: \`${path.relative(root, inPath)}\` (${rows.length})`);
    lines.push(`- target per tag: ${TARGET}`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");

    lines.push("## Power check (non-failing)");
    lines.push("");
    lines.push("| Tag | N | Missing to target |");
    lines.push("|-----|--:|------------------:|");
    for (const tag of tags) {
      const n = items.filter((x) => x.tag === tag).length;
      const miss = Math.max(0, TARGET - n);
      lines.push(`| ${tag} | ${n} | ${miss} |`);
    }
    lines.push("");

    lines.push("## Anchor cells (pooled-null; hypothesis visibility only)");
    lines.push("");
    lines.push("| Anchor | N | obs/p |");
    lines.push("|--------|--:|-------|");
    const anchors: Record<string, Vowel> = { position: "A", order: "I" };
    for (const [tag, anchor] of Object.entries(anchors)) {
      const pv = anchorPvalue(items, tag, anchor, ITERS, (SEED ^ (tag === "position" ? 0xA11CE : 0x0D3D3)) >>> 0);
      lines.push(`| ${tag}→${anchor} | ${pv.n} | ${fmt(pv)} |`);
    }
    lines.push("");

    lines.push("## Enrichment vs control_color (discriminative test)");
    lines.push("");
    lines.push("| Tag | Anchor | Tag rate | Control rate | Δ | p |");
    lines.push("|-----|--------|---------:|-------------:|---:|---:|");
    for (const [tag, anchor] of Object.entries(anchors)) {
      const ev = enrichmentPvalue(items, tag, anchor, CONTROL, ITERS, (SEED ^ (tag === "position" ? 0xB0B0 : 0xC0C0)) >>> 0);
      lines.push(
        `| ${tag} | ${anchor} | ${pct(ev.obsT.rate)} (${ev.obsT.hits}/${ev.obsT.n}) | ${pct(ev.obsC.rate)} (${ev.obsC.hits}/${ev.obsC.n}) | ${dPct(ev.obsDelta)} | ${fmtP(ev.p)} |`
      );
    }
    lines.push("");

    lines.push("## Primary distributions (all tags)");
    lines.push("");
    for (const tag of tags) {
      const bucket = items.filter((x) => x.tag === tag);
      lines.push(`- ${tag}: N=${bucket.length} dist=${distPrimaries(bucket)}`);
    }
    lines.push("");

    lines.push("## All cases");
    lines.push("");
    lines.push("| ID | Hanzi | Zhuyin | Tag | Voices | Primary |");
    lines.push("|---:|------|--------|-----|--------|---------|");
    for (const r of items.slice().sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(`| ${r.id} | **${r.hanzi}** | ${r.zhuyin} | ${r.tag} | ${(r.voices || []).join(" ") || "-"} | ${r.primary} |`);
    }

    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push("- v0.3 adds *enrichment-vs-control* permutation stats by shuffling **tag labels** (primaries fixed; tag counts preserved).");
    lines.push("- This is the correct test when a vowel has a high base-rate in the language slice.");
    lines.push("- Apical/implicit nucleus syllables remain out-of-scope until a dedicated lens is versioned + locked.");

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
  });
});
