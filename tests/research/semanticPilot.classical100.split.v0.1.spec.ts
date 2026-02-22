import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

type ClassicalWord = { id: string; word: string; ipa: string };
type Meta = { version: string; allowedTags: string[]; tags: Record<string, string[]> };

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function arr(x: any): string[] {
  return Array.isArray(x) ? x.map(String) : [];
}

function arrEq(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
}

function primaryOf(voices: string[]): string {
  return voices[0] ?? "NONE";
}

function pct(n: number, d: number): string {
  if (!d) return "0.0%";
  return ((n / d) * 100).toFixed(1) + "%";
}

// deterministic rng
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(xs: T[], rnd: () => number): void {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const tmp = xs[i];
    xs[i] = xs[j];
    xs[j] = tmp;
  }
}

function parseWordsFile(s: string): ClassicalWord[] {
  const lines = s.split("\n").map((x) => x.trim()).filter(Boolean);
  const out: ClassicalWord[] = [];
  for (const line of lines) {
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s*$/u);
    if (!m) throw new Error(`Bad classical words line (expected: id<ws>word<ws>/ipa/): ${line}`);
    out.push({ id: m[1], word: m[2], ipa: m[3] });
  }
  return out;
}

type Item = {
  id: string;
  word: string;
  ipa: string;
  lang: "lat" | "grk" | "other";
  tags: string[];
  maskVoices: string[];
  carrierVoices: string[];
  maskP: string;
  carrierP: string;
  status: "NO_PHONETIC" | "SYNC" | "DIVERGE";
};

function statusOf(mask: string[], carrier: string[]): "NO_PHONETIC" | "SYNC" | "DIVERGE" {
  if (carrier.length === 0) return "NO_PHONETIC";
  return arrEq(mask, carrier) ? "SYNC" : "DIVERGE";
}

function langOfId(id: string): Item["lang"] {
  if (id.startsWith("c3.lat.")) return "lat";
  if (id.startsWith("c3.grk.")) return "grk";
  return "other";
}

type TagAgg = {
  n: number;
  carrierN: number;
  divergeN: number;
  carrierCounts: Map<string, number>;
  items: Item[];
};

function buildTagAgg(allowedTags: string[], items: Item[]): Map<string, TagAgg> {
  const m = new Map<string, TagAgg>();
  for (const tag of allowedTags) {
    m.set(tag, { n: 0, carrierN: 0, divergeN: 0, carrierCounts: new Map(), items: [] });
  }
  for (const it of items) {
    for (const tag of it.tags) {
      const agg = m.get(tag);
      if (!agg) continue;
      agg.n++;
      agg.items.push(it);
      if (it.carrierVoices.length) {
        agg.carrierN++;
        agg.carrierCounts.set(it.carrierP, (agg.carrierCounts.get(it.carrierP) ?? 0) + 1);
        if (it.status === "DIVERGE") agg.divergeN++;
      }
    }
  }
  return m;
}

function topOf(counts: Map<string, number>): { topVowel: string; topCount: number; total: number; dist: string } {
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  const total = entries.reduce((s, [, n]) => s + n, 0);
  const top = entries[0] ?? ["NONE", 0];
  const dist = entries.map(([v, n]) => `${v}:${n}`).join(", ");
  return { topVowel: String(top[0]), topCount: Number(top[1] || 0), total, dist };
}

// permutation within THIS subset only (tags fixed, carriers shuffled)
function permutationPvaluesSubset(
  allowedTags: string[],
  items: Item[],
  iters: number,
  seed: number
): Record<string, number> {
  const rnd = mulberry32(seed);

  const obsAgg = buildTagAgg(allowedTags, items);
  const obsMax: Record<string, number> = {};
  for (const tag of allowedTags) obsMax[tag] = topOf(obsAgg.get(tag)!.carrierCounts).topCount;

  const primaries = items.map((it) => it.carrierP);

  const tagIdxs: Record<string, number[]> = {};
  for (const tag of allowedTags) {
    const idxs: number[] = [];
    for (let i = 0; i < items.length; i++) if (items[i].tags.includes(tag)) idxs.push(i);
    tagIdxs[tag] = idxs;
  }

  const hits: Record<string, number> = {};
  for (const tag of allowedTags) hits[tag] = 0;

  for (let it = 0; it < iters; it++) {
    const shuffled = primaries.slice();
    shuffleInPlace(shuffled, rnd);

    for (const tag of allowedTags) {
      const idxs = tagIdxs[tag];
      const obs = obsMax[tag] ?? 0;
      if (!idxs.length) continue;

      const counts = new Map<string, number>();
      for (const i of idxs) {
        const p = shuffled[i];
        counts.set(p, (counts.get(p) ?? 0) + 1);
      }
      const max = Math.max(...[...counts.values()]);
      if (max >= obs) hits[tag] = (hits[tag] ?? 0) + 1;
    }
  }

  const pvals: Record<string, number> = {};
  for (const tag of allowedTags) pvals[tag] = (hits[tag] ?? 0) / iters;
  return pvals;
}

