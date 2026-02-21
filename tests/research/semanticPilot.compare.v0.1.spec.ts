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

// deterministic PRNG
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function top(counts: Map<string, number>) {
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  const [topVowel, topCount] = entries[0] ?? ["NONE", 0];
  const total = entries.reduce((s, [, v]) => s + v, 0);
  const dist = entries.map(([k, v]) => `${k}:${v}`).join(", ");
  return { topVowel, topCount, total, dist };
}

// permutation p-value: sample size n from global labels, compute maxCount, compare >= observedTopCount
function pValueMaxCount(
  labels: string[],
  n: number,
  observedTopCount: number,
  seedStr: string,
  iters = 2000
): number {
  if (n <= 0 || labels.length <= 0) return 1;
  const rng = mulberry32(hashSeed(seedStr));
  let ge = 0;

  for (let it = 0; it < iters; it++) {
    // sample with shuffle of indices (Fisher-Yates partial)
    const idx = Array.from({ length: labels.length }, (_, i) => i);
    for (let i = idx.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = idx[i];
      idx[i] = idx[j];
      idx[j] = tmp;
    }
    const counts = new Map<string, number>();
    for (let k = 0; k < n; k++) {
      const lab = labels[idx[k]];
      counts.set(lab, (counts.get(lab) ?? 0) + 1);
    }
    const m = top(counts).topCount;
    if (m >= observedTopCount) ge++;
  }
  return ge / iters;
}

function voicesForCase(c: CanonCase) {
  const ortho = extractOrthographyVoicesFromWordV0_1({ word: c.word }).voices;
  const carrier = typeof c.ipa === "string" && c.ipa.trim().length
    ? extractCarrierVoicesFromIpaV0_1(c.ipa).voices
    : [];
  return {
    mask: ortho,
    carrier,
    diverge: carrier.length ? !arrEq(ortho, carrier) : false,
  };
}

describe("Semantic Pilot compare v0.1 — multi-meta + permutation p-values", () => {
  it("writes tests/validation/out/semanticPilot.compare.v0.1.md", () => {
    const root = process.cwd();
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "semanticPilot.compare.v0.1.md");

    const train = readJson<Dataset>(path.join(root, "tests/validation/datasets/canonC2.train.v0.3.json"));
    const hold  = readJson<Dataset>(path.join(root, "tests/validation/datasets/canonC2.holdout.v0.3.json"));
    const cases: CanonCase[] = [...(train.cases || []), ...(hold.cases || [])];

    const metaPaths = [
      "tests/research/corpus70.meta.v0.1.gemini.json",
      "tests/research/corpus70.meta.v0.1.autotag.json",
    ].map((p) => path.join(root, p));

    const metas = metaPaths.map((p) => readJson<Meta>(p));

    // Precompute mask/carrier primaries per case
    const byId = new Map<string, { word: string; maskP: string; carP: string; hasCar: boolean; diverge: boolean }>();
    for (const c of cases) {
      const v = voicesForCase(c);
      const maskP = primaryOf(v.mask);
      const carP = v.carrier.length ? primaryOf(v.carrier) : "NONE";
      byId.set(String(c.id), { word: c.word, maskP, carP, hasCar: v.carrier.length > 0, diverge: v.diverge });
    }

    // Global carrier labels for permutation baseline
    const globalCarrierLabels = cases
      .map((c) => byId.get(String(c.id))!)
      .filter((x) => x.hasCar)
      .map((x) => x.carP);

    const lines: string[] = [];
    lines.push("# Semantic Pilot compare v0.1 — multi-meta + permutation p-values");
    lines.push("");
    lines.push(`- corpus: canonC2 v0.3 (70)`);
    lines.push(`- permutation iters: 2000`);
    lines.push("");

    for (const meta of metas) {
      lines.push(`## Meta: ${meta.version}`);
      lines.push("");
      lines.push("| Tag | N | Carrier N | Carrier top (purity) | p(max>=obs) | Diverge rate (carrier) |");
      lines.push("|-----|---:|----------:|----------------------|------------:|------------------------|");

      for (const tag of meta.allowedTags) {
        const ids = Object.keys(meta.tags || {}).filter((id) => (meta.tags[id] || []).includes(tag));
        const n = ids.length;

        let carrierN = 0;
        let divergeN = 0;

        const carrierCounts = new Map<string, number>();
        for (const id of ids) {
          const rec = byId.get(String(id));
          if (!rec) continue;
          if (!rec.hasCar) continue;
          carrierN++;
          carrierCounts.set(rec.carP, (carrierCounts.get(rec.carP) ?? 0) + 1);
          if (rec.diverge) divergeN++;
        }

        const t = top(carrierCounts);
        const topStr = carrierN ? `${t.topVowel} (${pct(t.topCount, t.total)})` : "-";
        const pval = carrierN ? pValueMaxCount(globalCarrierLabels, carrierN, t.topCount, `${meta.version}:${tag}`, 2000) : 1;

        const divergeRate = carrierN ? `${pct(divergeN, carrierN)} (${divergeN}/${carrierN})` : "-";
        lines.push(`| ${tag} | ${n} | ${carrierN} | **${topStr}** | ${pval.toFixed(3)} | ${divergeRate} |`);
      }

      lines.push("");
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
