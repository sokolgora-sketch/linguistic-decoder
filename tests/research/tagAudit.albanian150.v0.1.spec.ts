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

function primaryOf(xs: string[]): string {
  return xs[0] ?? "NONE";
}

function pct(n: number, d: number): string {
  if (!d) return "0.0%";
  return ((n / d) * 100).toFixed(1) + "%";
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

function statusOf(mask: string[], carrier: string[]): "NO_PHONETIC" | "SYNC" | "DIVERGE" {
  if (carrier.length === 0) return "NO_PHONETIC";
  return arrEq(mask, carrier) ? "SYNC" : "DIVERGE";
}

function distByCarrierP(items: Item[]) {
  const m = new Map<string, number>();
  for (const it of items) {
    const k = String(it.carrierP);
    m.set(k, (m.get(k) ?? 0) + 1);
  }
  const keys = Array.from(m.keys()).sort();
  return { map: m, keys };
}

function fmtDist(items: Item[]) {
  const { map, keys } = distByCarrierP(items);
  const parts: string[] = [];
  for (const k of keys) parts.push(`${k}:${map.get(k) ?? 0}`);
  return parts.join(", ");
}

describe("Tag Audit Albanian150 v0.1 — tag pollution + carrier distributions", () => {
  it("writes tests/validation/out/tagAudit.albanian150.v0.1.md", () => {
    const root = process.cwd();

    const wordsPath = path.join(root, "tests/research/albanian150.words.v0.1.txt");
    const metaPath = path.join(root, "tests/research/albanian150.meta.v0.1.mixed.json");
    const outDir = path.join(root, "tests/validation/out");
    const outMd = path.join(outDir, "tagAudit.albanian150.v0.1.md");

    if (!fs.existsSync(wordsPath)) throw new Error(`Missing: ${wordsPath}`);
    if (!fs.existsSync(metaPath)) throw new Error(`Missing: ${metaPath}`);

    const words = parseWordsFile(fs.readFileSync(wordsPath, "utf8"));
    if (words.length !== 150) throw new Error(`Expected 150 words, got ${words.length}`);

    const meta = readJson<Meta>(metaPath);
    const allowedTags = Array.isArray(meta.allowedTags) ? meta.allowedTags.map(String) : [];
    if (!allowedTags.length) throw new Error("Meta.allowedTags missing/empty");
    const tagMap = meta.tags && typeof meta.tags === "object" ? meta.tags : {};

    const items: Item[] = words.map((w) => {
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

    const noCarrier = items.filter((x) => x.carrierVoices.length === 0).length;
    if (noCarrier) throw new Error(`Expected 0 NO_PHONETIC in Albanian150, got ${noCarrier}`);

    const multiTagged = items.filter((x) => x.tags.length > 1);
    const diverge = items.filter((x) => x.status === "DIVERGE");

    const lines: string[] = [];
    lines.push("# Tag Audit Albanian150 v0.1");
    lines.push("");
    lines.push("- Purpose: identify tag pollution (carrierP spread) before Albanian200.");
    lines.push(`- corpus: \`tests/research/albanian150.words.v0.1.txt\` (150)`);
    lines.push(`- meta: \`${String(meta.version ?? "unknown")}\``);
    lines.push(`- allowedTags: ${allowedTags.join(", ")}`);
    lines.push("");

    lines.push("## Global sanity");
    lines.push("");
    lines.push(`- multi-tagged items: **${multiTagged.length}**`);
    lines.push(`- DIVERGE items: **${diverge.length}**`);
    lines.push("");

    if (multiTagged.length) {
      lines.push("### Multi-tagged items");
      lines.push("");
      lines.push("| ID | Word | Tags | CarrierP | Carrier | Status |");
      lines.push("|---:|------|------|----------|---------|--------|");
      for (const r of multiTagged.slice().sort((a, b) => a.id.localeCompare(b.id))) {
        lines.push(`| ${r.id} | **${r.word}** | ${r.tags.join(", ")} | ${r.carrierP} | ${r.carrierVoices.join(" ") || "-"} | ${r.status} |`);
      }
      lines.push("");
    }

    if (diverge.length) {
      lines.push("### DIVERGE items");
      lines.push("");
      lines.push("| ID | Word | Tags | Mask | Carrier | MaskP | CarrierP |");
      lines.push("|---:|------|------|------|---------|-------|----------|");
      for (const r of diverge.slice().sort((a, b) => a.id.localeCompare(b.id))) {
        lines.push(`| ${r.id} | **${r.word}** | ${r.tags.join(", ") || "-"} | ${r.maskVoices.join(" ") || "-"} | ${r.carrierVoices.join(" ") || "-"} | ${r.maskP} | ${r.carrierP} |`);
      }
      lines.push("");
    }

    lines.push("## Per-tag carrierP distribution");
    lines.push("");
    lines.push("| Tag | N | CarrierP dist | Top carrierP | Top% | A-share | Diverge% |");
    lines.push("|-----|---:|--------------|--------------|-----:|--------:|---------:|");

    for (const tag of allowedTags) {
      const xs = items.filter((x) => x.tags.includes(tag));
      const n = xs.length;
      const dist = distByCarrierP(xs);
      let top = "NONE";
      let topN = 0;
      for (const k of dist.keys) {
        const c = dist.map.get(k) ?? 0;
        if (c > topN) { topN = c; top = k; }
      }
      const aShare = n ? (dist.map.get("A") ?? 0) / n : 0;
      const divN = xs.filter((x) => x.status === "DIVERGE").length;
      const divPct = n ? divN / n : 0;
      lines.push(`| ${tag} | ${n} | ${fmtDist(xs) || "-"} | **${top}** | ${(n ? (topN / n) * 100 : 0).toFixed(1)}% | ${(aShare * 100).toFixed(1)}% | ${(divPct * 100).toFixed(1)}% |`);
    }
    lines.push("");

    // Focus drilldowns for the weak tags
    const focus = ["cognition", "motion", "substance", "expression"];
    for (const tag of focus) {
      if (!allowedTags.includes(tag)) continue;
      const xs = items.filter((x) => x.tags.includes(tag)).slice();
      xs.sort((a, b) => a.carrierP.localeCompare(b.carrierP) || a.word.localeCompare(b.word) || a.id.localeCompare(b.id));

      lines.push(`## Drilldown — ${tag}`);
      lines.push("");
      lines.push("| ID | Word | IPA | CarrierP | Carrier | MaskP | Tags | Status |");
      lines.push("|---:|------|-----|----------|---------|-------|------|--------|");
      for (const r of xs) {
        lines.push(`| ${r.id} | **${r.word}** | ${r.ipa} | ${r.carrierP} | ${r.carrierVoices.join(" ") || "-"} | ${r.maskP} | ${r.tags.join(", ")} | ${r.status} |`);
      }
      lines.push("");
    }

    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outMd, lines.join("\n") + "\n", "utf8");
    expect(fs.existsSync(outMd)).toBe(true);
  });
});