function renderSection(
  title: string,
  allowedTags: string[],
  items: Item[],
  iters: number,
  seed: number,
  pThreshold: number
): string[] {
  const lines: string[] = [];
  lines.push(`## ${title}`);
  lines.push("");
  lines.push(`- N: **${items.length}**`);
  lines.push("");

  const agg = buildTagAgg(allowedTags, items);
  const pvals = permutationPvaluesSubset(allowedTags, items, iters, seed);

  lines.push("| Tag | N | Carrier top (purity) | p(max>=obs) | Carrier dist | Diverge rate |");
  lines.push("|-----|---:|----------------------|------------:|--------------|-------------|");

  for (const tag of allowedTags) {
    const a = agg.get(tag)!;
    const top = topOf(a.carrierCounts);
    const topStr = a.carrierN ? `${top.topVowel} (${pct(top.topCount, top.total)})` : "NONE";
    const p = pvals[tag] ?? 1;
    const divergeRate = a.carrierN ? `${pct(a.divergeN, a.carrierN)} (${a.divergeN}/${a.carrierN})` : "-";
    lines.push(`| ${tag} | ${a.n} | **${topStr}** | ${p.toFixed(3)} | ${top.dist || "-"} | ${divergeRate} |`);
  }

  const low = allowedTags.filter((t) => (pvals[t] ?? 1) <= pThreshold);

  lines.push("");
  lines.push(`### Drilldown (p <= ${pThreshold.toFixed(2)})`);
  lines.push("");

  if (!low.length) {
    lines.push("_none_");
    lines.push("");
    return lines;
  }

  for (const tag of low) {
    const p = pvals[tag] ?? 1;
    const tagItems = items.filter((x) => x.tags.includes(tag));
    lines.push(`#### Tag: ${tag} (p=${p.toFixed(3)})`);
    lines.push("");
    lines.push("| ID | Word | Tags | Mask | Carrier | MaskP | CarrierP | Status |");
    lines.push("|---:|------|------|------|---------|-------|----------|--------|");
    for (const r of tagItems) {
      lines.push(
        `| ${r.id} | **${r.word}** | ${r.tags.join(", ") || "-"} | ${r.maskVoices.join(" ") || "-"} | ${r.carrierVoices.join(" ") || "-"} | ${r.maskP} | ${r.carrierP} | ${r.status} |`
      );
    }
    lines.push("");
  }

  return lines;
}

describe("Semantic Pilot Classical100 split v0.1 — Latin vs Greek controls", () => {
  it("writes tests/validation/out/semanticPilot.classical100.split.v0.1.md", () => {
    const root = process.cwd();
    const wordsPath = path.join(root, "tests/research/classical100.words.v0.1.txt");
    const metaPath = path.join(root, "tests/research/classical100.meta.v0.1.gemini-blind.json");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "semanticPilot.classical100.split.v0.1.md");

    if (!fs.existsSync(wordsPath)) throw new Error(`Missing words file: ${wordsPath}`);
    if (!fs.existsSync(metaPath)) throw new Error(`Missing meta file: ${metaPath}`);

    const words = parseWordsFile(fs.readFileSync(wordsPath, "utf8"));
    if (words.length !== 100) throw new Error(`Expected 100 classical words, got ${words.length}`);

    const meta = readJson<Meta>(metaPath);
    const allowedTags = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
    if (!allowedTags.length) throw new Error("Meta.allowedTags missing/empty");
    const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};

    const items: Item[] = words.map((w) => {
      const tags = arr(tagMap[w.id]).filter((t) => allowedTags.includes(t));

      const maskOut = extractOrthographyVoicesFromWordV0_1({ word: w.word });
      const maskVoices = arr(maskOut?.voices);

      const carOut = extractCarrierVoicesFromIpaV0_1(w.ipa);
      const carrierVoices = arr(carOut?.voices);

      const maskP = primaryOf(maskVoices);
      const carrierP = primaryOf(carrierVoices);
      const st = statusOf(maskVoices, carrierVoices);

      return {
        id: w.id,
        word: w.word,
        ipa: w.ipa,
        lang: langOfId(w.id),
        tags,
        maskVoices,
        carrierVoices,
        maskP,
        carrierP,
        status: st,
      };
    });

    const noCarrier = items.filter((x) => x.carrierVoices.length === 0).length;
    if (noCarrier) throw new Error(`Expected 0 NO_PHONETIC in Classical100, got ${noCarrier}`);

    const lat = items.filter((x) => x.lang === "lat");
    const grk = items.filter((x) => x.lang === "grk");

    const ITERS = 2000;
    const P_THRESHOLD = 0.10;

    const lines: string[] = [];
    lines.push("# Semantic Pilot Classical100 split v0.1 — Latin vs Greek controls");
    lines.push("");
    lines.push(`- meta: ${meta.version ?? "unknown"}`);
    lines.push(`- permutation iters: ${ITERS} (per subset)`);
    lines.push("");

    lines.push(...renderSection("Latin-only", allowedTags, lat, ITERS, 111111, P_THRESHOLD));
    lines.push(...renderSection("Greek-only", allowedTags, grk, ITERS, 222222, P_THRESHOLD));

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
