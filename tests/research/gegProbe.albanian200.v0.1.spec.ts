import fs from "fs";
import path from "path";
import { applySchwaDropV0_1 } from "./ipaTransforms/schwaDrop.v0.1";

import { extractOrthographyVoicesFromWordV0_1 } from "@/shared/vowels/extractOrthographyVoicesFromWord.v0.1";
import { extractCarrierVoicesFromIpaV0_1 } from "@/shared/vowels/extractCarrierVoicesFromIpa.v0.1";


// Gegë Probe Albanian200 v0.1 — "Ë-drop" diagnostic (SIMULATED)
// IMPORTANT: This is not a claim about real Gegë IPA.
// It is a controlled perturbation to test whether schwa-heavy prefixes (për-) are causing carrierP washout.

type Vowel = "A" | "E" | "I" | "O" | "U" | "Y" | "Ë" | "NONE";

type Row = {
  id: string;
  word: string;
  ipa: string;
  tag: string;
  anchor: string;
  anchorIpa: string;
};

type Item = Row & {
  maskVoices: string[];
  carrierVoices: string[];
  anchorVoices: string[];
  maskP: Vowel;
  carrierP: Vowel;
  anchorP: Vowel;
  retains: boolean;
  status: "SYNC" | "DIVERGE" | "NO_PHONETIC";
};

function arr(x: unknown): string[] {
  return Array.isArray(x) ? x.map(String) : [];
}
function primaryOf(vs: string[]): Vowel {
  const v = (vs[0] ?? "NONE") as Vowel;
  return (v === "A" || v === "E" || v === "I" || v === "O" || v === "U" || v === "Y" || v === "Ë") ? v : "NONE";
}
function statusOf(mask: string[], carrier: string[]): "SYNC" | "DIVERGE" | "NO_PHONETIC" {
  if (!carrier.length) return "NO_PHONETIC";
  return primaryOf(mask) === primaryOf(carrier) ? "SYNC" : "DIVERGE";
}

// deterministic PRNG
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

// p(count(matches)>=obs) under permutation of carrierP labels within the tag bucket (anchors fixed)
function matchPvalue(items: Item[], iters: number, seed: number) {
  const usable = items.filter((x) => x.carrierP !== "NONE" && x.anchorP !== "NONE");
  const obs = usable.filter((x) => x.carrierP === x.anchorP).length;
  const n = usable.length;
  if (!n) return { n: 0, obs: 0, p: 1 };

  const anchors = usable.map((x) => x.anchorP);
  const carriers = usable.map((x) => x.carrierP);

  const rnd = mulberry32(seed);
  let ge = 0;
  for (let k = 0; k < iters; k++) {
    const tmp = carriers.slice();
    shuffleInPlace(tmp, rnd);
    let m = 0;
    for (let i = 0; i < tmp.length; i++) if (tmp[i] === anchors[i]) m++;
    if (m >= obs) ge++;
  }
  return { n, obs, p: ge / iters };
}

function parseFile(text: string): Row[] {
  const out: Row[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const m = line.match(/^(\S+)\s+(\S+)\s+(\/.*\/|\S+)\s+(\S+)\s+(\S+)\s+(\/.*\/|\S+)\s*$/u);
    if (!m) continue;
    out.push({ id: m[1], word: m[2], ipa: m[3], tag: m[4], anchor: m[5], anchorIpa: m[6] });
  }
  return out;
}

function buildItems(rows: Row[]): Item[] {
  return rows.map((r) => {
    const maskOut = extractOrthographyVoicesFromWordV0_1({ word: r.word, langHint: "sq" });
    const maskVoices = arr(maskOut?.voices);

    const carOut = extractCarrierVoicesFromIpaV0_1(r.ipa);
    const carrierVoices = arr((carOut as any)?.voices);

    const ancOut = extractCarrierVoicesFromIpaV0_1(r.anchorIpa);
    const anchorVoices = arr((ancOut as any)?.voices);

    const maskP = primaryOf(maskVoices);
    const carrierP = primaryOf(carrierVoices);
    const anchorP = primaryOf(anchorVoices);

    return {
      ...r,
      maskVoices,
      carrierVoices,
      anchorVoices,
      maskP,
      carrierP,
      anchorP,
      retains: carrierP !== "NONE" && anchorP !== "NONE" && carrierP === anchorP,
      status: statusOf(maskVoices, carrierVoices),
    };
  });
}

function fmt(x: { obs: number; p: number }) {
  return `${x.obs}/${x.p === 0 ? "<0.001" : x.p.toFixed(3)}`;
}
function pct(x: number) {
  return (x * 100).toFixed(1) + "%";
}
function retentionRate(items: Item[]) {
  const usable = items.filter((x) => x.carrierP !== "NONE" && x.anchorP !== "NONE");
  return usable.length ? usable.filter((x) => x.retains).length / usable.length : 0;
}

