import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

type CanonCase = { id: string; word: string; ipa?: string };
type Dataset = { version: string; cases: CanonCase[] };

type Meta = {
  version: string;
  allowedTags: string[];
  tags: Record<string, string[]>;
};

type ClassicalWord = { id: string; word: string; ipa: string };

type Item = {
  id: string;
  word: string;
  ipa: string | null;
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

function statusOf(mask: string[], carrier: string[]): "NO_PHONETIC" | "SYNC" | "DIVERGE" {
  if (carrier.length === 0) return "NO_PHONETIC";
  return arrEq(mask, carrier) ? "SYNC" : "DIVERGE";
}

function pct(n: number, d: number): string {
  if (!d) return "0.0%";
  return ((n / d) * 100).toFixed(1) + "%";
}

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

type TagAgg = {
  n: number;
  carrierN: number;
  divergeN: number;
  carrierCounts: Map<string, number>;
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
      carrierCounts: new Map(),
    });
  }

  for (const it of items) {
    for (const tag of it.tags) {
      const agg = m.get(tag);
      if (!agg) continue;
      agg.n++;
      if (it.carrierVoices.length) {
        agg.carrierN++;
        agg.carrierCounts.set(it.carrierP, (agg.carrierCounts.get(it.carrierP) ?? 0) + 1);
        if (it.status === "DIVERGE") agg.divergeN++;
      }
    }
  }

  return m;
}

// Shuffle carrier primaries across items within THIS subset; tags fixed.
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

function parseClassicalWordsFile(s: string): ClassicalWord[] {
  const lines = s.split("\n").map((x) => x.trim()).filter(Boolean);
  const out: ClassicalWord[] = [];
  for (const line of lines) {
    // id <ws> word <ws> /ipa/
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s*$/u);
    if (!m) throw new Error(`Bad classical words line (expected: id<ws>word<ws>/ipa/): ${line}`);
    out.push({ id: m[1], word: m[2], ipa: m[3] });
  }
  return out;
}

function buildCorpus70Items(root: string, meta: Meta): Item[] {
  const trainPath = path.join(root, "tests/validation/datasets/canonC2.train.v0.3.json");
  const holdPath = path.join(root, "tests/validation/datasets/canonC2.holdout.v0.3.json");

  const train = readJson<Dataset>(trainPath);
  const hold = readJson<Dataset>(holdPath);
  const cases = [...(train.cases ?? []), ...(hold.cases ?? [])];

  const allowed = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
  const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};

  return cases.map((c) => {
    const tags = arr(tagMap[String(c.id)]).filter((t) => allowed.includes(t));
    const word = String(c.word ?? "");
    const ipa = typeof (c as any).ipa === "string" ? String((c as any).ipa) : "";

    const maskOut = extractOrthographyVoicesFromWordV0_1({ word });
    const maskVoices = arr(maskOut?.voices);

    const carOut = extractCarrierVoicesFromIpaV0_1(ipa);
    const carrierVoices = arr(carOut?.voices);

    const maskP = primaryOf(maskVoices);
    const carrierP = primaryOf(carrierVoices);
    const st = statusOf(maskVoices, carrierVoices);

    return {
      id: String(c.id ?? ""),
      word,
      ipa: ipa || null,
      tags,
      maskVoices,
      carrierVoices,
      maskP,
      carrierP,
      status: st,
    };
  });
}

function buildClassicalItems(root: string, meta: Meta): Item[] {
  const wordsPath = path.join(root, "tests/research/classical100.words.v0.1.txt");
  const words = parseClassicalWordsFile(fs.readFileSync(wordsPath, "utf8"));

  const allowed = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
  const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};

  return words.map((w) => {
    const tags = arr(tagMap[w.id]).filter((t) => allowed.includes(t));

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
      tags,
      maskVoices,
      carrierVoices,
      maskP,
      carrierP,
      status: st,
    };
  });
}

