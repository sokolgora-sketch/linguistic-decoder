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

type Baseline = { version: string; cases: Record<string, any> };

function readJson<T>(p: string): T {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

function arr(x: any): string[] {
  return Array.isArray(x) ? x.map(String) : [];
}

function primaryOf(voices: string[]): string {
  return voices[0] ?? "NONE";
}

function pct(n: number, d: number): string {
  if (!d) return "0.0%";
  return ((n / d) * 100).toFixed(1) + "%";
}

function topPurity(counts: Map<string, number>) {
  const entries = [...counts.entries()].sort((a, b) => b[1] - a[1] || String(a[0]).localeCompare(String(b[0])));
  const top = entries[0] ?? ["NONE", 0];
  const total = entries.reduce((s, [, v]) => s + v, 0);
  return {
    topVowel: top[0],
    topCount: top[1],
    total,
    purity: total ? (top[1] / total) : 0,
    dist: entries.map(([k, v]) => `${k}:${v}`).join(", "),
  };
}

describe("Semantic Pilot v0.1 — tag → vowel association (Corpus70 v0.3)", () => {
  it("writes tests/validation/out/semanticPilot.v0.1.md", () => {
    const root = process.cwd();

    const trainPath = path.join(root, "tests/validation/datasets/canonC2.train.v0.3.json");
    const holdPath  = path.join(root, "tests/validation/datasets/canonC2.holdout.v0.3.json");
    const baselinePath = path.join(root, "tests/validation/baselines/canonC2.baseline.v0.3.json");

    const metaPath = path.join(root, "tests/research/corpus70.meta.v0.1.json");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "semanticPilot.v0.1.md");

    const train = readJson<Dataset>(trainPath);
    const hold  = readJson<Dataset>(holdPath);
    const baseline = readJson<Baseline>(baselinePath);
    const meta = readJson<Meta>(metaPath);

    const cases: CanonCase[] = [...(train.cases ?? []), ...(hold.cases ?? [])];
    if (cases.length !== 70) throw new Error(`Expected 70 cases; got ${cases.length}`);

    const allowed = new Set((meta.allowedTags ?? []).map(String));
    const ids = cases.map(c => String(c.id)).sort();

    // Ensure meta covers every id (even if empty arrays).
    for (const id of ids) {
      if (!(id in (meta.tags ?? {}))) throw new Error(`Meta missing id: ${id}`);
      const ts = meta.tags[id];
      if (!Array.isArray(ts)) throw new Error(`Meta tags for ${id} must be an array`);
      for (const t of ts) {
        if (!allowed.has(String(t))) throw new Error(`Disallowed tag "${t}" on ${id}`);
      }
      if (ts.length > 2) throw new Error(`Too many tags on ${id} (max 2)`);
    }

    // Aggregate per tag:
    // - maskPrimary (orthography primary)
    // - carrierPrimary (IPA primary) [only when IPA exists + yields voices]
    // - divergence stats (only when carrier exists)
    type TagAgg = {
      n: number;
      maskCounts: Map<string, number>;
      carrierCounts: Map<string, number>;
      carrierN: number;
      divergeN: number;
      syncN: number;
      noPhoneticN: number;
    };

    const tagAgg = new Map<string, TagAgg>();

    function bump(map: Map<string, number>, k: string) {
      map.set(k, (map.get(k) ?? 0) + 1);
    }

    for (const c of cases) {
      const id = String(c.id);
      const word = String(c.word);

      const ortho = extractOrthographyVoicesFromWordV0_1({ word }).voices.map(String);
      const maskPrimary = primaryOf(ortho);

      const ipa = (c as any).ipa;
      const carrier = typeof ipa === "string" ? extractCarrierVoicesFromIpaV0_1(ipa).voices.map(String) : [];
      const hasCarrier = carrier.length > 0;
      const carrierPrimary = primaryOf(carrier);

      const tags = meta.tags[id] ?? [];
      for (const t of tags) {
        const tag = String(t);
        if (!tagAgg.has(tag)) {
          tagAgg.set(tag, {
            n: 0,
            maskCounts: new Map(),
            carrierCounts: new Map(),
            carrierN: 0,
            divergeN: 0,
            syncN: 0,
            noPhoneticN: 0,
          });
        }
        const agg = tagAgg.get(tag)!;
        agg.n += 1;
        bump(agg.maskCounts, maskPrimary);

        if (!hasCarrier) {
          agg.noPhoneticN += 1;
        } else {
          agg.carrierN += 1;
          bump(agg.carrierCounts, carrierPrimary);

          const same = ortho.join(" ") === carrier.join(" ");
          if (same) agg.syncN += 1;
          else agg.divergeN += 1;
        }
      }
    }

    const tagsSorted = [...tagAgg.keys()].sort((a, b) => a.localeCompare(b));

    const lines: string[] = [];
    lines.push("# Semantic Pilot v0.1 — Tag ↔ Vowel Purity (Corpus70 v0.3)");
    lines.push("");
    lines.push("This is a coarse, falsifiable pilot: do semantic tags concentrate into specific vowel primaries?");
    lines.push("");
    lines.push("## Tag table");
    lines.push("");
    lines.push("| Tag | N | Mask top (purity) | Mask dist | Carrier N | Carrier top (purity) | Carrier dist | Diverge rate (carrier) |");
    lines.push("|-----|---:|------------------|-----------|----------:|----------------------|--------------|------------------------|");

    for (const tag of tagsSorted) {
      const agg = tagAgg.get(tag)!;

      const mask = topPurity(agg.maskCounts);
      const car  = topPurity(agg.carrierCounts);

      const divergeRate = agg.carrierN ? `${pct(agg.divergeN, agg.carrierN)} (${agg.divergeN}/${agg.carrierN})` : "-";
      const maskTop = `${mask.topVowel} (${pct(mask.topCount, mask.total)})`;
      const carTop  = agg.carrierN ? `${car.topVowel} (${pct(car.topCount, car.total)})` : "-";

      lines.push(
        `| ${tag} | ${agg.n} | **${maskTop}** | ${mask.dist || "-"} | ${agg.carrierN} | **${carTop}** | ${car.dist || "-"} | ${divergeRate} |`
      );
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
