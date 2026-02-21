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

function statusOf(mask: string[], carrier: string[]): "NO_PHONETIC" | "SYNC" | "DIVERGE" {
  if (carrier.length === 0) return "NO_PHONETIC";
  return arrEq(mask, carrier) ? "SYNC" : "DIVERGE";
}

function pct(n: number, d: number): string {
  if (!d) return "0.0%";
  return ((n / d) * 100).toFixed(1) + "%";
}

// deterministic RNG (mulberry32)
function rng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffleInPlace<T>(a: T[], rand: () => number) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
}

type Row = {
  id: string;
  word: string;
  tags: string[];
  maskVoices: string[];
  carrierVoices: string[];
  maskP: string;
  carrierP: string;
  status: "NO_PHONETIC" | "SYNC" | "DIVERGE";
};

type CompareRow = {
  tag: string;
  n: number;
  carrierN: number;
  topVowel: string;
  topPurity: number; // 0..1
  p: number; // p(max>=obs)
  divergeN: number;
};

function computeCompare(rows: Row[], allowedTags: string[], iters: number, seed = 12345): CompareRow[] {
  // only consider rows with carrier present for permutation pool
  const carrierIdx: number[] = [];
  const carrierPrimaries: string[] = [];
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].carrierVoices.length > 0) {
      carrierIdx.push(i);
      carrierPrimaries.push(rows[i].carrierP);
    }
  }

  // observed per-tag counts
  const tagMembers: Record<string, number[]> = {};
  for (const t of allowedTags) tagMembers[t] = [];

  for (let i = 0; i < rows.length; i++) {
    for (const t of rows[i].tags) {
      if (t in tagMembers) tagMembers[t].push(i);
    }
  }

  function observedForTag(t: string) {
    const members = tagMembers[t] || [];
    const counts = new Map<string, number>();
    let carrierN = 0;
    let divergeN = 0;
    for (const i of members) {
      const r = rows[i];
      if (r.carrierVoices.length === 0) continue;
      carrierN++;
      counts.set(r.carrierP, (counts.get(r.carrierP) ?? 0) + 1);
      if (r.status === "DIVERGE") divergeN++;
    }
    let topVowel = "NONE";
    let topCount = 0;
    for (const [k, v] of counts.entries()) {
      if (v > topCount || (v === topCount && String(k) < String(topVowel))) {
        topVowel = k;
        topCount = v;
      }
    }
    const topPurity = carrierN ? topCount / carrierN : 0;
    return { carrierN, divergeN, topVowel, topPurity };
  }

  const observed: Record<string, { carrierN: number; divergeN: number; topVowel: string; topPurity: number }> = {};
  for (const t of allowedTags) observed[t] = observedForTag(t);

  // permutation p(max>=obs)
  const hits: Record<string, number> = {};
  for (const t of allowedTags) hits[t] = 0;

  const rand = rng(seed);
  const pool = carrierPrimaries.slice();

  // Map from carrier row index -> pool position (for assignment)
  // We'll shuffle pool and assign pool[k] to carrierIdx[k]
  for (let iter = 0; iter < iters; iter++) {
    shuffleInPlace(pool, rand);

    // build assigned carrier primary per row (only for carrier rows)
    const assigned = new Map<number, string>();
    for (let k = 0; k < carrierIdx.length; k++) assigned.set(carrierIdx[k], pool[k]);

    for (const t of allowedTags) {
      const obs = observed[t];
      if (!obs.carrierN) continue;

      const counts = new Map<string, number>();
      let carrierN = 0;

      for (const i of tagMembers[t] || []) {
        if (!assigned.has(i)) continue;
        carrierN++;
        const v = assigned.get(i)!;
        counts.set(v, (counts.get(v) ?? 0) + 1);
      }

      if (!carrierN) continue;

      let topCount = 0;
      for (const v of counts.values()) topCount = Math.max(topCount, v);
      const maxPurity = topCount / carrierN;

      if (maxPurity >= obs.topPurity) hits[t] += 1;
    }
  }

  const out: CompareRow[] = [];
  for (const t of allowedTags) {
    const n = (tagMembers[t] || []).length;
    const obs = observed[t];
    const p = iters ? hits[t] / iters : 1;
    out.push({
      tag: t,
      n,
      carrierN: obs.carrierN,
      topVowel: obs.topVowel,
      topPurity: obs.topPurity,
      p,
      divergeN: obs.divergeN,
    });
  }
  return out.sort((a, b) => a.p - b.p || b.carrierN - a.carrierN || a.tag.localeCompare(b.tag));
}

