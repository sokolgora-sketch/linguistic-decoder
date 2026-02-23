import fs from "fs";
import path from "path";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";

type Meta = { version: string; allowedTags: string[]; tags: Record<string, string[]> };
type CoreWord = { id: string; word: string; ipa: string };

type StressRow = {
  id: string;
  word: string;
  ipa: string;
  tag: string;
  anchor: string;
  anchorIpa: string;
};

const VOWELS = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
type Vowel = (typeof VOWELS)[number];
type Primary = Vowel | "NONE";

type Item = {
  id: string;
  word: string;
  ipa: string;
  tag: string;
  maskP: Primary;
  carrierP: Primary;
  status: "NO_PHONETIC" | "SYNC" | "DIVERGE";
  anchor: string;
  anchorIpa: string;
  anchorP: Primary;
  retains: boolean;
};

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}
function arr(x: any): string[] {
  return Array.isArray(x) ? x.map(String) : [];
}
function primaryOf(vs: string[]): Primary {
  const top = vs?.[0] ? String(vs[0]) : "NONE";
  return (VOWELS as readonly string[]).includes(top) ? (top as Vowel) : "NONE";
}
function statusOf(mask: string[], carrier: string[]): Item["status"] {
  if (!carrier.length) return "NO_PHONETIC";
  const m = primaryOf(mask);
  const c = primaryOf(carrier);
  return m === "NONE" || c === "NONE" ? "NO_PHONETIC" : m === c ? "SYNC" : "DIVERGE";
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

// p(match>=obs) by permutation: shuffle anchors against compounds (controls marginals)
function matchPvalue(items: Item[], iters: number, seed: number) {
  const usable = items.filter((x) => x.carrierP !== "NONE" && x.anchorP !== "NONE");
  const n = usable.length;
  if (!n) return { n: 0, obs: 0, p: 1 };

  const comp = usable.map((x) => x.carrierP);
  const anch = usable.map((x) => x.anchorP);
  const obs = usable.filter((x) => x.retains).length;

  const rnd = mulberry32(seed);
  let ge = 0;

  for (let k = 0; k < iters; k++) {
    const tmp = anch.slice();
    shuffleInPlace(tmp, rnd);
    let m = 0;
    for (let i = 0; i < n; i++) if (comp[i] === tmp[i]) m++;
    if (m >= obs) ge++;
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
    // id word ipa tag anchor anchorIpa
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s+(\S+)\s+(\S+)\s+(\/.*\/)\s*$/u);
    if (!m) continue;
    out.push({ id: m[1], word: m[2], ipa: m[3], tag: m[4], anchor: m[5], anchorIpa: m[6] });
  }
  return out;
}

