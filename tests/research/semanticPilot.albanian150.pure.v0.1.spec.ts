import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

type Meta = { version: string; allowedTags: string[]; tags: Record<string, string[]> };
type WordRow = { id: string; word: string; ipa: string };

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

function parseWordsFile(s: string): WordRow[] {
  const lines = s.split("\n").map((x) => x.trim()).filter(Boolean);
  const out: WordRow[] = [];
  for (const line of lines) {
    // id <ws> word <ws> /ipa/
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s*$/u);
    if (!m) throw new Error(`Bad words line (expected: id<ws>word<ws>/ipa/): ${line}`);
    out.push({ id: m[1], word: m[2], ipa: m[3] });
  }
  return out;
}

function statusOf(mask: string[], carrier: string[]): "NO_PHONETIC" | "SYNC" | "DIVERGE" {
  if (carrier.length === 0) return "NO_PHONETIC";
  return arrEq(mask, carrier) ? "SYNC" : "DIVERGE";
}

type TagAgg = {
  n: number;
  carrierN: number;
  divergeN: number;
  carrierCounts: Map<string, number>;
};

const VOICE_ORDER = ["A", "E", "I", "O", "U", "Y", "Ë"];

function buildTagAgg(allowedTags: string[], items: Item[]): Map<string, TagAgg> {
  const m = new Map<string, TagAgg>();
  for (const t of allowedTags) {
    m.set(t, { n: 0, carrierN: 0, divergeN: 0, carrierCounts: new Map() });
  }

  for (const it of items) {
    for (const tag of it.tags) {
      const agg = m.get(tag);
      if (!agg) continue;
      agg.n++;

      if (it.carrierVoices.length > 0) {
        agg.carrierN++;
        agg.carrierCounts.set(it.carrierP, (agg.carrierCounts.get(it.carrierP) ?? 0) + 1);
        if (it.status === "DIVERGE") agg.divergeN++;
      }
    }
  }
  return m;
}

function distStr(counts: Map<string, number>): string {
  const parts: string[] = [];
  for (const v of VOICE_ORDER) {
    const c = counts.get(v) ?? 0;
    if (c) parts.push(`${v}:${c}`);
  }
  // include anything unexpected deterministically
  for (const [k, c] of Array.from(counts.entries()).sort((a, b) => a[0].localeCompare(b[0]))) {
    if (!VOICE_ORDER.includes(k) && c) parts.push(`${k}:${c}`);
  }
  return parts.join(", ") || "-";
}

function topOf(counts: Map<string, number>) {
  let topVowel = "NONE";
  let topCount = 0;
  let total = 0;
  for (const [v, c] of counts.entries()) {
    total += c;
    if (c > topCount) {
      topCount = c;
      topVowel = v;
    }
  }
  return { topVowel, topCount, total, dist: distStr(counts) };
}

// p(max>=obs) where obs is the observed topCount for that tag.
// permutation: shuffle carrier primaries across items (tags fixed) and recompute topCount.
function permutationPvalues(allowedTags: string[], items: Item[], iters: number, seed: number): Record<string, number> {
  const rnd = mulberry32(seed);

  const carrierPrimaries = items.map((x) => x.carrierP);
  const tagIdxs = new Map<string, number[]>();

  for (const tag of allowedTags) tagIdxs.set(tag, []);
  for (let i = 0; i < items.length; i++) {
    if (items[i].carrierVoices.length === 0) continue;
    for (const tag of items[i].tags) {
      const arr = tagIdxs.get(tag);
      if (arr) arr.push(i);
    }
  }

  // observed topCount per tag
  const obsTop: Record<string, number> = {};
  for (const tag of allowedTags) {
    const idxs = tagIdxs.get(tag) ?? [];
    const counts = new Map<string, number>();
    for (const i of idxs) counts.set(carrierPrimaries[i], (counts.get(carrierPrimaries[i]) ?? 0) + 1);
    obsTop[tag] = topOf(counts).topCount;
  }

  const hits: Record<string, number> = {};
  for (const tag of allowedTags) hits[tag] = 0;

  for (let it = 0; it < iters; it++) {
    const shuffled = carrierPrimaries.slice();
    shuffleInPlace(shuffled, rnd);

    for (const tag of allowedTags) {
      const idxs = tagIdxs.get(tag) ?? [];
      const counts = new Map<string, number>();
      for (const i of idxs) counts.set(shuffled[i], (counts.get(shuffled[i]) ?? 0) + 1);
      const permTop = topOf(counts).topCount;
      if (permTop >= (obsTop[tag] ?? 0)) hits[tag] = (hits[tag] ?? 0) + 1;
    }
  }

  const out: Record<string, number> = {};
  for (const tag of allowedTags) out[tag] = (hits[tag] ?? 0) / iters;
  return out;
}

