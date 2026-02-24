import fs from "fs";
import path from "path";
import { describe, it } from "@jest/globals";
import { extractCarrierVoicesFromZhuyinV0_1 } from "@/shared/vowels/extractCarrierVoicesFromZhuyin.v0.1";

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë";
type Primary = Vowel | "NONE";

type Row = { id: string; hanzi: string; zhuyin: string; tag: string };
type Item = Row & { voices: Vowel[]; primary: Primary };

function arr<T>(x: unknown): T[] {
  return Array.isArray(x) ? (x as T[]) : [];
}

// deterministic PRNG (same as other research harnesses)
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

// H0: primaries are independent of tag. Permute primaries ACROSS all items.
function anchorPvalue(items: Item[], tag: string, anchor: Vowel, iters: number, seed: number) {
  const bucketIdx: number[] = [];
  for (let i = 0; i < items.length; i++) if (items[i].tag === tag) bucketIdx.push(i);

  const primaries = items.map((x) => x.primary);
  const obs = bucketIdx.filter((i) => primaries[i] === anchor).length;
  const n = bucketIdx.length;
  if (!n) return { n: 0, obs: 0, p: 1 };

  const rnd = mulberry32(seed);
  let ge = 0;
  for (let k = 0; k < iters; k++) {
    const tmp = primaries.slice();
    shuffleInPlace(tmp, rnd);
    const c = bucketIdx.filter((i) => tmp[i] === anchor).length;
    if (c >= obs) ge++;
  }
  return { n, obs, p: ge / iters };
}

function parseFile(text: string): Row[] {
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

function dist(items: Item[], tag: string) {
  const xs = items.filter((x) => x.tag === tag);
  const map = new Map<string, number>();
  for (const x of xs) map.set(x.primary, (map.get(x.primary) ?? 0) + 1);
  const keys = ["A", "E", "I", "O", "U", "Y", "Ë", "NONE"];
  const parts = keys.filter((k) => map.has(k)).map((k) => `${k}:${map.get(k)}`);
  return { n: xs.length, dist: parts.join(", ") };
}

describe("Taiwan Position/Order Pilot v0.1 — Zhuyin distribution + anchor p-values", () => {
  it("writes tests/validation/out/taiwan.positionOrder.pilot.v0.1.md", () => {
    const root = process.cwd();
    const inPath = path.join(root, "tests/research/taiwan.positionOrder.pilot.v0.1.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "taiwan.positionOrder.pilot.v0.1.md");

    if (!fs.existsSync(inPath)) throw new Error(`Missing: ${inPath}`);

    const rows = parseFile(fs.readFileSync(inPath, "utf8"));
    if (rows.length !== 20) throw new Error(`Expected 20 rows, got ${rows.length}`);

    const items: Item[] = rows.map((r) => {
      const out = extractCarrierVoicesFromZhuyinV0_1(r.zhuyin);
      const voices = arr<Vowel>((out as any)?.voices);
      const primary = String((out as any)?.primary ?? "NONE") as Primary;
      return { ...r, voices, primary };
    });

    const noPrimary = items.filter((x) => x.primary === "NONE").length;
    if (noPrimary) throw new Error(`Expected 0 primary==NONE in pilot, got ${noPrimary}`);

    const ITERS = 5000;
    const SEED = 90924011;

    const posA = anchorPvalue(items, "position", "A", ITERS, (SEED ^ 0xA11CE) >>> 0);
    const ordI = anchorPvalue(items, "order", "I", ITERS, (SEED ^ 0x01D3D3) >>> 0);

    const fmt = (x: { obs: number; p: number }) => `${x.obs}/${x.p === 0 ? "<0.001" : x.p.toFixed(3)}`;

    fs.mkdirSync(outDir, { recursive: true });

    const lines: string[] = [];
    lines.push("# Taiwan Position/Order Pilot v0.1 — Zhuyin primary distribution");
    lines.push("");
    lines.push("- Purpose: first cross-language probe using Zhuyin nucleus extraction (no semantic claims).");
    lines.push(`- corpus: \`tests/research/taiwan.positionOrder.pilot.v0.1.txt\` (${rows.length})`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");
    lines.push("## Anchor cells (Albanian hypothesis check)");
    lines.push("");
    lines.push("| Anchor | N | obs/p |");
    lines.push("|--------|--:|-------|");
    lines.push(`| position→A | ${posA.n} | ${fmt(posA)} |`);
    lines.push(`| order→I | ${ordI.n} | ${fmt(ordI)} |`);
    lines.push("");
    lines.push("## Primary distributions");
    lines.push("");
    const dPos = dist(items, "position");
    const dOrd = dist(items, "order");
    lines.push(`- position: N=${dPos.n} dist=${dPos.dist}`);
    lines.push(`- order: N=${dOrd.n} dist=${dOrd.dist}`);
    lines.push("");
    lines.push("## All cases");
    lines.push("");
    lines.push("| ID | Hanzi | Zhuyin | Tag | Voices | Primary |");
    lines.push("|---:|------|--------|-----|--------|---------|");
    for (const r of items.slice().sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(`| ${r.id} | **${r.hanzi}** | ${r.zhuyin} | ${r.tag} | ${r.voices.join(" ")} | ${r.primary} |`);
    }
    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push("- This pilot deliberately avoids Zhuyin syllables where the vowel nucleus is implicit (e.g., ㄘˋ / ㄙˋ).");
    lines.push("- If we want those later, we’ll add a *separate*, versioned apical-vowel lens and lock it with tests.");
    lines.push("");

    fs.writeFileSync(outMd, lines.join("\n"), "utf8");
  });
});