function buildAlbanianItems(root: string, meta: Meta): Item[] {
  const wordsPath = path.join(root, "tests/research/albanian100.words.v0.1.txt");
  const words = parseClassicalWordsFile(fs.readFileSync(wordsPath, "utf8"));

  const allowed = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
  const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};

  return words.map((w) => {
    const tags = arr(tagMap[w.id]).filter((tt) => allowed.includes(tt));

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
}

function corpusSummary(items: Item[]) {
  const total = items.length;
  const carrierN = items.filter((x) => x.carrierVoices.length > 0).length;
  const noPhon = total - carrierN;
  const divergeN = items.filter((x) => x.carrierVoices.length > 0 && x.status === "DIVERGE").length;
  const divergeRate = carrierN ? `${pct(divergeN, carrierN)} (${divergeN}/${carrierN})` : "-";
  return { total, carrierN, noPhon, divergeN, divergeRate };
}

type CorpusBlock = {
  key: string;
  title: string;
  metaVersion: string;
  allowedTags: string[];
  items: Item[];
  iters: number;
  seed: number;
};

function writeCorpusBlock(lines: string[], block: CorpusBlock) {
  const { total, carrierN, noPhon, divergeRate } = corpusSummary(block.items);

  const tagAgg = buildTagAgg(block.allowedTags, block.items);
  const pvals = permutationPvalues(block.allowedTags, block.items, block.iters, block.seed);

  lines.push(`## ${block.title}`);
  lines.push("");
  lines.push(`- meta: \`${block.metaVersion}\``);
  lines.push(`- N: **${total}** (carrier=${carrierN}, NO_PHONETIC=${noPhon}, diverge=${divergeRate})`);
  lines.push("");
  lines.push("| Tag | N | Carrier top (purity) | p(max>=obs) | Carrier dist | Diverge rate (tag) |");
  lines.push("|-----|---:|----------------------|------------:|--------------|-------------------|");

  for (const tag of block.allowedTags) {
    const agg = tagAgg.get(tag)!;
    const top = topOf(agg.carrierCounts);
    const topStr = agg.carrierN ? `${top.topVowel} (${pct(top.topCount, top.total)})` : "NONE";
    const p = pvals[tag] ?? 1;
    const tagDiv = agg.carrierN ? `${pct(agg.divergeN, agg.carrierN)} (${agg.divergeN}/${agg.carrierN})` : "-";
    lines.push(`| ${tag} | ${agg.n} | **${topStr}** | ${p.toFixed(3)} | ${top.dist || "-"} | ${tagDiv} |`);
  }

  // “spectrogram highlight”: show tags with p <= 0.10
  const P_THRESHOLD = 0.10;
  const low = block.allowedTags.filter((t) => (pvals[t] ?? 1) <= P_THRESHOLD);
  lines.push("");
  lines.push(`### Low-p tags (p <= ${P_THRESHOLD.toFixed(2)})`);
  lines.push("");
  if (!low.length) {
    lines.push("_none_");
    lines.push("");
    return;
  }

  for (const tag of low) {
    const agg = tagAgg.get(tag)!;
    const top = topOf(agg.carrierCounts);
    const p = pvals[tag] ?? 1;
    lines.push(`- **${tag}**: top=${top.topVowel} (${pct(top.topCount, top.total)}), p=${p.toFixed(3)}, carrierN=${agg.carrierN}`);
  }
  lines.push("");
}

describe("Comparative Spectrogram v0.2 — Corpus70 vs Classical100 (+ Albanian100) (and Latin/Greek split)", () => {
  it("writes tests/validation/out/spectrogram.v0.2.md", () => {
    const root = process.cwd();
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "spectrogram.v0.2.md");

    const corpus70MetaPath = path.join(root, "tests/research/corpus70.meta.v0.1.gemini.json");
    const classicalMetaPath = path.join(root, "tests/research/classical100.meta.v0.1.gemini-blind.json");
      const albanianMetaPath = path.join(root, "tests/research/albanian100.meta.v0.1.gemini-blind.json");

    if (!fs.existsSync(corpus70MetaPath)) throw new Error(`Missing: ${corpus70MetaPath}`);
    if (!fs.existsSync(classicalMetaPath)) throw new Error(`Missing: ${classicalMetaPath}`);
      if (!fs.existsSync(albanianMetaPath)) throw new Error(`Missing: ${albanianMetaPath}`);

    const meta70 = readJson<Meta>(corpus70MetaPath);
    const metaC = readJson<Meta>(classicalMetaPath);
      const metaSq = readJson<Meta>(albanianMetaPath);

    const items70 = buildCorpus70Items(root, meta70);
    const itemsC = buildClassicalItems(root, metaC);
      const itemsSq = buildAlbanianItems(root, metaSq);

    const itemsLat = itemsC.filter((x) => x.id.startsWith("c3.lat."));
    const itemsGrk = itemsC.filter((x) => x.id.startsWith("c3.grk."));

    const tags = Array.isArray(metaC.allowedTags) ? metaC.allowedTags.map(String) : [];
      const tagsSq = Array.isArray(metaSq.allowedTags) ? metaSq.allowedTags.map(String) : [];
    if (!tags.length) throw new Error("classical meta allowedTags missing");
      if (!arrEq(tagsSq, tags)) throw new Error("albanian meta allowedTags mismatch vs classical");

    const ITERS = 2000;

    const blocks: CorpusBlock[] = [
      {
        key: "corpus70",
        title: "Corpus70 (English-heavy) — Gemini-blind tags",
        metaVersion: String(meta70.version ?? "unknown"),
        allowedTags: Array.isArray(meta70.allowedTags) ? meta70.allowedTags.map(String) : [],
        items: items70,
        iters: ITERS,
        seed: 7007007,
      },
      {
        key: "classical100",
        title: "Classical100 (Latin+Greek) — Gemini-blind tags",
        metaVersion: String(metaC.version ?? "unknown"),
        allowedTags: tags,
        items: itemsC,
        iters: ITERS,
        seed: 1001001,
      },
        {
          key: "albanian100",
          title: "Albanian100 (sq) — IPA-required, Gemini-blind tags",
          metaVersion: String(metaSq.version ?? "unknown"),
          allowedTags: tags,
          items: itemsSq,
          iters: ITERS,
          seed: 444444,
        },

      {
        key: "latin",
        title: "Classical100 split — Latin-only",
        metaVersion: String(metaC.version ?? "unknown"),
        allowedTags: tags,
        items: itemsLat,
        iters: ITERS,
        seed: 222222,
      },
      {
        key: "greek",
        title: "Classical100 split — Greek-only",
        metaVersion: String(metaC.version ?? "unknown"),
        allowedTags: tags,
        items: itemsGrk,
        iters: ITERS,
        seed: 333333,
      },
    ];

    const lines: string[] = [];
    lines.push("# Comparative Spectrogram v0.2 — Tag ↔ Carrier Fingerprints");
    lines.push("");
    lines.push("Goal: demonstrate language-specific, reproducible carrier distributions (7-voice reduction) with permutation chance floors.");
    lines.push("");
    lines.push(`- permutation iters: **${ITERS}**`);
    lines.push(`- tags: ${tags.join(", ")}`);
    lines.push("");

    for (const b of blocks) writeCorpusBlock(lines, b);

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
