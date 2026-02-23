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

const VOWELS = ["A", "E", "I", "O", "U", "Y", "Ë"] as const;
type Vowel = (typeof VOWELS)[number];

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

// deterministic rng (copy doctrine)
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
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/)\s*$/u);
    if (!m) throw new Error(`Bad words line (expected: id<ws>word<ws>/ipa/): ${line}`);
    out.push({ id: m[1], word: m[2], ipa: m[3] });
  }
  return out;
}

function buildItems(words: WordRow[], meta: Meta): Item[] {
  const allowed = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
  const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};
  return words.map((w) => {
    const tags = arr(tagMap[w.id]).filter((t) => allowed.includes(t));

    const maskOut = extractOrthographyVoicesFromWordV0_1({ word: w.word, langHint: "sq" });
    const maskVoices = arr(maskOut?.voices);

    const carOut = extractCarrierVoicesFromIpaV0_1(w.ipa);
    const carrierVoices = arr(carOut?.voices);

    const maskP = primaryOf(maskVoices);
    const carrierP = primaryOf(carrierVoices);

    return {
      id: w.id,
      word: w.word,
      ipa: w.ipa,
      tags,
      maskVoices,
      carrierVoices,
      maskP,
      carrierP,
      status: statusOf(maskVoices, carrierVoices),
    };
  });
}

type Cell = { obs: number; p: number };
type TagRow = { tag: string; n: number; cells: Record<Vowel, Cell> };

// p(count>=obs) for each (tag, vowel) under permutation shuffle of carrier primaries
function matrixPvalues(items: Item[], allowedTags: string[], iters: number, seed: number): TagRow[] {
  const rnd = mulberry32(seed);

  const usable = items.filter((x) => x.carrierP !== "NONE");
  const primaries = usable.map((x) => x.carrierP);

  // precompute indices for each tag within usable[]
  const tagIdxs = new Map<string, number[]>();
  for (const tag of allowedTags) tagIdxs.set(tag, []);
  for (let i = 0; i < usable.length; i++) {
    const u = usable[i];
    for (const tag of u.tags) {
      if (tagIdxs.has(tag)) tagIdxs.get(tag)!.push(i);
    }
  }

  // observed counts
  const obs = new Map<string, Record<Vowel, number>>();
  for (const tag of allowedTags) {
    const idxs = tagIdxs.get(tag)!;
    const o: Record<Vowel, number> = { A:0,E:0,I:0,O:0,U:0,Y:0,Ë:0 };
    for (const i of idxs) {
      const p = primaries[i] as any;
      if (VOWELS.includes(p)) o[p as Vowel] += 1;
    }
    obs.set(tag, o);
  }

  // hits counts for p-values
  const hits = new Map<string, Record<Vowel, number>>();
  for (const tag of allowedTags) hits.set(tag, { A:0,E:0,I:0,O:0,U:0,Y:0,Ë:0 });

  for (let it = 0; it < iters; it++) {
    const shuf = primaries.slice();
    shuffleInPlace(shuf, rnd);

    for (const tag of allowedTags) {
      const idxs = tagIdxs.get(tag)!;
      const o = obs.get(tag)!;
      const h = hits.get(tag)!;

      // count per vowel in this permutation
      const c: Record<Vowel, number> = { A:0,E:0,I:0,O:0,U:0,Y:0,Ë:0 };
      for (const i of idxs) {
        const p = shuf[i] as any;
        if (VOWELS.includes(p)) c[p as Vowel] += 1;
      }

      for (const v of VOWELS) {
        if (c[v] >= o[v]) h[v] += 1;
      }
    }
  }

  // assemble output
  const out: TagRow[] = [];
  for (const tag of allowedTags) {
    const idxs = tagIdxs.get(tag)!;
    const o = obs.get(tag)!;
    const h = hits.get(tag)!;
    const cells: Record<Vowel, Cell> = {
      A:{obs:o.A,p:h.A/iters},
      E:{obs:o.E,p:h.E/iters},
      I:{obs:o.I,p:h.I/iters},
      O:{obs:o.O,p:h.O/iters},
      U:{obs:o.U,p:h.U/iters},
      Y:{obs:o.Y,p:h.Y/iters},
      Ë:{obs:o.Ë,p:h.Ë/iters},
    };
    out.push({ tag, n: idxs.length, cells });
  }
  return out;
}

describe("Semantic Pilot Albanian150 MATRIX v0.1 — Tag×Vowel p-matrix (Albanian (sq), IPA required)", () => {
  it("writes tests/validation/out/semanticPilot.albanian150.matrix.v0.1.md", () => {
    const root = process.cwd();
    const wordsPath = path.join(root, "tests/research/albanian150.words.v0.1.txt");
    const metaPath = path.join(root, "tests/research/albanian150.meta.v0.1.mixed.json");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "semanticPilot.albanian150.matrix.v0.1.md");

    if (!fs.existsSync(wordsPath)) throw new Error(`Missing words file: ${wordsPath}`);
    if (!fs.existsSync(metaPath)) throw new Error(`Missing meta file: ${metaPath}`);

    const words = parseWordsFile(fs.readFileSync(wordsPath, "utf8"));
    if (words.length !== 150) throw new Error(`Expected 150 albanian words, got ${words.length}`);

    const meta = readJson<Meta>(metaPath);
    const allowedTags = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
    if (!allowedTags.length) throw new Error("Meta.allowedTags missing/empty");

    const items = buildItems(words, meta);
    const noCarrier = items.filter((x) => x.carrierP === "NONE").length;
    if (noCarrier) throw new Error(`Expected 0 NO_PHONETIC in Albanian150, got ${noCarrier}`);

    const ITERS = 2000;
    const SEED = 246801357;

    const rows = matrixPvalues(items, allowedTags, ITERS, SEED);

    const lines: string[] = [];
    lines.push("# Semantic Pilot Albanian150 MATRIX v0.1 — Tag×Vowel p-matrix (Albanian (sq))");
    lines.push("");
    lines.push(`- corpus: Albanian150 (150)`);
    lines.push(`- meta: ${meta.version ?? "unknown"}`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push(`- seed: ${SEED}`);
    lines.push("");
    lines.push("## Tag×Vowel table");
    lines.push("");
    lines.push("| Tag | N | A obs/p | E obs/p | I obs/p | O obs/p | U obs/p | Y obs/p | Ë obs/p |");
    lines.push("|-----|---:|---------|---------|---------|---------|---------|---------|---------|");

    for (const r of rows) {
      const c = r.cells;
      const fmt = (v: Vowel) => `${c[v].obs}/${c[v].p.toFixed(3)}`;
      lines.push(
        `| ${r.tag} | ${r.n} | ${fmt("A")} | ${fmt("E")} | ${fmt("I")} | ${fmt("O")} | ${fmt("U")} | ${fmt("Y")} | ${fmt("Ë")} |`
      );
    }

    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push("- p-values are per-cell p(count>=obs) under permutation shuffle of carrier primaries.");
    lines.push("- This is a diagnostic view to decide what to target for Albanian200 (not a proof claim).");
    lines.push("");

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\\n") + "\\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