describe("Compound Stress Albanian200 v0.2 — root-anchored retention (Position, Order)", () => {
  it("writes tests/validation/out/compoundStress.albanian200.v0.2.md", () => {
    const root = process.cwd();
    const coreWordsPath = path.join(root, "tests/research/albanian200.words.v0.1.txt");
    const metaPath = path.join(root, "tests/research/albanian200.meta.v0.1.mixed.json");
    const stressPath = path.join(root, "tests/research/albanian200.compoundStress.v0.2.txt");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "compoundStress.albanian200.v0.2.md");

    if (!fs.existsSync(coreWordsPath)) throw new Error(`Missing: ${coreWordsPath}`);
    if (!fs.existsSync(metaPath)) throw new Error(`Missing: ${metaPath}`);
    if (!fs.existsSync(stressPath)) throw new Error(`Missing: ${stressPath}`);

    const coreWords = parseCoreWordsFile(fs.readFileSync(coreWordsPath, "utf8"));
    if (coreWords.length !== 200) throw new Error(`Expected 200 core words, got ${coreWords.length}`);

    const meta = readJson<Meta>(metaPath);
    const allowedTags = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
    if (!allowedTags.length) throw new Error("Meta.allowedTags missing/empty");

    const stressRows = parseStressFile(fs.readFileSync(stressPath, "utf8"));
    if (!stressRows.length) throw new Error("Stress file empty/unparseable");

    const items: Item[] = stressRows.map((r) => {
      const maskOut = extractOrthographyVoicesFromWordV0_1({ word: r.word, langHint: "sq" });
      const maskVoices = arr((maskOut as any)?.voices);

      const carOut = extractCarrierVoicesFromIpaV0_1(r.ipa);
      const carrierVoices = arr((carOut as any)?.voices);

      const ancOut = extractCarrierVoicesFromIpaV0_1(r.anchorIpa);
      const anchorVoices = arr((ancOut as any)?.voices);

      const maskP = primaryOf(maskVoices);
      const carrierP = primaryOf(carrierVoices);
      const anchorP = primaryOf(anchorVoices);
      const status = statusOf(maskVoices, carrierVoices);
      const retains = carrierP !== "NONE" && anchorP !== "NONE" && carrierP === anchorP;

      return {
        id: r.id,
        word: r.word,
        ipa: r.ipa,
        tag: r.tag,
        maskP,
        carrierP,
        status,
        anchor: r.anchor,
        anchorIpa: r.anchorIpa,
        anchorP,
        retains,
      };
    });

    const noAnchor = items.filter((x) => x.anchorP === "NONE").length;
    if (noAnchor) throw new Error(`Expected 0 anchorP NONE, got ${noAnchor}`);

    const ITERS = 4000;
    const SEED = 90920021;

    const byTag = (tag: string) => items.filter((x) => x.tag === tag);

    const pos = byTag("position");
    const ord = byTag("order");

    const posPv = matchPvalue(pos, ITERS, SEED ^ 0xA11CE);
    const ordPv = matchPvalue(ord, ITERS, SEED ^ 0x0RD3R);

    const fmt = (x: { obs: number; p: number }) => `${x.obs}/${x.p === 0 ? "<0.001" : x.p.toFixed(3)}`;
    const rate = (xs: Item[]) => {
      const usable = xs.filter((x) => x.carrierP !== "NONE" && x.anchorP !== "NONE");
      return usable.length ? (usable.filter((x) => x.retains).length / usable.length) : 0;
    };

    fs.mkdirSync(outDir, { recursive: true });

    const lines: string[] = [];
    lines.push("# Compound Stress Albanian200 v0.2 — root-anchored retention");
    lines.push("");
    lines.push("- Purpose: test whether compound carrier primary retains the anchor root’s carrier primary.");
    lines.push(`- core corpus: \`tests/research/albanian200.words.v0.1.txt\` (${coreWords.length})`);
    lines.push(`- stress corpus: \`tests/research/albanian200.compoundStress.v0.2.txt\` (${stressRows.length})`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");

    lines.push("## Retention summary (carrierP(compound) == carrierP(anchor))");
    lines.push("");
    lines.push("| Tag | N | Retain% | matches/p |");
    lines.push("|-----|--:|--------:|-----------|");
    lines.push(`| position | ${posPv.n} | ${(rate(pos) * 100).toFixed(1)}% | ${fmt(posPv)} |`);
    lines.push(`| order | ${ordPv.n} | ${(rate(ord) * 100).toFixed(1)}% | ${fmt(ordPv)} |`);
    lines.push("");

    const mismatches = items.filter((x) => x.carrierP !== "NONE" && x.anchorP !== "NONE" && !x.retains);

    lines.push("## Mismatch cases (washout candidates)");
    lines.push("");
    lines.push("| ID | Word | Tag | IPA | CarrierP | Anchor | AnchorIPA | AnchorP |");
    lines.push("|---:|------|-----|-----|----------|--------|----------|---------|");
    for (const r of mismatches.slice().sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(
        `| ${r.id} | **${r.word}** | ${r.tag} | ${r.ipa} | ${r.carrierP} | ${r.anchor} | ${r.anchorIpa} | ${r.anchorP} |`
      );
    }
    lines.push("");

    lines.push("## All cases");
    lines.push("");
    lines.push("| ID | Word | Tag | IPA | CarrierP | Anchor | AnchorP | Retains | Status |");
    lines.push("|---:|------|-----|-----|----------|--------|---------|---------|--------|");
    for (const r of items.slice().sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(
        `| ${r.id} | **${r.word}** | ${r.tag} | ${r.ipa} | ${r.carrierP} | ${r.anchor} | ${r.anchorP} | ${r.retains ? "YES" : "NO"} | ${r.status} |`
      );
    }
    lines.push("");

    lines.push("## Notes");
    lines.push("");
    lines.push("- p-values are permutation p(match>=obs) by shuffling anchor primaries against compound primaries within the tag bucket.");
    lines.push("- This is a diagnostic harness; it emits no proof claim.");
    lines.push("");

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
