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
    // id <ws> word <ws> /ipa/
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s*$/u);
    if (!m) throw new Error(`Bad albanian words line (expected: id<ws>word<ws>/ipa/): ${line}`);
    out.push({ id: m[1], word: m[2], ipa: m[3] });
  }
  return out;
}

type Item = {
  id: string;
  word: string;
  ipa: string;
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

type TagAgg = {
  n: number;
  carrierN: number;
  divergeN: number;
  maskCounts: Map<string, number>;
  carrierCounts: Map<string, number>;
  items: Item[];
};

function topOf(counts: Map<string, number>): { topVowel: string; topCount: number; total: number; dist: string } {
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  const total = entries.reduce((s, [, n]) => s + n, 0);
  const top = entries[0] ?? ["NONE", 0];
  const dist = entries.map(([v, n]) => `${v}:${n}`).join(", ");
  return { topVowel: String(top[0]), topCount: Number(top[1] || 0), total, dist };
}

function buildTagAgg(allowedTags: string[], items: Item[]): Map<string, TagAgg> {
  const m = new Map<string, TagAgg>();
  for (const tag of allowedTags) {
    m.set(tag, {
      n: 0,
      carrierN: 0,
      divergeN: 0,
      maskCounts: new Map(),
      carrierCounts: new Map(),
      items: [],
    });
  }

  for (const it of items) {
    for (const tag of it.tags) {
      const agg = m.get(tag);
      if (!agg) continue;
      agg.n++;
      agg.items.push(it);

      agg.maskCounts.set(it.maskP, (agg.maskCounts.get(it.maskP) ?? 0) + 1);

      if (it.carrierVoices.length) {
        agg.carrierN++;
        agg.carrierCounts.set(it.carrierP, (agg.carrierCounts.get(it.carrierP) ?? 0) + 1);
        if (it.status === "DIVERGE") agg.divergeN++;
      }
    }
  }

  return m;
}

// Shuffle carrier primaries across items globally; tags fixed.
// p(tag) = P[maxCount >= observedMax] over permutations.
function permutationPvalues(allowedTags: string[], items: Item[], iters: number, seed: number): Record<string, number> {
  const rnd = mulberry32(seed);

  const tagAggObs = buildTagAgg(allowedTags, items);
  const obsMax: Record<string, number> = {};
  for (const tag of allowedTags) {
    const agg = tagAggObs.get(tag)!;
    obsMax[tag] = topOf(agg.carrierCounts).topCount;
  }

  const primaries: string[] = items.map((it) => it.carrierP);
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

describe("Semantic Pilot Albanian100 v0.1 — tag ↔ vowel association (Albanian (sq), IPA required)", () => {
  it("writes tests/validation/out/semanticPilot.albanian100.v0.1.md", () => {
    const root = process.cwd();

    const wordsPath = path.join(root, "tests/research/albanian100.words.v0.1.txt");
    const metaPath = path.join(root, "tests/research/albanian100.meta.v0.1.gemini-blind.json");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "semanticPilot.albanian100.v0.1.md");

    if (!fs.existsSync(wordsPath)) throw new Error(`Missing words file: ${wordsPath}`);
    if (!fs.existsSync(metaPath)) throw new Error(`Missing meta file: ${metaPath}`);

    const words = parseWordsFile(fs.readFileSync(wordsPath, "utf8"));
    if (words.length !== 100) throw new Error(`Expected 100 albanian words, got ${words.length}`);

    const meta = readJson<Meta>(metaPath);
    const allowedTags = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
    if (!allowedTags.length) throw new Error("Meta.allowedTags missing/empty");

    const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};

    const items: Item[] = words.map((w) => {
      const tags = arr(tagMap[w.id]).filter((t) => allowedTags.includes(t));

      const maskOut = extractOrthographyVoicesFromWordV0_1({ word: w.word, langHint: "sq" });
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
        tags,
        maskVoices,
        carrierVoices,
        maskP,
        carrierP,
        status: st,
      };
    });

    const noCarrier = items.filter((x) => x.carrierVoices.length === 0).length;
    if (noCarrier) throw new Error(`Expected 0 NO_PHONETIC in Albanian100, got ${noCarrier}`);

    const ITERS = 2000;
    const tagAgg = buildTagAgg(allowedTags, items);
    const pvals = permutationPvalues(allowedTags, items, ITERS, 123456789);

    const lines: string[] = [];
    lines.push("# Semantic Pilot Albanian100 v0.1 — Tag ↔ Vowel Purity (Albanian (sq))");
    lines.push("");
    lines.push(`- corpus: Albanian100 (100)`);
    lines.push(`- meta: ${meta.version ?? "unknown"}`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push("");

    lines.push("## Tag table (carrier primaries, permutation p-values)");
    lines.push("");
    lines.push("| Tag | N | Carrier top (purity) | p(max>=obs) | Carrier dist | Diverge rate |");
    lines.push("|-----|---:|----------------------|------------:|--------------|-------------|");

    for (const tag of allowedTags) {
      const agg = tagAgg.get(tag)!;
      const top = topOf(agg.carrierCounts);
      const topStr = agg.carrierN ? `${top.topVowel} (${pct(top.topCount, top.total)})` : "NONE";
      const p = pvals[tag] ?? 1;
      const divergeRate = `${pct(agg.divergeN, agg.carrierN)} (${agg.divergeN}/${agg.carrierN})`;
      lines.push(`| ${tag} | ${agg.n} | **${topStr}** | ${p.toFixed(3)} | ${top.dist || "-"} | ${divergeRate} |`);
    }

    const P_THRESHOLD = 0.10;
    const low = allowedTags.filter((t) => (pvals[t] ?? 1) <= P_THRESHOLD);

    lines.push("");
    lines.push(`## Drilldown (p <= ${P_THRESHOLD.toFixed(2)})`);
    lines.push("");

    if (!low.length) {
      lines.push("_No tags met the drilldown threshold._");
    } else {
      for (const tag of low) {
        const p = pvals[tag] ?? 1;
        const agg = tagAgg.get(tag)!;
        const rows = agg.items.slice().sort(
          (a, b) => String(a.carrierP).localeCompare(String(b.carrierP)) || String(a.word).localeCompare(String(b.word))
        );

        lines.push(`### Tag: ${tag} (p=${p.toFixed(3)})`);
        lines.push("");
        lines.push("| ID | Word | Tags | Mask | Carrier | MaskP | CarrierP | Status |");
        lines.push("|---:|------|------|------|---------|-------|----------|--------|");
        for (const r of rows) {
          lines.push(
            `| ${r.id} | **${r.word}** | ${r.tags.join(", ") || "-"} | ${r.maskVoices.join(" ") || "-"} | ${
              r.carrierVoices.join(" ") || "-"
            } | ${r.maskP} | ${r.carrierP} | ${r.status} |`
          );
        }
        lines.push("");
      }
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