describe("Gegë Probe Albanian200 v0.1 — Ë-drop diagnostic (simulated, v0.2 anchored)", () => {
  it("writes tests/validation/out/gegProbe.albanian200.v0.1.md", () => {
    const root = process.cwd();

    const toskPath = "tests/research/albanian200.compoundStress.v0.2.txt";
    const gegPath = "tests/research/albanian200.gegProbe.v0.1.txt";
    const outDir = "tests/validation/out";
    const outMd = "tests/validation/out/gegProbe.albanian200.v0.1.md";

    if (!fs.existsSync(toskPath)) throw new Error("Missing: " + toskPath);
    if (!fs.existsSync(gegPath)) throw new Error("Missing: " + gegPath);

    const toskRows = parseFile(fs.readFileSync(toskPath, "utf8"));
    const gegRows = parseFile(fs.readFileSync(gegPath, "utf8"));

    if (toskRows.length !== 28) throw new Error(`Expected 28 rows in v0.2 stress file, got ${toskRows.length}`);
    if (gegRows.length !== 28) throw new Error(`Expected 28 rows in gegProbe file, got ${gegRows.length}`);

    // ensure id alignment (strict)
    const a = toskRows.map((r) => r.id).join("|");
    const b = gegRows.map((r) => r.id).join("|");
    if (a !== b) throw new Error("Row IDs mismatch between v0.2 and gegProbe datasets");

    const tosk = buildItems(toskRows);
    const geg = buildItems(gegRows);

    const noCarrierT = tosk.filter((x) => x.carrierP === "NONE").length;
    const noCarrierG = geg.filter((x) => x.carrierP === "NONE").length;
    if (noCarrierT || noCarrierG) throw new Error(`Expected 0 NO_PHONETIC. tosk=${noCarrierT} geg=${noCarrierG}`);

    const tags = Array.from(new Set(tosk.map((x) => x.tag))).sort();

    const ITERS = 4000;
    const SEED = 90920031;

    fs.mkdirSync(outDir, { recursive: true });

    const lines: string[] = [];
    lines.push("# Gegë Probe Albanian200 v0.1 — Ë-drop diagnostic (simulated)");
    lines.push("");
    lines.push("- Purpose: test whether schwa-heavy morphology (notably për-/përë-) causes carrierP washout vs anchor roots.");
    lines.push("- Inputs:");
    lines.push("  - Tosk-anchored: `" + toskPath + "` (" + toskRows.length + ")");
    lines.push("  - Geg-sim (Ë-drop rules): `" + gegPath + "` (" + gegRows.length + ")");
    lines.push("- Method:");
    lines.push("  - Compare retention: carrierP(compound) == carrierP(anchor) (anchor IPA provided per-row).");
    lines.push("  - Permutation p-values: shuffle compound carrierP labels within tag bucket (anchors fixed).");
    lines.push("");

    lines.push("## Retention by tag (Tosk vs Geg-sim)");
    lines.push("");
    lines.push("| Tag | N | Tosk retain% | Tosk matches/p | Geg retain% | Geg matches/p | Δ retain |");
    lines.push("|-----|--:|-------------:|----------------|------------:|--------------|---------:|");

    for (const tag of tags) {
      const t = tosk.filter((x) => x.tag === tag);
      const g = geg.filter((x) => x.tag === tag);
      const pvT = matchPvalue(t, ITERS, (SEED ^ 0xA11CE) >>> 0);
      const pvG = matchPvalue(g, ITERS, (SEED ^ 0x0D3D3) >>> 0);
      const rt = retentionRate(t);
      const rg = retentionRate(g);
      lines.push(`| ${tag} | ${t.length} | ${pct(rt)} | ${fmt(pvT)} | ${pct(rg)} | ${fmt(pvG)} | ${pct(rg - rt)} |`);
    }

    // per-row diff (only where something changes)
    const diffs = tosk.map((t, i) => {
      const g = geg[i];
      return {
        id: t.id,
        word: t.word,
        tag: t.tag,
        toskCarrierP: t.carrierP,
        toskAnchorP: t.anchorP,
        toskRetains: t.retains,
        gegCarrierP: g.carrierP,
        gegAnchorP: g.anchorP,
        gegRetains: g.retains,
        ipaT: t.ipa,
        ipaG: g.ipa,
        anchor: t.anchor,
        anchorIpaT: t.anchorIpa,
        anchorIpaG: g.anchorIpa,
      };
    }).filter((d) =>
      d.toskCarrierP !== d.gegCarrierP || d.toskRetains !== d.gegRetains || d.anchorIpaT !== d.anchorIpaG
    );

    lines.push("");
    lines.push("## Delta cases (where Geg-sim changes carrierP or retention)");
    lines.push("");
    if (!diffs.length) {
      lines.push("_none_");
    } else {
      lines.push("| ID | Word | Tag | Tosk carrier/anchor | Tosk retains | Geg carrier/anchor | Geg retains | IPA (Tosk→Geg) |");
      lines.push("|---:|------|-----|---------------------|--------------|--------------------|------------|---------------|");
      for (const d of diffs) {
        lines.push(`| ${d.id} | **${d.word}** | ${d.tag} | ${d.toskCarrierP}/${d.toskAnchorP} | ${d.toskRetains ? "YES" : "NO"} | ${d.gegCarrierP}/${d.gegAnchorP} | ${d.gegRetains ? "YES" : "NO"} | \`${d.ipaT}\` → \`${d.ipaG}\` |`);
      }
    }

    lines.push("");
    lines.push("## Notes");
    lines.push("");
    lines.push("- This probe is *simulated* (Ë-drop heuristics), not a dialect claim.");
    lines.push("- If washout cases recover under Geg-sim, that supports the 'phonetic shield' hypothesis: prefix schwa dominates carrierP in standard/Tosk IPA.");

    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