describe("Semantic Pilot Albanian150 PURE v0.1 — single-tag filter (Albanian (sq), IPA required)", () => {
  it("writes tests/validation/out/semanticPilot.albanian150.pure.v0.1.md", () => {
    const root = process.cwd();

    const wordsPath = path.join(root, "tests/research/albanian150.words.v0.1.txt");
    const metaPath = path.join(root, "tests/research/albanian150.meta.v0.1.mixed.json");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "semanticPilot.albanian150.pure.v0.1.md");

    if (!fs.existsSync(wordsPath)) throw new Error(`Missing words file: ${wordsPath}`);
    if (!fs.existsSync(metaPath)) throw new Error(`Missing meta file: ${metaPath}`);

    const words = parseWordsFile(fs.readFileSync(wordsPath, "utf8"));
    if (words.length !== 150) throw new Error(`Expected 150 albanian words, got ${words.length}`);

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

      return { id: w.id, word: w.word, ipa: w.ipa, tags, maskVoices, carrierVoices, maskP, carrierP, status: st };
    });

    const noCarrier = items.filter((x) => x.carrierVoices.length === 0).length;
    if (noCarrier) throw new Error(`Expected 0 NO_PHONETIC in Albanian150, got ${noCarrier}`);

    const pure = items.filter((x) => x.tags.length === 1);
    const dropped = items.length - pure.length;

    const ITERS = 2000;
    const SEED_MIXED = 123456789;
    const SEED_PURE = 987654321;

    const aggMixed = buildTagAgg(allowedTags, items);
    const pMixed = permutationPvalues(allowedTags, items, ITERS, SEED_MIXED);

    const aggPure = buildTagAgg(allowedTags, pure);
    const pPure = permutationPvalues(allowedTags, pure, ITERS, SEED_PURE);

    const lines: string[] = [];
    lines.push("# Semantic Pilot Albanian150 PURE v0.1 — Mixed vs Pure (single-tag) comparison");
    lines.push("");
    lines.push(`- corpus: Albanian150 (150)`);
    lines.push(`- meta: ${meta.version ?? "unknown"}`);
    lines.push(`- pure filter: tags.length == 1`);
    lines.push(`- pure N: ${pure.length} (dropped multi/zero-tag: ${dropped})`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed(mixed): ${SEED_MIXED}`);
    lines.push(`- seed(pure): ${SEED_PURE}`);
    lines.push("");
    lines.push("## Tag table (carrier primaries, permutation p-values)");
    lines.push("");
    lines.push("| Tag | N(mixed) | Top(mixed) | p(mixed) | Dist(mixed) | N(pure) | Top(pure) | p(pure) | Dist(pure) |");
    lines.push("|-----|---------:|------------|---------:|-------------|--------:|----------|--------:|------------|");

    for (const tag of allowedTags) {
      const m = aggMixed.get(tag)!;
      const p = aggPure.get(tag)!;

      const topM = topOf(m.carrierCounts);
      const topP = topOf(p.carrierCounts);

      const topMStr = m.carrierN ? `${topM.topVowel} (${pct(topM.topCount, topM.total)})` : "NONE";
      const topPStr = p.carrierN ? `${topP.topVowel} (${pct(topP.topCount, topP.total)})` : "NONE";

      lines.push(
        `| ${tag} | ${m.n} | **${topMStr}** | ${(pMixed[tag] ?? 1).toFixed(3)} | ${topM.dist || "-"} | ${p.n} | **${topPStr}** | ${(pPure[tag] ?? 1).toFixed(3)} | ${topP.dist || "-"} |`
      );
    }

    // Drilldown only for PURE low-p tags (p<=0.10)
    const P_THRESHOLD = 0.10;
    const lowPure = allowedTags.filter((t) => (pPure[t] ?? 1) <= P_THRESHOLD);

    lines.push("");
    lines.push(`## Drilldown (PURE only, p <= ${P_THRESHOLD.toFixed(2)})`);
    lines.push("");

    if (!lowPure.length) {
      lines.push("_none_");
      lines.push("");
    } else {
      for (const tag of lowPure) {
        lines.push(`### Tag: ${tag} (p=${(pPure[tag] ?? 1).toFixed(3)})`);
        lines.push("");
        lines.push("| ID | Word | IPA | CarrierP | Carrier | MaskP | Tags | Status |");
        lines.push("|---:|------|-----|----------|---------|-------|------|--------|");

        const rows = pure
          .filter((x) => x.tags.includes(tag))
          .slice()
          .sort((a, b) => String(a.carrierP).localeCompare(String(b.carrierP)) || String(a.word).localeCompare(String(b.word)) || String(a.id).localeCompare(String(b.id)));

        for (const r of rows) {
          lines.push(
            `| ${r.id} | **${r.word}** | ${r.ipa} | ${r.carrierP} | ${r.carrierVoices.join(" ") || "-"} | ${r.maskP} | ${r.tags.join(", ")} | ${r.status} |`
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
