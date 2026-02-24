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
  const keys: Vowel[] = ["A", "E", "I", "O", "U", "Y", "Ë"];
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

// pooled-null visibility only (same as v0.2): primaries exchangeable across all items
function pooledAnchorPvalue(allItems: Item[], tag: string, anchor: Vowel, iters: number, seed: number) {
  const bucketIdx: number[] = [];
  const permIdx: number[] = [];

  for (let k = 0; k < allItems.length; k++) {
    if (allItems[k].tag === tag) bucketIdx.push(k);
    if (allItems[k].primary !== "NONE") permIdx.push(k);
  }

  const obs = bucketIdx.filter((k) => allItems[k].primary === anchor).length;
  const n = bucketIdx.filter((k) => allItems[k].primary !== "NONE").length;
  if (!n) return { n: 0, obs: 0, p: 1 };

  const primaries = permIdx.map((k) => allItems[k].primary as Vowel);

  const rnd = mulberry32(seed);
  let ge = 0;

  for (let iter = 0; iter < iters; iter++) {
    const tmp = primaries.slice();
    shuffleInPlace(tmp, rnd);

    const map = new Map<number, Vowel>();
    for (let j = 0; j < permIdx.length; j++) map.set(permIdx[j], tmp[j]);

    let c = 0;
    for (const k of bucketIdx) {
      if (allItems[k].primary === "NONE") continue;
      const p1 = map.get(k) ?? (allItems[k].primary as Vowel);
      if (p1 === anchor) c++;
    }

    if (c >= obs) ge++;
  }

  return { n, obs, p: ge / iters };
}

// discriminative enrichment test: does tag have higher anchor rate than control?
function enrichmentPvalue(tagItems: Item[], ctrlItems: Item[], anchor: Vowel, iters: number, seed: number) {
  const t = tagItems.filter((x) => x.primary !== "NONE");
  const c = ctrlItems.filter((x) => x.primary !== "NONE");
  const nt = t.length;
  const nc = c.length;
  if (!nt || !nc) return { nt, nc, obsDelta: 0, p: 1 };

  const tObs = t.filter((x) => x.primary === anchor).length;
  const cObs = c.filter((x) => x.primary === anchor).length;
  const tRate = tObs / nt;
  const cRate = cObs / nc;
  const obsDelta = tRate - cRate;

  const pool = t.map((x) => x.primary as Vowel).concat(c.map((x) => x.primary as Vowel));

  const rnd = mulberry32(seed);
  let ge = 0;

  for (let k = 0; k < iters; k++) {
    const tmp = pool.slice();
    shuffleInPlace(tmp, rnd);

    const tTmp = tmp.slice(0, nt);
    const cTmp = tmp.slice(nt);

    const tC = tTmp.filter((p) => p === anchor).length / nt;
    const cC = cTmp.filter((p) => p === anchor).length / nc;
    const delta = tC - cC;

    // one-sided: evidence only if tag is MORE anchored than control
    if (delta >= obsDelta) ge++;
  }

  return { nt, nc, obsDelta, p: ge / iters, tObs, cObs };
}

describe("Taiwan Position/Order Pilot v0.4 — enrichment vs multiple controls (Zhuyin)", () => {
  it("writes tests/validation/out/taiwan.positionOrder.pilot.v0.4.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.positionOrder.pilot.v0.2.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.positionOrder.pilot.v0.4.md");

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
    const ITERS_POOL = 8000;
    const ITERS_ENRICH = 12000;
    const SEED = 90924041;

    fs.mkdirSync(outDir, { recursive: true });

    const fmtP = (p: number) => (p === 0 ? "<0.001" : p.toFixed(3));
    const pct = (x: number) => (x * 100).toFixed(1) + "%";

    const lines: string[] = [];
    lines.push("# Taiwan Position/Order Pilot v0.4 — multi-control enrichment (Zhuyin)");
    lines.push("");
    lines.push("- Purpose: reduce control bias by adding non-color control bucket + report enrichment vs each control.");
    lines.push(`- corpus: \`${path.relative(root, inPath)}\` (${rows.length})`);
    lines.push(`- target per tag: ${TARGET}`);
    lines.push(`- pooled-null iters: ${ITERS_POOL}`);
    lines.push(`- enrichment iters: ${ITERS_ENRICH}`);
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

    lines.push("## Anchor cells (pooled-null; visibility only)");
    lines.push("");
    lines.push("| Anchor | N | obs/p |");
    lines.push("|--------|--:|-------|");

    const anchors: Record<string, Vowel> = { position: "A", order: "I" };
    for (const [tag, anchor] of Object.entries(anchors)) {
      const bucket = items.filter((x) => x.tag === tag);
      const pv = pooledAnchorPvalue(items, tag, anchor, ITERS_POOL, (SEED ^ (tag === "position" ? 0xA11CE : 0x0D3D3)) >>> 0);
      lines.push(`| ${tag}→${anchor} | ${bucket.length} | ${pv.obs}/${fmtP(pv.p)} |`);
    }
    lines.push("");

    const controls = ["control_color", "control_misc"].filter((t) => tags.includes(t));

    lines.push("## Enrichment vs controls (discriminative)");
    lines.push("");
    if (!controls.length) {
      lines.push("- No control tags found. Expected at least one of: control_color, control_misc.");
    } else {
      lines.push("| Tag | Anchor | Control | Tag rate | Control rate | Δ | p |");
      lines.push("|-----|--------|---------|---------:|-------------:|---:|---:|");

      for (const [tag, anchor] of Object.entries(anchors)) {
        const tagItems = items.filter((x) => x.tag === tag);
        for (const ctrlTag of controls) {
          const ctrlItems = items.filter((x) => x.tag === ctrlTag);
          const r = enrichmentPvalue(tagItems, ctrlItems, anchor, ITERS_ENRICH, (SEED ^ (ctrlTag === "control_misc" ? 0xC0FFEE : 0xC0110R)) >>> 0);
          const tagRate = r.nt ? (r.tObs / r.nt) : 0;
          const ctrlRate = r.nc ? (r.cObs / r.nc) : 0;
          lines.push(
            `| ${tag} | ${anchor} | ${ctrlTag} | ${pct(tagRate)} (${r.tObs}/${r.nt}) | ${pct(ctrlRate)} (${r.cObs}/${r.nc}) | ${(tagRate - ctrlRate >= 0 ? "+" : "") + pct(tagRate - ctrlRate)} | ${fmtP(r.p)} |`
          );
        }
      }
    }
    lines.push("");

    lines.push("## Primary distributions (all tags)");
    lines.push("");
    for (const tag of tags) {
      const bucket = items.filter((x) => x.tag === tag);
      lines.push(`- ${tag}: N=${bucket.length} dist=${distPrimaries(bucket)}`);
    }

    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push("- v0.4 keeps pooled-null for continuity, but emphasizes discriminative enrichment vs control buckets.");
    lines.push("- If controls are A-heavy, position→A will look weak even if position has many A; that’s why control_misc exists.");

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
  });
});
