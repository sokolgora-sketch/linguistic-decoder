import fs from "fs";
import path from "path";

import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";
import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";

type CoreMeta = { version: string; allowedTags: string[]; tags: Record<string, string[]> };
type CoreWord = { id: string; word: string; ipa: string };

type StressRow = { id: string; word: string; ipa: string; tag: string };

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

const VOWELS = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
type Vowel = (typeof VOWELS)[number];

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function arr(x: any): string[] {
  return Array.isArray(x) ? x.map(String) : [];
}
function primaryOf(voices: string[]): string {
  return voices.length ? String(voices[0]) : "NONE";
}
function statusOf(maskVoices: string[], carrierVoices: string[]): Item["status"] {
  if (!carrierVoices.length) return "NO_PHONETIC";
  if (!maskVoices.length) return "DIVERGE";
  return maskVoices[0] === carrierVoices[0] ? "SYNC" : "DIVERGE";
}

// Simple deterministic PRNG
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

// p(count>=obs) by permutation of carrier primaries inside the tag bucket
function anchorPvalue(items: Item[], tag: string, anchor: Vowel, iters: number, seed: number) {
  // Correct null: shuffle carrier primaries ACROSS all items (within this set),
  // then recompute how many anchors land in the tag bucket.
  const bucketIdx: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].tags.includes(tag)) bucketIdx.push(i);
  }

  const permIdx: number[] = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].carrierP !== "NONE") permIdx.push(i);
  }

  const primaries = permIdx.map((i) => items[i].carrierP);
  const obs = bucketIdx.filter((i) => items[i].carrierP === anchor).length;

  const n = bucketIdx.length;
  if (!n) return { n: 0, obs: 0, p: 1 };

  const pos = new Map<number, number>();
  for (let k = 0; k < permIdx.length; k++) pos.set(permIdx[k], k);

  const rnd = mulberry32(seed);
  let ge = 0;

  for (let k = 0; k < iters; k++) {
    const tmp = primaries.slice();
    shuffleInPlace(tmp, rnd);

    let c = 0;
    for (const i of bucketIdx) {
      const pk = pos.get(i);
      if (pk == null) continue;
      if (tmp[pk] === anchor) c++;
    }
    if (c >= obs) ge++;
  }

  return { n, obs, p: ge / iters };
}


function parseCoreWordsFile(text: string): CoreWord[] {
  const out: CoreWord[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s*$/u);
    if (!m) continue;
    out.push({ id: m[1], word: m[2], ipa: m[3] });
  }
  return out;
}
function parseStressFile(text: string): StressRow[] {
  const out: StressRow[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    // id word ipa tag
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s+(\S+)\s*$/u);
    if (!m) continue;
    out.push({ id: m[1], word: m[2], ipa: m[3], tag: m[4] });
  }
  return out;
}

function buildCoreItems(words: CoreWord[], meta: CoreMeta): Item[] {
  const allowedTags = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
  const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};
  return words.map((w) => {
    const tags = arr((tagMap as any)[w.id]).filter((t) => allowedTags.includes(t));
    const maskOut = extractOrthographyVoicesFromWordV0_1({ word: w.word, langHint: "sq" });
    const maskVoices = arr((maskOut as any)?.voices);
    const carOut = extractCarrierVoicesFromIpaV0_1(w.ipa);
    const carrierVoices = arr((carOut as any)?.voices);
    const maskP = primaryOf(maskVoices);
    const carrierP = primaryOf(carrierVoices);
    const st = statusOf(maskVoices, carrierVoices);
    return { id: w.id, word: w.word, ipa: w.ipa, tags, maskVoices, carrierVoices, maskP, carrierP, status: st };
  });
}

function buildStressItems(rows: StressRow[]): Item[] {
  return rows.map((r) => {
    const maskOut = extractOrthographyVoicesFromWordV0_1({ word: r.word, langHint: "sq" });
    const maskVoices = arr((maskOut as any)?.voices);
    const carOut = extractCarrierVoicesFromIpaV0_1(r.ipa);
    const carrierVoices = arr((carOut as any)?.voices);
    const maskP = primaryOf(maskVoices);
    const carrierP = primaryOf(carrierVoices);
    const st = statusOf(maskVoices, carrierVoices);
    return { id: r.id, word: r.word, ipa: r.ipa, tags: [r.tag], maskVoices, carrierVoices, maskP, carrierP, status: st };
  });
}

function distForTag(items: Item[], tag: string) {
  const bucket = items.filter((x) => x.tags.includes(tag));
  const map = new Map<string, number>();
  for (const v of VOWELS) map.set(v, 0);
  for (const b of bucket) {
    if (map.has(b.carrierP)) map.set(b.carrierP, (map.get(b.carrierP) ?? 0) + 1);
  }
  const parts = VOWELS.map((v) => `${v}:${map.get(v) ?? 0}`);
  return { n: bucket.length, dist: parts.join(", ") };
}

