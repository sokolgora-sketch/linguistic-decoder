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

// p(count>=obs) by permutation of primaries within the tag bucket
function anchorPvalue(items: Item[], anchor: Vowel, iters: number, seed: number) {
  const primaries = items.map((x) => x.primary).filter((p) => p !== "NONE") as Vowel[];
  const obs = primaries.filter((p) => p === anchor).length;
  const n = primaries.length;
  if (!n) return { n: 0, obs: 0, p: 1 };

  const rnd = mulberry32(seed);
  let ge = 0;
  for (let k = 0; k < iters; k++) {
    const tmp = primaries.slice();
    shuffleInPlace(tmp, rnd);
    const c = tmp.filter((p) => p === anchor).length;
    if (c >= obs) ge++;
  }
  return { n, obs, p: ge / iters };
}

describe("Taiwan Position/Order Pilot v0.2 — Zhuyin distribution + anchors + control", () => {
  it("writes tests/validation/out/taiwan.positionOrder.pilot.v0.2.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.positionOrder.pilot.v0.2.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.positionOrder.pilot.v0.2.md");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseRows(fs.readFileSync(inPath, "utf8"));
    // minimal sanity: must not be empty
    expect(rows.length).toBeGreaterThan(0);

    const items: Item[] = rows.map((r) => {
      const out = extractCarrierVoicesFromZhuyinV0_1(r.zhuyin);
      const voices = Array.isArray((out as any)?.voices) ? ((out as any).voices as Vowel[]) : [];
      const primary = ((out as any)?.primary ?? "NONE") as Primary;
      return { ...r, voices, primary };
    });

    const tags = Array.from(new Set(items.map((x) => x.tag))).sort();

    const TARGET = 50;
    const ITERS = 5000;
    const SEED = 90924021;

    fs.mkdirSync(outDir, { recursive: true });

    const fmt = (x: { obs: number; p: number }) => `${x.obs}/${x.p === 0 ? "<0.001" : x.p.toFixed(3)}`;

    const lines: string[] = [];
    lines.push("# Taiwan Position/Order Pilot v0.2 — Zhuyin primary distribution");
    lines.push("");
    lines.push("- Purpose: scale + negative control (no semantic claims).");
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

    lines.push("## Anchor cells (Albanian hypothesis check)");
    lines.push("");
    lines.push("| Anchor | N | obs/p |");
    lines.push("|--------|--:|-------|");

    // Only compute anchors for these tags (control should not be interpreted as anchor evidence).
    const anchors: Record<string, Vowel> = { position: "A", order: "I" };

    for (const [tag, anchor] of Object.entries(anchors)) {
      const bucket = items.filter((x) => x.tag === tag);
      const pv = anchorPvalue(bucket, anchor, ITERS, (SEED ^ (tag === "position" ? 0xA11CE : 0x0D3D3)) >>> 0);
      lines.push(`| ${tag}→${anchor} | ${bucket.length} | ${fmt(pv)} |`);
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
    lines.push("- v0.2 keeps the harness green while data is being expanded (power warnings are informational).");
    lines.push("- Apical/implicit nucleus syllables remain out-of-scope until a dedicated lens is versioned + locked.");

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
  });
});