describe("Semantic Pilot drilldown v0.1 — list cases for low-p tags", () => {
  it("writes tests/validation/out/semanticPilot.drilldown.v0.1.md", () => {
    const root = process.cwd();
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "semanticPilot.drilldown.v0.1.md");

    const train = readJson<Dataset>(path.join(root, "tests/validation/datasets/canonC2.train.v0.3.json"));
    const hold = readJson<Dataset>(path.join(root, "tests/validation/datasets/canonC2.holdout.v0.3.json"));
    const allCases = [...(train.cases || []), ...(hold.cases || [])].map((c) => ({
      id: String(c.id),
      word: String(c.word),
      ipa: typeof c.ipa === "string" ? c.ipa : undefined,
    }));

    // metas we drill (snapshots)
    const metas: Array<{ label: string; meta: Meta }> = [
      {
        label: "corpus70.meta.v0.1.gemini-blind",
        meta: readJson<Meta>(path.join(root, "tests/research/corpus70.meta.v0.1.gemini.json")),
      },
      {
        label: "corpus70.meta.v0.1.autotag",
        meta: readJson<Meta>(path.join(root, "tests/research/corpus70.meta.v0.1.autotag.json")),
      },
    ];

    // build rows (mask + carrier derived from SSOT extractors)
    const rows: Row[] = allCases
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((c) => {
        const ortho = extractOrthographyVoicesFromWordV0_1({ word: c.word });
        const maskVoices = arr(ortho.voices);
        const carrierVoices = c.ipa ? arr(extractCarrierVoicesFromIpaV0_1(c.ipa).voices) : [];
        const maskP = primaryOf(maskVoices);
        const carrierP = primaryOf(carrierVoices);
        return {
          id: c.id,
          word: c.word,
          tags: [],
          maskVoices,
          carrierVoices,
          maskP,
          carrierP,
          status: statusOf(maskVoices, carrierVoices),
        };
      });

    const P_THRESH = 0.10;
    const ITERS = 2000;

    const lines: string[] = [];
    lines.push("# Semantic Pilot drilldown v0.1 — Low-p tag microscope");
    lines.push("");
    lines.push(`- p-threshold: **<= ${P_THRESH.toFixed(2)}**`);
    lines.push(`- permutation iters: ${ITERS}`);
    lines.push("");

    for (const { label, meta } of metas) {
      // attach tags from meta
      const tagMap = meta.tags || {};
      for (const r of rows) r.tags = Array.isArray(tagMap[r.id]) ? tagMap[r.id].map(String) : [];

      const allowedTags = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
      const compare = computeCompare(rows, allowedTags, ITERS, 12345);

      const low = compare.filter((x) => x.carrierN > 0 && x.p <= P_THRESH);

      lines.push(`## Meta: ${label}`);
      lines.push("");

      if (!low.length) {
        lines.push("_No tags met the low-p threshold._");
        lines.push("");
        continue;
      }

      for (const t of low) {
        lines.push(`### Tag: ${t.tag} (p=${t.p.toFixed(3)})`);
        lines.push("");
        lines.push("| ID | Word | Tags | Mask voices | Carrier voices | Mask P | Carrier P | Status |");
        lines.push("|---:|------|------|------------|---------------|--------|-----------|--------|");

        for (const r of rows) {
          if (!r.tags.includes(t.tag)) continue;
          const tagsS = r.tags.join(", ");
          const maskS = r.maskVoices.join(" ");
          const carS = r.carrierVoices.join(" ");
          lines.push(
            `| ${r.id} | **${r.word}** | ${tagsS} | ${maskS || "-"} | ${carS || "-"} | ${r.maskP} | ${r.carrierP} | ${r.status} |`
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