describe("Compound Stress Albanian200 v0.1 — durability probe (Position→A, Order→I)", () => {
  it("writes tests/validation/out/compoundStress.albanian200.v0.1.md", () => {
    const root = process.cwd();

    const coreWordsPath = path.join(root, "tests/research/albanian200.words.v0.1.txt");
    const coreMetaPath = path.join(root, "tests/research/albanian200.meta.v0.1.mixed.json");
    const stressPath = path.join(root, "tests/research/albanian200.compoundStress.v0.1.txt");

    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "compoundStress.albanian200.v0.1.md");

    if (!fs.existsSync(coreWordsPath)) throw new Error(`Missing: ${coreWordsPath}`);
    if (!fs.existsSync(coreMetaPath)) throw new Error(`Missing: ${coreMetaPath}`);
    if (!fs.existsSync(stressPath)) throw new Error(`Missing: ${stressPath}`);

    const coreWords = parseCoreWordsFile(fs.readFileSync(coreWordsPath, "utf8"));
    if (coreWords.length !== 200) throw new Error(`Expected 200 core words, got ${coreWords.length}`);

    const meta = readJson<CoreMeta>(coreMetaPath);
    const coreItems = buildCoreItems(coreWords, meta);

    const stressRows = parseStressFile(fs.readFileSync(stressPath, "utf8"));
    if (stressRows.length < 10) throw new Error(`Expected >=10 stress rows, got ${stressRows.length}`);
    const stressItems = buildStressItems(stressRows);

    const noCarrierCore = coreItems.filter((x) => x.status === "NO_PHONETIC").length;
    if (noCarrierCore) throw new Error(`Expected 0 NO_PHONETIC in core, got ${noCarrierCore}`);

    const noCarrierStress = stressItems.filter((x) => x.status === "NO_PHONETIC").length;
    if (noCarrierStress) throw new Error(`Expected 0 NO_PHONETIC in stress set, got ${noCarrierStress}`);

    const ITERS = 3000;
    const SEED = 90920011;

    const corePos = anchorPvalue(coreItems, "position", "A", ITERS, SEED);
    const coreOrd = anchorPvalue(coreItems, "order", "I", ITERS, SEED);

    const stressPos = anchorPvalue(stressItems, "position", "A", ITERS, SEED);
    const stressOrd = anchorPvalue(stressItems, "order", "I", ITERS, SEED);

    const lines: string[] = [];
    lines.push("# Compound Stress Albanian200 v0.1");
    lines.push("");
    lines.push("- Purpose: durability probe for Position→A and Order→I under morphological complexity.");
    lines.push(`- core corpus: \`tests/research/albanian200.words.v0.1.txt\` (${coreWords.length})`);
    lines.push(`- stress corpus: \`tests/research/albanian200.compoundStress.v0.1.txt\` (${stressRows.length})`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");

    lines.push("## Core vs Stress — anchor cells");
    lines.push("");
    lines.push("| Anchor | Core N | Core obs/p | Stress N | Stress obs/p |");
    lines.push("|--------|-------:|------------|---------:|--------------|");
    lines.push(`| position→A | ${corePos.n} | ${corePos.obs}/${corePos.p === 0 ? "<0.001" : corePos.p.toFixed(3)} | ${stressPos.n} | ${stressPos.obs}/${stressPos.p === 0 ? "<0.001" : stressPos.p.toFixed(3)} |`);
    lines.push(`| order→I | ${coreOrd.n} | ${coreOrd.obs}/${coreOrd.p === 0 ? "<0.001" : coreOrd.p.toFixed(3)} | ${stressOrd.n} | ${stressOrd.obs}/${stressOrd.p === 0 ? "<0.001" : stressOrd.p.toFixed(3)} |`);
    lines.push("");

    lines.push("## Core distributions (carrierP)");
    lines.push("");
    lines.push(`- position: N=${distForTag(coreItems, "position").n} dist=${distForTag(coreItems, "position").dist}`);
    lines.push(`- order: N=${distForTag(coreItems, "order").n} dist=${distForTag(coreItems, "order").dist}`);
    lines.push("");

    lines.push("## Stress distributions (carrierP)");
    lines.push("");
    lines.push(`- position: N=${distForTag(stressItems, "position").n} dist=${distForTag(stressItems, "position").dist}`);
    lines.push(`- order: N=${distForTag(stressItems, "order").n} dist=${distForTag(stressItems, "order").dist}`);
    lines.push("");

    lines.push("## Stress cases");
    lines.push("");
    lines.push("| ID | Word | Tag | IPA | MaskP | CarrierP | Status |");
    lines.push("|---:|------|-----|-----|-------|----------|--------|");
    for (const r of stressItems.slice().sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(`| ${r.id} | **${r.word}** | ${r.tags[0]} | ${r.ipa} | ${r.maskP} | ${r.carrierP} | ${r.status} |`);
    }
    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push("- p-values are p(count>=obs) under permutation shuffle of carrier primaries within the tag bucket.");
    lines.push("- This is a diagnostic view; no proof claim is emitted by the harness.");
    lines.push("");

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
